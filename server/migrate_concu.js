const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadBase64ToCloudinary(base64String, folder) {
    if (!base64String || !base64String.startsWith('data:')) return '';
    try {
        const result = await cloudinary.uploader.upload(base64String, {
            folder,
            resource_type: 'image',
        });
        return result.secure_url;
    } catch (err) {
        console.error('Cloudinary upload error:', err.message);
        return '';
    }
}

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Cafe = require("./models/Cafe/Cafe_login");
        
        const concu = await Cafe.findOne({ Name: "concu" });
        if (concu && concu.profilePicture && concu.profilePicture.startsWith("data:")) {
            console.log("Migrating 'concu' profile picture...");
            const url = await uploadBase64ToCloudinary(concu.profilePicture, "cafes/profiles");
            if (url) {
                concu.profilePicture = url;
                await concu.save();
                console.log("✅ 'concu' profile picture migrated to:", url);
            }
        } else {
            console.log("'concu' not found or already has a URL.");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

migrate();
