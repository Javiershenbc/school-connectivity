// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SchoolConnectivityAC is AccessControl {
    bytes32 public constant DATA_SUBMITTER_ROLE =
        keccak256("DATA_SUBMITTER_ROLE");

    struct ConnectivityData {
        uint256 timestamp; // The timestamp when the data was recorded
        uint32 downloadSpeed; // Download speed in Mbps
        uint32 uploadSpeed; // Upload speed in Mbps
        uint32 latency; // Latency in milliseconds
        bytes32 dataHash; // Hash of the data for verification
    }

    mapping(uint256 => ConnectivityData) private latestData; // Store only the latest data on-chain

    event DataSubmitted(
        uint256 indexed schoolId,
        uint256 timestamp,
        uint32 downloadSpeed,
        uint32 uploadSpeed,
        uint32 latency,
        bytes32 dataHash
    );

    // Modifier to validate that the data values are greater than zero
    modifier validData(
        uint32 downloadSpeed,
        uint32 uploadSpeed,
        uint32 latency
    ) {
        require(downloadSpeed > 0, "Download speed must be greater than 0");
        require(uploadSpeed > 0, "Upload speed must be greater than 0");
        require(latency > 0, "Latency must be greater than 0");
        require(downloadSpeed <= 10000, "Download speed exceeds maximum limit");
        require(uploadSpeed <= 10000, "Upload speed exceeds maximum limit");
        require(latency <= 10000, "Latency exceeds maximum limit");
        _; // Continue execution of the function
    }

    // Constructor to set up roles
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Function to grant the DATA_SUBMITTER_ROLE to an account
    function grantDataSubmitterRole(address account) external {
        grantRole(DATA_SUBMITTER_ROLE, account);
    }

    function submitData(
        uint256 schoolId,
        uint256 timestamp,
        uint32 downloadSpeed,
        uint32 uploadSpeed,
        uint32 latency,
        bytes32 dataHash
    )
        external
        validData(downloadSpeed, uploadSpeed, latency)
        onlyRole(DATA_SUBMITTER_ROLE)
    {
        // Prevent duplicate entries for the same school and timestamp
        if (latestData[schoolId].timestamp == timestamp) {
            revert("Duplicate entry for the same timestamp");
        }

        // Update the latest data entry on-chain
        latestData[schoolId] = ConnectivityData(
            timestamp,
            downloadSpeed,
            uploadSpeed,
            latency,
            dataHash
        );

        // Emit an event for off-chain storage and tracking
        emit DataSubmitted(
            schoolId,
            timestamp,
            downloadSpeed,
            uploadSpeed,
            latency,
            dataHash
        );
    }

    function getLatestData(
        uint256 schoolId
    ) external view returns (ConnectivityData memory) {
        return latestData[schoolId]; // Return the latest data stored on-chain for the school
    }
}
