import type { Accessory, Emblem, Hero, HairStyle, MaskStyle, PowerId } from '../game/types';

export interface PowerInfo {
  id: PowerId;
  name: string;
  icon: string;
  effectEn: string;
  effectDe: string;
}

export const POWERS: PowerInfo[] = [
  {
    id: 'speedster',
    name: 'Speedster',
    icon: '⚡',
    effectEn: 'Super speed: 1 minute less on the final time.',
    effectDe: 'Zeitbonus: Am Ende wird 1 Minute von eurer Zeit abgezogen.',
  },
  {
    id: 'mindhacker',
    name: 'Mind-Hacker',
    icon: '🧠',
    effectEn: 'Hacks the HQ computer: the first hint in every level is free.',
    effectDe: 'Der erste Tipp in jedem Level kostet keine Punkte.',
  },
  {
    id: 'timebender',
    name: 'Time-Bender',
    icon: '⏳',
    effectEn: 'Rewind: the first mistake in every level does not count.',
    effectDe: 'Zurückspulen: Der erste Fehler pro Level zählt nicht.',
  },
  {
    id: 'shield',
    name: 'Shield-Guardian',
    icon: '🛡️',
    effectEn: 'Force shield: wrong answers in the boss fight cost no points.',
    effectDe: 'Schutzschild: Im Endkampf kosten Fehler keine Punkte.',
  },
  {
    id: 'gadget',
    name: 'Gadget-Genius',
    icon: '🔧',
    effectEn: 'Super gadgets: +20 bonus points for every level you finish.',
    effectDe: '+20 Bonuspunkte für jedes geschaffte Level.',
  },
];

export const powerInfo = (id: PowerId) => POWERS.find((p) => p.id === id)!;

export const SHIRT_COLORS = ['#6c757d', '#90be6d', '#f9844a', '#577590', '#f9c74f', '#e5e5e5', '#43aa8b', '#b5838d'];
export const SUIT_COLORS = ['#e63946', '#1e88e5', '#2ecc71', '#8e44ad', '#ff9f1c', '#14b8a6', '#ec4899', '#22223b'];
export const CAPE_COLORS = ['#ffd60a', '#e63946', '#1e88e5', '#7b2cbf', '#2ecc71', '#f5f5f5', '#111111', '#ff7b00'];
export const SKIN_TONES = ['#ffe0c7', '#f6c9a0', '#e0a878', '#b97a4f', '#8d5524', '#5c3a1e'];
export const HAIR_COLORS = ['#f4d35e', '#a0522d', '#3b2416', '#111111', '#e63946', '#7b2cbf', '#1e88e5', '#eeeeee'];

export const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'curly', label: 'curly' },
  { id: 'straight', label: 'straight' },
  { id: 'spiky', label: 'spiky' },
  { id: 'short', label: 'short' },
];
export const MASKS: { id: MaskStyle; label: string }[] = [
  { id: 'eyemask', label: 'mask' },
  { id: 'visor', label: 'visor' },
  { id: 'goggles', label: 'goggles' },
  { id: 'none', label: 'no mask' },
];
export const EMBLEMS: { id: Emblem; label: string }[] = [
  { id: 'star', label: 'star' },
  { id: 'bolt', label: 'lightning' },
  { id: 'heart', label: 'heart' },
  { id: 'shield', label: 'shield' },
  { id: 'moon', label: 'moon' },
];
export const ACCESSORIES: { id: Accessory; label: string }[] = [
  { id: 'none', label: 'nothing' },
  { id: 'glasses', label: 'glasses' },
  { id: 'braces', label: 'braces' },
  { id: 'headphones', label: 'headphones' },
  { id: 'antenna', label: 'antenna' },
];

const NAME_A = ['Captain', 'Mega', 'Super', 'Thunder', 'Night', 'Cosmic', 'Turbo', 'Mighty', 'Shadow', 'Laser', 'Quantum', 'Star'];
const NAME_B = ['Nova', 'Spark', 'Falcon', 'Comet', 'Storm', 'Blaze', 'Pixel', 'Rocket', 'Phoenix', 'Volt', 'Echo', 'Moon'];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export function randomHeroName(taken: string[] = []): string {
  for (let i = 0; i < 30; i++) {
    const n = `${pick(NAME_A)} ${pick(NAME_B)}`;
    if (!taken.includes(n)) return n;
  }
  return `${pick(NAME_A)} ${pick(NAME_B)} ${Math.floor(Math.random() * 9) + 2}`;
}

export function randomHero(index: number, taken: string[] = []): Hero {
  return {
    name: randomHeroName(taken),
    power: POWERS[index % POWERS.length].id,
    look: {
      shirt: SHIRT_COLORS[(index * 3 + 1) % SHIRT_COLORS.length],
      suit: SUIT_COLORS[(index * 3) % SUIT_COLORS.length],
      cape: CAPE_COLORS[index % CAPE_COLORS.length],
      skin: pick(SKIN_TONES),
      hair: pick(HAIR_COLORS),
      hairStyle: pick(HAIR_STYLES).id,
      mask: MASKS[index % 3].id,
      emblem: EMBLEMS[index % EMBLEMS.length].id,
      accessory: 'none',
    },
  };
}

export function fullyRandomHero(taken: string[] = []): Hero {
  return {
    name: randomHeroName(taken),
    power: pick(POWERS).id,
    look: {
      shirt: pick(SHIRT_COLORS),
      suit: pick(SUIT_COLORS),
      cape: pick(CAPE_COLORS),
      skin: pick(SKIN_TONES),
      hair: pick(HAIR_COLORS),
      hairStyle: pick(HAIR_STYLES).id,
      mask: pick(MASKS.slice(0, 3)).id,
      emblem: pick(EMBLEMS).id,
      accessory: pick(ACCESSORIES).id,
    },
  };
}
