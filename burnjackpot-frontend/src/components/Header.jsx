import React from 'react';
import { FaFire } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-white py-8 shadow-xl">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-extrabold tracking-tight flex items-center justify-center">
          <FaFire className="mr-3 text-accent animate-flame-pulse" /> BurnJackpot DApp
        </h1>
        <p className="mt-3 text-xl font-medium opacity-90">Burn NFTs, Win Big on Berachain!</p>
      </div>
    </header>
  );
};

export default Header;