
import React, { useMemo } from 'react';
import { usePlayerData } from '../context/PlayerDataContext';
import { RoadmapEvent, RoadmapEventType, RankName, SubLevel } from '../types';
import { RANKS_DATA } from '../constants';

const RoadmapCalendar: React.FC = () => {
  const { playerData } = usePlayerData();
  const { roadmapEvents, isLoadingRoadmap, currentGoalId } = playerData;

  const getEventTypeColor = (type: RoadmapEventType): string => {
    switch (type) {
      case RoadmapEventType.Dungeon:
        return 'border-purple-500';
      case RoadmapEventType.BossBattle:
        return 'border-red-500';
      default:
        return 'border-slate-600';
    }
  };

  const getEventTypeIcon = (type: RoadmapEventType): string => {
    switch (type) {
      case RoadmapEventType.Dungeon:
        return '🛡️'; // Shield for Dungeon
      case RoadmapEventType.BossBattle:
        return '⚔️'; // Crossed swords for Boss Battle
      default:
        return '📌';
    }
  };

  const eventsByRankSubLevelMap = useMemo(() => {
    const map = new Map<string, RoadmapEvent[]>();
    if (!roadmapEvents) return map;
    roadmapEvents.forEach(event => {
      const key = `${event.targetRankName}-${event.targetSubLevel}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      // Add event if not already present (based on ID to avoid duplicates if any)
      if (!map.get(key)!.find(e => e.id === event.id)) {
          map.get(key)!.push(event);
      }
      // Sort events within the same rank/sub-level by target level
      map.get(key)!.sort((a, b) => a.targetLevel - b.targetLevel);
    });
    return map;
  }, [roadmapEvents]);

  if (!currentGoalId && !isLoadingRoadmap) {
    return (
        <section aria-labelledby="roadmap-calendar-heading" className="bg-slate-800 p-6 rounded-lg shadow-xl border border-teal-500">
            <h2 id="roadmap-calendar-heading" className="text-2xl font-semibold text-teal-300 mb-4">Strategic Objective Roadmap</h2>
            <p className="text-slate-400 italic">Please initialize a primary goal to view your strategic roadmap.</p>
        </section>
    );
  }


  return (
    <section aria-labelledby="roadmap-calendar-heading" className="bg-slate-800 p-6 rounded-lg shadow-xl border border-teal-500">
      <h2 id="roadmap-calendar-heading" className="text-2xl font-semibold text-teal-300 mb-4">Strategic Objective Roadmap</h2>

      {isLoadingRoadmap && (
        <div className="flex items-center justify-center p-4 bg-slate-750 rounded-md">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-400 mr-3"></div>
          <p className="text-slate-300">System is charting your long-term strategic objectives...</p>
        </div>
      )}

      {!isLoadingRoadmap && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm text-left text-slate-300">
            <thead className="text-xs text-teal-200 uppercase bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-3">Rank</th>
                <th scope="col" className="px-4 py-3">Sub-Level</th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">Level Range</th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">Stat Ceiling</th>
                <th scope="col" className="px-4 py-3 hidden md:table-cell">Real-World Analogue</th>
                <th scope="col" className="px-4 py-3">Scheduled Milestones</th>
              </tr>
            </thead>
            <tbody>
              {RANKS_DATA.map((rankEntry) => {
                const key = `${rankEntry.name}-${rankEntry.subLevel}`;
                const milestoneEvents = eventsByRankSubLevelMap.get(key) || [];
                return (
                  <tr key={`${rankEntry.name}-${rankEntry.subLevel}`} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-750">
                    <td className="px-4 py-3 font-medium text-sky-200">{rankEntry.name}</td>
                    <td className="px-4 py-3">{rankEntry.subLevel || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {rankEntry.levelRange[0]} - {rankEntry.levelRange[1] === null ? '∞' : rankEntry.levelRange[1]}
                    </td>
                    <td className="px-4 py-3">{rankEntry.statCeiling}{rankEntry.name === RankName.Omega ? "+" : ""}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{rankEntry.realWorldAnalogue}</td>
                    <td className="px-4 py-3">
                      {milestoneEvents.length > 0 ? (
                        <ul className="space-y-2">
                          {milestoneEvents.map(event => (
                            <li key={event.id} className={`p-2 bg-slate-700 rounded-md shadow border-l-2 ${getEventTypeColor(event.type)}`}>
                              <div className="font-semibold text-slate-100">
                                <span className="mr-1.5" aria-hidden="true">{getEventTypeIcon(event.type)}</span>
                                {event.name}
                              </div>
                              <p className="text-xs text-slate-400">
                                Target Lv. {event.targetLevel} | <span className="font-medium text-sky-300">{event.status}</span>
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5 truncate" title={event.description}>{event.description}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500 italic">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {roadmapEvents.length === 0 && !isLoadingRoadmap && currentGoalId && (
             <p className="text-slate-400 italic mt-4">No strategic roadmap milestones generated by the System for your current goal. Focus on general progression.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default RoadmapCalendar;
