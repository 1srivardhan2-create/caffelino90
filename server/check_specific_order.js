const mongoose = require('mongoose');
require('dotenv').config();

const MeetupOrder = require('./models/Meetup/MeetupOrder');

async function checkSpecificOrder() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const order = await MeetupOrder.findOne({ orderId: "502522" }).lean();
        const fs = require('fs');
        fs.writeFileSync('specific_order.txt', JSON.stringify(order, null, 2));
        await mongoose.disconnect();
    } catch(e) {
        console.error(e);
    }
}
checkSpecificOrder();
