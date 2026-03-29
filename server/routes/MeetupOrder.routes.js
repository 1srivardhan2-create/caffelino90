const express = require("express");
const router = express.Router();
const MeetupOrder = require("../models/Meetup/MeetupOrder");
const Cafe = require("../models/Cafe/Cafe_login");
const Earning = require("../models/Cafe/Earning");
const DeletedOrder = require("../models/Cafe/DeletedOrder");

// Helper to get order query by ID or orderId
const getOrderQuery = (id) => {
    const mongoose = require("mongoose");
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { $or: [{ _id: id }, { orderId: id }] };
    }
    return { orderId: id };
};

// ─── Create Order ──────────────────────────────────────────────
// POST /api/meetup-orders
router.post("/", async (req, res) => {
    try {
        const payload = req.body;
        
        // If an orderId exists, try to update it instead of creating duplicates
        if (payload.orderId) {
            // Check existing order to preserve token_paid status
            const existingOrder = await MeetupOrder.findOne({ orderId: payload.orderId });
            if (existingOrder && existingOrder.status === 'confirmed') {
                payload.status = 'confirmed';
                if (!payload.orderStatus) payload.orderStatus = 'confirmed';
            }
            
            const order = await MeetupOrder.findOneAndUpdate(
                { orderId: payload.orderId },
                { $set: payload },
                { new: true, upsert: true }
            );
            console.log(`📦 Upserted MeetupOrder: ${order.orderId || order._id}`);
            return res.status(200).json({ success: true, order });
        }

        const order = await MeetupOrder.create(payload);
        console.log(`📦 New MeetupOrder created: ${order.orderId || order._id}`);
        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error("Create/Update Order Error:", error);
        res.status(500).json({ message: "Failed to create or update order", error: error.message });
    }
});

// ─── Token Payment ─────────────────────────────────────────────
// PATCH /api/meetup-orders/:id/token-paid
router.patch("/:id/token-paid", async (req, res) => {
    try {
        const query = getOrderQuery(req.params.id);
        const order = await MeetupOrder.findOneAndUpdate(
            query,
            { status: "confirmed", orderStatus: "confirmed", tokenPaid: true, tokenAmount: req.body.tokenAmount || 20 },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Emit via socket if available
        if (req.io) {
            req.io.to(`cafe_${order.cafeId}`).emit("order-status-update", {
                orderId: order.orderId || order._id.toString(),
                status: "confirmed",
            });
            // Emit refresh-orders to force dashboard update for this newly visible order
            req.io.to(`cafe_${order.cafeId}`).emit("refresh-orders");
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error("Token Payment Error:", error);
        res.status(500).json({ message: "Failed to update token payment", error: error.message });
    }
});

// ─── Accept Order ─────────────────────────────────────────────
// PATCH /api/meetup-orders/:id/accept
router.patch("/:id/accept", async (req, res) => {
    try {
        const query = getOrderQuery(req.params.id);
        const order = await MeetupOrder.findOneAndUpdate(
            query,
            { status: "ACCEPTED", orderStatus: "ACCEPTED" },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Emit via socket if available
        if (req.io) {
            req.io.to(`cafe_${order.cafeId}`).emit("order-status-update", {
                orderId: order.orderId || order._id.toString(),
                status: "ACCEPTED",
            });
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error("Accept Order Error:", error);
        res.status(500).json({ message: "Failed to accept order", error: error.message });
    }
});

// ─── Cash Collected → Complete Order + Save Earnings ──────────
// PATCH /api/meetup-orders/:id/cash-collected
router.patch("/:id/cash-collected", async (req, res) => {
    try {
        const query = getOrderQuery(req.params.id);
        const order = await MeetupOrder.findOneAndUpdate(
            query,
            { status: "COMPLETED", orderStatus: "COMPLETED", paymentStatus: "PAID" },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Save to earnings
        const earning = await Earning.create({
            cafeId: order.cafeId || "",
            orderId: order.orderId || order._id.toString(),
            amount: order.total || order.totalAmount || 0,
            paymentMethod: "cash",
            items: (order.items || []).map(i => ({
                name: i.name,
                price: i.price,
                quantity: i.quantity || 1,
            })),
            date: new Date(),
        });

        // Emit via socket
        if (req.io) {
            req.io.to(`cafe_${order.cafeId}`).emit("order-status-update", {
                orderId: order.orderId || order._id.toString(),
                status: "COMPLETED",
            });
        }

        console.log(`💰 Earning saved: ₹${order.total || order.totalAmount} for cafe ${order.cafeId}`);
        res.json({ success: true, order, earning });
    } catch (error) {
        console.error("Cash Collected Error:", error);
        res.status(500).json({ message: "Failed to complete order", error: error.message });
    }
});

// ─── Delete Order → Move to DeletedOrders ─────────────────────
// DELETE /api/meetup-orders/:id
router.delete("/:id", async (req, res) => {
    try {
        const query = getOrderQuery(req.params.id);
        const order = await MeetupOrder.findOne(query);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Copy to DeletedOrders
        await DeletedOrder.create({
            orderId: order.orderId || order._id.toString(),
            cafeId: order.cafeId || "",
            meetupId: order.meetupId?.toString() || "",
            userName: order.userName || "",
            items: (order.items || []).map(i => ({
                name: i.name,
                price: i.price,
                quantity: i.quantity || 1,
            })),
            total: order.total || 0,
            reason: req.body?.reason || "manual delete",
            deletedAt: new Date(),
        });

        // Remove from MeetupOrder
        await MeetupOrder.findOneAndDelete(query);

        // Emit via socket
        if (req.io) {
            req.io.to(`cafe_${order.cafeId}`).emit("order-deleted", {
                orderId: order._id.toString(),
            });
        }

        console.log(`🗑 Order ${order._id} deleted and moved to DeletedOrders`);
        res.json({ success: true, message: "Order deleted" });
    } catch (error) {
        console.error("Delete Order Error:", error);
        res.status(500).json({ message: "Failed to delete order", error: error.message });
    }
});

// ─── Get Earnings for a Cafe ──────────────────────────────────
// GET /api/meetup-orders/earnings/:cafeId
router.get("/earnings/:cafeId", async (req, res) => {
    try {
        const { cafeId } = req.params;
        const mongoose = require("mongoose");
        const Cafe = require("../models/Cafe/Cafe_login");

        // Build possible cafeIds (same logic as getMeetupOrders)
        const possibleCafeIds = [cafeId];
        try {
            let cafe = null;
            if (mongoose.Types.ObjectId.isValid(cafeId)) {
                cafe = await Cafe.findById(cafeId).lean();
            }
            if (!cafe) {
                cafe = await Cafe.findOne({ ownerId: cafeId }).lean();
            }
            if (cafe) {
                if (cafe._id) possibleCafeIds.push(cafe._id.toString());
                if (cafe.ownerId) possibleCafeIds.push(cafe.ownerId);
            }
        } catch (e) { /* ignore */ }

        const uniqueCafeIds = [...new Set(possibleCafeIds)];

        const earnings = await Earning.find({ cafeId: { $in: uniqueCafeIds } })
            .sort({ createdAt: -1 })
            .lean();

        // Also fetch active orders that are ACCEPTED or token_paid which haven't been 'COMPLETED' (and thus not in Earning yet)
        const activeOrders = await MeetupOrder.find({ 
            cafeId: { $in: uniqueCafeIds },
            status: { $in: ["ACCEPTED", "token_paid"] }
        }).lean();

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let todayTotal = 0, weekTotal = 0, monthTotal = 0, allTimeTotal = 0;

        earnings.forEach(e => {
            const amt = e.amount || 0;
            const d = new Date(e.createdAt || e.date);
            allTimeTotal += amt;
            if (d >= startOfMonth) monthTotal += amt;
            if (d >= startOfWeek) weekTotal += amt;
            if (d >= startOfToday) todayTotal += amt;
        });

        // Add active orders to the totals and list
        const activeEarnings = activeOrders.map(order => ({
            _id: order._id,
            orderId: order.orderId,
            amount: order.total || order.totalAmount || 0,
            paymentMethod: "pending",
            status: order.status,
            userName: order.userName,
            items: order.items,
            createdAt: order.createdAt || order.orderDate,
            isPending: true
        }));

        activeEarnings.forEach(e => {
            const amt = e.amount || 0;
            const d = new Date(e.createdAt);
            allTimeTotal += amt;
            if (d >= startOfMonth) monthTotal += amt;
            if (d >= startOfWeek) weekTotal += amt;
            if (d >= startOfToday) todayTotal += amt;
        });

        const combinedEarnings = [...activeEarnings, ...earnings].sort((a, b) => 
            new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime()
        );

        res.json({
            success: true,
            summary: {
                today: parseFloat(todayTotal.toFixed(2)),
                week: parseFloat(weekTotal.toFixed(2)),
                month: parseFloat(monthTotal.toFixed(2)),
                allTime: parseFloat(allTimeTotal.toFixed(2)),
            },
            earnings: combinedEarnings,
        });
    } catch (error) {
        console.error("Get Earnings Error:", error);
        res.status(500).json({ message: "Failed to fetch earnings", error: error.message });
    }
});

// ─── Get Deleted Orders for a Cafe ────────────────────────────
// GET /api/meetup-orders/deleted/:cafeId
router.get("/deleted/:cafeId", async (req, res) => {
    try {
        const { cafeId } = req.params;
        const mongoose = require("mongoose");
        const Cafe = require("../models/Cafe/Cafe_login");

        const possibleCafeIds = [cafeId];
        try {
            let cafe = null;
            if (mongoose.Types.ObjectId.isValid(cafeId)) {
                cafe = await Cafe.findById(cafeId).lean();
            }
            if (!cafe) {
                cafe = await Cafe.findOne({ ownerId: cafeId }).lean();
            }
            if (cafe) {
                if (cafe._id) possibleCafeIds.push(cafe._id.toString());
                if (cafe.ownerId) possibleCafeIds.push(cafe.ownerId);
            }
        } catch (e) { /* ignore */ }

        const uniqueCafeIds = [...new Set(possibleCafeIds)];

        const deletedOrders = await DeletedOrder.find({ cafeId: { $in: uniqueCafeIds } })
            .sort({ deletedAt: -1 })
            .lean();

        res.json({ success: true, deletedOrders });
    } catch (error) {
        console.error("Get Deleted Orders Error:", error);
        res.status(500).json({ message: "Failed to fetch deleted orders", error: error.message });
    }
});

module.exports = router;
