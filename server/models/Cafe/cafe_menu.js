const mongoose = require("mongoose");

const cafeMenuSchema = new mongoose.Schema(
    {
        item_name: {
            type: String,
            required: [true, "Item name is required"],
            trim: true,
        },
        Category: {
            type: String,
            enum: ["Beverages", "Food", "Desserts", "Pizzas"],
            required: [true, "Category is required"],
        },
        food_type: {
            type: String,
            enum: ["Veg", "Non-Veg"],
            required: [true, "Food type is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },
        description_food: {
            type: String,
            default: "",
        },
        image_url: {
            type: String, // Path to uploaded image (e.g. /uploads/123-photo.jpg)
            default: "",
        },
        available: {
            type: Boolean,
            default: true,
        },
        cafe_owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cafe",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CafeMenu", cafeMenuSchema);
