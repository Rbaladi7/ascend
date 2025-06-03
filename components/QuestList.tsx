
import React from 'react';
import { Quest } from '../types';

interface QuestListProps {
  quests: Quest[];
  onCompleteQuest: (questId: string) => void;
}

const QuestList: React.FC<QuestListProps> = ({ quests, onCompleteQuest }) => {
  if (!quests || quests.length === 0) {
    return <p className="text-slate-400 italic">No quests available at this moment.</p>;
  }

  return (
    <ul className="space-y-3">
      {quests.map((quest) => (
        <li 
          key={quest.id} 
          className={`p-4 rounded-md shadow-md transition-all duration-300 ease-in-out ${quest.isCompleted ? 'bg-slate-700 opacity-70' : 'bg-slate-750 hover:bg-slate-700'}`}
          aria-live="polite"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex-1 mb-2 sm:mb-0">
              <p className={`font-medium ${quest.isCompleted ? 'line-through text-slate-400' : 'text-sky-300'}`}>
                {quest.text}
              </p>
              <p className="text-xs text-slate-400">XP Reward: {quest.xpReward}</p>
              {quest.penalty && !quest.isCompleted && (
                <p className="text-xs text-amber-400">Penalty: {quest.penalty}</p>
              )}
            </div>
            {!quest.isCompleted ? (
              <button
                onClick={() => onCompleteQuest(quest.id)}
                className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2 px-3 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 self-start sm:self-center"
                aria-label={`Complete quest: ${quest.text}`}
              >
                Complete
              </button>
            ) : (
              <span className="text-sm font-semibold text-green-400 py-2 px-3">Completed</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default QuestList;
