const QRCode = require("qrcode");
const { uploadBuffer } = require("./uploadToCloudinary");

const generateAndUploadQRCode = async (ticketNumber) => {
    try {
        const qrBuffer = await QRCode.toBuffer(ticketNumber, {
            type: "png",
            errorCorrectionLevel: "H",
            width: 300,
            margin: 2,
        });

        const qrUrl = await uploadBuffer(qrBuffer, "events/tickets");
        return qrUrl;
    } catch (err) {
        console.error("QR Code Generation/Upload Error:", err);
        throw new Error("Failed to generate QR Code");
    }
};

module.exports = {
    generateAndUploadQRCode
};
