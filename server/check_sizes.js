require('dotenv').config();
const { MongoClient } = require('mongodb');

async function checkSizes() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('caffelino');
        
        console.log('Fetching documents metadata...');
        const cursor = db.collection('caves').find({});
        const docs = await cursor.toArray();
        console.log(`Found ${docs.length} total documents in caves collection.`);
        
        for (let doc of docs) {
            let pPicLen = doc.profilePicture ? doc.profilePicture.length : 0;
            let photosLen = doc.Cafe_photos ? JSON.stringify(doc.Cafe_photos).length : 0;
            let upiLen = doc.upi_photo ? doc.upi_photo.length : 0;
            
            console.log(`- ID: ${doc._id}, Name: ${doc.Name}`);
            console.log(`    profilePicture length: ${pPicLen} characters`);
            console.log(`    Cafe_photos length: ${photosLen} characters`);
            console.log(`    upi_photo length: ${upiLen} characters`);
            
            if (pPicLen > 100000 || photosLen > 100000 || upiLen > 100000) {
                console.log(`    ⚠️  WARNING: MASSIVE STRING DETECTED! Clearing it now...`);
                await db.collection('caves').updateOne(
                    { _id: doc._id },
                    { $set: { "profilePicture": "", "Cafe_photos": [], "upi_photo": "" } }
                );
                console.log(`    ✅ Cleared massive strings for ${doc._id}`);
            }
        }
        
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await client.close();
        process.exit(0);
    }
}
checkSizes();
