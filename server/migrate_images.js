// One-time migration: Upload existing Base64 images in caves collection to Cloudinary
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const cloudinary = require('./config/cloudinary');

async function uploadBase64(base64String, folder) {
    if (!base64String || typeof base64String !== 'string') return '';
    if (base64String.startsWith('http://') || base64String.startsWith('https://')) return base64String;
    if (!base64String.startsWith('data:')) return '';
    try {
        const result = await cloudinary.uploader.upload(base64String, {
            folder,
            resource_type: 'image',
        });
        console.log(`  ✅ Uploaded to ${result.secure_url.substring(0, 60)}...`);
        return result.secure_url;
    } catch (err) {
        console.error(`  ❌ Upload failed:`, err.message);
        return '';
    }
}

async function migrate() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('caffelino');
        const collection = db.collection('caves');

        const docs = await collection.find({}).toArray();
        console.log(`Found ${docs.length} cafe documents to check.\n`);

        for (const doc of docs) {
            let needsUpdate = false;
            const updates = {};

            // Check profilePicture
            if (doc.profilePicture && typeof doc.profilePicture === 'string' && doc.profilePicture.startsWith('data:')) {
                console.log(`[${doc.Name}] Uploading profilePicture (${doc.profilePicture.length} chars)...`);
                const url = await uploadBase64(doc.profilePicture, 'cafes/profiles');
                if (url) {
                    updates.profilePicture = url;
                    needsUpdate = true;
                }
            }

            // Check Cafe_photos array
            if (Array.isArray(doc.Cafe_photos)) {
                const newPhotos = [];
                let photosChanged = false;
                for (let i = 0; i < doc.Cafe_photos.length; i++) {
                    const photo = doc.Cafe_photos[i];
                    if (typeof photo === 'string' && photo.startsWith('data:')) {
                        console.log(`[${doc.Name}] Uploading Cafe_photos[${i}] (${photo.length} chars)...`);
                        const url = await uploadBase64(photo, 'cafes/photos');
                        newPhotos.push(url || '');
                        photosChanged = true;
                    } else {
                        newPhotos.push(photo);
                    }
                }
                if (photosChanged) {
                    updates.Cafe_photos = newPhotos.filter(u => u); // Remove empty strings
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                await collection.updateOne({ _id: doc._id }, { $set: updates });
                console.log(`✅ Updated ${doc.Name} in database.\n`);
            } else {
                console.log(`⏭️  ${doc.Name} — no Base64 images found, skipping.\n`);
            }
        }

        console.log('🎉 Migration complete!');
    } catch (e) {
        console.error('Migration error:', e);
    } finally {
        await client.close();
        process.exit(0);
    }
}

migrate();
