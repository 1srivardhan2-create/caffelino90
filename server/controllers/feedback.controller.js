const Feedback = require("../models/Feedback");

// Create a new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { userId, username, profileImage, comment, rating } = req.body;

    // ─── Field and Validation Checks ──────────────────────────────────
    if (!userId || !username || rating === undefined || comment === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      return res.status(400).json({ message: "Feedback comment cannot be empty." });
    }

    if (trimmedComment.length < 10) {
      return res.status(400).json({ message: "Feedback must be at least 10 characters long." });
    }

    if (trimmedComment.length > 500) {
      return res.status(400).json({ message: "Feedback must not exceed 500 characters." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5 stars." });
    }

    // ─── Create and Save Feedback ─────────────────────────────────────
    const newFeedback = new Feedback({
      userId,
      username,
      profileImage: profileImage || "",
      comment: trimmedComment,
      rating,
    });

    const savedFeedback = await newFeedback.save();

    // ─── Real-Time WebSocket Emission ───────────────────────────────
    if (req.io) {
      req.io.emit("new_global_feedback", savedFeedback);
      console.log(`📣 Real-time feedback event emitted for user: ${username}`);
    }

    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error("Create feedback error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all feedbacks (newest first)
exports.getFeedbacks = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Get feedbacks error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
