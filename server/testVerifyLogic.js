require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User/User');
const Counter = require('./models/Counter');
const EventRegistration = require('./models/EventRegistration');
const { generateAndUploadQRCode } = require('./utils/qrCodeGenerator');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const eventId = "6a29c9147967403a9c79beb6";
        const userId = "6a29ca3112d911152e0668a9";
        const quantity = 1;
        const razorpay_payment_id = "pay_T03tkpYwmxDpPG";
        const razorpay_order_id = "order_T03tcKo2naQp4Z";

        console.log("Fetching event...");
        const event = await Event.findById(eventId);
        if (!event) throw new Error("Event not found");

        console.log("Fetching user...");
        let userObj = null;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            userObj = await User.findById(userId);
        } else {
            userObj = await User.findOne({ firebaseUid: userId });
        }
        console.log("User found:", !!userObj);

        console.log("Generating ticket...");
        const year = new Date().getFullYear();
        const counter = await Counter.findByIdAndUpdate(
            'ticketId',
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true }
        );
        const seqFormatted = String(counter.seq).padStart(4, '0');
        const ticketNumber = `CAF-${year}-${seqFormatted}`;
        console.log("Ticket generated:", ticketNumber);
        
        console.log("Generating QR...");
        const qrCodeData = JSON.stringify({ ticketNumber, eventId, userId });
        const qrCodeUrl = await generateAndUploadQRCode(ticketNumber);
        console.log("QR generated:", qrCodeUrl);

        console.log("Saving registration...");
        const registration = new EventRegistration({
            eventId,
            eventName: event.eventName,
            userId,
            userName: userObj ? (userObj.name || userObj.username || "Guest") : "Guest",
            email: userObj ? (userObj.email || "") : "",
            mobileNumber: userObj ? (userObj.mobileNumber || "") : "",
            profileImage: userObj ? (userObj.picture || userObj.avatarId || "") : "",
            status: "confirmed",
            ticketNumber,
            qrCodeUrl,
            qrCodeData,
            ticketType: "PAID",
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            ticketPrice: event.ticketPrice,
            amountPaid: event.ticketPrice,
        });
        await registration.validate(); // check if schema validation fails
        console.log("Validation passed!");
        
        // await registration.save(); // Don't actually save
        console.log("Success!");
    } catch (e) {
        console.error("Test failed:", e);
    } finally {
        mongoose.disconnect();
    }
}

test();
