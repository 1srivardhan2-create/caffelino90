const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const CafeSchema = new mongoose.Schema({}, { strict: false });
const Cafe = mongoose.model("Cafe", CafeSchema);

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(async () => {
    const cafes = await Cafe.find({}).limit(5).lean();
    const summary = cafes.map(c => ({
        id: c._id,
        ownerId: c.ownerId,
        name: c.Name || c.name || "Unknown"
    }));
    fs.writeFileSync("cafe_summary.json", JSON.stringify(summary, null, 2));
    console.log("Summary saved to cafe_summary.json");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
