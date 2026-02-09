const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
    let CertificateRegistry;
    let certificateRegistry;
    let owner;
    let issuer;
    let otherAccount;

    beforeEach(async function () {
        [owner, issuer, otherAccount] = await ethers.getSigners();

        // Deploy contract
        CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
        certificateRegistry = await CertificateRegistry.deploy();

        // Add issuer
        await certificateRegistry.addIssuer(issuer.address);
    });

    it("Should allow authorized issuer to issue a certificate", async function () {
        const certHash = ethers.encodeBytes32String("cert123");
        const ipfsHash = "QmTest123";
        const studentId = "student1";

        await certificateRegistry.connect(issuer).issueCertificate(certHash, ipfsHash, studentId);

        const cert = await certificateRegistry.verifyCertificate(certHash);
        expect(cert[0]).to.equal(true); // isValid
        expect(cert[1]).to.equal(ipfsHash);
        expect(cert[2]).to.equal(issuer.address);
    });

    it("Should not allow unauthorized user to issue", async function () {
        const certHash = ethers.encodeBytes32String("cert456");
        await expect(
            certificateRegistry.connect(otherAccount).issueCertificate(certHash, "QmTest", "student2")
        ).to.be.revertedWith("Only authorized issuer can perform this action");
    });

    it("Should allow issuer to revoke a certificate", async function () {
        const certHash = ethers.encodeBytes32String("certRevoke");
        await certificateRegistry.connect(issuer).issueCertificate(certHash, "QmRevoke", "student3");

        await certificateRegistry.connect(issuer).revokeCertificate(certHash);

        const cert = await certificateRegistry.verifyCertificate(certHash);
        expect(cert[0]).to.equal(false); // isValid should be false
    });

    it("Should not allow access to non-existent certificates", async function () {
        const certHash = ethers.encodeBytes32String("nonExistent");
        const cert = await certificateRegistry.verifyCertificate(certHash);
        expect(cert[2]).to.equal(ethers.ZeroAddress); // issuer should be empty/zero
    });
});
