const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MeetupOrderSchema = new mongoose.Schema({ orderId: String, meetupId: { type: mongoose.Schema.Types.ObjectId } }, { collection: 'meetuporders' });
const MeetupSchema = new mongoose.Schema({ meetupCode: String, selectedCafe: mongoose.Schema.Types.Mixed }, { collection: 'meetups' });

async function debugMeetup() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27017/caffelino?authSource=admin');
        const MeetupOrder = mongoose.models.MeetupOrder || mongoose.model('MeetupOrder', MeetupOrderSchema);
        const Meetup = mongoose.models.Meetup || mongoose.model('Meetup', MeetupSchema);

        const order = await MeetupOrder.findOne({ orderId: '815517' });
        if (order) {
            console.log('Order found, MeetupId:', order.meetupId);
            const meetup = await Meetup.findById(order.meetupId);
            console.log('\n--- MEETUP DATA ---');
            console.log(JSON.stringify(meetup, null, 2));
        } else {
            console.log('Order not found');
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
debugMeetup();
