const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/create-order", paymentController.createOrder);
router.post("/verify", paymentController.verifyOrder);
router.post("/webhook", express.raw({ type: 'application/json' }), paymentController.webhook);
router.get("/history", paymentController.getPaymentHistory);
router.get("/revenue-stats", paymentController.getRevenueStats);

module.exports = router;
