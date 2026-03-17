require('dotenv').config();
const { MongoClient } = require('mongodb');

async function test() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        console.log('Connected to native driver');
        const db = client.db('caffelino');
        
        const start = Date.now();
        console.log('Fetching from caves...');
        const result = await db.collection('caves').find({ status: true }).limit(5).toArray();
        console.log(`Got ${result.length} cafes via native driver in ${Date.now()-start}ms`);
        
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await client.close();
        process.exit(0);
    }
}
test();
