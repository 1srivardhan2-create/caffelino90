const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Uploads a file buffer to Cloudinary and returns the secure URL.
 * @param {Buffer} buffer - The file buffer from Multer memoryStorage
 * @param {string} folder - The Cloudinary folder to organize uploads (e.g. "cafes/photos")
 * @returns {Promise<string>} The secure HTTPS URL of the uploaded image
 */
const uploadBuffer = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        // Validate: ensure buffer exists
        if (!buffer) {
            return reject(new Error("No file buffer provided"));
        }

        // Create a Cloudinary upload stream
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return reject(error);
                }

                if (!result || !result.secure_url) {
                    return reject(new Error("Cloudinary upload failed"));
                }

                resolve(result.secure_url);
            }
        );

        // Pipe the buffer into the upload stream
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

module.exports = uploadBuffer;
