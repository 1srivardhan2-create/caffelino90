const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        const order = await db.collection('meetuporders').findOne({ orderId: /815517/ });
        console.log('\n--- ORDER 815517 ---');
        console.log(JSON.stringify(order, null, 2));

        if (order && order.meetupId) {
            const meetup = await db.collection('meetups').findOne({ _id: order.meetupId });
            console.log('\n--- MEETUP ---');
            console.log(JSON.stringify(meetup, null, 2));
        }

        const cafe = await db.collection('caves').findOne({ Name: /rost/i });
        console.log('\n--- CAFE ROST ---');
        console.log(JSON.stringify(cafe, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
run();
