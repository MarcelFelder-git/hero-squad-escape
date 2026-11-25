export type PowerId = 'speedster' | 'mindhacker' | 'timebender' | 'shield' | 'gadget';
export type HairStyle = 'curly' | 'straight' | 'spiky' | 'short';
export type MaskStyle = 'none' | 'eyemask' | 'visor' | 'goggles';
export type Emblem = 'star' | 'bolt' | 'heart' | 'shield' | 'moon';
export type Accessory = 'none' | 'glasses' | 'braces' | 'headphones' | 'antenna';
export type Pronoun = 'he' | 'she' | 'they';

export interface HeroLook {
  /** everyday t-shirt colour (before the hero suit arrives) */
  shirt: string;
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
  /** text the kids write in the "Hero profile" task */
  profile?: string;
}

/** Gear pieces – one arrives by rocket after every level */
export type GearId = 'mask' | 'suit' | 'gloves' | 'boots' | 'belt' | 'cape' | 'power' | 'flight';

export type Phase = 'title' | 'players' | 'creator' | 'briefing' | 'level' | 'reward' | 'complete';

export interface LevelStat {
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
  levelIndex: number;
  stageIndex: number;
  /** 'event' (hack / call) → 'intro' (splash) → 'play' */
  levelStep: 'event' | 'intro' | 'play';
  hintLevel: number;
  startedAt: number | null;
  finishedAt: number | null;
  score: number;
  correct: number;
  mistakes: number;
  hintsUsed: number;
  skipped: number;
  levelStats: LevelStat[];
  muted: boolean;
  toast: Toast | null;
  /** came in through the QR code of the worksheet */
  viaQr: boolean;
  hallSent: boolean;
  bonusHighscore: number;
  /** task set: 0 = A (original), 1 = B (new words) */
  variant: number;
}

/** Props every puzzle component receives. */
export interface PuzzleProps {
  heroes: Hero[];
  /** how many levels are complete = how much gear the heroes wear */
  gear: number;
  /** call on every correct partial answer (gives points + sound) */
  onCorrect: (points?: number) => void;
  /** call on every wrong attempt */
  onWrong: () => void;
  /** call once when the whole stage is solved */
  onSolved: () => void;
  /** update a hero (used by the hero-profile writing task) */
  updateHero?: (index: number, hero: Hero) => void;
}
