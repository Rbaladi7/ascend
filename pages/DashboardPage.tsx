
import React, { useEffect } from 'react';
import { usePlayerData } from '../context/PlayerDataContext';
import { GOAL_ARCHETYPES, RANKS_DATA } from '../constants';
import ProgressionRoadmap from '../components/ProgressionRoadmap';

const DashboardPage: React.FC = () => {
  const { playerData, fetchAndSetProgressionFocus } = usePlayerData();

  useEffect(() => {
    if (playerData.currentGoalId && !playerData.progressionFocus && !playerData.isLoadingProgressionFocus) {
      fetchAndSetProgressionFocus();
    }
  }, [playerData.currentGoalId, playerData.progressionFocus, playerData.isLoadingProgressionFocus, fetchAndSetProgressionFocus]);

  const currentGoal = GOAL_ARCHETYPES.find(g => g.id === playerData.currentGoalId);

  if (!currentGoal) {
    // This should ideally not happen if onboarding is complete.
    // Redirect or show error might be needed if currentGoalId is set but goal not found.
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
             <h1 className="text-3xl font-bold text-sky-400 mb-6">Dashboard</h1>
            <p className="text-center text-xl text-red-400 p-8">Error: Goal data not found. Please try resetting progress from Settings.</p>
        </div>
    );
  }

  const targetRankDisplay = currentGoal.targetRankId 
    ? RANKS_DATA.find(r => r.name === currentGoal.targetRankId?.name && r.subLevel === currentGoal.targetRankId?.subLevel)
    : null;

  const xpPercentage = playerData.xpToNextLevel > 0 ? (playerData.xp / playerData.xpToNextLevel) * 100 : 0;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-sky-400 mb-2">Dashboard Overview</h1>
      <p className="text-lg text-slate-400 mb-6">Welcome, User. Your journey continues.</p>
      
      {/* Current Progression Focus Section */}
      <ProgressionRoadmap />

      {/* Player Status Section */}
      <section aria-labelledby="player-status-heading" className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <h2 id="player-status-heading" className="text-2xl font-semibold text-sky-300 mb-4">Player Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div><strong>Goal:</strong> {currentGoal.name}</div>
          {currentGoal.difficulty && <div><strong>Goal Difficulty:</strong> <span className={
              currentGoal.difficulty === "Formidable" ? "text-red-400 font-semibold" :
              currentGoal.difficulty === "Challenging" ? "text-amber-400 font-semibold" :
              "text-sky-300"
            }>{currentGoal.difficulty}</span></div>}
          {targetRankDisplay && (
            <div><strong>Target Rank:</strong> <span className="text-sky-300">{targetRankDisplay.name} {targetRankDisplay.subLevel}</span></div>
          )}
          <div><strong>Rank:</strong> {playerData.rank.name} {playerData.rank.subLevel}</div>
          <div className="md:col-span-2 lg:col-span-1"><strong>Analogue:</strong> {playerData.rank.realWorldAnalogue}</div>
          <div><strong>Level:</strong> {playerData.level}</div>
          <div><strong>Stat Points:</strong> {playerData.statPoints}</div>
        </div>
        <div className="mt-4">
          <label htmlFor="xp-progress" className="block text-sm font-medium text-slate-300">XP to Next Level:</label>
          <div className="flex items-center">
            <div className="w-full bg-slate-700 rounded-full h-4 mr-2">
              <div 
                id="xp-progress-bar"
                className="bg-sky-500 h-4 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${xpPercentage}%` }}
                role="progressbar"
                aria-valuenow={playerData.xp}
                aria-valuemin={0}
                aria-valuemax={playerData.xpToNextLevel}
                aria-labelledby="xp-progress-label"
              ></div>
            </div>
            <span id="xp-progress-label" className="text-sm text-slate-400">{playerData.xp} / {playerData.xpToNextLevel} XP</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
