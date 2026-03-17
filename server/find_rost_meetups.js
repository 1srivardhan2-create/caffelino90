require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const meetups = await mongoose.connection.db.collection('meetups')
            .find({ $or: [{ 'selectedCafe.cafeId': 'rost' }, { 'selectedCafe': 'rost' }, { 'selectedCafe.id': 'rost' }] })
            .toArray();
            
        console.log(`Found ${meetups.length} meetups with 'rost' as identifier`);
        meetups.forEach(m => {
            console.log(`Code: ${m.meetupCode} | SelectedCafe: ${JSON.stringify(m.selectedCafe)}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

run();
