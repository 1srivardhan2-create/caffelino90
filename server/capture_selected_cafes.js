const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        const meetups = await db.collection('meetups').find({ selectedCafe: { $ne: null } }).limit(10).toArray();
        let output = '\n--- SELECTED CAFE LIST ---\n';
        meetups.forEach(m => {
            output += `Meetup Code: ${m.meetupCode}\n`;
            output += `selectedCafe: ${JSON.stringify(m.selectedCafe, null, 2)}\n`;
            output += '---\n';
        });

        const fs = require('fs');
        fs.writeFileSync('selected_cafes_debug.txt', output);
        console.log('Output saved to selected_cafes_debug.txt');

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
run();
