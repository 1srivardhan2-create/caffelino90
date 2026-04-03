const express = require("express");
const router = express.Router();
const CafeOrder = require("../models/Cafe/CafeOrder");

// GET /api/cafe-orders — list all cafe orders (admin)
router.get("/", async (req, res) => {
    try {
        const orders = await CafeOrder.find()
            .sort({ createdAt: -1 })
            .limit(200)
            .lean();
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Get all CafeOrders error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch cafe orders" });
    }
});

// GET /api/cafe-orders/cafe/:cafeId — bills for a specific cafe
router.get("/cafe/:cafeId", async (req, res) => {
    try {
        const { cafeId } = req.params;
        const orders = await CafeOrder.find({ cafeId })
            .sort({ createdAt: -1 })
            .lean();
        res.json({ success: true, orders, count: orders.length });
    } catch (error) {
        console.error("Get CafeOrders by cafe error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch cafe orders" });
    }
});

// GET /api/cafe-orders/user/:userId — bills for a specific user
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await CafeOrder.find({ userId })
            .sort({ createdAt: -1 })
            .lean();
        res.json({ success: true, orders, count: orders.length });
    } catch (error) {
        console.error("Get CafeOrders by user error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch user cafe orders" });
    }
});

module.exports = router;
