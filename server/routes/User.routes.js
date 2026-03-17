const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Cafe/Cafe_orders");
const CafeMenu = require("../models/Cafe/cafe_menu");

// ─── Place Order (with MongoDB Transaction) ─────────────────────
// POST /api/user/order
const placeOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, cafeId, items } = req.body;

        // Validate items and calculate total from DB prices (prevents price manipulation)
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            // Validate each item: must exist, belong to the cafe, and be available
            const menuItem = await CafeMenu.findOne({
                _id: item.menuItem,
                cafe_owner: cafeId,
                available: true,
            }).session(session);

            if (!menuItem) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    message: `Menu item not found or unavailable: ${item.menuItem}`,
                });
            }

            orderItems.push({
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price, // Price from DB, not from client
            });

            totalAmount += menuItem.price * item.quantity;
        }

        // Create the order within the transaction
        const order = await Order.create(
            [
                {
                    cafe: cafeId,
                    user: userId,
                    items: orderItems,
                    totalAmount,
                    orderStatus: "PLACED",
                    paymentStatus: "PENDING",
                },
            ],
            { session }
        );

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Order placed successfully",
            order: order[0],
        });
    } catch (error) {
        // Abort on any error
        await session.abortTransaction();
        session.endSession();
        console.error("Place Order Error:", error);
        res.status(500).json({ message: "Server error during order placement" });
    }
};

// ─── Get User's Order History ────────────────────────────────────
// GET /api/user/myorders
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ user: userId })
            .populate("cafe", "Name Cafe_Address")
            .populate("items.menuItem", "item_name price")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const { updateProfile } = require("../controllers/user.controller");

// ─── Route Definitions ──────────────────────────────────────────
router.post("/orders", placeOrder);
router.get("/myorders/:userId", getUserOrders);
router.put("/profile/:userId", updateProfile);

module.exports = router;
