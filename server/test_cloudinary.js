const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
    console.log("Testing Cloudinary with:");
    console.log("Cloud Name:", process.env.CLOUDINARY_NAME);
    console.log("API Key:", process.env.CLOUDINARY_API_KEY);
    
    try {
        const result = await cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", {
            folder: "test",
        });
        console.log("✅ Upload Success!");
        console.log("URL:", result.secure_url);
    } catch (error) {
        console.error("❌ Upload Failed!");
        console.error(error);
    }
}

testCloudinary();
