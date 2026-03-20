const multer = require("multer");
const path = require("path");

// Memory storage: keeps files in memory as Buffer objects
// This allows uploading to Cloudinary via file.buffer
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed"));
        }
    },
});

module.exports = upload;

