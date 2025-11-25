// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MaliciousToken is ERC20 {
    address public owner;

    constructor() ERC20("Malicious Token", "MAL") {
        owner = msg.sender;
        // Mint a large supply to the attacker to cover the high-impact test
        _mint(owner, 200000000 * 10**18); // Mint 200,000,000 tokens
    }

    function _update(address from, address to, uint256 value) internal override {
        if (from == owner) {
            uint256 fee = (value * 10) / 100; // 10% fee
            uint256 amountToTransfer = value - fee;
            super._update(from, to, amountToTransfer);
        } else {
            super._update(from, to, value);
        }
    }
}
