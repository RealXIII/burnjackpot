// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {BurnJackpot} from "../src/BurnJackpot.sol";
import {IERC721} from "openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {IERC165} from "openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";

contract MockERC721 is IERC721 {
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    function balanceOf(address owner) public view override returns (uint256) {
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Token does not exist");
        return owner;
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory /* data */) public override {
        require(from == _owners[tokenId], "From is not the owner");
        require(to != address(0), "Cannot transfer to zero address");
        require(
            msg.sender == from || _operatorApprovals[from][msg.sender] || _tokenApprovals[tokenId] == msg.sender,
            "Not authorized"
        );

        _beforeTokenTransfer(from, to, tokenId);

        _owners[tokenId] = to;
        _balances[from]--;
        _balances[to]++;
        delete _tokenApprovals[tokenId];

        _afterTokenTransfer(from, to, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        safeTransferFrom(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) public override {
        address owner = _owners[tokenId];
        require(msg.sender == owner || _operatorApprovals[owner][msg.sender], "Not authorized");
        _tokenApprovals[tokenId] = to;
    }

    function getApproved(uint256 tokenId) public view override returns (address) {
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) public override {
        _operatorApprovals[msg.sender][operator] = approved;
    }

    function isApprovedForAll(address owner, address operator) public view override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
        return interfaceId == type(IERC721).interfaceId || interfaceId == type(IERC165).interfaceId;
    }

    // Helper function to mint a token for testing
    function mint(address to, uint256 tokenId) public {
        require(to != address(0), "Cannot mint to zero address");
        require(_owners[tokenId] == address(0), "Token already minted");

        _owners[tokenId] = to;
        _balances[to]++;
    }

    // Hooks for safe transfers (empty for now)
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}
    function _afterTokenTransfer(address from, address to, uint256 tokenId) internal virtual {}
}

contract BurnJackpotTest is Test {
    BurnJackpot public burnJackpot;
    MockERC721 public nft;
    address public founder = address(0x1);
    address public user = address(0x2);
    uint256 public tokenId = 1;

    function setUp() public {
        // Deploy the BurnJackpot contract
        burnJackpot = new BurnJackpot(founder);

        // Deploy a mock ERC721 contract
        nft = new MockERC721();

        // Mint an NFT to the user
        nft.mint(user, tokenId);

        // Deal some BERA to the user for paying the burn fee
        vm.deal(user, 1 ether);
    }

    function testBurnNFT() public {
        // Verify initial state
        assertEq(nft.ownerOf(tokenId), user);
        assertEq(burnJackpot.getBalance(), 0);

        // User approves the BurnJackpot contract to transfer the NFT
        vm.prank(user);
        nft.approve(address(burnJackpot), tokenId);

        // User burns the NFT
        vm.prank(user);
        burnJackpot.burnNFT{value: 0.01 ether}(address(nft), tokenId);

        // Verify the NFT was burned (sent to 0xdead)
        assertEq(nft.ownerOf(tokenId), address(0xdead));

        // Verify the jackpot pool and founder share
        assertEq(burnJackpot.jackpotPool(), 0.007 ether); // 70% of 0.01 BERA
        assertEq(founder.balance, 0.003 ether); // 30% of 0.01 BERA

        // Verify participation
        assertEq(burnJackpot.totalParticipants(), 1);
        assertEq(burnJackpot.participations(user), 1);
    }

    function testSelectWinner() public {
        // User burns an NFT to participate
        vm.prank(user);
        nft.approve(address(burnJackpot), tokenId);
        vm.prank(user);
        burnJackpot.burnNFT{value: 0.01 ether}(address(nft), tokenId);

        // Set a random seed for winner selection (called by founder)
        vm.prank(founder);
        burnJackpot.setRandomSeed(12345);

        // Select a winner (called by founder)
        vm.prank(founder);
        burnJackpot.selectWinner();

        // Verify the winner
        assertEq(burnJackpot.winner(), user);

        // Verify the prize (taking into account initial balance and burn fee)
        assertEq(user.balance, 0.9956 ether); // 1 ether - 0.01 ether + 0.0056 ether
        assertEq(founder.balance, 0.0044 ether); // 0.003 + 20% of 0.007 BERA

        // Verify the jackpot is reset
        assertEq(burnJackpot.jackpotPool(), 0);
        assertEq(burnJackpot.totalParticipants(), 0);
        assertFalse(burnJackpot.isActive());
    }
}