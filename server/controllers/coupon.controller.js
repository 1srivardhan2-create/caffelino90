const Coupon = require("../models/Coupon");

// ─── ADMIN: Create Coupon ──────────────────────────────────────────────────
exports.createCoupon = async (req, res) => {
    try {
        const couponData = req.body;
        couponData.code = couponData.code.trim().toUpperCase();
        const newCoupon = new Coupon(couponData);
        await newCoupon.save();
        res.status(201).json({ success: true, coupon: newCoupon });
    } catch (error) {
        console.error("Create Coupon Error:", error);
        res.status(500).json({ success: false, message: "Failed to create coupon", error: error.message });
    }
};

// ─── ADMIN: Get All Coupons ────────────────────────────────────────────────
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ priority: -1, createdAt: -1 });
        res.status(200).json({ success: true, coupons });
    } catch (error) {
        console.error("Get All Coupons Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch coupons", error: error.message });
    }
};

// ─── ADMIN: Update Coupon ──────────────────────────────────────────────────
exports.updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.code) updateData.code = updateData.code.trim().toUpperCase();
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCoupon) return res.status(404).json({ success: false, message: "Coupon not found" });
        res.status(200).json({ success: true, coupon: updatedCoupon });
    } catch (error) {
        console.error("Update Coupon Error:", error);
        res.status(500).json({ success: false, message: "Failed to update coupon", error: error.message });
    }
};

// ─── ADMIN: Delete Coupon ──────────────────────────────────────────────────
exports.deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        if (!deletedCoupon) return res.status(404).json({ success: false, message: "Coupon not found" });
        res.status(200).json({ success: true, message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Delete Coupon Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete coupon", error: error.message });
    }
};

// ─── USER: Get Available Coupons for a Cafe ────────────────────────────────
exports.getAvailableCoupons = async (req, res) => {
    try {
        const { cafeName } = req.params;
        const now = new Date();
        
        // Find coupons that are active, not expired, and apply to either "ALL" or the specific cafe
        const query = {
            isActive: true,
            $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }]
        };
        
        const coupons = await Coupon.find(query).sort({ priority: -1, createdAt: -1 });
        
        const eligibleCoupons = coupons.filter(c => {
            if (!c.applicableCafes || c.applicableCafes.length === 0) return true; // Default to all if empty
            if (c.applicableCafes.includes("ALL")) return true;
            
            const lowerCafeName = String(cafeName).trim().toLowerCase();
            return c.applicableCafes.some(ac => lowerCafeName.includes(ac.trim().toLowerCase()) || ac.trim().toLowerCase().includes(lowerCafeName));
        }).map(c => {
            const doc = c.toObject();
            const lowerCafeName = String(cafeName).trim().toLowerCase();
            let effectiveMinOrder = doc.minOrder || 0;
            if (doc.minOrderRules && doc.minOrderRules.length > 0) {
                const rule = doc.minOrderRules.find(r => lowerCafeName.includes((r.cafe || "").trim().toLowerCase()));
                if (rule) {
                    effectiveMinOrder = rule.minOrder;
                }
            }
            return { ...doc, effectiveMinOrder };
        });
        
        res.status(200).json({ success: true, coupons: eligibleCoupons });
    } catch (error) {
        console.error("Get Available Coupons Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch available coupons", error: error.message });
    }
};

// ─── ADMIN: Get Analytics ──────────────────────────────────────────────────
exports.getCouponAnalytics = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        let totalUsage = 0;
        let totalSavings = 0;
        let totalRevenue = 0;
        
        coupons.forEach(c => {
            totalUsage += (c.usedCount || 0);
            totalSavings += (c.totalSavingsGiven || 0);
            totalRevenue += (c.revenueGenerated || 0);
        });
        
        const mostUsed = coupons.sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0))[0];
        
        res.status(200).json({
            success: true,
            analytics: {
                totalCoupons: coupons.length,
                totalUsage,
                totalSavings,
                totalRevenue,
                mostUsed: mostUsed ? { code: mostUsed.code, count: mostUsed.usedCount } : null
            }
        });
    } catch (error) {
        console.error("Get Coupon Analytics Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch analytics", error: error.message });
    }
};
