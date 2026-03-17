const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const cafes = await db.collection('cafe_registrations').find({ status: true })
        .project({ Name: 1, Cafe_photos: 1, profilePicture: 1 }).toArray();
    
    const results = [];
    for (const c of cafes) {
        const pLen = Array.isArray(c.Cafe_photos) ? c.Cafe_photos.length : 0;
        let fp = 'EMPTY';
        if (pLen > 0) {
            const first = c.Cafe_photos[0];
            if (typeof first === 'string') {
                if (first.startsWith('data:')) fp = 'BASE64(' + first.length + ')';
                else if (first.startsWith('http')) fp = first.substring(0, 100);
                else fp = first.substring(0, 60);
            }
        }
        let pp = 'NONE';
        if (c.profilePicture) {
            if (typeof c.profilePicture === 'string') {
                if (c.profilePicture.startsWith('data:')) pp = 'BASE64(' + c.profilePicture.length + ')';
                else if (c.profilePicture.startsWith('http')) pp = c.profilePicture.substring(0, 100);
                else pp = c.profilePicture.substring(0, 60);
            } else {
                pp = 'OBJECT_OR_ARRAY';
            }
        }
        results.push(c.Name + ' | photos=' + pLen + ' | 1st=' + fp + ' | profPic=' + pp);
    }
    require('fs').writeFileSync('cafe_photos_result2.txt', results.join('\n'));
    console.log('Written to cafe_photos_result2.txt');
    process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
