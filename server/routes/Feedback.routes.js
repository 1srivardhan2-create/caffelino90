const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");

// POST /api/feedback - Create a new feedback
router.post("/", feedbackController.createFeedback);

// GET /api/feedback - Get all feedbacks
router.get("/", feedbackController.getFeedbacks);

module.exports = router;
