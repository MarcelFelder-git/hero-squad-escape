import { useMemo, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { BOSS_QUESTIONS } from '../data/puzzles';
import { Glitch } from '../components/art/Characters';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { SpeakButton, shuffle } from '../components/ui';
import { sfx } from '../audio/sound';
import { powerInfo } from '../data/heroOptions';

const TAUNTS = [
  "You can't beat me!",
  'Is that all, heroes?',
  'Grrr… lucky answer!',
  'My circuits! Nooo!',
  "I don't like this game!",
  'Bzzt… system error…',
];

export function BossBattle({ heroes, gear, onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [q, setQ] = useState(0);
  const [hp, setHp] = useState(BOSS_QUESTIONS.length);
  const [bad, setBad] = useState<string[]>([]);
  const [hit, setHit] = useState(0);
  const [locked, setLocked] = useState(false);
  const [say, setSay] = useState("I am THE GLITCH! Answer my questions… if you can!");
  const item = BOSS_QUESTIONS[q];
  const options = useMemo(() => shuffle(item.options), [item]);
  const hero = heroes[q % heroes.length];
  const defeated = hp === 0;

  const pick = (o: string) => {
    if (locked || bad.includes(o) || defeated) return;
    if (o === item.options[0]) {
      setLocked(true);
      sfx.pow();
      onCorrect(15);
      setHit((h) => h + 1);
      const nhp = hp - 1;
      setHp(nhp);
      setSay(nhp === 0 ? 'NOOOO! My power… is… gone… bzzzt…' : TAUNTS[q % TAUNTS.length]);
      setTimeout(() => {
        if (nhp === 0) {
          sfx.glitch();
          onSolved();
        } else {
          setQ(q + 1);
          setBad([]);
          setLocked(false);
        }
      }, 1100);
    } else {
      setBad([...bad, o]);
      sfx.glitch();
      setSay(`Ha ha! "${o}" is wrong, ${hero.name}!`);
      onWrong();
    }
  };

  const sentence = item.text;

  return (
    <div className="boss">
      <div className="arena">
        <div className="arena-hero">
          <HeroAvatar key={q} hero={hero} gear={gear} className={`arena-hero-svg ${locked ? 'attack' : 'bob'}`} />
          <div className="turn-label">
            {heroes.length > 1 ? <>{hero.name}'s turn!</> : <>{hero.name}, attack!</>}
            <span className="small"> {powerInfo(hero.power).icon}</span>
          </div>
        </div>
        <div className="arena-vs">VS</div>
        <div className="arena-boss">
          <div className="bubble bubble-villain bubble-small">{say}</div>
          <Glitch key={hit} className={`boss-svg ${hit ? 'boss-hit' : ''} ${defeated ? 'glitch-defeated' : 'glitch-anim'}`} mood={defeated ? 'defeated' : bad.length ? 'evil' : 'angry'} />
          <div className="hp">
            <span>GLITCH ENERGY</span>
            <div className="hp-bar">
              <div style={{ width: `${(hp / BOSS_QUESTIONS.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {!defeated && (
        <div className="boss-q">
          <div className="boss-topic">
            Attack {q + 1}/{BOSS_QUESTIONS.length} · {item.topic}
          </div>
          <div className="boss-text">
            {sentence} <SpeakButton text={item.text} small />
          </div>
          <div className="option-row">
            {options.map((o) => (
              <button key={o} className={`btn btn-option big ${bad.includes(o) ? 'opt-bad' : ''} ${locked && o === item.options[0] ? 'opt-good' : ''}`} onClick={() => pick(o)}>
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
      {defeated && <div className="explain pop-in big">💥 K.O.! The Glitch is defeated! … But wait – he wants to say something.</div>}
    </div>
  );
}
