import { useEffect, useMemo, useRef, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { INTERVIEWS, type TFN } from '../data/puzzles2';
import { shuffle } from '../components/ui';

const LABEL: Record<TFN, string> = { true: 'TRUE', false: 'FALSE', not: 'NOT IN THE TEXT' };

/** Silent radio show: the Glitch stole the sound – the interview runs as a chat. No audio (15 iPads in one room). */
export function RadioInterview({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [c, setC] = useState(0);
  const [line, setLine] = useState(0);
  const [bad, setBad] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, TFN>>({});
  const [badT, setBadT] = useState<Record<number, TFN[]>>({});
  const bottom = useRef<HTMLDivElement>(null);
  const done = c >= INTERVIEWS.length;
  const iv = INTERVIEWS[Math.min(c, INTERVIEWS.length - 1)];
  const chatDone = line >= iv.lines.length;
  const options = useMemo(() => (chatDone ? [] : shuffle(iv.lines[line].options)), [iv, line, chatDone]);

  useEffect(() => {
    if (c === 0 && line === 0) return;
    // after the pop-in animation: keep the answer buttons in view
    const t = window.setTimeout(() => bottom.current?.scrollIntoView({ block: 'end' }), 350);
    return () => window.clearTimeout(t);
  }, [c, line]);

  const pick = (o: string) => {
    if (bad.includes(o)) return;
    if (o === iv.lines[line].options[0]) {
      onCorrect();
      setBad([]);
      setLine(line + 1);
    } else {
      setBad([...bad, o]);
      onWrong();
    }
  };

  const answer = (k: number, a: TFN) => {
    if (answers[k] || badT[k]?.includes(a)) return;
    if (iv.statements[k].a === a) {
      const next = { ...answers, [k]: a };
      setAnswers(next);
      onCorrect();
      if (Object.keys(next).length === iv.statements.length) {
        setTimeout(() => {
          const n = c + 1;
          setC(n);
          setLine(0);
          setAnswers({});
          setBadT({});
          if (n >= INTERVIEWS.length) onSolved();
        }, 900);
      }
    } else {
      setBadT({ ...badT, [k]: [...(badT[k] ?? []), a] });
      onWrong();
    }
  };

  if (done) return <div className="explain big pop-in">📻 Thank you for reading Hero Radio 101.5 – the silent show!</div>;

  return (
    <div className="radio-show">
      <div className="radio-head">
        <span className="radio-logo">📻 HERO RADIO 101.5</span>
        <span className="on-air">● ON AIR</span>
        <span className="radio-mute">🔇 Sound: stolen by the Glitch</span>
      </div>
      <div className="caller-strip">
        {INTERVIEWS.map((cl, k) => (
          <span key={cl.name} className={`caller-chip ${k < c ? 'done' : k === c ? 'now' : ''}`} style={{ ['--cc' as string]: cl.color }}>
            {k < c ? '✔' : '📞'} {cl.name}
          </span>
        ))}
      </div>

      <div className="radio-chat" key={c} style={{ ['--cc' as string]: iv.color }}>
        {iv.lines.slice(0, Math.min(line + 1, iv.lines.length)).map((l, k) => (
          <div key={k} className="chat-pair">
            <div className="chat-msg host pop-in">
              <b>🎙 Echo:</b> {l.q}
            </div>
            {k < line && (
              <div className="chat-msg caller pop-in">
                <b>{iv.name}:</b> {l.options[0]}
              </div>
            )}
          </div>
        ))}
      </div>

      {!chatDone ? (
        <div className="chat-options" key={`${c}-${line}`}>
          <div className="chat-ask">What does {iv.name} say? Only ONE answer has no mistake!</div>
          {options.map((o) => (
            <button key={o} className={`chat-opt ${bad.includes(o) ? 'bad' : ''}`} onClick={() => pick(o)}>
              {o}
            </button>
          ))}
        </div>
      ) : (
        <div className="tfn-list pop-in">
          <div className="chat-ask">✔ Interview complete! True, false or not in the text?</div>
          {iv.statements.map((st, k) => (
            <div key={k} className={`tfn-row ${answers[k] ? 'solved' : ''}`}>
              <span className="tfn-s">{st.s}</span>
              <span className="tfn-btns">
                {(['true', 'false', 'not'] as TFN[]).map((a) => (
                  <button
                    key={a}
                    className={`tfn-btn tfn-${a} ${answers[k] === a ? 'on' : ''} ${badT[k]?.includes(a) ? 'bad' : ''}`}
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
      )}
      <div ref={bottom} />
    </div>
  );
}
