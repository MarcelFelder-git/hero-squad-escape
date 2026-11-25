// Builds the colouring QR puzzle for the worksheet and checks that it really works:
//   node scripts/make-qr-layout.mjs
// - solved sheet decodes
// - empty sheet does NOT decode
// - one wrong task still decodes (error correction is kind)
// Output: src/data/qrLayout.json
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { writeFileSync } from 'node:fs';

const TEXT = 'HTTPS://HERO-SQUAD-ESCAPE.VERCEL.APP/HERO';
// answers of WORKSHEET_TASKS (A = true, B = false, C = not in the text)
const ANSWERS = ['A', 'B', 'C', 'A', 'A', 'B', 'C', 'A'];
const OPTS = ['A', 'B', 'C'];
const DARK_PER_ANSWER = 6;
const LIGHT_PER_WRONG = 3;

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const qr = QRCode.create(TEXT, { errorCorrectionLevel: 'Q', version: 3 });
const N = qr.modules.size;
const get = (r, c) => qr.modules.data[r * N + c];
const reserved = (r, c) => qr.modules.reservedBit[r * N + c];

function decode(matrix) {
  const scale = 8;
  const quiet = 4;
  const W = (N + quiet * 2) * scale;
  const img = new Uint8ClampedArray(W * W * 4).fill(255);
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++)
      if (matrix[r][c])
        for (let y = 0; y < scale; y++)
          for (let x = 0; x < scale; x++) {
            const i = (((r + quiet) * scale + y) * W + (c + quiet) * scale + x) * 4;
            img[i] = img[i + 1] = img[i + 2] = 0;
          }
  const res = jsQR(img, W, W, { inversionAttempts: 'dontInvert' });
  return res?.data ?? null;
}

const solved = Array.from({ length: N }, (_, r) => Array.from({ length: N }, (_, c) => get(r, c)));

function sheet(cells, answers) {
  // answers[t] = chosen letter or null (blank)
  const m = solved.map((row) => [...row]);
  for (const cell of cells) m[cell.r][cell.c] = 0;
  for (const cell of cells) {
    const t = Number(cell.code[0]) - 1;
    if (answers[t] === cell.code[1]) m[cell.r][cell.c] = 1;
  }
  return m;
}

function tryLayout(seed) {
  const rnd = mulberry32(seed);
  const dark = [];
  const light = [];
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      if (reserved(r, c)) continue;
      (get(r, c) ? dark : light).push({ r, c });
    }
  const take = (arr) => arr.splice(Math.floor(rnd() * arr.length), 1)[0];
  const cells = [];
  ANSWERS.forEach((ans, t) => {
    for (const o of OPTS) {
      const n = o === ans ? DARK_PER_ANSWER : LIGHT_PER_WRONG;
      for (let k = 0; k < n; k++) cells.push({ ...take(o === ans ? dark : light), code: `${t + 1}${o}` });
    }
  });
  const ok = (a) => decode(sheet(cells, a)) === TEXT;
  if (!ok(ANSWERS)) return null;
  if (decode(sheet(cells, ANSWERS.map(() => null))) === TEXT) return null;
  // every single wrong answer must still work
  for (let t = 0; t < 8; t++)
    for (const o of OPTS) {
      if (o === ANSWERS[t]) continue;
      const a = [...ANSWERS];
      a[t] = o;
      if (!ok(a)) return null;
    }
  // how many "3 tasks left blank" sheets fail? (higher = harder to cheat)
  let fails = 0;
  let total = 0;
  for (let i = 0; i < 8; i++)
    for (let j = i + 1; j < 8; j++)
      for (let k = j + 1; k < 8; k++) {
        const a = [...ANSWERS];
        a[i] = a[j] = a[k] = null;
        total++;
        if (!ok(a)) fails++;
      }
  // half solved must fail
  if (ok([...ANSWERS.slice(0, 4), null, null, null, null]) || ok([null, null, null, null, ...ANSWERS.slice(4)])) return null;
  return { cells, fails, total };
}

let best = null;
for (let seed = 1; seed <= 400; seed++) {
  const res = tryLayout(seed);
  if (res && (!best || res.fails > best.fails)) {
    best = { ...res, seed };
    if (res.fails === res.total) break;
  }
}
if (!best) {
  console.error('No layout found');
  process.exit(1);
}
console.log(`size ${N}, mask ${qr.maskPattern}, seed ${best.seed}, puzzle cells ${best.cells.length}`);
console.log(`3-blank sheets failing: ${best.fails}/${best.total}`);

writeFileSync(
  new URL('../src/data/qrLayout.json', import.meta.url),
  JSON.stringify(
    {
      text: TEXT,
      size: N,
      rows: solved.map((row) => row.join('')),
      cells: best.cells.map(({ r, c, code }) => [r, c, code]),
    },
    null,
    0,
  ),
);
console.log('written src/data/qrLayout.json');
