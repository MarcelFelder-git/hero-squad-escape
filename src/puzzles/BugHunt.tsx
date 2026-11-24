import { useMemo, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { BUG_SENTENCES } from '../data/puzzles';
import { SpeakButton, shuffle } from '../components/ui';

export function BugHunt({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [i, setI] = useState(0);
  const [found, setFound] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [okWords, setOkWords] = useState<number[]>([]);
  const [badOpt, setBadOpt] = useState<string[]>([]);
  const s = BUG_SENTENCES[i];
  const options = useMemo(() => shuffle(s.options), [s]);

  const next = () => {
    if (i + 1 < BUG_SENTENCES.length) {
      setI(i + 1);
      setFound(false);
      setFixed(false);
      setOkWords([]);
      setBadOpt([]);
    } else onSolved();
  };

  const tapWord = (k: number) => {
    if (found) return;
    if (k === s.bugIndex) {
      setFound(true);
      onCorrect(5);
    } else if (!okWords.includes(k)) {
      setOkWords([...okWords, k]);
      onWrong();
    }
  };

  const choose = (o: string) => {
    if (fixed || badOpt.includes(o)) return;
    if (o === s.options[0]) {
      setFixed(true);
      onCorrect();
      setTimeout(next, 1500);
    } else {
      setBadOpt([...badOpt, o]);
      onWrong();
    }
  };

  const sentence = s.words.map((w, k) => (k === s.bugIndex && fixed ? s.options[0] : w)).join(' ');

  return (
    <div className="bughunt">
      <div className="bug-progress">
        {BUG_SENTENCES.map((_, k) => (
          <span key={k} className={`bug-dot ${k < i || (k === i && fixed) ? 'fixed' : k === i ? 'current' : ''}`}>
            {k < i || (k === i && fixed) ? '✔' : '🐞'}
          </span>
        ))}
      </div>
      <div className="monitor">
        <div className="monitor-label">
          GENERATOR SCREEN #{i + 1} <SpeakButton text={sentence} small />
        </div>
        <div className="words">
          {s.words.map((w, k) => (
            <button
              key={`${i}-${k}`}
              className={`word ${k === s.bugIndex && found ? (fixed ? 'word-fixed' : 'word-bug') : ''} ${okWords.includes(k) ? 'word-ok' : ''}`}
              onClick={() => tapWord(k)}
            >
              {k === s.bugIndex && fixed ? s.options[0] : w}
              {k === s.bugIndex && found && !fixed && <span className="bug-icon">🐞</span>}
            </button>
          ))}
        </div>
        {okWords.length > 0 && !found && <div className="feedback-line">✔ That word is OK – keep hunting!</div>}
      </div>

      {found && !fixed && (
        <div className="fix-row pop-in">
          <span className="fix-label">
            Bug found! Replace <s>{s.words[s.bugIndex]}</s> with …
          </span>
          <div className="option-row">
            {options.map((o) => (
              <button key={o} className={`btn btn-option ${badOpt.includes(o) ? 'opt-bad' : ''}`} onClick={() => choose(o)}>
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
      {fixed && (
        <div className="explain pop-in">
          ✔ <b>Fixed!</b> {s.explain}
        </div>
      )}
    </div>
  );
}
