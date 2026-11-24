// Tiny synthesizer with the Web Audio API – no audio files needed.

let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(m: boolean) {
  muted = m;
}

function ac(): AudioContext | null {
  if (muted) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** call inside a user gesture (iPad needs this before any sound plays) */
export function unlockAudio() {
  const c = ac();
  if (!c) return;
  const b = c.createBuffer(1, 1, 22050);
  const s = c.createBufferSource();
  s.buffer = b;
  s.connect(c.destination);
  s.start(0);
}

interface ToneOpts {
  freq: number;
  to?: number;
  dur: number;
  type?: OscillatorType;
  vol?: number;
  delay?: number;
}

function tone({ freq, to, dur, type = 'square', vol = 0.12, delay = 0 }: ToneOpts) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise(dur: number, vol = 0.08, delay = 0, hp = 800) {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = c.createBufferSource();
  s.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = hp;
  const g = c.createGain();
  g.gain.value = vol;
  s.connect(f).connect(g).connect(c.destination);
  s.start(t);
}

export const sfx = {
  click() {
    tone({ freq: 660, dur: 0.05, type: 'triangle', vol: 0.08 });
  },
  select() {
    tone({ freq: 520, to: 780, dur: 0.08, type: 'triangle', vol: 0.09 });
  },
  correct() {
    [523, 659, 784].forEach((f, i) => tone({ freq: f, dur: 0.14, type: 'square', vol: 0.07, delay: i * 0.07 }));
  },
  wrong() {
    tone({ freq: 180, to: 90, dur: 0.3, type: 'sawtooth', vol: 0.09 });
    noise(0.15, 0.04, 0, 2000);
  },
  hint() {
    tone({ freq: 880, dur: 0.08, type: 'sine', vol: 0.1 });
    tone({ freq: 1320, dur: 0.12, type: 'sine', vol: 0.08, delay: 0.09 });
  },
  unlock() {
    tone({ freq: 200, to: 1200, dur: 0.5, type: 'sawtooth', vol: 0.06 });
    [784, 988, 1175, 1568].forEach((f, i) => tone({ freq: f, dur: 0.18, type: 'square', vol: 0.06, delay: 0.45 + i * 0.09 }));
  },
  whoosh() {
    noise(0.4, 0.07, 0, 400);
    tone({ freq: 300, to: 900, dur: 0.35, type: 'sine', vol: 0.05 });
  },
  glitch() {
    for (let i = 0; i < 6; i++) {
      tone({ freq: 100 + Math.random() * 900, dur: 0.04, type: 'square', vol: 0.06, delay: i * 0.05 });
    }
    noise(0.3, 0.05, 0.05, 3000);
  },
  pow() {
    noise(0.25, 0.12, 0, 200);
    tone({ freq: 150, to: 60, dur: 0.25, type: 'square', vol: 0.1 });
  },
  power() {
    [392, 523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, dur: 0.1, type: 'triangle', vol: 0.08, delay: i * 0.05 }));
  },
  victory() {
    const notes = [523, 523, 523, 659, 784, 659, 784, 1047];
    const times = [0, 0.15, 0.3, 0.45, 0.75, 0.9, 1.05, 1.25];
    notes.forEach((f, i) => tone({ freq: f, dur: i === notes.length - 1 ? 0.8 : 0.16, type: 'square', vol: 0.07, delay: times[i] }));
    notes.forEach((f, i) => tone({ freq: f / 2, dur: 0.16, type: 'triangle', vol: 0.06, delay: times[i] }));
  },
};
