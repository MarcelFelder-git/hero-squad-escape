import { useEffect, useState } from 'react';
import { GameProvider, useGame } from './game/GameContext';
import { TopBar } from './components/TopBar';
import { GlossaryModal } from './components/GlossaryModal';
import { TeacherMenu } from './components/TeacherMenu';
import { ConfirmDialog } from './components/ui';
import { TitleScreen, PlayerSelect, Briefing } from './screens/StartScreens';
import { HeroCreator } from './screens/HeroCreator';
import { RoomScreen } from './screens/RoomScreen';
import { TransitionScreen, CompleteScreen } from './screens/EndScreens';
import { sfx } from './audio/sound';

function Shell() {
  const { state, dispatch } = useGame();
  const [glossary, setGlossary] = useState(false);
  const [teacher, setTeacher] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // hidden teacher shortcut: Ctrl+Shift+L (or Cmd+Shift+L)
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setTeacher((t) => !t);
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);

  // toasts disappear on their own
  useEffect(() => {
    if (!state.toast) return;
    sfx.power();
    const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3200);
    return () => clearTimeout(t);
  }, [state.toast, dispatch]);

  const reset = () => {
    setConfirmReset(false);
    window.speechSynthesis?.cancel();
    dispatch({ type: 'RESET' });
  };

  return (
    <div className={`app phase-${state.phase}`}>
      <TopBar onGlossary={() => setGlossary(true)} onRestart={() => setConfirmReset(true)} onTeacher={() => setTeacher(true)} />
      <div className="stage-area">
        {state.phase === 'title' && <TitleScreen />}
        {state.phase === 'players' && <PlayerSelect />}
        {state.phase === 'creator' && <HeroCreator />}
        {state.phase === 'briefing' && <Briefing />}
        {state.phase === 'room' && <RoomScreen />}
        {state.phase === 'transition' && <TransitionScreen />}
        {state.phase === 'complete' && <CompleteScreen onRestart={reset} />}
      </div>

      {state.toast && (
        <div key={state.toast.id} className={`toast toast-${state.toast.kind}`} role="status">
          {state.toast.text}
        </div>
      )}

      {glossary && <GlossaryModal onClose={() => setGlossary(false)} />}
      {teacher && <TeacherMenu onClose={() => setTeacher(false)} />}
      {confirmReset && (
        <ConfirmDialog
          title="Neu starten?"
          text="Die aktuelle Mission und alle Helden werden gelöscht. Perfekt für die nächste Gruppe!"
          yes="↻ Ja, neu starten"
          onYes={reset}
          onNo={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Shell />
    </GameProvider>
  );
}
