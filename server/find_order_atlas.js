const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        console.log('Searching in meetuporders...');
        const mo = await db.collection('meetuporders').findOne({ orderId: /815517/ });
        console.log('Result in meetuporders:', JSON.stringify(mo, null, 2));

        console.log('Searching in orders...');
        const o = await db.collection('orders').findOne({ orderId: /815517/ });
        console.log('Result in orders:', JSON.stringify(o, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
run();
