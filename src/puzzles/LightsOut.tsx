import { useRef, useState, type PointerEvent } from 'react';
import type { PuzzleProps } from '../game/types';
import { READING_GAPS, STORY, STORY_TITLE } from '../data/puzzles2';
import { sfx } from '../audio/sound';

const norm = (w: string) => w.toLowerCase().replace(/[^a-z']/g, '').replace(/'s$/, '');

/** Reading in the dark: the finger is a torch, the missing words are tapped in the story. */
export function LightsOut({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [g, setG] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 30 });
  const box = useRef<HTMLDivElement>(null);
  const done = g >= READING_GAPS.length;
  const gap = READING_GAPS[Math.min(g, READING_GAPS.length - 1)];
  const radius = Math.min(110 + misses * 15, 200);

  const move = (e: PointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const tapWord = (word: string, key: string) => {
    if (done) return;
    if (norm(word) === norm(gap.answer)) {
      setFound([...found, key]);
      onCorrect();
      const n = g + 1;
      setG(n);
      if (n >= READING_GAPS.length) {
        sfx.unlock();
        onSolved();
      }
    } else {
      setWrongKey(key);
      setMisses((m) => m + 1);
      onWrong();
      setTimeout(() => setWrongKey(null), 500);
    }
  };

  return (
    <div className="lights-out">
      <div className="gap-card">
        <div className="dots">
          {READING_GAPS.map((_, k) => (
            <i key={k} className={k < g ? 'done' : k === g ? 'now' : ''} />
          ))}
        </div>
        {!done ? (
          <p className="gap-sentence pop-in" key={g}>
            {gap.before} <span className="gap-blank">_____</span> {gap.after}
          </p>
        ) : (
          <p className="gap-sentence">💡 The lights are back on! Great reading, heroes!</p>
        )}
      </div>

      <div
        ref={box}
        className={`story-box ${done ? 'lit' : ''}`}
        onPointerMove={move}
        onPointerDown={move}
        style={{ ['--x' as string]: `${pos.x}%`, ['--y' as string]: `${pos.y}%`, ['--r' as string]: `${radius}px` }}
      >
        <h3 className="story-title">{STORY_TITLE}</h3>
        {STORY.map((p, pi) => (
          <p key={pi}>
            {p.split(' ').map((w, wi) => {
              const key = `${pi}-${wi}`;
              return (
                <span key={key}>
                  <button
                    className={`story-word ${found.includes(key) ? 'found' : ''} ${wrongKey === key ? 'wrong' : ''}`}
                    onClick={() => tapWord(w, key)}
                  >
                    {w}
                  </button>{' '}
                </span>
              );
            })}
          </p>
        ))}
        {!done && <div className="torch-mask" aria-hidden="true" />}
      </div>
    </div>
  );
}
