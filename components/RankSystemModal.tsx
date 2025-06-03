
import React from 'react';
import { RANKS_DATA, RankData } from '../constants'; // Assuming RankData is exported from constants or types

interface RankSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RankSystemModal: React.FC<RankSystemModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900 bg-opacity-75 transition-opacity flex items-center justify-center p-4"
      aria-labelledby="rank-system-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 id="rank-system-modal-title" className="text-xl font-semibold text-sky-300">
            System Rank Structure
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Close rank system modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          <p className="text-sm text-slate-300 mb-4">
            The System categorizes progression through a series of Ranks. Each rank denotes a significant leap in capability and understanding.
          </p>
          <table className="w-full min-w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-sky-300 uppercase bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-3">Rank</th>
                <th scope="col" className="px-4 py-3">Sub-Level</th>
                <th scope="col" className="px-4 py-3">Level Range</th>
                <th scope="col" className="px-4 py-3">Stat Ceiling</th>
                <th scope="col" className="px-4 py-3 hidden md:table-cell">Real-World Analogue</th>
              </tr>
            </thead>
            <tbody>
              {RANKS_DATA.map((rank, index) => (
                <tr key={index} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-750">
                  <td className="px-4 py-3 font-medium text-sky-200">{rank.name}</td>
                  <td className="px-4 py-3">{rank.subLevel || 'N/A'}</td>
                  <td className="px-4 py-3">
                    {rank.levelRange[0]} - {rank.levelRange[1] === null ? '∞' : rank.levelRange[1]}
                  </td>
                  <td className="px-4 py-3">{rank.statCeiling}{rank.name === "Ω (Transcendent)" ? "+" : ""}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{rank.realWorldAnalogue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-700 text-right">
            <button
                onClick={onClose}
                className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition duration-150"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default RankSystemModal;
