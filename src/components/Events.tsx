// Surprise "wow" events that interrupt the game before some levels.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Glitch } from './art/Characters';
import { sfx } from '../audio/sound';
import { speakGlitch, stopSpeaking } from '../audio/speech';
import { useGame } from '../game/GameContext';

const HACK_LINES = [
  '> SYSTEM ALERT …',
  '> FIREWALL: offline',
  '> HERO SQUAD TABLET: hacked',
  '> NEW OWNER: THE GLITCH 😈',
  '> deleting heroes … 12% … 37% …',
];

/** Level 3: the Glitch hacks the tablet. The kids must squash the bugs to get it back. */
export function HackEvent({ onDone }: { onDone: () => void }) {
  const { state } = useGame();
  const [lines, setLines] = useState(0);
  const [phase, setPhase] = useState<'hack' | 'bugs' | 'fixed'>('hack');
  const bugs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: 8 + ((i * 37) % 80),
        top: 18 + ((i * 53) % 62),
        delay: i * 0.3,
      })),
    [],
  );
  const [alive, setAlive] = useState<number[]>(bugs.map((b) => b.id));
  const timers = useRef<number[]>([]);

  useEffect(() => {
    sfx.hack();
    for (let i = 1; i <= HACK_LINES.length; i++) {
      timers.current.push(window.setTimeout(() => setLines(i), i * 450));
    }
    timers.current.push(
      window.setTimeout(() => {
        setPhase('bugs');
        if (!state.muted) speakGlitch('Ha ha! Your tablet is mine now! Only real heroes can squash my bugs!');
      }, HACK_LINES.length * 450 + 600),
    );
    const t = timers.current;
    return () => {
      t.forEach(clearTimeout);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const squash = (id: number) => {
    sfx.pop();
    const rest = alive.filter((a) => a !== id);
    setAlive(rest);
    if (rest.length === 0) {
      setPhase('fixed');
      stopSpeaking();
      sfx.unlock();
    }
  };

  return (
    <div className={`event-overlay hack-overlay ${phase}`}>
      <div className="hack-noise" />
      {phase === 'hack' && (
        <div className="hack-terminal">
          {HACK_LINES.slice(0, lines).map((l) => (
            <div key={l}>{l}</div>
          ))}
          <span className="cursor">█</span>
        </div>
      )}
      {phase === 'bugs' && (
        <>
          <div className="hack-head">
            <Glitch className="hack-glitch glitch-anim" />
            <div className="hack-title">
              HACKED!
              <span>Squash all the bugs – fast! 🐞</span>
              <span className="de">Tippt alle Bugs an, um das Tablet zurückzuholen!</span>
            </div>
          </div>
          {bugs
            .filter((b) => alive.includes(b.id))
            .map((b) => (
              <button
                key={b.id}
                className="hack-bug"
                style={{ left: `${b.left}%`, top: `${b.top}%`, animationDelay: `${b.delay}s` }}
                onClick={() => squash(b.id)}
                aria-label="Bug"
              >
                🐞
              </button>
            ))}
        </>
      )}
      {phase === 'fixed' && (
        <div className="hack-fixed pop-in">
          <div className="big-word">SYSTEM RESTORED!</div>
          <p>Great teamwork! The tablet is yours again.</p>
          <button className="btn btn-big btn-yellow" onClick={onDone}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

const CALL_TEXT =
  "Hello, heroes. It's me, THE GLITCH. You are very good at English. Too good! So now I'm switching off the lights. Three … two … one … Good night!";

/** Level 5: incoming video call from the Glitch – then the lights go out. */
export function CallEvent({ onDone }: { onDone: () => void }) {
  const { state } = useGame();
  const [phase, setPhase] = useState<'ring' | 'talk' | 'dark'>('ring');
  const [declineTries, setDeclineTries] = useState(0);
  const [decPos, setDecPos] = useState({ x: 0, y: 0 });
  const ringTimer = useRef(0);

  useEffect(() => {
    sfx.ring();
    ringTimer.current = window.setInterval(() => sfx.ring(), 2600);
    return () => {
      clearInterval(ringTimer.current);
      stopSpeaking();
    };
  }, []);

  const goDark = () => {
    setPhase('dark');
    sfx.powerDown();
    window.setTimeout(onDone, 2600);
  };

  const accept = () => {
    clearInterval(ringTimer.current);
    sfx.select();
    setPhase('talk');
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      goDark();
    };
    if (state.muted) window.setTimeout(finish, 6500);
    else {
      speakGlitch(CALL_TEXT, finish);
      window.setTimeout(finish, 14000); // fallback if speech never ends
    }
  };

  const decline = () => {
    sfx.glitch();
    setDeclineTries((d) => d + 1);
    setDecPos({ x: (Math.random() - 0.5) * 260, y: (Math.random() - 0.5) * 120 });
  };

  return (
    <div className={`event-overlay call-overlay ${phase}`}>
      {phase !== 'dark' && (
        <div className="phone pop-in">
          <div className="phone-top">{phase === 'ring' ? '📞 Incoming video call …' : '🔴 LIVE'}</div>
          <Glitch className={`phone-glitch glitch-anim ${phase === 'talk' ? 'talking' : 'ringing'}`} />
          <div className="phone-name">THE GLITCH</div>
          {phase === 'ring' && (
            <>
              <p className="muted small">{declineTries > 0 ? 'Ha ha! You can\'t decline ME!' : 'Who is calling you?'}</p>
              <div className="phone-btns">
                <button
                  className="call-btn decline"
                  style={{ transform: `translate(${decPos.x}px, ${decPos.y}px)` }}
                  onClick={decline}
                  aria-label="Ablehnen"
                >
                  ✆
                </button>
                <button className="call-btn accept" onClick={accept} aria-label="Annehmen">
                  ✆
                </button>
              </div>
            </>
          )}
          {phase === 'talk' && <div className="bubble bubble-villain phone-bubble">{CALL_TEXT}</div>}
        </div>
      )}
      {phase === 'dark' && <div className="lights-off-text">💡 … POWER OFF …</div>}
    </div>
  );
}
