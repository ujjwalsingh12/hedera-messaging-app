// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITrustToken {
    function reputation(address user) external view returns (uint256);
    function mintOnRegistration(address user) external;
}

interface IVoteToken {
    function burnFrom(address from, uint256 amount) external;
    function transferToReviewer(address reviewer, uint256 amount) external;
}

interface IUserRegistry {
    function isRegistered(address user) external view returns (bool);
    function reputationScore(address user) external view returns (uint256);
    function updateReputationOnVote(address reviewer, bool isUpvote, address voter) external;
}

contract ReviewSystem {
    struct Review {
        address reviewer;
        address productToken;
        string content;
        uint256 upvoteRep;
        uint256 downvoteRep;
        uint256 authenticityScore;
    }

    address public owner;
    IUserRegistry public userRegistry;
    IVoteToken public upvoteToken;
    IVoteToken public downvoteToken;

    uint256 public reviewCounter;
    mapping(uint256 => Review) public reviews;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ReviewSubmitted(uint256 indexed reviewId, address indexed reviewer, address productToken, string content);
    event ReviewVoted(uint256 indexed reviewId, address indexed voter, bool isUpvote, uint256 newScore);

    constructor(address _registry, address _upvoteToken, address _downvoteToken) {
        require(_registry != address(0) && _upvoteToken != address(0) && _downvoteToken != address(0), "Zero address");
        owner = msg.sender;
        userRegistry = IUserRegistry(_registry);
        upvoteToken = IVoteToken(_upvoteToken);
        downvoteToken = IVoteToken(_downvoteToken);
    }

    function submitReview(address productToken, string calldata content) external {
        require(userRegistry.isRegistered(msg.sender), "User not registered");
        require(bytes(content).length > 0, "Empty content");

        reviews[reviewCounter] = Review({
            reviewer: msg.sender,
            productToken: productToken,
            content: content,
            upvoteRep: 0,
            downvoteRep: 0,
            authenticityScore: userRegistry.reputationScore(msg.sender)
        });

        emit ReviewSubmitted(reviewCounter, msg.sender, productToken, content);
        reviewCounter++;
    }

function voteOnReview(uint256 reviewId, bool isUpvote) external {
    require(userRegistry.isRegistered(msg.sender), "Not registered");
    require(reviewId < reviewCounter, "Invalid review");
    require(!hasVoted[reviewId][msg.sender], "Already voted");
    require(msg.sender != reviews[reviewId].reviewer, "Cannot vote on own review");

    Review storage r = reviews[reviewId];
    address reviewer = r.reviewer;

    uint256 voterRep = userRegistry.reputationScore(msg.sender);
    uint256 reviewerRep = userRegistry.reputationScore(reviewer);
    uint256 delta = voterRep / 10;

    if (isUpvote) {
        upvoteToken.burnFrom(msg.sender, 1);
        upvoteToken.transferToReviewer(reviewer, 1);
        r.upvoteRep += delta;
    } else {
        downvoteToken.burnFrom(msg.sender, 1);
        downvoteToken.transferToReviewer(reviewer, 1);
        r.downvoteRep += delta;
    }

    r.authenticityScore = reviewerRep + r.upvoteRep - r.downvoteRep;
    hasVoted[reviewId][msg.sender] = true;

    userRegistry.updateReputationOnVote(reviewer, isUpvote, msg.sender);
    emit ReviewVoted(reviewId, msg.sender, isUpvote, r.authenticityScore);
}
}
