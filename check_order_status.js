// Quick script to check the latest orders in MongoDB and their statuses
const mongoose = require('mongoose');
require('dotenv').config({ path: 'server/.env' });

async function checkOrders() {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/caffelino';
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        const MeetupOrder = require('./server/models/Meetup/MeetupOrder');

        // Get the 10 most recent orders
        const orders = await MeetupOrder.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        console.log(`\n📦 Found ${orders.length} recent orders:\n`);

        orders.forEach((order, i) => {
            console.log(`--- Order #${i + 1} ---`);
            console.log(`  orderId:     ${order.orderId}`);
            console.log(`  status:      ${order.status}`);
            console.log(`  orderStatus: ${order.orderStatus}`);
            console.log(`  tokenPaid:   ${order.tokenPaid}`);
            console.log(`  cafeId:      ${order.cafeId}`);
            console.log(`  total:       ₹${order.total}`);
            console.log(`  items:       ${(order.items || []).map(i => i.name).join(', ')}`);
            console.log(`  createdAt:   ${order.createdAt}`);
            console.log('');
        });

        // Also check if cafeId matches any cafe
        if (orders.length > 0) {
            const Cafe = require('./server/models/Cafe/Cafe_login');
            const uniqueCafeIds = [...new Set(orders.map(o => o.cafeId).filter(Boolean))];
            console.log(`\n🏪 Unique cafeIds in orders: ${uniqueCafeIds.join(', ')}`);

            for (const cid of uniqueCafeIds) {
                let cafe = null;
                if (mongoose.Types.ObjectId.isValid(cid)) {
                    cafe = await Cafe.findById(cid).select('Name ownerId').lean();
                }
                if (!cafe) {
                    cafe = await Cafe.findOne({ ownerId: cid }).select('Name ownerId').lean();
                }
                if (cafe) {
                    console.log(`  ✅ cafeId "${cid}" → Cafe: "${cafe.Name}" (ownerId: ${cafe.ownerId}, _id: ${cafe._id})`);
                } else {
                    console.log(`  ❌ cafeId "${cid}" → NO cafe found!`);
                }
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkOrders();
