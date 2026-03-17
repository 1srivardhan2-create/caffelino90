const mongoose = require('mongoose');
require('dotenv').config();

async function checkCafes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const Cafe = mongoose.model('Cafe', new mongoose.Schema({
            Name: String,
            status: Boolean,
            profilePicture: String,
            Cafe_photos: [String]
        }, { strict: false }), 'caves');

        const cafes = await Cafe.find({ status: true });
        console.log(`Found ${cafes.length} approved cafes.`);

        cafes.forEach(c => {
            console.log('---');
            console.log('ID:', c._id);
            console.log('Name:', c.Name);
            console.log('Profile Picture (exists):', !!c.profilePicture);
            if (c.profilePicture) {
                console.log('Profile Picture Start:', c.profilePicture.substring(0, 50));
            }
            console.log('Cafe Photos Count:', c.Cafe_photos ? c.Cafe_photos.length : 0);
            if (c.Cafe_photos && c.Cafe_photos.length > 0) {
                console.log('First Photo Start:', c.Cafe_photos[0].substring(0, 50));
            }
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkCafes();
