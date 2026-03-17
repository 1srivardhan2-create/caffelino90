require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User/User');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected');
        const start = Date.now();
        const result = await User.find({}).limit(1).lean();
        console.log(`Got user doc in ${Date.now()-start}ms`);
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
test();
