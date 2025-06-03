
import React from 'react';
import { usePlayerData } from '../context/PlayerDataContext';
import { MessageType } from '../components/SystemMessage';

interface SettingsPageProps {
  onShowRankModal: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onShowRankModal }) => {
  const { resetPlayerProgress, playerData } = usePlayerData();

  const handleResetProgress = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to reset all your progress? This action cannot be undone and you will be returned to the onboarding screen.')) {
      resetPlayerProgress(); // This will set currentGoalId to null
      playerData.systemMessageEmitter('System progress has been reset. Define your new aspiration.', MessageType.System);
      // App.tsx will detect currentGoalId === null and show OnboardingScreen.
      // Additionally, we might want to force a redirect to a neutral hash or clear it.
      window.location.hash = ''; // Clears hash, or set to a specific non-authenticated route if you have one
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-sky-400 mb-6">System Settings & Controls</h1>
      
      <section aria-labelledby="system-controls-heading" className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <h2 id="system-controls-heading" className="text-2xl font-semibold text-sky-300 mb-4">System Utilities</h2>
        <div className="space-y-4 max-w-md">
          <button
            onClick={onShowRankModal}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            View Rank System Table
          </button>
          <p className="text-sm text-slate-400">
            Review the System's ranking structure, level ranges, and real-world analogues.
          </p>
        </div>
      </section>

      <section aria-labelledby="reset-progress-heading" className="bg-slate-800 p-6 rounded-lg shadow-xl border border-red-600/50">
        <h2 id="reset-progress-heading" className="text-2xl font-semibold text-red-400 mb-4">Danger Zone</h2>
        <div className="space-y-4 max-w-md">
          <button
            onClick={handleResetProgress}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-describedby="reset-warning"
          >
            Reset All Progress
          </button>
          <p id="reset-warning" className="text-sm text-amber-400">
            <strong>Warning:</strong> This action will completely erase your current goal, level, stats, quests, and all other progress. This cannot be undone.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
