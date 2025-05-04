import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FaFireAlt } from 'react-icons/fa';

const BurnNFT = ({ contract, account, setError, setSuccess, setJackpotPool, setTotalParticipants }) => {
  const [nftContractAddress, setNftContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [burnFee, setBurnFee] = useState(null);

  useEffect(() => {
    const fetchBurnFee = async () => {
      if (contract) {
        try {
          const fee = await contract.burnFee();
          setBurnFee(ethers.utils.formatEther(fee));
        } catch (err) {
          setError("Failed to fetch burn fee: " + err.message);
        }
      }
    };
    fetchBurnFee();
  }, [contract, setError]);

  const handleBurnNFT = async () => {
    if (!contract || !account) {
      setError("Please connect your wallet!");
      return;
    }

    if (!nftContractAddress || !tokenId) {
      setError("Please provide NFT contract address and token ID!");
      return;
    }

    if (!burnFee) {
      setError("Burn fee not loaded yet. Please wait.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      const tx = await contract.burnNFT(nftContractAddress, tokenId, {
        value: ethers.utils.parseEther(burnFee),
      });
      await tx.wait();
      setSuccess("NFT burned successfully!");

      const pool = await contract.jackpotPool();
      const participants = await contract.totalParticipants();
      setJackpotPool(ethers.utils.formatEther(pool));
      setTotalParticipants(participants.toString());
    } catch (err) {
      setError("Failed to burn NFT: " + err.message);
    }
  };

  return (
    <div className="card mb-8">
      <h2 className="section-title">
        <FaFireAlt className="mr-2 text-primary" /> Burn an NFT to Participate
      </h2>
      <div className="mb-4">
        <label className="label">NFT Contract Address:</label>
        <input
          type="text"
          value={nftContractAddress}
          onChange={(e) => setNftContractAddress(e.target.value)}
          className="input"
          placeholder="0x..."
        />
      </div>
      <div className="mb-4">
        <label className="label">Token ID:</label>
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="input"
          placeholder="e.g., 1"
        />
      </div>
      <button
        onClick={handleBurnNFT}
        className="btn-green w-full"
      >
        Burn NFT
      </button>
    </div>
  );
};

export default BurnNFT;