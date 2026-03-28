const express = require("express");
const router = express.Router();
const Notification = require("../models/User/Notification");

// GET /api/notifications/:userId - Get notifications for a user
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50); // limit to recent 50
        
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
});

// POST /api/notifications - Create a notification
router.post("/", async (req, res) => {
    try {
        const { userId, type, message, orderId, metadata } = req.body;
        if (!userId || !message) {
            return res.status(400).json({ success: false, message: "userId and message are required" });
        }
        const notification = await Notification.create({
            userId,
            type: type || "BILL",
            message,
            orderId: orderId || null,
            metadata: metadata || null,
            isRead: false,
        });
        res.status(201).json({ success: true, notification });
    } catch (error) {
        console.error("Create notification error:", error);
        res.status(500).json({ success: false, message: "Failed to create notification" });
    }
});

module.exports = router;
