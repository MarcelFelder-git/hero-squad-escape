// Vocabulary list (Unit 2 "Friends and heroes", Topic 1 + Topic 2, irregular verbs)
export interface VocabEntry {
  en: string;
  de: string;
  example?: string;
}

export interface VocabGroup {
  title: string;
  entries: VocabEntry[];
}

export const VOCAB: VocabGroup[] = [
  {
    title: 'Unit 2: Friends and heroes',
    entries: [
      { en: 'hero, pl heroes', de: 'der Held, die Heldin', example: "She always helps others. She's a hero!" },
      { en: 'head student', de: 'der/die Vertrauensschüler/in; Schulsprecher/in' },
      { en: 'hair', de: 'das Haar, die Haare', example: 'Your hair is black. (nicht: are!)' },
      { en: 'braces (pl)', de: 'die Zahnspange', example: 'A lot of kids wear braces.' },
      { en: 'glasses (pl)', de: 'die Brille', example: 'I need my glasses. Where are they?' },
      { en: 'sunglasses (pl)', de: 'die Sonnenbrille' },
      { en: 'curly', de: 'lockig', example: 'He has curly hair.' },
      { en: 'curl', de: 'die Locke' },
      { en: 'straight', de: 'gerade; (Haare) glatt', example: 'She has straight hair.' },
      { en: 'blond', de: 'blond', example: 'They have blond hair.' },
      { en: 'mistake', de: 'der Fehler', example: 'There are some mistakes in your text.' },
      { en: 'by mistake', de: 'aus Versehen' },
      { en: '(to) cut sth. out, simple past: cut', de: 'etwas ausschneiden; weglassen' },
    ],
  },
  {
    title: 'Topic 1',
    entries: [
      { en: 'hard-working', de: 'fleißig', example: 'working a lot and trying to do your job well' },
      { en: 'confident', de: '(selbst)sicher; zuversichtlich', example: "I'm confident that my test went well." },
      { en: '(to) make sb. do sth.', de: 'jn. dazu bringen, etwas zu tun', example: 'Music always makes me feel good.' },
      { en: '(to) laugh (at)', de: 'lachen (über)', example: "It's not fair to laugh at him." },
      { en: 'strong', de: 'stark' },
      { en: 'tall', de: 'groß (Person); hoch (Gebäude)', example: 'tall ◄► short' },
      { en: 'reliable', de: 'verlässlich, zuverlässig', example: "My best friend is very reliable. She's always there for me." },
      { en: 'patient', de: 'geduldig', example: 'patient ◄► impatient' },
      { en: 'shy', de: 'scheu, schüchtern', example: 'shy ◄► confident' },
      { en: 'personality', de: 'die Persönlichkeit; der Charakter' },
      { en: 'yourself', de: 'du/dir/dich (selbst)', example: 'Write a short text about yourself.' },
      { en: 'no one / nobody', de: 'niemand', example: 'No one is at home.' },
      { en: 'no one else', de: 'niemand anders, niemand sonst' },
      { en: 'everybody else', de: 'alle anderen', example: 'Why can\'t I have a pet? Everybody else has a pet.' },
      { en: 'somebody else', de: 'jemand anders' },
      { en: 'What else …?', de: 'Was (sonst) noch …?' },
      { en: '(to) think of sb./sth.', de: 'an jn./etwas denken' },
      { en: 'right', de: 'rechts; richtig' },
      { en: 'left', de: 'links' },
      { en: 'on the right / on the left', de: 'rechts / links, auf der rechten / linken Seite' },
      { en: 'moon', de: 'der Mond', example: 'the moon over the sea' },
    ],
  },
  {
    title: 'Topic 2',
    entries: [
      { en: '(to) save', de: 'retten; sparen; sichern (Daten)', example: "There's a cat in the water! Can we save it?" },
      { en: 'life, pl lives', de: 'das Leben', example: 'one life – nine lives' },
      { en: 'underwater', de: 'unter Wasser, Unterwasser-' },
      { en: '(to) hurt, simple past: hurt', de: 'verletzen; wehtun', example: 'I hurt my hand on a knife.' },
      { en: '(to) leave, simple past: left', de: 'lassen; verlassen; zurücklassen', example: 'Many people left the village.' },
      { en: '(to) leave sb. alone', de: 'jn. allein lassen; jn. in Ruhe lassen', example: 'Just go away and leave me alone!' },
      { en: '(to) marry', de: 'heiraten', example: 'Jack married Alex in May.' },
      { en: '(to) grow up, simple past: grew up', de: 'aufwachsen', example: 'My grandfather grew up on a small farm.' },
      { en: 'who', de: 'wer? wen? wem?', example: 'Who helps you with your homework?' },
      { en: '(to) finish', de: 'enden; beenden', example: 'School finishes at 15.05.' },
    ],
  },
  {
    title: 'Irregular verbs (Simple past)',
    entries: [
      { en: 'be – was/were', de: 'sein' },
      { en: 'begin – began', de: 'beginnen' },
      { en: 'buy – bought', de: 'kaufen' },
      { en: 'cut – cut', de: 'schneiden' },
      { en: 'do – did', de: 'machen, tun' },
      { en: 'eat – ate', de: 'essen' },
      { en: 'get – got', de: 'bekommen; holen; gelangen' },
      { en: 'go – went', de: 'gehen, fahren' },
      { en: 'hang out – hung out', de: 'rumhängen' },
      { en: 'have – had', de: 'haben' },
      { en: 'hear – heard', de: 'hören' },
      { en: 'make – made', de: 'machen, herstellen' },
      { en: 'put – put', de: 'legen, stellen' },
      { en: 'ride – rode', de: '(Rad) fahren; reiten' },
      { en: 'say – said', de: 'sagen' },
      { en: 'see – saw', de: 'sehen' },
      { en: 'sleep – slept', de: 'schlafen' },
      { en: 'swim – swam', de: 'schwimmen' },
      { en: 'take – took', de: '(mit)nehmen' },
      { en: 'tell – told', de: 'erzählen' },
      { en: 'think – thought', de: 'denken' },
      { en: 'wear – wore', de: 'tragen, anhaben' },
      { en: 'hurt – hurt', de: 'verletzen; wehtun' },
      { en: 'leave – left', de: 'verlassen' },
      { en: 'grow up – grew up', de: 'aufwachsen' },
    ],
  },
  {
    title: 'Grammar Power-Ups',
    entries: [
      { en: 'Simple present: he/she/it + -s', de: 'He helps. She wears glasses. It flies.' },
      { en: "Simple present: don't / doesn't + Infinitiv", de: "I don't laugh. He doesn't go. (nicht: doesn't goes!)" },
      { en: 'Simple present: Do / Does …?', de: 'Do you help? Does she wear braces? (nicht: Does she wears?)' },
      { en: 'Simple past: regular + -ed', de: 'help → helped, save → saved, laugh → laughed' },
      { en: "Simple past: didn't + Infinitiv", de: "I didn't see him. (nicht: didn't saw!)" },
      { en: 'Simple past: Did …? + Infinitiv', de: 'Did you hear the alarm? (nicht: Did you heard?)' },
      { en: 'Who? What? Where? When?', de: 'Wer? Was? Wo/Wohin? Wann?' },
      { en: 'Why? How? How many? How much?', de: 'Warum? Wie? Wie viele? Wie viel?' },
    ],
  },
];
