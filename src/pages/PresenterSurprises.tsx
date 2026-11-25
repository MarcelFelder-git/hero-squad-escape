// Surprise moments for the presenter. None of them appears in the game itself (no hack, no call),
// so the game events stay a surprise: the Glitch's scanner drone, the hero oath and the password lock.
import { useEffect, useRef, useState } from 'react';
import type { Hero } from '../game/types';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { Echo, Glitch } from '../components/art/Characters';
import { Burst } from '../components/ui';
import { sfx } from '../audio/sound';
import { speak, speakGlitch, stopSpeaking } from '../audio/speech';

/** The Glitch's spy drone – a flying TV with a scanner eye. */
function GlitchDrone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 150" className={className} aria-hidden="true">
      <g className="drone-props">
        <rect x={6} y={8} width={52} height={7} rx={3} fill="#adb5bd" stroke="#141018" strokeWidth={3} />
        <rect x={102} y={8} width={52} height={7} rx={3} fill="#adb5bd" stroke="#141018" strokeWidth={3} />
      </g>
      <path d="M32,15 v14 M128,15 v14" stroke="#141018" strokeWidth={5} />
      <rect x={20} y={26} width={120} height={84} rx={16} fill="#5a189a" stroke="#141018" strokeWidth={5} />
      <rect x={32} y={36} width={96} height={62} rx={9} fill="#10002b" stroke="#141018" strokeWidth={3} />
      <rect x={48} y={52} width={16} height={12} fill="#39ff14" />
      <rect x={96} y={52} width={16} height={12} fill="#39ff14" />
      <path d="M44,46 l20,6 M116,46 l-20,6" stroke="#39ff14" strokeWidth={4} />
      <path d="M60,78 h6 v6 h6 v-6 h6 v6 h6 v-6 h6 v6 h6 v-6" fill="none" stroke="#39ff14" strokeWidth={3} />
      <circle cx={80} cy={124} r={15} fill="#e63946" stroke="#141018" strokeWidth={5} className="drone-eye" />
      <circle cx={75} cy={119} r={4} fill="#ffffffaa" />
    </svg>
  );
}

type ScanPhase = 'fly' | 'ask' | 'freeze' | 'result' | 'gone';

/**
 * Surprise 1: a Glitch drone flies onto the screen and scans the room. Everybody has to FREEZE.
 * Result: "Lots of kids, 0 heroes – kids can't stop me!" → Echo: "He's wrong!"
 */
export function Scan({ voice }: { voice: boolean }) {
  const [phase, setPhase] = useState<ScanPhase>('fly');
  const [count, setCount] = useState(6);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    sfx.whoosh();
    later(1300, () => {
      setPhase('ask');
      sfx.glitch();
      if (voice) speakGlitch('Hello? Who is there? I can hear you!');
    });
    later(4300, () => {
      setPhase('freeze');
      sfx.hack();
      if (voice) speakGlitch('FREEZE! Nobody move! Scanning!');
    });
    for (let i = 1; i <= 6; i++)
      later(4300 + i * 1000, () => {
        setCount(6 - i);
        sfx.click();
      });
    later(10600, () => {
      setPhase('result');
      sfx.unlock();
      if (voice) speakGlitch("Scan complete. Lots of kids. Zero heroes. Ha! Kids can't stop me! Bye bye!");
    });
    later(17500, () => {
      setPhase('gone');
      sfx.whoosh();
      if (voice) later(900, () => speak('He is wrong! Kids CAN be heroes!'));
    });
    const t = timers.current;
    return () => {
      t.forEach(clearTimeout);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`scan is-${phase}`}>
      {phase === 'freeze' && (
        <>
          <div className="scan-tint" />
          <div className="scan-laser" />
          <div className="scan-rec">● REC · SCANNING ROOM …</div>
        </>
      )}
      {phase !== 'gone' && (
        <div className="scan-drone-wrap">
          <GlitchDrone className="scan-drone" />
        </div>
      )}
      {phase === 'ask' && <div className="bubble bubble-villain scan-bubble pop-in">Hello? Who is there? I can hear you! 👀</div>}
      {phase === 'freeze' && (
        <div className="scan-freeze pop-in">
          <div className="scan-big">FREEZE!</div>
          <div className="scan-sub">Nobody move! 🧊 · Niemand bewegt sich!</div>
          <div className="scan-count" key={count}>
            {count}
          </div>
        </div>
      )}
      {phase === 'result' && (
        <div className="scan-result pop-in">
          <div className="scan-result-title">SCAN COMPLETE ✔</div>
          <div className="scan-row">
            <span>👧👦 Kids:</span> <b>LOTS</b>
          </div>
          <div className="scan-row">
            <span>🦸 Heroes:</span> <b className="zero">0</b>
          </div>
          <div className="bubble bubble-villain">Ha! Only kids. Kids can't stop me! Bye-bye! 👋</div>
        </div>
      )}
      {phase === 'gone' && (
        <div className="p-panel scan-echo pop-in">
          <Echo className="pr-echo" talking />
          <div className="caption big">He is wrong! Kids CAN be heroes! 💪</div>
        </div>
      )}
    </div>
  );
}

const OATH = ['I am clever and brave.', 'I always help my friends.', 'I speak English – and I never give up!'];

/** Story beat + audience moment: everybody stands up and repeats the hero oath after Echo. */
export function Oath({ step, heroes, voice }: { step: number; heroes: Hero[]; voice: boolean }) {
  const lines = Math.min(step, OATH.length);
  const done = step > OATH.length;

  useEffect(() => {
    if (step >= 1 && step <= OATH.length) {
      sfx.power();
      if (voice) speak(OATH[step - 1]);
    }
    if (step > OATH.length) {
      sfx.transform();
      if (voice) window.setTimeout(() => speak('Welcome, hero recruits! Now get the power cores back!'), 700);
    }
  }, [step, voice]);

  return (
    <div className={`p-panel oath ${done ? 'oath-done' : ''}`} style={{ ['--power' as string]: done ? 1 : lines / OATH.length }}>
      {done && <div className="flash" />}
      <div className="caption big">{done ? '⚡ HERO RECRUITS! ⚡' : 'The hero oath ✋'}</div>
      {step === 0 && (
        <div className="oath-intro pop-in">
          <Echo className="pr-echo" talking />
          <div className="bubble bubble-echo">
            Everybody, <b>stand up</b>! Raise your <b>right hand</b> and repeat after me!
            <div className="de">Alle aufstehen, rechte Hand hoch und nachsprechen!</div>
          </div>
        </div>
      )}
      {step > 0 && (
        <div className="oath-lines">
          {OATH.slice(0, lines).map((l, i) => (
            <div key={l} className={`oath-line pop-in ${i === lines - 1 && !done ? 'now' : ''}`}>
              “{l}”
            </div>
          ))}
        </div>
      )}
      <div className="oath-heroes">
        {heroes.map((h, i) => (
          <div key={i} className="oath-hero">
            <HeroAvatar hero={h} gear={0} className="p-hero-svg" />
          </div>
        ))}
      </div>
      <div className="oath-meter">
        <i />
        <span>ENGLISH POWER {done ? 100 : Math.round((lines / OATH.length) * 100)}%</span>
      </div>
      {done && <div className="oath-badge pop-in">Now get the power cores back! 🔋</div>}
    </div>
  );
}

const PASSWORD = ['H', 'E', 'R', 'O'];

/**
 * Surprise 2: right before the countdown the Glitch locks the mission with a password.
 * Riddle: "a four-letter word – it's what you want to be!" → the audience spells H-E-R-O in English.
 */
export function PasswordLock({ step, voice }: { step: number; voice: boolean }) {
  const letters = Math.min(step, PASSWORD.length); // step 1–4 = one more letter
  const open = step > PASSWORD.length;
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const ts: number[] = [];
    if (step === 0) {
      sfx.glitch();
      ts.push(window.setTimeout(() => sfx.clang(), 500));
      if (voice)
        ts.push(
          window.setTimeout(
            () => speakGlitch("Not so fast! The mission is locked. You need my password! It's a four letter word. It's what you want to be! Ha ha!"),
            900,
          ),
        );
    } else if (step <= PASSWORD.length) {
      sfx.pow();
      if (voice) speak(step === 1 ? `Spell it in English! ${PASSWORD[0]}` : PASSWORD[step - 1]);
    } else {
      sfx.unlock();
      setBurst(Date.now());
      if (voice) ts.push(window.setTimeout(() => speakGlitch('Noooo! How do you know my password?!'), 600));
    }
    return () => ts.forEach(clearTimeout);
  }, [step, voice]);

  return (
    <div className="p-panel lock-slide">
      <div className="caption big">{open ? 'MISSION UNLOCKED! 🔓' : step >= 1 ? 'Spell it in English! 🔤' : 'MISSION LOCKED 🔒'}</div>
      <div className={`padlock ${open ? 'open' : ''}`}>
        <div className="padlock-shackle" />
        <div className="padlock-body">
          <Glitch className="padlock-glitch" mood={open ? 'defeated' : 'evil'} />
          <div className="padlock-slots">
            {PASSWORD.map((c, i) => (
              <span key={i} className={i < letters ? 'filled pop-in' : ''}>
                {i < letters ? c : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
      {step === 0 && (
        <div className="bubble bubble-villain lock-bubble pop-in">
          Not so fast! You need my <b>password</b>! It's a four-letter word … it's what <b>you</b> want to be! Ha ha!
        </div>
      )}
      {open && <div className="bubble bubble-villain lock-bubble pop-in">NOOO! How do you know my password?! 😱</div>}
      {burst > 0 && <Burst key={burst} text="UNLOCKED!" kind="good" />}
    </div>
  );
}
