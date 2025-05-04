// SPDX-License-Identifier: MIT
   pragma solidity ^0.8.0;

   import "forge-std/Script.sol";
   import "../src/BurnJackpot.sol";

   contract DeployBurnJackpot is Script {
       function run() external {
           vm.startBroadcast();
           BurnJackpot burnJackpot = new BurnJackpot(msg.sender);
           vm.stopBroadcast();
           console.log("BurnJackpot deployed at:", address(burnJackpot));
       }
   }