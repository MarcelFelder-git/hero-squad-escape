import { useMemo, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { VAULT_DIALS } from '../data/puzzles';
import { shuffle } from '../components/ui';
import { sfx } from '../audio/sound';

export function VerbVault({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const opts = useMemo(() => VAULT_DIALS.map((d) => shuffle(d.options)), []);
  // start every dial on a wrong form
  const [pos, setPos] = useState<number[]>(() => opts.map((o, k) => (o[0] === VAULT_DIALS[k].options[0] ? 1 : 0)));
  const [locked, setLocked] = useState<boolean[]>(() => VAULT_DIALS.map(() => false));
  const [wrong, setWrong] = useState<boolean[]>(() => VAULT_DIALS.map(() => false));
  const [open, setOpen] = useState(false);
  const [lever, setLever] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const turn = (k: number, dir: 1 | -1) => {
    if (locked[k] || open) return;
    sfx.click();
    const n = opts[k].length;
    setPos(pos.map((p, j) => (j === k ? (p + dir + n) % n : p)));
    setWrong(wrong.map((w, j) => (j === k ? false : w)));
    setMsg(null);
  };

  const pull = () => {
    if (open) return;
    setLever(true);
    setTimeout(() => setLever(false), 500);
    const ok = VAULT_DIALS.map((d, k) => opts[k][pos[k]] === d.options[0]);
    const count = ok.filter(Boolean).length;
    setLocked(ok);
    setWrong(ok.map((o) => !o));
    if (count === VAULT_DIALS.length) {
      setOpen(true);
      setMsg(null);
      onCorrect(30);
      onSolved();
    } else {
      onWrong();
      setMsg(`${count}/${VAULT_DIALS.length} dials are correct. The green ones are locked – fix the red ones!`);
    }
  };

  return (
    <div className="vault">
      <div className={`vault-door ${open ? 'vault-open' : ''}`}>
        <div className="dials">
          {VAULT_DIALS.map((d, k) => (
            <div key={d.verb} className={`dial ${locked[k] ? 'dial-locked' : ''} ${wrong[k] ? 'dial-wrong' : ''}`}>
              <div className="dial-verb">
                {d.verb} <span className="de small">({d.de})</span>
              </div>
              <button className="dial-arrow" onClick={() => turn(k, -1)} aria-label="vorherige Form" disabled={locked[k]}>
                ▲
              </button>
              <div className="dial-window">
                <span key={pos[k]} className="dial-value roll">
                  {opts[k][pos[k]]}
                </span>
              </div>
              <button className="dial-arrow" onClick={() => turn(k, 1)} aria-label="nächste Form" disabled={locked[k]}>
                ▼
              </button>
              {locked[k] && <span className="dial-lock">🔒</span>}
            </div>
          ))}
        </div>
        <div className="lever-box">
          <button className={`lever ${lever ? 'lever-down' : ''}`} onClick={pull} disabled={open} aria-label="Hebel ziehen">
            <span className="lever-stick" />
            <span className="lever-knob" />
          </button>
          <span className="lever-label">PULL!</span>
        </div>
      </div>
      {msg && <div className="feedback-line bad">{msg}</div>}
      {open && <div className="explain pop-in">⏳ CLICK – CLACK – the Time Vault is open!</div>}
    </div>
  );
}
