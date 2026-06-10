const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  description: { type: String },
  discountValue: { type: Number, required: true, default: 0 },
  discountType: { type: String, enum: ["flat", "percent"], default: "flat" },
  maxUsage: { type: Number, default: 100 },
  minOrder: { type: Number, default: 0 },
  minOrderRules: [{
    cafe: String,
    minOrder: Number
  }],
  applicableCafes: [{ type: String }], // Array of cafe names or "ALL"
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  // Analytics
  usedCount: { type: Number, default: 0 },
  totalSavingsGiven: { type: Number, default: 0 },
  revenueGenerated: { type: Number, default: 0 },
  usersUsed: [
    {
      email: String,
      orderAmount: Number,
      usedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
