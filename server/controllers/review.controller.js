const Review = require("../models/Review");

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { userId, userName, userProfile, stars, feedback } = req.body;

    if (!userId || !userName || !stars || !feedback) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReview = new Review({
      userId,
      userName,
      userProfile: userProfile || "",
      stars,
      feedback,
    });

    const savedReview = await newReview.save();

    // If socket.io is active, emit a socket event for real-time updates!
    if (req.io) {
      req.io.emit("new_global_review", savedReview);
    }

    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all reviews (newest first)
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
