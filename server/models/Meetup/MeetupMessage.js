const mongoose = require("mongoose");

const MeetupMessageSchema = new mongoose.Schema(
    {
        meetupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meetup",
            required: true,
            index: true,
        },
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: false, // Not required for bill/payment messages
        },
        type: {
            type: String,
            enum: ['user', 'system', 'bill', 'payment'],
            default: 'user',
        },
        billData: {
            type: mongoose.Schema.Types.Mixed,
        },
        paymentData: {
            type: mongoose.Schema.Types.Mixed,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("MeetupMessage", MeetupMessageSchema);
