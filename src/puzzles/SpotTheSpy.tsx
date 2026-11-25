import { useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { SPY_ROUNDS, type Suspect } from '../data/puzzles';
import { Person } from '../components/art/Person';
import { SpeakButton } from '../components/ui';

function whyNot(s: Suspect, spy: Suspect, pronoun?: 'He' | 'She'): string {
  const he = pronoun ?? (spy.id <= 'd' ? 'He' : 'She');
  const n = s.name;
  if (s.tall !== spy.tall) return `${n} is ${s.tall ? 'tall' : 'short'}. The spy is ${spy.tall ? 'tall' : 'short'}.`;
  if (s.hairStyle !== spy.hairStyle) return `${n} has ${s.hairStyle} hair. ${he} has ${spy.hairStyle} hair.`;
  if (s.glasses !== spy.glasses) return `${n} ${s.glasses ? 'wears' : "doesn't wear"} glasses.`;
  if (s.braces !== spy.braces) return `${n} ${s.braces ? 'wears' : "doesn't wear"} braces.`;
  return `${n} is not the spy.`;
}

export function SpotTheSpy({ onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [round, setRound] = useState(0);
  const [wrong, setWrong] = useState<Record<string, string>>({});
  const [caught, setCaught] = useState<string | null>(null);
  const r = SPY_ROUNDS[round];
  const spy = r.suspects.find((s) => s.id === r.answer)!;

  const pick = (s: Suspect) => {
    if (caught || wrong[s.id]) return;
    if (s.id === r.answer) {
      setCaught(s.id);
      onCorrect(15);
      setTimeout(() => {
        if (round + 1 < SPY_ROUNDS.length) {
          setRound(round + 1);
          setCaught(null);
          setWrong({});
        } else onSolved();
      }, 1400);
    } else {
      setWrong({ ...wrong, [s.id]: whyNot(s, spy, r.pronoun) });
      onWrong();
    }
  };

  return (
    <div className="spy">
      <div className="witness panel-inner">
        <div className="witness-head">
          🕵️ Witness report {round + 1}/{SPY_ROUNDS.length}
          <SpeakButton text={r.report.join(' ')} small />
        </div>
        <ul>
          {r.report.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
      <div className="lineup">
        {r.suspects.map((s) => (
          <button
            key={s.id}
            className={`suspect ${caught === s.id ? 'caught' : ''} ${wrong[s.id] ? 'cleared' : ''}`}
            onClick={() => pick(s)}
          >
            <div className="suspect-fig" style={{ height: s.tall ? 230 : 165 }}>
              <Person skin={s.skin} hair={s.hair} hairStyle={s.hairStyle} suit={s.shirt} glasses={s.glasses} braces={s.braces} title={s.name} />
            </div>
            <span className="suspect-name">{s.name}</span>
            {caught === s.id && <span className="stamp">SPY!</span>}
            {wrong[s.id] && <span className="why">{wrong[s.id]}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
