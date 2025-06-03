
import { RankData, GoalArchetype, StatDefinition, RankName, SubLevel } from './types';
export type { RankData }; // Exporting RankData type

export const XP_PER_LEVEL_BASE = 100;
export const XP_PER_LEVEL_MULTIPLIER = 1.2;
export const STAT_POINTS_PER_LEVEL = 2;

export const RANKS_DATA: RankData[] = [
  { name: RankName.E, subLevel: SubLevel.IV, levelRange: [1, 3], statCeiling: 25, realWorldAnalogue: "Untrained adult" },
  { name: RankName.E, subLevel: SubLevel.III, levelRange: [4, 6], statCeiling: 30, realWorldAnalogue: "Active hobbyist" },
  { name: RankName.E, subLevel: SubLevel.II, levelRange: [7, 9], statCeiling: 35, realWorldAnalogue: "Weekend warrior" },
  { name: RankName.E, subLevel: SubLevel.I, levelRange: [10, 12], statCeiling: 40, realWorldAnalogue: "Fit amateur" },
  { name: RankName.D, subLevel: SubLevel.IV, levelRange: [13, 16], statCeiling: 50, realWorldAnalogue: "Serious trainee" },
  { name: RankName.D, subLevel: SubLevel.III, levelRange: [17, 20], statCeiling: 55, realWorldAnalogue: "Local competitor" },
  { name: RankName.D, subLevel: SubLevel.II, levelRange: [21, 24], statCeiling: 60, realWorldAnalogue: "Regional finalist" },
  { name: RankName.D, subLevel: SubLevel.I, levelRange: [25, 28], statCeiling: 65, realWorldAnalogue: "Top regional" },
  { name: RankName.C, subLevel: SubLevel.IV, levelRange: [29, 33], statCeiling: 70, realWorldAnalogue: "National-level" },
  { name: RankName.C, subLevel: SubLevel.III, levelRange: [34, 38], statCeiling: 75, realWorldAnalogue: "Lower pro tier" },
  { name: RankName.C, subLevel: SubLevel.II, levelRange: [39, 43], statCeiling: 80, realWorldAnalogue: "Solid pro" },
  { name: RankName.C, subLevel: SubLevel.I, levelRange: [44, 48], statCeiling: 85, realWorldAnalogue: "National podium" },
  { name: RankName.B, subLevel: SubLevel.IV, levelRange: [49, 54], statCeiling: 90, realWorldAnalogue: "Continental elite" },
  { name: RankName.B, subLevel: SubLevel.III, levelRange: [55, 60], statCeiling: 95, realWorldAnalogue: "Fringe world-class" },
  { name: RankName.B, subLevel: SubLevel.II, levelRange: [61, 66], statCeiling: 100, realWorldAnalogue: "World-class" },
  { name: RankName.B, subLevel: SubLevel.I, levelRange: [67, 72], statCeiling: 105, realWorldAnalogue: "Consistent podium" },
  { name: RankName.A, subLevel: SubLevel.IV, levelRange: [73, 79], statCeiling: 110, realWorldAnalogue: "Olympic finalist / PhD savant" },
  { name: RankName.A, subLevel: SubLevel.III, levelRange: [80, 86], statCeiling: 115, realWorldAnalogue: "Gold-medal threat" },
  { name: RankName.A, subLevel: SubLevel.II, levelRange: [87, 93], statCeiling: 120, realWorldAnalogue: "World record fringe" },
  { name: RankName.A, subLevel: SubLevel.I, levelRange: [94, 100], statCeiling: 125, realWorldAnalogue: "Record holder" },
  { name: RankName.S, subLevel: SubLevel.IV, levelRange: [101, 108], statCeiling: 130, realWorldAnalogue: "“How is that human?”" },
  { name: RankName.S, subLevel: SubLevel.III, levelRange: [109, 116], statCeiling: 135, realWorldAnalogue: "Dominates experts" },
  { name: RankName.S, subLevel: SubLevel.II, levelRange: [117, 124], statCeiling: 140, realWorldAnalogue: "Alters the meta" },
  { name: RankName.S, subLevel: SubLevel.I, levelRange: [125, 132], statCeiling: 145, realWorldAnalogue: "Iconic legend" },
  { name: RankName.EX, subLevel: SubLevel.IV, levelRange: [133, 141], statCeiling: 150, realWorldAnalogue: "Front-page anomaly" },
  { name: RankName.EX, subLevel: SubLevel.III, levelRange: [142, 150], statCeiling: 155, realWorldAnalogue: "Redefines limits" },
  { name: RankName.EX, subLevel: SubLevel.II, levelRange: [151, 159], statCeiling: 160, realWorldAnalogue: "“New species?”" },
  { name: RankName.EX, subLevel: SubLevel.I, levelRange: [160, 168], statCeiling: 165, realWorldAnalogue: "Sung Jinwoo zone" },
  { name: RankName.SS, subLevel: SubLevel.IV, levelRange: [169, 175], statCeiling: 180, realWorldAnalogue: "Urban-legend feats" },
  { name: RankName.SS, subLevel: SubLevel.III, levelRange: [176, 182], statCeiling: 180, realWorldAnalogue: "Urban-legend feats" },
  { name: RankName.SS, subLevel: SubLevel.II, levelRange: [183, 189], statCeiling: 180, realWorldAnalogue: "Urban-legend feats" },
  { name: RankName.SS, subLevel: SubLevel.I, levelRange: [190, 196], statCeiling: 180, realWorldAnalogue: "Urban-legend feats" },
  { name: RankName.Omega, subLevel: SubLevel.None, levelRange: [197, null], statCeiling: 200, realWorldAnalogue: "Lore, not sport" }, // Stat ceiling can be 200+
];

export const GOAL_ARCHETYPES: GoalArchetype[] = [
  {
    id: "python_dev",
    name: "Become a Proficient Python Programmer",
    description: "Master Python for software development, data science, or web applications.",
    difficulty: "Challenging",
    targetRankId: { name: RankName.A, subLevel: SubLevel.IV },
    defaultStats: [
      { name: "Knowledge", description: "Understanding of Python syntax, libraries, and concepts." },
      { name: "Problem-Solving", description: "Ability to break down and solve coding challenges." },
      { name: "Project Exp", description: "Experience building and completing Python projects." },
      { name: "Consistency", description: "Regularity of practice and learning." },
      { name: "Focus", description: "Ability to concentrate during learning/coding sessions." },
    ],
  },
  {
    id: "marathon_runner",
    name: "Run a Marathon",
    description: "Train cardiovascular endurance, strength, and mental fortitude to complete a 42.195km race.",
    difficulty: "Formidable",
    targetRankId: { name: RankName.B, subLevel: SubLevel.II },
    defaultStats: [
      { name: "Endurance", description: "Ability to sustain physical activity over long periods." },
      { name: "Speed", description: "Pace and quickness during runs." },
      { name: "Strength", description: "Muscular power for efficient running form and injury prevention." },
      { name: "Discipline", description: "Adherence to training plan and routines." },
      { name: "Recovery", description: "Effectiveness of rest and recuperation strategies." },
    ],
  },
  {
    id: "fantasy_novelist",
    name: "Write and Publish a Fantasy Novel",
    description: "Craft a compelling story, develop rich characters, build an immersive world, and navigate the publishing process.",
    difficulty: "Challenging",
    targetRankId: { name: RankName.A, subLevel: SubLevel.IV },
    defaultStats: [
      { name: "Creativity", description: "Originality and imagination in storytelling." },
      { name: "Writing Skill", description: "Proficiency in prose, pacing, and narrative structure." },
      { name: "World-Building", description: "Depth and consistency of the fictional universe." },
      { name: "Discipline", description: "Commitment to writing schedule and manuscript completion." },
      { name: "Editing", description: "Ability to revise and polish the manuscript effectively." },
    ],
  },
];
