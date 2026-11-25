// Surprise moments for the presenter: the Glitch hijacks the show, a highlights teaser, a live call.
import { useEffect, useRef, useState } from 'react';
import type { Hero } from '../game/types';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { Glitch } from '../components/art/Characters';
import { Rocket } from '../components/art/Rocket';
import { sfx } from '../audio/sound';
import { speakGlitch, stopSpeaking } from '../audio/speech';

const HIJACK_LINES = ['> INCOMING SIGNAL …', '> PRESENTATION: hacked', '> NEW PRESENTER: THE GLITCH 😈'];

/**
 * The Glitch takes over the projector. The audience has to shout "HERO SQUAD!" until the meter is full.
 * With the mic switched on the meter reacts to the noise in the room; otherwise every tap / Next / clicker press = one shout.
 */
export function Hijack({ tick, voice, onDone }: { tick: number; voice: boolean; onDone: () => void }) {
  const [phase, setPhase] = useState<'noise' | 'shout' | 'beaten'>('noise');
  const [lines, setLines] = useState(0);
  const [meter, setMeter] = useState(0);
  const [level, setLevel] = useState(0);
  const [mic, setMic] = useState<'off' | 'on' | 'error'>('off');
  const micStop = useRef<() => void>(() => {});
  const meterRef = useRef(0);
  const firstTick = useRef(tick);
  const won = useRef(false);

  useEffect(() => {
    sfx.glitch();
    sfx.hack();
    const ts = HIJACK_LINES.map((_, i) => window.setTimeout(() => setLines(i + 1), 300 + i * 500));
    ts.push(
      window.setTimeout(() => {
        setPhase('shout');
        sfx.glitch();
        if (voice) speakGlitch('Stop! This is MY show now! Only a loud hero squad can stop me. Everybody, shout: HERO SQUAD!');
      }, 2300),
    );
    return () => {
      ts.forEach(clearTimeout);
      stopSpeaking();
      micStop.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = (n: number) => {
    if (phase !== 'shout' || won.current) return;
    const m = Math.min(100, meterRef.current + n);
    const before = meterRef.current;
    meterRef.current = m;
    setMeter(m);
    if (before < 50 && m >= 50) {
      sfx.glitch();
      if (voice) {
        stopSpeaking();
        speakGlitch('Ouch! My ears! Stop it!');
      }
    }
    if (m >= 100) win();
  };

  const win = () => {
    won.current = true;
    setPhase('beaten');
    micStop.current();
    stopSpeaking();
    sfx.pow();
    sfx.unlock();
    window.setTimeout(() => {
      if (voice) speakGlitch("Noooo! Too loud! OK, OK. You win this time. But you can't beat my levels! Ha ha ha!");
    }, 500);
    onDone();
  };

  // Next button / clicker = one shout
  useEffect(() => {
    if (tick !== firstTick.current) {
      add(25);
      sfx.pow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const ac = new AudioContext();
      const an = ac.createAnalyser();
      an.fftSize = 1024;
      ac.createMediaStreamSource(stream).connect(an);
      const buf = new Float32Array(an.fftSize);
      let raf = 0;
      let last = performance.now();
      const loop = (now: number) => {
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        an.getFloatTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += v * v;
        const rms = Math.sqrt(sum / buf.length);
        setLevel(Math.min(1, rms * 4));
        const gain = Math.max(0, rms - 0.04) * 260 * dt;
        if (gain > 0) add(gain);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      micStop.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        ac.close();
        micStop.current = () => {};
      };
      setMic('on');
    } catch {
      setMic('error');
    }
  };

  const shrink = 1 - meter * 0.004;

  return (
    <div className={`hijack ${phase}`}>
      <div className="hack-noise" />
      {phase === 'noise' && (
        <div className="hack-terminal">
          {HIJACK_LINES.slice(0, lines).map((l) => (
            <div key={l}>{l}</div>
          ))}
          <span className="cursor">█</span>
        </div>
      )}
      {phase === 'shout' && (
        <div className="hijack-shout">
          <div className="hijack-villain" style={{ transform: `scale(${shrink})` }}>
            <Glitch className={`hijack-glitch glitch-anim ${meter > 50 ? 'hurt' : ''}`} mood={meter > 50 ? 'angry' : 'evil'} />
            <div className="bubble bubble-villain hijack-bubble">
              {meter < 50 ? (
                <>
                  STOP! This is <b>MY</b> show now! Only a <b>LOUD</b> hero squad can stop me!
                </>
              ) : (
                <>Ouch! My ears! STOP IT! 🙉</>
              )}
            </div>
          </div>
          <div className="hijack-call">📢 Everybody shout: “HERO SQUAD!”</div>
          <div className="hijack-meter">
            <i style={{ width: `${meter}%` }} />
            <span>HERO POWER {Math.round(meter)}%</span>
          </div>
          <div className="hijack-controls">
            <button className="btn btn-big btn-yellow" onClick={() => (sfx.pow(), add(25))}>
              📢 HERO SQUAD!
            </button>
            {mic === 'off' && (
              <button className="btn btn-ghost" onClick={startMic} title="Das Mikrofon misst, wie laut die Klasse ruft">
                🎤 Mic
              </button>
            )}
            {mic === 'on' && (
              <span className="hijack-mic">
                🎤 <i style={{ width: `${level * 100}%` }} />
              </span>
            )}
            {mic === 'error' && <span className="muted small">kein Mikro – einfach tippen</span>}
          </div>
        </div>
      )}
      {phase === 'beaten' && (
        <div className="hijack-beaten pop-in">
          <Glitch className="hijack-glitch spin-away" mood="defeated" />
          <div className="big-word">SYSTEM RESTORED!</div>
          <div className="bubble bubble-villain">NOOO! Too loud! … OK, OK. But you can't beat my <b>LEVELS</b>! Ha ha ha!</div>
        </div>
      )}
    </div>
  );
}

function GearCycle({ hero }: { hero: Hero }) {
  const [g, setG] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setG((x) => (x + 1) % 10), 750);
    return () => clearInterval(t);
  }, []);
  const gear = Math.min(8, g);
  return (
    <div className="hl-gear">
      <HeroAvatar key={gear} hero={hero} gear={gear} className="hl-hero hl-pop" />
      <span className="hl-gear-num">{gear === 0 ? 'normal kid' : gear === 8 ? 'SUPERHERO!' : `level ${gear}`}</span>
    </div>
  );
}

/** Teaser: what is waiting for the kids – revealed two cards per click. */
export function Highlights({ step, hero }: { step: number; hero: Hero }) {
  const cards = [
    {
      key: 'gear',
      art: <GearCycle hero={hero} />,
      title: 'From normal kid to SUPERHERO',
      de: 'Nach jedem Level: neue Hero-Ausrüstung',
    },
    {
      key: 'rocket',
      art: <Rocket color="#ff006e" className="hl-rocket" />,
      title: 'Rockets from Hero HQ',
      de: 'Eine Rakete bringt eure Belohnung',
    },
    {
      key: 'call',
      art: (
        <div className="hl-phone">
          <Glitch className="hl-phone-glitch" />
          <span>📞</span>
        </div>
      ),
      title: 'The Glitch calls YOU',
      de: 'Ein echter Anruf mitten im Spiel …',
    },
    {
      key: 'dark',
      art: (
        <div className="hl-dark">
          <p>Once upon a time, a little robot was very lonely …</p>
        </div>
      ),
      title: 'Read in the dark 🔦',
      de: 'Lesen mit der Taschenlampe',
    },
    {
      key: 'end',
      art: (
        <div className="hl-secret">
          <Glitch className="hl-secret-glitch" />
          <span>?</span>
        </div>
      ),
      title: 'A surprise ending … 🤫',
      de: 'Wie endet die Geschichte? Geheim!',
    },
    {
      key: 'bonus',
      art: (
        <div className="hl-run">
          <HeroAvatar hero={hero} gear={7} className="hl-run-hero" />
          <span className="hl-run-bug">🐞</span>
          <span className="hl-run-hq">🏆</span>
        </div>
      ),
      title: 'Bonus game + Hall of Heroes',
      de: 'Jump’n’Run und eure Heldenkarte auf der Leinwand',
    },
  ];
  return (
    <div className="p-panel">
      <div className="caption big">What's waiting for you? 🤩</div>
      <div className="hl-grid">
        {cards.map((c, i) =>
          i < (step + 1) * 2 ? (
            <div key={c.key} className="hl-card pop-in" style={{ animationDelay: `${(i % 2) * 0.15}s` }}>
              <div className="hl-art">{c.art}</div>
              <b>{c.title}</b>
              <span>{c.de}</span>
            </div>
          ) : (
            <div key={c.key} className="hl-card hl-hidden">
              <span>?</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

const CALL_TEXT = "Hello, kids of Hero City! I heard you want to help the heroes. Ha ha! My puzzles are much too difficult for you. You can't do it! … Or can you?";

/** Right before the countdown: the Glitch calls the projector. */
export function PresenterCall({ voice }: { voice: boolean }) {
  const [phase, setPhase] = useState<'ring' | 'talk' | 'after'>('ring');
  const [tries, setTries] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ring = useRef(0);

  useEffect(() => {
    const start = window.setTimeout(() => {
      sfx.ring();
      ring.current = window.setInterval(() => sfx.ring(), 2600);
    }, 400);
    return () => {
      clearTimeout(start);
      clearInterval(ring.current);
      stopSpeaking();
    };
  }, []);

  const accept = () => {
    clearInterval(ring.current);
    sfx.select();
    setPhase('talk');
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      sfx.glitch();
      setPhase('after');
    };
    if (voice) {
      speakGlitch(CALL_TEXT, finish);
      window.setTimeout(finish, 15000);
    } else window.setTimeout(finish, 7000);
  };

  if (phase === 'after')
    return (
      <div className="p-panel p-call-after pop-in">
        <Glitch className="p-call-glitch glitch-anim" />
        <div className="caption big">Can you do it? 🤔</div>
        <div className="p-call-shout">Show him, heroes! 💪</div>
      </div>
    );

  return (
    <div className="p-call">
      <div className="phone pop-in">
        <div className="phone-top">{phase === 'ring' ? '📞 Incoming video call …' : '🔴 LIVE'}</div>
        <Glitch className={`phone-glitch glitch-anim ${phase === 'talk' ? 'talking' : 'ringing'}`} />
        <div className="phone-name">THE GLITCH</div>
        {phase === 'ring' && (
          <>
            <p className="muted small">{tries > 0 ? "Ha ha! You can't decline ME!" : 'Who is calling?'}</p>
            <div className="phone-btns">
              <button
                className="call-btn decline"
                style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                onClick={() => {
                  sfx.glitch();
                  setTries((t) => t + 1);
                  setPos({ x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 140 });
                }}
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
    </div>
  );
}
