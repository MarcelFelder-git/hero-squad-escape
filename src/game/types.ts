export type PowerId = 'speedster' | 'mindhacker' | 'timebender' | 'shield' | 'gadget';
export type HairStyle = 'curly' | 'straight' | 'spiky' | 'short';
export type MaskStyle = 'none' | 'eyemask' | 'visor' | 'goggles';
export type Emblem = 'star' | 'bolt' | 'heart' | 'shield' | 'moon';
export type Accessory = 'none' | 'glasses' | 'braces' | 'headphones' | 'antenna';

export interface HeroLook {
  suit: string;
  cape: string;
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  mask: MaskStyle;
  emblem: Emblem;
  accessory: Accessory;
}

export interface Hero {
  name: string;
  power: PowerId;
  look: HeroLook;
}

export type Phase =
  | 'title'
  | 'players'
  | 'creator'
  | 'briefing'
  | 'room'
  | 'transition'
  | 'complete';

export interface RoomStat {
  mistakes: number;
  hints: number;
  freeHintUsed: boolean;
  rewindUsed: boolean;
}

export interface Toast {
  id: number;
  text: string;
  kind: 'good' | 'bad' | 'power' | 'info';
}

export interface GameState {
  version: number;
  phase: Phase;
  playerCount: 1 | 2 | 3;
  heroes: Hero[];
  creatorIndex: number;
  roomIndex: number;
  stageIndex: number;
  showRoomIntro: boolean;
  hintLevel: number;
  startedAt: number | null;
  finishedAt: number | null;
  score: number;
  correct: number;
  mistakes: number;
  hintsUsed: number;
  skipped: number;
  roomStats: RoomStat[];
  muted: boolean;
  toast: Toast | null;
}

/** Props every puzzle component receives. */
export interface PuzzleProps {
  heroes: Hero[];
  /** call on every correct partial answer (gives points + sound) */
  onCorrect: (points?: number) => void;
  /** call on every wrong attempt */
  onWrong: () => void;
  /** call once when the whole stage is solved */
  onSolved: () => void;
}
