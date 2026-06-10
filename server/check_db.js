require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const registrations = await db.collection('eventregistrations').find().sort({_id: -1}).limit(5).toArray();
        console.log(JSON.stringify(registrations, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}

check();
