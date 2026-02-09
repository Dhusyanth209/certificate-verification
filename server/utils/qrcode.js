const QRCode = require('qrcode');

/**
 * Generates a QR Code Data URL.
 * @param {string} text - The text/URL to encode.
 * @returns {Promise<string>} - The QR Code as a Data URL.
 */
async function generateQRCode(text) {
    try {
        return await QRCode.toDataURL(text);
    } catch (err) {
        console.error("QR Code Generation Error:", err);
        return null;
    }
}

module.exports = { generateQRCode };
