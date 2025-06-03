
import React from 'react';
import { ActiveBossBattle } from '../types';

interface BossBattleDisplayProps {
  activeBossBattle: ActiveBossBattle;
  onConcludeBattle: (success: boolean) => void;
}

const BossBattleDisplay: React.FC<BossBattleDisplayProps> = ({ activeBossBattle, onConcludeBattle }) => {
  if (!activeBossBattle) return null;

  const { idea } = activeBossBattle;

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-red-500">
      <h3 className="text-2xl font-semibold text-red-400 mb-3">{idea.name}</h3>
      <p className="text-sm text-slate-300 mb-4">{idea.description}</p>
      
      <h4 className="text-md font-semibold text-slate-200 mb-2">Success Conditions:</h4>
      <ul className="list-disc list-inside space-y-1 mb-4 text-slate-300">
        {idea.successConditions.map((condition, index) => (
          <li key={index}>{condition}</li>
        ))}
      </ul>

      <p className="text-sm text-slate-400 mb-1">XP Reward on Victory: {idea.xpReward}</p>
      {idea.itemRewardSuggestion && (
        <p className="text-sm text-slate-400 mb-4">Potential Item on Victory: {idea.itemRewardSuggestion.name} ({idea.itemRewardSuggestion.type})</p>
      )}
      <p className="text-sm text-amber-400 mb-4">Penalty for Failure: {idea.penaltyForFailure}</p>


      <div className="flex space-x-4">
        <button
          onClick={() => onConcludeBattle(true)}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
          aria-label="Claim victory in boss battle"
        >
          Claim Victory
        </button>
        <button
          onClick={() => onConcludeBattle(false)}
          className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
          aria-label="Acknowledge defeat in boss battle"
        >
          Acknowledge Defeat
        </button>
      </div>
    </div>
  );
};

export default BossBattleDisplay;
