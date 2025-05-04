// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrustToken {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public reputation;
    mapping(address => bool) public registered;

    address public registry;

    address[] public registeredUsers;

    constructor() {
        // Leave registry unset; can be set later manually by owner
    }

    function setRegistry(address _registry) external {
        require(registry == address(0), "Registry already set");
        registry = _registry;
    }

    function mintOnRegistration(address user) external {
        require(!registered[user], "Already minted");
        registered[user] = true;
        balances[user] = 2;
        reputation[user] = 0;
        registeredUsers.push(user);
    }

    function transfer(address to, uint256 amount) external {
        require(registered[msg.sender] && registered[to], "Both users must be registered");
        require(msg.sender != to, "Cannot transfer to self");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;
        reputation[to] += amount;
    }

    function getRegisteredUsers() external view returns (address[] memory) {
        return registeredUsers;
    }
}