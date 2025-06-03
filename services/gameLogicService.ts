import { RANKS_DATA, XP_PER_LEVEL_BASE, XP_PER_LEVEL_MULTIPLIER, STAT_POINTS_PER_LEVEL, GOAL_ARCHETYPES } from '../constants';
import { RankData, GoalArchetype, UserStat } from '../types'; // Removed unused imports like Quest, DungeonIdea etc.
import { MessageType } from '../components/SystemMessage';

// Helper function to calculate XP needed for the next level
export const calculateXpToNextLevel = (currentLevel: number): number => {
  return Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_PER_LEVEL_MULTIPLIER, currentLevel - 1));
};

// Helper function to get rank based on level
export const getRankForLevel = (level: number): RankData => {
  for (const rank of RANKS_DATA) {
    const [minLevel, maxLevel] = rank.levelRange;
    if (maxLevel === null) { // For Omega rank with no upper level limit
      if (level >= minLevel) return rank;
    } else {
      if (level >= minLevel && level <= maxLevel) return rank;
    }
  }
  // This part should ideally not be reached if RANKS_DATA is comprehensive
  // and starts from level 1.
  console.warn(`Level ${level} is outside defined rank ranges. Defaulting to lowest rank.`);
  return RANKS_DATA[0]; 
};

// Helper function to get initial stats for a goal
export const getInitialStatsForGoal = (goalArchetype: GoalArchetype): UserStat[] => {
  return goalArchetype.defaultStats.map(statDef => ({
    name: statDef.name,
    value: 5, // Starting value for all stats
    description: statDef.description,
  }));
};

export const awardXP = (
  currentXP: number, 
  currentLevel: number, 
  xpGained: number, 
  currentStatPoints: number, 
  systemMessageEmitter: (message: string, type: MessageType) => void, 
  currentRank: RankData
): { newXP: number, newLevel: number, newStatPoints: number, newRank: RankData, leveledUp: boolean, rankChanged: boolean } => {
  let newXP = currentXP + xpGained;
  let newLevel = currentLevel;
  let newStatPoints = currentStatPoints;
  let leveledUp = false;
  let newRank = currentRank;
  let rankChanged = false;

  let xpToNext = calculateXpToNextLevel(newLevel);

  while (newXP >= xpToNext) {
    newLevel++;
    newXP -= xpToNext;
    newStatPoints += STAT_POINTS_PER_LEVEL;
    leveledUp = true;
    systemMessageEmitter(`Level Up! Reached Level ${newLevel}. You gained ${STAT_POINTS_PER_LEVEL} Stat Point(s).`, MessageType.Reward);
    xpToNext = calculateXpToNextLevel(newLevel);
    
    const potentialNewRank = getRankForLevel(newLevel);
    // Check if rank or sub-level actually changed
    if (potentialNewRank.name !== newRank.name || potentialNewRank.subLevel !== newRank.subLevel) {
      newRank = potentialNewRank;
      rankChanged = true; // Set rankChanged flag
      systemMessageEmitter(`Rank Up! You are now ${newRank.name}${newRank.subLevel !== "" ? ` ${newRank.subLevel}` : ''}. Stat ceilings increased!`, MessageType.System);
      // Future: Trigger a "Rank-Up Quest" or special event here.
    }
  }
  return { newXP, newLevel, newStatPoints, newRank, leveledUp, rankChanged };
};
