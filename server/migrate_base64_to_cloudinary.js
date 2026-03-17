// One-time migration: convert any base64 profilePicture or Cafe_photos to Cloudinary URLs
require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('./config/cloudinary');

async function uploadBase64ToCloudinary(base64String, folder) {
    if (!base64String || typeof base64String !== 'string') return '';
    if (base64String.startsWith('http://') || base64String.startsWith('https://')) return base64String;
    if (!base64String.startsWith('data:')) return '';
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
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const cafes = await db.collection('caves').find({}).toArray();

    console.log(`Found ${cafes.length} cafes to check...`);

    for (const cafe of cafes) {
        let updated = false;
        const updates = {};

        // Convert base64 profilePicture to Cloudinary
        if (cafe.profilePicture && typeof cafe.profilePicture === 'string' && cafe.profilePicture.startsWith('data:')) {
            console.log(`[${cafe.Name}] Uploading base64 profilePicture (${cafe.profilePicture.length} chars) to Cloudinary...`);
            const url = await uploadBase64ToCloudinary(cafe.profilePicture, 'cafes/profiles');
            if (url) {
                updates.profilePicture = url;
                updated = true;
                console.log(`  -> Uploaded: ${url}`);
            } else {
                console.log(`  -> FAILED to upload`);
            }
        }

        // Convert base64 Cafe_photos to Cloudinary
        if (Array.isArray(cafe.Cafe_photos) && cafe.Cafe_photos.length > 0) {
            const newPhotos = [];
            let photoUpdated = false;
            for (let i = 0; i < cafe.Cafe_photos.length; i++) {
                const photo = cafe.Cafe_photos[i];
                if (typeof photo === 'string' && photo.startsWith('data:')) {
                    console.log(`[${cafe.Name}] Uploading base64 Cafe_photo[${i}] to Cloudinary...`);
                    const url = await uploadBase64ToCloudinary(photo, 'cafes/photos');
                    if (url) {
                        newPhotos.push(url);
                        photoUpdated = true;
                        console.log(`  -> Uploaded: ${url}`);
                    }
                } else {
                    newPhotos.push(photo);
                }
            }
            if (photoUpdated) {
                updates.Cafe_photos = newPhotos;
                updated = true;
            }
        }

        if (updated) {
            await db.collection('caves').updateOne({ _id: cafe._id }, { $set: updates });
            console.log(`[${cafe.Name}] Updated in database!`);
        } else {
            console.log(`[${cafe.Name}] No base64 images to convert`);
        }
    }

    console.log('\nMigration complete!');
    await mongoose.disconnect();
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
