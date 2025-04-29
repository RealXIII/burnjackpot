import { ethers } from "ethers";

const RPC_URL = import.meta.env.VITE_RPC_URL;
export function getProvider() {
  return new ethers.providers.Web3Provider(window.ethereum || RPC_URL);
}

export async function connectWallet() {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

export function getBurnJackpotContract(signerOrProvider) {
  const abi = [
    "function burnNFT(address nftContract, uint256 tokenId) external payable",
    "function burnPrice() public view returns (uint256)"
  ];
  const address = import.meta.env.VITE_BURN_JACKPOT_ADDRESS;
  return new ethers.Contract(address, abi, signerOrProvider);
}
