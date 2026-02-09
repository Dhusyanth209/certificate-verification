// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CertificateRegistry {
    struct Certificate {
        string ipfsHash;
        string studentId;
        address issuer;
        uint256 issueDate;
        bool isValid;
    }

    mapping(bytes32 => Certificate) public certificates;
    mapping(address => bool) public authorizedIssuers;
    address public admin;

    event CertificateIssued(bytes32 indexed certificateHash, string ipfsHash, address indexed issuer);
    event CertificateRevoked(bytes32 indexed certificateHash, address indexed revoker);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Only authorized issuer can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        authorizedIssuers[msg.sender] = true; // Admin is also an issuer for simplicity
    }

    function addIssuer(address _issuer) external onlyAdmin {
        authorizedIssuers[_issuer] = true;
    }

    function removeIssuer(address _issuer) external onlyAdmin {
        authorizedIssuers[_issuer] = false;
    }

    function issueCertificate(bytes32 _certificateHash, string memory _ipfsHash, string memory _studentId) external onlyIssuer {
        require(certificates[_certificateHash].issueDate == 0, "Certificate already exists");
        
        certificates[_certificateHash] = Certificate({
            ipfsHash: _ipfsHash,
            studentId: _studentId,
            issuer: msg.sender,
            issueDate: block.timestamp,
            isValid: true
        });

        emit CertificateIssued(_certificateHash, _ipfsHash, msg.sender);
    }

    function revokeCertificate(bytes32 _certificateHash) external onlyIssuer {
        require(certificates[_certificateHash].isValid, "Certificate already revoked or does not exist");
        // Optional: specific issuer check? Usually issuer or admin can revoke.
        require(certificates[_certificateHash].issuer == msg.sender || msg.sender == admin, "Not authorized to revoke");

        certificates[_certificateHash].isValid = false;
        emit CertificateRevoked(_certificateHash, msg.sender);
    }

    function verifyCertificate(bytes32 _certificateHash) external view returns (bool, string memory, address, uint256) {
        Certificate memory cert = certificates[_certificateHash];
        return (cert.isValid, cert.ipfsHash, cert.issuer, cert.issueDate);
    }
}
