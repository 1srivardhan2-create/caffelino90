require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testStats() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('caffelino');
        
        const stats = await db.command({ collStats: 'caves' });
        console.log(`Total Docs: ${stats.count}`);
        console.log(`Total Size: ${stats.size} bytes (${(stats.size/1024).toFixed(2)} KB)`);
        console.log(`Avg Obj Size: ${stats.avgObjSize} bytes`);
        
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await client.close();
        process.exit(0);
    }
}
testStats();
