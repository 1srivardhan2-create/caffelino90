const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  discount: { type: Number, default: 100 },
  discountType: { type: String, enum: ["flat", "percent"], default: "flat" },
  maxUsage: { type: Number, default: 20 },
  usedCount: { type: Number, default: 0 },
  minOrder: { type: Number, default: 700 },
  cafe: { type: String, default: "Chocolate Room Cafe" },
  isActive: { type: Boolean, default: true },
  usersUsed: [
    {
      email: String,
      orderAmount: Number,
      usedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Coupon", couponSchema);
