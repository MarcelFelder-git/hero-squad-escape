// Level + stage meta data: story texts, hints, team roles, gear rewards and surprise events.
// The puzzle content lives in puzzles.ts (v1 tasks) and puzzles2.ts (new v2 tasks).
import type { GearId } from '../game/types';

export type StageKind =
  | 'wires'
  | 'spy'
  | 'vocab1'
  | 'bughunt'
  | 'builder'
  | 'listening'
  | 'vault'
  | 'diary'
  | 'questions'
  | 'reading'
  | 'radio'
  | 'frequency'
  | 'vocab2'
  | 'spelling'
  | 'gaptext'
  | 'boss'
  | 'twist'
  | 'profile';

export interface TeamRole {
  /** player slot 0..2 – wraps around when there are fewer players */
  slot: number;
  task: string;
}

/** What the kids are practising right now – shown on every task so they connect it with the theory. */
export interface GrammarNote {
  topic: string;
  rule: string;
}

export interface StageMeta {
  kind: StageKind;
  title: string;
  grammar: GrammarNote;
  instruction: string;
  instructionDe: string;
  hints: [string, string];
  team: TeamRole[];
}

export interface GearInfo {
  id: GearId;
  name: string;
  nameDe: string;
  icon: string;
}

export const GEAR: GearInfo[] = [
  { id: 'mask', name: 'Hero mask', nameDe: 'Heldenmaske', icon: '🎭' },
  { id: 'suit', name: 'Hero suit', nameDe: 'Heldenanzug', icon: '🦸' },
  { id: 'gloves', name: 'Power gloves', nameDe: 'Power-Handschuhe', icon: '🧤' },
  { id: 'boots', name: 'Rocket boots', nameDe: 'Raketenstiefel', icon: '🥾' },
  { id: 'belt', name: 'Gadget belt', nameDe: 'Gadget-Gürtel', icon: '🔋' },
  { id: 'cape', name: 'Super cape', nameDe: 'Super-Cape', icon: '🧣' },
  { id: 'power', name: 'Superpower', nameDe: 'Superkraft', icon: '⚡' },
  { id: 'flight', name: 'Flight', nameDe: 'Fliegen', icon: '🚀' },
];

export interface LevelMeta {
  id: string;
  name: string;
  nameDe: string;
  topic: string;
  color: string;
  scene: 'lab' | 'generator' | 'vault' | 'radio' | 'gate' | 'studio' | 'dark' | 'academy';
  /** surprise before the level intro */
  event?: 'hack' | 'call';
  glitchTaunt: string;
  stages: StageMeta[];
}

const roles3 = (a: string, b: string, c: string): TeamRole[] => [
  { slot: 0, task: a },
  { slot: 1, task: b },
  { slot: 2, task: c },
];

export const LEVELS: LevelMeta[] = [
  {
    id: 'lab',
    name: 'The ID Lab',
    nameDe: 'Das Ausweis-Labor',
    topic: 'Vocabulary: friends & heroes',
    color: '#ff4fa3',
    scene: 'lab',
    glitchTaunt: "I cut the wires of your ID scanner. And one of my spies is hiding in your school. You'll never find him!",
    stages: [
      {
        kind: 'wires',
        grammar: { topic: 'Vocabulary: friends and heroes', rule: 'Words for people: how they look and what they are like.' },
        title: 'Repair the ID scanner',
        instruction: 'Connect the English words with the German words.',
        instructionDe: 'Tippe ein englisches Wort an, dann das passende deutsche.',
        hints: [
          '"strong" sounds a bit like German "stark".',
          '"reliable" = zuverlässig, "patient" = geduldig, "shy" = schüchtern.',
        ],
        team: roles3('reads the English words aloud.', 'finds the German word.', 'connects the wires.'),
      },
      {
        kind: 'spy',
        grammar: { topic: 'Describing people', rule: 'He/She has curly hair. · He/She wears glasses. · He/She doesn\'t wear braces.' },
        title: 'Who is the spy?',
        instruction: 'Read the witness report. Tap the right person.',
        instructionDe: 'Lies die Zeugenaussage. Tippe auf die Person, zu der ALLES passt.',
        hints: [
          'Check one clue at a time: tall or short? Hair? Glasses? Braces?',
          '"doesn\'t wear braces" = trägt KEINE Zahnspange. curly = lockig, straight = glatt.',
        ],
        team: roles3('reads the report aloud.', 'checks hair and height.', 'checks glasses and braces.'),
      },
      {
        kind: 'vocab1',
        grammar: { topic: 'Vocabulary: English → German', rule: 'strong = stark · shy = schüchtern · reliable = zuverlässig' },
        title: 'Vocab Blitz',
        instruction: 'What is it in German? Be fast – build a combo!',
        instructionDe: 'Was heißt das auf Deutsch? Schnell sein gibt Combo-Punkte!',
        hints: ['Use the 📖 Glossary if you are not sure!', 'Look for the word family: "nobody" = niemand, "tall" = groß.'],
        team: roles3('reads the word.', 'says the German word.', 'taps the answer.'),
      },
    ],
  },
  {
    id: 'generator',
    name: 'The Power Generator',
    nameDe: 'Der Energie-Generator',
    topic: 'Simple past',
    color: '#ffd60a',
    scene: 'generator',
    glitchTaunt: 'Yesterday I goed … I mean WENT into your generator. And I putted … I mean PUT grammar bugs in it. Grrr!',
    stages: [
      {
        kind: 'bughunt',
        grammar: { topic: 'Simple past: find the mistakes', rule: 'yesterday / last … → simple past · regular: + -ed · irregular: go → went · didn\'t / Did + normal verb' },
        title: 'Spot the grammar bug',
        instruction: 'Tap the wrong word. Then choose the right one.',
        instructionDe: 'Jeder Satz hat EINEN Fehler. Tippe ihn an und wähle die Korrektur.',
        hints: [
          'Look at the verbs! yesterday / last … → you need the simple past.',
          "take → took · didn't hear · Did you see …? · they → were · last Friday → laughed",
        ],
        team: roles3('reads the sentence.', 'hunts the bug.', 'chooses the correction.'),
      },
      {
        kind: 'builder',
        grammar: { topic: 'Simple past: ✔ ✖ ?', rule: '✔ He took … · ✖ He didn\'t take … · ? Did he take …?' },
        title: 'Build simple past sentences',
        instruction: 'Tap the blocks in the right order. One block is a trap!',
        instructionDe: 'Tippe die Wortblöcke in der richtigen Reihenfolge an. Ein Block ist eine Falle!',
        hints: [
          'Statements: who + verb + rest. Questions start with Did.',
          '"didn\'t see" – not "didn\'t saw". "Did you hear …?" – not "Did you heard …?"',
        ],
        team: roles3('finds the first word.', 'puts the verb in.', 'looks for the trap.'),
      },
    ],
  },
  {
    id: 'studio',
    name: 'Hero Radio 101.5',
    nameDe: 'Das Radio-Studio',
    topic: 'Listening',
    color: '#c77dff',
    scene: 'studio',
    event: 'hack',
    glitchTaunt: 'I hacked your screens! But can you hack your EARS? Listen to the radio show… if you can!',
    stages: [
      {
        kind: 'listening',
        grammar: { topic: 'Listening: true, false or not in the text?', rule: 'Read the sentences first – then listen for names and details.' },
        title: 'The "My best friend" show',
        instruction: 'Listen to the callers. Is it true, false or not in the text?',
        instructionDe: 'Hör zu. Ist die Aussage richtig (true), falsch (false) oder kommt sie nicht vor?',
        hints: [
          'Read the sentences first. Then listen. You can play every caller again!',
          '"not in the text" = the caller says NOTHING about it. After 2 plays you can read the text.',
        ],
        team: roles3('reads the sentences before listening.', 'listens for names and numbers.', 'taps the answers.'),
      },
    ],
  },
  {
    id: 'vault',
    name: 'The Time Vault',
    nameDe: 'Der Zeit-Tresor',
    topic: 'Simple past',
    color: '#4cc9f0',
    scene: 'vault',
    glitchTaunt: "Yesterday I locked a gadget in this vault. You didn't see me, you didn't hear me … and you can't open it!",
    stages: [
      {
        kind: 'vault',
        grammar: { topic: 'Simple past: regular and irregular verbs', rule: 'regular: save → saved · irregular: go → went, see → saw, take → took' },
        title: 'Crack the vault',
        instruction: 'Turn every dial to the simple past. Then pull the lever.',
        instructionDe: 'Stelle an jedem Rad die Simple-Past-Form ein. Dann zieh den Hebel.',
        hints: [
          'Only ONE verb is regular (-ed). The others are irregular – check the 📖 Glossary!',
          'go → went · see → saw · swim → swam · think → thought · leave → left · laugh → laughed',
        ],
        team: roles3('says the verb in German.', 'turns the dials.', 'pulls the lever.'),
      },
      {
        kind: 'diary',
        grammar: { topic: 'Simple past: positive, negative, question', rule: 'I took … · I didn\'t see … · Did you hear …?' },
        title: "The Glitch's secret diary",
        instruction: 'Tap a gap and choose the right form.',
        instructionDe: 'Tippe auf eine Lücke und wähle die richtige Form.',
        hints: [
          "After didn't and Did we use the normal verb: didn't see, Did … hear?",
          "left · took · laughed · didn't see · ate · Did · didn't",
        ],
        team: roles3('reads the diary in a villain voice. 😈', 'chooses the verb.', "checks: regular, irregular or didn't?"),
      },
      {
        kind: 'questions',
        grammar: { topic: 'Simple past: questions with question words', rule: 'question word + did + person + normal verb: Where did you go?' },
        title: 'The question machine',
        instruction: 'Build the simple past question. Look at the answer!',
        instructionDe: 'Baue die Frage im Simple Past. Die Antwort hilft dir!',
        hints: [
          'Question word + did + person + verb (normal form) + rest?',
          'Where did you go … ? · What did Lena eat … ? · Who did the Glitch call … ?',
        ],
        team: roles3('reads the answer.', 'finds the question word.', 'builds the question.'),
      },
    ],
  },
  {
    id: 'dark',
    name: 'Lights Out!',
    nameDe: 'Stromausfall!',
    topic: 'Reading',
    color: '#ff9f1c',
    scene: 'dark',
    event: 'call',
    glitchTaunt: 'I switched off ALL the lights! Now read a story in the dark. Mwahaha!',
    stages: [
      {
        kind: 'reading',
        grammar: { topic: 'Reading: a story in the simple past', rule: 'The story happened yesterday – look for the past forms: was, laughed, said …' },
        title: 'Read in the dark',
        instruction: 'Move your finger over the page – it is a torch! Then tap the missing words IN THE TEXT.',
        instructionDe: 'Dein Finger ist eine Taschenlampe! Tippe die fehlenden Wörter direkt im Text an.',
        hints: [
          'Read the sentence with the gap first. Then look for the same words in the story.',
          'ring · wet · bus · laughed · eggs · Nova · mistakes · kind',
        ],
        team: roles3('holds the torch and reads.', 'reads the sentence with the gap.', 'taps the word.'),
      },
    ],
  },
  {
    id: 'radio',
    name: 'The Radio Room',
    nameDe: 'Der Funkraum',
    topic: 'Question words',
    color: '#2ecc71',
    scene: 'radio',
    glitchTaunt: 'Bzzzt! I scrambled your radio. Your witnesses can answer – but nobody knows the questions!',
    stages: [
      {
        kind: 'radio',
        grammar: { topic: 'Question words', rule: 'Who? person · What? thing · Where? place · When? time · Why? · How? · How many? · How much?' },
        title: 'Fix the witness questions',
        instruction: 'Read the answer. Choose the right question word.',
        instructionDe: 'Lies die Antwort und wähle das passende Fragewort.',
        hints: [
          'Look at the ANSWER: person → Who · place → Where · time → When · because … → Why',
          'number of things → How many · money → How much · the way → How · a thing → What',
        ],
        team: roles3('reads the answer.', 'says: person, place, time, thing …?', 'tunes the question word.'),
      },
      {
        kind: 'frequency',
        grammar: { topic: 'Reading for details + simple past', rule: 'Find the numbers: How many … did …? When did …?' },
        title: 'Find the secret frequency',
        instruction: 'Read the message. The answers are the code!',
        instructionDe: 'Lies die abgefangene Nachricht. Die Zahlen-Antworten ergeben den Code.',
        hints: [
          'Careful – there are MORE numbers in the message than you need.',
          "He took 4 superpowers. 2 robots are at the gate. They must come at 9 o'clock.",
        ],
        team: roles3('reads the message aloud.', 'finds the numbers.', 'types the code.'),
      },
    ],
  },
  {
    id: 'academy',
    name: 'Vocab Academy',
    nameDe: 'Die Vokabel-Akademie',
    topic: 'Vocabulary power-up',
    color: '#ff006e',
    scene: 'academy',
    glitchTaunt: 'Ha! Heroes need words. And I stole ALL your words! Bet you can\'t remember them…',
    stages: [
      {
        kind: 'vocab2',
        grammar: { topic: 'Vocabulary: German → English', rule: 'retten = save · verletzen = hurt · aufwachsen = grow up' },
        title: 'Vocab Blitz 2',
        instruction: 'What is it in English? Build a combo!',
        instructionDe: 'Was heißt das auf Englisch? Mehrere richtig hintereinander = Combo!',
        hints: ['All words are in the 📖 Glossary (Topic 2 and Unit 2).', 'retten = save · aufwachsen = grow up · verletzen = hurt'],
        team: roles3('reads the German word.', 'says it in English.', 'taps the answer.'),
      },
      {
        kind: 'spelling',
        grammar: { topic: 'Vocabulary: spelling', rule: 'Listen, then spell the word letter by letter.' },
        title: 'Spelling lab',
        instruction: 'Spell the English word with the letters.',
        instructionDe: 'Schreib das englische Wort mit den Buchstaben. 🔊 hilft beim Hören.',
        hints: ['Tap 🔊 and listen to the word.', 'STRONG · HERO · PATIENT · MISTAKE · MOON · SAVE'],
        team: roles3('says the word in English.', 'spells it aloud.', 'taps the letters.'),
      },
      {
        kind: 'gaptext',
        grammar: { topic: 'Vocabulary in a text', rule: 'Read the whole sentence – which word fits?' },
        title: 'A letter for a friend',
        instruction: 'Fill the gaps with words from the box. One word is extra!',
        instructionDe: 'Fülle die Lücken mit den Wörtern aus dem Kasten. Ein Wort bleibt übrig!',
        hints: [
          'Read the whole sentence first. What kind of word is missing?',
          'reliable · mistake · nobody · laugh · patient · confident · hero (extra: shy)',
        ],
        team: roles3('reads the letter aloud.', 'finds the right word.', 'checks the extra word.'),
      },
    ],
  },
  {
    id: 'gate',
    name: 'The Final Showdown',
    nameDe: 'Der große Showdown',
    topic: 'Final mission: everything!',
    color: '#ff7b00',
    scene: 'gate',
    glitchTaunt: "So you are heroes now. Impressive. But nobody gets past ME! I am THE GLITCH and I never lose!",
    stages: [
      {
        kind: 'boss',
        grammar: { topic: 'Revision: simple past, question words, vocabulary', rule: 'yesterday / last … → simple past · didn\'t / Did + normal verb' },
        title: 'Boss fight: The Glitch',
        instruction: 'Take turns! Every right answer is a hero attack.',
        instructionDe: 'Wechselt euch ab! Jede richtige Antwort ist ein Treffer.',
        hints: [
          'yesterday / last … → simple past. Person, place or time? → Who / Where / When',
          "after did / didn't → normal verb · they → were · How old / How many",
        ],
        team: roles3('attacks with question 1, 4, 7 …', 'attacks with question 2, 5, 8 …', 'attacks with question 3, 6, 9 …'),
      },
      {
        kind: 'twist',
        grammar: { topic: 'Talking to a friend', rule: 'Do you want …? · Everybody makes mistakes!' },
        title: 'Fight … or friendship?',
        instruction: 'The Glitch has something to tell you. What do real heroes do?',
        instructionDe: 'The Glitch will euch etwas sagen. Was machen echte Helden?',
        hints: ['Think about the title of this unit: Friends and heroes …', 'Real heroes help – even villains. Choose friendship!'],
        team: roles3('reads what the Glitch says.', 'says what they think.', 'makes the decision for the team.'),
      },
      {
        kind: 'profile',
        grammar: { topic: 'Describing a person', rule: 'He/She is … · He/She has … hair. · He/She wears …' },
        title: 'Your hero profile',
        instruction: 'Write about your hero: looks, personality and why your hero is special.',
        instructionDe: 'Beschreibe deine*n Held*in: Aussehen, Persönlichkeit und warum er/sie besonders ist.',
        hints: ['he / she → has, is · they → have, are', 'Look at your hero picture: is the hair curly, straight, spiky or short?'],
        team: roles3('writes about their own hero.', 'writes about their own hero.', 'writes about their own hero.'),
      },
    ],
  },
];

export const TOTAL_STAGES = LEVELS.reduce((s, l) => s + l.stages.length, 0);
