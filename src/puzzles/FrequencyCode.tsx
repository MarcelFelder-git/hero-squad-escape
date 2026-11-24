import { useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { FREQUENCY_QUESTIONS, INTERCEPTED_MESSAGE } from '../data/puzzles';
import { SpeakButton } from '../components/ui';
import { sfx } from '../audio/sound';

export function FrequencyCode({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(FREQUENCY_QUESTIONS.map(() => null));
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState<number | null>(null);
  const done = answers.every((a) => a !== null);

  const press = (d: number) => {
    if (done) return;
    sfx.click();
    if (d === FREQUENCY_QUESTIONS[active].answer) {
      const na = answers.map((a, k) => (k === active ? d : a));
      setAnswers(na);
      onCorrect();
      const nxt = na.findIndex((a) => a === null);
      if (nxt >= 0) setActive(nxt);
      else onSolved();
    } else {
      setFlash(d);
      setTimeout(() => setFlash(null), 500);
      onWrong();
    }
  };

  return (
    <div className="frequency">
      <div className="printout">
        <div className="printout-head">
          ⚠ INTERCEPTED MESSAGE <SpeakButton text={INTERCEPTED_MESSAGE.join(' ')} small />
        </div>
        {INTERCEPTED_MESSAGE.map((l, k) => (l ? <p key={k}>{l}</p> : <br key={k} />))}
      </div>

      <div className="freq-right">
        <ol className="freq-questions">
          {FREQUENCY_QUESTIONS.map((q, k) => (
            <li key={k}>
              <button
                className={`freq-q ${active === k && !done ? 'active' : ''} ${answers[k] !== null ? 'ok' : ''}`}
                onClick={() => answers[k] === null && setActive(k)}
              >
                <span>{q.q}</span>
                <span className="freq-digit">{answers[k] ?? '?'}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className={`freq-display ${done ? 'tuned' : ''}`}>
          <span className="freq-mhz">
            {answers.map((a) => (a === null ? '_' : a)).join('')}.0
          </span>
          <span className="freq-unit">MHz</span>
          <div className="freq-wave" />
        </div>

        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
            <button key={d} className={`key ${flash === d ? 'key-bad' : ''}`} onClick={() => press(d)} disabled={done}>
              {d}
            </button>
          ))}
        </div>
        {done && <div className="explain pop-in">📻 Frequency {FREQUENCY_QUESTIONS.map((q) => q.answer).join('')}.0 MHz – we can hear the Glitch's robots!</div>}
      </div>
    </div>
  );
}
