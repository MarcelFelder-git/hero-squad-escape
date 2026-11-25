import { useEffect, useState } from 'react';
import { useGame } from '../game/GameContext';
import { CityBackdrop } from '../components/art/Scenes';
import { Echo, Glitch } from '../components/art/Characters';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { Person } from '../components/art/Person';
import { SpeakButton } from '../components/ui';
import { sfx, unlockAudio } from '../audio/sound';
import { powerInfo } from '../data/heroOptions';
import { entryViaQr } from '../route';
import { nextVariant } from '../game/state';

function AccessGranted({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    sfx.unlock();
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="event-overlay access-overlay" onClick={onDone}>
      <div className="access-box pop-in">
        <div className="access-scan" />
        <div className="access-title">ACCESS GRANTED</div>
        <p>QR code cracked! Welcome to Hero HQ, heroes!</p>
        <p className="de">Code geknackt – willkommen im Hauptquartier!</p>
      </div>
    </div>
  );
}

export function TitleScreen() {
  const { state, dispatch } = useGame();
  const [granted, setGranted] = useState(entryViaQr && state.phase === 'title');
  return (
    <div className="screen title-screen">
      {granted && <AccessGranted onDone={() => setGranted(false)} />}
      <CityBackdrop />
      <div className="title-content">
        <div className="title-kicker">Englisch · Klasse 6 · Escape Mission</div>
        <h1 className="comic-title">
          <span className="t1">HERO SQUAD</span>
          <span className="t2">Escape from The Glitch</span>
        </h1>
        <p className="title-sub">
          The Glitch has stolen the superpowers – now all the heroes are <b>normal people</b>!
          <br />
          <span className="de">Werdet in 8 Leveln vom normalen Kind zum Superhelden und holt die Superkräfte zurück!</span>
        </p>
        <button
          className="btn btn-big btn-yellow pulse-btn"
          onClick={() => {
            unlockAudio();
            sfx.power();
            dispatch({ type: 'GOTO', phase: 'players' });
          }}
        >
          ▶ START MISSION
        </button>
        <div className="title-facts">
          <span>👥 1–3 Spieler</span>
          <span>⏱ ca. 20–25 Minuten</span>
          <span>🚀 8 Level</span>
        </div>
      </div>
      <Glitch className="title-glitch float" />
    </div>
  );
}

const SILHOUETTES = [
  { suit: '#f9844a', hair: '#3b2416', hairStyle: 'spiky' as const, skin: '#f6c9a0' },
  { suit: '#90be6d', hair: '#f4d35e', hairStyle: 'curly' as const, skin: '#e0a878' },
  { suit: '#577590', hair: '#111111', hairStyle: 'straight' as const, skin: '#8d5524' },
];

export function PlayerSelect() {
  const { dispatch } = useGame();
  return (
    <div className="screen center-screen players-screen">
      <h1 className="comic-h">How many heroes?</h1>
      <p className="de lead">Wie viele Spieler*innen sind in eurem Team? Ihr spielt alle zusammen an diesem Gerät.</p>
      <div className="player-cards">
        {([1, 2, 3] as const).map((n) => (
          <button
            key={n}
            className="player-card panel"
            onClick={() => {
              sfx.select();
              dispatch({ type: 'SET_PLAYERS', count: n });
            }}
          >
            <div className="player-figs">
              {SILHOUETTES.slice(0, n).map((s, i) => (
                <Person key={i} {...s} legs="#3d5a80" className="player-fig" />
              ))}
            </div>
            <div className="player-num">{n}</div>
            <div className="player-label">{n === 1 ? 'Solo Hero' : n === 2 ? 'Hero Duo' : 'Hero Trio'}</div>
          </button>
        ))}
      </div>
      <button className="btn btn-ghost" onClick={() => dispatch({ type: 'GOTO', phase: 'title' })}>
        ← Zurück
      </button>
    </div>
  );
}

export function Briefing() {
  const { state, dispatch } = useGame();
  const names = state.heroes.map((h) => h.name);
  const nameList = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  const glitchLine =
    "Mwahaha! I am THE GLITCH! Yesterday I took all the superpowers of Hero City. Now all the heroes are normal people. Nobody can stop me – nobody!";
  const echoLine = `Hello, ${nameList}! I am ECHO, the HQ computer. You are normal kids now – but you can become heroes! Finish 8 levels and get the superpowers back. After every level a rocket brings you new hero gear!`;

  return (
    <div className="screen briefing-screen">
      <div className="comic-strip">
        <div className="comic-panel panel p-villain">
          <div className="caption">Hero City, 8 o'clock in the evening …</div>
          <Glitch className="brief-glitch glitch-anim" />
          <div className="bubble bubble-villain">
            {glitchLine} <SpeakButton text={glitchLine} small />
          </div>
        </div>
        <div className="comic-panel panel p-echo">
          <div className="caption">Meanwhile, at school … just normal kids?</div>
          <div className="brief-heroes">
            {state.heroes.map((h, i) => (
              <HeroAvatar key={i} hero={h} gear={0} className="brief-hero" />
            ))}
            <Echo className="brief-echo" talking />
          </div>
          <div className="bubble bubble-echo">
            {echoLine} <SpeakButton text={echoLine} small />
          </div>
        </div>
      </div>

      <div className="panel brief-rules">
        <h2>🎯 Eure Mission</h2>
        <ul>
          <li>
            <b>🚀 8 Level.</b> Nach jedem Level bringt eine Rakete ein neues Stück Helden-Ausrüstung – vom normalen Kind zum
            Superhelden!
          </li>
          <li>
            <b>💡 Hint</b>: 2 Tipps pro Aufgabe (kosten ein paar Punkte). <b>📖 Glossary</b>: Nachschlagen ist erlaubt!
          </li>
          <li>
            <b>⏱ ca. 20–25 Minuten.</b> Kein Stress – es gibt kein Game Over.
          </li>
          {state.heroes.length > 1 && (
            <li>
              <b>👥 Teamwork:</b> Achtet auf die Team-Aufgaben – jede*r hat eine Rolle!
            </li>
          )}
          <li>
            <b>Eure Superkräfte:</b>{' '}
            {state.heroes.map((h) => `${powerInfo(h.power).icon} ${h.name} (${powerInfo(h.power).name})`).join(' · ')}
          </li>
        </ul>
        <button
          className="btn btn-big btn-yellow"
          onClick={() => {
            unlockAudio();
            sfx.unlock();
            dispatch({ type: 'START_MISSION', variant: nextVariant() });
          }}
        >
          🚀 Mission starten!
        </button>
      </div>
    </div>
  );
}
