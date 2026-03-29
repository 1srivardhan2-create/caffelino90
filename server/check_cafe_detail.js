const mongoose = require('mongoose');
require('dotenv').config();
const Cafe = require('./models/Cafe/Cafe_login');

async function checkCafe() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');

        const cafe = await Cafe.findById('69c7f4f826613be68275a09d').lean();
        if (cafe) {
            console.log('Cafe found:');
            console.log(JSON.stringify({
                _id: cafe._id,
                Name: cafe.Name,
                ownerId: cafe.ownerId,
                managerId: cafe.managerId,
                email: cafe.Email || cafe.email,
                managerName: cafe.Manager_name,
                phone: cafe.Manager_phone_number,
            }, null, 2));
        }

        await mongoose.disconnect();
    } catch (e) {
        console.error(e.message);
    }
}
checkCafe();
