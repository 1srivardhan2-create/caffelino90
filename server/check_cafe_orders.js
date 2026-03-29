const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('./models/Cafe/Cafe_orders');

async function checkCafeOrders() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');

        const orders = await Order.find().sort({ createdAt: -1 }).limit(10).lean();
        console.log(`Found ${orders.length} orders in Cafe_orders (orders collection)`);
        
        orders.forEach(o => {
            console.log(`- ID: ${o._id}, Status: ${o.orderStatus}, Total: ${o.totalAmount}, Cafe: ${o.cafe}`);
        });

        await mongoose.disconnect();
    } catch(e) {
        console.error(e.message);
    }
}
checkCafeOrders();
