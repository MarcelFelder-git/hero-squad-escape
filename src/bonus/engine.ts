// Hero Run – a small side-scrolling platformer over the roofs of Hero City.
// World units: 1 tile = 40 px, level = 12 tiles high, y grows downwards.

export const T = 40;
export const ROWS = 12;
const GROUND = 10; // first ground row

// tiles
const EMPTY = 0;
const ROOF = 1; // ground top (roof with edge)
const WALL = 2; // ground body
const BRICK = 3;
const CRATE = 4; // power crate – bump from below
const USED = 5;
const STONE = 6;
const CHIMNEY = 7;
const SUPER = 8; // golden super power box – a star pops out

const SOLID = new Set([ROOF, WALL, BRICK, CRATE, USED, STONE, CHIMNEY, SUPER]);
const SUPER_TIME = 8;
const HERO = ['H', 'E', 'R', 'O'];

export interface Input {
  left: boolean;
  right: boolean;
  jump: boolean;
}

type EnemyKind = 'bug' | 'drone' | 'spike';
interface Enemy {
  kind: EnemyKind;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  baseY: number;
  phase: number;
  dead: number; // >0 = squash timer
}

interface Platform {
  x: number;
  y: number;
  w: number;
  ax: number; // movement axis amplitude (px)
  ay: number;
  cx: number;
  cy: number;
  speed: number;
  phase: number;
  dx: number;
  dy: number;
}

interface Core {
  x: number;
  y: number;
  taken: boolean;
  pop?: number; // popping out of a crate
}

interface Pickup {
  x: number;
  y: number;
  kind: 'star' | 'letter';
  ch: string;
  taken: boolean;
  rise: number; // star: still rising out of the box
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
  text?: string;
}

export interface Hud {
  lives: number;
  cores: number;
  score: number;
  time: number;
  progress: number;
  mode: 'run' | 'dying' | 'over' | 'win';
  /** seconds of super power left */
  superT: number;
  /** collected letters of H-E-R-O */
  letters: boolean[];
}

export class HeroRunGame {
  W = 0; // level width in tiles
  grid: Uint8Array = new Uint8Array(0);
  enemies: Enemy[] = [];
  platforms: Platform[] = [];
  cores: Core[] = [];
  pickups: Pickup[] = [];
  particles: Particle[] = [];
  checkpoints: number[] = [];
  goalX = 0;

  // player
  px = 80;
  py = 0;
  pw = 26;
  ph = 46;
  vx = 0;
  vy = 0;
  onGround = false;
  ridingPlatform: Platform | null = null;
  facing = 1;
  coyote = 0;
  jumpBuffer = 0;
  jumpHeld = false;
  invuln = 0;
  squash = 0;
  runPhase = 0;
  respawnX = 80;
  airJumps = 1; // cape jump
  superT = 0;
  combo = 0;
  stompPts = 0;
  bonus = 0;
  letters = [false, false, false, false];

  lives = 5;
  coreCount = 0;
  stomps = 0;
  time = 0;
  mode: Hud['mode'] = 'run';
  dyingT = 0;
  winT = 0;
  doorT = 0;
  camX = 0;
  shake = 0;
  events: string[] = [];

  constructor() {
    this.build();
    this.spawn(this.respawnX);
  }

  /* ---------------- level ---------------- */
  private set(x: number, y: number, t: number) {
    if (x < 0 || x >= this.W || y < 0 || y >= ROWS) return;
    this.grid[y * this.W + x] = t;
  }
  tile(x: number, y: number) {
    if (x < 0 || x >= this.W) return WALL;
    if (y < 0) return EMPTY;
    if (y >= ROWS) return EMPTY;
    return this.grid[y * this.W + x];
  }
  private ground(x0: number, x1: number, top = GROUND) {
    for (let x = x0; x <= x1; x++) {
      this.set(x, top, ROOF);
      for (let y = top + 1; y < ROWS; y++) this.set(x, y, WALL);
    }
  }
  private row(x0: number, x1: number, y: number, t: number) {
    for (let x = x0; x <= x1; x++) this.set(x, y, t);
  }
  private chimney(x: number, h: number, top = GROUND) {
    for (let y = top - h; y < top; y++) {
      this.set(x, y, CHIMNEY);
      this.set(x + 1, y, CHIMNEY);
    }
  }
  private stairs(x0: number, h: number, dir: 1 | -1, top = GROUND) {
    for (let i = 0; i < h; i++) {
      const x = dir === 1 ? x0 + i : x0 + (h - 1 - i);
      for (let y = top - 1 - i; y < top; y++) this.set(x, y, STONE);
    }
  }
  private coinsRow(x0: number, x1: number, y: number) {
    for (let x = x0; x <= x1; x++) this.cores.push({ x: x * T + T / 2, y: y * T + T / 2, taken: false });
  }
  private enemy(kind: EnemyKind, tx: number, ty: number) {
    const w = kind === 'drone' ? 34 : kind === 'spike' ? 30 : 34;
    const h = kind === 'drone' ? 30 : kind === 'spike' ? 30 : 28;
    const x = tx * T + (T - w) / 2;
    const y = ty * T + T - h;
    this.enemies.push({ kind, x, y, w, h, vx: kind === 'bug' ? -55 : 0, vy: 0, baseY: y, phase: Math.random() * 6, dead: 0 });
  }
  private letter(i: number, tx: number, ty: number) {
    this.pickups.push({ x: tx * T + T / 2, y: ty * T + T / 2, kind: 'letter', ch: HERO[i], taken: false, rise: 0 });
  }
  private platform(tx: number, ty: number, wTiles: number, ax: number, ay: number, speed: number) {
    const x = tx * T;
    const y = ty * T;
    this.platforms.push({ x, y, w: wTiles * T, ax: ax * T, ay: ay * T, cx: x, cy: y, speed, phase: 0, dx: 0, dy: 0 });
  }

  private build() {
    this.W = 200;
    this.grid = new Uint8Array(this.W * ROWS);

    // 0 – start: flat roof, a few cores
    this.ground(0, 18);
    this.coinsRow(6, 9, 8);
    this.row(11, 13, 6, BRICK);
    this.set(12, 6, CRATE);
    this.enemy('bug', 16, 9);

    // gap 19-21
    this.ground(22, 38);
    this.stairs(24, 2, 1);
    this.chimney(30, 2);
    this.enemy('bug', 34, 9);
    this.coinsRow(29, 32, 6);

    // gap with horizontal moving platform 39-44
    this.platform(39, 8, 2, 3, 0, 1.1);
    this.ground(45, 60);
    this.row(48, 52, 6, BRICK);
    this.set(49, 6, CRATE);
    this.set(51, 6, SUPER);
    this.coinsRow(48, 52, 5 - 1);
    this.enemy('drone', 55, 6);
    this.enemy('bug', 58, 9);

    // hill
    this.ground(61, 64);
    this.ground(65, 72, 8);
    this.ground(73, 76);
    this.enemy('bug', 69, 7);
    this.coinsRow(66, 71, 6);

    // checkpoint 1
    this.checkpoints.push(78 * T);
    this.ground(77, 82);
    // gap with spike ball 83-85
    this.enemy('spike', 84, 11);
    this.ground(86, 98);
    this.chimney(89, 3);
    this.enemy('bug', 93, 9);
    this.chimney(96, 2);
    // floating platforms going up
    this.row(100, 101, 8, BRICK);
    this.row(103, 104, 6, BRICK);
    this.set(104, 6, CRATE);
    this.row(106, 107, 4, BRICK);
    this.coinsRow(106, 107, 3);
    this.coinsRow(100, 101, 7);
    this.ground(99, 99);
    this.enemy('drone', 102, 3);

    // deep gap with vertical lift 108-113
    this.platform(109, 7, 2, 0, 3, 0.9);
    this.ground(114, 132);
    this.stairs(117, 4, 1);
    this.stairs(121, 4, -1);
    this.coinsRow(120, 121, 5);
    this.enemy('bug', 127, 9);
    this.enemy('bug', 130, 9);
    this.enemy('drone', 125, 5);

    // checkpoint 2
    this.checkpoints.push(134 * T);
    this.ground(133, 140);
    // double gap with spikes and a moving platform 141-148
    this.enemy('spike', 142, 11);
    this.platform(144, 8, 2, 1.5, 0, 1.2);
    this.enemy('spike', 147, 11);
    this.ground(149, 170);
    this.row(152, 156, 7, BRICK);
    this.set(154, 7, SUPER);
    this.enemy('bug', 155, 6);
    this.chimney(159, 2);
    this.enemy('bug', 163, 9);
    this.enemy('drone', 166, 5);
    this.coinsRow(160, 165, 6);

    // final staircase + goal
    this.ground(171, this.W - 1);
    this.stairs(173, 6, 1);
    this.goalX = 185 * T;

    // secret letters H-E-R-O (+100 for all four)
    this.letter(0, 30, 4);
    this.letter(1, 104, 3);
    this.letter(2, 110, 2);
    this.letter(3, 145, 5);
  }

  /* ---------------- helpers ---------------- */
  private solidAt(px: number, py: number) {
    return SOLID.has(this.tile(Math.floor(px / T), Math.floor(py / T)));
  }

  private spawn(x: number) {
    this.px = x;
    this.py = 2 * T;
    // drop onto the ground
    for (let y = 0; y < ROWS * T; y += 4) {
      if (this.solidAt(x + this.pw / 2, y + this.ph)) {
        this.py = y;
        break;
      }
    }
    this.vx = 0;
    this.vy = 0;
    this.invuln = 1.5;
  }

  private burst(x: number, y: number, color: string, n = 8, speed = 160) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      this.particles.push({ x, y, vx: Math.cos(a) * speed * (0.5 + Math.random()), vy: Math.sin(a) * speed * (0.5 + Math.random()) - 60, life: 0.6, max: 0.6, color, size: 3 + Math.random() * 3 });
    }
  }
  private floatText(x: number, y: number, text: string, color = '#ffd60a') {
    this.particles.push({ x, y, vx: 0, vy: -70, life: 0.9, max: 0.9, color, size: 18, text });
  }

  get score() {
    return this.coreCount * 10 + this.stompPts + this.bonus + (this.mode === 'win' ? 200 + Math.max(0, Math.floor(120 - this.time)) * 2 : 0);
  }

  hud(): Hud {
    return {
      lives: this.lives,
      cores: this.coreCount,
      score: this.score,
      time: this.time,
      progress: Math.min(1, this.px / this.goalX),
      mode: this.mode,
      superT: this.superT,
      letters: [...this.letters],
    };
  }

  private hurt() {
    if (this.invuln > 0 || this.superT > 0 || this.mode !== 'run') return;
    this.lives--;
    this.shake = 0.3;
    this.events.push('hurt');
    if (this.lives <= 0) {
      this.die();
      return;
    }
    this.invuln = 1.6;
    this.vy = -420;
    this.vx = -this.facing * 200;
  }

  private die() {
    this.superT = 0;
    this.mode = 'dying';
    this.dyingT = 0;
    this.vy = -620;
    this.events.push('die');
  }

  /* ---------------- update ---------------- */
  update(dt: number, input: Input) {
    this.particles = this.particles.filter((p) => (p.life -= dt) > 0);
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (!p.text) p.vy += 600 * dt;
    }
    this.shake = Math.max(0, this.shake - dt);

    // platforms
    for (const pl of this.platforms) {
      pl.phase += dt * pl.speed;
      const nx = pl.cx + Math.sin(pl.phase) * pl.ax;
      const ny = pl.cy + Math.sin(pl.phase) * pl.ay;
      pl.dx = nx - pl.x;
      pl.dy = ny - pl.y;
      pl.x = nx;
      pl.y = ny;
    }

    if (this.mode === 'dying') {
      this.dyingT += dt;
      this.vy += 1900 * dt;
      this.py += this.vy * dt;
      if (this.dyingT > 1.6) {
        if (this.lives <= 0) this.mode = 'over';
        else {
          this.mode = 'run';
          this.spawn(this.respawnX);
        }
      }
      return;
    }
    if (this.mode === 'over') return;
    if (this.mode === 'win') {
      this.winT += dt;
      const door = this.goalX + 5.5 * T - this.pw / 2;
      this.facing = 1;
      this.vx = this.px < door ? 160 : 0;
      if (this.vx) this.runPhase += dt * 10;
      else this.doorT += dt;
      this.px = Math.min(this.px + 160 * dt, door);
      if (!this.onGround) this.moveY((this.vy = Math.min(this.vy + 1900 * dt, 900)) * dt);
      if (Math.random() < dt * 8) this.burst(this.goalX + (Math.random() - 0.3) * 300, 2 * T + Math.random() * 120, ['#ffd60a', '#ff006e', '#4cc9f0', '#39ff14'][Math.floor(Math.random() * 4)], 14, 220);
      this.updateCamera(dt);
      return;
    }

    this.time += dt;
    this.invuln = Math.max(0, this.invuln - dt);
    this.squash = Math.max(0, this.squash - dt * 4);

    // horizontal
    const accel = this.onGround ? 1500 : 1000;
    const maxV = this.superT > 0 ? 300 : 230;
    if (this.superT > 0) {
      this.superT = Math.max(0, this.superT - dt);
      if (this.superT === 0) this.events.push('superEnd');
      if (Math.random() < dt * 30)
        this.particles.push({ x: this.px + Math.random() * this.pw, y: this.py + Math.random() * this.ph, vx: -this.vx * 0.2, vy: -40, life: 0.5, max: 0.5, color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`, size: 4 + Math.random() * 3 });
    }
    if (input.left && !input.right) {
      this.vx = Math.max(-maxV, this.vx - accel * dt);
      this.facing = -1;
    } else if (input.right && !input.left) {
      this.vx = Math.min(maxV, this.vx + accel * dt);
      this.facing = 1;
    } else {
      const fr = (this.onGround ? 1600 : 400) * dt;
      this.vx = Math.abs(this.vx) <= fr ? 0 : this.vx - Math.sign(this.vx) * fr;
    }

    // jump (buffer + coyote time + variable height)
    this.coyote = this.onGround ? 0.1 : Math.max(0, this.coyote - dt);
    if (input.jump && !this.jumpHeld) this.jumpBuffer = 0.12;
    else this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
    if (this.onGround) this.airJumps = 1;
    if (this.jumpBuffer > 0 && this.coyote > 0) {
      this.vy = this.superT > 0 ? -800 : -740;
      this.coyote = 0;
      this.jumpBuffer = 0;
      this.onGround = false;
      this.ridingPlatform = null;
      this.events.push('jump');
      this.burst(this.px + this.pw / 2, this.py + this.ph, '#ffffffaa', 5, 80);
    } else if (input.jump && !this.jumpHeld && !this.onGround && this.coyote <= 0 && this.airJumps > 0) {
      // cape jump: a second jump in the air
      this.airJumps--;
      this.vy = -640;
      this.jumpBuffer = 0;
      this.ridingPlatform = null;
      this.events.push('jump2');
      this.floatText(this.px + this.pw / 2, this.py - 6, 'CAPE JUMP!', '#4cc9f0');
      for (let i = 0; i < 10; i++)
        this.particles.push({ x: this.px + this.pw / 2 + (Math.random() - 0.5) * 30, y: this.py + this.ph, vx: (Math.random() - 0.5) * 160, vy: 60 + Math.random() * 80, life: 0.45, max: 0.45, color: i % 2 ? '#ffd60a' : '#ffffff', size: 4 });
    }
    if (!input.jump && this.vy < -300) this.vy = -300;
    this.jumpHeld = input.jump;

    // ride platform
    if (this.ridingPlatform) {
      this.px += this.ridingPlatform.dx;
      this.py += this.ridingPlatform.dy;
    }

    this.vy = Math.min(this.vy + 1900 * dt, 900);
    const wasGround = this.onGround;
    this.moveX(this.vx * dt);
    this.moveY(this.vy * dt);
    if (!wasGround && this.onGround) {
      this.combo = 0;
      this.squash = 1;
      this.burst(this.px + this.pw / 2, this.py + this.ph, '#ffffff88', 6, 70);
    }
    if (this.onGround && Math.abs(this.vx) > 10) this.runPhase += dt * Math.abs(this.vx) * 0.06;

    // fell into a gap
    if (this.py > ROWS * T + 260) {
      this.lives--;
      this.events.push('hurt');
      if (this.lives <= 0) this.die();
      else this.spawn(this.respawnX);
    }

    // checkpoints
    for (const c of this.checkpoints) {
      if (this.px > c && this.respawnX < c) {
        this.respawnX = c;
        this.floatText(c, 5 * T, 'CHECKPOINT!', '#39ff14');
        this.events.push('checkpoint');
      }
    }

    // cores
    for (const c of this.cores) {
      if (c.pop !== undefined) {
        c.pop -= dt;
        c.y -= 140 * dt;
        if (c.pop <= 0) {
          c.taken = true;
          c.pop = undefined;
          this.coreCount++;
        }
        continue;
      }
      if (c.taken) continue;
      if (Math.abs(c.x - (this.px + this.pw / 2)) < 26 && Math.abs(c.y - (this.py + this.ph / 2)) < 34) {
        c.taken = true;
        this.coreCount++;
        this.events.push('core');
        this.burst(c.x, c.y, '#ffd60a', 6, 120);
      }
    }

    // super star + H-E-R-O letters
    for (const p of this.pickups) {
      if (p.taken) continue;
      if (p.rise > 0) {
        const step = Math.min(p.rise, 90 * dt);
        p.rise -= step;
        p.y -= step;
        continue;
      }
      if (Math.abs(p.x - (this.px + this.pw / 2)) < 28 && Math.abs(p.y - (this.py + this.ph / 2)) < 36) {
        p.taken = true;
        if (p.kind === 'star') {
          this.superT = SUPER_TIME;
          this.events.push('super');
          this.floatText(p.x, p.y - 20, 'SUPER POWER!', '#ff006e');
          this.burst(p.x, p.y, '#ffd60a', 16, 220);
        } else {
          const i = HERO.indexOf(p.ch);
          this.letters[i] = true;
          this.events.push('letter');
          this.burst(p.x, p.y, '#39ff14', 12, 160);
          if (this.letters.every(Boolean)) {
            this.bonus += 100;
            this.floatText(p.x, p.y - 24, 'H-E-R-O! +100', '#39ff14');
            this.events.push('hero');
          } else this.floatText(p.x, p.y - 20, p.ch + '!', '#39ff14');
        }
      }
    }

    this.updateEnemies(dt);

    // goal
    if (this.px + this.pw > this.goalX) {
      this.mode = 'win';
      this.winT = 0;
      this.doorT = 0;
      this.events.push('win');
    }
    this.updateCamera(dt);
  }

  private updateCamera(dt: number) {
    const target = this.px - 4 * T + this.facing * 40;
    this.camX += (target - this.camX) * Math.min(1, dt * 5);
    this.camX = Math.max(0, Math.min(this.camX, this.W * T - 16 * T));
  }

  private moveX(dx: number) {
    this.px += dx;
    const top = this.py + 2;
    const bot = this.py + this.ph - 2;
    if (dx > 0) {
      const x = this.px + this.pw;
      if (this.solidAt(x, top) || this.solidAt(x, bot) || this.solidAt(x, (top + bot) / 2)) {
        this.px = Math.floor(x / T) * T - this.pw - 0.01;
        this.vx = 0;
      }
    } else if (dx < 0) {
      const x = this.px;
      if (this.solidAt(x, top) || this.solidAt(x, bot) || this.solidAt(x, (top + bot) / 2)) {
        this.px = (Math.floor(x / T) + 1) * T + 0.01;
        this.vx = 0;
      }
    }
    if (this.px < 0) this.px = 0;
  }

  private moveY(dy: number) {
    const prevBottom = this.py + this.ph;
    this.py += dy;
    this.onGround = false;
    const left = this.px + 3;
    const right = this.px + this.pw - 3;
    if (dy > 0) {
      const y = this.py + this.ph;
      if (this.solidAt(left, y) || this.solidAt(right, y)) {
        this.py = Math.floor(y / T) * T - this.ph;
        this.vy = 0;
        this.onGround = true;
        this.ridingPlatform = null;
      }
      // one-way moving platforms
      for (const pl of this.platforms) {
        if (right > pl.x && left < pl.x + pl.w && prevBottom <= pl.y + 6 + Math.max(0, pl.dy) && this.py + this.ph >= pl.y) {
          this.py = pl.y - this.ph;
          this.vy = 0;
          this.onGround = true;
          this.ridingPlatform = pl;
        }
      }
    } else if (dy < 0) {
      this.ridingPlatform = null;
      const y = this.py;
      const tl = this.tile(Math.floor(left / T), Math.floor(y / T));
      const tr = this.tile(Math.floor(right / T), Math.floor(y / T));
      if (SOLID.has(tl) || SOLID.has(tr)) {
        // bump the block under the head centre
        const cx = Math.floor((this.px + this.pw / 2) / T);
        const cy = Math.floor(y / T);
        const hit = SOLID.has(this.tile(cx, cy)) ? cx : SOLID.has(tl) ? Math.floor(left / T) : Math.floor(right / T);
        if (this.tile(hit, cy) === SUPER) {
          this.set(hit, cy, USED);
          this.pickups.push({ x: hit * T + T / 2, y: cy * T + T / 2, kind: 'star', ch: '', taken: false, rise: T });
          this.burst(hit * T + T / 2, cy * T, '#ffd60a', 10, 150);
          this.events.push('crate');
        } else if (this.tile(hit, cy) === CRATE) {
          this.set(hit, cy, USED);
          this.cores.push({ x: hit * T + T / 2, y: cy * T, taken: false, pop: 0.45 });
          this.floatText(hit * T + T / 2, cy * T - 10, '+10');
          this.events.push('crate');
        } else this.events.push('bump');
        this.py = (cy + 1) * T;
        this.vy = 60;
      }
    }
    // still standing on a platform?
    if (!this.onGround && this.ridingPlatform) this.ridingPlatform = null;
  }

  private updateEnemies(dt: number) {
    for (const e of this.enemies) {
      if (e.dead > 0) {
        e.dead -= dt;
        continue;
      }
      if (Math.abs(e.x - this.px) > 22 * T) continue; // sleep when far away
      e.phase += dt;
      if (e.kind === 'bug') {
        e.vy = Math.min(e.vy + 1900 * dt, 900);
        e.x += e.vx * dt;
        const ahead = e.vx > 0 ? e.x + e.w : e.x;
        const footY = e.y + e.h + 4;
        if (this.solidAt(ahead, e.y + e.h / 2) || !this.solidAt(ahead + Math.sign(e.vx) * 4, footY)) e.vx = -e.vx;
        e.y += e.vy * dt;
        if (this.solidAt(e.x + e.w / 2, e.y + e.h)) {
          e.y = Math.floor((e.y + e.h) / T) * T - e.h;
          e.vy = 0;
        }
      } else if (e.kind === 'drone') {
        e.y = e.baseY + Math.sin(e.phase * 2) * 70;
        e.x += Math.cos(e.phase * 0.8) * 30 * dt;
      } else {
        // spike ball jumps out of the gap
        const cycle = (e.phase % 2.6) / 2.6;
        e.y = e.baseY - Math.max(0, Math.sin(cycle * Math.PI * 1.4)) * 260;
      }

      // collision with the player
      if (this.mode !== 'run') continue;
      const hit = this.px < e.x + e.w && this.px + this.pw > e.x && this.py < e.y + e.h && this.py + this.ph > e.y;
      if (!hit) continue;
      if (this.superT > 0) {
        e.dead = 0.5;
        this.stomps++;
        this.stompPts += 20;
        this.floatText(e.x + e.w / 2, e.y, 'POW! +20', '#ff006e');
        this.burst(e.x + e.w / 2, e.y + e.h / 2, '#ffd60a', 12, 220);
        this.shake = 0.15;
        this.events.push('stomp');
        continue;
      }
      const stomp = e.kind !== 'spike' && this.vy > 50 && this.py + this.ph - e.y < 22;
      if (stomp) {
        e.dead = 0.5;
        this.vy = -520;
        this.airJumps = 1;
        this.stomps++;
        this.combo++;
        const pts = 20 * Math.min(4, this.combo);
        this.stompPts += pts;
        this.floatText(e.x + e.w / 2, e.y, this.combo > 1 ? `COMBO x${this.combo}! +${pts}` : '+20', '#ff9f1c');
        this.burst(e.x + e.w / 2, e.y + e.h / 2, e.kind === 'bug' ? '#e63946' : '#39ff14', 10, 180);
        this.events.push('stomp');
      } else this.hurt();
    }
    this.enemies = this.enemies.filter((e) => e.dead === 0 || e.dead > 0);
  }

  /* ---------------- drawing ---------------- */
  draw(ctx: CanvasRenderingContext2D, cw: number, ch: number, heroImg: HTMLImageElement | null, now: number) {
    const PAD = 70; // room for the touch buttons below the level
    const scale = Math.min(ch / (ROWS * T + PAD), cw / ((cw > ch ? 16 : 10) * T));
    const viewW = cw / scale;
    const viewH = ch / scale;
    const below = PAD + Math.max(0, viewH - ROWS * T - PAD) * 0.45;
    const offY = ROWS * T + below - viewH; // negative = extra sky on top
    const sx = this.shake > 0 ? (Math.random() - 0.5) * 10 : 0;
    const camX = Math.min(this.camX, Math.max(0, this.W * T - viewW));

    // sky
    const g = ctx.createLinearGradient(0, 0, 0, ch);
    g.addColorStop(0, '#0b0326');
    g.addColorStop(0.6, '#3c096c');
    g.addColorStop(1, '#ff006e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);

    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(sx, -offY);

    // stars + moon (fixed)
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 60; i++) {
      const x = (i * 137.7) % viewW;
      const y = offY + ((i * 53.3) % (viewH * 0.55));
      const tw = 0.5 + 0.5 * Math.sin(now / 500 + i);
      ctx.globalAlpha = 0.3 + tw * 0.6;
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff3b0';
    ctx.beginPath();
    ctx.arc(viewW * 0.8, offY + 90, 42, 0, Math.PI * 2);
    ctx.fill();

    // parallax skyline (2 layers)
    this.skyline(ctx, camX * 0.2, viewW, 6.2 * T, '#240b4d', 0.9, 7);
    this.skyline(ctx, camX * 0.45, viewW, 7.4 * T, '#1b1446', 1.2, 3);

    ctx.translate(-camX, 0);

    // tiles
    const x0 = Math.max(0, Math.floor(camX / T) - 1);
    const x1 = Math.min(this.W - 1, Math.ceil((camX + viewW) / T) + 1);
    for (let x = x0; x <= x1; x++) {
      for (let y = 0; y < ROWS; y++) {
        const t = this.grid[y * this.W + x];
        if (t) this.drawTile(ctx, t, x * T, y * T, now, x, y);
      }
    }

    // building walls continue below the level
    for (let x = x0; x <= x1; x++) {
      if (SOLID.has(this.grid[(ROWS - 1) * this.W + x])) {
        ctx.fillStyle = '#2b2160';
        ctx.fillRect(x * T, ROWS * T, T + 0.5, below + 4);
      }
    }

    // checkpoints
    for (const c of this.checkpoints) {
      const reached = this.respawnX >= c;
      const top = this.groundTopAt(c);
      ctx.fillStyle = '#adb5bd';
      ctx.fillRect(c, top - 110, 5, 110);
      ctx.fillStyle = reached ? '#39ff14' : '#6c757d';
      ctx.beginPath();
      ctx.moveTo(c + 5, top - 110);
      ctx.lineTo(c + 45, top - 96 + Math.sin(now / 200) * 3);
      ctx.lineTo(c + 5, top - 82);
      ctx.fill();
    }

    // goal: Hero HQ + flag
    this.drawGoal(ctx, now);

    // platforms
    for (const pl of this.platforms) {
      ctx.fillStyle = '#4cc9f0';
      ctx.strokeStyle = '#141018';
      ctx.lineWidth = 4;
      this.roundRect(ctx, pl.x, pl.y, pl.w, 16, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff88';
      ctx.fillRect(pl.x + 6, pl.y + 3, pl.w - 12, 3);
      // thrusters
      ctx.fillStyle = Math.sin(now / 60) > 0 ? '#ffd60a' : '#ff7b00';
      ctx.beginPath();
      ctx.moveTo(pl.x + 14, pl.y + 16);
      ctx.lineTo(pl.x + 20, pl.y + 28 + Math.random() * 6);
      ctx.lineTo(pl.x + 26, pl.y + 16);
      ctx.moveTo(pl.x + pl.w - 26, pl.y + 16);
      ctx.lineTo(pl.x + pl.w - 20, pl.y + 28 + Math.random() * 6);
      ctx.lineTo(pl.x + pl.w - 14, pl.y + 16);
      ctx.fill();
    }

    // cores
    for (const c of this.cores) {
      if (c.taken) continue;
      this.drawCore(ctx, c.x, c.y + Math.sin(now / 250 + c.x) * 3, now);
    }

    // super stars + letters
    for (const p of this.pickups) if (!p.taken) this.drawPickup(ctx, p, now);

    // enemies
    for (const e of this.enemies) this.drawEnemy(ctx, e, now);

    // player
    this.drawPlayer(ctx, heroImg, now);

    // particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      if (p.text) {
        ctx.font = `bold ${p.size}px Bangers, Impact, sans-serif`;
        ctx.textAlign = 'center';
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#141018';
        ctx.strokeText(p.text, p.x, p.y);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  private groundTopAt(px: number) {
    const tx = Math.floor(px / T);
    for (let y = 0; y < ROWS; y++) if (SOLID.has(this.tile(tx, y))) return y * T;
    return GROUND * T;
  }

  private skyline(ctx: CanvasRenderingContext2D, off: number, viewW: number, baseY: number, color: string, hScale: number, seed: number) {
    const bw = 90;
    const start = Math.floor(off / bw) - 1;
    for (let i = start; i < start + viewW / bw + 3; i++) {
      const h = (60 + (((i * 7919 + seed * 31) % 97) / 97) * 140) * hScale;
      const x = i * bw - off;
      ctx.fillStyle = color;
      ctx.fillRect(x, baseY - h, bw - 12, h + 400);
      ctx.fillStyle = seed > 5 ? '#ffd60a55' : '#ffd60acc';
      for (let r = 0; r < h / 26 - 1; r++)
        for (let c = 0; c < 3; c++)
          if ((i * 3 + r * 5 + c * 7 + seed) % 4 === 0) ctx.fillRect(x + 10 + c * 22, baseY - h + 12 + r * 26, 9, 12);
    }
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  private drawTile(ctx: CanvasRenderingContext2D, t: number, x: number, y: number, now: number, tx: number, ty: number) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#141018';
    switch (t) {
      case ROOF: {
        ctx.fillStyle = '#3a2f7a';
        ctx.fillRect(x, y, T, T);
        ctx.fillStyle = '#ff7b00';
        ctx.fillRect(x, y, T, 10);
        ctx.fillStyle = '#ffd60a';
        ctx.fillRect(x, y, T, 3);
        // roof edge at gaps
        if (!SOLID.has(this.tile(tx - 1, ty))) ctx.strokeRect(x + 1.5, y + 1.5, 3, T);
        if (!SOLID.has(this.tile(tx + 1, ty))) ctx.strokeRect(x + T - 4.5, y + 1.5, 3, T);
        ctx.beginPath();
        ctx.moveTo(x, y + 10);
        ctx.lineTo(x + T, y + 10);
        ctx.stroke();
        break;
      }
      case WALL: {
        ctx.fillStyle = '#2b2160';
        ctx.fillRect(x, y, T, T);
        if ((tx + ty) % 3 === 0) {
          ctx.fillStyle = (tx * 7 + ty) % 5 === 0 ? '#ffd60a' : '#1b1446';
          ctx.fillRect(x + 12, y + 10, 14, 16);
        }
        break;
      }
      case BRICK: {
        ctx.fillStyle = '#c1502e';
        ctx.fillRect(x, y, T, T);
        ctx.strokeStyle = '#7a2e17';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + T / 2);
        ctx.lineTo(x + T, y + T / 2);
        ctx.moveTo(x + T / 2, y);
        ctx.lineTo(x + T / 2, y + T / 2);
        ctx.moveTo(x + T / 4, y + T / 2);
        ctx.lineTo(x + T / 4, y + T);
        ctx.moveTo(x + (3 * T) / 4, y + T / 2);
        ctx.lineTo(x + (3 * T) / 4, y + T);
        ctx.stroke();
        ctx.strokeStyle = '#141018';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 1.5, y + 1.5, T - 3, T - 3);
        break;
      }
      case CRATE: {
        const glow = 0.5 + 0.5 * Math.sin(now / 200);
        ctx.fillStyle = '#7b2cbf';
        ctx.fillRect(x, y, T, T);
        ctx.fillStyle = `rgba(255, 214, 10, ${0.5 + glow * 0.5})`;
        this.bolt(ctx, x + T / 2, y + T / 2, 0.9);
        ctx.strokeRect(x + 1.5, y + 1.5, T - 3, T - 3);
        ctx.fillStyle = '#141018';
        for (const [a, b] of [[5, 5], [T - 8, 5], [5, T - 8], [T - 8, T - 8]]) ctx.fillRect(x + a, y + b, 3, 3);
        break;
      }
      case SUPER: {
        const glow = 0.5 + 0.5 * Math.sin(now / 150);
        ctx.fillStyle = '#ffb703';
        ctx.fillRect(x, y, T, T);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + glow * 0.5})`;
        this.star(ctx, x + T / 2, y + T / 2, 13, 0);
        ctx.strokeRect(x + 1.5, y + 1.5, T - 3, T - 3);
        ctx.fillStyle = '#141018';
        for (const [a, b] of [[5, 5], [T - 8, 5], [5, T - 8], [T - 8, T - 8]]) ctx.fillRect(x + a, y + b, 3, 3);
        break;
      }
      case USED: {
        ctx.fillStyle = '#5a5f73';
        ctx.fillRect(x, y, T, T);
        ctx.strokeRect(x + 1.5, y + 1.5, T - 3, T - 3);
        break;
      }
      case STONE: {
        ctx.fillStyle = '#6c757d';
        ctx.fillRect(x, y, T, T);
        ctx.fillStyle = '#ffffff33';
        ctx.fillRect(x + 3, y + 3, T - 6, 5);
        ctx.strokeRect(x + 1.5, y + 1.5, T - 3, T - 3);
        break;
      }
      case CHIMNEY: {
        ctx.fillStyle = '#9d4edd';
        ctx.fillRect(x, y, T, T);
        const isTop = !SOLID.has(this.tile(tx, ty - 1));
        if (isTop) {
          ctx.fillStyle = '#c77dff';
          ctx.fillRect(x - 3, y, T + 6, 12);
          ctx.strokeRect(x - 1.5, y + 1.5, T + 3, 11);
          // smoke
          if ((tx % 2) === 0) {
            ctx.fillStyle = '#ffffff22';
            const s = (now / 900 + tx) % 1;
            ctx.beginPath();
            ctx.arc(x + T, y - 10 - s * 50, 8 + s * 10, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + T);
        ctx.moveTo(x + T, y);
        ctx.lineTo(x + T, y + T);
        ctx.stroke();
        break;
      }
    }
  }

  private bolt(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
    ctx.beginPath();
    ctx.moveTo(cx + 3 * s, cy - 14 * s);
    ctx.lineTo(cx - 8 * s, cy + 2 * s);
    ctx.lineTo(cx - 1 * s, cy + 2 * s);
    ctx.lineTo(cx - 4 * s, cy + 14 * s);
    ctx.lineTo(cx + 8 * s, cy - 3 * s);
    ctx.lineTo(cx + 1 * s, cy - 3 * s);
    ctx.closePath();
    ctx.fill();
  }

  private star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = rot - Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.45 : r;
      ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
  }

  private drawPickup(ctx: CanvasRenderingContext2D, p: Pickup, now: number) {
    const bob = p.rise > 0 ? 0 : Math.sin(now / 220 + p.x) * 4;
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#141018';
    if (p.kind === 'star') {
      ctx.fillStyle = `hsla(${(now / 6) % 360}, 100%, 60%, 0.35)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y + bob, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `hsl(${(now / 4) % 360}, 100%, 62%)`;
      this.star(ctx, p.x, p.y + bob, 17, Math.sin(now / 300) * 0.3);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#39ff1444';
      ctx.beginPath();
      ctx.arc(p.x, p.y + bob, 20 + Math.sin(now / 200) * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#39ff14';
      this.roundRect(ctx, p.x - 17, p.y + bob - 19, 34, 38, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#141018';
      ctx.font = '900 22px Nunito, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.ch, p.x, p.y + bob + 2);
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
    }
    ctx.restore();
  }

  private drawCore(ctx: CanvasRenderingContext2D, x: number, y: number, now: number) {
    const sx = Math.cos(now / 220 + x * 0.01);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(Math.max(0.15, Math.abs(sx)), 1);
    ctx.fillStyle = '#ffd60a';
    ctx.strokeStyle = '#141018';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * 13, Math.sin(a) * 13);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ff7b00';
    this.bolt(ctx, 0, 0, 0.55);
    ctx.restore();
  }

  private drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, now: number) {
    ctx.save();
    ctx.translate(e.x + e.w / 2, e.y + e.h);
    ctx.strokeStyle = '#141018';
    ctx.lineWidth = 3;
    if (e.dead > 0) ctx.scale(1.3, 0.3);
    if (e.kind === 'bug') {
      if (e.vx > 0) ctx.scale(-1, 1);
      // legs
      const l = Math.sin(now / 70) * 4;
      ctx.beginPath();
      for (const lx of [-10, 0, 10]) {
        ctx.moveTo(lx, -6);
        ctx.lineTo(lx - 4 + l * (lx === 0 ? -1 : 1), 0);
      }
      ctx.stroke();
      // body
      ctx.fillStyle = '#e63946';
      ctx.beginPath();
      ctx.ellipse(0, -15, 17, 13, 0, Math.PI, 0);
      ctx.lineTo(17, -6);
      ctx.lineTo(-17, -6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(0, -6);
      ctx.stroke();
      ctx.fillStyle = '#141018';
      for (const [dx, dy] of [[-8, -17], [8, -14], [-5, -10]]) {
        ctx.beginPath();
        ctx.arc(dx, dy, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      // head with glitch eye
      ctx.fillStyle = '#141018';
      ctx.beginPath();
      ctx.arc(-17, -12, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#39ff14';
      ctx.fillRect(-21, -15, 4, 3);
    } else if (e.kind === 'drone') {
      // propeller
      const pw = Math.abs(Math.sin(now / 30)) * 16 + 4;
      ctx.fillStyle = '#adb5bd';
      ctx.fillRect(-pw, -e.h - 6, pw * 2, 4);
      ctx.fillRect(-1.5, -e.h - 4, 3, 6);
      // tv body
      ctx.fillStyle = '#5a189a';
      this.roundRect(ctx, -17, -e.h + 2, 34, 26, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#10002b';
      ctx.fillRect(-12, -e.h + 7, 24, 16);
      ctx.fillStyle = '#39ff14';
      ctx.fillRect(-8, -e.h + 11, 5, 4);
      ctx.fillRect(3, -e.h + 11, 5, 4);
      ctx.fillRect(-6, -e.h + 18, 12, 2);
    } else {
      // spike ball
      ctx.rotate(now / 200);
      ctx.translate(0, 0);
      ctx.fillStyle = '#ff006e';
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const r = i % 2 ? 10 : 17;
        ctx.lineTo(Math.cos(a) * r, -15 + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffd60a';
      ctx.beginPath();
      ctx.arc(0, -15, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawGoal(ctx: CanvasRenderingContext2D, now: number) {
    const gx = this.goalX;
    const top = this.groundTopAt(gx + 10);
    // flag pole
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(gx, top - 7 * T, 6, 7 * T);
    ctx.fillStyle = '#ffd60a';
    ctx.beginPath();
    ctx.arc(gx + 3, top - 7 * T, 8, 0, Math.PI * 2);
    ctx.fill();
    const wave = Math.sin(now / 180) * 5;
    ctx.fillStyle = '#ff006e';
    ctx.beginPath();
    ctx.moveTo(gx + 6, top - 7 * T + 10);
    ctx.quadraticCurveTo(gx + 40, top - 7 * T + 10 + wave, gx + 70, top - 7 * T + 18);
    ctx.lineTo(gx + 6, top - 7 * T + 50);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Bangers, Impact, sans-serif';
    ctx.fillText('HS', gx + 14, top - 7 * T + 34);
    // HQ
    const hx = gx + 3 * T;
    ctx.fillStyle = '#5a189a';
    ctx.strokeStyle = '#141018';
    ctx.lineWidth = 5;
    ctx.fillRect(hx, top - 5 * T, 5 * T, 5 * T);
    ctx.strokeRect(hx, top - 5 * T, 5 * T, 5 * T);
    ctx.fillStyle = '#7b2cbf';
    ctx.beginPath();
    ctx.moveTo(hx - 12, top - 5 * T);
    ctx.lineTo(hx + 2.5 * T, top - 7 * T);
    ctx.lineTo(hx + 5 * T + 12, top - 5 * T);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffd60a';
    ctx.beginPath();
    ctx.arc(hx + 2.5 * T, top - 3.6 * T, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#141018';
    ctx.font = 'bold 26px Bangers, Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('H', hx + 2.5 * T, top - 3.6 * T + 9);
    ctx.fillStyle = this.mode === 'win' ? '#ffd60a' : '#22223b';
    ctx.fillRect(hx + 1.8 * T, top - 1.6 * T, 1.4 * T, 1.6 * T);
    // friendly Glitch waving at the door
    const gy = top - 50 + Math.sin(now / 300) * 2;
    const gxx = hx + 4.3 * T;
    ctx.fillStyle = '#5a189a';
    this.roundRect(ctx, gxx - 16, gy - 4, 32, 28, 6);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#10002b';
    ctx.fillRect(gxx - 11, gy + 1, 22, 17);
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(gxx, gy + 8, 6, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.fillStyle = '#3c096c';
    ctx.fillRect(gxx - 13, gy + 24, 26, 26);
    ctx.strokeStyle = '#141018';
    ctx.beginPath();
    ctx.moveTo(gxx + 13, gy + 28);
    ctx.lineTo(gxx + 26, gy + 10 + Math.sin(now / 120) * 8);
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.textAlign = 'left';
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, now: number) {
    if (this.invuln > 0 && this.mode === 'run' && Math.floor(now / 80) % 2 === 0) return;
    const w = 56;
    const h = 80;
    const cx = this.px + this.pw / 2;
    const by = this.py + this.ph + 2;
    if (this.superT > 0 && (this.superT > 2 || Math.floor(now / 120) % 2 === 0)) {
      // rainbow super aura (blinks in the last 2 seconds)
      const gr = ctx.createRadialGradient(cx, by - 40, 10, cx, by - 40, 66);
      gr.addColorStop(0, `hsla(${(now / 3) % 360}, 100%, 65%, 0.95)`);
      gr.addColorStop(0.6, `hsla(${(now / 3 + 60) % 360}, 100%, 60%, 0.5)`);
      gr.addColorStop(1, `hsla(${(now / 3 + 120) % 360}, 100%, 60%, 0)`);
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(cx, by - 40, 66, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.save();
    if (this.mode === 'win') ctx.globalAlpha = Math.max(0, 1 - this.doorT * 2.5);
    ctx.translate(cx, by);
    if (this.mode === 'dying') ctx.rotate(this.dyingT * 8);
    let sy = 1;
    let sxs = 1;
    let tilt = 0;
    let bob = 0;
    if (!this.onGround && this.mode === 'run') {
      sy = 1.08;
      sxs = 0.92;
      tilt = this.facing * 0.12;
    } else if (this.squash > 0) {
      sy = 1 - this.squash * 0.18;
      sxs = 1 + this.squash * 0.18;
    } else if (Math.abs(this.vx) > 10 || this.mode === 'win') {
      bob = Math.abs(Math.sin(this.runPhase)) * -5;
      tilt = Math.sin(this.runPhase * 2) * 0.06 + this.facing * 0.08;
    }
    ctx.rotate(tilt);
    ctx.scale(sxs * this.facing, sy);
    // shadow
    ctx.fillStyle = '#00000044';
    ctx.beginPath();
    ctx.ellipse(0, -2 - bob, 18, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    if (img && img.complete) ctx.drawImage(img, -w / 2, -h + bob, w, h);
    else {
      ctx.fillStyle = '#ffd60a';
      ctx.fillRect(-14, -h + bob, 28, h);
    }
    ctx.restore();
  }
}
