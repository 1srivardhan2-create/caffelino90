const mongoose = require("mongoose");

const cafeOrderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            index: true,
        },
        cafeId: {
            type: String,
            required: true,
            index: true,
        },
        cafeName: {
            type: String,
            default: "",
        },
        userId: {
            type: String,
            required: true,
            index: true,
        },
        userName: {
            type: String,
            default: "",
        },
        meetupId: {
            type: String,
            default: "",
        },
        items: [
            {
                name: { type: String },
                price: { type: Number },
                quantity: { type: Number, default: 1 },
                menuItemId: { type: String },
            },
        ],
        subtotal: {
            type: Number,
            default: 0,
        },
        cgst: {
            type: Number,
            default: 0,
        },
        sgst: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            default: 0,
        },
        memberCount: {
            type: Number,
            default: 1,
        },
        tokenPaid: {
            type: Boolean,
            default: false,
        },
        tokenAmount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["PLACED", "ACCEPTED", "COMPLETED", "CANCELLED"],
            default: "PLACED",
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID"],
            default: "PENDING",
        },
        paymentMethod: {
            type: String,
            default: "",
        },
        // New fields for meetup scheduling integration
        meetupDate: {
            type: String,
            default: ""
        },
        meetupTime: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("CafeOrder", cafeOrderSchema, "cafeorders");
