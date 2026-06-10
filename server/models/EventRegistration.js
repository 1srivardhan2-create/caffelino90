const mongoose = require("mongoose");

const EventRegistrationSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        eventName: {
            type: String,
        },
        userId: {
            type: String, // String to support Firebase UIDs or existing user IDs
            required: true,
        },
        userName: { type: String },
        email: { type: String },
        mobileNumber: { type: String },
        profileImage: { type: String },
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
        qrCodeData: {
            type: String, // JSON payload string
        },
        ticketType: {
            type: String, // "FREE" or "PAID"
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
        ticketPrice: {
            type: Number,
            default: 0,
        },
        checkedIn: {
            type: Boolean,
            default: false,
        },
        checkedInAt: {
            type: Date,
            default: null,
        },
        registrationDate: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("EventRegistration", EventRegistrationSchema);
