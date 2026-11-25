import { useMemo, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { LETTER, LETTER_EXTRA } from '../data/puzzles2';
import { shuffle } from '../components/ui';

const GAPS = LETTER.map((p, i) => (typeof p === 'string' ? null : { i, answer: p.answer })).filter(Boolean) as { i: number; answer: string }[];

export function GapText({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const words = useMemo(() => shuffle([...GAPS.map((g) => g.answer), LETTER_EXTRA]), []);
  const [filled, setFilled] = useState<Record<number, string>>({});
  const [active, setActive] = useState(GAPS[0].i);
  const [badWord, setBadWord] = useState<string | null>(null);
  const done = Object.keys(filled).length === GAPS.length;

  const pickWord = (w: string) => {
    if (done || Object.values(filled).includes(w)) return;
    const gap = GAPS.find((g) => g.i === active);
    if (!gap) return;
    if (gap.answer === w) {
      const next = { ...filled, [active]: w };
      setFilled(next);
      onCorrect();
      const open = GAPS.find((g) => !next[g.i]);
      if (open) setActive(open.i);
      else onSolved();
    } else {
      setBadWord(w);
      onWrong();
      setTimeout(() => setBadWord(null), 500);
    }
  };

  return (
    <div className="gaptext">
      <div className="word-box">
        <span className="word-box-label">Word box</span>
        {words.map((w) => {
          const used = Object.values(filled).includes(w);
          return (
            <button
              key={w}
              className={`chip chip-big ${used ? 'chip-used' : ''} ${badWord === w ? 'chip-bad' : ''} ${done && w === LETTER_EXTRA ? 'chip-extra' : ''}`}
              disabled={used || done}
              onClick={() => pickWord(w)}
            >
              {w}
            </button>
          );
        })}
      </div>
      <div className="letter-paper">
        {LETTER.map((p, i) =>
          typeof p === 'string' ? (
            <span key={i}>{p}</span>
          ) : (
            <button
              key={i}
              className={`gap ${filled[i] ? 'gap-filled' : ''} ${active === i && !filled[i] ? 'gap-active' : ''}`}
              onClick={() => !filled[i] && setActive(i)}
            >
              {filled[i] ?? '______'}
            </button>
          ),
        )}
      </div>
      {done && (
        <div className="explain pop-in">
          ✉️ Perfect letter! The extra word was <b>{LETTER_EXTRA}</b> (schüchtern).
        </div>
      )}
    </div>
  );
}
