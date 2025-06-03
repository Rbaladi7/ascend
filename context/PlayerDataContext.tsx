import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { RankData, UserStat, Quest, DungeonIdea, BossBattleIdea, GoalArchetype, ActiveDungeon, Item, InventorySlot, ActiveBossBattle, ItemRewardSuggestion, ProgressionFocus, RoadmapEvent, RoadmapEventType, RoadmapEventStatus, RankName, SubLevel } from '../types';
import { getRankForLevel, calculateXpToNextLevel, getInitialStatsForGoal, awardXP } from '../services/gameLogicService';
import { RANKS_DATA, GOAL_ARCHETYPES } from '../constants';
import { MessageType } from '../components/SystemMessage';
import * as aiService from '../services/aiService';

export interface PlayerData {
  currentGoalId: string | null | undefined; // undefined for initial loading state
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: RankData;
  stats: UserStat[];
  statPoints: number;
  dailyQuests: Quest[];
  
  dungeonIdea: DungeonIdea | null;
  activeDungeon: ActiveDungeon | null;

  bossBattleIdea: BossBattleIdea | null;
  activeBossBattle: ActiveBossBattle | null;

  inventory: InventorySlot[];

  progressionFocus: ProgressionFocus | null; 
  roadmapEvents: RoadmapEvent[]; // New: For storing AI-generated roadmap

  isLoadingQuests: boolean;
  isLoadingDungeon: boolean;
  isLoadingBossBattle: boolean;
  isLoadingProgressionFocus: boolean;
  isLoadingRoadmap: boolean; // New: Loading state for roadmap generation
  systemMessageEmitter: (message: string, type: MessageType) => void;
}

const initialEmitter = (message: string, type: MessageType) => {
  console.log(`System [${type}]: ${message}`); // Fallback emitter
};

const initialRank = RANKS_DATA[0]; // E-IV
const initialPlayerData: PlayerData = {
  currentGoalId: undefined,
  level: 1,
  xp: 0,
  xpToNextLevel: calculateXpToNextLevel(1),
  rank: initialRank,
  stats: [],
  statPoints: 0,
  dailyQuests: [],
  dungeonIdea: null,
  activeDungeon: null,
  bossBattleIdea: null,
  activeBossBattle: null,
  inventory: [],
  progressionFocus: null,
  roadmapEvents: [], // Initialize empty
  isLoadingQuests: false,
  isLoadingDungeon: false,
  isLoadingBossBattle: false,
  isLoadingProgressionFocus: false,
  isLoadingRoadmap: false, // Initialize false
  systemMessageEmitter: initialEmitter,
};

interface PlayerDataContextType {
  playerData: PlayerData;
  setPlayerData: React.Dispatch<React.SetStateAction<PlayerData>>;
  initializePlayer: (goalId: string) => Promise<void>; 
  resetPlayerProgress: () => void;
  // Quests
  fetchDailyQuests: () => Promise<void>;
  completeQuest: (questId: string) => void;
  // Stats
  incrementStat: (statName: string) => void;
  // Dungeons
  fetchDungeonIdea: () => Promise<void>;
  startDungeon: () => void;
  completeDungeonTask: (taskIndex: number) => void;
  abandonDungeon: () => void;
  // Boss Battles
  fetchBossBattleIdea: () => Promise<void>;
  startBossBattle: () => void;
  concludeBossBattle: (success: boolean) => void;
  // Progression
  fetchAndSetProgressionFocus: () => Promise<void>;
  // System
  setSystemMessageEmitter: (emitter: (message: string, type: MessageType) => void) => void;
}

const PlayerDataContext = createContext<PlayerDataContextType | undefined>(undefined);

export const PlayerDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerData, setPlayerData] = useState<PlayerData>(initialPlayerData);

  const { systemMessageEmitter } = playerData;

  const setSystemMessageEmitter = useCallback((emitter: (message: string, type: MessageType) => void) => {
    setPlayerData(prev => ({ ...prev, systemMessageEmitter: emitter }));
  }, []);

  const fetchAndSetProgressionFocus = useCallback(async (goal: GoalArchetype, rank: RankData, targetRankDetails: RankData | null) => {
    if (playerData.isLoadingProgressionFocus) return;

    setPlayerData(prev => ({ ...prev, isLoadingProgressionFocus: true }));
    systemMessageEmitter("Querying System for current progression focus...", MessageType.System);
    try {
      const focus = await aiService.generateProgressionFocus(goal, rank, targetRankDetails);
      setPlayerData(prev => ({ ...prev, progressionFocus: focus, isLoadingProgressionFocus: false }));
      if (focus) {
        systemMessageEmitter(`Progression Focus Updated: ${focus.chapterTitle}. Objective: ${focus.overarchingObjective}`, MessageType.Info);
      } else {
        systemMessageEmitter("Could not retrieve progression focus from AI.", MessageType.Warning);
      }
    } catch (error) {
      console.error("Failed to fetch progression focus:", error);
      setPlayerData(prev => ({ ...prev, isLoadingProgressionFocus: false }));
      systemMessageEmitter("Error retrieving progression focus.", MessageType.Error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemMessageEmitter]); // Removed playerData.isLoadingProgressionFocus from dependencies to avoid stale closure issues. Check logic if problems arise.

  const fetchAndSetInitialRoadmap = useCallback(async (goal: GoalArchetype, initialRank: RankData, targetRank: RankData | null) => {
    setPlayerData(prev => ({ ...prev, isLoadingRoadmap: true }));
    systemMessageEmitter("Generating strategic roadmap...", MessageType.System);
    try {
      const events = await aiService.generateRoadmapEvents(goal, initialRank, targetRank);
      setPlayerData(prev => ({ ...prev, roadmapEvents: events || [], isLoadingRoadmap: false }));
      if (events && events.length > 0) {
        systemMessageEmitter(`Strategic roadmap generated with ${events.length} key milestones.`, MessageType.Info);
      } else {
        systemMessageEmitter("Could not generate a strategic roadmap. Proceed with general objectives.", MessageType.Warning);
      }
    } catch (error) {
      console.error("Failed to fetch strategic roadmap:", error);
      setPlayerData(prev => ({ ...prev, roadmapEvents: [], isLoadingRoadmap: false }));
      systemMessageEmitter("Error generating strategic roadmap.", MessageType.Error);
    }
  }, [systemMessageEmitter]);
  
  const initializePlayer = useCallback(async (goalId: string) => {
    const selectedGoalArchetype = GOAL_ARCHETYPES.find(g => g.id === goalId);
    if (!selectedGoalArchetype) {
      systemMessageEmitter("Error: Goal not found.", MessageType.Error);
      return;
    }
    
    const initialLevel = 1;
    const initialPlayerRank = getRankForLevel(initialLevel);
    const initialPlayerStats = getInitialStatsForGoal(selectedGoalArchetype);
    const initialXpToNext = calculateXpToNextLevel(initialLevel);

    setPlayerData(prev => ({
      ...prev,
      currentGoalId: goalId,
      level: initialLevel,
      xp: 0,
      xpToNextLevel: initialXpToNext,
      rank: initialPlayerRank,
      stats: initialPlayerStats,
      statPoints: 0, 
      dailyQuests: [],
      dungeonIdea: null,
      activeDungeon: null,
      bossBattleIdea: null,
      activeBossBattle: null,
      inventory: [],
      progressionFocus: null,
      roadmapEvents: [], // Reset roadmap events on new goal
      isLoadingQuests: false,
      isLoadingDungeon: false,
      isLoadingBossBattle: false,
      isLoadingProgressionFocus: false, 
      isLoadingRoadmap: false, 
    }));
    systemMessageEmitter(`System Initialized. Goal: ${selectedGoalArchetype.name}. Rank: ${initialPlayerRank.name} ${initialPlayerRank.subLevel}.`, MessageType.System);
    
    const targetRankDetails = selectedGoalArchetype.targetRankId 
      ? RANKS_DATA.find(r => r.name === selectedGoalArchetype.targetRankId?.name && r.subLevel === selectedGoalArchetype.targetRankId?.subLevel) 
      : null;
    
    // Fetch both progression focus and roadmap concurrently
    await Promise.all([
      fetchAndSetProgressionFocus(selectedGoalArchetype, initialPlayerRank, targetRankDetails),
      fetchAndSetInitialRoadmap(selectedGoalArchetype, initialPlayerRank, targetRankDetails)
    ]);

  }, [systemMessageEmitter, fetchAndSetProgressionFocus, fetchAndSetInitialRoadmap]);

  const resetPlayerProgress = useCallback(() => {
    localStorage.removeItem('projectAscendData');
    setPlayerData(prev => ({
      ...initialPlayerData,
      currentGoalId: null, 
      systemMessageEmitter: prev.systemMessageEmitter, 
    }));
  }, []);


  const awardItem = useCallback((itemSuggestion: ItemRewardSuggestion) => {
    setPlayerData(prev => {
      const newItem: Item = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        name: itemSuggestion.name,
        type: itemSuggestion.type,
        description: itemSuggestion.description || "A mysterious item of unknown origin."
      };

      const existingSlotIndex = prev.inventory.findIndex(slot => slot.item.name === newItem.name && slot.item.type === newItem.type);
      let newInventory = [...prev.inventory];

      if (existingSlotIndex > -1 && newItem.type === "Consumable") { 
        newInventory[existingSlotIndex] = {
          ...newInventory[existingSlotIndex],
          quantity: newInventory[existingSlotIndex].quantity + 1,
        };
      } else {
        newInventory.push({ item: newItem, quantity: 1 });
      }
      systemMessageEmitter(`Obtained: ${newItem.name}!`, MessageType.Reward);
      return { ...prev, inventory: newInventory };
    });
  }, [systemMessageEmitter]);

  const fetchDailyQuests = async () => {
    if (!playerData.currentGoalId || playerData.isLoadingQuests) return;
    const goal = GOAL_ARCHETYPES.find(g => g.id === playerData.currentGoalId);
    if (!goal) {
      systemMessageEmitter("Error: Current goal not found for quests.", MessageType.Error);
      return;
    }
    setPlayerData(prev => ({ ...prev, isLoadingQuests: true }));
    systemMessageEmitter("Requesting daily quest briefing...", MessageType.System);
    try {
      const quests = await aiService.generateDailyQuests(goal, playerData.rank, playerData.level, playerData.stats, playerData.progressionFocus);
      setPlayerData(prev => ({ ...prev, dailyQuests: quests, isLoadingQuests: false }));
      systemMessageEmitter(`Daily quests received: ${quests.length} assignments.`, MessageType.System);
    } catch (error) {
      console.error("Failed to fetch daily quests:", error);
      setPlayerData(prev => ({ ...prev, isLoadingQuests: false }));
      systemMessageEmitter("Error retrieving daily quests.", MessageType.Error);
    }
  };
  
  const completeQuest = (questId: string) => {
    setPlayerData(prev => {
      const quest = prev.dailyQuests.find(q => q.id === questId);
      if (!quest || quest.isCompleted) return prev;

      const updatedQuests = prev.dailyQuests.map(q => q.id === questId ? { ...q, isCompleted: true } : q);
      systemMessageEmitter(`Quest "${quest.text}" completed! +${quest.xpReward} XP`, MessageType.Reward);

      const { newXP, newLevel, newStatPoints, newRank, rankChanged } = awardXP(
        prev.xp, prev.level, quest.xpReward, prev.statPoints, systemMessageEmitter, prev.rank
      );
      
      if (rankChanged) {
        const goal = GOAL_ARCHETYPES.find(g => g.id === prev.currentGoalId);
        if (goal) {
          const targetRankDetails = goal.targetRankId
            ? RANKS_DATA.find(r => r.name === goal.targetRankId?.name && r.subLevel === goal.targetRankId?.subLevel)
            : null;
          fetchAndSetProgressionFocus(goal, newRank, targetRankDetails); // Call the standalone function
        }
      }
      
      return {
        ...prev,
        dailyQuests: updatedQuests,
        xp: newXP,
        level: newLevel,
        statPoints: newStatPoints,
        rank: newRank,
        xpToNextLevel: calculateXpToNextLevel(newLevel),
      };
    });
  };

  const incrementStat = (statName: string) => {
    setPlayerData(prev => {
      if (prev.statPoints <= 0) {
        systemMessageEmitter("No stat points available.", MessageType.Warning);
        return prev;
      }
      const statIndex = prev.stats.findIndex(s => s.name === statName);
      if (statIndex === -1) return prev;

      if (prev.stats[statIndex].value >= prev.rank.statCeiling) {
        systemMessageEmitter(`Stat ${statName} at max for Rank ${prev.rank.name} ${prev.rank.subLevel}.`, MessageType.Warning);
        return prev;
      }

      const newStats = [...prev.stats];
      newStats[statIndex] = { ...newStats[statIndex], value: newStats[statIndex].value + 1 };
      systemMessageEmitter(`${statName} increased to ${newStats[statIndex].value}.`, MessageType.System);

      return { ...prev, stats: newStats, statPoints: prev.statPoints - 1 };
    });
  };

  const fetchDungeonIdea = async () => {
    if (!playerData.currentGoalId || playerData.isLoadingDungeon || playerData.activeDungeon || playerData.dungeonIdea) return;
    const goal = GOAL_ARCHETYPES.find(g => g.id === playerData.currentGoalId);
    if (!goal) {
      systemMessageEmitter("Error: Current goal not found for dungeon scan.", MessageType.Error);
      return;
    }
    setPlayerData(prev => ({ ...prev, isLoadingDungeon: true }));
    systemMessageEmitter("Scanning for anomalous energy signatures (Dungeons)...", MessageType.System);
    try {
      const idea = await aiService.generateDungeonIdea(goal, playerData.rank, playerData.level, playerData.progressionFocus);
      setPlayerData(prev => ({ ...prev, dungeonIdea: idea, isLoadingDungeon: false }));
      if (idea) {
        systemMessageEmitter(`Anomaly detected: Dungeon "${idea.name}"! Awaiting orders.`, MessageType.Info);
      } else {
        systemMessageEmitter(`Dungeon scan failed. Sector clear... for now. (AI response was null)`, MessageType.Error);
      }
    } catch (error) {
      console.error("Failed to fetch dungeon idea:", error);
      setPlayerData(prev => ({ ...prev, isLoadingDungeon: false }));
      systemMessageEmitter("Dungeon scan failed. Sector clear... for now.", MessageType.Error);
    }
  };

  const startDungeon = () => {
    setPlayerData(prev => {
      if (!prev.dungeonIdea) {
        systemMessageEmitter("No dungeon blueprint available to initiate.", MessageType.Warning);
        return prev;
      }
      const newActiveDungeon: ActiveDungeon = {
        idea: prev.dungeonIdea,
        completedTasks: prev.dungeonIdea.tasks.map(() => false),
      };
      systemMessageEmitter(`Entering Dungeon: "${newActiveDungeon.idea.name}"... Good luck.`, MessageType.System);
      return { ...prev, activeDungeon: newActiveDungeon, dungeonIdea: null };
    });
  };

  const completeDungeonTask = (taskIndex: number) => {
    setPlayerData(prev => {
      if (!prev.activeDungeon || taskIndex < 0 || taskIndex >= prev.activeDungeon.idea.tasks.length) return prev;

      const newCompletedTasks = [...prev.activeDungeon.completedTasks];
      newCompletedTasks[taskIndex] = true;
      
      systemMessageEmitter(`Dungeon Task: "${prev.activeDungeon.idea.tasks[taskIndex]}" completed.`, MessageType.Info);

      const allTasksCompleted = newCompletedTasks.every(status => status);
      if (allTasksCompleted) {
        systemMessageEmitter(`All tasks in "${prev.activeDungeon.idea.name}" complete! Dungeon Cleared!`, MessageType.Reward);
        const { newXP, newLevel, newStatPoints, newRank, rankChanged } = awardXP(
          prev.xp, prev.level, prev.activeDungeon.idea.xpReward, prev.statPoints, systemMessageEmitter, prev.rank
        );
        if (prev.activeDungeon.idea.itemRewardSuggestion) {
          awardItem(prev.activeDungeon.idea.itemRewardSuggestion);
        }
         if (rankChanged) {
            const goal = GOAL_ARCHETYPES.find(g => g.id === prev.currentGoalId);
            if (goal) {
                const targetRankDetails = goal.targetRankId ? RANKS_DATA.find(r => r.name === goal.targetRankId?.name && r.subLevel === goal.targetRankId.subLevel) : null;
                fetchAndSetProgressionFocus(goal, newRank, targetRankDetails);
            }
        }
        return { 
          ...prev, 
          activeDungeon: null, 
          xp: newXP, 
          level: newLevel, 
          statPoints: newStatPoints, 
          rank: newRank,
          xpToNextLevel: calculateXpToNextLevel(newLevel),
        };
      }
      return { ...prev, activeDungeon: { ...prev.activeDungeon, completedTasks: newCompletedTasks } };
    });
  };
  
  const abandonDungeon = () => {
    setPlayerData(prev => {
      if (!prev.activeDungeon) return prev;
      systemMessageEmitter(`Retreating from Dungeon: "${prev.activeDungeon.idea.name}". Progress lost.`, MessageType.Warning);
      return { ...prev, activeDungeon: null, dungeonIdea: null }; 
    });
  };

  const fetchBossBattleIdea = async () => {
    if (!playerData.currentGoalId || playerData.isLoadingBossBattle || playerData.activeBossBattle || playerData.bossBattleIdea) return;
    const goal = GOAL_ARCHETYPES.find(g => g.id === playerData.currentGoalId);
    if (!goal) {
      systemMessageEmitter("Error: Current goal not found for boss scan.", MessageType.Error);
      return;
    }
    setPlayerData(prev => ({ ...prev, isLoadingBossBattle: true }));
    systemMessageEmitter("Scanning for high-threat entities (Boss Battles)...", MessageType.System);
    try {
      const idea = await aiService.generateBossBattleIdea(goal, playerData.rank, playerData.level, playerData.progressionFocus, playerData.activeDungeon?.idea);
      setPlayerData(prev => ({ ...prev, bossBattleIdea: idea, isLoadingBossBattle: false }));
      if(idea) {
        systemMessageEmitter(`High-Threat Target identified: "${idea.name}"! Prepare for confrontation.`, MessageType.Info);
      } else {
        systemMessageEmitter("Boss scan failed. No significant threats detected. (AI response was null)", MessageType.Error);
      }
    } catch (error) {
      console.error("Failed to fetch boss battle idea:", error);
      setPlayerData(prev => ({ ...prev, isLoadingBossBattle: false }));
      systemMessageEmitter("Boss scan failed. No significant threats detected.", MessageType.Error);
    }
  };

  const startBossBattle = () => {
    setPlayerData(prev => {
      if (!prev.bossBattleIdea) {
        systemMessageEmitter("No boss battle parameters available.", MessageType.Warning);
        return prev;
      }
      const newActiveBossBattle: ActiveBossBattle = { idea: prev.bossBattleIdea };
      systemMessageEmitter(`Confronting Boss: "${newActiveBossBattle.idea.name}"! May victory be yours.`, MessageType.System);
      return { ...prev, activeBossBattle: newActiveBossBattle, bossBattleIdea: null };
    });
  };

  const concludeBossBattle = (success: boolean) => {
    setPlayerData(prev => {
      if (!prev.activeBossBattle) return prev;
      const bossIdea = prev.activeBossBattle.idea;

      if (success) {
        systemMessageEmitter(`Victory! Boss "${bossIdea.name}" defeated! +${bossIdea.xpReward} XP.`, MessageType.Reward);
        const { newXP, newLevel, newStatPoints, newRank, rankChanged } = awardXP(
          prev.xp, prev.level, bossIdea.xpReward, prev.statPoints, systemMessageEmitter, prev.rank
        );
        if (bossIdea.itemRewardSuggestion) {
          awardItem(bossIdea.itemRewardSuggestion);
        }
        if (rankChanged) {
            const goal = GOAL_ARCHETYPES.find(g => g.id === prev.currentGoalId);
            if (goal) {
                const targetRankDetails = goal.targetRankId ? RANKS_DATA.find(r => r.name === goal.targetRankId?.name && r.subLevel === goal.targetRankId.subLevel) : null;
                fetchAndSetProgressionFocus(goal, newRank, targetRankDetails);
            }
        }
        return { 
          ...prev, 
          activeBossBattle: null, 
          xp: newXP, 
          level: newLevel, 
          statPoints: newStatPoints, 
          rank: newRank,
          xpToNextLevel: calculateXpToNextLevel(newLevel),
        };
      } else {
        systemMessageEmitter(`Defeated by "${bossIdea.name}". Penalty: ${bossIdea.penaltyForFailure}`, MessageType.Error);
        return { ...prev, activeBossBattle: null };
      }
    });
  };
  
  const fetchAndSetProgressionFocusWrapper = useCallback(async () => {
    if (!playerData.currentGoalId || playerData.isLoadingProgressionFocus) return;
    const goal = GOAL_ARCHETYPES.find(g => g.id === playerData.currentGoalId);
    if (!goal) {
      systemMessageEmitter("Error: Current goal not found for progression focus.", MessageType.Error);
      return;
    }
    const targetRankDetails = goal.targetRankId 
      ? RANKS_DATA.find(r => r.name === goal.targetRankId?.name && r.subLevel === goal.targetRankId?.subLevel) 
      : null;
    await fetchAndSetProgressionFocus(goal, playerData.rank, targetRankDetails);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerData.currentGoalId, playerData.rank, systemMessageEmitter, fetchAndSetProgressionFocus]);


  return (
    <PlayerDataContext.Provider value={{ 
      playerData, setPlayerData, initializePlayer, resetPlayerProgress,
      fetchDailyQuests, completeQuest, incrementStat,
      fetchDungeonIdea, startDungeon, completeDungeonTask, abandonDungeon,
      fetchBossBattleIdea, startBossBattle, concludeBossBattle,
      fetchAndSetProgressionFocus: fetchAndSetProgressionFocusWrapper,
      setSystemMessageEmitter 
    }}>
      {children}
    </PlayerDataContext.Provider>
  );
};

export const usePlayerData = (): PlayerDataContextType => {
  const context = useContext(PlayerDataContext);
  if (context === undefined) {
    throw new Error('usePlayerData must be used within a PlayerDataProvider');
  }
  return context;
};
