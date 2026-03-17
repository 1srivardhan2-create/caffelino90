const mongoose = require("mongoose");

const EarningSchema = new mongoose.Schema(
    {
        cafeId: {
            type: String,
            required: true,
            index: true,
        },
        orderId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "upi", "card"],
            default: "cash",
        },
        items: [
            {
                name: { type: String },
                price: { type: Number },
                quantity: { type: Number, default: 1 },
            },
        ],
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Earning", EarningSchema);
