const mongoose = require('mongoose');
require('dotenv').config();

const ATLAS_URI = process.env.MONGO_URI;
const LOCAL_URI = 'mongodb://admin:admin123@localhost:27017/caffelino?authSource=admin';

async function check(uri, label) {
    try {
        const conn = await mongoose.createConnection(uri).asPromise();
        const order = await conn.db.collection('meetuporders').findOne({ orderId: /815517/ });
        console.log(`\n--- ${label} ---`);
        if (order) {
            console.log('Order Found:');
            console.log(JSON.stringify(order, null, 2));
        } else {
            console.log('Order NOT Found');
        }
        await conn.close();
    } catch (err) {
        console.log(`\n--- ${label} ---`);
        console.log('Connection Error:', err.message);
    }
}

async function run() {
    await check(ATLAS_URI, 'ATLAS');
    await check(LOCAL_URI, 'LOCAL');
}
run();
