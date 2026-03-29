const mongoose = require('mongoose');
require('dotenv').config();
const MeetupOrder = require('./models/Meetup/MeetupOrder');

async function testPostDirectly() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const req = {
            body: {
                orderId: "TEST_999",
                cafeId: "69c7f4f826613be68275a09d",
                meetupId: "69c8fcd780d5b21b43979346",
                userId: "google_caffelino_9_gmail_com", // Wait, is this a valid ObjectId?!
                userName: "Vardhan",
                items: [
                    {
                        menuItemId: "69c7f54026613be68275a0b1",
                        name: "cheese cake",
                        price: 88,
                        quantity: 4
                    }
                ],
                subtotal: 352,
                cgst: 8.8,
                sgst: 8.8,
                totalAmount: 369.6
            }
        };

        const payload = req.body;
        if (payload.cafeId) {
            payload.cafe = payload.cafeId;
        }
        
        if (payload.userId && mongoose.isValidObjectId(payload.userId)) {
            payload.user = payload.userId;
        }

        if (payload.items && Array.isArray(payload.items)) {
            payload.items = payload.items.map(item => {
                if (item.menuItemId && mongoose.isValidObjectId(item.menuItemId)) {
                    item.menuItem = item.menuItemId;
                }
                return item;
            });
        }
        
        const newOrder = new MeetupOrder(payload);
        const order = await newOrder.save();
        console.log("Saved order successfully:", order._id);
        
        await MeetupOrder.deleteOne({ _id: order._id });
        await mongoose.disconnect();
    } catch (e) {
        console.error("Save Error:", e);
        process.exit(1);
    }
}
testPostDirectly();
