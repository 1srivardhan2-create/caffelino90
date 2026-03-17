const mongoose = require("mongoose");

const groupBookingItemSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupAdmin",
            required: true,
        },
        cafe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cafe",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                recipe: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CafeMenu",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("GroupBookingItem", groupBookingItemSchema);
