const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cafe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cafe",
            required: true,
        },
        meetupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meetup",
        },
        items: [
            {
                menuItem: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CafeMenu",
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        total: {
            type: Number,
        },
        orderStatus: {
            type: String,
            enum: [
                "PLACED",
                "ACCEPTED",
                "PREPARING",
                "READY",
                "COMPLETED",
                "CANCELLED",
                "CASH_COLLECTED",
                "PENDING"
            ],
            default: "PLACED",
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID"],
            default: "PENDING",
        },
        paymentMethod: {
            type: String,
            enum: ["CASH", "UPI", "CARD"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema, "orders");
