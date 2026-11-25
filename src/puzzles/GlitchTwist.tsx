import { useMemo, useState } from 'react';
import type { PuzzleProps } from '../game/types';
import { Echo, Glitch } from '../components/art/Characters';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { SpeakButton, shuffle } from '../components/ui';
import { sfx } from '../audio/sound';
import { speakGlitch } from '../audio/speech';

const CONFESSION =
  "Wait, heroes! Please listen. I took your cores because … nobody wanted to be my friend. At Hero School everybody laughed at me. I was always alone.";

const TALK = [
  {
    glitch: 'You want to talk to ME? What do you want to ask?',
    options: ['Do you want to be our friend?', 'Does you want to be our friend?', 'Do you wants to be our friend?'],
  },
  {
    glitch: 'Really?! But I was so mean to you …',
    options: ['Everybody makes mistakes!', 'Everybody make mistakes!', 'Everybody making mistakes!'],
  },
];

export function GlitchTwist({ heroes, gear, onCorrect, onWrong, onSolved }: PuzzleProps) {
  const [phase, setPhase] = useState<'confess' | 'talk' | 'friends'>('confess');
  const [lockTry, setLockTry] = useState(false);
  const [t, setT] = useState(0);
  const [bad, setBad] = useState<string[]>([]);
  const item = TALK[Math.min(t, TALK.length - 1)];
  const options = useMemo(() => shuffle(item.options), [item]);

  const choose = (friend: boolean) => {
    if (friend) {
      sfx.power();
      setPhase('talk');
    } else {
      sfx.glitch();
      setLockTry(true);
    }
  };

  const say = (o: string) => {
    if (bad.includes(o)) return;
    if (o === item.options[0]) {
      onCorrect(15);
      setBad([]);
      if (t + 1 < TALK.length) setT(t + 1);
      else {
        sfx.transform();
        setPhase('friends');
        speakGlitch('Thank you, my friends! Here are your power cores. And I will help you open the gate!');
      }
    } else {
      setBad([...bad, o]);
      onWrong();
    }
  };

  return (
    <div className="twist">
      <div className="twist-stage">
        <div className="twist-heroes">
          {heroes.map((h, i) => (
            <HeroAvatar key={i} hero={h} gear={gear} className="twist-hero" />
          ))}
        </div>
        <div className={`twist-glitch ${phase === 'friends' ? 'befriended' : ''}`}>
          {phase === 'friends' && <div className="heart-burst">💛</div>}
          <Glitch className="twist-glitch-svg" mood={phase === 'friends' ? 'happy' : 'defeated'} />
        </div>
      </div>

      {phase === 'confess' && (
        <div className="twist-box pop-in">
          <div className="bubble bubble-villain">
            {CONFESSION} <SpeakButton text={CONFESSION} small />
          </div>
          {lockTry && (
            <div className="echo-line pop-in">
              <Echo className="mini-echo" talking />
              <span>
                Hmm … is that what real heroes do? Remember the title: <b>Friends and heroes</b>. Think again!
              </span>
            </div>
          )}
          <div className="twist-choices">
            <button className="btn btn-big btn-red" onClick={() => choose(false)}>
              🔒 Lock him up!
            </button>
            <button className="btn btn-big btn-yellow" onClick={() => choose(true)}>
              🤝 Be his friend!
            </button>
          </div>
        </div>
      )}

      {phase === 'talk' && (
        <div className="twist-box pop-in" key={t}>
          <div className="bubble bubble-villain">{item.glitch}</div>
          <p className="instr-de">Was sagt ihr? Wählt den richtigen Satz!</p>
          <div className="option-grid one-col">
            {options.map((o) => (
              <button key={o} className={`btn btn-option big ${bad.includes(o) ? 'opt-bad' : ''}`} onClick={() => say(o)}>
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'friends' && (
        <div className="twist-box pop-in">
          <div className="bubble bubble-villain friendly">
            Thank you, my friends! Here are your power cores. And I will help you open the gate! 💛
          </div>
          <p className="instr-de">Echte Helden machen aus Gegnern Freunde. 🦸</p>
          <button className="btn btn-big btn-yellow" onClick={onSolved}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
