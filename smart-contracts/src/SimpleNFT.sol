// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleNFT is ERC721 {
    uint256 public currentTokenId;

    constructor() ERC721("SimpleNFT", "SNFT") {}

    function mint(address to) public returns (uint256) {
        currentTokenId++;
        _mint(to, currentTokenId);
        return currentTokenId;
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}