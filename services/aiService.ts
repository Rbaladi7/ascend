
import { GoogleGenAI } from "@google/genai";
import { GoalArchetype, RankData, Quest, UserStat, DungeonIdea, BossBattleIdea, ItemRewardSuggestion, ProgressionFocus, RoadmapEvent, RoadmapEventType, RoadmapEventStatus, RankName, SubLevel } from '../types'; // Corrected path
import { RANKS_DATA } from "../constants"; // For accessing rank details if needed by AI prompt

// Ensure API_KEY is handled by the environment. Do not add UI for it.

// Helper to handle API responses and JSON parsing
async function getAiResponse<T>(prompt: string, modelName: string = "gemini-2.5-flash-preview-04-17"): Promise<T | null> {
  if (!process.env.API_KEY) {
    console.warn(`AI Service (${modelName}): API_KEY not found. Cannot make API call.`);
    return null;
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let rawResponseText = "";
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    rawResponseText = response.text;
    let jsonStr = rawResponseText.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) jsonStr = match[2].trim();
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error(`Error generating content from AI (${modelName}):`, error);
    console.error(`Problematic JSON string (${modelName}):`, rawResponseText);
    return null;
  }
}


export const generateProgressionFocus = async (
  goal: GoalArchetype,
  currentRank: RankData,
  targetRank: RankData | null
): Promise<ProgressionFocus | null> => {
  if (!process.env.API_KEY) {
    console.warn("AI Service: API_KEY not found. Returning fallback progression focus.");
    return {
      chapterTitle: "Chapter 0: The System Link",
      overarchingObjective: "Establish a stable connection with the System AI by configuring the API Key."
    };
  }

  const targetRankName = targetRank ? `${targetRank.name} ${targetRank.subLevel}` : "an unknown destination";
  const prompt = `You are the "System" for Project Ascend, guiding a user towards their goal: "${goal.name}".
Their current rank is ${currentRank.name} ${currentRank.subLevel} (${currentRank.realWorldAnalogue}).
Their ultimate target rank for this goal is ${targetRankName}.

Based on their current rank and ultimate goal, define a "Progression Focus" for their current stage of development. This focus should guide their efforts until their next rank-up or significant milestone.
Provide:
1. "chapterTitle" (string): An inspiring, thematic title for this phase of their journey (e.g., "The Foundations of Discipline", "Mastering Core Algorithms", "The Road to Regional Competence").
2. "overarchingObjective" (string): A concise, high-level objective for them to achieve during this chapter, which will help them progress from ${currentRank.name} ${currentRank.subLevel} towards ${targetRankName}. This objective should be accomplishable within their current rank but push them towards the next.

Return ONLY a VALID JSON object with these two fields.
Example:
{
  "chapterTitle": "E-Rank Trials: Embracing the Grind",
  "overarchingObjective": "Build consistent daily habits and complete foundational learning modules related to '${goal.name}' to prepare for D-Rank challenges."
}

Output ONLY the JSON object. Do not include any other text or markdown.`;

  const result = await getAiResponse<ProgressionFocus>(prompt);
  if (!result) {
    return {
      chapterTitle: "System Error: Focus Generation Offline",
      overarchingObjective: "The AI is currently unable to generate a progression focus. Please focus on self-directed tasks relevant to your main goal and current rank."
    };
  }
  return result;
};


export const generateDailyQuests = async (
  goal: GoalArchetype,
  rank: RankData,
  level: number,
  stats: UserStat[],
  progressionFocus: ProgressionFocus | null
): Promise<Quest[]> => {
  if (!process.env.API_KEY) {
    console.warn("AI Service: API_KEY not found. Returning fallback quests.");
    return [
      { id: `fallback-daily-${Date.now()}-1`, text: `Critical Task: Secure API Key for System AI.`, xpReward: 5, isCompleted: false, penalty: "System functions degraded." },
      { id: `fallback-daily-${Date.now()}-2`, text: `Review project documentation for API_KEY setup.`, xpReward: 5, isCompleted: false },
    ];
  }

  const focusContext = progressionFocus 
    ? `Their current Progression Focus is:
    Chapter: "${progressionFocus.chapterTitle}"
    Objective: "${progressionFocus.overarchingObjective}"
    Quests should align with this objective.`
    : "They do not have a specific progression focus from the AI at this moment; generate general quests for their goal and rank.";

  const prompt = `You are the "System" for Project Ascend. The user's main goal is: "${goal.name} (${goal.description})".
Their current rank is ${rank.name} ${rank.subLevel} (${rank.realWorldAnalogue}). Their level is ${level}.
Their current stats are:
${stats.map(s => `- ${s.name}: ${s.value} (Max for current rank: ${rank.statCeiling})`).join('\n')}
${focusContext}

Generate 3 daily quests tailored to help them progress.
Each quest should be a small, actionable task they can complete today.
For each quest, provide:
1. "text": A concise description of the quest.
2. "xpReward": An integer XP reward (between 10 and 50).
3. "penalty": (Optional) A brief, constructive penalty if not completed.

Focus on building foundational habits and skills relevant to their current rank, stats, and progression objective.
Return the quests as a VALID JSON array of objects. Ensure the JSON is well-formed, with correct comma usage.
Example:
[
  { "text": "Spend 30 minutes on Python exercises targeting list comprehensions.", "xpReward": 20, "penalty": "Tomorrow's focus slightly reduced." }
]

Output ONLY the JSON array. Do not include any other text or markdown.`;

  const generatedQuests = await getAiResponse<Array<{ text: string; xpReward: number; penalty?: string }>>(prompt);
  if (!generatedQuests) {
     return [
      { id: `daily-err-${Date.now()}`, text: "System Error: Could not generate daily quests. Focus on a core task.", xpReward: 10, isCompleted: false }
    ];
  }
  return generatedQuests.map((q, index) => ({
    ...q,
    id: `daily-${Date.now()}-${index}`,
    isCompleted: false,
  }));
};

export const generateDungeonIdea = async (
  goal: GoalArchetype,
  rank: RankData,
  level: number,
  progressionFocus: ProgressionFocus | null
): Promise<DungeonIdea> => {
   if (!process.env.API_KEY) {
    console.warn("AI Service: API_KEY not found. Returning fallback dungeon idea.");
    return {
      name: "Fallback Dungeon: API Key Configuration",
      description: "A critical mission to configure the AI System's API Key for full operational status.",
      tasks: ["Locate API_KEY environment variable.", "Ensure it is correctly set.", "Restart application to verify AI connection."],
      xpReward: 50,
      itemRewardSuggestion: { name: "System Link Cable (Offline)", type: "Key Item", description: "Symbolizes a missing connection."}
    };
  }
  
  const focusContext = progressionFocus
    ? `Their current Progression Focus is:
    Chapter: "${progressionFocus.chapterTitle}"
    Objective: "${progressionFocus.overarchingObjective}"
    This Dungeon should be a significant project or learning module that directly helps them achieve this objective.`
    : `This Dungeon should be a general developmental challenge suitable for their goal "${goal.name}" and rank ${rank.name} ${rank.subLevel}.`;


  const prompt = `You are the "System" for Project Ascend. The user's goal is "${goal.name}".
Their rank is ${rank.name} ${rank.subLevel}, level ${level}.
${focusContext}

Design a "Dungeon" for them. A Dungeon is a significant, multi-stage project or in-depth learning module.
Provide the following fields in a JSON object:
1.  "name" (string): An inspiring, thematic name for the Dungeon (e.g., "The Caverns of Code Structure", "The Forge of Endurance"). Should relate to the objective if provided.
2.  "description" (string): A brief overview of what the Dungeon entails and how it helps with their progression.
3.  "tasks" (JSON array of strings): An array of 3-5 distinct, actionable task strings that represent stages of completing the Dungeon. Each string in this array must be properly quoted.
4.  "xpReward" (integer): An integer XP reward (e.g., 100-500, scaled by perceived difficulty for their rank/level and importance to the objective).
5.  "itemRewardSuggestion" (optional JSON object): If included, an object with "name" (string), "type" (string, e.g., "Key Item", "Consumable", "Badge"), and "description" (string) for a symbolic item rewarded upon completion.

Return ONLY a VALID JSON object matching this structure.
The JSON object must be well-formed. Pay close attention to commas, quotes, brackets, and braces.
Example (if focus was on 'Python Data Structures'):
{
  "name": "The Pythonic Labyrinth of Data",
  "description": "Navigate and master complex data structures (lists, dicts, sets) in Python to fulfill the objective of 'Solidify Python Fundamentals'.",
  "tasks": ["Implement a linked list from scratch.", "Solve 3 medium LeetCode problems using dictionaries.", "Refactor a previous project to use more efficient data structures."],
  "xpReward": 250,
  "itemRewardSuggestion": { "name": "Pip's Compass of Structures", "type": "Key Item", "description": "Guides through complex Python data types." }
}

Output ONLY the JSON object. Do not include any explanatory text or markdown formatting around the JSON.`;
  
  const idea = await getAiResponse<DungeonIdea>(prompt);
   if (!idea) {
    return { 
      name: "Dungeon AI Comms Offline",
      description: "The AI core is temporarily unstable for Dungeon generation. Undertake a self-directed major task aligned with your primary goal and current progression focus if available.",
      tasks: ["Define a significant sub-goal.", "Break it into 3 actionable steps.", "Complete step 1."],
      xpReward: 100,
      itemRewardSuggestion: { name: "Manual Override Key", type: "Key Item", description: "Symbolizes self-reliance."}
    };
  }
  return idea;
};

export const generateBossBattleIdea = async (
  goal: GoalArchetype,
  rank: RankData,
  level: number,
  progressionFocus: ProgressionFocus | null,
  dungeonContext?: DungeonIdea 
): Promise<BossBattleIdea> => {
   if (!process.env.API_KEY) {
    console.warn("AI Service: API_KEY not found. Returning fallback boss battle.");
    return {
      name: "Fallback Boss: The API Sentinel",
      description: `A simulated high-threat target encountered due to missing API Key. Resolve API key issues to face true system challenges.`,
      successConditions: [
        `Confirm API_KEY is correctly configured in the environment.`,
        `Successfully receive a non-fallback quest from the AI.`
      ],
      penaltyForFailure: "System remains in limited functionality mode. Review API key setup.",
      xpReward: 75,
      itemRewardSuggestion: { name: `Placeholder Sigil`, type: "Badge", description: `Awarded for attempting to resolve system errors.` }
    };
  }

  let contextDescription = dungeonContext ? `This Boss Battle can be a culmination of skills from their recent Dungeon: "${dungeonContext.name}".` : "";
  if (progressionFocus) {
    contextDescription += ` It should serve as a capstone for their current Progression Focus: "${progressionFocus.chapterTitle} - ${progressionFocus.overarchingObjective}". Victory should signify mastery of this phase and readiness to advance.`;
  } else {
    contextDescription += " This is a general capstone challenge for their rank, testing overall progress towards their goal.";
  }

  const prompt = `You are the "System" for Project Ascend. The user's goal is "${goal.name}".
Their rank is ${rank.name} ${rank.subLevel}, level ${level}. 
${contextDescription}

Design a "Boss Battle" for them. A Boss Battle is a complex, culminating task that requires application of skills and knowledge.
Provide the following fields in a JSON object:
1.  "name" (string): An epic, thematic name for the Boss Battle (e.g., "The Pythonic Hydra of Complex Logic", "The Marathon Colossus of Endurance").
2.  "description" (string): A brief overview of the challenge, linking it to their progression.
3.  "successConditions" (JSON array of strings): An array of 2-3 specific, verifiable conditions that define victory. Each string must be properly quoted.
4.  "penaltyForFailure" (string): A constructive penalty or consequence of failing (e.g., "Skill review required", "Temporary XP gain debuff for related tasks").
5.  "xpReward" (integer): An integer XP reward (e.g., 200-1000, scaled by difficulty and importance as a capstone).
6.  "itemRewardSuggestion" (optional JSON object): If included, an object with "name", "type", and "description" for a symbolic item rewarded upon victory.

Return ONLY a VALID JSON object. Ensure it's well-formed with correct comma usage, quotes, and brackets.
Example (if focus was on deploying an app):
{
  "name": "The Deployment Overlord of '${goal.name}'",
  "description": "Successfully deploy your application for '${goal.name}' to a live environment, proving mastery over the 'Release Candidate' chapter objective.",
  "successConditions": ["Application passes all integration tests in staging.", "Successfully deployed to production environment.", "Handles X concurrent users for Y minutes without critical errors."],
  "penaltyForFailure": "Project rollback. Detailed error log analysis required. Cooldown: 48 hours.",
  "xpReward": 750,
  "itemRewardSuggestion": { "name": "Cloud Weaver's Badge", "type": "Badge", "description": "Mastery over cloud deployment intricacies." }
}

Output ONLY the JSON object. No extra text or markdown.`;

  const idea = await getAiResponse<BossBattleIdea>(prompt);
  if (!idea) {
    return { 
      name: "Boss AI Overload",
      description: "The AI's higher functions are strained for Boss generation. Undertake a self-designed major test of your primary goal's key aspects, aligned with your current progression focus.",
      successConditions: ["Define 2 measurable success criteria based on your current focus.", "Meet both criteria within a set timeframe."],
      penaltyForFailure: "System recommends a 2-day cooldown and skill review.",
      xpReward: 250,
      itemRewardSuggestion: { name: "Fragment of Autonomy", type: "Key Item", "description": "Proves capability even when external systems are unstable."}
    };
  }
  return idea;
};

// Type for AI response before mapping to RoadmapEvent
interface AiRoadmapEventData {
  type: "Dungeon" | "BossBattle"; // Expecting string literals
  name: string;
  description: string;
  targetRankName: string; // Expecting string like "E (Novice)"
  targetSubLevel: string; // Expecting string like "IV" or "None"
  targetLevel: number;
}

export const generateRoadmapEvents = async (
  goal: GoalArchetype,
  initialRank: RankData,
  targetRank: RankData | null
): Promise<RoadmapEvent[] | null> => {
  if (!process.env.API_KEY) {
    console.warn("AI Service: API_KEY not found. Returning fallback roadmap.");
    return [
      { 
        id: `fallback-roadmap-${Date.now()}`,
        type: RoadmapEventType.Dungeon, 
        name: "System Error: Manual Configuration Required", 
        description: "The AI could not generate a roadmap. Please verify your API Key setup and try initializing your goal again. Focus on foundational tasks for now.",
        targetRankName: initialRank.name,
        targetSubLevel: initialRank.subLevel,
        targetLevel: initialRank.levelRange[0] + 2,
        status: RoadmapEventStatus.Planned 
      }
    ];
  }

  const validRankNames = Object.values(RankName).join(', ');
  const validSubLevels = Object.values(SubLevel).filter(sl => sl !== "").join(', ') + ', or "None" for Omega Rank';

  const prompt = `You are the "System" for Project Ascend. The user's goal is "${goal.name}".
Their starting rank is ${initialRank.name} ${initialRank.subLevel}.
Their ultimate target rank for this goal is ${targetRank ? `${targetRank.name} ${targetRank.subLevel}` : 'the pinnacle of achievement'}.

Generate a strategic roadmap of 2 to 5 key milestones (Dungeons or Boss Battles) leading towards their target rank.
These events should be challenging but achievable, marking significant progression points.
Boss Battles should typically mark transitions between major Ranks (e.g., E to D, D to C) or the culmination of a Rank. Dungeons can be significant mid-rank challenges.
Order the events chronologically by their target rank and level.

For each event, provide:
1.  "type" (string): Must be either "Dungeon" or "BossBattle".
2.  "name" (string): A thematic and inspiring name for the event.
3.  "description" (string): A brief, motivating description of the event and its purpose.
4.  "targetRankName" (string): The full name of the target rank for this event. Must be one of: ${validRankNames}.
5.  "targetSubLevel" (string): The target sub-level for this event. Must be one of: ${validSubLevels}. If Rank is Omega, use "None".
6.  "targetLevel" (integer): An approximate player level when this event should be tackled. This level must fall within the range defined for the targetRankName and targetSubLevel by the System's rank data.

Return ONLY a VALID JSON array of these event objects.
The JSON array must be well-formed. Pay close attention to commas, quotes, brackets, and braces.

Example of a single event object:
{
  "type": "BossBattle",
  "name": "Guardian of the D-Rank Threshold",
  "description": "Prove mastery over E-Rank challenges to unlock access to D-Rank.",
  "targetRankName": "E (Novice)",
  "targetSubLevel": "I",
  "targetLevel": 12
}

Output ONLY the JSON array. Do not include any other text or markdown formatting around the JSON.`;

  const aiEvents = await getAiResponse<AiRoadmapEventData[]>(prompt);

  if (!aiEvents) {
    return [
      { 
        id: `fallback-ai-err-${Date.now()}`,
        type: RoadmapEventType.Dungeon, 
        name: "Roadmap AI Offline", 
        description: "The AI is temporarily unable to generate a strategic roadmap. Focus on self-directed tasks aligned with your goal and current rank while the System recalibrates.",
        targetRankName: initialRank.name,
        targetSubLevel: initialRank.subLevel,
        targetLevel: Math.min(initialRank.levelRange[0] + 2, initialRank.levelRange[1] || initialRank.levelRange[0] + 2),
        status: RoadmapEventStatus.Planned 
      }
    ];
  }

  // Map AI response to RoadmapEvent[], generating IDs and ensuring enum conformity
  return aiEvents.map((event, index) => {
    // Basic validation/mapping for enums
    // Fix: Corrected typo 'leteventType' to 'let eventType'
    let eventType = RoadmapEventType.Dungeon; // Default
    // Fix: Ensure 'eventType' is used correctly after declaration
    if (event.type === "BossBattle") eventType = RoadmapEventType.BossBattle;

    let rankNameEnum = Object.values(RankName).find(rn => rn === event.targetRankName) || initialRank.name;
    let subLevelEnum = Object.values(SubLevel).find(sl => sl === event.targetSubLevel || (event.targetSubLevel === "None" && sl === SubLevel.None) ) || initialRank.subLevel;
    
    // Ensure targetLevel is plausible within the rank.
    const rankData = RANKS_DATA.find(r => r.name === rankNameEnum && r.subLevel === subLevelEnum);
    let safeTargetLevel = event.targetLevel;
    if (rankData) {
      safeTargetLevel = Math.max(rankData.levelRange[0], Math.min(event.targetLevel, rankData.levelRange[1] ?? event.targetLevel));
    }


    return {
      id: `roadmap-${Date.now()}-${index}`,
      // Fix: Ensure 'eventType' is used correctly after declaration
      type: eventType,
      name: event.name,
      description: event.description,
      targetRankName: rankNameEnum,
      targetSubLevel: subLevelEnum,
      targetLevel: safeTargetLevel,
      status: RoadmapEventStatus.Planned,
    };
  });
};
