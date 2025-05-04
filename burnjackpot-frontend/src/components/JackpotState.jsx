import React from 'react';
import { FaCoins, FaUsers, FaTrophy, FaFireAlt } from 'react-icons/fa';

const JackpotState = ({ jackpotPool, totalParticipants, isActive, winner, burnFee, founder }) => {
  return (
    <div className="card mb-8">
      <h2 className="section-title">
        <FaCoins className="mr-2 text-primary" /> Jackpot State
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="label">Jackpot Pool:</p>
          <p className="text-lg font-medium text-dark">{jackpotPool} BERA</p>
        </div>
        <div>
          <p className="label">Total Participants:</p>
          <p className="text-lg font-medium text-dark">{totalParticipants}</p>
        </div>
        <div>
          <p className="label">Is Active:</p>
          <p className={`text-lg font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
            {isActive ? 'Yes' : 'No'}
          </p>
        </div>
        <div>
          <p className="label">Current Winner:</p>
          <p className="text-lg font-medium text-dark">{winner === '0x0' ? 'None' : `${winner.slice(0, 6)}...${winner.slice(-4)}`}</p>
        </div>
        <div>
          <p className="label">Burn Fee:</p>
          <p className="text-lg font-medium text-dark">{burnFee} BERA</p>
        </div>
        <div>
          <p className="label">Founder:</p>
          <p className="text-lg font-medium text-dark">{founder === '0x0' ? 'None' : `${founder.slice(0, 6)}...${founder.slice(-4)}`}</p>
        </div>
      </div>
    </div>
  );
};

export default JackpotState;