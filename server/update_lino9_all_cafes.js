/**
 * Update LINO9 coupon to work for ALL cafes
 * 
 * Sets cafe field to "all" so it's not restricted to Chocolate Room only.
 * 
 * Usage: node update_lino9_all_cafes.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/caffelino";

async function updateLino9() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Update LINO9 coupon: set cafe to "all"
    const result = await mongoose.connection.db.collection("coupons").updateOne(
      { code: "LINO9" },
      {
        $set: {
          cafe: "all",
          minOrder: 300
        }
      }
    );

    if (result.matchedCount > 0) {
      console.log("🎫 LINO9 coupon updated — now valid for ALL cafes!");
    } else {
      console.log("⚠️  LINO9 coupon not found in database. Run seed_lino9.js first.");
    }

    // Print all coupons for verification
    const coupons = await mongoose.connection.db.collection("coupons").find({}).toArray();
    console.log("\n📋 All coupons:");
    coupons.forEach(c => {
      console.log(`   ${c.code}: ₹${c.discount} off (min ₹${c.minOrder}) | Cafe: ${c.cafe} | Active: ${c.isActive} | Used: ${c.usedCount}/${c.maxUsage}`);
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

updateLino9();
