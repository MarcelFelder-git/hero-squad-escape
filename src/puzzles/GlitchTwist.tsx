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

  const [cage, setCage] = useState<'none' | 'down' | 'up'>('none');
  const [echoLine, setEchoLine] = useState(false);

  const choose = (friend: boolean) => {
    if (friend) {
      sfx.power();
      if (cage === 'down') {
        // lift the cage first, then talk
        setCage('up');
        window.setTimeout(() => {
          setCage('none');
          setPhase('talk');
        }, 700);
      } else setPhase('talk');
    } else {
      if (cage === 'down') return;
      // fun moment: a cage drops on the Glitch – he is very sad. No penalty, but heroes must think again.
      setLockTry(true);
      setEchoLine(false);
      setCage('down');
      window.setTimeout(() => sfx.clang(), 450);
      sfx.sad();
      window.setTimeout(() => speakGlitch('I knew it. Nobody wants to be my friend.'), 900);
      window.setTimeout(() => setEchoLine(true), 2600);
    }
  };
  const sad = cage === 'down' && phase === 'confess';

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
        <div className={`twist-glitch ${phase === 'friends' ? 'befriended' : ''} ${sad ? 'is-sad' : ''}`}>
          {phase === 'friends' && <div className="heart-burst">💛</div>}
          <Glitch className="twist-glitch-svg" mood={phase === 'friends' ? 'happy' : sad ? 'sad' : 'defeated'} />
          {cage !== 'none' && (
            <svg className={`twist-cage cage-${cage}`} viewBox="0 0 120 160" aria-hidden="true">
              <rect x={4} y={4} width={112} height={12} rx={4} fill="#6c757d" stroke="#141018" strokeWidth={4} />
              <rect x={4} y={148} width={112} height={10} rx={3} fill="#6c757d" stroke="#141018" strokeWidth={4} />
              {[14, 32, 50, 68, 86, 104].map((x) => (
                <rect key={x} x={x - 3} y={16} width={6} height={132} fill="#adb5bd" stroke="#141018" strokeWidth={2.5} />
              ))}
              <path d="M50,4 q10,-14 20,0" fill="none" stroke="#141018" strokeWidth={4} />
            </svg>
          )}
        </div>
      </div>

      {phase === 'confess' && (
        <div className="twist-box pop-in">
          <div className="bubble bubble-villain">
            {CONFESSION} <SpeakButton text={CONFESSION} small />
          </div>
          {sad && <div className="bubble bubble-villain sad-bubble pop-in">… I knew it. Nobody wants to be my friend. 😢</div>}
          {lockTry && echoLine && (
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
