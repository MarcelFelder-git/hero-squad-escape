import { ROOMS } from '../data/rooms';
import { randomHero, powerInfo } from '../data/heroOptions';
import type { GameState, Hero, PowerId, RoomStat, Toast } from './types';

export const STORAGE_KEY = 'hero-squad-escape-v1';
const VERSION = 1;

export const POINTS = {
  correct: 10,
  wrong: 3,
  hint1: 5,
  hint2: 10,
  room: 50,
  gadget: 20,
};

const emptyRoomStats = (): RoomStat[] =>
  ROOMS.map(() => ({ mistakes: 0, hints: 0, freeHintUsed: false, rewindUsed: false }));

export function initialState(muted = false): GameState {
  return {
    version: VERSION,
    phase: 'title',
    playerCount: 1,
    heroes: [],
    creatorIndex: 0,
    roomIndex: 0,
    stageIndex: 0,
    showRoomIntro: true,
    hintLevel: 0,
    startedAt: null,
    finishedAt: null,
    score: 0,
    correct: 0,
    mistakes: 0,
    hintsUsed: 0,
    skipped: 0,
    roomStats: emptyRoomStats(),
    muted,
    toast: null,
  };
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const s = JSON.parse(raw) as GameState;
    if (s.version !== VERSION || !s.phase) return initialState();
    return { ...s, toast: null };
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

export type Action =
  | { type: 'GOTO'; phase: GameState['phase'] }
  | { type: 'SET_PLAYERS'; count: 1 | 2 | 3 }
  | { type: 'UPDATE_HERO'; index: number; hero: Hero }
  | { type: 'NEXT_HERO' }
  | { type: 'PREV_HERO' }
  | { type: 'START_MISSION' }
  | { type: 'CLOSE_ROOM_INTRO' }
  | { type: 'CORRECT'; points?: number }
  | { type: 'WRONG' }
  | { type: 'HINT' }
  | { type: 'STAGE_SOLVED' }
  | { type: 'SKIP_STAGE' }
  | { type: 'NEXT_ROOM' }
  | { type: 'JUMP_ROOM'; room: number }
  | { type: 'FINISH' }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'RESET' }
  | { type: 'CLEAR_TOAST' };

let toastId = 1;
const toast = (text: string, kind: Toast['kind']): Toast => ({ id: toastId++, text, kind });

export const teamHas = (s: GameState, p: PowerId) => s.heroes.some((h) => h.power === p);
const heroWith = (s: GameState, p: PowerId) => s.heroes.find((h) => h.power === p);

function updateRoom(s: GameState, patch: Partial<RoomStat>): RoomStat[] {
  return s.roomStats.map((r, i) => (i === s.roomIndex ? { ...r, ...patch } : r));
}

function advanceStage(s: GameState, skipped: boolean): GameState {
  const room = ROOMS[s.roomIndex];
  const base = { ...s, hintLevel: 0, skipped: s.skipped + (skipped ? 1 : 0) };
  if (s.stageIndex + 1 < room.stages.length) {
    return { ...base, stageIndex: s.stageIndex + 1 };
  }
  // room complete
  let score = base.score + POINTS.room;
  let t: Toast | null = null;
  if (teamHas(s, 'gadget')) {
    score += POINTS.gadget;
    t = toast(`🔧 ${heroWith(s, 'gadget')!.name}: Gadget bonus +${POINTS.gadget}!`, 'power');
  }
  return { ...base, score, phase: 'transition', toast: t };
}

export function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'GOTO':
      return { ...s, phase: a.phase };

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
      return {
        ...s,
        phase: 'room',
        roomIndex: 0,
        stageIndex: 0,
        showRoomIntro: true,
        hintLevel: 0,
        startedAt: Date.now(),
        finishedAt: null,
        score: 0,
        correct: 0,
        mistakes: 0,
        hintsUsed: 0,
        skipped: 0,
        roomStats: emptyRoomStats(),
      };

    case 'CLOSE_ROOM_INTRO':
      return { ...s, showRoomIntro: false };

    case 'CORRECT':
      return { ...s, score: s.score + (a.points ?? POINTS.correct), correct: s.correct + 1 };

    case 'WRONG': {
      const rs = s.roomStats[s.roomIndex];
      const isBoss = ROOMS[s.roomIndex].stages[s.stageIndex]?.kind === 'boss';
      if (isBoss && teamHas(s, 'shield')) {
        return {
          ...s,
          roomStats: updateRoom(s, { mistakes: rs.mistakes + 1 }),
          mistakes: s.mistakes + 1,
          toast: toast(`🛡️ ${heroWith(s, 'shield')!.name}'s shield blocks the attack! No points lost.`, 'power'),
        };
      }
      if (teamHas(s, 'timebender') && !rs.rewindUsed) {
        return {
          ...s,
          roomStats: updateRoom(s, { rewindUsed: true }),
          toast: toast(`⏳ ${heroWith(s, 'timebender')!.name} rewinds time! This mistake doesn't count.`, 'power'),
        };
      }
      return {
        ...s,
        score: Math.max(0, s.score - POINTS.wrong),
        mistakes: s.mistakes + 1,
        roomStats: updateRoom(s, { mistakes: rs.mistakes + 1 }),
      };
    }

    case 'HINT': {
      if (s.hintLevel >= 2) return s;
      const rs = s.roomStats[s.roomIndex];
      const level = s.hintLevel + 1;
      const cost = level === 1 ? POINTS.hint1 : POINTS.hint2;
      if (teamHas(s, 'mindhacker') && !rs.freeHintUsed) {
        return {
          ...s,
          hintLevel: level,
          roomStats: updateRoom(s, { freeHintUsed: true }),
          toast: toast(`🧠 ${heroWith(s, 'mindhacker')!.name} hacks the computer: this hint is free!`, 'power'),
        };
      }
      return {
        ...s,
        hintLevel: level,
        hintsUsed: s.hintsUsed + 1,
        score: Math.max(0, s.score - cost),
        roomStats: updateRoom(s, { hints: rs.hints + 1 }),
      };
    }

    case 'STAGE_SOLVED':
      return advanceStage(s, false);

    case 'SKIP_STAGE':
      if (s.phase !== 'room') return s;
      return advanceStage({ ...s, showRoomIntro: false }, true);

    case 'NEXT_ROOM':
      if (s.roomIndex + 1 >= ROOMS.length) {
        return { ...s, phase: 'complete', finishedAt: Date.now() };
      }
      return { ...s, phase: 'room', roomIndex: s.roomIndex + 1, stageIndex: 0, hintLevel: 0, showRoomIntro: true };

    case 'JUMP_ROOM':
      return {
        ...s,
        phase: 'room',
        roomIndex: a.room,
        stageIndex: 0,
        hintLevel: 0,
        showRoomIntro: true,
        startedAt: s.startedAt ?? Date.now(),
        finishedAt: null,
        heroes: s.heroes.length ? s.heroes : [randomHero(0)],
      };

    case 'FINISH':
      return { ...s, phase: 'complete', startedAt: s.startedAt ?? Date.now(), finishedAt: Date.now() };

    case 'TOGGLE_MUTE':
      return { ...s, muted: !s.muted };

    case 'RESET':
      return initialState(s.muted);

    case 'CLEAR_TOAST':
      return { ...s, toast: null };
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
  const timeBonusPoints = Math.max(0, Math.floor(25 - minutes)) * 10;
  const penalties = s.mistakes + s.hintsUsed * 1.5 + s.skipped * 4;
  let stars: 1 | 2 | 3 = 1;
  if (penalties <= 8 && minutes <= 25) stars = 3;
  else if (penalties <= 18) stars = 2;
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
