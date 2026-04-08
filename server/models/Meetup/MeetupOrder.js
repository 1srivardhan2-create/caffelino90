const mongoose = require("mongoose");

const MeetupOrderSchema = new mongoose.Schema(
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
        cafeId: {
            type: String,
            default: "",
        },
        cafeName: {
            type: String,
            default: "",
        },
        cafe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cafe",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        items: [
            {
                menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'CafeMenu' },
                menuItemId: { type: String },
                name: { type: String },
                price: { type: Number },
                quantity: { type: Number, default: 1 },
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
        commission: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
            default: 0
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        memberCount: {
            type: Number,
            default: 1,
        },
        status: {
            type: String,
            enum: ["draft", "token_paid", "accepted", "completed", "pending", "confirmed", "PENDING", "ACCEPTED", "COMPLETED", "CONFIRMED", "PLACED", "READY", "CASH_COLLECTED"],
            default: "draft",
        },
        orderStatus: {
            type: String,
            default: "PLACED"
        },
        orderId: {
            type: String,
            unique: true,
        },
        coupon: {
            code: { type: String, default: "" },
            discount: { type: Number, default: 0 }
        },
        tokenPaid: {
            type: Boolean,
            default: false,
        },
        tokenAmount: {
            type: Number,
            default: 0
        },
        splitEnabled: {
            type: Boolean,
            default: false,
        },
        perPersonAmount: {
            type: Number,
            default: 0,
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID"],
            default: "PENDING",
        },
        members: [
            {
                userId: { type: String },
                name: { type: String },
                avatar: { type: String }
            }
        ],
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

module.exports = mongoose.model("MeetupOrder", MeetupOrderSchema, "orders");
