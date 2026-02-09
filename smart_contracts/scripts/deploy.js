const hre = require("hardhat");

async function main() {
    const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
    const certificateRegistry = await CertificateRegistry.deploy();

    await certificateRegistry.waitForDeployment();

    console.log("CertificateRegistry deployed to:", await certificateRegistry.getAddress());

    // Optional: Save address to frontend/backend config
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
