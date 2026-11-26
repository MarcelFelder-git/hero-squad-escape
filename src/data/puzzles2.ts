// New v2 tasks. They practise the FORMATS of the Unit 2 class test
// (listening true/false/not in the text, reading "complete with words from the text",
// simple past questions from prompts, guided writing) – with completely new content.
// As in puzzles.ts: the first option is always the correct one.

/* ---------- Vocab Blitz (multiple choice) ---------- */
export interface BlitzItem {
  word: string;
  options: string[];
}

/** Level 1: English → German (Topic 1 + Unit 2) */
export const BLITZ_EN_DE: BlitzItem[] = [
  { word: 'personality', options: ['die Persönlichkeit', 'die Person', 'der Personalausweis'] },
  { word: 'nobody', options: ['niemand', 'jeder', 'jemand'] },
  { word: '(to) laugh at sb.', options: ['jn. auslachen', 'mit jm. lachen', 'jn. anrufen'] },
  { word: 'tall', options: ['groß (Person)', 'klein', 'stark'] },
  { word: 'braces', options: ['die Zahnspange', 'die Brille', 'die Hosenträger'] },
  { word: 'curly', options: ['lockig', 'glatt', 'kurz'] },
  { word: 'head student', options: ['Schulsprecher/in', 'Schulleiter/in', 'Klassenlehrer/in'] },
  { word: 'yourself', options: ['du/dich selbst', 'dein Freund', 'euer'] },
  { word: 'no one else', options: ['niemand sonst', 'jemand anders', 'alle anderen'] },
  { word: '(to) think of sb.', options: ['an jn. denken', 'jn. vergessen', 'jn. fragen'] },
];

/** Level 7: German → English (Topic 2 + verbs) */
export const BLITZ_DE_EN: BlitzItem[] = [
  { word: 'retten', options: ['(to) save', '(to) hurt', '(to) leave'] },
  { word: 'das Leben', options: ['life', 'live', 'love'] },
  { word: 'unter Wasser', options: ['underwater', 'overwater', 'waterside'] },
  { word: 'verletzen', options: ['(to) hurt', '(to) heal', '(to) marry'] },
  { word: 'heiraten', options: ['(to) marry', '(to) finish', '(to) grow up'] },
  { word: 'aufwachsen', options: ['(to) grow up', '(to) get up', '(to) wake up'] },
  { word: 'beenden', options: ['(to) finish', '(to) begin', '(to) find'] },
  { word: 'jn. in Ruhe lassen', options: ['(to) leave sb. alone', '(to) leave sb. right', '(to) let sb. sleep'] },
  { word: 'der Mond', options: ['moon', 'month', 'mood'] },
  { word: 'die Brille', options: ['glasses', 'braces', 'grasses'] },
];

/* ---------- Spelling lab ---------- */
export const SPELLING: { de: string; en: string }[] = [
  { de: 'stark', en: 'STRONG' },
  { de: 'der Held', en: 'HERO' },
  { de: 'geduldig', en: 'PATIENT' },
  { de: 'der Fehler', en: 'MISTAKE' },
  { de: 'der Mond', en: 'MOON' },
  { de: 'retten', en: 'SAVE' },
];

/* ---------- Hero Radio: the silent interview (no audio – 15 iPads in one room!) ---------- */
export type TFN = 'true' | 'false' | 'not';

export interface InterviewLine {
  /** Echo, the radio host, asks */
  q: string;
  /** the caller's possible answers – the FIRST one is correct */
  options: string[];
}

export interface Interview {
  name: string;
  color: string;
  lines: InterviewLine[];
  statements: { s: string; a: TFN }[];
}

export const INTERVIEWS: Interview[] = [
  {
    name: 'Lily',
    color: '#ff4fa3',
    lines: [
      {
        q: 'Hi Lily! Who is your best friend?',
        options: [
          "My best friend is Omar. He's really funny!",
          "My best friend are Omar. He's really funny!",
          'My best friend is Omar. He really funny!',
        ],
      },
      {
        q: 'What did Omar do last week?',
        options: [
          'I was ill, so he brought me my homework.',
          'I was ill, so he bringed me my homework.',
          'I am ill, so he brings me my homework.',
        ],
      },
      {
        q: 'Did he stay at your house?',
        options: ['Yes, he did. We laughed a lot!', 'Yes, he was. We laughed a lot!', 'Yes, he stayed. We laugh a lot!'],
      },
    ],
    statements: [
      { s: 'Omar is a funny person.', a: 'true' },
      { s: 'Omar brought Lily a cake.', a: 'false' },
    ],
  },
  {
    name: 'Noah',
    color: '#4cc9f0',
    lines: [
      {
        q: 'Hello Noah! Tell us about your best friend.',
        options: [
          'My friend Mia is very sporty. She plays basketball.',
          'My friend Mia is very sporty. She play basketball.',
          'My friend Mia very sporty. She plays basketball.',
        ],
      },
      {
        q: 'Did her team win last weekend?',
        options: ["No, it didn't. But Mia wasn't sad.", "No, it didn't won. But Mia wasn't sad.", "No, it doesn't. But Mia isn't sad."],
      },
      {
        q: 'Why is Mia a good friend?',
        options: [
          "I'm not sporty, but she is always patient with me.",
          "I'm not sporty, but she are always patient with me.",
          "I'm not sporty, but she always is patient with me.",
        ],
      },
    ],
    statements: [
      { s: 'Mia plays basketball.', a: 'true' },
      { s: "Mia's team won last weekend.", a: 'false' },
      { s: 'Mia is very tall.', a: 'not' },
    ],
  },
  {
    name: 'Jamal',
    color: '#ff9f1c',
    lines: [
      {
        q: 'Hi Jamal! What did you do yesterday?',
        options: [
          'I went to the cinema with my friend Zoe.',
          'I goed to the cinema with my friend Zoe.',
          'I go to the cinema with my friend Zoe.',
        ],
      },
      {
        q: 'What did you watch?',
        options: [
          'We watched a superhero film. It was great!',
          'We watch a superhero film. It was great!',
          'We did watched a superhero film. It was great!',
        ],
      },
      {
        q: 'Is Zoe a good friend?',
        options: [
          'Yes! She helps me with my English homework every Monday.',
          'Yes! She help me with my English homework every Monday.',
          'Yes! She is helps me with my English homework every Monday.',
        ],
      },
    ],
    statements: [
      { s: 'Jamal and Zoe went to the cinema yesterday.', a: 'true' },
      { s: 'Zoe helps Jamal with his maths homework.', a: 'false' },
      { s: 'Zoe has a dog.', a: 'not' },
    ],
  },
];

/* ---------- Simple past question machine ---------- */
export interface QuestionItem {
  prompt: string;
  answer: string;
  tiles: string[]; // correct order
  traps: string[];
}

export const QUESTION_ITEMS: QuestionItem[] = [
  {
    prompt: 'where – you – go – last weekend?',
    answer: '– We went to the beach.',
    tiles: ['Where', 'did', 'you', 'go', 'last weekend?'],
    traps: ['went'],
  },
  {
    prompt: 'what – Lena – eat – for breakfast?',
    answer: '– She ate pancakes with honey.',
    tiles: ['What', 'did', 'Lena', 'eat', 'for breakfast?'],
    traps: ['ate', 'does'],
  },
  {
    prompt: 'who – the Glitch – call – yesterday?',
    answer: '– He called his robots.',
    tiles: ['Who', 'did', 'the Glitch', 'call', 'yesterday?'],
    traps: ['called'],
  },
];

/* ---------- Reading in the dark ---------- */
export const STORY_TITLE = "Captain Comet's bad day";
export const STORY: string[] = [
  "Captain Comet is a hero, but last Monday was a terrible day for him. First, his alarm clock didn't ring, so he woke up very late.",
  'He wanted to fly to work, but it was raining and his cape was wet. So he took the bus! On the bus, a little girl looked at him and laughed. "Why are you on a bus? You can fly!" she said. Captain Comet felt silly.',
  'At lunchtime, he wanted to help an old man with his shopping, but he dropped all the eggs. "Oh no!" he said. "I\'m the worst hero in the world."',
  'In the evening, his friend Nova called him. "Don\'t be sad," she said. "Everybody makes mistakes. You saved three people last week, remember? You\'re brave and kind. That\'s what makes a hero." Captain Comet smiled. "You\'re right, Nova. You\'re a real friend."',
];

/** options: the FIRST one is correct (it is also the word that glows in the story) */
export const READING_GAPS: { before: string; after: string; options: string[] }[] = [
  { before: "Captain Comet woke up late because his alarm clock didn't", after: '.', options: ['ring', 'fly', 'smile'] },
  { before: "He couldn't fly because his cape was", after: '.', options: ['wet', 'red', 'new'] },
  { before: 'So he took the', after: '.', options: ['bus', 'train', 'car'] },
  { before: 'A little girl looked at him and', after: '.', options: ['laughed', 'smiled', 'helped'] },
  { before: 'At lunchtime, he dropped all the', after: '.', options: ['eggs', 'apples', 'books'] },
  { before: 'In the evening, his friend', after: 'called him.', options: ['Nova', 'Leo', 'Mia'] },
  { before: 'Nova says: "Everybody makes', after: '."', options: ['mistakes', 'friends', 'pancakes'] },
  { before: 'Nova thinks Captain Comet is brave and', after: '.', options: ['kind', 'funny', 'fast'] },
];

/* ---------- Gap text with word box (one extra word) ---------- */
export type GapPart = string | { answer: string };

export const LETTER: GapPart[] = [
  'Dear Tom, thank you for being my best friend! You are always there for me – you are so ',
  { answer: 'reliable' },
  '. Last month I made a big ',
  { answer: 'mistake' },
  ' in the school play, but ',
  { answer: 'nobody' },
  ' laughed, because you started to sing too! You never ',
  { answer: 'laugh' },
  ' at people. You are ',
  { answer: 'patient' },
  ' when I am slow, and you make me feel ',
  { answer: 'confident' },
  '. You are my ',
  { answer: 'hero' },
  '! Love, Emma',
];
export const LETTER_EXTRA = 'shy';

/* ---------- Hero profile (guided writing) ---------- */
export const HAIR_WORDS: Record<string, string> = {
  '#f4d35e': 'blond',
  '#a0522d': 'brown',
  '#3b2416': 'dark brown',
  '#111111': 'black',
  '#e63946': 'red',
  '#7b2cbf': 'purple',
  '#1e88e5': 'blue',
  '#eeeeee': 'white',
};

export const PERSONALITY = ['reliable', 'patient', 'confident', 'strong', 'hard-working', 'brave', 'kind', 'funny', 'clever', 'fast'];

export const REASONS: Record<'he' | 'she' | 'they', string[]> = {
  he: [
    'always helps other people',
    'is always there for his friends',
    'never laughs at people',
    'saves cats from tall trees',
    'makes everybody feel confident',
    'is a friend of the Glitch now',
  ],
  she: [
    'always helps other people',
    'is always there for her friends',
    'never laughs at people',
    'saves cats from tall trees',
    'makes everybody feel confident',
    'is a friend of the Glitch now',
  ],
  they: [
    'always help other people',
    'are always there for their friends',
    'never laugh at people',
    'save cats from tall trees',
    'make everybody feel confident',
    'are friends of the Glitch now',
  ],
};

/* ---------- QR worksheet (analog part) ---------- */
export const WORKSHEET_STORY_TITLE = 'The night the lights went out';
export const WORKSHEET_STORY = [
  'It was Friday night in Hero City. The heroes were at the Hero HQ and they played board games. Suddenly, all the lights went out!',
  '"Who did that?" asked Lightning Leo. Nobody answered. Then a green face appeared on the big computer screen. It was THE GLITCH!',
  '"Good evening, heroes!" he laughed. "I took your superpowers. Now you are normal people. Ha ha!" Then the screen went black.',
  'The heroes were scared, but Star Girl had an idea. "We aren\'t strong now, but we are friends. Let\'s ask the kids of Hero City for help. They are clever and brave!"',
  'So the heroes wrote a secret code for you. Only real heroes can crack it …',
];

export interface WorksheetTask {
  s: string;
  a: TFN;
}

/** 8 statements → answer A = true, B = false, C = not in the text */
export const WORKSHEET_TASKS: WorksheetTask[] = [
  { s: 'The story happened on a Friday night.', a: 'true' },
  { s: 'The heroes played football at the HQ.', a: 'false' },
  { s: 'Lightning Leo was drinking hot chocolate.', a: 'not' },
  { s: 'The Glitch had a green face.', a: 'true' },
  { s: 'The Glitch took the superpowers.', a: 'true' },
  { s: 'After that, the heroes were very strong.', a: 'false' },
  { s: 'Star Girl is the head student of Hero School.', a: 'not' },
  { s: 'Star Girl wanted to ask the kids of Hero City for help.', a: 'true' },
];

/** text inside the QR code – uppercase so it fits the small alphanumeric QR mode */
export const QR_TEXT = 'HTTPS://HERO-SQUAD-ESCAPE.VERCEL.APP/HERO';
