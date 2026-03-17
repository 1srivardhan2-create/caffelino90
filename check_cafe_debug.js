const mongoose = require('mongoose');
require('dotenv').config({ path: 'server/.env' });

const Cafe = require('./server/models/Cafe/Cafe_login');

async function checkCafe() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/caffelino');
        console.log('Connected to MongoDB');

        const cafe = await Cafe.findOne({ Name: /rost/i });
        if (cafe) {
            console.log('--- Cafe "rost" Found ---');
            console.log(JSON.stringify({
                _id: cafe._id,
                ownerId: cafe.ownerId,
                Name: cafe.Name
            }, null, 2));
        } else {
            console.log('Cafe "rost" not found');
            const all = await Cafe.find().limit(5).select('Name ownerId');
            console.log('Sample cafes:', JSON.stringify(all, null, 2));
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkCafe();
