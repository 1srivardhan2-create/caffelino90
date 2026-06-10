const express = require("express");
const router = express.Router();
const { 
    approveCafe, 
    getPendingCafes, 
    getCouponStats,
    getAdminStats,
    getAdminUsers,
    blockUser,
    deleteFeedback,
    deleteMeetup
} = require("../controllers/admin.controller");

// Approve a pending cafe by ID
router.put("/approve-cafe/:id", approveCafe);

// Get list of unapproved cafes
router.get("/get/cafe", getPendingCafes);

// Get coupon statistics
router.get("/coupon-stats", getCouponStats);

// Expose Stats & Management endpoints
router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.delete("/users/:id", blockUser);
router.delete("/feedback/:id", deleteFeedback);
router.delete("/meetups/:id", deleteMeetup);

module.exports = router;
