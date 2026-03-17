const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const MeetupSchema = new mongoose.Schema({}, { strict: false });
const Meetup = mongoose.model("Meetup", MeetupSchema);

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(async () => {
    const meetups = await Meetup.find({}).sort({createdAt: -1}).limit(5).lean();
    fs.writeFileSync("meetup_summary.json", JSON.stringify(meetups, null, 2));
    console.log("Summary saved to meetup_summary.json");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
