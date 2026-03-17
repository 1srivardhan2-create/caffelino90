require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testCount() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('caffelino');
        
        const count = await db.collection('caves').countDocuments();
        console.log(`Total documents: ${count}`);
        
        const docs = await db.collection('caves').find({}).project({ _id: 1, Name: 1 }).toArray();
        console.log(docs);
        
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await client.close();
        process.exit(0);
    }
}
testCount();
