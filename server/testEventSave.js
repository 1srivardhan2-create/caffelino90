require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const eventId = "6a29c9147967403a9c79beb6";
        const event = await Event.findById(eventId);
        
        event.revenue = (event.revenue || 0) + 1;
        event.availableSeats = Math.max(0, event.availableSeats - 1);
        event.ticketsSold = (event.ticketsSold || 0) + 1;
        
        console.log("Validating event...");
        await event.validate();
        console.log("Validation passed! Testing save...");
        await event.save();
        console.log("Save successful!");
    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        mongoose.disconnect();
    }
}

test();
