/**
 * Reset Coupon Script
 * 
 * Resets the CAFFELINO coupon in MongoDB:
 *   - usedCount → 0
 *   - usersUsed → []
 *   - isActive → true
 * 
 * Usage: node reset_coupon.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/caffelino";

async function resetCoupon() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await mongoose.connection.db.collection("coupons").updateOne(
      { code: "CAFFELINO" },
      {
        $set: {
          usedCount: 0,
          usersUsed: [],
          isActive: true
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log("⚠️  No coupon found with code 'CAFFELINO'");
    } else {
      console.log("🎫 Coupon 'CAFFELINO' reset successfully!");
      console.log(`   Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    }

    // Print current state for verification
    const coupon = await mongoose.connection.db.collection("coupons").findOne({ code: "CAFFELINO" });
    if (coupon) {
      console.log("\n📋 Current coupon state:");
      console.log(`   Code: ${coupon.code}`);
      console.log(`   Active: ${coupon.isActive}`);
      console.log(`   Used: ${coupon.usedCount}/${coupon.maxUsage}`);
      console.log(`   Users Used: ${coupon.usersUsed.length}`);
    }

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

resetCoupon();
