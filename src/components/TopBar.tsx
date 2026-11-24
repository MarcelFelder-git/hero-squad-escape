import { useEffect, useRef, useState } from 'react';
import { useGame } from '../game/GameContext';
import { formatTime } from '../game/state';
import { ROOMS } from '../data/rooms';
import { powerInfo } from '../data/heroOptions';
import { HeroAvatar } from './art/HeroAvatar';
import { sfx } from '../audio/sound';

const TARGET_MS = 20 * 60_000;

function Timer({ startedAt, finishedAt }: { startedAt: number; finishedAt: number | null }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (finishedAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [finishedAt]);
  const ms = (finishedAt ?? now) - startedAt;
  const pct = Math.min(100, (ms / TARGET_MS) * 100);
  const over = ms > TARGET_MS;
  return (
    <div className={`timer ${over ? 'timer-over' : ''}`} title="Richtwert: ca. 20 Minuten">
      <span className="timer-icon">⏱</span>
      <div className="timer-body">
        <div className="timer-text">{formatTime(ms)}</div>
        <div className="timer-bar">
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

export function TopBar({
  onGlossary,
  onRestart,
  onTeacher,
}: {
  onGlossary: () => void;
  onRestart: () => void;
  onTeacher: () => void;
}) {
  const { state, dispatch } = useGame();
  const taps = useRef<number[]>([]);
  const inMission = state.phase === 'room' || state.phase === 'transition';

  const logoTap = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 2500), now];
    if (taps.current.length >= 5) {
      taps.current = [];
      onTeacher();
    }
  };

  return (
    <header className="topbar">
      <button className="logo" onClick={logoTap} aria-label="Hero Squad">
        <span className="logo-badge">HS</span>
        <span className="logo-text">
          HERO <b>SQUAD</b>
        </span>
      </button>

      {state.heroes.length > 0 && state.phase !== 'creator' && (
        <div className="teambar">
          {state.heroes.map((h, i) => (
            <div className="team-hero" key={i} title={`${h.name} – ${powerInfo(h.power).name}`}>
              <HeroAvatar hero={h} bust className="team-avatar" />
              <div className="team-meta">
                <span className="team-name">{h.name}</span>
                <span className="team-power">
                  {powerInfo(h.power).icon} {powerInfo(h.power).name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {inMission && (
        <div className="progress-box">
          <div className="progress-label">
            Room {state.roomIndex + 1}/{ROOMS.length}
          </div>
          <div className="progress-dots">
            {ROOMS.map((r, i) => (
              <span
                key={r.id}
                className={`pdot ${i < state.roomIndex || (i === state.roomIndex && state.phase === 'transition') ? 'done' : ''} ${i === state.roomIndex ? 'current' : ''}`}
                style={{ ['--core' as string]: r.coreColor }}
              />
            ))}
          </div>
        </div>
      )}

      {inMission && state.startedAt && <Timer startedAt={state.startedAt} finishedAt={state.finishedAt} />}
      {inMission && (
        <div className="score" title="Punkte">
          ★ <b>{state.score}</b>
        </div>
      )}

      <div className="top-actions">
        <button className="icon-btn" onClick={() => { sfx.click(); onGlossary(); }} aria-label="Glossar" title="Hero Field Glossary">
          📖
        </button>
        <button
          className="icon-btn"
          onClick={() => {
            dispatch({ type: 'TOGGLE_MUTE' });
          }}
          aria-label={state.muted ? 'Ton an' : 'Ton aus'}
          title={state.muted ? 'Ton an' : 'Ton aus'}
        >
          {state.muted ? '🔇' : '🔊'}
        </button>
        {state.phase !== 'title' && (
          <button className="icon-btn" onClick={onRestart} aria-label="Neu starten" title="Neu starten (nächste Gruppe)">
            ↻
          </button>
        )}
      </div>
    </header>
  );
}
