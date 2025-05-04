// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./mytoken.sol";

interface IUserRegistry {
    function isRegistered(address user) external view returns (bool);
}

contract ProductFactory {
    IUserRegistry public userRegistry;

    mapping(address => address[]) public userTokens;
    address[] public allTokens;
    mapping(address => address[]) public TokenOwners;
    mapping(address => address[]) public TokenCreators;
    
    struct TokenInfo {
        string name;
        string symbol;
    }

    mapping(address => TokenInfo) public tokenDetails;

    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol
    );

    event ProductMinted(address indexed to, address indexed token, uint256 amount);
    event ProductTokenTransferred(address indexed from, address indexed to, address indexed token, uint256 amount);

    constructor(address _userRegistryAddress) {
        require(_userRegistryAddress != address(0), "Invalid UserRegistry address");
        userRegistry = IUserRegistry(_userRegistryAddress);
    }

    function createToken(
        string memory name,
        string memory symbol
    ) external returns (address) {
        bool registered = false;
        try userRegistry.isRegistered(msg.sender) returns (bool isRegistered) {
            registered = isRegistered;
        } catch {
            revert("Failed to verify registration");
        }

        MyTokenOnHedera token = new MyTokenOnHedera(name, symbol, msg.sender, address(this));
        address tokenAddr = address(token);

        userTokens[msg.sender].push(tokenAddr);
        allTokens.push(tokenAddr);
        tokenDetails[tokenAddr] = TokenInfo(name, symbol);

        emit TokenCreated(tokenAddr, msg.sender, name, symbol);
        return tokenAddr;
    }

    function createMore(address tokenAddress, uint256 amount) external {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be > 0");

        MyTokenOnHedera token = MyTokenOnHedera(tokenAddress);
        require(token.getOwner() == msg.sender, "Only token owner can mint more");

        token.mintTo(msg.sender, amount);
        emit ProductMinted(msg.sender, tokenAddress, amount);
    }

    function purchaseProduct(address tokenAddress, address buyer, uint256 amount) external {
        require(tokenAddress != address(0), "Invalid token address");
        require(buyer != address(0), "Invalid buyer");
        require(amount > 0, "Amount must be > 0");

        MyTokenOnHedera(tokenAddress).mintTo(buyer, amount);
        emit ProductMinted(buyer, tokenAddress, amount);
    }

    function transferProductToken(address tokenAddress, address to, uint256 amount) external {
        require(tokenAddress != address(0), "Invalid token address");
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Transfer amount must be > 0");

        MyTokenOnHedera token = MyTokenOnHedera(tokenAddress);
        require(token.balanceOf(msg.sender) >= amount, "Not enough tokens to transfer");

        token.burnFrom(msg.sender, amount);
        token.mintTo(to, amount);

        emit ProductTokenTransferred(msg.sender, to, tokenAddress, amount);
    }

    function getTokensByUser(address user) external view returns (address[] memory) {
        return userTokens[user];
    }

    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }

    function doesUserOwnToken(address user, address token) external view returns (bool) {
        try MyTokenOnHedera(token).balanceOf(user) returns (uint256 bal) {
            return bal > 0;
        } catch {
            return false;
        }
    }
}
