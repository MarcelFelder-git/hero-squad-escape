// Room + stage meta data: story texts, hints, team roles.
// The puzzle content itself lives in puzzles.ts.

export type StageKind =
  | 'wires'
  | 'spy'
  | 'bughunt'
  | 'builder'
  | 'vault'
  | 'diary'
  | 'radio'
  | 'frequency'
  | 'boss'
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

export interface RoomMeta {
  id: string;
  name: string;
  nameDe: string;
  topic: string;
  core: string;
  coreColor: string;
  scene: 'lab' | 'generator' | 'vault' | 'radio' | 'gate';
  glitchTaunt: string;
  echoIntro: string;
  stages: StageMeta[];
}

export const ROOMS: RoomMeta[] = [
  {
    id: 'lab',
    name: 'The ID Lab',
    nameDe: 'Das Ausweis-Labor',
    topic: 'Vocabulary: friends & heroes',
    core: 'Friendship Core',
    coreColor: '#ff4fa3',
    scene: 'lab',
    glitchTaunt:
      "Ha! I cut all the wires of your ID scanner. And one of my spies is hiding in your school. You can't find him!",
    echoIntro:
      'Welcome, heroes! I am ECHO, the HQ computer. First we must repair the ID scanner. Then we can find the spy!',
    stages: [
      {
        kind: 'wires',
        title: 'Repair the ID scanner',
        instruction: 'Connect each English word with the right German word. Tap a word on the left, then on the right.',
        instructionDe: 'Verbinde jedes englische Wort mit der deutschen Bedeutung: erst links tippen, dann rechts.',
        hints: [
          'Start with the words you know. "strong" sounds a bit like German "stark".',
          '"reliable" = zuverlässig, "patient" = geduldig, "shy" = schüchtern.',
        ],
        team: [
          { slot: 0, task: 'reads the English words aloud.' },
          { slot: 1, task: 'finds the German word.' },
          { slot: 2, task: 'taps the wires and checks the colours.' },
        ],
      },
      {
        kind: 'spy',
        title: 'Who is the spy?',
        instruction: 'Read the witness report. Tap the person who matches ALL the information.',
        instructionDe: 'Lies die Zeugenaussage und tippe auf die Person, zu der ALLES passt.',
        hints: [
          'Check one clue at a time: first tall or short, then the hair, then glasses and braces.',
          '"doesn\'t wear braces" = trägt KEINE Zahnspange. "curly" = lockig, "straight" = glatt.',
        ],
        team: [
          { slot: 0, task: 'reads the witness report aloud.' },
          { slot: 1, task: 'checks hair and height.' },
          { slot: 2, task: 'checks glasses and braces.' },
        ],
      },
    ],
  },
  {
    id: 'generator',
    name: 'The Power Generator',
    nameDe: 'Der Energie-Generator',
    topic: 'Simple present',
    core: 'Power Core',
    coreColor: '#ffd60a',
    scene: 'generator',
    glitchTaunt:
      "I put grammar bugs into your power generator! Now it doesn't works. Oops… I mean: it doesn't WORK. Grrr!",
    echoIntro:
      'The generator is full of grammar bugs! Remember: he/she/it → -s. And after don\'t / doesn\'t / do / does: no -s!',
    stages: [
      {
        kind: 'bughunt',
        title: 'Spot the grammar bug',
        instruction: 'Every sentence has ONE bug. Tap the wrong word, then choose the right word.',
        instructionDe: 'In jedem Satz steckt EIN Fehler. Tippe auf das falsche Wort und wähle die Korrektur.',
        hints: [
          'Look at the verbs! Is it he/she/it? Then the verb needs -s … but not after doesn\'t or does.',
          "doesn't + verb WITHOUT -s · Does + verb WITHOUT -s · I/you/we/they → don't / Do",
        ],
        team: [
          { slot: 0, task: 'reads the sentence aloud.' },
          { slot: 1, task: 'hunts the bug.' },
          { slot: 2, task: 'chooses the correction.' },
        ],
      },
      {
        kind: 'builder',
        title: 'Build the power sentences',
        instruction: 'Tap the word blocks in the right order. One block is a trap – you don\'t need it!',
        instructionDe: 'Tippe die Wortblöcke in der richtigen Reihenfolge an. Ein Block ist eine Falle!',
        hints: [
          'Statements: who + verb + rest. Questions start with Do or Does.',
          'Look at the verb blocks: "doesn\'t laugh" not "doesn\'t laughs". "Does … wear", not "Does … wears".',
        ],
        team: [
          { slot: 0, task: 'finds the first word.' },
          { slot: 1, task: 'puts the verb in.' },
          { slot: 2, task: 'checks: is there a trap block?' },
        ],
      },
    ],
  },
  {
    id: 'vault',
    name: 'The Time Vault',
    nameDe: 'Der Zeit-Tresor',
    topic: 'Simple past',
    core: 'Time Core',
    coreColor: '#4cc9f0',
    scene: 'vault',
    glitchTaunt:
      'Yesterday I locked the Time Core in this vault. You didn\'t see me, you didn\'t hear me … and you can\'t open it!',
    echoIntro:
      'The Time Vault only opens with simple past forms. Careful: many verbs are irregular – go → went!',
    stages: [
      {
        kind: 'vault',
        title: 'Crack the vault',
        instruction: 'Turn every dial to the correct simple past form. Then pull the lever.',
        instructionDe: 'Stelle an jedem Rad die richtige Simple-Past-Form ein. Dann zieh den Hebel.',
        hints: [
          'Only one dial is a regular verb with -ed. All the others are irregular – check the Glossary 📖!',
          'go → went · see → saw · swim → swam · think → thought · leave → left · laugh → laughed',
        ],
        team: [
          { slot: 0, task: 'says the verb in German.' },
          { slot: 1, task: 'turns the dials.' },
          { slot: 2, task: 'checks the Glossary and pulls the lever.' },
        ],
      },
      {
        kind: 'diary',
        title: "The Glitch's secret diary",
        instruction: 'Some words in the diary are missing. Tap a gap and choose the right form.',
        instructionDe: 'Im Tagebuch fehlen Wörter. Tippe auf eine Lücke und wähle die richtige Form.',
        hints: [
          "After didn't and Did we use the infinitive (the normal verb): didn't see, Did … hear.",
          'left · took · laughed · didn\'t see · ate · Did · didn\'t',
        ],
        team: [
          { slot: 0, task: 'reads the diary aloud in a villain voice. 😈' },
          { slot: 1, task: 'chooses the verb form.' },
          { slot: 2, task: 'checks: regular, irregular or didn\'t?' },
        ],
      },
    ],
  },
  {
    id: 'radio',
    name: 'The Radio Room',
    nameDe: 'Der Funkraum',
    topic: 'Question words',
    core: 'Communication Core',
    coreColor: '#2ecc71',
    scene: 'radio',
    glitchTaunt:
      'Bzzzt! I scrambled all your radio messages. Your witnesses can answer, but nobody knows the questions! HA!',
    echoIntro:
      'We have answers from witnesses, but the question words are missing. Find them to fix the radio!',
    stages: [
      {
        kind: 'radio',
        title: 'Fix the witness questions',
        instruction: 'Read the answer. Then choose the right question word for the question.',
        instructionDe: 'Lies die Antwort und wähle das passende Fragewort für die Frage.',
        hints: [
          'Look at the ANSWER: a person → Who · a place → Where · a time → When · a reason (because …) → Why.',
          'a number of things → How many · money / amount → How much · the way you do it → How · a thing → What',
        ],
        team: [
          { slot: 0, task: 'reads the answer.' },
          { slot: 1, task: 'says: is it a person, place, time, thing …?' },
          { slot: 2, task: 'tunes the question word.' },
        ],
      },
      {
        kind: 'frequency',
        title: 'Find the secret frequency',
        instruction: 'Read the message the Glitch sent to his robots. Answer the questions. The numbers are the code!',
        instructionDe: 'Lies die abgefangene Nachricht. Die Zahlen-Antworten ergeben den Funk-Code!',
        hints: [
          'Read carefully – there are MORE numbers in the message than you need.',
          'He took 4 cores. 2 robots are at the gate. They must bring the cores at 9 o\'clock.',
        ],
        team: [
          { slot: 0, task: 'reads the message aloud.' },
          { slot: 1, task: 'finds the numbers.' },
          { slot: 2, task: 'types the code.' },
        ],
      },
    ],
  },
  {
    id: 'gate',
    name: 'The Main Gate',
    nameDe: 'Das Haupttor',
    topic: 'Final mission: everything!',
    core: 'Hero Heart',
    coreColor: '#ff7b00',
    scene: 'gate',
    glitchTaunt:
      "So you have 4 cores. Impressive. But nobody gets past ME! I am THE GLITCH and I don't lose. Never!",
    echoIntro:
      'This is it, heroes! Beat the Glitch with your English power. Take turns – every hero is important!',
    stages: [
      {
        kind: 'boss',
        title: 'Boss fight: The Glitch',
        instruction: 'Take turns! Every correct answer is a hero attack. Bring his energy down to zero!',
        instructionDe: 'Wechselt euch ab! Jede richtige Antwort ist ein Treffer gegen The Glitch.',
        hints: [
          'Check the signal words: yesterday / last → simple past · every day / always → simple present.',
          'he/she/it → -s · after did/didn\'t/does/doesn\'t → infinitive · old/many/much → How',
        ],
        team: [
          { slot: 0, task: 'attacks with question 1, 4, 7 …' },
          { slot: 1, task: 'attacks with question 2, 5, 8 …' },
          { slot: 2, task: 'attacks with question 3, 6, 9 …' },
        ],
      },
      {
        kind: 'finalgate',
        title: 'Open the main gate',
        instruction: 'Fill the gaps. The first letters of the answers make the secret password!',
        instructionDe: 'Fülle die Lücken. Die Anfangsbuchstaben der Lösungen ergeben das Passwort!',
        hints: [
          'The password is a word that every hero squad needs. 4 letters!',
          'tall · else · alone · mistakes → T-E-A-M',
        ],
        team: [
          { slot: 0, task: 'fills gap 1 and 3.' },
          { slot: 1, task: 'fills gap 2 and 4.' },
          { slot: 2, task: 'types the password.' },
        ],
      },
    ],
  },
];

export const TOTAL_STAGES = ROOMS.reduce((s, r) => s + r.stages.length, 0);

export function stageNumber(roomIndex: number, stageIndex: number): number {
  let n = 0;
  for (let i = 0; i < roomIndex; i++) n += ROOMS[i].stages.length;
  return n + stageIndex;
}
