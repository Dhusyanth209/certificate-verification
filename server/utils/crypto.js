const crypto = require('crypto');

/**
 * Generates a Double SHA-256 hash of the file buffer + salt.
 * @param {Buffer} fileBuffer - The file content.
 * @param {string} salt - Unique student ID or salt.
 * @returns {string} - The hex string of the hash.
 */
function calculateHash(fileBuffer, salt) {
    const firstHash = crypto.createHash('sha256').update(fileBuffer).digest();
    const saltedBuffer = Buffer.concat([firstHash, Buffer.from(salt)]);
    const finalHash = crypto.createHash('sha256').update(saltedBuffer).digest('hex');
    return '0x' + finalHash; // Format for Solidity bytes32
}

module.exports = { calculateHash };
