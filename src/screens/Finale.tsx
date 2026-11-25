// The official ending: after the hero profiles the mission is over – a short cinematic before the results.
import { useEffect, useMemo, useState } from 'react';
import type { Hero } from '../game/types';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { Glitch } from '../components/art/Characters';
import { CityBackdrop } from '../components/art/Scenes';
import { sfx } from '../audio/sound';
import { speak, stopSpeaking } from '../audio/speech';

function Fireworks() {
  const shots = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        left: 8 + ((i * 37) % 84),
        top: 8 + ((i * 23) % 38),
        delay: 0.6 + i * 0.55,
        color: ['#ffd60a', '#ff006e', '#4cc9f0', '#39ff14', '#ff9f1c'][i % 5],
      })),
    [],
  );
  return (
    <div className="fireworks" aria-hidden="true">
      {shots.map((f, i) => (
        <span key={i} className="firework" style={{ left: `${f.left}%`, top: `${f.top}%`, animationDelay: `${f.delay}s`, ['--c' as string]: f.color }}>
          {Array.from({ length: 12 }, (_, k) => (
            <i key={k} style={{ transform: `rotate(${k * 30}deg)` }} />
          ))}
        </span>
      ))}
    </div>
  );
}

export function Finale({ heroes, muted, onDone }: { heroes: Hero[]; muted: boolean; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const names = heroes.map((h) => h.name);
  const nameList = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

  useEffect(() => {
    const ts = [
      window.setTimeout(() => sfx.rocket(), 200),
      window.setTimeout(() => {
        setStep(1);
        sfx.pow();
        sfx.victory();
      }, 2300),
      window.setTimeout(() => {
        setStep(2);
        sfx.transform();
        if (!muted) speak(`Mission complete! Hero City is safe again. Thank you, ${nameList}!`);
      }, 3500),
      window.setTimeout(() => {
        setStep(3);
        sfx.unlock();
      }, 6200),
    ];
    return () => {
      ts.forEach(clearTimeout);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="finale">
      <div className="finale-sky" />
      <CityBackdrop open />
      <Fireworks />
      <div className="finale-squad">
        {heroes.map((h, i) => (
          <div key={i} className="finale-flyer" style={{ animationDelay: `${0.3 + i * 0.25}s` }}>
            <HeroAvatar hero={h} gear={8} className="finale-hero" />
          </div>
        ))}
        <div className="finale-flyer" style={{ animationDelay: `${0.3 + heroes.length * 0.25}s` }}>
          <Glitch className="finale-glitch" mood="happy" />
        </div>
      </div>

      <div className="finale-text">
        {step >= 1 && (
          <div className="finale-stamp">
            <span>MISSION</span>
            <span>COMPLETE!</span>
          </div>
        )}
        {step >= 2 && (
          <div className="finale-sub pop-in">
            Hero City is safe again – and the Glitch has new friends. 💛
            <div className="de">Hero City ist gerettet – und der Glitch hat neue Freunde.</div>
          </div>
        )}
        {step >= 2 && (
          <div className="finale-seal">
            <b>OFFICIAL</b>
            <span>HERO SQUAD</span>
            <small>★ Hero City ★</small>
          </div>
        )}
        {step >= 3 && (
          <button className="btn btn-big btn-yellow pulse-btn finale-btn pop-in" onClick={onDone}>
            ★ Our hero cards →
          </button>
        )}
      </div>
      <div className="finale-end">THE END</div>
    </div>
  );
}
