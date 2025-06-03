import React from 'react';
import { usePlayerData } from '../context/PlayerDataContext';
import { GOAL_ARCHETYPES, RANKS_DATA } from '../constants';

const ProgressionRoadmap: React.FC = () => {
  const { playerData } = usePlayerData();
  const { rank, progressionFocus, currentGoalId, isLoadingProgressionFocus } = playerData;

  const currentGoal = GOAL_ARCHETYPES.find(g => g.id === currentGoalId);
  const targetRankDetails = currentGoal?.targetRankId 
    ? RANKS_DATA.find(r => r.name === currentGoal.targetRankId?.name && r.subLevel === currentGoal.targetRankId?.subLevel)
    : null;

  return (
    <section aria-labelledby="progression-roadmap-heading" className="bg-slate-800 p-6 rounded-lg shadow-xl border border-cyan-500">
      <h2 id="progression-roadmap-heading" className="text-2xl font-semibold text-cyan-300 mb-4">Progression Roadmap</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-slate-400">Current Rank:</p>
          <p className="text-lg font-medium text-slate-100">{rank.name} {rank.subLevel}</p>
        </div>
        {currentGoal && targetRankDetails && (
          <div>
            <p className="text-slate-400">Target Rank (for {currentGoal.name}):</p>
            <p className="text-lg font-medium text-cyan-400">{targetRankDetails.name} {targetRankDetails.subLevel}</p>
          </div>
        )}
      </div>

      {isLoadingProgressionFocus && (
        <div className="flex items-center justify-center p-4 bg-slate-750 rounded-md">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400 mr-3"></div>
          <p className="text-slate-300">System is calibrating your progression focus...</p>
        </div>
      )}

      {!isLoadingProgressionFocus && progressionFocus && (
        <div className="bg-slate-750 p-4 rounded-md">
          <h3 className="text-xl font-semibold text-cyan-200 mb-2">{progressionFocus.chapterTitle}</h3>
          <p className="text-slate-300 italic"><strong>Current Objective:</strong> {progressionFocus.overarchingObjective}</p>
        </div>
      )}

      {!isLoadingProgressionFocus && !progressionFocus && currentGoalId && (
         <div className="bg-slate-750 p-4 rounded-md">
            <p className="text-slate-400 italic">System is determining your next major objective. Stand by for guidance, or initiate actions based on your goal.</p>
         </div>
      )}
       {!isLoadingProgressionFocus && !progressionFocus && !currentGoalId && (
         <div className="bg-slate-750 p-4 rounded-md">
            <p className="text-slate-400 italic">Initialize your primary goal to receive progression guidance from the System.</p>
         </div>
      )}


    </section>
  );
};

export default ProgressionRoadmap;
