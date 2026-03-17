const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Define minimal schemas if models are not easily importable
const CafeSchema = new mongoose.Schema({ Name: String, ownerId: String }, { collection: 'caves' });
const MeetupOrderSchema = new mongoose.Schema({ orderId: String, cafeId: String, status: String }, { collection: 'meetuporders' });

async function debug() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27017/caffelino?authSource=admin');
        console.log('--- DB CONNECTION SUCCESS ---');

        const Cafe = mongoose.models.Cafe || mongoose.model('Cafe', CafeSchema);
        const MeetupOrder = mongoose.models.MeetupOrder || mongoose.model('MeetupOrder', MeetupOrderSchema);

        const rostCafe = await Cafe.findOne({ Name: /rost/i });
        console.log('\n--- ROST CAFE ---');
        console.log(JSON.stringify(rostCafe, null, 2));

        const order815517 = await MeetupOrder.findOne({ orderId: /815517/ });
        console.log('\n--- ORDER 815517 ---');
        console.log(JSON.stringify(order815517, null, 2));

        if (rostCafe && order815517) {
            console.log(`\nMatch check: Order CafeId (${order815517.cafeId}) vs Cafe _id (${rostCafe._id}) or ownerId (${rostCafe.ownerId})`);
        }

        const recentOrders = await MeetupOrder.find().sort({ createdAt: -1 }).limit(5);
        console.log('\n--- RECENT ORDERS ---');
        console.log(JSON.stringify(recentOrders, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error('DEBUG ERROR:', err);
    }
}

debug();
