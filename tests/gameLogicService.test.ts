import { describe, it, expect, vi } from 'vitest';
import { calculateXpToNextLevel, awardXP, getRankForLevel } from '../services/gameLogicService';
import { MessageType } from '../components/SystemMessage';

// Helper to create a dummy emitter
const createEmitter = () => vi.fn();

describe('calculateXpToNextLevel', () => {
  it('returns correct XP for early levels', () => {
    expect(calculateXpToNextLevel(1)).toBe(100);
    expect(calculateXpToNextLevel(2)).toBe(120);
    expect(calculateXpToNextLevel(3)).toBe(144);
  });
});

describe('awardXP', () => {
  it('levels up once when XP threshold is crossed', () => {
    const emitter = createEmitter();
    const rank = getRankForLevel(1);
    const result = awardXP(0, 1, 150, 0, emitter, rank);
    expect(result.newLevel).toBe(2);
    expect(result.newXP).toBe(50);
    expect(result.newStatPoints).toBe(2);
    expect(result.leveledUp).toBe(true);
  });

  it('handles multiple level ups and stat point gains', () => {
    const emitter = createEmitter();
    const rank = getRankForLevel(1);
    const xpNeeded = calculateXpToNextLevel(1) + calculateXpToNextLevel(2);
    const result = awardXP(0, 1, xpNeeded, 0, emitter, rank);
    expect(result.newLevel).toBe(3);
    expect(result.newXP).toBe(0);
    expect(result.newStatPoints).toBe(4);
    expect(result.leveledUp).toBe(true);
  });

  it('updates rank when crossing rank boundary', () => {
    const emitter = createEmitter();
    const rank = getRankForLevel(3); // starting at end of first rank tier
    const xpNeeded = calculateXpToNextLevel(3);
    const result = awardXP(0, 3, xpNeeded, 0, emitter, rank);
    const expectedRank = getRankForLevel(4);
    expect(result.newLevel).toBe(4);
    expect(result.newRank.name).toBe(expectedRank.name);
    expect(result.newRank.subLevel).toBe(expectedRank.subLevel);
    expect(result.rankChanged).toBe(true);
  });
});
