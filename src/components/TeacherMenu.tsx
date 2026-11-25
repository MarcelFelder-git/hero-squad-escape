import { useGame } from '../game/GameContext';
import { LEVELS } from '../data/levels';
import { Modal } from './ui';
import { hintsFor } from '../data/puzzles';

export function TeacherMenu({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();
  const inLevel = state.phase === 'level';
  const level = LEVELS[state.levelIndex];
  const stage = inLevel ? level.stages[state.stageIndex] : null;

  const act = (fn: () => void) => {
    fn();
    onClose();
  };

  return (
    <Modal title="🧑‍🏫 Lehrkräfte-Menü" onClose={onClose} className="teacher">
      <p className="muted small">
        Öffnen: 5× schnell auf das Logo tippen oder <kbd>Strg</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd>. Übersprungene Aufgaben
        zählen nicht als Fehler, werden aber in der Auswertung vermerkt.
      </p>

      {stage && (
        <div className="teacher-box">
          <b>Aktuell:</b> Level {state.levelIndex + 1} „{level.name}“ – {stage.title}
          <div className="teacher-solution">
            <b>Lösungshilfe:</b> {hintsFor(stage.kind, stage.hints)[1]}
          </div>
        </div>
      )}

      <div className="teacher-grid">
        <button className="btn btn-yellow" disabled={!inLevel} onClick={() => act(() => dispatch({ type: 'SKIP_STAGE' }))}>
          ⏭ Aufgabe überspringen
        </button>
        <button
          className="btn btn-yellow"
          disabled={!inLevel}
          onClick={() =>
            act(() => {
              const rest = level.stages.length - state.stageIndex;
              for (let i = 0; i < rest; i++) dispatch({ type: 'SKIP_STAGE' });
            })
          }
        >
          ⏩ Ganzes Level überspringen
        </button>
      </div>

      <h3>Direkt zu Level springen</h3>
      <div className="teacher-grid three">
        {LEVELS.map((l, i) => (
          <button key={l.id} className="btn btn-ghost" onClick={() => act(() => dispatch({ type: 'JUMP_LEVEL', level: i }))}>
            {i + 1}. {l.name}
          </button>
        ))}
      </div>

      <h3>Aufgaben-Set</h3>
      <p className="muted small">
        Set A = Wörter vom ersten Testlauf, Set B = neue Wörter und Sätze (gleiche Rätsel). Jede neue Gruppe bekommt automatisch
        abwechselnd A/B. Wechsel startet die aktuelle Aufgabe neu.
      </p>
      <div className="teacher-grid">
        {[0, 1].map((v) => (
          <button
            key={v}
            className={`btn ${state.variant === v ? 'btn-yellow' : 'btn-ghost'}`}
            onClick={() => {
              localStorage.setItem('hero-variant-last', String(v));
              dispatch({ type: 'SET_VARIANT', variant: v });
            }}
          >
            {state.variant === v ? '✔ ' : ''}Set {v === 0 ? 'A' : 'B'}
          </button>
        ))}
      </div>

      <h3>Spiel</h3>
      <div className="teacher-grid">
        <button
          className="btn btn-ghost"
          disabled={state.phase === 'complete' || !state.heroes.length}
          onClick={() => act(() => dispatch({ type: 'FINISH' }))}
        >
          🏁 Mission sofort beenden
        </button>
        <button className="btn btn-red" onClick={() => act(() => dispatch({ type: 'RESET' }))}>
          ↻ Komplett zurücksetzen
        </button>
      </div>

      <h3>Seiten für die Präsentation</h3>
      <div className="teacher-grid three">
        <a className="btn btn-ghost" href="/presenter" target="_blank" rel="noreferrer">
          🎬 Intro / Presenter
        </a>
        <a className="btn btn-ghost" href="/hall" target="_blank" rel="noreferrer">
          🏆 Hall of Heroes
        </a>
        <a className="btn btn-ghost" href="/worksheet" target="_blank" rel="noreferrer">
          🖨 QR-Arbeitsblatt
        </a>
      </div>
    </Modal>
  );
}
