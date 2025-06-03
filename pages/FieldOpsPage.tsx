
import React from 'react';
import { usePlayerData } from '../context/PlayerDataContext';
import DungeonDisplay from '../components/DungeonDisplay';
import BossBattleDisplay from '../components/BossBattleDisplay';

const FieldOpsPage: React.FC = () => {
  const { 
    playerData, 
    fetchDungeonIdea, 
    startDungeon, 
    completeDungeonTask, 
    abandonDungeon,
    fetchBossBattleIdea,
    startBossBattle,
    concludeBossBattle
  } = usePlayerData();

  const canScanDungeon = !playerData.isLoadingDungeon && !playerData.activeDungeon && !playerData.dungeonIdea;
  const canScanBoss = !playerData.isLoadingBossBattle && !playerData.activeBossBattle && !playerData.bossBattleIdea;
  const bossPrerequisiteMet = playerData.level >= 5;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-sky-400 mb-6">Field Operations Console</h1>
      
      <section aria-labelledby="field-ops-heading" className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <h2 id="field-ops-heading" className="text-2xl font-semibold text-sky-300 mb-4 sr-only">Operations Sections</h2> {/* Screen reader only title for section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dungeon Operations */}
          <div className="space-y-4 p-4 bg-slate-850 rounded-md border border-slate-700 shadow-lg">
            <h3 className="text-xl font-semibold text-purple-400">Dungeon Intel</h3>
            {playerData.activeDungeon ? (
              <DungeonDisplay 
                activeDungeon={playerData.activeDungeon} 
                onCompleteTask={completeDungeonTask}
                onAbandonDungeon={abandonDungeon}
              />
            ) : playerData.dungeonIdea ? (
              <div className="bg-slate-750 p-4 rounded">
                <h4 className="text-lg text-purple-300">{playerData.dungeonIdea.name}</h4>
                <p className="text-sm text-slate-300 mb-2">{playerData.dungeonIdea.description}</p>
                <p className="text-xs text-slate-400">Tasks: {playerData.dungeonIdea.tasks.length}, XP: {playerData.dungeonIdea.xpReward}</p>
                 {playerData.dungeonIdea.itemRewardSuggestion && <p className="text-xs text-slate-400">Item: {playerData.dungeonIdea.itemRewardSuggestion.name}</p>}
                <button 
                  onClick={startDungeon}
                  className="w-full mt-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-md transition"
                >Enter Dungeon</button>
              </div>
            ) : (
              <>
                <p className="text-slate-400 italic">No active dungeons or reconnaissance data.</p>
                <button
                  onClick={fetchDungeonIdea}
                  disabled={!canScanDungeon || playerData.isLoadingDungeon}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
                  aria-busy={playerData.isLoadingDungeon}
                >
                  {playerData.isLoadingDungeon ? 'Scanning...' : 'Scan for Anomalies (Dungeon)'}
                </button>
              </>
            )}
          </div>

          {/* Boss Battle Operations */}
          <div className="space-y-4 p-4 bg-slate-850 rounded-md border border-slate-700 shadow-lg">
            <h3 className="text-xl font-semibold text-red-400">High-Threat Targets</h3>
             {!bossPrerequisiteMet && !playerData.activeBossBattle && !playerData.bossBattleIdea && (
                <p className="text-amber-400 italic text-sm">Reach Level 5 to engage High-Threat Targets.</p>
             )}
            {playerData.activeBossBattle ? (
              <BossBattleDisplay 
                activeBossBattle={playerData.activeBossBattle}
                onConcludeBattle={concludeBossBattle}
              />
            ) : playerData.bossBattleIdea ? (
              <div className="bg-slate-750 p-4 rounded">
                <h4 className="text-lg text-red-300">{playerData.bossBattleIdea.name}</h4>
                <p className="text-sm text-slate-300 mb-2">{playerData.bossBattleIdea.description}</p>
                 {playerData.bossBattleIdea.itemRewardSuggestion && <p className="text-xs text-slate-400">Item: {playerData.bossBattleIdea.itemRewardSuggestion.name}</p>}
                <button 
                  onClick={startBossBattle}
                  className="w-full mt-3 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition"
                >Initiate Confrontation</button>
              </div>
            ) : (
              <>
                <p className="text-slate-400 italic">No active boss confrontations or intel.</p>
                <button
                  onClick={fetchBossBattleIdea}
                  disabled={!canScanBoss || playerData.isLoadingBossBattle || !bossPrerequisiteMet}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
                  aria-busy={playerData.isLoadingBossBattle}
                >
                  {playerData.isLoadingBossBattle ? 'Scanning...' : 'Scan for High-Threat Target'}
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FieldOpsPage;
