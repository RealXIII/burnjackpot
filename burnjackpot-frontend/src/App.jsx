import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import WalletConnect from './components/WalletConnect.jsx';
import JackpotState from './components/JackpotState.jsx';
import BurnNFT from './components/BurnNFT.jsx';
import FounderActions from './components/FounderActions.jsx';
import ThreeDBackground from './components/ThreeDBackground.jsx';
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
      <ThreeDBackground />
      <Header />
      <div className="container mx-auto p-6">
        <div className="card">
          <h2 className="section-title">La Forge des Âmes</h2>
          <p className="text-center mb-4">
            Invoquez les flammes ancestrales pour lier votre âme à la quête du jackpot légendaire. Seuls les braves peuvent forger leur destin !
          </p>
          <WalletConnect
            account={account}
            setAccount={setAccount}
            setContract={setContract}
            setError={setError}
          />
        </div>

        <div className="card">
          <h2 className="section-title">Le Trésor des Flammes</h2>
          <p className="text-center mb-4">
            Contemplez la fortune amassée dans les braises sacrées. Le jackpot attend son champion, mais seul le feu révélera le vainqueur.
          </p>
          <JackpotState
            jackpotPool={jackpotPool}
            totalParticipants={totalParticipants}
            isActive={isActive}
            winner={winner}
            burnFee={burnFee}
            founder={founder}
          />
        </div>

        <div className="card">
          <h2 className="section-title">L’Autel des Sacrifices</h2>
          <p className="text-center mb-4">
            Brûlez votre NFT dans les flammes éternelles pour rejoindre la quête. Chaque sacrifice alimente le brasier du destin !
          </p>
          <BurnNFT
            contract={contract}
            account={account}
            setError={setError}
            setSuccess={setSuccess}
            setJackpotPool={setJackpotPool}
            setTotalParticipants={setTotalParticipants}
          />
        </div>

        <div className="card">
          <h2 className="section-title">Le Conseil des Anciens</h2>
          <p className="text-center mb-4">
            Seuls les fondateurs peuvent invoquer les anciens pour activer le rituel ou désigner le champion des flammes.
          </p>
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
        </div>

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