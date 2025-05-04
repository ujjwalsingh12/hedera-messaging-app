// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrustToken is ERC20, Ownable {
    mapping(address => uint256) public reputation;
    mapping(address => bool) public hasMinted;

    address public userRegistry;

    event ReputationUpdated(address indexed user, int256 change);
    event TokensMinted(address indexed user, uint256 amount);

    modifier onlyUserRegistry() {
        require(msg.sender == userRegistry, "Only UserRegistry can mint tokens");
        _;
    }

    constructor(address _userRegistry) ERC20("TrustToken", "TRUST") {
        userRegistry = _userRegistry;
    }

    function mintToNewUser(address user) external onlyUserRegistry {
        require(!hasMinted[user], "User already received trust tokens");
        _mint(user, 2 * (10 ** decimals()));
        hasMinted[user] = true;
        reputation[user] = 1; // Initial reputation
        emit TokensMinted(user, 2 * (10 ** decimals()));
    }

    function upvote(address reviewer) external {
        require(balanceOf(msg.sender) >= 1 * (10 ** decimals()), "Need at least 1 TRUST to upvote");
        uint256 voterRep = reputation[msg.sender];
        uint256 delta = (voterRep * 10) / 100;
        if (delta == 0) delta = 1;
        reputation[reviewer] += delta;
        emit ReputationUpdated(reviewer, int256(delta));
    }

    function downvote(address reviewer) external {
        require(balanceOf(msg.sender) >= 1 * (10 ** decimals()), "Need at least 1 TRUST to downvote");
        uint256 voterRep = reputation[msg.sender];
        uint256 delta = (voterRep * 10) / 100;
        if (delta == 0) delta = 1;
        if (reputation[reviewer] >= delta) {
            reputation[reviewer] -= delta;
            emit ReputationUpdated(reviewer, -int256(delta));
        } else {
            reputation[reviewer] = 0;
            emit ReputationUpdated(reviewer, -int256(reputation[reviewer]));
        }
    }

    function getReputation(address user) external view returns (uint256) {
        return reputation[user];
    }
}
