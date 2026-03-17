const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

async function checkCafes() {
    let output = '';
    const log = (msg) => {
        console.log(msg);
        output += msg + '\n';
    };

    try {
        await mongoose.connect(process.env.MONGO_URI);
        log('Connected to MongoDB');

        const Cafe = mongoose.model('Cafe', new mongoose.Schema({
            Name: String,
            status: Boolean,
            profilePicture: String,
            Cafe_photos: [String]
        }, { strict: false }), 'caves');

        const cafes = await Cafe.find({ status: true });
        log(`Found ${cafes.length} approved cafes.`);

        cafes.forEach(c => {
            log('---');
            log(`ID: ${c._id}`);
            log(`Name: ${c.Name}`);
            log(`Profile Picture exists: ${!!c.profilePicture}`);
            if (c.profilePicture) {
                log(`Profile Picture Start: ${c.profilePicture.substring(0, 50)}`);
            }
            log(`Cafe Photos Count: ${c.Cafe_photos ? c.Cafe_photos.length : 0}`);
            if (c.Cafe_photos && c.Cafe_photos.length > 0) {
                log(`First Photo Start: ${c.Cafe_photos[0].substring(0, 50)}`);
            }
        });

        fs.writeFileSync('check_images_output.txt', output);
        log('Results written to check_images_output.txt');

        await mongoose.disconnect();
    } catch (err) {
        log('Error: ' + err.message);
    }
}

checkCafes();
