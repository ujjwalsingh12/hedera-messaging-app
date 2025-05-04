// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUserRegistry {
    function isRegistered(address user) external view returns (bool);
}

contract MyTokenOnHedera {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;
    address public factory; // 👈 Track factory address

    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can call");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 initialSupply,
        address _owner,
        address _factory
    ) {
        name = _name;
        symbol = _symbol;
        owner = _owner;
        factory = _factory;
        totalSupply = initialSupply * (10 ** uint256(decimals));
        balanceOf[_owner] = totalSupply;
        emit Transfer(address(0), _owner, totalSupply);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Not enough balance");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    // 👇 Only Factory can call this
    function changeOwner(address newOwner) external onlyFactory {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract MyTokenFactory {
    IUserRegistry public userRegistry;

    mapping(address => address[]) public userTokens;
    mapping(address => address) public tokenOwner; // 👈 Track owner of each token

    event TokenCreated(
        address indexed tokenAddress,
        address indexed owner,
        string name,
        string symbol,
        uint256 totalSupply
    );

    constructor(address _userRegistryAddress) {
        require(_userRegistryAddress != address(0), "Invalid UserRegistry address");
        userRegistry = IUserRegistry(_userRegistryAddress);
    }

    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) external returns (address) {
        bool registered = false;
        try userRegistry.isRegistered(msg.sender) returns (bool isRegistered) {
            registered = isRegistered;
        } catch {
            revert("Failed to verify registration");
        }

        // require(registered, "User not registered");

        MyTokenOnHedera token = new MyTokenOnHedera(name, symbol, initialSupply, msg.sender, address(this));

        userTokens[msg.sender].push(address(token));
        tokenOwner[address(token)] = msg.sender;

        emit TokenCreated(address(token), msg.sender, name, symbol, initialSupply * (10 ** 18));
        return address(token);
    }

    function getTokensByUser(address user) external view returns (address[] memory) {
        return userTokens[user];
    }

    function getTokenCountByUser(address user) external view returns (uint256) {
        return userTokens[user].length;
    }

    // 👇 New function to transfer token ownership
    function transferTokenOwnership(address tokenAddress, address newOwner) external {
        require(tokenAddress != address(0), "Invalid token address");
        require(newOwner != address(0), "Invalid new owner address");

        address currentOwner = tokenOwner[tokenAddress];
        require(msg.sender == currentOwner, "Not the token owner");

        MyTokenOnHedera(tokenAddress).changeOwner(newOwner);

        // Update mappings
        tokenOwner[tokenAddress] = newOwner;

        // Update userTokens mapping
        // Remove token from current owner's list and add to new owner's list
        _removeTokenFromUser(currentOwner, tokenAddress);
        userTokens[newOwner].push(tokenAddress);
    }

    function _removeTokenFromUser(address user, address token) internal {
        uint length = userTokens[user].length;
        for (uint i = 0; i < length; i++) {
            if (userTokens[user][i] == token) {
                userTokens[user][i] = userTokens[user][length - 1];
                userTokens[user].pop();
                break;
            }
        }
    }
}