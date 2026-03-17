require('dotenv').config();
const mongoose = require('mongoose');
const Cafe = require('./models/Cafe/Cafe_login');

async function test() {
    try {
        console.log("Connecting to", process.env.MONGO_URI.replace(/\/\/.*@/, "//<credentials>@"));
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected');
        const start = Date.now();
        const result = await Cafe.find({ status: true }).limit(5).lean();
        console.log(`Got ${result.length} cafes in ${Date.now()-start}ms`);
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
test();
