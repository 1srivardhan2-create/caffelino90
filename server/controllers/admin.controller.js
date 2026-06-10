const Cafe = require("../models/Cafe/Cafe_login");
const User = require("../models/User/User");
const Meetup = require("../models/Meetup/Meetup");
const Feedback = require("../models/Feedback");

// ─── Approve a Cafe ──────────────────────────────────────────────
const approveCafe = async (req, res) => {
    const cafe = await Cafe.findByIdAndUpdate(
        req.params.id,
        { status: true },
        { returnDocument: 'after' }
    );

    if (!cafe) {
        return res.status(404).json({ message: "Cafe not found" });
    }

    res.json({ message: "Cafe approved successfully" });
};

// ─── Get All Pending (Unapproved) Cafes ──────────────────────────
const getPendingCafes = async (req, res) => {
    const cafes = await Cafe.find({ status: false });
    res.json(cafes);
};

// ─── Get Coupon Stats ──────────────────────────
const getCouponStats = async (req, res) => {
    try {
        const Coupon = require("../models/Coupon");
        const coupon = await Coupon.findOne({ code: "CAFFELINO" });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.json({
            totalCoupons: coupon.maxUsage,
            used: coupon.usedCount,
            remaining: coupon.maxUsage - coupon.usedCount,
            users: coupon.usersUsed
        });
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ message: "Error fetching stats" });
    }
};

// ─── Get Administrative Stats ────────────────────────────────────
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const activeGroups = await Meetup.countDocuments();
        const totalFeedbacks = await Feedback.countDocuments();
        const approvedCafes = await Cafe.countDocuments({ status: true });
        const pendingCafes = await Cafe.countDocuments({ status: false });

        res.json({
            success: true,
            totalUsers,
            activeGroups,
            totalFeedbacks,
            approvedCafes,
            pendingCafes
        });
    } catch (err) {
        console.error("Error fetching admin stats:", err);
        res.status(500).json({ message: "Error fetching stats", error: err.message });
    }
};

// ─── Get All Users ───────────────────────────────────────────────
const getAdminUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (err) {
        console.error("Error fetching admin users:", err);
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

// ─── Block / Delete User ─────────────────────────────────────────
const blockUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ success: true, message: "User account deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
};

// ─── Delete Feedback ─────────────────────────────────────────────
const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }
        res.json({ success: true, message: "Feedback comment deleted successfully" });
    } catch (err) {
        console.error("Error deleting feedback:", err);
        res.status(500).json({ message: "Error deleting feedback", error: err.message });
    }
};

// ─── Delete / Close Meetup ───────────────────────────────────────
const deleteMeetup = async (req, res) => {
    try {
        const meetup = await Meetup.findByIdAndDelete(req.params.id);
        if (!meetup) {
            return res.status(404).json({ message: "Meetup not found" });
        }
        res.json({ success: true, message: "Meetup closed successfully" });
    } catch (err) {
        console.error("Error deleting meetup:", err);
        res.status(500).json({ message: "Error closing meetup", error: err.message });
    }
};

module.exports = { 
    approveCafe, 
    getPendingCafes, 
    getCouponStats,
    getAdminStats,
    getAdminUsers,
    blockUser,
    deleteFeedback,
    deleteMeetup
};
