import * as B from './puzzlesB';

// All puzzle content in one place – easy to adapt for other classes.
// The first option in every `options` array is the correct one (options get shuffled in the UI).

/* ---------- Room 1: ID Lab ---------- */
const WIRE_PAIRS_A: { en: string; de: string }[] = [
  { en: 'reliable', de: 'zuverlässig' },
  { en: 'patient', de: 'geduldig' },
  { en: 'shy', de: 'schüchtern' },
  { en: 'hard-working', de: 'fleißig' },
  { en: 'confident', de: 'selbstsicher' },
  { en: 'strong', de: 'stark' },
];

export interface Suspect {
  id: string;
  name: string;
  tall: boolean;
  hairStyle: 'curly' | 'straight';
  hair: string;
  glasses: boolean;
  braces: boolean;
  skin: string;
  shirt: string;
}

export interface SpyRound {
  /** pronoun used in the "why not" feedback */
  pronoun?: 'He' | 'She';
  report: string[];
  answer: string;
  suspects: Suspect[];
}

const SPY_ROUNDS_A: SpyRound[] = [
  {
    report: [
      'The spy is tall.',
      'He has curly, blond hair.',
      'He wears glasses,',
      "but he doesn't wear braces.",
    ],
    answer: 'c',
    suspects: [
      { id: 'a', name: 'Leo', tall: true, hairStyle: 'curly', hair: '#f4d35e', glasses: true, braces: true, skin: '#f6c9a0', shirt: '#1e88e5' },
      { id: 'b', name: 'Finn', tall: false, hairStyle: 'curly', hair: '#f4d35e', glasses: true, braces: false, skin: '#ffe0c7', shirt: '#2ecc71' },
      { id: 'c', name: 'Max', tall: true, hairStyle: 'curly', hair: '#f4d35e', glasses: true, braces: false, skin: '#e0a878', shirt: '#e63946' },
      { id: 'd', name: 'Tom', tall: true, hairStyle: 'straight', hair: '#f4d35e', glasses: true, braces: false, skin: '#f6c9a0', shirt: '#ff9f1c' },
    ],
  },
  {
    report: [
      "The second spy isn't tall. She's short.",
      'She has straight, black hair.',
      "She doesn't wear glasses,",
      'but she wears braces.',
    ],
    answer: 'g',
    suspects: [
      { id: 'e', name: 'Mia', tall: false, hairStyle: 'straight', hair: '#111111', glasses: true, braces: true, skin: '#b97a4f', shirt: '#8e44ad' },
      { id: 'f', name: 'Zoe', tall: true, hairStyle: 'straight', hair: '#111111', glasses: false, braces: true, skin: '#ffe0c7', shirt: '#14b8a6' },
      { id: 'g', name: 'Ava', tall: false, hairStyle: 'straight', hair: '#111111', glasses: false, braces: true, skin: '#e0a878', shirt: '#ec4899' },
      { id: 'h', name: 'Lena', tall: false, hairStyle: 'curly', hair: '#111111', glasses: false, braces: true, skin: '#8d5524', shirt: '#ffd60a' },
    ],
  },
];

/* ---------- Room 2: Generator ---------- */
export interface BugSentence {
  words: string[];
  bugIndex: number;
  options: string[]; // first = correct
  explain: string;
}

const BUG_SENTENCES_A: BugSentence[] = [
  {
    words: ['Yesterday', 'the', 'Glitch', 'taked', 'our', 'superpowers.'],
    bugIndex: 3,
    options: ['took', 'taken', 'takes'],
    explain: 'take → took (irregular verb)',
  },
  {
    words: ['Last', 'night', 'Max', "didn't", 'heard', 'the', 'alarm.'],
    bugIndex: 4,
    options: ['hear', 'heared', 'hears'],
    explain: "didn't + normal verb: didn't hear",
  },
  {
    words: ['Did', 'you', 'saw', 'the', 'robots', 'yesterday?'],
    bugIndex: 2,
    options: ['see', 'seen', 'sees'],
    explain: 'Did + normal verb: Did you see …?',
  },
  {
    words: ['Lina', 'and', 'Tom', 'was', 'at', 'the', 'HQ', 'last', 'week.'],
    bugIndex: 3,
    options: ['were', 'is', 'be'],
    explain: 'they (Lina and Tom) → were',
  },
  {
    words: ['The', 'heroes', 'laugh', 'a', 'lot', 'last', 'Friday.'],
    bugIndex: 2,
    options: ['laughed', 'laughs', 'laughing'],
    explain: 'last Friday → simple past: laughed (regular: + -ed)',
  },
];

export interface BuilderSentence {
  label: string;
  tiles: string[]; // correct order
  trap: string;
  translation: string;
}

const BUILDER_SENTENCES_A: BuilderSentence[] = [
  {
    label: 'Positive ✔',
    tiles: ['The Glitch', 'took', 'the superpowers', 'last night.'],
    trap: 'taked',
    translation: 'Der Glitch hat letzte Nacht die Superkräfte genommen.',
  },
  {
    label: 'Negative ✖',
    tiles: ['The heroes', "didn't", 'see', 'the Glitch.'],
    trap: 'saw',
    translation: 'Die Helden haben den Glitch nicht gesehen.',
  },
  {
    label: 'Question ?',
    tiles: ['Did', 'you', 'hear', 'the alarm?'],
    trap: 'heard',
    translation: 'Hast du den Alarm gehört?',
  },
];

/* ---------- Room 3: Time Vault ---------- */
export interface VaultDial {
  verb: string;
  de: string;
  options: string[]; // first = correct
}

const VAULT_DIALS_A: VaultDial[] = [
  { verb: 'go', de: 'gehen', options: ['went', 'goed', 'gone', 'wented'] },
  { verb: 'see', de: 'sehen', options: ['saw', 'seed', 'sawed', 'seen'] },
  { verb: 'swim', de: 'schwimmen', options: ['swam', 'swimmed', 'swum', 'swimed'] },
  { verb: 'think', de: 'denken', options: ['thought', 'thinked', 'thank', 'thoughted'] },
  { verb: 'leave', de: 'verlassen', options: ['left', 'leaved', 'lefted', 'leaves'] },
  { verb: 'laugh', de: 'lachen', options: ['laughed', 'laught', 'lought', 'laughs'] },
];

/** diary text: strings are plain text, objects are gaps */
export type DiaryPart = string | { hint: string; options: string[] };

const DIARY_A: DiaryPart[] = [
  'Dear Diary, yesterday was a GREAT day! I ',
  { hint: 'leave', options: ['left', 'leaved', 'leave'] },
  ' my secret lab at 8 o\'clock. I ',
  { hint: 'take', options: ['took', 'taked', 'take'] },
  ' all the superpowers from the Hero HQ. Then I ',
  { hint: 'laugh', options: ['laughed', 'laught', 'laughs'] },
  ' for an hour. The heroes ',
  { hint: 'not see', options: ["didn't see", "didn't saw", "don't saw"] },
  ' me! After that, I ',
  { hint: 'eat', options: ['ate', 'eated', 'eat'] },
  ' a huge pizza. ',
  { hint: 'Did / Does / Was', options: ['Did', 'Does', 'Was'] },
  ' the head student hear the alarm? No, she ',
  { hint: 'short answer', options: ["didn't", "didn't heard", "don't"] },
  '. HA HA HA! — The Glitch',
];

/* ---------- Room 4: Radio Room ---------- */
export const QUESTION_WORDS = ['Who', 'What', 'Where', 'When', 'Why', 'How', 'How many', 'How much'] as const;
export type QuestionWord = (typeof QUESTION_WORDS)[number];

export interface RadioItem {
  question: string; // ___ marks the gap
  answer: string;
  correct: QuestionWord;
  witness: string;
}

const RADIO_ITEMS_A: RadioItem[] = [
  { question: '___ did you see in the lab?', answer: 'I saw the Glitch!', correct: 'Who', witness: 'Mrs Patel, cleaner' },
  { question: '___ did he take?', answer: 'He took the superpowers.', correct: 'What', witness: 'Sam, head student' },
  { question: '___ did he go after that?', answer: 'He went to the old moon tower.', correct: 'Where', witness: 'Kiki, pizza driver' },
  { question: '___ did he leave the HQ?', answer: "At 8 o'clock in the evening.", correct: 'When', witness: 'Officer Brown' },
  { question: '___ did he laugh so loudly?', answer: 'Because he was happy about his plan.', correct: 'Why', witness: 'Mr Jones, teacher' },
  { question: '___ did he get to the tower?', answer: 'He rode his electric bike.', correct: 'How', witness: 'Lily, 11 years old' },
  { question: '___ robots did he have?', answer: 'He had three robots.', correct: 'How many', witness: 'Robo-Dog Rex' },
  { question: '___ money did he pay for the pizza?', answer: 'Twelve pounds. No tip!', correct: 'How much', witness: 'Kiki, pizza driver' },
];

const INTERCEPTED_MESSAGE_A = [
  'TO: all my robots',
  'FROM: The Glitch',
  '',
  'Robots, listen! Yesterday I took 4 superpowers from the Hero HQ.',
  'It was easy. The heroes didn\'t see me. Now I am in the old moon tower with my 3 pet robots.',
  '2 robots are guarding the main gate. Don\'t leave the gate alone!',
  'Tomorrow I want 7 more superpowers. Bring them to the tower at 9 o\'clock.',
  'Don\'t be late. I don\'t like late robots. — G.',
];

export interface FrequencyQuestion {
  q: string;
  answer: number;
}

const FREQUENCY_QUESTIONS_A: FrequencyQuestion[] = [
  { q: 'How many superpowers did the Glitch take yesterday?', answer: 4 },
  { q: 'How many robots are guarding the main gate?', answer: 2 },
  { q: "When must the robots bring the superpowers? At … o'clock.", answer: 9 },
];

/* ---------- Level 8: boss fight ---------- */
export interface BossQuestion {
  text: string;
  options: string[]; // first = correct
  topic: string;
}

const BOSS_QUESTIONS_A: BossQuestion[] = [
  { text: 'Yesterday the Glitch ___ our superpowers.', options: ['took', 'taked', 'takes'], topic: 'Simple past: irregular' },
  { text: 'At Hero School the Glitch ___ have any friends.', options: ["didn't", "doesn't", "wasn't"], topic: 'Simple past: negative' },
  { text: '___ the heroes at home last Friday? – No, they were at the HQ.', options: ['Were', 'Was', 'Did'], topic: 'Simple past: was / were' },
  { text: 'Yesterday we ___ a cat in the water.', options: ['saved', 'save', 'saves'], topic: 'Simple past: regular' },
  { text: 'Last summer I ___ in the sea every day.', options: ['swam', 'swimmed', 'swim'], topic: 'Simple past: irregular' },
  { text: '___ you finish your homework last night?', options: ['Did', 'Do', 'Were'], topic: 'Simple past: question' },
  { text: '___ old are you? – I\'m eleven.', options: ['How', 'What', 'Who'], topic: 'Question words' },
  { text: 'A person who isn\'t shy is ___.', options: ['confident', 'patient', 'curly'], topic: 'Vocabulary' },
  { text: 'My grandfather ___ on a small farm.', options: ['grew up', 'growed up', 'grow upped'], topic: 'Simple past: irregular' },
];



/* ---------- task sets: A (original) and B (new words) ---------- */
// `export let` = live bindings: after applyVariant() every importer sees the new set.
export let WIRE_PAIRS = WIRE_PAIRS_A;
export let SPY_ROUNDS = SPY_ROUNDS_A;
export let BUG_SENTENCES = BUG_SENTENCES_A;
export let BUILDER_SENTENCES = BUILDER_SENTENCES_A;
export let VAULT_DIALS = VAULT_DIALS_A;
export let DIARY = DIARY_A;
export let RADIO_ITEMS = RADIO_ITEMS_A;
export let INTERCEPTED_MESSAGE = INTERCEPTED_MESSAGE_A;
export let FREQUENCY_QUESTIONS = FREQUENCY_QUESTIONS_A;
export let BOSS_QUESTIONS = BOSS_QUESTIONS_A;
export let currentVariant = 0;

export function applyVariant(v: number) {
  if (v === currentVariant) return;
  currentVariant = v;
  const b = v === 1;
  WIRE_PAIRS = b ? B.WIRE_PAIRS_B : WIRE_PAIRS_A;
  SPY_ROUNDS = b ? B.SPY_ROUNDS_B : SPY_ROUNDS_A;
  BUG_SENTENCES = b ? B.BUG_SENTENCES_B : BUG_SENTENCES_A;
  BUILDER_SENTENCES = b ? B.BUILDER_SENTENCES_B : BUILDER_SENTENCES_A;
  VAULT_DIALS = b ? B.VAULT_DIALS_B : VAULT_DIALS_A;
  DIARY = b ? B.DIARY_B : DIARY_A;
  RADIO_ITEMS = b ? B.RADIO_ITEMS_B : RADIO_ITEMS_A;
  INTERCEPTED_MESSAGE = b ? B.INTERCEPTED_MESSAGE_B : INTERCEPTED_MESSAGE_A;
  FREQUENCY_QUESTIONS = b ? B.FREQUENCY_QUESTIONS_B : FREQUENCY_QUESTIONS_A;
  BOSS_QUESTIONS = b ? B.BOSS_QUESTIONS_B : BOSS_QUESTIONS_A;
}

/** hints of a stage for the current task set */
export function hintsFor(kind: string, hints: [string, string]): [string, string] {
  return currentVariant === 1 && B.HINTS_B[kind] ? B.HINTS_B[kind] : hints;
}
