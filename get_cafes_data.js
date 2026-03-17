const mongoose = require('mongoose');
const Cafe = require('./server/models/Cafe/Cafe_login');
require('dotenv').config({ path: './server/.env' });

async function checkCafes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");
        const cafes = await Cafe.find({}).limit(5).lean();
        cafes.forEach(c => {
            console.log(`Cafe: ${c.Name}`);
            console.log(`  profilePicture: ${JSON.stringify(c.profilePicture)}`);
            console.log(`  Cafe_photos: ${JSON.stringify(c.Cafe_photos)}`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkCafes();
