const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const IPFS_STORAGE_DIR = path.join(__dirname, '../uploads/ipfs');

if (!fs.existsSync(IPFS_STORAGE_DIR)) {
    fs.mkdirSync(IPFS_STORAGE_DIR, { recursive: true });
}

/**
 * Mocks IPFS upload by saving file locally and returning a fake CID (SHA-256 of content).
 * @param {Buffer} fileBuffer 
 * @returns {Promise<string>} - The CID.
 */
async function uploadToIPFS(fileBuffer) {
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    // Simulate IPFS CID structure (Qm...)
    const cid = `QmMock${hash.substring(0, 40)}`;

    const filePath = path.join(IPFS_STORAGE_DIR, cid);
    fs.writeFileSync(filePath, fileBuffer);

    return cid;
}

module.exports = { uploadToIPFS };
