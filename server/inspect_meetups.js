const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        const meetups = await db.collection('meetups').find({ selectedCafe: { $exists: true } }).limit(5).toArray();
        console.log('\n--- SELECTED CAFE EXAMPLES ---');
        meetups.forEach(m => {
            console.log(`Meetup ID: ${m._id}`);
            console.log('selectedCafe:', JSON.stringify(m.selectedCafe, null, 2));
            console.log('---');
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
run();
