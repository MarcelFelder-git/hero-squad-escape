import { useGame } from '../game/GameContext';
import { CityBackdrop } from '../components/art/Scenes';
import { Echo, Glitch } from '../components/art/Characters';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { Person } from '../components/art/Person';
import { SpeakButton } from '../components/ui';
import { sfx, unlockAudio } from '../audio/sound';
import { powerInfo } from '../data/heroOptions';

export function TitleScreen() {
  const { dispatch } = useGame();
  return (
    <div className="screen title-screen">
      <CityBackdrop />
      <div className="title-content">
        <div className="title-kicker">Englisch · Klasse 6 · Escape Mission</div>
        <h1 className="comic-title">
          <span className="t1">HERO SQUAD</span>
          <span className="t2">Escape from The Glitch</span>
        </h1>
        <p className="title-sub">
          The Glitch has locked the <b>Friendship &amp; Hero HQ</b> and stolen the power cores.
          <br />
          <span className="de">Rettet das Hauptquartier – mit euren Englisch-Superkräften!</span>
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
          <span>⏱ ca. 20 Minuten</span>
          <span>🚪 5 Räume</span>
        </div>
      </div>
      <Glitch className="title-glitch float" />
    </div>
  );
}

const SILHOUETTES = [
  { suit: '#e63946', cape: '#ffd60a', hair: '#3b2416', hairStyle: 'spiky' as const, skin: '#f6c9a0' },
  { suit: '#1e88e5', cape: '#e63946', hair: '#f4d35e', hairStyle: 'curly' as const, skin: '#e0a878' },
  { suit: '#2ecc71', cape: '#7b2cbf', hair: '#111111', hairStyle: 'straight' as const, skin: '#8d5524' },
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
                <Person key={i} {...s} emblem="star" mask="eyemask" className="player-fig" />
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
    "Mwahaha! I am THE GLITCH! Yesterday I locked your Hero HQ and I took all the power cores. Nobody can stop me – nobody!";
  const echoLine = `Don't worry, ${nameList}! I am ECHO, the HQ computer. We must open 5 rooms and get back the cores. Use your English power!`;

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
          <div className="caption">Meanwhile, at the HQ …</div>
          <div className="brief-heroes">
            {state.heroes.map((h, i) => (
              <HeroAvatar key={i} hero={h} className="brief-hero" />
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
            <b>5 Räume</b>, in jedem Raum 2 Rätsel. Für jeden Raum bekommt ihr einen Energie-Kern zurück.
          </li>
          <li>
            <b>💡 Hint</b>: Pro Rätsel gibt es 2 Tipps (kosten ein paar Punkte). <b>📖 Glossary</b>: Vokabeln nachschlagen ist
            erlaubt!
          </li>
          <li>
            <b>⏱ ca. 20 Minuten.</b> Kein Stress – es gibt kein Game Over.
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
            dispatch({ type: 'START_MISSION' });
          }}
        >
          🚀 Mission starten!
        </button>
      </div>
    </div>
  );
}
