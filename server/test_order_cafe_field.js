const mongoose = require('mongoose');
require('dotenv').config();

const MeetupOrder = require('./models/Meetup/MeetupOrder');

async function testOrderCreation() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');

        const dummyPayload = {
            meetupId: new mongoose.Types.ObjectId(),
            userId: "test-user-v",
            userName: "Vardhan Test",
            cafeId: "69c7f4f826613be68275a09d",
            orderId: Date.now().toString(),
            status: "draft",
            totalAmount: 100,
            items: []
        };

        // Simulating the route logic
        if (dummyPayload.cafeId) {
            dummyPayload.cafe = dummyPayload.cafeId;
        }

        const order = await MeetupOrder.create(dummyPayload);
        console.log("Created order:", JSON.stringify(order, null, 2));

        // Now query via Order model to ensure it finds it via cafe ObjectId
        const Order = require('./models/Cafe/Cafe_orders');
        const foundOrder = await Order.findById(order._id).lean();
        
        console.log("Found via Cafe_orders model (orders collection):", foundOrder ? "YES" : "NO");
        if (foundOrder) {
            console.log("Found order cafe field type:", typeof foundOrder.cafe, foundOrder.cafe);
        }

        // Cleanup
        await MeetupOrder.findByIdAndDelete(order._id);
        await mongoose.disconnect();
    } catch(e) {
        console.error(e);
    }
}
testOrderCreation();
