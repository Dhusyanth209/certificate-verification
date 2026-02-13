const hre = require("hardhat");

async function main() {
    const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
    const certificateRegistry = await CertificateRegistry.deploy();

    await certificateRegistry.waitForDeployment();

    const address = await certificateRegistry.getAddress();
    console.log("CertificateRegistry deployed to:", address);

    // Save address to server config
    const fs = require("fs");
    const path = require("path");
    const configDir = path.join(__dirname, "../../server/config");

    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(configDir, "contract-address.json"),
        JSON.stringify({ address }, null, 2)
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
