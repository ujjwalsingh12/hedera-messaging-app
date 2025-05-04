// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyTokenOnHedera {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;
    address public factory;

    mapping(address => uint256) public balanceOf;
    address[] public holders;
    mapping(address => bool) internal hasHeld;

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory can call this function");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _owner,
        address _factory
    ) {
        require(_owner != address(0), "Owner cannot be zero address");
        require(_factory != address(0), "Factory cannot be zero address");

        name = _name;
        symbol = _symbol;
        owner = _owner;
        factory = _factory;
        totalSupply = 0;
    }

    /// @notice Mint tokens to a user (represents product purchase)
    function mintTo(address to, uint256 amount) external onlyFactory {
        require(to != address(0), "Cannot mint to zero address");

        balanceOf[to] += amount;
        totalSupply += amount;

        if (!hasHeld[to]) {
            holders.push(to);
            hasHeld[to] = true;
        }

        emit Mint(to, amount);
    }

    /// @notice Burn tokens from a user (used in controlled transfer)
    function burnFrom(address from, uint256 amount) external onlyFactory {
        require(balanceOf[from] >= amount, "Not enough balance to burn");
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Burn(from, amount);
    }

    /// @notice View all unique token holders
    function getHolders() external view returns (address[] memory) {
        return holders;
    }

    /// @notice Change token creator/owner (factory only)
    function changeOwner(address newOwner) external onlyFactory {
        require(newOwner != address(0), "New owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /// @notice View token creator
    function getOwner() external view returns (address) {
        return owner;
    }
}
