import { useGame } from '../game/GameContext';
import { ROOMS } from '../data/rooms';
import { Modal } from './ui';

export function TeacherMenu({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();
  const inRoom = state.phase === 'room';
  const stage = inRoom ? ROOMS[state.roomIndex].stages[state.stageIndex] : null;

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
          <b>Aktuell:</b> Raum {state.roomIndex + 1} „{ROOMS[state.roomIndex].name}“ – {stage.title}
          <div className="teacher-solution">
            <b>Lösungshilfe:</b> {stage.hints[1]}
          </div>
        </div>
      )}

      <div className="teacher-grid">
        <button className="btn btn-yellow" disabled={!inRoom} onClick={() => act(() => dispatch({ type: 'SKIP_STAGE' }))}>
          ⏭ Aufgabe überspringen
        </button>
        <button
          className="btn btn-yellow"
          disabled={!inRoom}
          onClick={() =>
            act(() => {
              const rest = ROOMS[state.roomIndex].stages.length - state.stageIndex;
              for (let i = 0; i < rest; i++) dispatch({ type: 'SKIP_STAGE' });
            })
          }
        >
          ⏩ Ganzen Raum überspringen
        </button>
      </div>

      <h3>Direkt zu Raum springen</h3>
      <div className="teacher-grid">
        {ROOMS.map((r, i) => (
          <button key={r.id} className="btn btn-ghost" onClick={() => act(() => dispatch({ type: 'JUMP_ROOM', room: i }))}>
            {i + 1}. {r.name}
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
          🏁 Mission sofort beenden (Abschluss-Screen)
        </button>
        <button className="btn btn-red" onClick={() => act(() => dispatch({ type: 'RESET' }))}>
          ↻ Komplett zurücksetzen
        </button>
      </div>
    </Modal>
  );
}
