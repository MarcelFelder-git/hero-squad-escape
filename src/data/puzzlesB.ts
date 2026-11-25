// Task set B: same puzzles as set A (puzzles.ts), but new sentences and words – so groups who
// already played get something new. Only words from the vocabulary list. First option = correct.
import type {
  BossQuestion,
  BugSentence,
  BuilderSentence,
  DiaryPart,
  FrequencyQuestion,
  RadioItem,
  SpyRound,
  VaultDial,
} from './puzzles';

export const WIRE_PAIRS_B = [
  { en: 'sunglasses', de: 'die Sonnenbrille' },
  { en: 'straight', de: 'glatt' },
  { en: 'left', de: 'links' },
  { en: 'right', de: 'rechts' },
  { en: 'mistake', de: 'der Fehler' },
  { en: 'hero', de: 'der Held' },
];

export const SPY_ROUNDS_B: SpyRound[] = [
  {
    pronoun: 'She',
    report: ["The spy isn't tall. She's short.", 'She has curly, red hair.', 'She wears glasses', 'and she wears braces, too.'],
    answer: 'k',
    suspects: [
      { id: 'i', name: 'Nina', tall: false, hairStyle: 'curly', hair: '#e63946', glasses: true, braces: false, skin: '#ffe0c7', shirt: '#2ecc71' },
      { id: 'j', name: 'Ella', tall: true, hairStyle: 'curly', hair: '#e63946', glasses: true, braces: true, skin: '#f6c9a0', shirt: '#1e88e5' },
      { id: 'k', name: 'Ruby', tall: false, hairStyle: 'curly', hair: '#e63946', glasses: true, braces: true, skin: '#e0a878', shirt: '#ff9f1c' },
      { id: 'l', name: 'Ida', tall: false, hairStyle: 'straight', hair: '#e63946', glasses: true, braces: true, skin: '#b97a4f', shirt: '#8e44ad' },
    ],
  },
  {
    pronoun: 'He',
    report: ['The second spy is tall.', 'He has straight, brown hair.', "He doesn't wear glasses,", 'but he wears braces.'],
    answer: 'o',
    suspects: [
      { id: 'm', name: 'Sam', tall: true, hairStyle: 'straight', hair: '#a0522d', glasses: true, braces: true, skin: '#f6c9a0', shirt: '#14b8a6' },
      { id: 'n', name: 'Jack', tall: false, hairStyle: 'straight', hair: '#a0522d', glasses: false, braces: true, skin: '#ffe0c7', shirt: '#e63946' },
      { id: 'o', name: 'Omar', tall: true, hairStyle: 'straight', hair: '#a0522d', glasses: false, braces: true, skin: '#8d5524', shirt: '#ec4899' },
      { id: 'p', name: 'Ben', tall: true, hairStyle: 'curly', hair: '#a0522d', glasses: false, braces: true, skin: '#e0a878', shirt: '#ffd60a' },
    ],
  },
];

export const BUG_SENTENCES_B: BugSentence[] = [
  {
    words: ['Last', 'summer', 'I', 'swimmed', 'in', 'the', 'sea.'],
    bugIndex: 3,
    options: ['swam', 'swim', 'swims'],
    explain: 'swim → swam (irregular verb)',
  },
  {
    words: ['Did', 'Sara', 'finished', 'her', 'homework?'],
    bugIndex: 2,
    options: ['finish', 'finishing', 'finishes'],
    explain: 'Did + normal verb: Did Sara finish …?',
  },
  {
    words: ['We', "didn't", 'went', 'to', 'school', 'yesterday.'],
    bugIndex: 2,
    options: ['go', 'goes', 'going'],
    explain: "didn't + normal verb: didn't go",
  },
  {
    words: ['The', 'Glitch', 'were', 'very', 'shy', 'at', 'school.'],
    bugIndex: 2,
    options: ['was', 'are', 'be'],
    explain: 'he/she/it (the Glitch) → was',
  },
  {
    words: ['Yesterday', 'Leo', 'save', 'a', 'cat.'],
    bugIndex: 2,
    options: ['saved', 'saves', 'saving'],
    explain: 'yesterday → simple past: saved (regular: + -ed)',
  },
];

export const BUILDER_SENTENCES_B: BuilderSentence[] = [
  {
    label: 'Positive ✔',
    tiles: ['Leo', 'wore', 'sunglasses', 'yesterday.'],
    trap: 'weared',
    translation: 'Leo trug gestern eine Sonnenbrille.',
  },
  {
    label: 'Negative ✖',
    tiles: ['Nova', "didn't", 'leave', 'her friends', 'alone.'],
    trap: 'left',
    translation: 'Nova ließ ihre Freunde nicht allein.',
  },
  {
    label: 'Question ?',
    tiles: ['Did', 'the Glitch', 'have', 'a best friend?'],
    trap: 'had',
    translation: 'Hatte der Glitch einen besten Freund?',
  },
];

export const VAULT_DIALS_B: VaultDial[] = [
  { verb: 'eat', de: 'essen', options: ['ate', 'eated', 'eaten', 'ated'] },
  { verb: 'hear', de: 'hören', options: ['heard', 'heared', 'hear', 'hearded'] },
  { verb: 'ride', de: 'fahren, reiten', options: ['rode', 'rided', 'ridden', 'rod'] },
  { verb: 'tell', de: 'erzählen', options: ['told', 'telled', 'tolled', 'tell'] },
  { verb: 'wear', de: 'tragen', options: ['wore', 'weared', 'worn', 'wored'] },
  { verb: 'save', de: 'retten', options: ['saved', 'saveed', 'sove', 'saves'] },
];

export const DIARY_B: DiaryPart[] = [
  'Dear Diary, last night I ',
  { hint: 'sleep', options: ['slept', 'sleeped', 'sleep'] },
  ' only two hours. Then I ',
  { hint: 'ride', options: ['rode', 'rided', 'ride'] },
  ' my electric bike to Hero City and I ',
  { hint: 'buy', options: ['bought', 'buyed', 'buy'] },
  ' a huge chocolate cake. The heroes ',
  { hint: 'not hear', options: ["didn't hear", "didn't heard", "don't heard"] },
  ' me! After that, I ',
  { hint: 'make', options: ['made', 'maked', 'make'] },
  ' a secret plan. ',
  { hint: 'Did / Does / Was', options: ['Did', 'Does', 'Was'] },
  ' the head student see my robots? No, she ',
  { hint: 'short answer', options: ["didn't", "didn't saw", "doesn't"] },
  '. HA HA HA! — The Glitch',
];

export const RADIO_ITEMS_B: RadioItem[] = [
  { question: '___ did the Glitch call last night?', answer: 'He called his best robot, Rex.', correct: 'Who', witness: 'Mrs Lee, neighbour' },
  { question: '___ did he buy at the shop?', answer: 'He bought a big bag of sweets.', correct: 'What', witness: 'Tom, shop assistant' },
  { question: '___ did his robots sleep?', answer: 'In the old car park.', correct: 'Where', witness: 'Officer Brown' },
  { question: '___ did the alarm begin?', answer: 'At half past six in the morning.', correct: 'When', witness: 'Sam, head student' },
  { question: '___ did he wear sunglasses at night?', answer: "Because he didn't want people to see him.", correct: 'Why', witness: 'Lily, 11 years old' },
  { question: '___ did he get into the HQ?', answer: 'He went through a window on the left.', correct: 'How', witness: 'Mr Jones, teacher' },
  { question: '___ heroes were at the HQ?', answer: 'Only two. The others were at home.', correct: 'How many', witness: 'Robo-Dog Rex' },
  { question: '___ did his new robot cost?', answer: 'Five hundred pounds!', correct: 'How much', witness: 'Kiki, pizza driver' },
];

export const INTERCEPTED_MESSAGE_B = [
  'TO: all my robots',
  'FROM: The Glitch',
  '',
  "Robots, listen! Last night 5 heroes were at the HQ, but they didn't hear us.",
  'We took 3 superpowers. I put them in my secret lab under the old moon tower.',
  "1 robot is watching the lab. Don't leave it alone!",
  "Tomorrow we go to the school at 7 o'clock. Don't be late!",
  '— G. (With 2 more superpowers I am the king of Hero City!)',
];

export const FREQUENCY_QUESTIONS_B: FrequencyQuestion[] = [
  { q: 'How many superpowers did the robots take?', answer: 3 },
  { q: 'How many robots are watching the lab?', answer: 1 },
  { q: "When do they go to the school? At … o'clock.", answer: 7 },
];

export const BOSS_QUESTIONS_B: BossQuestion[] = [
  { text: '___ you at school yesterday? – Yes, I was.', options: ['Were', 'Was', 'Did'], topic: 'Simple past: was / were' },
  { text: 'Leo ___ wear his glasses yesterday.', options: ["didn't", "doesn't", "wasn't"], topic: 'Simple past: negative' },
  { text: 'What ___ you eat for breakfast? – I ate eggs.', options: ['did', 'do', 'were'], topic: 'Simple past: question' },
  { text: 'Last week the heroes ___ a dog in the river.', options: ['saved', 'save', 'saves'], topic: 'Simple past: regular' },
  { text: 'Yesterday I ___ my bike to school.', options: ['rode', 'rided', 'ride'], topic: 'Simple past: irregular' },
  { text: '___ you hear the alarm last night?', options: ['Did', 'Do', 'Were'], topic: 'Simple past: question' },
  { text: '___ many robots did the Glitch have?', options: ['How', 'What', 'Who'], topic: 'Question words' },
  { text: 'A person who works a lot is ___.', options: ['hard-working', 'shy', 'straight'], topic: 'Vocabulary' },
  { text: 'Ouch! I ___ my hand yesterday.', options: ['hurt', 'hurted', 'hurts'], topic: 'Simple past: irregular' },
];

/** hints that mention set-A answers get a set-B version */
export const HINTS_B: Record<string, [string, string]> = {
  wires: ['"links" and "left" both start with L!', 'sunglasses = Sonnenbrille · straight = glatt · mistake = Fehler · right = rechts'],
  bughunt: [
    'Look at the verbs! yesterday / last … → you need the simple past.',
    "swim → swam · Did … finish? · didn't go · the Glitch → was · yesterday → saved",
  ],
  builder: [
    'Statements: who + verb + rest. Questions start with Did.',
    '"didn\'t leave" – not "didn\'t left". "Did … have" – not "Did … had".',
  ],
  vault: [
    'Only ONE verb is regular (-ed). The others are irregular – check the 📖 Glossary!',
    'eat → ate · hear → heard · ride → rode · tell → told · wear → wore · save → saved',
  ],
  diary: [
    "After didn't and Did we use the normal verb: didn't hear, Did … see?",
    "slept · rode · bought · didn't hear · made · Did · didn't",
  ],
  frequency: [
    'Careful – there are MORE numbers in the message than you need.',
    "They took 3 superpowers. 1 robot is watching the lab. They go to the school at 7 o'clock.",
  ],
};
