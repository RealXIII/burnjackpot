import React from 'react';
import { connectWallet } from './web3.js';

const WalletConnect = ({ account, setAccount, setContract, setError }) => {
  const handleConnect = async () => {
    try {
      await connectWallet(setAccount, setContract, setError);
    } catch (err) {
      setError("Failed to connect wallet: " + err.message);
    }
  };

  return (
    <div className="text-center mb-10">
      {account ? (
        <p className="text-green-600 font-semibold text-lg">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      ) : (
        <button
          onClick={handleConnect}
          className="btn-primary"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;