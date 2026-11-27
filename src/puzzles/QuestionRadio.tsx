import { useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { QUESTION_WORDS, RADIO_ITEMS, type QuestionWord } from '../data/puzzles';
import { SpeakButton, shuffle } from '../components/ui';

export function QuestionRadio({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [i, setI] = useState(0);
  const [bad, setBad] = useState<QuestionWord[]>([]);
  const [solved, setSolved] = useState(false);
  // mixed order – otherwise the answers come as Who, What, Where, When … like the buttons
  const [items] = useState(() => {
    let s = shuffle(RADIO_ITEMS);
    for (let k = 0; k < 5 && s.some((it, j) => it.correct === RADIO_ITEMS[j].correct); k++) s = shuffle(RADIO_ITEMS);
    return s;
  });
  const item = items[i];

  const pick = (w: QuestionWord) => {
    if (solved || bad.includes(w)) return;
    if (w === item.correct) {
      setSolved(true);
      onCorrect();
      setTimeout(() => {
        if (i + 1 < RADIO_ITEMS.length) {
          setI(i + 1);
          setSolved(false);
          setBad([]);
        } else onSolved();
      }, 1300);
    } else {
      setBad([...bad, w]);
      onWrong();
    }
  };

  const [before, after] = item.question.split('___');
  const fullQ = `${item.correct}${after}`;

  return (
    <div className="radio">
      <div className="signal">
        <span className="signal-label">📡 Signal</span>
        {RADIO_ITEMS.map((_, k) => (
          <span key={k} className={`sig-bar ${k < i || (k === i && solved) ? 'on' : ''}`} style={{ height: 10 + k * 4 }} />
        ))}
      </div>

      <div className="transmission">
        <div className="tx-witness">
          📻 Witness {i + 1}/{RADIO_ITEMS.length}: <b>{item.witness}</b>
        </div>
        <div className="tx-q">
          <span className="tx-tag">Q:</span>
          {before}
          <span className={`qgap ${solved ? 'qgap-ok' : ''}`}>{solved ? item.correct : '?????'}</span>
          {after}
          {solved && <SpeakButton text={fullQ} small />}
        </div>
        <div className="tx-a">
          <span className="tx-tag">A:</span> „{item.answer}“ <SpeakButton text={item.answer} small />
        </div>
      </div>

      <div className="qword-grid">
        {QUESTION_WORDS.map((w) => (
          <button
            key={w}
            className={`qword ${bad.includes(w) ? 'opt-bad' : ''} ${solved && w === item.correct ? 'qword-ok' : ''}`}
            onClick={() => pick(w)}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}
