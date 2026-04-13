const express = require("express");
const router = express.Router();
const { approveCafe, getPendingCafes, getCouponStats } = require("../controllers/admin.controller");

// PUT /api/admin/approve-cafe/:id — Approve a pending cafe by ID
router.put("/approve-cafe/:id", approveCafe);

// GET /api/admin/get/cafe — Get list of unapproved cafes
router.get("/get/cafe", getPendingCafes);

// GET /api/admin/coupon-stats — Get coupon statistics
router.get("/coupon-stats", getCouponStats);

module.exports = router;
