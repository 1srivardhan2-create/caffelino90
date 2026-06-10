require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const reg = await db.collection('eventregistrations').findOne({ orderId: "order_T03tcKo2naQp4Z" });
        console.log("Registration for order_T03tcKo2naQp4Z:", JSON.stringify(reg, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}

check();
