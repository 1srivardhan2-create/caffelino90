require('dotenv').config();
const { MongoClient } = require('mongodb');

async function test() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('caffelino');
        
        console.log('Fetching caves (name only)...');
        const start = Date.now();
        const result = await db.collection('caves').find({ status: true }).project({ Name: 1 }).limit(5).toArray();
        console.log(`Got ${result.length} cafes in ${Date.now()-start}ms:`, result);
        
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await client.close();
        process.exit(0);
    }
}
test();
