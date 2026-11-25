import { useMemo, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { QUESTION_ITEMS } from '../data/puzzles2';
import { shuffle } from '../components/ui';
import { speak } from '../audio/speech';

export function QuestionMachine({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [q, setQ] = useState(0);
  const [placed, setPlaced] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const done = q >= QUESTION_ITEMS.length;
  const item = QUESTION_ITEMS[Math.min(q, QUESTION_ITEMS.length - 1)];
  const pool = useMemo(() => shuffle([...item.tiles, ...item.traps]), [item]);

  const tap = (k: number) => {
    if (placed.includes(k) || complete) return;
    const want = item.tiles[placed.length];
    if (pool[k] === want) {
      const np = [...placed, k];
      setPlaced(np);
      if (np.length === item.tiles.length) {
        setComplete(true);
        onCorrect(15);
        speak(item.tiles.join(' '));
        setTimeout(() => {
          const n = q + 1;
          setQ(n);
          setPlaced([]);
          setComplete(false);
          if (n >= QUESTION_ITEMS.length) onSolved();
        }, 1600);
      }
    } else {
      setWrong(k);
      onWrong();
      setTimeout(() => setWrong(null), 450);
    }
  };

  if (done) return <div className="explain big pop-in">❓ The question machine works again!</div>;

  return (
    <div className="qmachine">
      <div className="dots">
        {QUESTION_ITEMS.map((_, k) => (
          <i key={k} className={k < q ? 'done' : k === q ? 'now' : ''} />
        ))}
      </div>
      <div className="qm-card pop-in" key={q}>
        <div className="qm-prompt">
          <span className="muted small">Words:</span> {item.prompt}
        </div>
        <div className="bubble bubble-echo qm-answer">{item.answer}</div>
      </div>
      <div className={`build-line ${complete ? 'build-done' : ''}`}>
        {placed.length === 0 && <span className="placeholder">Tap the words …</span>}
        {placed.map((k) => (
          <span key={k} className="tile tile-in">
            {pool[k]}
          </span>
        ))}
      </div>
      <div className="tile-pool">
        {pool.map((t, k) => (
          <button
            key={`${q}-${k}`}
            className={`tile ${placed.includes(k) ? 'used' : ''} ${wrong === k ? 'wrong' : ''}`}
            onClick={() => tap(k)}
            disabled={placed.includes(k)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
