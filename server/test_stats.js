require('dotenv').config();
const { MongoClient } = require('mongodb');

async function test() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('caffelino');
        
        console.log('Fetching collections...');
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name).join(', '));
        
        console.log('Fetching caves stats...');
        const stats = await db.command({ collStats: 'caves' });
        console.log('Stats:', stats.count, stats.size);
        
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await client.close();
        process.exit(0);
    }
}
test();
