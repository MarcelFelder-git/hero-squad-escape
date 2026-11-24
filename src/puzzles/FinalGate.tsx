import { useMemo, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { GATE_GAPS, GATE_PASSWORD } from '../data/puzzles';
import { SpeakButton, shuffle } from '../components/ui';
import { sfx } from '../audio/sound';

const EXTRA_LETTERS = ['S', 'R', 'O', 'H', 'L', 'N'];

export function FinalGate({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const opts = useMemo(() => GATE_GAPS.map((g) => shuffle(g.options)), []);
  const letters = useMemo(() => shuffle([...GATE_PASSWORD.split(''), ...EXTRA_LETTERS]), []);
  const [filled, setFilled] = useState<(string | null)[]>(GATE_GAPS.map(() => null));
  const [bad, setBad] = useState<string[]>([]);
  const [typed, setTyped] = useState('');
  const [open, setOpen] = useState(false);
  const [wrongCode, setWrongCode] = useState(false);
  const gapsDone = filled.every(Boolean);

  const choose = (k: number, o: string) => {
    if (filled[k] || bad.includes(`${k}:${o}`)) return;
    if (o === GATE_GAPS[k].options[0]) {
      setFilled(filled.map((f, j) => (j === k ? o : f)));
      onCorrect();
    } else {
      setBad([...bad, `${k}:${o}`]);
      onWrong();
    }
  };

  const type = (l: string) => {
    if (open) return;
    sfx.click();
    setWrongCode(false);
    const t = (typed + l).slice(0, GATE_PASSWORD.length);
    setTyped(t);
    if (t.length === GATE_PASSWORD.length) {
      if (t === GATE_PASSWORD) {
        setOpen(true);
        onCorrect(30);
        onSolved();
      } else {
        setWrongCode(true);
        onWrong();
        setTimeout(() => setTyped(''), 700);
      }
    }
  };

  return (
    <div className="finalgate">
      <div className="gate-gaps">
        {GATE_GAPS.map((g, k) => (
          <div key={k} className={`gate-gap ${filled[k] ? 'ok' : ''}`}>
            <div className="gate-sentence">
              <span className="gap-num">{k + 1}</span>
              {g.before}
              <span className="gap-slot">{filled[k] ? <b>{filled[k]}</b> : '______'}</span>
              {g.after}
              {filled[k] && <SpeakButton text={`${g.before}${filled[k]}${g.after}`} small />}
            </div>
            {!filled[k] && (
              <div className="option-row small-opts">
                {opts[k].map((o) => (
                  <button key={o} className={`btn btn-option ${bad.includes(`${k}:${o}`) ? 'opt-bad' : ''}`} onClick={() => choose(k, o)}>
                    {o}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`gate-lock ${gapsDone ? 'ready' : ''} ${open ? 'unlocked' : ''}`}>
        <div className="lock-title">🔐 MAIN GATE PASSWORD</div>
        <div className="first-letters">
          First letters:{' '}
          {filled.map((f, k) => (
            <span key={k} className="first-letter">
              {f ? f[0].toUpperCase() : '?'}
            </span>
          ))}
        </div>
        <div className={`code-slots ${wrongCode ? 'shake1' : ''}`}>
          {GATE_PASSWORD.split('').map((_, k) => (
            <span key={k} className={`code-slot ${typed[k] ? 'filled' : ''}`}>
              {typed[k] ?? ''}
            </span>
          ))}
        </div>
        {gapsDone ? (
          <div className="letter-pad">
            {letters.map((l, k) => (
              <button key={k} className="key" onClick={() => type(l)} disabled={open}>
                {l}
              </button>
            ))}
            <button className="key key-del" onClick={() => setTyped(typed.slice(0, -1))} disabled={open || !typed}>
              ⌫
            </button>
          </div>
        ) : (
          <p className="muted small">Fill all 4 gaps first! / Erst alle Lücken füllen!</p>
        )}
        {open && <div className="explain pop-in">🚪 ACCESS GRANTED – T·E·A·M!</div>}
      </div>
    </div>
  );
}
