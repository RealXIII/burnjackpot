// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC721Burnable {
    function burn(uint256 tokenId) external;
}

contract BurnJackpot {
    address public owner;
    uint256 public jackpot;
    uint256 public burnPrice;
    uint256 public commissionPercent;
    uint256 public burnsSinceLastJackpot;
    uint256 public chanceDivisor = 1250;

    mapping(address => uint256) public userBurns;

    event Burn(address indexed user, address indexed nftContract, uint256 tokenId, bool wonJackpot);
    event JackpotWon(address indexed winner, uint256 amount);
    event CommissionWithdrawn(address indexed owner, uint256 amount);

    constructor(uint256 _burnPrice, uint256 _commissionPercent) {
        owner = msg.sender;
        burnPrice = _burnPrice;
        commissionPercent = _commissionPercent;
    }

    function burnNFT(address nftContract, uint256 tokenId) public payable {
        require(msg.value == burnPrice, "Incorrect burn price");

        // Brûler le NFT via l'interface burn
        IERC721Burnable(nftContract).burn(tokenId);

        uint256 commission = (msg.value * commissionPercent) / 100;
        jackpot += (msg.value - commission);
        userBurns[msg.sender]++;
        burnsSinceLastJackpot++;

        bool won = _isJackpot();
        emit Burn(msg.sender, nftContract, tokenId, won);

        if (won) {
            uint256 wonAmount = jackpot;
            jackpot = 0;
            payable(msg.sender).transfer(wonAmount);
            emit JackpotWon(msg.sender, wonAmount);
        }
    }

    function _isJackpot() internal view returns (bool) {
        uint256 rand = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            burnsSinceLastJackpot
        ))) % chanceDivisor;

        return rand == 0;
    }

    function withdrawCommission() public {
        require(msg.sender == owner, "Not authorized");
        uint256 amount = address(this).balance - jackpot;
        payable(owner).transfer(amount);
        emit CommissionWithdrawn(owner, amount);
    }
}