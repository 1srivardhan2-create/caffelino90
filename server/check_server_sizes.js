require('dotenv').config();
const { MongoClient } = require('mongodb');

async function checkServerSizes() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('caffelino');
        
        console.log('Running aggregation to get document sizes on server...');
        const pipeline = [
            {
                $project: {
                    Name: 1,
                    docSize: { $bsonSize: "$$ROOT" }
                }
            },
            {
                $sort: { docSize: -1 }
            }
        ];
        
        const docs = await db.collection('caves').aggregate(pipeline).toArray();
        console.log(`Found ${docs.length} documents.`);
        
        for (let doc of docs) {
            console.log(`- ID: ${doc._id}, Name: ${doc.Name}, Size: ${(doc.docSize / 1024 / 1024).toFixed(2)} MB`);
        }
        
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await client.close();
        process.exit(0);
    }
}
checkServerSizes();
