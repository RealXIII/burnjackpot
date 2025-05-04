import { ethers } from "ethers";
import BurnJackpotABI from "../abi/Burnjackpot-abi.json";

const contractAddress = "0x1234567890abcdef1234567890abcdef12345678"; // Remplacez par l'adresse de votre contrat déployé

export async function connectWallet(setAccount, setContract, setError) {
  try {
    if (!window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, BurnJackpotABI, signer);

    setAccount(accounts[0]);
    setContract(contract);
  } catch (err) {
    setError("Failed to connect wallet: " + err.message);
  }
}

export async function loadContractState(
  contract,
  setJackpotPool,
  setTotalParticipants,
  setIsActive,
  setWinner,
  setBurnFee,
  setFounder,
  setError
) {
  if (!contract) return;

  try {
    const pool = await contract.jackpotPool();
    const participants = await contract.totalParticipants();
    const active = await contract.isActive();
    const winnerAddress = await contract.winner();
    const fee = await contract.burnFee();
    const founderAddress = await contract.founder();

    setJackpotPool(ethers.utils.formatEther(pool));
    setTotalParticipants(participants.toString());
    setIsActive(active);
    setWinner(winnerAddress);
    setBurnFee(ethers.utils.formatEther(fee));
    setFounder(founderAddress);
  } catch (err) {
    setError("Failed to load contract state: " + err.message);
  }
}