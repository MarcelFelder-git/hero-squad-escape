import { useMemo, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { BUILDER_SENTENCES } from '../data/puzzles';
import { SpeakButton, shuffle } from '../components/ui';
import { sfx } from '../audio/sound';

interface Tile {
  id: number;
  text: string;
  trap: boolean;
}

export function SentenceBuilder({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [i, setI] = useState(0);
  const s = BUILDER_SENTENCES[i];
  const tiles = useMemo<Tile[]>(
    () => shuffle([...s.tiles.map((t, k) => ({ id: k, text: t, trap: false })), { id: 99, text: s.trap, trap: true }]),
    [s],
  );
  const [line, setLine] = useState<number[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const byId = (id: number) => tiles.find((t) => t.id === id)!;
  const add = (id: number) => {
    if (done) return;
    sfx.click();
    setMsg(null);
    setLine([...line, id]);
  };
  const remove = (id: number) => {
    if (done) return;
    sfx.click();
    setMsg(null);
    setLine(line.filter((x) => x !== id));
  };

  const check = () => {
    const built = line.map((id) => byId(id).text).join(' ');
    if (built === s.tiles.join(' ')) {
      setDone(true);
      setMsg(null);
      onCorrect(15);
      setTimeout(() => {
        if (i + 1 < BUILDER_SENTENCES.length) {
          setI(i + 1);
          setLine([]);
          setDone(false);
        } else onSolved();
      }, 1800);
    } else {
      onWrong();
      if (line.some((id) => byId(id).trap)) setMsg('⚠️ The trap block is in your sentence! Tap it to take it out.');
      else if (line.length < s.tiles.length) setMsg('Not finished yet – some words are missing.');
      else setMsg('The order is not right yet. Try again!');
    }
  };

  return (
    <div className="builder">
      <div className="builder-head">
        <span className="builder-label">
          Sentence {i + 1}/{BUILDER_SENTENCES.length}: <b>{s.label}</b>
        </span>
        <span className="de small">„{s.translation}“</span>
      </div>

      <div className={`build-line ${done ? 'build-done' : ''}`}>
        {line.length === 0 && <span className="placeholder">Tap the blocks below …</span>}
        {line.map((id) => (
          <button key={id} className={`tile tile-in ${done ? 'tile-ok' : ''}`} onClick={() => remove(id)}>
            {byId(id).text}
          </button>
        ))}
        {done && <SpeakButton text={s.tiles.join(' ')} small />}
      </div>

      <div className="tile-pool">
        {tiles
          .filter((t) => !line.includes(t.id))
          .map((t) => (
            <button key={t.id} className="tile" onClick={() => add(t.id)}>
              {t.text}
            </button>
          ))}
      </div>

      {msg && <div className="feedback-line bad">{msg}</div>}
      {done && <div className="explain pop-in">⚡ POWER ON! Sentence {i + 1} is correct.</div>}

      <div className="row-btns">
        <button className="btn btn-ghost" disabled={done || line.length === 0} onClick={() => { sfx.click(); setLine([]); setMsg(null); }}>
          ↻ Clear
        </button>
        <button className="btn btn-yellow" disabled={done || line.length === 0} onClick={check}>
          ⚡ Check sentence
        </button>
      </div>
    </div>
  );
}
