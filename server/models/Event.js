const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        bannerUrl: {
            type: String, // Cloudinary URL
            required: true,
        },
        date: {
            type: String, // e.g. "2024-12-01"
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        cafeName: {
            type: String,
            required: true,
        },
        venueName: {
            type: String,
            required: true,
        },
        fullAddress: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        googleMapsLink: {
            type: String,
        },
        ticketPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        totalSeats: {
            type: Number,
            required: true,
        },
        availableSeats: {
            type: Number,
            required: true,
        },
        ticketsSold: {
            type: Number,
            default: 0,
        },
        organizationName: {
            type: String,
        },
        eventInstagramId: {
            type: String,
        },
        companyName: {
            type: String,
        },
        companyInstagram: {
            type: String,
        },
        status: {
            type: String,
            enum: ["draft", "published", "cancelled", "completed"],
            default: "published",
        },
        organizerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        revenue: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
