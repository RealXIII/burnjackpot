import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import WalletConnect from './components/WalletConnect.jsx';
import JackpotState from './components/JackpotState.jsx';
import BurnNFT from './components/BurnNFT.jsx';
import FounderActions from './components/FounderActions.jsx';
import { loadContractState } from './components/web3.js';
import './App.css';

const App = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [jackpotPool, setJackpotPool] = useState("0");
  const [totalParticipants, setTotalParticipants] = useState("0");
  const [isActive, setIsActive] = useState(false);
  const [winner, setWinner] = useState("0x0");
  const [burnFee, setBurnFee] = useState("0");
  const [founder, setFounder] = useState("0x0");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadContractState(
      contract,
      setJackpotPool,
      setTotalParticipants,
      setIsActive,
      setWinner,
      setBurnFee,
      setFounder,
      setError
    );
  }, [contract]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto p-6">
        <WalletConnect
          account={account}
          setAccount={setAccount}
          setContract={setContract}
          setError={setError}
        />
        <JackpotState
          jackpotPool={jackpotPool}
          totalParticipants={totalParticipants}
          isActive={isActive}
          winner={winner}
          burnFee={burnFee}
          founder={founder}
        />
        <BurnNFT
          contract={contract}
          account={account}
          setError={setError}
          setSuccess={setSuccess}
          setJackpotPool={setJackpotPool}
          setTotalParticipants={setTotalParticipants}
        />
        <FounderActions
          contract={contract}
          account={account}
          founder={founder}
          setError={setError}
          setSuccess={setSuccess}
          setJackpotPool={setJackpotPool}
          setTotalParticipants={setTotalParticipants}
          setIsActive={setIsActive}
          setWinner={setWinner}
        />
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;