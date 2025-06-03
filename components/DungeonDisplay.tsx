
import React from 'react';
import { ActiveDungeon } from '../types';

interface DungeonDisplayProps {
  activeDungeon: ActiveDungeon;
  onCompleteTask: (taskIndex: number) => void;
  onAbandonDungeon: () => void;
}

const DungeonDisplay: React.FC<DungeonDisplayProps> = ({ activeDungeon, onCompleteTask, onAbandonDungeon }) => {
  if (!activeDungeon) return null;

  const { idea, completedTasks } = activeDungeon;

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-purple-500">
      <h3 className="text-2xl font-semibold text-purple-400 mb-3">{idea.name}</h3>
      <p className="text-sm text-slate-300 mb-4">{idea.description}</p>
      
      <h4 className="text-md font-semibold text-slate-200 mb-2">Tasks:</h4>
      <ul className="space-y-2 mb-4">
        {idea.tasks.map((task, index) => (
          <li key={index} className={`flex items-center p-2 rounded ${completedTasks[index] ? 'bg-slate-700' : 'bg-slate-750'}`}>
            <input
              type="checkbox"
              id={`task-${index}`}
              checked={completedTasks[index]}
              onChange={() => !completedTasks[index] && onCompleteTask(index)}
              disabled={completedTasks[index]}
              className="h-5 w-5 text-purple-600 bg-slate-600 border-slate-500 rounded focus:ring-purple-500 disabled:opacity-50 mr-3"
            />
            <label htmlFor={`task-${index}`} className={`flex-1 ${completedTasks[index] ? 'line-through text-slate-400' : 'text-slate-200'}`}>
              {task}
            </label>
          </li>
        ))}
      </ul>
      <p className="text-sm text-slate-400 mb-4">XP Reward on completion: {idea.xpReward}</p>
      {idea.itemRewardSuggestion && (
        <p className="text-sm text-slate-400 mb-4">Potential Item: {idea.itemRewardSuggestion.name} ({idea.itemRewardSuggestion.type})</p>
      )}

      <button
        onClick={onAbandonDungeon}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
        aria-label="Abandon current dungeon"
      >
        Abandon Dungeon
      </button>
    </div>
  );
};

export default DungeonDisplay;
