const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        const meetups = await db.collection('meetups').find({ selectedCafe: { $type: 'string' } }).toArray();
        console.log('\n--- STRING SELECTED CAFE ---');
        meetups.forEach(m => {
            console.log(`Meetup Code: ${m.meetupCode}, selectedCafe: "${m.selectedCafe}"`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
run();
