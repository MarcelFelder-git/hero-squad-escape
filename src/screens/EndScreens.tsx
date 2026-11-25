import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from '../game/GameContext';
import { computeResult, formatTime, powerInfo } from '../game/state';
import { Glitch } from '../components/art/Characters';
import { CityBackdrop } from '../components/art/Scenes';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { HeroRun } from '../bonus/HeroRun';
import { Finale } from './Finale';
import { hallOnline, sendToHall } from '../hall/hall';
import { sfx } from '../audio/sound';

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

type SendState = 'idle' | 'sending' | 'sent' | 'error';

export function CompleteScreen({ onRestart }: { onRestart: () => void }) {
  const { state, dispatch } = useGame();
  const r = computeResult(state);
  const [send, setSend] = useState<SendState>(state.hallSent ? 'sent' : 'idle');
  const [run, setRun] = useState(false);
  const [finale, setFinale] = useState(true);
  const autoSent = useRef(false);

  const doSend = useCallback(async () => {
    setSend('sending');
    const ok = await sendToHall({
      team: state.heroes.map((h) => ({ name: h.name, power: h.power, look: h.look, profile: h.profile })),
      score: r.finalScore,
      time_ms: Math.round(r.timeMs),
      stars: r.stars,
      rank: r.rank,
    });
    if (ok) {
      setSend('sent');
      sfx.unlock();
      dispatch({ type: 'HALL_SENT' });
    } else setSend('error');
  }, [state.heroes, r.finalScore, r.timeMs, r.stars, r.rank, dispatch]);

  useEffect(() => {
    if (autoSent.current) return;
    autoSent.current = true;
    if (!state.hallSent) void doSend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScore = useCallback((s: number) => dispatch({ type: 'BONUS_SCORE', score: s }), [dispatch]);

  return (
    <div className="screen complete-screen">
      <CityBackdrop open />
      {!finale && <Confetti />}
      <div className="complete-content">
        <div className="panel certificate pop-in">
          <div className="cert-top">
            <span className="cert-kicker">★ Hero Squad · Mission complete ★</span>
            <h1 className="comic-title small">
              <span className="t1">YOU ARE HEROES!</span>
            </h1>
            <p className="de">Vom normalen Kind zum Superhelden – und aus dem Gegner wurde ein Freund.</p>
          </div>

          <div className="hero-cards">
            {state.heroes.map((h, i) => (
              <div key={i} className="hero-card" style={{ animationDelay: `${0.2 + i * 0.25}s` }}>
                <div className="hero-card-art" style={{ ['--c' as string]: h.look.cape }}>
                  <HeroAvatar hero={h} gear={8} className="hero-card-avatar" />
                </div>
                <div className="hero-card-name">{h.name}</div>
                <div className="hero-card-power">
                  {powerInfo(h.power).icon} {powerInfo(h.power).name}
                </div>
                {h.profile && <p className="hero-card-profile">{h.profile}</p>}
              </div>
            ))}
            <div className="hero-card glitch-card">
              <div className="hero-card-art" style={{ ['--c' as string]: '#39ff14' }}>
                <Glitch className="hero-card-avatar" mood="happy" />
              </div>
              <div className="hero-card-name">The Glitch</div>
              <div className="hero-card-power">💛 your new friend</div>
            </div>
          </div>

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
          </div>

          <div className={`hall-status hall-${send}`}>
            {send === 'sending' && '📡 Sending your hero cards to the Hall of Heroes …'}
            {send === 'sent' && (hallOnline ? '📺 Your hero cards are on the big screen! Look!' : '📺 Hero cards saved (Hall of Heroes – offline mode).')}
            {send === 'error' && (
              <>
                ⚠️ No connection to the Hall of Heroes.{' '}
                <button className="btn btn-ghost" onClick={doSend}>
                  Try again
                </button>
              </>
            )}
          </div>

          <div className="row-btns">
            <button className="btn btn-big btn-yellow pulse-btn" onClick={() => { sfx.power(); setRun(true); }}>
              🎮 Bonus: Hero Run
            </button>
            <button className="btn btn-ghost" onClick={onRestart}>
              ↻ Neue Mission (nächste Gruppe)
            </button>
          </div>
        </div>
      </div>
      {finale && <Finale heroes={state.heroes} muted={state.muted} onDone={() => setFinale(false)} />}
      {run && <HeroRun heroes={state.heroes} best={state.bonusHighscore} onScore={onScore} onClose={() => setRun(false)} />}
    </div>
  );
}
