require('dotenv').config();
const { MongoClient } = require('mongodb');

async function fix() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('caffelino');
        
        console.log('Clearing massive base64 images from caves...');
        const result = await db.collection('caves').updateMany(
            {}, 
            { $set: { "profilePicture": "", "Cafe_photos": [], "upi_photo": "" } }
        );
        console.log(`Updated ${result.modifiedCount} cafes to remove massive strings.`);
        
        const stats = await db.command({ collStats: 'caves' });
        console.log('New Stats:', stats.count, stats.size);
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await client.close();
        process.exit(0);
    }
}
fix();
