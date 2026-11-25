import { useEffect, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { CALLERS, type TFN } from '../data/puzzles2';
import { canSpeak, speak, stopSpeaking } from '../audio/speech';
import { sfx } from '../audio/sound';

const LABEL: Record<TFN, string> = { true: 'TRUE', false: 'FALSE', not: 'NOT IN THE TEXT' };

export function ListeningShow({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [c, setC] = useState(0);
  const [plays, setPlays] = useState(0);
  const [onAir, setOnAir] = useState(false);
  const [answers, setAnswers] = useState<Record<number, TFN>>({});
  const [bad, setBad] = useState<Record<number, TFN[]>>({});
  const [showText, setShowText] = useState(!canSpeak());
  const done = c >= CALLERS.length;
  const caller = CALLERS[Math.min(c, CALLERS.length - 1)];

  useEffect(() => () => void stopSpeaking(), []);

  const play = () => {
    sfx.click();
    setOnAir(true);
    setPlays((p) => p + 1);
    speak(caller.text, { pitch: caller.pitch, rate: caller.rate, onEnd: () => setOnAir(false) });
  };

  const answer = (k: number, a: TFN) => {
    if (answers[k] || bad[k]?.includes(a)) return;
    if (caller.statements[k].a === a) {
      const next = { ...answers, [k]: a };
      setAnswers(next);
      onCorrect();
      if (Object.keys(next).length === caller.statements.length) {
        setTimeout(() => {
          stopSpeaking();
          setOnAir(false);
          const n = c + 1;
          setC(n);
          setPlays(0);
          setAnswers({});
          setBad({});
          setShowText(!canSpeak());
          if (n >= CALLERS.length) onSolved();
        }, 900);
      }
    } else {
      setBad({ ...bad, [k]: [...(bad[k] ?? []), a] });
      onWrong();
    }
  };

  if (done) return <div className="explain big pop-in">📻 Thank you for listening to Hero Radio 101.5!</div>;

  return (
    <div className="radio-show">
      <div className="caller-strip">
        {CALLERS.map((cl, k) => (
          <span key={cl.name} className={`caller-chip ${k < c ? 'done' : k === c ? 'now' : ''}`} style={{ ['--cc' as string]: cl.color }}>
            {k < c ? '✔' : '📞'} {cl.name}
          </span>
        ))}
      </div>

      <div className="caller-card pop-in" key={c} style={{ ['--cc' as string]: caller.color }}>
        <div className={`caller-avatar ${onAir ? 'talking' : ''}`}>{caller.name[0]}</div>
        <div className="caller-info">
          <div className="caller-name">
            Caller {c + 1}: <b>{caller.name}</b> {onAir && <span className="on-air">● ON AIR</span>}
          </div>
          <div className="row-btns left">
            <button className="btn btn-yellow" onClick={play}>
              ▶ {plays === 0 ? 'Play' : 'Play again'}
            </button>
            {plays >= 2 && !showText && (
              <button className="btn btn-ghost" onClick={() => setShowText(true)}>
                📄 Read the text
              </button>
            )}
          </div>
          {onAir && (
            <div className="eq-wave" aria-hidden="true">
              {Array.from({ length: 12 }, (_, k) => (
                <i key={k} style={{ animationDelay: `${k * 0.07}s` }} />
              ))}
            </div>
          )}
        </div>
      </div>
      {showText && <p className="transcript pop-in">{caller.text}</p>}

      <div className="tfn-list">
        {caller.statements.map((st, k) => (
          <div key={k} className={`tfn-row ${answers[k] ? 'solved' : ''}`}>
            <span className="tfn-s">{st.s}</span>
            <span className="tfn-btns">
              {(['true', 'false', 'not'] as TFN[]).map((a) => (
                <button
                  key={a}
                  className={`tfn-btn tfn-${a} ${answers[k] === a ? 'on' : ''} ${bad[k]?.includes(a) ? 'bad' : ''}`}
                  onClick={() => answer(k, a)}
                  disabled={!!answers[k] && answers[k] !== a}
                >
                  {LABEL[a]}
                </button>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
