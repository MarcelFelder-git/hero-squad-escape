import { useEffect, useRef, useState } from 'react';
import { useGame } from '../game/GameContext';
import { formatTime, gearCount } from '../game/state';
import { LEVELS } from '../data/levels';
import { powerInfo } from '../data/heroOptions';
import { HeroAvatar } from './art/HeroAvatar';
import { RocketIcon } from './art/Rocket';
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
  return (
    <div className={`timer ${ms > TARGET_MS ? 'timer-over' : ''}`} title="Richtwert: ca. 20 Minuten">
      ⏱ <span>{formatTime(ms)}</span>
    </div>
  );
}

export function TopBar({ onGlossary, onRestart, onTeacher }: { onGlossary: () => void; onRestart: () => void; onTeacher: () => void }) {
  const { state, dispatch } = useGame();
  const taps = useRef<number[]>([]);
  const inMission = state.phase === 'level' || state.phase === 'reward' || state.phase === 'complete';
  const gear = gearCount(state);

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
      </button>

      {state.heroes.length > 0 && state.phase !== 'creator' && (
        <div className="teambar">
          {state.heroes.map((h, i) => (
            <div className="team-hero" key={i} title={`${h.name} – ${powerInfo(h.power).name}`}>
              <HeroAvatar hero={h} gear={gear} bust className="team-avatar" />
              <span className="team-name">{h.name}</span>
            </div>
          ))}
        </div>
      )}

      {inMission && (
        <div className="rocket-track" aria-label={`Level ${state.levelIndex + 1} von ${LEVELS.length}`}>
          {LEVELS.map((l, i) => {
            const done = i < gear;
            const current = state.phase === 'level' && i === state.levelIndex;
            return (
              <span key={l.id} className={`rocket-slot ${done ? 'done' : ''} ${current ? 'current' : ''}`} style={{ ['--c' as string]: l.color }}>
                <RocketIcon color={done ? l.color : '#7d76b3'} />
              </span>
            );
          })}
        </div>
      )}

      <div className="top-right">
        {inMission && state.startedAt && <Timer startedAt={state.startedAt} finishedAt={state.finishedAt} />}
        {inMission && <div className="score">★ {state.score}</div>}
        <button className="icon-btn" onClick={() => { sfx.click(); onGlossary(); }} aria-label="Glossar" title="Hero Field Glossary">
          📖
        </button>
        <button className="icon-btn" onClick={() => dispatch({ type: 'TOGGLE_MUTE' })} aria-label={state.muted ? 'Ton an' : 'Ton aus'}>
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
