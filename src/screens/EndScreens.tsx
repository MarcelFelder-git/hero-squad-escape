import { useEffect, useMemo } from 'react';
import { useGame } from '../game/GameContext';
import { ROOMS } from '../data/rooms';
import { computeResult, formatTime } from '../game/state';
import { Core, Echo, Glitch } from '../components/art/Characters';
import { CityBackdrop } from '../components/art/Scenes';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { sfx } from '../audio/sound';

export function TransitionScreen() {
  const { state, dispatch } = useGame();
  const room = ROOMS[state.roomIndex];
  const last = state.roomIndex === ROOMS.length - 1;
  const rs = state.roomStats[state.roomIndex];
  const leader = state.heroes[state.roomIndex % state.heroes.length];

  useEffect(() => {
    if (last) sfx.victory();
  }, [last]);

  return (
    <div className="screen center-screen transition-screen">
      <div className="rays" style={{ ['--core' as string]: room.coreColor }} />
      <div className="panel transition-card pop-in">
        <div className="room-num">ROOM {state.roomIndex + 1} UNLOCKED!</div>
        <Core color={room.coreColor} className="big-core spin-y" label={room.core} />
        <h1 className="comic-h">{last ? 'The gate is open!' : `${room.core} recovered!`}</h1>
        <p className="lead">
          {last
            ? 'The Glitch is defeated and the Hero HQ is free again!'
            : `Great job, ${leader?.name ?? 'heroes'}! ${state.roomIndex + 1} of ${ROOMS.length - 1} cores are back in the HQ.`}
          <br />
          <span className="de">
            {last ? 'Das Haupttor ist offen – ihr habt es geschafft!' : 'Super! Der nächste Raum wartet schon.'}
          </span>
        </p>
        <div className="core-row">
          {ROOMS.slice(0, ROOMS.length - 1).map((r, i) => (
            <Core key={r.id} color={i <= state.roomIndex ? r.coreColor : '#555'} className={`mini-core ${i <= state.roomIndex ? '' : 'dim'}`} />
          ))}
        </div>
        <div className="mini-stats">
          <span>❌ Fehler in diesem Raum: {rs.mistakes}</span>
          <span>💡 Tipps: {rs.hints}</span>
        </div>
        <button
          className="btn btn-big btn-yellow"
          onClick={() => {
            sfx.whoosh();
            dispatch({ type: 'NEXT_ROOM' });
          }}
        >
          {last ? '🏆 Mission complete!' : `Next room: ${ROOMS[state.roomIndex + 1].name} →`}
        </button>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 3,
        dur: 3 + Math.random() * 3,
        color: ['#ffd60a', '#ff006e', '#4cc9f0', '#39ff14', '#ff7b00', '#ffffff'][i % 6],
        rot: Math.random() * 360,
        w: 6 + Math.random() * 8,
      })),
    [],
  );
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            background: p.color,
            width: p.w,
            height: p.w * 0.5,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function CompleteScreen({ onRestart }: { onRestart: () => void }) {
  const { state } = useGame();
  const r = computeResult(state);
  const names = state.heroes.map((h) => h.name);
  const nameList = names.length <= 1 ? names[0] ?? 'Hero' : `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
  const date = new Date(state.finishedAt ?? Date.now()).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

  useEffect(() => {
    sfx.victory();
  }, []);

  return (
    <div className="screen complete-screen">
      <CityBackdrop open />
      <Confetti />
      <div className="complete-content">
        <div className="panel certificate pop-in">
          <div className="cert-top">
            <span className="cert-kicker">★ Hero Certificate ★</span>
            <h1 className="comic-title small">
              <span className="t1">MISSION COMPLETE!</span>
            </h1>
          </div>
          <div className="cert-heroes">
            {state.heroes.map((h, i) => (
              <div key={i} className="cert-hero">
                <HeroAvatar hero={h} className="cert-avatar bob" />
                <b>{h.name}</b>
              </div>
            ))}
            <div className="cert-hero">
              <Glitch className="cert-avatar glitch-defeated" mood="defeated" />
              <span className="muted small">The Glitch (defeated)</span>
            </div>
          </div>
          <p className="cert-text">
            <b>{nameList}</b> saved the <b>Friendship &amp; Hero HQ</b> on {date}.
            <br />
            <span className="de">Ihr habt alle Energie-Kerne zurückgeholt und das Haupttor geöffnet!</span>
          </p>

          <div className="stars" aria-label={`${r.stars} von 3 Sternen`}>
            {[1, 2, 3].map((n) => (
              <span key={n} className={`star ${n <= r.stars ? 'on' : ''}`} style={{ animationDelay: `${0.3 + n * 0.25}s` }}>
                ★
              </span>
            ))}
          </div>
          <div className="rank">
            {r.rank}
            <span className="de small"> · {r.rankDe}</span>
          </div>

          <div className="result-grid">
            <div>
              <span>⏱ Zeit</span>
              <b>{formatTime(r.timeMs)}</b>
              {r.speedBonus && <small>⚡ inkl. −1:00 Speedster</small>}
            </div>
            <div>
              <span>★ Punkte</span>
              <b>{r.finalScore}</b>
              {r.timeBonusPoints > 0 && <small>inkl. +{r.timeBonusPoints} Zeitbonus</small>}
            </div>
            <div>
              <span>✔ Richtig</span>
              <b>{state.correct}</b>
            </div>
            <div>
              <span>❌ Fehler</span>
              <b>{state.mistakes}</b>
            </div>
            <div>
              <span>💡 Tipps</span>
              <b>{state.hintsUsed}</b>
            </div>
            {state.skipped > 0 && (
              <div>
                <span>⏭ Übersprungen</span>
                <b>{state.skipped}</b>
              </div>
            )}
          </div>

          <div className="echo-bye">
            <Echo className="hint-echo" talking />
            <div className="bubble bubble-echo">
              Thank you, heroes! You are reliable, confident and hard-working. Come back soon – the Glitch never sleeps!
            </div>
          </div>

          <button className="btn btn-big btn-yellow" onClick={onRestart}>
            ↻ Neue Mission (nächste Gruppe)
          </button>
        </div>
      </div>
    </div>
  );
}
