const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

// POST /api/reviews - Create a new review
router.post("/", reviewController.createReview);

// GET /api/reviews - Get all reviews
router.get("/", reviewController.getReviews);

module.exports = router;
