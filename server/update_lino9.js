/**
 * Update LINO9 to 6% percentage coupon
 */
const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function updateLino9() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const result = await mongoose.connection.db.collection("coupons").updateOne(
    { code: "LINO9" },
    {
      $set: {
        discount: 6,
        discountType: "percent",
        minOrder: 500
      }
    }
  );

  console.log("Updated LINO9:", result.modifiedCount, "modified");

  const coupons = await mongoose.connection.db.collection("coupons").find({}).toArray();
  console.log("\nAll coupons:");
  coupons.forEach(c => {
    console.log(`  ${c.code}: ${c.discountType === 'percent' ? c.discount + '%' : '₹' + c.discount} off (min ₹${c.minOrder}) | Type: ${c.discountType || 'flat'}`);
  });

  await mongoose.disconnect();
}

updateLino9();
