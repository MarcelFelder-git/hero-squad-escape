// Presenter intro (/presenter): comic slides for the teacher, mirrored from an iPad to the projector.
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Hero } from '../game/types';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { Echo, Glitch } from '../components/art/Characters';
import { CityBackdrop } from '../components/art/Scenes';
import { Rocket } from '../components/art/Rocket';
import { Burst } from '../components/ui';
import { GEAR } from '../data/levels';
import { sfx, setMuted, unlockAudio } from '../audio/sound';
import { speak, speakGlitch, stopSpeaking } from '../audio/speech';
import { Oath, PasswordLock, Scan } from './PresenterSurprises';

const PIN = '4242';

const INTROS = ["I'm super fast! ⚡", "I'm very brave! 🛡", 'I have cool gadgets! 🔧'];

const DEMO: Hero[] = [
  {
    name: 'Lightning Leo',
    power: 'speedster',
    look: { shirt: '#f9844a', suit: '#1e88e5', cape: '#ffd60a', skin: '#6b4226', hair: '#111111', hairStyle: 'spiky', mask: 'eyemask', emblem: 'bolt', accessory: 'none' },
  },
  {
    name: 'Star Girl',
    power: 'shield',
    look: { shirt: '#90be6d', suit: '#e63946', cape: '#7b2cbf', skin: '#8d5524', hair: '#111111', hairStyle: 'curly', mask: 'visor', emblem: 'star', accessory: 'none' },
  },
  {
    name: 'Captain Comet',
    power: 'gadget',
    look: { shirt: '#577590', suit: '#2ecc71', cape: '#e63946', skin: '#ffe0c7', hair: '#f4d35e', hairStyle: 'short', mask: 'goggles', emblem: 'moon', accessory: 'glasses' },
  },
];

interface Slide {
  id: string;
  steps: number;
  /** surprise slides have no dot in the navigation */
  secret?: boolean;
}

const SLIDES: Slide[] = [
  { id: 'title', steps: 1 },
  { id: 'city', steps: 3 },
  { id: 'glitch', steps: 3 },
  { id: 'quiz1', steps: 1 },
  { id: 'scan', steps: 1, secret: true },
  { id: 'help', steps: 2 },
  { id: 'oath', steps: 5 },
  { id: 'mission', steps: 3 },
  { id: 'quiz2', steps: 1 },
  { id: 'lock', steps: 6, secret: true },
  { id: 'ready', steps: 1 },
];

function PinGate({ onOk }: { onOk: () => void }) {
  const [pin, setPin] = useState('');
  const [bad, setBad] = useState(false);
  const press = (d: string) => {
    const p = (pin + d).slice(0, 4);
    setPin(p);
    if (p.length === 4) {
      if (p === PIN) {
        sessionStorage.setItem('presenter-ok', '1');
        onOk();
      } else {
        setBad(true);
        setTimeout(() => {
          setPin('');
          setBad(false);
        }, 600);
      }
    }
  };
  return (
    <div className="pin-gate">
      <div className={`panel pin-box ${bad ? 'shake1' : ''}`}>
        <h2>🎬 Presenter</h2>
        <div className="pin-dots">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} className={i < pin.length ? 'on' : ''} />
          ))}
        </div>
        <div className="pin-pad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((d, i) =>
            d ? (
              <button key={i} className="btn btn-ghost" onClick={() => (d === '⌫' ? setPin(pin.slice(0, -1)) : press(d))}>
                {d}
              </button>
            ) : (
              <span key={i} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function Quiz({ before, after, options, explain }: { before: string; after: string; options: string[]; explain: string }) {
  const shuffled = useMemo(() => [...options].sort(() => Math.random() - 0.5), [options]);
  const [bad, setBad] = useState<string[]>([]);
  const [ok, setOk] = useState(false);
  const [burst, setBurst] = useState<{ id: number; good: boolean } | null>(null);
  const pick = (o: string) => {
    if (ok) return;
    if (o === options[0]) {
      setOk(true);
      sfx.pow();
      sfx.correct();
      setBurst({ id: Date.now(), good: true });
      speak(`${before} ${o} ${after}`);
    } else {
      setBad([...bad, o]);
      sfx.wrong();
      setBurst({ id: Date.now(), good: false });
    }
  };
  return (
    <div className="p-quiz">
      <div className="p-quiz-kicker">🙋 Audience question!</div>
      <div className="p-quiz-sentence">
        {before} <span className={`p-gap ${ok ? 'ok' : ''}`}>{ok ? options[0] : '____'}</span> {after}
      </div>
      <div className="p-quiz-opts">
        {shuffled.map((o) => (
          <button key={o} className={`btn btn-big ${bad.includes(o) ? 'opt-bad' : ok && o === options[0] ? 'btn-yellow' : 'btn-ghost'}`} onClick={() => pick(o)}>
            {o}
          </button>
        ))}
      </div>
      {ok && <div className="p-explain pop-in">{explain}</div>}
      {burst && <Burst key={burst.id} text={burst.good ? 'POW!' : 'BZZT!'} kind={burst.good ? 'good' : 'bad'} />}
    </div>
  );
}

function Countdown() {
  const [n, setN] = useState<number | null>(null);
  const go = () => {
    unlockAudio();
    setN(3);
    sfx.click();
  };
  useEffect(() => {
    if (n === null || n === 0) return;
    const t = setTimeout(() => {
      const next = n - 1;
      setN(next);
      if (next === 0) {
        sfx.victory();
        speak('Go, heroes!');
      } else sfx.click();
    }, 900);
    return () => clearTimeout(t);
  }, [n]);
  if (n === null)
    return (
      <button className="btn btn-big btn-yellow p-yes pulse-btn" onClick={go}>
        YES! 🦸
      </button>
    );
  return (
    <div className={`p-count ${n === 0 ? 'go' : ''}`} key={n}>
      {n === 0 ? 'GO, HEROES!' : n}
    </div>
  );
}

export default function Presenter() {
  const [ok, setOk] = useState(() => sessionStorage.getItem('presenter-ok') === '1');
  const [s, setS] = useState(0);
  const [step, setStep] = useState(0);
  const [voice, setVoice] = useState(true);
  const slide = SLIDES[s];

  useEffect(() => {
    setMuted(false);
    document.title = 'Hero Squad – Presenter';
  }, []);

  const say = useCallback((text: string, glitch = false) => {
    if (!voice) return;
    if (glitch) speakGlitch(text);
    else speak(text);
  }, [voice]);

  // sounds + voice per step
  useEffect(() => {
    if (!ok) return;
    const id = slide.id;
    if (id === 'city' && step === 1) say('Meet the Hero Squad!');
    if (id === 'city' && step === 2) say("Let's play a board game!");
    if (id === 'glitch' && step === 1) sfx.powerDown();
    if (id === 'glitch' && step === 2) {
      sfx.glitch();
      setTimeout(() => say('Good evening, heroes! I took your superpowers. Now you are normal people, and nobody laughs at me any more! Mwahaha!', true), 400);
    }
    if (id === 'help' && step === 1) say("We aren't strong now, but we are friends. Let's ask the kids of Hero City for help!");
    if (id === 'mission') sfx.pop();
    if (id === 'title') sfx.power();
  }, [s, step, ok, slide.id, say]);

  const next = useCallback(() => {
    unlockAudio();
    stopSpeaking();
    sfx.whoosh();
    if (step + 1 < slide.steps) setStep(step + 1);
    else if (s + 1 < SLIDES.length) {
      setS(s + 1);
      setStep(0);
    }
  }, [s, step, slide.steps]);

  const prev = useCallback(() => {
    stopSpeaking();
    if (step > 0) setStep(step - 1);
    else if (s > 0) {
      setS(s - 1);
      setStep(SLIDES[s - 1].steps - 1);
    }
  }, [s, step]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(e.key)) {
        e.preventDefault();
        next();
      }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) prev();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [next, prev]);

  if (!ok) return <PinGate onOk={() => setOk(true)} />;

  const darkness = slide.id === 'glitch' && step >= 1;

  return (
    <div className={`presenter slide-${slide.id} ${darkness ? 'p-dark' : ''}`}>
      <div className="p-stage" key={`${s}`}>
        {slide.id === 'title' && (
          <div className="p-title">
            <CityBackdrop />
            <div className="p-title-text pop-in">
              <div className="title-kicker">English · Class 6 · Open Day</div>
              <h1 className="comic-title">
                <span className="t1">HERO SQUAD</span>
                <span className="t2">Escape from The Glitch</span>
              </h1>
            </div>
          </div>
        )}

        {slide.id === 'city' && (
          <div className="p-panel">
            <div className="caption big">Hero City. Friday night. The heroes are at Hero HQ …</div>
            <div className="p-heroes">
              {DEMO.map((h, i) => (
                <div key={i} className="p-hero">
                  {step === 1 && (
                    <div className="bubble bubble-echo p-intro pop-in" style={{ animationDelay: `${i * 0.35}s` }}>
                      {INTROS[i]}
                    </div>
                  )}
                  <HeroAvatar hero={h} gear={8} className="p-hero-svg bob" />
                  <b>{h.name}</b>
                </div>
              ))}
            </div>
            {step >= 2 && <div className="bubble bubble-echo p-bubble pop-in">It's game night at Hero HQ. Let's play a board game! 🎲</div>}
          </div>
        )}

        {slide.id === 'glitch' && (
          <div className="p-panel">
            <div className="caption big">{step === 0 ? 'Suddenly …' : 'ALL THE LIGHTS WENT OUT!'}</div>
            {step >= 2 && (
              <div className="p-glitch-screen pop-in">
                <Glitch className="p-glitch glitch-anim" />
                <div className="bubble bubble-villain">I took your superpowers! Now you are normal people – and nobody laughs at ME any more! Mwahaha!</div>
              </div>
            )}
            <div className="p-heroes">
              {DEMO.map((h, i) => (
                <div key={i} className="p-hero">
                  <HeroAvatar key={step >= 2 ? 'n' : 'h'} hero={h} gear={step >= 2 ? 0 : 8} className={`p-hero-svg ${step >= 2 ? 'transform-in' : ''}`} />
                  <b>{h.name}</b>
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.id === 'quiz1' && (
          <Quiz before="Yesterday The Glitch" after="the superpowers." options={['took', 'taked', 'takes']} explain="take → took (simple past, irregular verb) ✔" />
        )}

        {slide.id === 'help' && (
          <div className="p-panel">
            <div className="caption big">The heroes are scared. But Star Girl has an idea …</div>
            <div className="p-heroes">
              {DEMO.map((h, i) => (
                <div key={i} className="p-hero">
                  <HeroAvatar hero={h} gear={0} className="p-hero-svg" />
                  <b>{h.name}</b>
                </div>
              ))}
            </div>
            {step >= 1 && (
              <div className="bubble bubble-echo p-bubble pop-in">
                "We aren't strong now, but we are friends. Let's ask the <b>kids of Hero City</b> for help. They are clever and brave!"
              </div>
            )}
          </div>
        )}

        {slide.id === 'mission' && (
          <div className="p-panel">
            <div className="caption big">Your mission, hero recruits: get the superpowers back!</div>
            <div className="p-steps">
              <div className="p-step pop-in">
                <span className="p-step-num">1</span>
                <div className="p-step-icon">📄🖍</div>
                <b>Crack the secret code</b>
                <span>Read the story, answer the questions, colour the code – and scan it!</span>
              </div>
              {step >= 1 && (
                <div className="p-step pop-in">
                  <span className="p-step-num">2</span>
                  <div className="p-step-icon">
                    <Rocket color="#ff006e" className="p-step-rocket" />
                  </div>
                  <b>Become a hero</b>
                  <span>8 levels on the iPad. After every level a rocket brings new hero gear: {GEAR.map((g) => g.icon).join(' ')}</span>
                </div>
              )}
              {step >= 2 && (
                <div className="p-step pop-in">
                  <span className="p-step-num">3</span>
                  <div className="p-step-icon">🏆📺</div>
                  <b>Hall of Heroes</b>
                  <span>Your hero cards appear here on the big screen!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {slide.id === 'scan' && <Scan voice={voice} />}

        {slide.id === 'oath' && <Oath step={step} heroes={DEMO} voice={voice} />}

        {slide.id === 'lock' && <PasswordLock step={step} voice={voice} />}

        {slide.id === 'quiz2' && (
          <Quiz before="A hero is always there for you. A hero is" after="." options={['reliable', 'lazy', 'shy']} explain="reliable = zuverlässig ✔" />
        )}

        {slide.id === 'ready' && (
          <div className="p-panel p-ready">
            <div className="p-ready-row">
              <Echo className="pr-echo" talking />
              <div className="caption big">Are you ready, heroes?</div>
            </div>
            <Countdown />
          </div>
        )}
      </div>

      <nav className="p-nav">
        <button className="icon-btn" onClick={prev} aria-label="Zurück">
          ◀
        </button>
        <div className="p-dots">
          {SLIDES.map((sl, i) =>
            sl.secret ? null : <i key={sl.id} className={i === s ? 'now' : i < s ? 'done' : ''} />,
          )}
        </div>
        <button className="icon-btn" onClick={() => setVoice((v) => !v)} aria-label="Stimme an/aus" title="Vorlesen an/aus">
          {voice ? '🗣' : '🤐'}
        </button>
        <a className="icon-btn" href="/hall" title="Hall of Heroes">
          🏆
        </a>
        <button className="btn btn-yellow p-next" onClick={next}>
          Next ▶
        </button>
      </nav>
    </div>
  );
}
