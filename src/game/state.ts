import { LEVELS } from '../data/levels';
import { randomHero, powerInfo } from '../data/heroOptions';
import type { GameState, Hero, LevelStat, PowerId, Toast } from './types';

export const STORAGE_KEY = 'hero-squad-escape-v2';
const VERSION = 2;

export const POINTS = {
  correct: 10,
  wrong: 3,
  hint1: 5,
  hint2: 10,
  level: 50,
  gadget: 20,
};

const emptyStats = (): LevelStat[] => LEVELS.map(() => ({ mistakes: 0, hints: 0, freeHintUsed: false, rewindUsed: false }));

export function initialState(muted = false): GameState {
  return {
    version: VERSION,
    phase: 'title',
    playerCount: 1,
    heroes: [],
    creatorIndex: 0,
    levelIndex: 0,
    stageIndex: 0,
    levelStep: 'intro',
    hintLevel: 0,
    startedAt: null,
    finishedAt: null,
    score: 0,
    correct: 0,
    mistakes: 0,
    hintsUsed: 0,
    skipped: 0,
    levelStats: emptyStats(),
    muted,
    toast: null,
    viaQr: false,
    hallSent: false,
    bonusHighscore: 0,
    variant: 1,
  };
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const s = JSON.parse(raw) as GameState;
    if (s.version !== VERSION || !s.phase || s.levelStats?.length !== LEVELS.length) return initialState();
    return { ...s, variant: s.variant ?? 1, toast: null };
  } catch {
    return initialState();
  }
}

export function saveState(s: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...s, toast: null }));
  } catch {
    /* private mode / storage full – the game still works */
  }
}

/** number of completed levels = gear pieces the heroes wear */
export function gearCount(s: GameState): number {
  if (s.phase === 'complete') return LEVELS.length;
  if (s.phase === 'reward') return s.levelIndex + 1;
  if (s.phase === 'level') return s.levelIndex;
  return 0;
}

export type Action =
  | { type: 'GOTO'; phase: GameState['phase'] }
  | { type: 'QR_ENTRY' }
  | { type: 'SET_PLAYERS'; count: 1 | 2 | 3 }
  | { type: 'UPDATE_HERO'; index: number; hero: Hero }
  | { type: 'NEXT_HERO' }
  | { type: 'PREV_HERO' }
  | { type: 'START_MISSION'; variant?: number }
  | { type: 'SET_VARIANT'; variant: number }
  | { type: 'EVENT_DONE' }
  | { type: 'INTRO_DONE' }
  | { type: 'CORRECT'; points?: number }
  | { type: 'WRONG' }
  | { type: 'HINT' }
  | { type: 'STAGE_SOLVED' }
  | { type: 'SKIP_STAGE' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'JUMP_LEVEL'; level: number }
  | { type: 'FINISH' }
  | { type: 'HALL_SENT' }
  | { type: 'BONUS_SCORE'; score: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'RESET' }
  | { type: 'CLEAR_TOAST' };

let toastId = 1;
const toast = (text: string, kind: Toast['kind']): Toast => ({ id: toastId++, text, kind });

export const teamHas = (s: GameState, p: PowerId) => s.heroes.some((h) => h.power === p);
const heroWith = (s: GameState, p: PowerId) => s.heroes.find((h) => h.power === p);

function updateStat(s: GameState, patch: Partial<LevelStat>): LevelStat[] {
  return s.levelStats.map((r, i) => (i === s.levelIndex ? { ...r, ...patch } : r));
}

function enterLevel(s: GameState, level: number): GameState {
  return {
    ...s,
    phase: 'level',
    levelIndex: level,
    stageIndex: 0,
    hintLevel: 0,
    levelStep: LEVELS[level].event ? 'event' : 'intro',
  };
}

function advanceStage(s: GameState, skipped: boolean): GameState {
  const level = LEVELS[s.levelIndex];
  const base = { ...s, hintLevel: 0, skipped: s.skipped + (skipped ? 1 : 0) };
  if (s.stageIndex + 1 < level.stages.length) return { ...base, stageIndex: s.stageIndex + 1 };
  // level complete → rocket reward
  let score = base.score + POINTS.level;
  let t: Toast | null = null;
  if (teamHas(s, 'gadget')) {
    score += POINTS.gadget;
    t = toast(`🔧 ${heroWith(s, 'gadget')!.name}: Gadget bonus +${POINTS.gadget}!`, 'power');
  }
  return { ...base, score, phase: 'reward', toast: t };
}

export function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'GOTO':
      return { ...s, phase: a.phase };

    case 'QR_ENTRY':
      return { ...s, viaQr: true };

    case 'SET_PLAYERS': {
      const heroes: Hero[] = [];
      for (let i = 0; i < a.count; i++) heroes.push(randomHero(i, heroes.map((h) => h.name)));
      return { ...s, playerCount: a.count, heroes, creatorIndex: 0, phase: 'creator' };
    }

    case 'UPDATE_HERO':
      return { ...s, heroes: s.heroes.map((h, i) => (i === a.index ? a.hero : h)) };

    case 'NEXT_HERO':
      if (s.creatorIndex + 1 < s.heroes.length) return { ...s, creatorIndex: s.creatorIndex + 1 };
      return { ...s, phase: 'briefing' };

    case 'PREV_HERO':
      if (s.creatorIndex > 0) return { ...s, creatorIndex: s.creatorIndex - 1 };
      return { ...s, phase: 'players' };

    case 'START_MISSION':
      return enterLevel(
        {
          ...s,
          startedAt: Date.now(),
          finishedAt: null,
          score: 0,
          correct: 0,
          mistakes: 0,
          hintsUsed: 0,
          skipped: 0,
          hallSent: false,
          variant: a.variant ?? s.variant,
          levelStats: emptyStats(),
          heroes: s.heroes.map((h) => ({ ...h, profile: undefined })),
        },
        0,
      );

    case 'SET_VARIANT':
      return { ...s, variant: a.variant };

    case 'EVENT_DONE':
      return { ...s, levelStep: 'intro' };

    case 'INTRO_DONE':
      return { ...s, levelStep: 'play' };

    case 'CORRECT':
      return { ...s, score: s.score + (a.points ?? POINTS.correct), correct: s.correct + 1 };

    case 'WRONG': {
      const st = s.levelStats[s.levelIndex];
      const isBoss = LEVELS[s.levelIndex].stages[s.stageIndex]?.kind === 'boss';
      if (isBoss && teamHas(s, 'shield')) {
        return {
          ...s,
          levelStats: updateStat(s, { mistakes: st.mistakes + 1 }),
          mistakes: s.mistakes + 1,
          toast: toast(`🛡️ ${heroWith(s, 'shield')!.name}'s shield blocks the attack! No points lost.`, 'power'),
        };
      }
      if (teamHas(s, 'timebender') && !st.rewindUsed) {
        return {
          ...s,
          levelStats: updateStat(s, { rewindUsed: true }),
          toast: toast(`⏳ ${heroWith(s, 'timebender')!.name} rewinds time! This mistake doesn't count.`, 'power'),
        };
      }
      return {
        ...s,
        score: Math.max(0, s.score - POINTS.wrong),
        mistakes: s.mistakes + 1,
        levelStats: updateStat(s, { mistakes: st.mistakes + 1 }),
      };
    }

    case 'HINT': {
      if (s.hintLevel >= 2) return s;
      const st = s.levelStats[s.levelIndex];
      const level = s.hintLevel + 1;
      const cost = level === 1 ? POINTS.hint1 : POINTS.hint2;
      if (teamHas(s, 'mindhacker') && !st.freeHintUsed) {
        return {
          ...s,
          hintLevel: level,
          levelStats: updateStat(s, { freeHintUsed: true }),
          toast: toast(`🧠 ${heroWith(s, 'mindhacker')!.name} hacks the computer: this hint is free!`, 'power'),
        };
      }
      return {
        ...s,
        hintLevel: level,
        hintsUsed: s.hintsUsed + 1,
        score: Math.max(0, s.score - cost),
        levelStats: updateStat(s, { hints: st.hints + 1 }),
      };
    }

    case 'STAGE_SOLVED':
      return advanceStage(s, false);

    case 'SKIP_STAGE':
      if (s.phase !== 'level') return s;
      return advanceStage({ ...s, levelStep: 'play' }, true);

    case 'NEXT_LEVEL':
      if (s.levelIndex + 1 >= LEVELS.length) return { ...s, phase: 'complete', finishedAt: Date.now() };
      return enterLevel(s, s.levelIndex + 1);

    case 'JUMP_LEVEL':
      return enterLevel(
        {
          ...s,
          startedAt: s.startedAt ?? Date.now(),
          finishedAt: null,
          heroes: s.heroes.length ? s.heroes : [randomHero(0)],
        },
        a.level,
      );

    case 'FINISH':
      return {
        ...s,
        phase: 'complete',
        heroes: s.heroes.length ? s.heroes : [randomHero(0)],
        startedAt: s.startedAt ?? Date.now(),
        finishedAt: Date.now(),
      };

    case 'HALL_SENT':
      return { ...s, hallSent: true };

    case 'BONUS_SCORE':
      return { ...s, bonusHighscore: Math.max(s.bonusHighscore, a.score) };

    case 'TOGGLE_MUTE':
      return { ...s, muted: !s.muted };

    case 'RESET':
      return { ...initialState(s.muted), variant: s.variant };

    case 'CLEAR_TOAST':
      return { ...s, variant: s.variant ?? 1, toast: null };
  }
}

/* ---------- results ---------- */
export interface MissionResult {
  rawMs: number;
  timeMs: number;
  speedBonus: boolean;
  timeBonusPoints: number;
  finalScore: number;
  stars: 1 | 2 | 3;
  rank: string;
  rankDe: string;
}

export function computeResult(s: GameState): MissionResult {
  const rawMs = Math.max(0, (s.finishedAt ?? Date.now()) - (s.startedAt ?? Date.now()));
  const speedBonus = teamHas(s, 'speedster');
  const timeMs = Math.max(0, rawMs - (speedBonus ? 60_000 : 0));
  const minutes = timeMs / 60_000;
  const timeBonusPoints = Math.max(0, Math.floor(30 - minutes)) * 10;
  const penalties = s.mistakes + s.hintsUsed * 1.5 + s.skipped * 4;
  let stars: 1 | 2 | 3 = 1;
  if (penalties <= 12 && minutes <= 30) stars = 3;
  else if (penalties <= 26) stars = 2;
  const ranks = {
    3: ['Legendary Hero Squad', 'Legendäres Helden-Team'],
    2: ['Super Hero Squad', 'Super-Helden-Team'],
    1: ['Rising Hero Squad', 'Aufsteigendes Helden-Team'],
  } as const;
  return {
    rawMs,
    timeMs,
    speedBonus,
    timeBonusPoints,
    finalScore: s.score + timeBonusPoints,
    stars,
    rank: ranks[stars][0],
    rankDe: ranks[stars][1],
  };
}

export const formatTime = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const heroForSlot = (heroes: Hero[], slot: number) => heroes[slot % Math.max(1, heroes.length)];

export { powerInfo };

/** Every new group plays set B (open day). Set A was the test run – only reachable via the teacher menu. */
export function nextVariant(): number {
  return 1;
}
