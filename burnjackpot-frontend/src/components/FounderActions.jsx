import React from 'react';
import { FaToggleOn, FaTrophy } from 'react-icons/fa';

const FounderActions = ({
  contract,
  account,
  founder,
  setError,
  setSuccess,
  setJackpotPool,
  setTotalParticipants,
  setIsActive,
  setWinner,
}) => {
  const handleToggleActive = async () => {
    if (!contract || !account) {
      setError("Please connect your wallet!");
      return;
    }

    if (account.toLowerCase() !== founder.toLowerCase()) {
      setError("Only the founder can perform this action!");
      return;
    }

    try {
      setError("");
      setSuccess("");
      const tx = await contract.toggleActive();
      await tx.wait();
      setSuccess("Jackpot status toggled successfully!");

      const active = await contract.isActive();
      setIsActive(active);
    } catch (err) {
      setError("Failed to toggle jackpot status: " + err.message);
    }
  };

  const handleSelectWinner = async () => {
    if (!contract || !account) {
      setError("Please connect your wallet!");
      return;
    }

    if (account.toLowerCase() !== founder.toLowerCase()) {
      setError("Only the founder can perform this action!");
      return;
    }

    try {
      setError("");
      setSuccess("");
      const tx = await contract.selectWinner();
      await tx.wait();
      setSuccess("Winner selected successfully!");

      const winnerAddress = await contract.winner();
      const pool = await contract.jackpotPool();
      const participants = await contract.totalParticipants();
      setWinner(winnerAddress);
      setJackpotPool(ethers.utils.formatEther(pool));
      setTotalParticipants(participants.toString());
      setIsActive(false);
    } catch (err) {
      setError("Failed to select winner: " + err.message);
    }
  };

  return (
    <div className="card mb-8">
      <h2 className="section-title">
        <FaTrophy className="mr-2 text-primary" /> Founder Actions
      </h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleToggleActive}
          className="btn-primary flex-1"
        >
          <FaToggleOn className="inline mr-2" /> Toggle Jackpot Active
        </button>
        <button
          onClick={handleSelectWinner}
          className="btn-danger flex-1"
        >
          <FaTrophy className="inline mr-2" /> Select Winner
        </button>
      </div>
    </div>
  );
};

export default FounderActions;