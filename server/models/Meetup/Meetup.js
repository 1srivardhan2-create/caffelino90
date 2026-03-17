const mongoose = require("mongoose");

const MeetupSchema = new mongoose.Schema(
    {
        meetupCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
        },
        organizerId: {
            type: String,
            required: true,
        },
        organizerName: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            default: "",
        },
        time: {
            type: String,
            default: "",
        },
        members: [
            {
                userId: { type: String, required: true },
                name: { type: String, required: true },
                joinedAt: { type: Date, default: Date.now },
            },
        ],
        cafesForVoting: [
            {
                cafeId: { type: String },
                cafeName: { type: String },
                cafeImage: { type: String },
            },
        ],
        votes: [
            {
                userId: { type: String },
                cafeId: { type: String },
            },
        ],
        selectedCafe: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
        status: {
            type: String,
            enum: ["active", "voting", "ordering", "completed"],
            default: "active",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Meetup", MeetupSchema);
