require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const orders = await mongoose.connection.db.collection('meetuporders')
            .find()
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();
            
        console.log('OrderId | CafeId | UserName | CreatedAt');
        console.log('------------------------------------------');
        orders.forEach(o => {
            console.log(`${o.orderId} | ${o.cafeId} | ${o.userName} | ${o.createdAt}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

run();
