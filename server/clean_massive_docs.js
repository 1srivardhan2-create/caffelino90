require('dotenv').config();
const { MongoClient } = require('mongodb');

async function cleanMassiveDocs() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db('caffelino');
        
        console.log('Finding massive documents (>1MB)...');
        
        // Find docs with size > 1MB using aggregation
        const massiveDocsCursor = await db.collection('caves').aggregate([
            {
                $project: {
                    docSize: { $bsonSize: "$$ROOT" }
                }
            },
            {
                $match: {
                    docSize: { $gt: 1048576 } // > 1 MB
                }
            }
        ]).toArray();
        
        console.log(`Found ${massiveDocsCursor.length} massive documents.`);
        
        for (let doc of massiveDocsCursor) {
            console.log(`Deleting document ID: ${doc._id} (Size: ${(doc.docSize/1024/1024).toFixed(2)} MB)...`);
            await db.collection('caves').deleteOne({ _id: doc._id });
            console.log(`Deleted successfully.`);
        }
        
    } catch(e) {
        console.error('Error:', e);
    } finally {
        await client.close();
        process.exit(0);
    }
}
cleanMassiveDocs();
