// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import { BurnJackpot } from "../src/BurnJackpot.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);

        // Déployer BurnJackpot avec burnPrice 0.01 ETH et commission 5%
        new BurnJackpot(0.01 ether, 5);

        vm.stopBroadcast();
    }
}