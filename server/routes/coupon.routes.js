const express = require("express");
const router = express.Router();
const {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    getAvailableCoupons,
    getCouponAnalytics
} = require("../controllers/coupon.controller");

router.get("/all", getAllCoupons);
router.post("/create", createCoupon);
router.get("/analytics", getCouponAnalytics);
router.get("/available/:cafeName", getAvailableCoupons);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

module.exports = router;
