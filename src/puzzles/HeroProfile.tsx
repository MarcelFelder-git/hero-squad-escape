import { useMemo, useState } from 'react';
import type { Hero, Pronoun, PuzzleProps } from '../game/types';
import { HAIR_WORDS, PERSONALITY, REASONS } from '../data/puzzles2';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { shuffle } from '../components/ui';
import { speak } from '../audio/speech';
import { sfx } from '../audio/sound';

type SlotId = 'pron' | 'have' | 'style' | 'color' | 'be' | 'adj1' | 'adj2' | 'reason';

interface Slot {
  id: SlotId;
  label: string;
  options: string[];
  /** correct answer – undefined = free choice */
  correct?: string;
  why?: string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function hairColorWord(hex: string) {
  return HAIR_WORDS[hex.toLowerCase()] ?? 'dark';
}

function buildSlots(hero: Hero, pron: Pronoun | undefined, picks: Partial<Record<SlotId, string>>): Slot[] {
  const p = pron ?? 'he';
  const third = p !== 'they';
  const colorWord = hairColorWord(hero.look.hair);
  const otherColors = Object.values(HAIR_WORDS).filter((c) => c !== colorWord);
  return [
    { id: 'pron', label: 'he / she / they?', options: ['he', 'she', 'they'] },
    {
      id: 'have',
      label: 'has or have?',
      options: ['has', 'have'],
      correct: third ? 'has' : 'have',
      why: third ? 'he / she → has' : 'they → have',
    },
    {
      id: 'style',
      label: 'Look at the picture: what hair?',
      options: ['curly', 'straight', 'spiky', 'short'],
      correct: hero.look.hairStyle,
      why: 'Look at your hero picture!',
    },
    {
      id: 'color',
      label: 'Which colour?',
      options: [colorWord, otherColors[0], otherColors[3]],
      correct: colorWord,
      why: 'Look at the hair colour!',
    },
    { id: 'be', label: 'is or are?', options: ['is', 'are'], correct: third ? 'is' : 'are', why: third ? 'he / she → is' : 'they → are' },
    { id: 'adj1', label: 'Personality 1', options: PERSONALITY },
    { id: 'adj2', label: 'Personality 2', options: PERSONALITY.filter((a) => a !== picks.adj1) },
    { id: 'reason', label: 'Why is your hero special?', options: REASONS[p] },
  ];
}

function profileText(hero: Hero, picks: Partial<Record<SlotId, string>>, extra: string) {
  const P = cap(picks.pron ?? 'he');
  const p = picks.pron ?? '…';
  const s = [
    `This is ${hero.name}.`,
    `${P} ${picks.have ?? '…'} ${picks.style ?? '…'} ${picks.color ?? '…'} hair.`,
    `${P} ${picks.be ?? '…'} ${picks.adj1 ?? '…'} and ${picks.adj2 ?? '…'}.`,
    `${P} ${picks.be ?? '…'} a hero because ${p} ${picks.reason ?? '…'}.`,
  ];
  if (extra.trim()) s.push(extra.trim());
  return s.join(' ');
}

type Part = string | { id: SlotId; cap?: boolean };
const partsFor = (name: string): Part[] => [
  `This is ${name}. `,
  { id: 'pron', cap: true }, ' ', { id: 'have' }, ' ', { id: 'style' }, ' ', { id: 'color' }, ' hair. ',
  { id: 'pron', cap: true }, ' ', { id: 'be' }, ' ', { id: 'adj1' }, ' and ', { id: 'adj2' }, '. ',
  { id: 'pron', cap: true }, ' ', { id: 'be' }, ' a hero because ', { id: 'pron' }, ' ', { id: 'reason' }, '.',
];

function ProfilePreview({ name, picks, current, extra }: { name: string; picks: Partial<Record<SlotId, string>>; current?: SlotId; extra: string }) {
  return (
    <p className="profile-text">
      {partsFor(name).map((pt, i) => {
        if (typeof pt === 'string') return <span key={i}>{pt}</span>;
        const v = picks[pt.id];
        if (v) return <b key={i} className="pfill">{pt.cap ? cap(v) : v}</b>;
        return <span key={i} className={`pslot ${current === pt.id ? 'now' : ''}`}>_____</span>;
      })}
      {extra.trim() && <span> {extra.trim()}</span>}
    </p>
  );
}

/** Guided writing: every hero gets a short profile (like the writing task in the class test). */
export function HeroProfile({ heroes, gear, onCorrect, onWrong, onSolved, updateHero }: PuzzleProps) {
  const [h, setH] = useState(0);
  const [picks, setPicks] = useState<Partial<Record<SlotId, string>>>({});
  const [bad, setBad] = useState<string[]>([]);
  const [why, setWhy] = useState<string | null>(null);
  const [extra, setExtra] = useState('');
  const hero = heroes[Math.min(h, heroes.length - 1)];
  const slots = buildSlots(hero, picks.pron as Pronoun | undefined, picks);
  const current = slots.find((s) => !picks[s.id]);
  const options = useMemo(
    () => (current && current.correct ? shuffle(current.options) : current?.options ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current?.id, h],
  );

  const pick = (o: string) => {
    if (!current || bad.includes(o)) return;
    if (current.correct && o !== current.correct) {
      setBad([...bad, o]);
      setWhy(current.why ?? null);
      onWrong();
      return;
    }
    if (current.correct) onCorrect();
    else sfx.select();
    setBad([]);
    setWhy(null);
    setPicks({ ...picks, [current.id]: o });
  };

  const finish = () => {
    const text = profileText(hero, picks, extra);
    updateHero?.(h, { ...hero, profile: text });
    onCorrect(20);
    speak(text);
    if (h + 1 < heroes.length) {
      setH(h + 1);
      setPicks({});
      setExtra('');
    } else {
      onSolved();
    }
  };


  return (
    <div className="profile-writer">
      <div className="profile-card pop-in" key={h}>
        <HeroAvatar hero={hero} gear={gear} className="profile-avatar" />
        <div className="profile-paper">
          <div className="profile-head">
            ✍️ Hero profile {heroes.length > 1 && <span className="muted small">({h + 1}/{heroes.length})</span>}
          </div>
          <ProfilePreview name={hero.name} picks={picks} current={current?.id} extra={extra} />
        </div>
      </div>

      {current ? (
        <div className="slot-picker">
          <div className="slot-label">{current.label}</div>
          <div className="chip-row">
            {options.map((o) => (
              <button key={o} className={`chip chip-big ${bad.includes(o) ? 'chip-bad' : ''}`} onClick={() => pick(o)}>
                {o}
              </button>
            ))}
          </div>
          {why && <div className="feedback-line bad">💡 {why}</div>}
        </div>
      ) : (
        <div className="slot-picker">
          <div className="slot-label">One more sentence? (optional)</div>
          <input
            className="input"
            value={extra}
            maxLength={90}
            placeholder={`e.g. ${cap(picks.pron ?? 'he')} ${picks.pron === 'they' ? 'love' : 'loves'} pizza.`}
            onChange={(e) => setExtra(e.target.value)}
            autoCorrect="off"
          />
          <button className="btn btn-big btn-yellow" onClick={finish}>
            {h + 1 < heroes.length ? `✔ Next hero: ${heroes[h + 1].name} →` : '✔ Profile ready!'}
          </button>
        </div>
      )}
    </div>
  );
}
