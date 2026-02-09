const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    course: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    issuer: { type: String, required: true }, // Institution Name or Address
    ipfsHash: { type: String, required: true },
    certificateHash: { type: String, required: true, unique: true },
    txHash: { type: String }, // Blockchain Transaction Hash
    isRevoked: { type: Boolean, default: false }
});

module.exports = mongoose.model('Certificate', CertificateSchema);
