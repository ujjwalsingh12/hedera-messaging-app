// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUserRegistry {
    function isRegistered(address user) external view returns (bool);
}


contract ReviewSystem {

    IUserRegistry userRegistry;

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


    // Functions

    // Submit a review for a product
    function submitReview(address product, string calldata reviewText) external {
        require(bytes(reviewText).length > 0, "Review text cannot be empty");

        // Check if the reviewer is a registered user
        require(userRegistry.isRegistered(msg.sender), "Reviewer must be a registered user");

        // Check if the reviewer holds the token (owns product tokens)
        // require(myToken.balanceOf(msg.sender) > 0, "Reviewer must hold the product token");
        
        // Generate a unique review ID using keccak256
        bytes32 reviewId = keccak256(abi.encodePacked(msg.sender, product, block.timestamp));

        // Store the review on-chain
        reviews[reviewId] = Review({
            reviewer: msg.sender,
            product: product,
            reviewText: reviewText,
            upvoteCount: 0
        });

        // Associate the review with the product
        productReviews[product].push(reviewId);

        // Emit event for new review
        emit ReviewCreated(msg.sender, product, reviewId, reviewText, reputation[msg.sender]);
    }

    // Upvote a review
    function upvoteReview(bytes32 reviewId) external {
        require(!hasUpvoted[reviewId][msg.sender], "You have already upvoted this review");

        // Mark this user as having upvoted the review
        hasUpvoted[reviewId][msg.sender] = true;

        // Increase the upvote count
        reviews[reviewId].upvoteCount += 1;

        // Emit the upvote event
        emit Upvoted(msg.sender, reviewId, reviews[reviewId].upvoteCount);
    }

    // Calculate authenticity score based on reputation and upvotes
    function getAuthenticityScore(bytes32 reviewId) external view returns (uint256) {
        uint256 upvoteCount = reviews[reviewId].upvoteCount;
        uint256 reviewerReputation = reputation[msg.sender];
        uint256 authenticityScore = (reviewerReputation * upvoteCount) / 100; // Example formula

        return authenticityScore;
    }

    // Get all reviews for a specific product
    function getReviewsForProduct(address product) external view returns (Review[] memory) {
        bytes32[] memory reviewIds = productReviews[product];
        Review[] memory productReviewsList = new Review[](reviewIds.length);

        for (uint256 i = 0; i < reviewIds.length; i++) {
            productReviewsList[i] = reviews[reviewIds[i]];
        }

        return productReviewsList;
    }

    // Update reputation (only callable by an authorized address or logic)
    function updateReputation(address user, uint256 newReputation) external {
        reputation[user] = newReputation;
    }
}