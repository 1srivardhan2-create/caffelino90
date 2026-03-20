require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('./config/cloudinary');

async function uploadBase64(base64Str, folder) {
    try {
        const result = await cloudinary.uploader.upload(base64Str, { folder, resource_type: 'image' });
        return result.secure_url;
    } catch (err) {
        console.error('Cloudinary error:', err.message);
        return null;
    }
}

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. Migrate Cafe Menu Items
    const CafeMenu = require('./models/Cafe/cafe_menu');
    const menuItems = await CafeMenu.find({});
    let menuUpdated = 0;
    
    for (const item of menuItems) {
        if (item.image_url && item.image_url.startsWith('data:image/')) {
            console.log(`Migrating menu item Base64: ${item.item_name}`);
            const newUrl = await uploadBase64(item.image_url, 'cafes/menu');
            if (newUrl) {
                item.image_url = newUrl;
                await item.save();
                menuUpdated++;
                console.log(` -> SUCCESS: ${newUrl}`);
            } else {
                console.log(` -> FAILED to upload`);
            }
        }
    }
    
    // 2. Migrate Cafe Photos & Profile Pictures
    const Cafe = require('./models/Cafe/Cafe_login');
    const cafes = await Cafe.find({});
    let cafeUpdated = 0;
    
    for (const cafe of cafes) {
        let changed = false;
        
        if (cafe.profilePicture && cafe.profilePicture.startsWith('data:image/')) {
            console.log(`Migrating cafe profilePic Base64: ${cafe.Name}`);
            const newUrl = await uploadBase64(cafe.profilePicture, 'cafes/profiles');
            if (newUrl) {
                cafe.profilePicture = newUrl;
                changed = true;
                console.log(` -> SUCCESS ProfilePic: ${newUrl}`);
            }
        }
        
        if (cafe.Cafe_photos && cafe.Cafe_photos.length > 0) {
            const newPhotos = [];
            for (let i = 0; i < cafe.Cafe_photos.length; i++) {
                const photo = cafe.Cafe_photos[i];
                if (photo && photo.startsWith('data:image/')) {
                    console.log(`Migrating cafe photo[${i}] Base64: ${cafe.Name}`);
                    const newUrl = await uploadBase64(photo, 'cafes/photos');
                    if (newUrl) {
                        newPhotos.push(newUrl);
                        changed = true;
                        console.log(` -> SUCCESS Photo: ${newUrl}`);
                    } else {
                        newPhotos.push(photo); // fallback to original if fail
                    }
                } else {
                    newPhotos.push(photo);
                }
            }
            if (changed) {
                cafe.Cafe_photos = newPhotos;
            }
        }
        
        if (changed) {
            await cafe.save();
            cafeUpdated++;
        }
    }
    
    console.log(`\nMigration Complete!`);
    console.log(`Menu Items migrated: ${menuUpdated}`);
    console.log(`Cafes migrated: ${cafeUpdated}`);
    
    await mongoose.disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
