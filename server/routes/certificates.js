const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const Certificate = require('../models/Certificate');
const { calculateHash } = require('../utils/crypto');
const { uploadToIPFS } = require('../utils/ipfs');
const { generateQRCode } = require('../utils/qrcode');
const { issueCertificateOnChain, verifyCertificateOnChain, revokeCertificateOnChain } = require('../utils/blockchain');

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/temp/' });

// @route   POST /api/issue
// @desc    Issue a new certificate (Upload PDF + Data)
router.post('/issue', upload.single('certificate'), async (req, res) => {
    try {
        const { studentName, studentId, course, issuer } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ msg: 'No file uploaded' });

        const fileBuffer = fs.readFileSync(file.path);

        // 1. Calculate Hash (Double SHA-256 with Salt/ID)
        // Using studentId as salt for simplicity
        const certificateHash = calculateHash(fileBuffer, studentId);

        // 2. Upload to IPFS (Mock)
        const ipfsHash = await uploadToIPFS(fileBuffer);

        // 3. Store in Blockchain
        // Note: In production, we'd wait for tx confirmation or handle async.
        // For now, we await it.
        const txHash = await issueCertificateOnChain(certificateHash, ipfsHash, studentId);

        // 4. Store in Database
        // Check if already exists
        let cert = await Certificate.findOne({ certificateHash });
        if (cert) {
            fs.unlinkSync(file.path);
            return res.status(400).json({ msg: 'Certificate already issued' });
        }

        cert = new Certificate({
            studentName,
            studentId,
            course,
            issuer,
            ipfsHash,
            certificateHash,
            txHash
        });

        await cert.save();

        // Generate QR Code
        const verificationUrl = `http://localhost:5173/verify?hash=${certificateHash}`;
        const qrCode = await generateQRCode(verificationUrl);

        // Clean up temp file
        fs.unlinkSync(file.path);

        res.json({
            msg: 'Certificate processed successfully',
            certificateHash,
            ipfsHash,
            qrCode
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/verify
// @desc    Verify a certificate by uploading PDF
router.post('/verify', upload.single('certificate'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ msg: 'No file uploaded' });

        // We need studentId to reconstruct the hash if salt was used. 
        // If the verifier doesn't know the ID, we can't reproduce the hash unless the salt is embedded or standard.
        // Requirement: "content + a salt containing the student's unique ID".
        // If verifier just has the PDF, they don't know the ID?
        // Usually, the ID is valid input from the user (e.g. they enter ID + upload PDF).
        // Let's assume user provides ID or it's extracted?
        // For now, let's assume the request body includes studentId.

        const { studentId } = req.body;
        if (!studentId) {
            fs.unlinkSync(file.path);
            return res.status(400).json({ msg: 'Student ID required for verification' });
        }

        const fileBuffer = fs.readFileSync(file.path);
        const certificateHash = calculateHash(fileBuffer, studentId);

        // Check DB (Off-chain) - OR check Blockchain
        // Real logic: Query Smart Contract.
        // Here we query DB as a proxy for now, but usually we return the hash so frontend can call smart contract.

        // Check Blockchain Verification
        const onChainData = await verifyCertificateOnChain(certificateHash);

        // Check DB (as fallback or additional data source)
        const cert = await Certificate.findOne({ certificateHash });

        fs.unlinkSync(file.path);

        // Prioritize Blockchain Result if valid
        if (onChainData && onChainData.isValid) {
            return res.json({
                status: 'Valid',
                certificate: {
                    studentName: cert ? cert.studentName : 'Unknown (Blockchain only)',
                    course: cert ? cert.course : 'Unknown',
                    issuer: onChainData.issuer,
                    issueDate: onChainData.issueDate
                },
                source: 'Blockchain'
            });
        }

        // Fallback to DB if Blockchain fails (Mock mode will return null)
        if (cert) {
            if (cert.isRevoked) {
                return res.json({ status: 'Revoked', msg: 'Certificate has been revoked' });
            }
            return res.json({
                status: 'Valid',
                certificate: cert,
                source: 'Database (Off-chain Fallback)'
            });
        }

        return res.json({ status: 'Invalid', msg: 'No record found' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST /api/revoke
// @desc    Revoke a certificate
router.post('/revoke', async (req, res) => {
    try {
        const { certificateHash } = req.body;
        if (!certificateHash) return res.status(400).json({ msg: 'Certificate Hash required' });

        // 1. Revoke on Blockchain
        const txHash = await revokeCertificateOnChain(certificateHash);

        // 2. Update status in Database
        let cert = await Certificate.findOne({ certificateHash });
        if (!cert) return res.status(404).json({ msg: 'Certificate not found' });

        cert.isRevoked = true;
        cert.revocationTxHash = txHash; // Assuming schema supports this or we just ignore
        await cert.save();

        res.json({ msg: 'Certificate revoked successfully', txHash });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
