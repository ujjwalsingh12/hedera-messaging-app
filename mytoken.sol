// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyTokenOnHedera {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    address public owner;
    address public factory;
    uint8 public decimals = 18;

    mapping(address => uint256) public balanceOf;
    mapping(address => bool) internal hasHeld;
    address[] public holders;

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory");
        _;
    }

    constructor(string memory _name, string memory _symbol, address _owner, address _factory) {
        require(_owner != address(0) && _factory != address(0), "Zero address");
        name = _name;
        symbol = _symbol;
        owner = _owner;
        factory = _factory;
    }

    function mintTo(address to, uint256 amount) external onlyFactory {
        require(to != address(0), "Zero address");
        balanceOf[to] += amount;
        totalSupply += amount;

        if (!hasHeld[to]) {
            holders.push(to);
            hasHeld[to] = true;
        }

        emit Mint(to, amount);
    }

    function burnFrom(address from, uint256 amount) external onlyFactory {
        require(balanceOf[from] >= amount, "Insufficient balance");
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Burn(from, amount);
    }

    function getHolders() external view returns (address[] memory) {
        return holders;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function changeOwner(address newOwner) external onlyFactory {
        require(newOwner != address(0), "Zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
