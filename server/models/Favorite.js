const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    cafeId: {
      type: String,
      required: false,
      index: true,
    },
    eventId: {
      type: String,
      required: false,
      index: true,
    },
    itemType: {
      type: String,
      enum: ["cafe", "event"],
      required: true,
      default: "cafe",
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "favorites" },
);

// We want to ensure uniqueness per item type (e.g. can't favorite the same cafe twice, or same event twice)
favoriteSchema.index({ userId: 1, cafeId: 1 }, { unique: true, partialFilterExpression: { itemType: "cafe" } });
favoriteSchema.index({ userId: 1, eventId: 1 }, { unique: true, partialFilterExpression: { itemType: "event" } });

module.exports = mongoose.model("Favorite", favoriteSchema);
