import { useMemo, useRef, useState, type PointerEvent } from 'react';
import type { PuzzleProps } from '../game/types';
import { READING_GAPS, STORY, STORY_TITLE } from '../data/puzzles2';
import { sfx } from '../audio/sound';
import { shuffle } from '../components/ui';

const norm = (w: string) => w.toLowerCase().replace(/[^a-z']/g, '').replace(/'s$/, '');

/** key of the first word in the story that matches the answer – it glows once it is found */
const WORD_KEY = READING_GAPS.map((gp) => {
  for (let pi = 0; pi < STORY.length; pi++) {
    const wi = STORY[pi].split(' ').findIndex((w) => norm(w) === norm(gp.options[0]));
    if (wi >= 0) return `${pi}-${wi}`;
  }
  return '';
});

/** Reading in the dark: the finger is a torch; the missing word is chosen from 3 – every right answer switches a light on. */
export function LightsOut({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [g, setG] = useState(0);
  const [bad, setBad] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 30 });
  const box = useRef<HTMLDivElement>(null);
  const done = g >= READING_GAPS.length;
  const gap = READING_GAPS[Math.min(g, READING_GAPS.length - 1)];
  const radius = Math.min(110 + misses * 15, 200);
  const options = useMemo(() => shuffle(gap.options), [gap]);
  const found = WORD_KEY.slice(0, g);

  const move = (e: PointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const choose = (o: string) => {
    if (done || bad.includes(o)) return;
    if (o === gap.options[0]) {
      onCorrect();
      setBad([]);
      const n = g + 1;
      setG(n);
      if (n >= READING_GAPS.length) {
        sfx.unlock();
        onSolved();
      }
    } else {
      setBad([...bad, o]);
      setMisses((m) => m + 1);
      onWrong();
    }
  };

  return (
    <div className="lights-out">
      <div className="gap-card">
        <div className="bulbs" aria-label={`${g} of ${READING_GAPS.length} lights on`}>
          {READING_GAPS.map((_, k) => (
            <span key={k} className={`bulb ${k < g ? 'on' : ''}`}>💡</span>
          ))}
        </div>
        {!done ? (
          <>
            <p className="gap-sentence pop-in" key={g}>
              {gap.before} <span className="gap-blank">_____</span> {gap.after}
            </p>
            <div className="gap-options" key={`o-${g}`}>
              {options.map((o) => (
                <button key={o} className={`gap-opt ${bad.includes(o) ? 'bad' : ''}`} onClick={() => choose(o)}>
                  {o}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="gap-sentence">💡 The lights are back on! Great reading, heroes!</p>
        )}
      </div>

      <div
        ref={box}
        className={`story-box ${done ? 'lit' : ''}`}
        onPointerMove={move}
        onPointerDown={move}
        style={{
          ['--x' as string]: `${pos.x}%`,
          ['--y' as string]: `${pos.y}%`,
          ['--r' as string]: `${radius}px`,
          ['--dark' as string]: String(0.93 - g * 0.025),
        }}
      >
        <h3 className="story-title">{STORY_TITLE}</h3>
        {STORY.map((p, pi) => (
          <p key={pi}>
            {p.split(' ').map((w, wi) => {
              const key = `${pi}-${wi}`;
              return (
                <span key={key}>
                  <span className={`story-word ${found.includes(key) ? 'found' : ''}`}>{w}</span>{' '}
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
