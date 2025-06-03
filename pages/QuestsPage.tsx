
import React from 'react';
import { usePlayerData } from '../context/PlayerDataContext';
import QuestList from '../components/QuestList';

const QuestsPage: React.FC = () => {
  const { playerData, fetchDailyQuests, completeQuest } = usePlayerData();

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-sky-400 mb-6">Daily Quests Log</h1>
      
      <section aria-labelledby="daily-quests-heading" className="bg-slate-800 p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 id="daily-quests-heading" className="text-2xl font-semibold text-sky-300">System Assignments</h2>
          <button
            onClick={fetchDailyQuests}
            disabled={playerData.isLoadingQuests}
            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={playerData.isLoadingQuests}
          >
            {playerData.isLoadingQuests ? 'Requesting...' : (playerData.dailyQuests.length > 0 ? 'Refresh Quests' : 'Request Daily Briefing')}
          </button>
        </div>
        {playerData.isLoadingQuests && playerData.dailyQuests.length === 0 && (
             <div className="flex items-center justify-center p-4 bg-slate-750 rounded-md">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-400 mr-3"></div>
                <p className="text-slate-300">Fetching quest data from the System...</p>
            </div>
        )}
        {!playerData.isLoadingQuests && playerData.dailyQuests.length > 0 ? (
          <QuestList quests={playerData.dailyQuests} onCompleteQuest={completeQuest} />
        ) : !playerData.isLoadingQuests && (
          <p className="text-slate-400 italic">No active daily quests. Request a briefing from the System.</p>
        )}
      </section>
    </div>
  );
};

export default QuestsPage;
