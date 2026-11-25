// Bonus game: a little platformer – the team's own hero runs over the roofs of Hero City to Hero HQ.
import { useEffect, useRef, useState, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent } from 'react';
import type { Hero } from '../game/types';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { sfx } from '../audio/sound';
import { HeroRunGame, type Hud, type Input } from './engine';

type Mode = 'ready' | 'play' | 'over' | 'win';

export function HeroRun({ heroes, onClose, onScore, best }: { heroes: Hero[]; onClose: () => void; onScore: (s: number) => void; best: number }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [mode, setMode] = useState<Mode>('ready');
  const [hud, setHud] = useState<Hud | null>(null);
  const [heroImg, setHeroImg] = useState<HTMLImageElement | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const sprite = useRef<HTMLDivElement>(null);
  const game = useRef<HeroRunGame | null>(null);
  const input = useRef<Input>({ left: false, right: false, jump: false });
  const reported = useRef(false);
  const hero = heroes[heroIdx] ?? heroes[0];

  // turn the hero SVG into an image for the canvas
  useEffect(() => {
    const svg = sprite.current?.querySelector('svg');
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('width', '240');
    clone.setAttribute('height', '340');
    const xml = new XMLSerializer().serializeToString(clone);
    const img = new Image();
    img.onload = () => setHeroImg(img);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
  }, [heroIdx]);

  const start = () => {
    game.current = new HeroRunGame();
    reported.current = false;
    input.current = { left: false, right: false, jump: false };
    setHud(game.current.hud());
    setMode('play');
    sfx.power();
  };

  // keyboard
  useEffect(() => {
    const set = (e: KeyboardEvent, on: boolean) => {
      const i = input.current;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') i.left = on;
      else if (e.code === 'ArrowRight' || e.code === 'KeyD') i.right = on;
      else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') i.jump = on;
      else return;
      e.preventDefault();
    };
    const down = (e: KeyboardEvent) => set(e, true);
    const up = (e: KeyboardEvent) => set(e, false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // game loop (also draws a demo level behind the start menu)
  useEffect(() => {
    const cv = canvas.current;
    const box = wrap.current;
    if (!cv || !box) return;
    const ctx = cv.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!game.current) game.current = new HeroRunGame();
    if (import.meta.env.DEV) (window as unknown as { __heroRun?: () => HeroRunGame | null }).__heroRun = () => game.current;
    let last = performance.now();
    let hudT = 0;
    let raf = 0;
    const frame = (now: number) => {
      const W = box.clientWidth;
      const H = box.clientHeight;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = game.current!;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (mode === 'play') {
        g.update(dt, input.current);
        for (const ev of g.events) {
          if (ev === 'jump') sfx.jump();
          else if (ev === 'core' || ev === 'crate') sfx.coin();
          else if (ev === 'stomp') sfx.stomp();
          else if (ev === 'bump') sfx.bump();
          else if (ev === 'hurt') sfx.hurt();
          else if (ev === 'die') sfx.wrong();
          else if (ev === 'checkpoint') sfx.select();
          else if (ev === 'win') sfx.victory();
        }
        g.events.length = 0;
        hudT -= dt;
        if (hudT <= 0) {
          hudT = 0.15;
          setHud(g.hud());
        }
        if ((g.mode === 'over' || (g.mode === 'win' && g.winT > 2.2)) && !reported.current) {
          reported.current = true;
          const h = g.hud();
          setHud(h);
          onScore(h.score);
          setMode(g.mode === 'win' ? 'win' : 'over');
        }
      } else if (mode === 'win') {
        g.update(dt, input.current); // keep the fireworks going
        g.events.length = 0;
      }
      g.draw(ctx, W, H, heroImg, now);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mode, heroImg, onScore]);

  // touch buttons: each button tracks its own pointers, so two thumbs work at the same time
  const hold = (key: keyof Input) => ({
    onPointerDown: (e: RPointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      input.current[key] = true;
    },
    onPointerUp: () => (input.current[key] = false),
    onPointerCancel: () => (input.current[key] = false),
    onLostPointerCapture: () => (input.current[key] = false),
    onContextMenu: (e: RMouseEvent) => e.preventDefault(),
  });

  const score = hud?.score ?? 0;

  return (
    <div className="run-overlay">
      <div className="run-top">
        <b>🎮 HERO RUN</b>
        {hud && mode !== 'ready' && (
          <>
            <span className="run-lives">{'❤️'.repeat(Math.max(0, hud.lives))}{'🖤'.repeat(Math.max(0, 5 - hud.lives))}</span>
            <span>⚡ {hud.cores}</span>
            <span>★ {score}</span>
            <span className="run-progress" aria-label="progress">
              <i style={{ width: `${Math.round(hud.progress * 100)}%` }} />
              <em style={{ left: `${Math.round(hud.progress * 100)}%` }}>🦸</em>
              <b>🏠</b>
            </span>
          </>
        )}
        <span className="muted">Best: {Math.max(best, score)}</span>
        <button className="icon-btn" onClick={onClose} aria-label="Schließen">
          ✕
        </button>
      </div>
      <div ref={wrap} className="run-field">
        <canvas ref={canvas} />
        <div ref={sprite} className="run-sprite-src" aria-hidden="true">
          <HeroAvatar hero={hero} gear={7} />
        </div>

        {mode === 'play' && (
          <div className="run-pad">
            <div className="run-dpad">
              <button className="run-btn" aria-label="links" {...hold('left')}>◀</button>
              <button className="run-btn" aria-label="rechts" {...hold('right')}>▶</button>
            </div>
            <button className="run-btn run-jump" aria-label="springen" {...hold('jump')}>
              JUMP
            </button>
          </div>
        )}

        {mode !== 'play' && (
          <div className="run-menu pop-in">
            {mode === 'ready' && (
              <>
                <div className="big-word">Run to Hero HQ! 🏠</div>
                <div className="run-howto">
                  <span>◀ ▶ run</span>
                  <span>JUMP = jump</span>
                  <span>🐞 jump on bugs</span>
                  <span>⚡ collect cores</span>
                  <span>🟪 hit power boxes from below</span>
                </div>
              </>
            )}
            {mode === 'over' && (
              <>
                <div className="big-word">BZZT! Game over</div>
                <div className="run-result">★ {score} · ⚡ {hud?.cores ?? 0}</div>
              </>
            )}
            {mode === 'win' && (
              <>
                <div className="big-word">🏆 YOU MADE IT!</div>
                <div className="run-result">
                  ★ {score} · ⚡ {hud?.cores ?? 0} · ⏱ {Math.round(hud?.time ?? 0)} s
                </div>
                {score >= best && score > 0 && <div className="run-record">NEW RECORD!</div>}
              </>
            )}
            {heroes.length > 1 && (
              <div className="chip-row center">
                {heroes.map((h, i) => (
                  <button key={i} className={`chip chip-big ${i === heroIdx ? 'chip-on' : ''}`} onClick={() => setHeroIdx(i)}>
                    {h.name}
                  </button>
                ))}
              </div>
            )}
            <button className="btn btn-big btn-yellow pulse-btn" onClick={start}>
              {mode === 'ready' ? '▶ Start!' : '↻ Again!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
