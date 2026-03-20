require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const Cafe = require('./models/Cafe/Cafe_login');
    const CafeMenu = require('./models/Cafe/cafe_menu');
    
    const cafes = await Cafe.find({ status: true }).select('Name profilePicture Cafe_photos ownerId _id').lean();
    const menuItems = await CafeMenu.find({}).select('item_name image_url cafe_owner available').lean();
    
    const lines = [];
    lines.push(`CAFES: ${cafes.length}`);
    cafes.forEach(c => {
        const pp = c.profilePicture || '';
        const ppType = pp.startsWith('http') ? 'URL' : pp.startsWith('data:') ? 'BASE64' : pp.startsWith('/uploads') ? 'LOCAL' : (pp ? 'OTHER' : 'EMPTY');
        lines.push(`CAFE: ${c.Name} | _id: ${c._id} | ownerId: ${c.ownerId || 'NONE'} | profilePic: ${ppType} | photos: ${(c.Cafe_photos||[]).length}`);
        (c.Cafe_photos || []).forEach((p, i) => {
            const pType = p.startsWith('http') ? 'URL' : p.startsWith('data:') ? 'BASE64' : p.startsWith('/uploads') ? 'LOCAL' : (p ? 'OTHER' : 'EMPTY');
            lines.push(`  photo[${i}]: ${pType} ${p.startsWith('http') ? p.substring(0,80) : p.substring(0,40)}`);
        });
    });
    
    lines.push(`\nMENU ITEMS: ${menuItems.length}`);
    menuItems.forEach(m => {
        const img = m.image_url || '';
        const imgType = img.startsWith('http') ? 'URL' : img.startsWith('data:') ? 'BASE64' : img.startsWith('/uploads') ? 'LOCAL' : (img ? 'OTHER' : 'EMPTY');
        lines.push(`ITEM: ${m.item_name} | owner: ${m.cafe_owner} | avail: ${m.available} | img: ${imgType} ${img.startsWith('http') ? img.substring(0,80) : ''}`);
    });
    
    lines.push(`\nMATCHING:`);
    const cafeIds = cafes.map(c => c._id.toString());
    menuItems.forEach(m => {
        const ownerStr = m.cafe_owner?.toString();
        lines.push(`  ${m.item_name}: owner=${ownerStr} match=${cafeIds.includes(ownerStr)}`);
    });
    
    const output = lines.join('\n');
    fs.writeFileSync('debug_result.txt', output, 'utf8');
    console.log(output);
    
    await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
