const express = require("express");
const router = express.Router();

const {
    createMeetup,
    joinMeetup,
    getMeetupById,
    getMeetupByCode,
    getUserMeetups,
    getAllMeetups,
    countMeetups,
    sendMessage,
    leaveMeetup,
    getMessages,
    addCafesForVoting,
    voteCafe,
    selectCafe,
    getCafeMenu,
    placeOrder,
    getOrders,
    applyCoupon,
    getActiveMeetups,
    getMyMeetups,
    createRazorpayOrder,
    verifyRazorpayPayment,
} = require("../controllers/meetup.controller");

// ─── Meetup CRUD ─────────────────────────────────────────────────
router.post("/create", createMeetup);
router.post("/join", joinMeetup);
router.post("/leave", leaveMeetup);
router.get("/all", getAllMeetups);
router.get("/count", countMeetups);
router.get("/code/:code", getMeetupByCode);
router.get("/user/:userId", getUserMeetups);
router.get("/active/:userId", getActiveMeetups);
router.get("/my", getMyMeetups);
router.get("/:id", getMeetupById);

// ─── Chat ────────────────────────────────────────────────────────
router.post("/message", sendMessage);
router.get("/messages/:meetupId", getMessages);

// ─── Voting & Cafe Selection ───────────────────────────────────────
router.post("/add-cafes", addCafesForVoting);
router.post("/vote", voteCafe);
router.post("/select-cafe", selectCafe);
router.get("/:meetupId/cafe-menu", getCafeMenu);

// ─── ORDERING & PAYMENTS ─────────────────────────────────────────
router.post("/order", placeOrder);
router.post("/apply-coupon", applyCoupon);
router.get("/orders/:meetupId", getOrders);
router.post("/razorpay-order", createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);

module.exports = router;

