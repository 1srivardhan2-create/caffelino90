const mongoose = require("mongoose");
require("dotenv").config();

async function inspectCaves() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const caves = await mongoose.connection.db.collection("caves").find({}).toArray();
        
        const summary = caves.map(c => ({
            id: c._id,
            name: c.Name,
            status: c.status,
            hasProfilePicture: !!c.profilePicture,
            profilePictureType: c.profilePicture ? (c.profilePicture.startsWith("data:") ? "base64" : (c.profilePicture.startsWith("http") ? "url" : "other")) : "none",
            profilePictureLength: c.profilePicture ? c.profilePicture.length : 0,
            photoCount: c.Cafe_photos ? c.Cafe_photos.length : 0,
            photos: c.Cafe_photos ? c.Cafe_photos.map(p => p.slice(0, 30) + "...") : []
        }));

        const fs = require("fs");
        fs.writeFileSync("c_inspection.json", JSON.stringify(summary, null, 2));
        console.log("Written to c_inspection.json");
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectCaves();
