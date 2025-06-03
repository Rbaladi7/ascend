
import React from 'react';
import { UserStat } from '../types';

interface StatDisplayProps {
  stat: UserStat;
  onIncrement: () => void;
  canIncrement: boolean;
  statCeiling: number;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ stat, onIncrement, canIncrement, statCeiling }) => {
  return (
    <div className="bg-slate-750 p-4 rounded-md shadow hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-semibold text-sky-400" title={stat.description}>{stat.name}</h3>
        <span className="text-2xl font-bold text-slate-100">{stat.value} / {statCeiling}</span>
      </div>
      <p className="text-xs text-slate-400 mb-2 truncate" title={stat.description}>{stat.description}</p>
      {canIncrement && (
        <button
          onClick={onIncrement}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-1 px-3 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-750"
          aria-label={`Increase ${stat.name} stat`}
        >
          +1 Point
        </button>
      )}
      {!canIncrement && stat.value >= statCeiling && (
         <p className="text-xs text-amber-400">Max for current rank.</p>
      )}
       {!canIncrement && stat.value < statCeiling && (
         <p className="text-xs text-slate-500">No points or at ceiling.</p>
      )}
    </div>
  );
};

export default StatDisplay;
