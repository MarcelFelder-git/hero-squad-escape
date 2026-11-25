// Printable worksheet (/worksheet): reading task + colouring QR code. Print on A4 (Chrome/Edge: "Drucken").
import { WORKSHEET_STORY, WORKSHEET_STORY_TITLE, WORKSHEET_TASKS, type TFN } from '../data/puzzles2';
import layout from '../data/qrLayout.json';

const LETTER: Record<TFN, string> = { true: 'A', false: 'B', not: 'C' };
const Q = 4; // quiet zone

function QrGrid({ solution }: { solution?: boolean }) {
  const N = layout.size;
  const puzzle = new Map<string, string>();
  for (const [r, c, code] of layout.cells as [number, number, string][]) puzzle.set(`${r},${c}`, code);
  const S = 10;
  const total = (N + Q * 2) * S;
  const cells = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const dark = layout.rows[r][c] === '1';
      const code = puzzle.get(`${r},${c}`);
      const x = (c + Q) * S;
      const y = (r + Q) * S;
      if (code && !(solution && dark)) {
        cells.push(
          <g key={`${r}-${c}`}>
            <rect x={x + 0.4} y={y + 0.4} width={S - 0.8} height={S - 0.8} fill="#fff" stroke="#888" strokeWidth={0.6} />
            <text x={x + S / 2} y={y + S / 2 + 1.6} textAnchor="middle" fontSize={4.4} fontWeight={700} fill="#777">
              {code}
            </text>
          </g>,
        );
      } else if (dark) {
        cells.push(<rect key={`${r}-${c}`} x={x} y={y} width={S + 0.15} height={S + 0.15} fill="#000" />);
      } else {
        cells.push(<rect key={`${r}-${c}`} x={x + 0.2} y={y + 0.2} width={S - 0.4} height={S - 0.4} fill="none" stroke="#e3e3e3" strokeWidth={0.4} />);
      }
    }
  }
  return (
    <svg className="qr-grid" viewBox={`0 0 ${total} ${total}`} role="img" aria-label="QR puzzle grid">
      <rect width={total} height={total} fill="#fff" />
      {cells}
    </svg>
  );
}

export default function Worksheet() {
  return (
    <div className="worksheet">
      <div className="ws-toolbar no-print">
        <b>🖨 QR-Arbeitsblatt</b>
        <span>Seite 1–2 für die Kinder (doppelseitig oder 2 Blätter), Seite 3 = Lösung für Lehrkräfte.</span>
        <button className="btn btn-yellow" onClick={() => window.print()}>
          Drucken
        </button>
      </div>

      {/* PAGE 1 – story + tasks */}
      <section className="ws-page">
        <header className="ws-head">
          <div>
            <div className="ws-kicker">HERO SQUAD · Secret mission 1</div>
            <h1>Crack the Glitch code!</h1>
          </div>
          <div className="ws-names">
            Hero team: ______________________________
          </div>
        </header>
        <div className="ws-howto">
          <b>1</b> Read the story. <b>2</b> Tick <b>A</b> (true), <b>B</b> (false) or <b>C</b> (not in the text).{' '}
          <b>3</b> Find the boxes with your codes (for example <i>1A</i>) on page 2 and colour them <b>black</b>.{' '}
          <b>4</b> Scan the code with the iPad camera!
        </div>
        <article className="ws-story">
          <h2>{WORKSHEET_STORY_TITLE}</h2>
          {WORKSHEET_STORY.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
        <table className="ws-tasks">
          <thead>
            <tr>
              <th></th>
              <th>Statement</th>
              <th>A<br />true</th>
              <th>B<br />false</th>
              <th>C<br />not in the text</th>
            </tr>
          </thead>
          <tbody>
            {WORKSHEET_TASKS.map((t, i) => (
              <tr key={i}>
                <td className="num">{i + 1}</td>
                <td>{t.s}</td>
                <td className="box">☐</td>
                <td className="box">☐</td>
                <td className="box">☐</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="ws-foot">Tip: Your code for task 1 is <b>1A</b>, <b>1B</b> or <b>1C</b>. Colour only YOUR codes! 🖍</p>
      </section>

      {/* PAGE 2 – grid */}
      <section className="ws-page">
        <header className="ws-head">
          <div>
            <div className="ws-kicker">HERO SQUAD · Secret mission 1</div>
            <h1>The secret code</h1>
          </div>
          <div className="ws-codes">
            My codes: 1__ 2__ 3__ 4__ 5__ 6__ 7__ 8__
          </div>
        </header>
        <p className="ws-howto small">
          Colour every box with one of your codes completely <b>black</b> (or very dark). Don’t colour the other boxes!
        </p>
        <QrGrid />
      </section>

      {/* PAGE 3 – solution */}
      <section className="ws-page ws-solution">
        <header className="ws-head">
          <div>
            <div className="ws-kicker">Lösung für Lehrkräfte</div>
            <h1>Solution</h1>
          </div>
        </header>
        <p>
          <b>Antworten:</b>{' '}
          {WORKSHEET_TASKS.map((t, i) => `${i + 1}${LETTER[t.a]}`).join(' · ')}
        </p>
        <p className="small">
          So sieht ein richtig ausgemaltes Blatt aus (zum Testen einfach mit dem iPad scannen). Der Code führt zu <code>{layout.text}</code> (öffnet das Spiel mit „Access
          granted“). Ein einzelner Fehler wird von der Fehlerkorrektur noch verziehen – bei mehreren Fehlern funktioniert der Code
          nicht.
        </p>
        <QrGrid solution />
      </section>
    </div>
  );
}
