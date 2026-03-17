require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const { connectDB } = require("./config/db");
const Meetup = require("./models/Meetup/Meetup");

async function check() {
  await connectDB();
  const meetups = await Meetup.find().sort({ createdAt: -1 }).limit(1).lean();
  fs.writeFileSync("meetup_dump.json", JSON.stringify(meetups[0], null, 2), "utf8");
  console.log("Dumped to meetup_dump.json");
  process.exit(0);
}
check();
