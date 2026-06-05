const mongoose = require("mongoose");

const EventRegistrationSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        userId: {
            type: String, // String to support Firebase UIDs or existing user IDs
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },
        ticketNumber: {
            type: String,
            required: true,
            unique: true,
        },
        qrCodeUrl: {
            type: String, // Backend generated QR code hosted on Cloudinary
            required: true,
        },
        paymentId: {
            type: String, // Razorpay Payment ID or "FREE"
        },
        orderId: {
            type: String, // Razorpay Order ID or null
        },
        amountPaid: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("EventRegistration", EventRegistrationSchema);
