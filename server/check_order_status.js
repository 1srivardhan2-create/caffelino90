const mongoose = require('mongoose');
require('dotenv').config();

const MeetupOrder = require('./models/Meetup/MeetupOrder');
const Cafe = require('./models/Cafe/Cafe_login');

async function checkOrders() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const orders = await MeetupOrder.find().sort({ createdAt: -1 }).limit(10).lean();
        console.log(`\nFound ${orders.length} recent orders:\n`);
        
        orders.forEach((order, i) => {
            console.log(`--- Order #${i + 1} ---`);
            console.log(`  orderId:     ${order.orderId}`);
            console.log(`  status:      ${order.status}`);
            console.log(`  orderStatus: ${order.orderStatus}`);
            console.log(`  tokenPaid:   ${order.tokenPaid}`);
            console.log(`  cafeId:      ${order.cafeId}`);
            console.log(`  total:       ${order.total}`);
            console.log(`  items:       ${(order.items || []).map(i => i.name).join(', ')}`);
            console.log(`  createdAt:   ${order.createdAt}`);
            console.log('');
        });

        if (orders.length > 0) {
            const uniqueCafeIds = [...new Set(orders.map(o => o.cafeId).filter(Boolean))];
            console.log(`Unique cafeIds in orders: ${uniqueCafeIds.join(', ')}`);
            
            for (const cid of uniqueCafeIds) {
                let cafe = null;
                if (mongoose.Types.ObjectId.isValid(cid)) {
                    cafe = await Cafe.findById(cid).select('Name ownerId').lean();
                }
                if (!cafe) {
                    cafe = await Cafe.findOne({ ownerId: cid }).select('Name ownerId').lean();
                }
                if (cafe) {
                    console.log(`  cafeId "${cid}" -> Cafe: "${cafe.Name}" (ownerId: ${cafe.ownerId}, _id: ${cafe._id})`);
                } else {
                    console.log(`  cafeId "${cid}" -> NO cafe found!`);
                }
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkOrders();
