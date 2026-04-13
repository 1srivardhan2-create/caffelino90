const Cafe = require("../models/Cafe/Cafe_login");

// ─── Approve a Cafe ──────────────────────────────────────────────
const approveCafe = async (req, res) => {
    const cafe = await Cafe.findByIdAndUpdate(
        req.params.id,
        { status: true },
        { new: true }
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

module.exports = { approveCafe, getPendingCafes, getCouponStats };
