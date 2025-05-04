// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUserRegistry {
    function isRegistered(address user) external view returns (bool);
}

contract ReviewSystem {

    IUserRegistry public userRegistry;

    constructor(address _userRegistry) {
        userRegistry = IUserRegistry(_userRegistry);
    }

    // Struct for storing reviews
    struct Review {
        address reviewer;
        address product;
        string reviewText;
        uint256 upvoteCount;
    }

    // State Variables
    mapping(address => uint256) public reputation; // Tracks reputation of users
    mapping(bytes32 => mapping(address => bool)) public hasUpvoted; // Tracks upvotes to prevent double voting
    mapping(bytes32 => Review) public reviews; // Stores the review details by review ID
    mapping(address => bytes32[]) public productReviews; // Maps product to list of review IDs

    // Events
    event ReviewCreated(
        address indexed reviewer,
        address indexed product,
        bytes32 indexed reviewId,
        string reviewText,
        uint256 reputationAtReviewTime
    );

    event Upvoted(
        address indexed upvoter,
        bytes32 indexed reviewId,
        uint256 updatedUpvoteCount
    );

    // Submit a review for a product
    function submitReview(address product, string calldata reviewText) external {
        require(bytes(reviewText).length > 0, "Review text cannot be empty");

        // Check if the reviewer is a registered user
        require(userRegistry.isRegistered(msg.sender), "Reviewer must be a registered user");

        // Token ownership check can be added here (e.g., ERC-20, ERC-721)
        // require(tokenContract.balanceOf(msg.sender) > 0, "Must own the product to review");

        // Generate a unique review ID
        bytes32 reviewId = keccak256(abi.encodePacked(msg.sender, product, block.timestamp));

        // Store the review
        reviews[reviewId] = Review({
            reviewer: msg.sender,
            product: product,
            reviewText: reviewText,
            upvoteCount: 0
        });

        // Associate with product
        productReviews[product].push(reviewId);

        emit ReviewCreated(msg.sender, product, reviewId, reviewText, reputation[msg.sender]);
    }

    // Upvote a review
    function upvoteReview(bytes32 reviewId) external {
        require(!hasUpvoted[reviewId][msg.sender], "You have already upvoted this review");

        hasUpvoted[reviewId][msg.sender] = true;
        reviews[reviewId].upvoteCount += 1;

        emit Upvoted(msg.sender, reviewId, reviews[reviewId].upvoteCount);
    }

    // Calculate authenticity score
    function getAuthenticityScore(bytes32 reviewId) external view returns (uint256) {
        uint256 upvoteCount = reviews[reviewId].upvoteCount;
        uint256 reviewerReputation = reputation[msg.sender];

        // Sample formula (this can be redesigned)
        uint256 authenticityScore = (reviewerReputation * upvoteCount) / 100;

        return authenticityScore;
    }

    // Get all reviews for a product
    function getReviewsForProduct(address product) external view returns (Review[] memory) {
        bytes32[] memory reviewIds = productReviews[product];
        Review[] memory reviewList = new Review[](reviewIds.length);

        for (uint256 i = 0; i < reviewIds.length; i++) {
            reviewList[i] = reviews[reviewIds[i]];
        }

        return reviewList;
    }

    // Manual reputation update (e.g., by admin or future logic)
    function updateReputation(address user, uint256 newReputation) external {
        reputation[user] = newReputation;
    }
}
