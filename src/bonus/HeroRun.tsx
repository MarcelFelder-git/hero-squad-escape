// Bonus jump'n'run: the team's own hero runs over the roofs of Hero City.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Hero } from '../game/types';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { sfx } from '../audio/sound';

interface Thing {
  x: number;
  y: number; // height above ground (px)
  kind: 'bug' | 'robot' | 'core';
  hit?: boolean;
}

const GRAVITY = 2400;
const JUMP = 900;
const HERO_W = 76;
const HERO_H = 106;

export function HeroRun({ heroes, onClose, onScore, best }: { heroes: Hero[]; onClose: () => void; onScore: (s: number) => void; best: number }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [mode, setMode] = useState<'ready' | 'run' | 'over'>('ready');
  const [score, setScore] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const heroEl = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const game = useRef({ y: 0, vy: 0, jumps: 0, t: 0, dist: 0, cores: 0, speed: 380, things: [] as Thing[], spawn: 1.2, last: 0 });
  const raf = useRef(0);

  const jump = useCallback(() => {
    const g = game.current;
    if (mode !== 'run') return;
    if (g.jumps < 2) {
      g.vy = g.jumps === 0 ? JUMP : JUMP * 0.85;
      g.jumps++;
      sfx.select();
    }
  }, [mode]);

  const start = () => {
    game.current = { y: 0, vy: 0, jumps: 0, t: 0, dist: 0, cores: 0, speed: 380, things: [], spawn: 1.2, last: performance.now() };
    setScore(0);
    setMode('run');
    sfx.power();
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (mode === 'run') jump();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [jump, mode]);

  useEffect(() => {
    const cv = canvas.current;
    const box = wrap.current;
    if (!cv || !box) return;
    const ctx = cv.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const frame = (now: number) => {
      const W = box.clientWidth;
      const H = box.clientHeight;
      if (cv.width !== W * dpr || cv.height !== H * dpr) {
        cv.width = W * dpr;
        cv.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const ground = H - 70;
      const g = game.current;
      const dt = Math.min(0.033, (now - (g.last || now)) / 1000);
      g.last = now;
      const heroX = W * 0.15;

      if (mode === 'run') {
        g.t += dt;
        g.speed = 380 + g.t * 14;
        g.dist += g.speed * dt;
        // physics
        g.vy -= GRAVITY * dt;
        g.y = Math.max(0, g.y + g.vy * dt);
        if (g.y === 0) {
          g.vy = 0;
          g.jumps = 0;
        }
        // spawn
        g.spawn -= dt;
        if (g.spawn <= 0) {
          const r = Math.random();
          if (r < 0.55) g.things.push({ x: W + 40, y: 0, kind: 'bug' });
          else if (r < 0.75) g.things.push({ x: W + 40, y: 0, kind: 'robot' });
          else g.things.push({ x: W + 40, y: 120 + Math.random() * 90, kind: 'core' });
          if (Math.random() < 0.35) g.things.push({ x: W + 120, y: 150 + Math.random() * 60, kind: 'core' });
          g.spawn = Math.max(0.55, 1.4 - g.t * 0.02) * (0.7 + Math.random() * 0.6);
        }
        for (const th of g.things) th.x -= g.speed * dt;
        g.things = g.things.filter((th) => th.x > -60 && !th.hit);
        // collisions
        for (const th of g.things) {
          const size = th.kind === 'robot' ? 54 : 40;
          const dx = Math.abs(th.x - (heroX + HERO_W / 2));
          const thTop = th.y + size;
          const heroBottom = g.y;
          const heroTop = g.y + HERO_H;
          if (dx < (HERO_W + size) / 2 - 14 && heroBottom < thTop - 8 && heroTop > th.y + 6) {
            if (th.kind === 'core') {
              th.hit = true;
              g.cores++;
              sfx.click();
            } else {
              const s = Math.floor(g.dist / 50) + g.cores * 10;
              setScore(s);
              onScore(s);
              setMode('over');
              sfx.wrong();
            }
          }
        }
        if (Math.floor(g.t * 10) % 3 === 0) setScore(Math.floor(g.dist / 50) + g.cores * 10);
      }

      // draw: sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#10002b');
      sky.addColorStop(0.7, '#5a189a');
      sky.addColorStop(1, '#ff006e');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
      // parallax city
      const off = (g.dist * 0.3) % 160;
      for (let i = -1; i < W / 160 + 2; i++) {
        const bx = i * 160 - off;
        const h = 90 + ((i * 97 + Math.floor(g.dist / 480)) % 5) * 30;
        ctx.fillStyle = '#1b1446';
        ctx.fillRect(bx, ground - h, 120, h);
        ctx.fillStyle = '#ffd60a';
        for (let r = 0; r < h / 30 - 1; r++) for (let c = 0; c < 4; c++) if ((r + c + i) % 3 === 0) ctx.fillRect(bx + 12 + c * 26, ground - h + 12 + r * 30, 12, 14);
      }
      // ground
      ctx.fillStyle = '#2b2160';
      ctx.fillRect(0, ground, W, H - ground);
      ctx.strokeStyle = '#141018';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, ground);
      ctx.lineTo(W, ground);
      ctx.stroke();
      const goff = g.dist % 60;
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      for (let x = -goff; x < W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, ground + 4);
        ctx.lineTo(x - 30, H);
        ctx.stroke();
      }
      // things
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      for (const th of g.things) {
        const size = th.kind === 'robot' ? 54 : 40;
        ctx.font = `${size}px system-ui, "Apple Color Emoji", "Segoe UI Emoji"`;
        ctx.fillText(th.kind === 'bug' ? '🐞' : th.kind === 'robot' ? '👾' : '⚡', th.x, ground - th.y + 4);
      }
      // hero position
      if (heroEl.current) heroEl.current.style.transform = `translate(${heroX}px, ${ground - HERO_H - g.y}px)`;
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, [mode, onScore]);

  const hero = heroes[heroIdx] ?? heroes[0];

  return (
    <div className="run-overlay">
      <div className="run-top">
        <b>🎮 HERO RUN</b>
        <span>★ {score}</span>
        <span className="muted">Best: {Math.max(best, score)}</span>
        <button className="icon-btn" onClick={onClose} aria-label="Schließen">
          ✕
        </button>
      </div>
      <div ref={wrap} className="run-field" onPointerDown={() => (mode === 'run' ? jump() : undefined)}>
        <canvas ref={canvas} />
        <div ref={heroEl} className={`run-hero ${mode === 'run' ? 'running' : ''}`}>
          <HeroAvatar hero={hero} gear={7} />
        </div>
        {mode !== 'run' && (
          <div className="run-menu pop-in">
            {mode === 'over' && <div className="big-word">BZZT! Score: {score}</div>}
            {mode === 'ready' && (
              <>
                <div className="big-word">Jump over the Glitch bugs!</div>
                <p>Tap = jump · tap twice = double jump · collect ⚡</p>
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
            <button className="btn btn-big btn-yellow" onClick={start}>
              {mode === 'over' ? '↻ Again!' : '▶ Run!'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
