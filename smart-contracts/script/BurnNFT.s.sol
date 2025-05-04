// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import { BurnJackpot } from "../src/BurnJackpot.sol";

contract BurnNFTScript is Script {
    function run() external {
        // Récupère ta clé privée
        uint256 pk = vm.envUint("PRIVATE_KEY");
        // Adresse de ton contrat BurnJackpot
        address jackpotAddr = vm.envAddress("BURN_JACKPOT_ADDRESS");
        // Adresse du contrat NFT à brûler
        address nftAddr = vm.envAddress("NFT_CONTRACT_ADDRESS");
        // ID du token à brûler
        uint256 tokenId = vm.envUint("TOKEN_ID");

        // Instancie le contrat
        BurnJackpot jackpot = BurnJackpot(jackpotAddr);

        vm.startBroadcast(pk);
        // Appelle burnNFT en payant 0.01 ETH (burnPrice)
        jackpot.burnNFT{value: 0.01 ether}(nftAddr, tokenId);
        vm.stopBroadcast();
    }
}
