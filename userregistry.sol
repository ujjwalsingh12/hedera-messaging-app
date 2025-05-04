// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @notice Interface for the TrustToken contract
interface ITrustToken {
    function mintOnRegistration(address user) external;
}

/// @title UserRegistry
/// @notice Manages user registration and links to TrustToken minting
contract UserRegistry {
    /// @dev Struct to store user details
    struct User {
        string metadata;
        bool exists;
    }

    // State variables
    mapping(address => User) private users;             // maps address to user info
    mapping(uint256 => address) private indexToAddress; // maps index to address for list retrieval
    mapping(address => uint256) public reputationScore; // new: user -> reputation score

    uint256 public totalUsers;
    ITrustToken public trustToken;

    // Events
    event UserRegistered(address indexed user, string metadata);
    event ReputationUpdated(address indexed user, uint256 newScore); // new

    /// @notice Constructor to initialize TrustToken address
    constructor(address _trustToken) {
        trustToken = ITrustToken(_trustToken);
    }

    /// @notice Validates if the metadata is a basic JSON string (e.g. starts with `{` and ends with `}`)
    function isValidJson(string memory metadata) internal pure returns (bool) {
        bytes memory metadataBytes = bytes(metadata);
        return metadataBytes.length > 2 &&
               metadataBytes[0] == '{' &&
               metadataBytes[metadataBytes.length - 1] == '}';
    }

    /// @notice Registers a user and mints TrustTokens
    /// @param metadata User metadata in JSON format
    function registerUser(string memory metadata) public {
        require(!users[msg.sender].exists, "User already registered");

        // If metadata is empty, set default
        if (bytes(metadata).length == 0) {
            metadata = '{"user":"default"}';
        }

        require(isValidJson(metadata), "Invalid JSON format");

        // Save user
        users[msg.sender] = User({
            metadata: metadata,
            exists: true
        });

        // Add to index mapping
        indexToAddress[totalUsers] = msg.sender;
        totalUsers++;

        // Mint TrustToken to this user
        trustToken.mintOnRegistration(msg.sender);

        // Initialize reputation score
        reputationScore[msg.sender] = 0;

        emit UserRegistered(msg.sender, metadata);
    }

    /// @notice Returns metadata of a given user
    function getUserMetadata(address user) public view returns (string memory) {
        require(users[user].exists, "User not registered");
        return users[user].metadata;
    }

    /// @notice Returns whether a user is registered
    function isRegistered(address user) public view returns (bool) {
        return users[user].exists;
    }

    /// @notice Returns the list of all registered user addresses
    function getAllUsers() public view returns (address[] memory userList) {
        address[] memory result = new address[](totalUsers);
        for (uint256 i = 0; i < totalUsers; i++) {
            result[i] = indexToAddress[i];
        }
        return result;
    }

    /// @notice Updates reviewer's reputation after upvote/downvote and burns token externally
    /// @param reviewer The user who wrote the review
    /// @param isUpvote True for upvote, false for downvote
    /// @param voter The address of the voter
    function updateReputationOnVote(address reviewer, bool isUpvote, address voter) external {
        require(users[reviewer].exists, "Reviewer not registered");
        require(users[voter].exists, "Voter not registered");

        uint256 voterRep = reputationScore[voter];
        uint256 delta = voterRep / 10;

        if (isUpvote) {
            reputationScore[reviewer] += delta;
        } else {
            if (reputationScore[reviewer] >= delta) {
                reputationScore[reviewer] -= delta;
            } else {
                reputationScore[reviewer] = 0;
            }
        }

        emit ReputationUpdated(reviewer, reputationScore[reviewer]);
    }
}
