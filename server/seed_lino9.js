/**
 * Seed LINO9 coupon in MongoDB
 * 
 * LINO9: ₹50 flat off on orders above ₹500 at Chocolate Room
 * 
 * Usage: node seed_lino9.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/caffelino";

async function seedLino9() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await mongoose.connection.db.collection("coupons").updateOne(
      { code: "LINO9" },
      {
        $setOnInsert: {
          code: "LINO9",
          discount: 50,
          maxUsage: 20,
          usedCount: 0,
          minOrder: 500,
          cafe: "Chocolate Room Cafe",
          isActive: true,
          usersUsed: []
        }
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log("🎫 LINO9 coupon created successfully!");
    } else {
      console.log("ℹ️  LINO9 coupon already exists");
    }

    // Print both coupons
    const coupons = await mongoose.connection.db.collection("coupons").find({}).toArray();
    console.log("\n📋 All coupons:");
    coupons.forEach(c => {
      console.log(`   ${c.code}: ₹${c.discount} off (min ₹${c.minOrder}) | Active: ${c.isActive} | Used: ${c.usedCount}/${c.maxUsage}`);
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

seedLino9();
