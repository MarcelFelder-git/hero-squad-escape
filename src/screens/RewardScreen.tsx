import { useEffect, useState } from 'react';
import { useGame } from '../game/GameContext';
import { GEAR, LEVELS } from '../data/levels';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { GearBox, Rocket } from '../components/art/Rocket';
import { sfx } from '../audio/sound';
import { speak } from '../audio/speech';

/** After every level: a rocket brings a box with a new piece of hero gear. */
export function RewardScreen() {
  const { state, dispatch } = useGame();
  const level = LEVELS[state.levelIndex];
  const gear = GEAR[state.levelIndex];
  const last = state.levelIndex === LEVELS.length - 1;
  const next = LEVELS[state.levelIndex + 1];
  const [step, setStep] = useState<'launch' | 'box' | 'transform'>('launch');
  const st = state.levelStats[state.levelIndex];
  const names = state.heroes.map((h) => h.name);
  const nameList = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

  useEffect(() => {
    sfx.rocket();
    const t = setTimeout(() => setStep('box'), 1900);
    return () => clearTimeout(t);
  }, []);

  const openBox = () => {
    sfx.pop();
    setStep('transform');
    setTimeout(() => sfx.transform(), 250);
    if (!state.muted) setTimeout(() => speak(`${nameList} got the ${gear.name}!`), 900);
  };

  return (
    <div className="screen reward-screen" style={{ ['--lvl' as string]: level.color }}>
      <div className="reward-rays" />
      <div className="reward-head">
        <div className="level-num">LEVEL {state.levelIndex + 1} COMPLETE!</div>
        <div className="rocket-progress">
          {LEVELS.map((l, i) => (
            <span key={l.id} className={i <= state.levelIndex ? 'on' : ''} style={{ ['--c' as string]: l.color }}>
              {GEAR[i].icon}
            </span>
          ))}
        </div>
      </div>

      {step === 'launch' && (
        <div className="rocket-fly">
          <Rocket color={level.color} className="reward-rocket" />
          <div className="big-word">🚀 A rocket from Hero HQ!</div>
        </div>
      )}

      {step === 'box' && (
        <div className="box-stage pop-in">
          <button className="gear-box-btn" onClick={openBox} aria-label="Box öffnen">
            <GearBox color={level.color} className="gear-box wiggle" />
          </button>
          <div className="big-word">Tap the box!</div>
          <div className="de">Tippt auf die Box!</div>
        </div>
      )}

      {step === 'transform' && (
        <div className="transform-stage">
          <div className="flash" />
          <div className="gear-reveal pop-in">
            <span className="gear-icon">{gear.icon}</span>
            <div>
              <div className="gear-name">{gear.name}!</div>
              <div className="de">{gear.nameDe}</div>
            </div>
          </div>
          <div className="reward-heroes">
            {state.heroes.map((h, i) => (
              <div key={i} className="reward-hero">
                <HeroAvatar hero={h} gear={state.levelIndex + 1} className="reward-avatar transform-in" />
                <b>{h.name}</b>
              </div>
            ))}
          </div>
          <div className="reward-stats">
            <span>❌ {st.mistakes}</span>
            <span>💡 {st.hints}</span>
            <span>★ {state.score}</span>
          </div>
          <button
            className="btn btn-big btn-yellow pulse-btn"
            onClick={() => {
              sfx.whoosh();
              dispatch({ type: 'NEXT_LEVEL' });
            }}
          >
            {last ? '🏆 Mission complete!' : `Level ${state.levelIndex + 2}: ${next.name} →`}
          </button>
        </div>
      )}
    </div>
  );
}
