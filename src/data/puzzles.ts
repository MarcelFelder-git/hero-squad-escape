// All puzzle content in one place – easy to adapt for other classes.
// The first option in every `options` array is the correct one (options get shuffled in the UI).

/* ---------- Room 1: ID Lab ---------- */
export const WIRE_PAIRS: { en: string; de: string }[] = [
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
  report: string[];
  answer: string;
  suspects: Suspect[];
}

export const SPY_ROUNDS: SpyRound[] = [
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

export const BUG_SENTENCES: BugSentence[] = [
  {
    words: ['Captain', 'Nova', "doesn't", 'goes', 'to', 'school', 'on', 'Saturdays.'],
    bugIndex: 3,
    options: ['go', 'going', 'went'],
    explain: "doesn't + infinitive: doesn't go",
  },
  {
    words: ['Max', 'always', 'help', 'his', 'friends', 'with', 'their', 'homework.'],
    bugIndex: 2,
    options: ['helps', 'helping', 'to help'],
    explain: 'he/she/it → -s: Max helps',
  },
  {
    words: ['Do', 'Lina', 'like', 'her', 'new', 'glasses?'],
    bugIndex: 0,
    options: ['Does', 'Is', 'Are'],
    explain: 'he/she/it → Does: Does Lina like …?',
  },
  {
    words: ['My', 'friends', "doesn't", 'laugh', 'at', 'me.'],
    bugIndex: 2,
    options: ["don't", "isn't", 'not'],
    explain: "they (my friends) → don't",
  },
  {
    words: ['Does', 'the', 'head', 'student', 'wears', 'braces?'],
    bugIndex: 4,
    options: ['wear', 'wearing', 'wore'],
    explain: 'Does + infinitive: Does … wear?',
  },
];

export interface BuilderSentence {
  label: string;
  tiles: string[]; // correct order
  trap: string;
  translation: string;
}

export const BUILDER_SENTENCES: BuilderSentence[] = [
  {
    label: 'Positive ✔',
    tiles: ['Zara', 'helps', 'her friends', 'every day.'],
    trap: 'help',
    translation: 'Zara hilft jeden Tag ihren Freunden.',
  },
  {
    label: 'Negative ✖',
    tiles: ['Ben', "doesn't", 'laugh', 'at', 'his friends.'],
    trap: 'laughs',
    translation: 'Ben lacht nicht über seine Freunde.',
  },
  {
    label: 'Question ?',
    tiles: ['Does', 'your hero', 'wear', 'a mask?'],
    trap: 'Do',
    translation: 'Trägt dein Held eine Maske?',
  },
];

/* ---------- Room 3: Time Vault ---------- */
export interface VaultDial {
  verb: string;
  de: string;
  options: string[]; // first = correct
}

export const VAULT_DIALS: VaultDial[] = [
  { verb: 'go', de: 'gehen', options: ['went', 'goed', 'gone', 'wented'] },
  { verb: 'see', de: 'sehen', options: ['saw', 'seed', 'sawed', 'seen'] },
  { verb: 'swim', de: 'schwimmen', options: ['swam', 'swimmed', 'swum', 'swimed'] },
  { verb: 'think', de: 'denken', options: ['thought', 'thinked', 'thank', 'thoughted'] },
  { verb: 'leave', de: 'verlassen', options: ['left', 'leaved', 'lefted', 'leaves'] },
  { verb: 'laugh', de: 'lachen', options: ['laughed', 'laught', 'lought', 'laughs'] },
];

/** diary text: strings are plain text, objects are gaps */
export type DiaryPart = string | { hint: string; options: string[] };

export const DIARY: DiaryPart[] = [
  'Dear Diary, yesterday was a GREAT day! I ',
  { hint: 'leave', options: ['left', 'leaved', 'leave'] },
  ' my secret lab at 8 o\'clock. I ',
  { hint: 'take', options: ['took', 'taked', 'take'] },
  ' all the energy cores from the Hero HQ. Then I ',
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

export const RADIO_ITEMS: RadioItem[] = [
  { question: '___ did you see in the lab?', answer: 'I saw the Glitch!', correct: 'Who', witness: 'Mrs Patel, cleaner' },
  { question: '___ did he take?', answer: 'He took the energy cores.', correct: 'What', witness: 'Sam, head student' },
  { question: '___ did he go after that?', answer: 'He went to the old moon tower.', correct: 'Where', witness: 'Kiki, pizza driver' },
  { question: '___ did he leave the HQ?', answer: "At 8 o'clock in the evening.", correct: 'When', witness: 'Officer Brown' },
  { question: '___ did he laugh so loudly?', answer: 'Because he was happy about his plan.', correct: 'Why', witness: 'Mr Jones, teacher' },
  { question: '___ did he get to the tower?', answer: 'He rode his electric bike.', correct: 'How', witness: 'Lily, 11 years old' },
  { question: '___ robots did he have?', answer: 'He had three robots.', correct: 'How many', witness: 'Robo-Dog Rex' },
  { question: '___ money did he pay for the pizza?', answer: 'Twelve pounds. No tip!', correct: 'How much', witness: 'Kiki, pizza driver' },
];

export const INTERCEPTED_MESSAGE = [
  'TO: all my robots',
  'FROM: The Glitch',
  '',
  'Robots, listen! Yesterday I took 4 energy cores from the Hero HQ.',
  'It was easy. The heroes didn\'t see me. Now I am in the old moon tower with my 3 pet robots.',
  '2 robots are guarding the main gate. Don\'t leave the gate alone!',
  'Tomorrow I want 7 more cores. Bring them to the tower at 9 o\'clock.',
  'Don\'t be late. I don\'t like late robots. — G.',
];

export interface FrequencyQuestion {
  q: string;
  answer: number;
}

export const FREQUENCY_QUESTIONS: FrequencyQuestion[] = [
  { q: 'How many cores did the Glitch take yesterday?', answer: 4 },
  { q: 'How many robots are guarding the main gate?', answer: 2 },
  { q: "When must the robots bring the cores? At … o'clock.", answer: 9 },
];

/* ---------- Room 5: Main Gate ---------- */
export interface BossQuestion {
  text: string;
  options: string[]; // first = correct
  topic: string;
}

export const BOSS_QUESTIONS: BossQuestion[] = [
  { text: "My best friend ___ always there for me. She's so reliable!", options: ['is', 'are', 'be'], topic: 'Simple present' },
  { text: 'The Glitch ___ have any friends.', options: ["doesn't", "don't", "isn't"], topic: 'Simple present: negative' },
  { text: '___ you want to be a hero?', options: ['Do', 'Does', 'Are'], topic: 'Simple present: question' },
  { text: 'Yesterday we ___ a cat in the water.', options: ['saved', 'save', 'saves'], topic: 'Simple past: regular' },
  { text: 'Last summer I ___ in the sea every day.', options: ['swam', 'swimmed', 'swim'], topic: 'Simple past: irregular' },
  { text: '___ you finish your homework last night?', options: ['Did', 'Do', 'Were'], topic: 'Simple past: question' },
  { text: '___ old are you? – I\'m eleven.', options: ['How', 'What', 'Who'], topic: 'Question words' },
  { text: 'A person who isn\'t shy is ___.', options: ['confident', 'patient', 'curly'], topic: 'Vocabulary' },
  { text: 'My grandfather ___ on a small farm.', options: ['grew up', 'growed up', 'grow upped'], topic: 'Simple past: irregular' },
];

export interface GateGap {
  before: string;
  after: string;
  options: string[]; // first = correct
}

export const GATE_GAPS: GateGap[] = [
  { before: 'Our coach is 1.95 m. He is very ', after: '.', options: ['tall', 'shy', 'patient'] },
  { before: "Why can't I have a pet? Everybody ", after: ' has a pet!', options: ['else', 'nobody', 'yourself'] },
  { before: 'Go away, Glitch! Leave us ', after: '!', options: ['alone', 'left', 'right'] },
  { before: 'There are some ', after: ' in your text. Please correct them.', options: ['mistakes', 'heroes', 'lives'] },
];

export const GATE_PASSWORD = 'TEAM';
