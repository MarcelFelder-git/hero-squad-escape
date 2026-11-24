import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { WIRE_PAIRS } from '../data/puzzles';
import { shuffle } from '../components/ui';
import { sfx } from '../audio/sound';

const WIRE_COLORS = ['#ff006e', '#ffd60a', '#4cc9f0', '#39ff14', '#ff7b00', '#c77dff'];

type Sel = { side: 'en' | 'de'; i: number } | null;

export function WireMatch({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const right = useMemo(() => shuffle(WIRE_PAIRS.map((p, i) => ({ de: p.de, i }))), []);
  const [matched, setMatched] = useState<number[]>([]); // pair indices in match order
  const [sel, setSel] = useState<Sel>(null);
  const [bad, setBad] = useState<string | null>(null);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; c: string }[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const enRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const deRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const colorOf = (pair: number) => WIRE_COLORS[matched.indexOf(pair) % WIRE_COLORS.length];

  useLayoutEffect(() => {
    const calc = () => {
      const b = box.current?.getBoundingClientRect();
      if (!b) return;
      setLines(
        matched.map((pair) => {
          const l = enRefs.current[pair]!.getBoundingClientRect();
          const r = deRefs.current[right.findIndex((x) => x.i === pair)]!.getBoundingClientRect();
          return {
            x1: l.right - b.left,
            y1: l.top + l.height / 2 - b.top,
            x2: r.left - b.left,
            y2: r.top + r.height / 2 - b.top,
            c: WIRE_COLORS[matched.indexOf(pair) % WIRE_COLORS.length],
          };
        }),
      );
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [matched, right]);

  const tryMatch = (enIdx: number, deListIdx: number) => {
    const pair = right[deListIdx].i;
    if (pair === enIdx) {
      const next = [...matched, pair];
      setMatched(next);
      setSel(null);
      onCorrect();
      if (next.length === WIRE_PAIRS.length) onSolved();
    } else {
      setBad(`${enIdx}-${deListIdx}`);
      setSel(null);
      onWrong();
      setTimeout(() => setBad(null), 600);
    }
  };

  const tapEn = (i: number) => {
    if (matched.includes(i)) return;
    sfx.select();
    if (sel?.side === 'de') return tryMatch(i, sel.i);
    setSel(sel?.side === 'en' && sel.i === i ? null : { side: 'en', i });
  };
  const tapDe = (j: number) => {
    if (matched.includes(right[j].i)) return;
    sfx.select();
    if (sel?.side === 'en') return tryMatch(sel.i, j);
    setSel(sel?.side === 'de' && sel.i === j ? null : { side: 'de', i: j });
  };

  return (
    <div className="wires" ref={box}>
      <svg className="wire-layer" aria-hidden="true">
        {lines.map((l, k) => (
          <g key={k}>
            <path
              d={`M${l.x1},${l.y1} C${(l.x1 + l.x2) / 2},${l.y1} ${(l.x1 + l.x2) / 2},${l.y2} ${l.x2},${l.y2}`}
              stroke="#141018"
              strokeWidth={11}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M${l.x1},${l.y1} C${(l.x1 + l.x2) / 2},${l.y1} ${(l.x1 + l.x2) / 2},${l.y2} ${l.x2},${l.y2}`}
              stroke={l.c}
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              className="wire-draw"
            />
          </g>
        ))}
      </svg>
      <div className="wire-col">
        <div className="wire-col-head">🇬🇧 English</div>
        {WIRE_PAIRS.map((p, i) => {
          const done = matched.includes(i);
          return (
            <button
              key={p.en}
              ref={(el) => {
                enRefs.current[i] = el;
              }}
              className={`wire-node left ${done ? 'done' : ''} ${sel?.side === 'en' && sel.i === i ? 'sel' : ''} ${bad?.startsWith(`${i}-`) ? 'bad' : ''}`}
              style={done ? { borderColor: colorOf(i), boxShadow: `4px 4px 0 ${colorOf(i)}` } : undefined}
              onClick={() => tapEn(i)}
            >
              <span>{p.en}</span>
              <span className="plug" style={done ? { background: colorOf(i) } : undefined} />
            </button>
          );
        })}
      </div>
      <div className="wire-gap" />
      <div className="wire-col">
        <div className="wire-col-head">🇩🇪 Deutsch</div>
        {right.map((r, j) => {
          const done = matched.includes(r.i);
          return (
            <button
              key={r.de}
              ref={(el) => {
                deRefs.current[j] = el;
              }}
              className={`wire-node right ${done ? 'done' : ''} ${sel?.side === 'de' && sel.i === j ? 'sel' : ''} ${bad?.endsWith(`-${j}`) ? 'bad' : ''}`}
              style={done ? { borderColor: colorOf(r.i), boxShadow: `4px 4px 0 ${colorOf(r.i)}` } : undefined}
              onClick={() => tapDe(j)}
            >
              <span className="plug" style={done ? { background: colorOf(r.i) } : undefined} />
              <span>{r.de}</span>
            </button>
          );
        })}
      </div>
      <div className="wire-status">
        Scanner power: {matched.length}/{WIRE_PAIRS.length}
        <div className="meter">
          <div style={{ width: `${(matched.length / WIRE_PAIRS.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
