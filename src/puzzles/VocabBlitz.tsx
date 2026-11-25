import { useMemo, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { BLITZ_DE_EN, BLITZ_EN_DE, type BlitzItem } from '../data/puzzles2';
import { SpeakButton, shuffle } from '../components/ui';

function VocabBlitz({ items, speakWord, onCorrect, onWrong, onSolved }: PuzzleProps & { items: BlitzItem[]; speakWord: boolean }) {
  const [i, setI] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [bad, setBad] = useState<string[]>([]);
  const [good, setGood] = useState<string | null>(null);
  const done = i >= items.length;
  const item = items[Math.min(i, items.length - 1)];
  const options = useMemo(() => shuffle(item.options), [item]);

  const pick = (o: string) => {
    if (good || done || bad.includes(o)) return;
    if (o === item.options[0]) {
      const c = combo + 1;
      setCombo(c);
      setBest((b) => Math.max(b, c));
      setGood(o);
      onCorrect(10 + Math.min(c - 1, 5) * 2);
      setTimeout(() => {
        setGood(null);
        setBad([]);
        const n = i + 1;
        setI(n);
        if (n >= items.length) onSolved();
      }, 650);
    } else {
      setCombo(0);
      setBad([...bad, o]);
      onWrong();
    }
  };

  return (
    <div className="blitz">
      <div className="blitz-top">
        <div className="dots">
          {items.map((_, k) => (
            <i key={k} className={k < i ? 'done' : k === i ? 'now' : ''} />
          ))}
        </div>
        <div className={`combo ${combo >= 2 ? 'hot' : ''}`} key={combo}>
          {combo >= 2 ? `🔥 COMBO x${combo}` : `Combo x${combo}`}
        </div>
      </div>
      {!done ? (
        <>
          <div className="blitz-word pop-in" key={i}>
            {item.word} {speakWord && <SpeakButton text={item.word.replace(/\(to\)|sb\./g, '')} small />}
          </div>
          <div className="option-grid">
            {options.map((o) => (
              <button
                key={o}
                className={`btn btn-option big ${bad.includes(o) ? 'opt-bad' : ''} ${good === o ? 'opt-good' : ''}`}
                onClick={() => pick(o)}
              >
                {o}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="explain big pop-in">
          ⚡ Vocab Blitz complete! Best combo: <b>x{best}</b>
        </div>
      )}
    </div>
  );
}

export const VocabBlitzEnDe = (p: PuzzleProps) => <VocabBlitz {...p} items={BLITZ_EN_DE} speakWord />;
export const VocabBlitzDeEn = (p: PuzzleProps) => <VocabBlitz {...p} items={BLITZ_DE_EN} speakWord={false} />;
