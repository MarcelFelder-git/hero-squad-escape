import { useMemo, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { DIARY } from '../data/puzzles';
import { SpeakButton, shuffle } from '../components/ui';
import { sfx } from '../audio/sound';

export function DiaryGaps({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const gapIdx = useMemo(() => DIARY.map((p, k) => (typeof p === 'string' ? -1 : k)).filter((k) => k >= 0), []);
  const shuffled = useMemo(() => {
    const m: Record<number, string[]> = {};
    gapIdx.forEach((k) => {
      const p = DIARY[k];
      if (typeof p !== 'string') m[k] = shuffle(p.options);
    });
    return m;
  }, [gapIdx]);
  const [filled, setFilled] = useState<Record<number, string>>({});
  const [active, setActive] = useState(gapIdx[0]);
  const [bad, setBad] = useState<string[]>([]);

  const activePart = DIARY[active];
  const allDone = Object.keys(filled).length === gapIdx.length;

  const choose = (o: string) => {
    if (typeof activePart === 'string' || filled[active] || bad.includes(o)) return;
    if (o === activePart.options[0]) {
      const nf = { ...filled, [active]: o };
      setFilled(nf);
      setBad([]);
      onCorrect();
      const nextGap = gapIdx.find((k) => !nf[k]);
      if (nextGap !== undefined) setActive(nextGap);
      else onSolved();
    } else {
      setBad([...bad, o]);
      onWrong();
    }
  };

  const fullText = DIARY.map((p, k) => (typeof p === 'string' ? p : filled[k] ?? '…')).join('');

  return (
    <div className="diary">
      <div className="diary-page">
        <div className="diary-tape" />
        <p>
          {DIARY.map((p, k) =>
            typeof p === 'string' ? (
              <span key={k}>{p}</span>
            ) : (
              <button
                key={k}
                className={`gap ${filled[k] ? 'gap-filled' : ''} ${active === k && !filled[k] ? 'gap-active' : ''}`}
                onClick={() => {
                  if (filled[k]) return;
                  sfx.click();
                  setActive(k);
                  setBad([]);
                }}
              >
                {filled[k] ?? (
                  <>
                    ______ <small>({p.hint})</small>
                  </>
                )}
              </button>
            ),
          )}
        </p>
        {allDone && (
          <div className="diary-done">
            Read it in a villain voice: <SpeakButton text={fullText} />
          </div>
        )}
      </div>

      {!allDone && typeof activePart !== 'string' && (
        <div className="option-tray">
          <span className="tray-label">
            Gap {gapIdx.indexOf(active) + 1}/{gapIdx.length} – <i>{activePart.hint}</i>:
          </span>
          <div className="option-row">
            {shuffled[active].map((o) => (
              <button key={o} className={`btn btn-option ${bad.includes(o) ? 'opt-bad' : ''}`} onClick={() => choose(o)}>
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
