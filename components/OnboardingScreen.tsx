
import React, { useState } from 'react';
import { usePlayerData } from '../context/PlayerDataContext';
import { GOAL_ARCHETYPES } from '../constants';
import { MessageType } from './SystemMessage'; // Assuming SystemMessage.tsx exports this

const OnboardingScreen: React.FC = () => {
  const { initializePlayer, playerData } = usePlayerData();
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  const handleGoalSelection = () => {
    if (!selectedGoalId) {
      playerData.systemMessageEmitter('Please select a primary goal to begin your journey.', MessageType.Warning);
      return;
    }
    initializePlayer(selectedGoalId);
    // System message upon successful initialization is handled in initializePlayer
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 text-slate-100">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold text-sky-400 mb-3">Project Ascend</h1>
        <p className="text-xl text-slate-300 mb-6">The System Awakens...</p>
        
        <p className="mb-4 text-slate-300">Define your ultimate aspiration. This choice will shape your path and the challenges you face. Choose wisely, User.</p>

        <div className="mb-6">
          <label htmlFor="goal-select" className="block text-sm font-medium text-sky-300 mb-1">Select Your Primary Goal:</label>
          <select
            id="goal-select"
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-slate-100"
            aria-describedby="goal-description"
          >
            <option value="" disabled>-- Choose your destiny --</option>
            {GOAL_ARCHETYPES.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.name}
              </option>
            ))}
          </select>
          {selectedGoalId && (
            <p id="goal-description" className="mt-2 text-sm text-slate-400">
              {GOAL_ARCHETYPES.find(g => g.id === selectedGoalId)?.description}
            </p>
          )}
        </div>

        <button
          onClick={handleGoalSelection}
          disabled={!selectedGoalId}
          className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label="Begin Journey with selected goal"
        >
          Begin Your Ascent
        </button>
      </div>
      <footer className="mt-8 text-xs text-slate-500">
        <p>Remember, the System is always watching. Strive for greatness.</p>
      </footer>
    </div>
  );
};

export default OnboardingScreen;
