const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        const meetups = await db.collection('meetups').find({ selectedCafe: { $ne: null } }).limit(5).toArray();
        console.log('\n--- NON-NULL SELECTED CAFE ---');
        meetups.forEach(m => {
            console.log('Meetup:', m.meetupCode);
            console.log('selectedCafe type:', typeof m.selectedCafe);
            console.log('Value:', JSON.stringify(m.selectedCafe, null, 2));
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
run();
