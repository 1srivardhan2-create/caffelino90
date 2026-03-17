const mongoose = require('mongoose');
const fs = require('fs');
const Cafe = require('./models/Cafe/Cafe_login');
require('dotenv').config({ path: './.env' });

async function checkCafes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const cafes = await Cafe.find({}).limit(5).lean();
        const output = cafes.map(c => ({
            Name: c.Name,
            profilePicture: c.profilePicture,
            Cafe_photos: c.Cafe_photos
        }));
        fs.writeFileSync('output.json', JSON.stringify(output, null, 2));
        console.log("Written to output.json");
        process.exit(0);
    } catch (e) {
        fs.writeFileSync('error.txt', e.toString());
        process.exit(1);
    }
}

checkCafes();
