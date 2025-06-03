
import React from 'react';
import { usePlayerData } from '../context/PlayerDataContext';
import StatDisplay from '../components/StatDisplay';

const StatsInventoryPage: React.FC = () => {
  const { playerData, incrementStat } = usePlayerData();

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-sky-400 mb-6">Attributes & Stash</h1>
      
      {/* Stats Section */}
      <section aria-labelledby="stats-heading" className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <h2 id="stats-heading" className="text-2xl font-semibold text-sky-300 mb-4">User Attributes</h2>
        {playerData.stats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playerData.stats.map(stat => (
              <StatDisplay 
                key={stat.name} 
                stat={stat} 
                onIncrement={() => incrementStat(stat.name)}
                canIncrement={playerData.statPoints > 0 && stat.value < playerData.rank.statCeiling}
                statCeiling={playerData.rank.statCeiling}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic">No attributes defined. Initialize a goal to establish base stats.</p>
        )}
         {playerData.statPoints > 0 && (
            <p className="mt-4 text-sm text-sky-400">You have {playerData.statPoints} stat point(s) to allocate. Max per stat for current rank: {playerData.rank.statCeiling}.</p>
        )}
      </section>
      
      {/* Inventory Section */}
      <section aria-labelledby="inventory-heading" className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <h2 id="inventory-heading" className="text-2xl font-semibold text-sky-300 mb-4">Inventory Stash</h2>
        {playerData.inventory.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {playerData.inventory.map(slot => (
              <li key={slot.item.id} className="bg-slate-700 p-3 rounded-md shadow hover:shadow-lg transition-shadow" title={slot.item.description}>
                <p className="font-medium text-sky-200">{slot.item.name} {slot.quantity > 1 ? `(x${slot.quantity})` : ''}</p>
                <p className="text-xs text-slate-400">{slot.item.type}</p>
                 <p className="text-xs text-slate-500 truncate pt-1" title={slot.item.description}>{slot.item.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 italic">Your inventory is empty. Complete challenges to acquire items.</p>
        )}
      </section>
    </div>
  );
};

export default StatsInventoryPage;
