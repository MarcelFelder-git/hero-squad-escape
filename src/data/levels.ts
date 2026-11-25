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
  | 'profile'
  | 'finalgate';

export interface TeamRole {
  /** player slot 0..2 – wraps around when there are fewer players */
  slot: number;
  task: string;
}

export interface StageMeta {
  kind: StageKind;
  title: string;
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
    topic: 'Simple present',
    color: '#ffd60a',
    scene: 'generator',
    glitchTaunt: "I put grammar bugs into your generator! Now it doesn't works. Oops… I mean: it doesn't WORK. Grrr!",
    stages: [
      {
        kind: 'bughunt',
        title: 'Spot the grammar bug',
        instruction: 'Tap the wrong word. Then choose the right one.',
        instructionDe: 'Jeder Satz hat EINEN Fehler. Tippe ihn an und wähle die Korrektur.',
        hints: [
          'Look at the verbs! he/she/it → -s … but NOT after doesn\'t or Does.',
          "doesn't + verb without -s · Does + verb without -s · I/you/we/they → don't / Do",
        ],
        team: roles3('reads the sentence.', 'hunts the bug.', 'chooses the correction.'),
      },
      {
        kind: 'builder',
        title: 'Build power sentences',
        instruction: 'Tap the blocks in the right order. One block is a trap!',
        instructionDe: 'Tippe die Wortblöcke in der richtigen Reihenfolge an. Ein Block ist eine Falle!',
        hints: [
          'Statements: who + verb + rest. Questions start with Do or Does.',
          '"doesn\'t laugh" – not "doesn\'t laughs". "Does … wear" – not "Does … wears".',
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
        title: 'Find the secret frequency',
        instruction: 'Read the message. The answers are the code!',
        instructionDe: 'Lies die abgefangene Nachricht. Die Zahlen-Antworten ergeben den Code.',
        hints: [
          'Careful – there are MORE numbers in the message than you need.',
          "He took 4 cores. 2 robots are at the gate. They must come at 9 o'clock.",
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
        title: 'Vocab Blitz 2',
        instruction: 'What is it in English? Build a combo!',
        instructionDe: 'Was heißt das auf Englisch? Mehrere richtig hintereinander = Combo!',
        hints: ['All words are in the 📖 Glossary (Topic 2 and Unit 2).', 'retten = save · aufwachsen = grow up · verletzen = hurt'],
        team: roles3('reads the German word.', 'says it in English.', 'taps the answer.'),
      },
      {
        kind: 'spelling',
        title: 'Spelling lab',
        instruction: 'Spell the English word with the letters.',
        instructionDe: 'Schreib das englische Wort mit den Buchstaben. 🔊 hilft beim Hören.',
        hints: ['Tap 🔊 and listen to the word.', 'STRONG · HERO · PATIENT · MISTAKE · MOON · SAVE'],
        team: roles3('says the word in English.', 'spells it aloud.', 'taps the letters.'),
      },
      {
        kind: 'gaptext',
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
    name: 'The Main Gate',
    nameDe: 'Das Haupttor',
    topic: 'Final mission: everything!',
    color: '#ff7b00',
    scene: 'gate',
    glitchTaunt: "So you are heroes now. Impressive. But nobody gets past ME! I am THE GLITCH and I never lose!",
    stages: [
      {
        kind: 'boss',
        title: 'Boss fight: The Glitch',
        instruction: 'Take turns! Every right answer is a hero attack.',
        instructionDe: 'Wechselt euch ab! Jede richtige Antwort ist ein Treffer.',
        hints: [
          'yesterday / last … → simple past · every day / always → simple present.',
          "he/she/it → -s · after did/didn't/does/doesn't → normal verb · How old / How many",
        ],
        team: roles3('attacks with question 1, 4, 7 …', 'attacks with question 2, 5, 8 …', 'attacks with question 3, 6, 9 …'),
      },
      {
        kind: 'twist',
        title: 'Fight … or friendship?',
        instruction: 'The Glitch has something to tell you. What do real heroes do?',
        instructionDe: 'The Glitch will euch etwas sagen. Was machen echte Helden?',
        hints: ['Think about the title of this unit: Friends and heroes …', 'Real heroes help – even villains. Choose friendship!'],
        team: roles3('reads what the Glitch says.', 'says what they think.', 'makes the decision for the team.'),
      },
      {
        kind: 'profile',
        title: 'Your hero profile',
        instruction: 'Write about your hero: looks, personality and why your hero is special.',
        instructionDe: 'Beschreibe deine*n Held*in: Aussehen, Persönlichkeit und warum er/sie besonders ist.',
        hints: ['he / she → has, is · they → have, are', 'Look at your hero picture: is the hair curly, straight, spiky or short?'],
        team: roles3('writes about their own hero.', 'writes about their own hero.', 'writes about their own hero.'),
      },
      {
        kind: 'finalgate',
        title: 'Open the main gate',
        instruction: 'Fill the gaps. The first letters make the password!',
        instructionDe: 'Fülle die Lücken. Die Anfangsbuchstaben ergeben das Passwort!',
        hints: ['The Glitch never had one. Every hero squad needs one. 4 letters!', 'tall · else · alone · mistakes → T-E-A-M'],
        team: roles3('fills gap 1 and 3.', 'fills gap 2 and 4.', 'types the password.'),
      },
    ],
  },
];

export const TOTAL_STAGES = LEVELS.reduce((s, l) => s + l.stages.length, 0);
