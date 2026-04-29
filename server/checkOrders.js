const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const MeetupOrderSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const MeetupOrder = mongoose.model("MeetupOrder", MeetupOrderSchema);

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(async () => {
    const orders = await MeetupOrder.find({}).sort({ updatedAt: -1 }).limit(20).lean();
    const summary = orders.map(o => ({
      id: o._id,
      orderId: o.orderId,
      cafeId: o.cafeId,
      status: o.status,
      userName: o.userName,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt
    }));
    fs.writeFileSync("order_summary.json", JSON.stringify(summary, null, 2));
    console.log("Summary saved to order_summary.json");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
