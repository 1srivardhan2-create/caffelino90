const mongoose = require('mongoose');
require('dotenv').config();

const MeetupOrder = require('./models/Meetup/MeetupOrder');

async function testOrderCreation() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const order = await MeetupOrder.find({}).sort({ createdAt: -1 }).limit(1).lean();
        const fs = require('fs');
        fs.writeFileSync('orders_ascii.txt', JSON.stringify(order, null, 2));
        await mongoose.disconnect();
    } catch(e) {
        console.error(e);
    }
}
testOrderCreation();
