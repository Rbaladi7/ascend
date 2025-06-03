// Base Enums and Interfaces to break circular dependencies

export enum RankName {
  E = "E (Novice)",
  D = "D (Apprentice)",
  C = "C (Specialist)",
  B = "B (Elite)",
  A = "A (Master)",
  S = "S (Champion)",
  EX = "EX (Super-human)",
  SS = "SS (Mythic)",
  Omega = "Ω (Transcendent)",
}

export enum SubLevel {
  IV = "IV",
  III = "III",
  II = "II",
  I = "I",
  None = "", // For Omega rank
}

export interface RankData {
  name: RankName;
  subLevel: SubLevel;
  levelRange: [number, number] | [number, null]; // [min, max] or [min, null] for Omega
  statCeiling: number;
  realWorldAnalogue: string;
}

export interface StatDefinition {
  name: string;
  description: string;
}

export interface GoalArchetype {
  id: string;
  name: string;
  description: string;
  defaultStats: StatDefinition[];
  difficulty?: string;
  targetRankId?: { name: RankName; subLevel: SubLevel };
}

export interface UserStat {
  name: string;
  value: number;
  description?: string;
}

export interface Quest {
  id: string;
  text: string;
  xpReward: number;
  isCompleted: boolean;
  penalty?: string; // e.g. "XP Debt if not completed by midnight"
}

export interface ItemRewardSuggestion {
  name: string;
  type: string; // e.g., "Consumable", "Key Item", "Equipment"
  description?: string; // Optional: AI can suggest a brief description
}

export interface DungeonIdea {
  name: string;
  description: string;
  tasks: string[]; // List of tasks to complete the dungeon
  xpReward: number;
  itemRewardSuggestion?: ItemRewardSuggestion; // Optional item reward
}

export interface ActiveDungeon {
  idea: DungeonIdea;
  completedTasks: boolean[];
}

export interface BossBattleIdea {
  name: string;
  description: string;
  successConditions: string[];
  penaltyForFailure: string;
  xpReward: number;
  itemRewardSuggestion?: ItemRewardSuggestion;
}

export interface ActiveBossBattle {
  idea: BossBattleIdea;
  // Could add more state here later, like attempts remaining, etc.
}

export interface Item {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface InventorySlot {
  item: Item;
  quantity: number;
}

export interface ProgressionFocus {
  chapterTitle: string;
  overarchingObjective: string;
  // Potentially add suggestedNextMajorMilestone (e.g., "Next Boss: The Gatekeeper of Rank C")
}

export enum RoadmapEventType {
  Dungeon = "Dungeon",
  BossBattle = "BossBattle",
}

export enum RoadmapEventStatus {
  Planned = "Planned",
  // InProgress = "In Progress", // Future use
  // Completed = "Completed", // Future use
  // Skipped = "Skipped", // Future use
}

export interface RoadmapEvent {
  id: string; // Generated client-side
  type: RoadmapEventType;
  name: string;
  description: string;
  targetRankName: RankName;
  targetSubLevel: SubLevel;
  targetLevel: number; // Approximate player level for this event
  status: RoadmapEventStatus;
}


// This file can be used for types shared across UI components that are not game-logic specific.
// For now, most core types are in `services/gameLogicService.ts` to be close to their logic.

export interface TestInterface { // Example, can be removed
    id: string;
}
