const mongoose = require("mongoose");

const DeletedOrderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
        },
        cafeId: {
            type: String,
            required: true,
            index: true,
        },
        meetupId: {
            type: String,
            default: "",
        },
        userName: {
            type: String,
            default: "",
        },
        items: [
            {
                name: { type: String },
                price: { type: Number },
                quantity: { type: Number, default: 1 },
            },
        ],
        total: {
            type: Number,
            default: 0,
        },
        reason: {
            type: String,
            default: "manual delete",
        },
        deletedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("DeletedOrder", DeletedOrderSchema);
