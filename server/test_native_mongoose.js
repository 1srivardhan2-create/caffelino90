require('dotenv').config();
const mongoose = require('mongoose');
const Cafe = require('./models/Cafe/Cafe_login');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected');
        const start = Date.now();
        console.log('Running Cafe.collection.find()');
        const nativeRes = await Cafe.collection.find({ status: true }).limit(5).toArray();
        console.log('Native Mongoose fetched:', nativeRes.length, 'in', Date.now()-start, 'ms');
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
test();
