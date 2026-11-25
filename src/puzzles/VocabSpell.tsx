import { useMemo, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { SPELLING } from '../data/puzzles2';
import { SpeakButton, shuffle } from '../components/ui';
import { speak } from '../audio/speech';

const DECOYS = 'AEIOURSTLNMDKBY';

export function VocabSpell({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [w, setW] = useState(0);
  const [typed, setTyped] = useState(0);
  const [used, setUsed] = useState<number[]>([]);
  const [wrongTile, setWrongTile] = useState<number | null>(null);
  const [mistakesHere, setMistakesHere] = useState(0);
  const done = w >= SPELLING.length;
  const item = SPELLING[Math.min(w, SPELLING.length - 1)];

  const tiles = useMemo(() => {
    const letters = item.en.split('');
    const extra: string[] = [];
    while (extra.length < 2) {
      const c = DECOYS[Math.floor(Math.random() * DECOYS.length)];
      if (!extra.includes(c)) extra.push(c);
    }
    return shuffle([...letters, ...extra]);
  }, [item]);

  const tap = (k: number) => {
    if (used.includes(k) || done) return;
    const want = item.en[typed];
    if (tiles[k] === want) {
      const nt = typed + 1;
      setUsed([...used, k]);
      setTyped(nt);
      if (nt === item.en.length) {
        onCorrect(mistakesHere === 0 ? 15 : 10);
        speak(item.en.toLowerCase());
        setTimeout(() => {
          const n = w + 1;
          setW(n);
          setTyped(0);
          setUsed([]);
          setMistakesHere(0);
          if (n >= SPELLING.length) onSolved();
        }, 900);
      }
    } else {
      setWrongTile(k);
      setMistakesHere((m) => m + 1);
      onWrong();
      setTimeout(() => setWrongTile(null), 450);
    }
  };

  if (done) return <div className="explain big pop-in">🔤 Super spelling! All words are correct.</div>;

  return (
    <div className="spell">
      <div className="dots">
        {SPELLING.map((_, k) => (
          <i key={k} className={k < w ? 'done' : k === w ? 'now' : ''} />
        ))}
      </div>
      <div className="spell-de pop-in" key={w}>
        <span className="muted small">German:</span> <b>{item.de}</b>
        <SpeakButton text={item.en.toLowerCase()} small />
      </div>
      <div className="spell-slots">
        {item.en.split('').map((c, k) => (
          <span key={k} className={`slot ${k < typed ? 'filled' : k === typed ? 'next' : ''}`}>
            {k < typed ? c : ''}
          </span>
        ))}
      </div>
      <div className="letter-pool">
        {tiles.map((c, k) => (
          <button
            key={`${w}-${k}`}
            className={`letter ${used.includes(k) ? 'used' : ''} ${wrongTile === k ? 'wrong' : ''}`}
            onClick={() => tap(k)}
            disabled={used.includes(k)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
