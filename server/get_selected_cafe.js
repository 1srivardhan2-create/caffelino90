const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        const meetups = await db.collection('meetups').find({ selectedCafe: { $exists: true } }).limit(2).toArray();
        console.log('\n--- FULL SELECTED CAFE ---');
        meetups.forEach(m => {
            console.log('Meetup:', m.meetupCode);
            console.log(JSON.stringify(m.selectedCafe, null, 2));
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
run();
