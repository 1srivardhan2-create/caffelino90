require('dotenv').config();
const { MongoClient } = require('mongodb');

async function check() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('caffelino');
        const docs = await db.collection('caves').find({}, {
            projection: { Name: 1, status: 1, verified: 1, ownerId: 1, Cafe_photos: 1, profilePicture: 1 }
        }).toArray();
        console.log(`Total cafe docs: ${docs.length}`);
        docs.forEach((d, i) => {
            const photosInfo = Array.isArray(d.Cafe_photos)
                ? `${d.Cafe_photos.length} photos, first=${typeof d.Cafe_photos[0] === 'string' ? (d.Cafe_photos[0].substring(0,50) + '...') : 'N/A'}`
                : 'none';
            const profileInfo = typeof d.profilePicture === 'string'
                ? d.profilePicture.substring(0, 50) + '...'
                : 'none';
            console.log(`[${i}] _id=${d._id} Name=${d.Name} status=${d.status} verified=${d.verified} ownerId=${d.ownerId}`);
            console.log(`    photos: ${photosInfo}`);
            console.log(`    profile: ${profileInfo}`);
        });
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await client.close();
        process.exit(0);
    }
}
check();
