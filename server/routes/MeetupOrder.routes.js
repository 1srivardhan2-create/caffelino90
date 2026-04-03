const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const MeetupOrder = require("../models/Meetup/MeetupOrder");
const Cafe = require("../models/Cafe/Cafe_login");
const Earning = require("../models/Cafe/Earning");
const DeletedOrder = require("../models/Cafe/DeletedOrder");
const CafeOrder = require("../models/Cafe/CafeOrder");

// Helper to get order query by ID or orderId
const getOrderQuery = (id) => {
    const mongoose = require("mongoose");
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { $or: [{ _id: id }, { orderId: id }] };
    }
    return { orderId: id };
};

// ─── Get Single Order ──────────────────────────────────────────
// GET /api/meetup-orders/:id
router.get("/:id", async (req, res) => {
    try {
        const query = getOrderQuery(req.params.id);
        const order = await MeetupOrder.findOne(query).lean();
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, order });
    } catch (error) {
        console.error("Get Order Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch order", error: error.message });
    }
});

// ─── Create Order ──────────────────────────────────────────────
// POST /api/meetup-orders
router.post("/", async (req, res) => {
    try {
        const payload = req.body;
        // Also set the Object ID references for the Owner Portal
        if (payload.cafeId) {
            payload.cafe = payload.cafeId;
        }
        
        // The Owner Portal requires a 'user' ObjectId field to populate customer details
        if (payload.userId && mongoose.isValidObjectId(payload.userId)) {
            payload.user = payload.userId;
        }

        // The Owner Portal requires a 'menuItem' ObjectId field on each item to display names
        if (payload.items && Array.isArray(payload.items)) {
            payload.items = payload.items.map(item => {
                if (item.menuItemId && mongoose.isValidObjectId(item.menuItemId)) {
                    item.menuItem = item.menuItemId;
                }
                return item;
            });
        }

        // If an orderId exists, try to update it instead of creating duplicates
        if (payload.orderId) {
            const existingOrder = await MeetupOrder.findOne({ orderId: payload.orderId });

            // Strict Validation: Prevent editing if order is already locked/paid
            if (existingOrder && (existingOrder.tokenPaid || existingOrder.status === 'ACCEPTED' || existingOrder.status === 'COMPLETED' || existingOrder.paymentStatus === 'PAID')) {
                console.warn(`🔒 Unauthorized edit attempt on locked order: ${payload.orderId}`);
                return res.status(403).json({ success: false, message: "⚠️ Order is locked and cannot be edited." });
            }

            if (existingOrder && (existingOrder.status === 'confirmed')) {
                payload.status = 'ACCEPTED';
                if (!payload.orderStatus) payload.orderStatus = 'ACCEPTED';
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
        
        const { tokenAmount, items, subtotal, cgst, sgst, totalAmount } = req.body;
        
        let updateData = { 
            status: "ACCEPTED", 
            orderStatus: "ACCEPTED", 
            paymentStatus: "PAID", 
            tokenPaid: true, 
            tokenAmount: tokenAmount || 20 
        };

        // If the frontend sends the latest bill details, update them
        if (items && Array.isArray(items)) {
            updateData.items = items.map(item => {
                if (item.menuItemId && mongoose.isValidObjectId(item.menuItemId)) {
                    item.menuItem = item.menuItemId;
                }
                return item;
            });
        }
        if (subtotal !== undefined) updateData.subtotal = subtotal;
        if (cgst !== undefined) updateData.cgst = cgst;
        if (sgst !== undefined) updateData.sgst = sgst;
        if (totalAmount !== undefined) {
            updateData.totalAmount = totalAmount;
            updateData.total = totalAmount;
        }

        const order = await MeetupOrder.findOneAndUpdate(
            query,
            updateData,
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });

        // ─── Save to CafeOrders collection (persistent bill with cafeName) ───
        try {
            // Try to get cafeName from the order or look it up
            let cafeName = order.cafeName || "";
            if (!cafeName && order.cafeId) {
                const cafe = await Cafe.findOne({
                    $or: [
                        ...(mongoose.Types.ObjectId.isValid(order.cafeId) ? [{ _id: order.cafeId }] : []),
                        { ownerId: order.cafeId }
                    ]
                }).lean();
                if (cafe) cafeName = cafe.Name || "";
            }

            await CafeOrder.findOneAndUpdate(
                { orderId: order.orderId || order._id.toString() },
                {
                    $set: {
                        orderId: order.orderId || order._id.toString(),
                        cafeId: order.cafeId || "",
                        cafeName: cafeName,
                        userId: order.userId || "",
                        userName: order.userName || "",
                        meetupId: order.meetupId?.toString() || "",
                        items: (order.items || []).map(i => ({
                            name: i.name,
                            price: i.price,
                            quantity: i.quantity || 1,
                            menuItemId: i.menuItemId || "",
                        })),
                        subtotal: order.subtotal || 0,
                        cgst: order.cgst || 0,
                        sgst: order.sgst || 0,
                        total: order.total || order.totalAmount || 0,
                        tokenPaid: true,
                        tokenAmount: order.tokenAmount || 20,
                        status: "ACCEPTED",
                        paymentStatus: "PAID",
                        paymentMethod: "online",
                    }
                },
                { upsert: true, new: true }
            );
            console.log(`📋 CafeOrder saved for order: ${order.orderId || order._id}`);
        } catch (cafeOrderErr) {
            console.error("Failed to save CafeOrder:", cafeOrderErr.message);
        }

        // Emit via socket if available
        if (req.io) {
            req.io.to(`cafe_${order.cafeId}`).emit("order-status-update", {
                orderId: order.orderId || order._id.toString(),
                status: "ACCEPTED",
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

        // ─── Save/Update CafeOrder for cash-collected ───
        try {
            let cafeName = order.cafeName || "";
            if (!cafeName && order.cafeId) {
                const cafe = await Cafe.findOne({
                    $or: [
                        ...(mongoose.Types.ObjectId.isValid(order.cafeId) ? [{ _id: order.cafeId }] : []),
                        { ownerId: order.cafeId }
                    ]
                }).lean();
                if (cafe) cafeName = cafe.Name || "";
            }

            await CafeOrder.findOneAndUpdate(
                { orderId: order.orderId || order._id.toString() },
                {
                    $set: {
                        orderId: order.orderId || order._id.toString(),
                        cafeId: order.cafeId || "",
                        cafeName: cafeName,
                        userId: order.userId || "",
                        userName: order.userName || "",
                        meetupId: order.meetupId?.toString() || "",
                        items: (order.items || []).map(i => ({
                            name: i.name,
                            price: i.price,
                            quantity: i.quantity || 1,
                            menuItemId: i.menuItemId || "",
                        })),
                        subtotal: order.subtotal || 0,
                        cgst: order.cgst || 0,
                        sgst: order.sgst || 0,
                        total: order.total || order.totalAmount || 0,
                        tokenPaid: order.tokenPaid || false,
                        tokenAmount: order.tokenAmount || 0,
                        status: "COMPLETED",
                        paymentStatus: "PAID",
                        paymentMethod: "cash",
                    }
                },
                { upsert: true, new: true }
            );
            console.log(`📋 CafeOrder saved (cash) for order: ${order.orderId || order._id}`);
        } catch (cafeOrderErr) {
            console.error("Failed to save CafeOrder (cash):", cafeOrderErr.message);
        }

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
