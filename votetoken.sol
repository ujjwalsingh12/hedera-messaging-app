// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VoteToken {
    string public name = "Vote Token";
    string public symbol = "VOTE";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    address public reviewSystem;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyReviewSystem() {
        require(msg.sender == reviewSystem, "Only ReviewSystem");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setReviewSystem(address _reviewSystem) external onlyOwner {
        require(_reviewSystem != address(0), "Zero address");
        require(reviewSystem == address(0), "Already set");
        reviewSystem = _reviewSystem;
    }

    function mint(address to, uint256 amount) external onlyReviewSystem {
        balanceOf[to] += amount;
        totalSupply += amount;
    }

    function burnFrom(address from, uint256 amount) external onlyReviewSystem {
        require(balanceOf[from] >= amount, "Insufficient balance");
        balanceOf[from] -= amount;
        totalSupply -= amount;
    }

    function transferToReviewer(address from,address to, uint256 amount) external onlyReviewSystem {
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
    }
}