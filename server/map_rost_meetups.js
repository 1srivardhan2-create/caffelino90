const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        const meetups = await db.collection('meetups').find({ 
            $or: [
                { "selectedCafe.name": /rost/i },
                { "selectedCafe.cafeName": /rost/i },
                { "selectedCafe": /rost/i }
            ]
        }).toArray();
        
        console.log('\n--- ROST MEETUPS MAPPING ---');
        meetups.forEach(m => {
            console.log(`_id: ${m._id}, Code: ${m.meetupCode}`);
            console.log('selectedCafe:', JSON.stringify(m.selectedCafe, null, 2));
            console.log('---');
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
run();
