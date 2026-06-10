require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const event = await db.collection('events').findOne({ _id: new mongoose.Types.ObjectId('6a29c9147967403a9c79beb6') });
        console.log("Event details:", JSON.stringify(event, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}

check();
