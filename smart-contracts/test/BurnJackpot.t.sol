// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { SimpleNFT } from "../src/SimpleNFT.sol";
import { BurnJackpot } from "../src/BurnJackpot.sol";

contract BurnJackpotTest is Test {
    SimpleNFT nft;
    BurnJackpot jackpot;

    function setUp() public {
        nft = new SimpleNFT();
        jackpot = new BurnJackpot(0.01 ether, 5);
    }

    function testBurnNFTWithDynamicContract() public {
        // Mint un NFT à l'adresse du test
        uint256 tokenId = nft.mint(address(this));

        // Vérifier que le owner est bien l'adresse test
        assertEq(nft.ownerOf(tokenId), address(this));

        // Brûler le NFT dynamique en payant le burnPrice
        jackpot.burnNFT{value: 0.01 ether}(address(nft), tokenId);

        // Vérifier que le NFT est brûlé
        try nft.ownerOf(tokenId) {
            fail();
        } catch {
            assertTrue(true);
        }
    }
}