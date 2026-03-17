require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

async function check() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('caffelino');
        const doc = await db.collection('caves').findOne(
            { _id: new ObjectId('69b6dc71a62103ca09058418') },
            { projection: { Cafe_photos: 1, profilePicture: 1 } }
        );
        
        if (!doc) {
            console.log('Document not found!');
            return;
        }

        const pp = typeof doc.profilePicture === 'string' ? doc.profilePicture.length : 0;
        const isBase64Profile = typeof doc.profilePicture === 'string' && doc.profilePicture.startsWith('data:');
        
        console.log('profilePicture length:', pp);
        console.log('profilePicture isBase64:', isBase64Profile);
        console.log('profilePicture starts:', (doc.profilePicture || '').substring(0, 80));
        
        if (Array.isArray(doc.Cafe_photos)) {
            console.log('Cafe_photos count:', doc.Cafe_photos.length);
            doc.Cafe_photos.forEach((p, i) => {
                const len = typeof p === 'string' ? p.length : 0;
                const isB64 = typeof p === 'string' && p.startsWith('data:');
                console.log(`  Photo[${i}] length=${len} isBase64=${isB64} starts=${(p || '').substring(0, 60)}`);
            });
        } else {
            console.log('Cafe_photos: not an array or missing');
        }
    } catch(e) {
        console.error('Error:', e.message);
    } finally {
        await client.close();
        process.exit(0);
    }
}
check();
