import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { useGame } from '../game/GameContext';
import { ROOMS, type StageKind } from '../data/rooms';
import { POINTS, heroForSlot } from '../game/state';
import type { PuzzleProps } from '../game/types';
import { SceneBackdrop } from '../components/art/Scenes';
import { Echo, Glitch } from '../components/art/Characters';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { Burst, SpeakButton } from '../components/ui';
import { sfx } from '../audio/sound';

import { WireMatch } from '../puzzles/WireMatch';
import { SpotTheSpy } from '../puzzles/SpotTheSpy';
import { BugHunt } from '../puzzles/BugHunt';
import { SentenceBuilder } from '../puzzles/SentenceBuilder';
import { VerbVault } from '../puzzles/VerbVault';
import { DiaryGaps } from '../puzzles/DiaryGaps';
import { QuestionRadio } from '../puzzles/QuestionRadio';
import { FrequencyCode } from '../puzzles/FrequencyCode';
import { BossBattle } from '../puzzles/BossBattle';
import { FinalGate } from '../puzzles/FinalGate';

const PUZZLES: Record<StageKind, ComponentType<PuzzleProps>> = {
  wires: WireMatch,
  spy: SpotTheSpy,
  bughunt: BugHunt,
  builder: SentenceBuilder,
  vault: VerbVault,
  diary: DiaryGaps,
  radio: QuestionRadio,
  frequency: FrequencyCode,
  boss: BossBattle,
  finalgate: FinalGate,
};

const GOOD = ['POW!', 'ZAP!', 'BOOM!', 'WHAM!', 'YES!', 'SUPER!', 'KAPOW!'];
const BAD = ['OOPS!', 'BZZT!', 'NOPE!'];
const GLITCH_LAUGH = ['Ha ha! Wrong!', 'Bzzzt! Try again, heroes!', 'Mwahaha! That was a mistake!', 'Oh no… for YOU!'];

export function RoomScreen() {
  const { state, dispatch } = useGame();
  const room = ROOMS[state.roomIndex];
  const stage = room.stages[state.stageIndex];
  const Puzzle = PUZZLES[stage.kind];
  const [burst, setBurst] = useState<{ id: number; text: string; kind: 'good' | 'bad' } | null>(null);
  const [shake, setShake] = useState(0);
  const [glitchSays, setGlitchSays] = useState<string | null>(null);
  const solvedRef = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    solvedRef.current = false;
  }, [state.roomIndex, state.stageIndex]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const onCorrect = useCallback(
    (points?: number) => {
      sfx.correct();
      dispatch({ type: 'CORRECT', points });
      const id = Date.now();
      setBurst({ id, text: GOOD[Math.floor(Math.random() * GOOD.length)], kind: 'good' });
      later(() => setBurst((b) => (b?.id === id ? null : b)), 750);
    },
    [dispatch],
  );

  const onWrong = useCallback(() => {
    sfx.wrong();
    dispatch({ type: 'WRONG' });
    setShake((s) => s + 1);
    const id = Date.now();
    setBurst({ id, text: BAD[Math.floor(Math.random() * BAD.length)], kind: 'bad' });
    later(() => setBurst((b) => (b?.id === id ? null : b)), 650);
    if (Math.random() < 0.5) {
      const line = GLITCH_LAUGH[Math.floor(Math.random() * GLITCH_LAUGH.length)];
      setGlitchSays(line);
      later(() => setGlitchSays((g) => (g === line ? null : g)), 2200);
    }
  }, [dispatch]);

  const onSolved = useCallback(() => {
    if (solvedRef.current) return;
    solvedRef.current = true;
    later(() => {
      sfx.unlock();
      dispatch({ type: 'STAGE_SOLVED' });
    }, 900);
  }, [dispatch]);

  const multi = state.heroes.length > 1;
  const instructionText = `${stage.title}. ${stage.instruction}`;

  return (
    <div className="screen room-screen">
      <div className="scene-banner">
        <SceneBackdrop scene={room.scene} />
        <div className="scene-overlay">
          <div className="room-badge">
            <span className="room-num">ROOM {state.roomIndex + 1}</span>
            <span className="room-name">{room.name}</span>
            <span className="room-topic">{room.topic}</span>
          </div>
          <div className="scene-heroes">
            {state.heroes.map((h, i) => (
              <HeroAvatar key={i} hero={h} className="scene-hero bob" />
            ))}
          </div>
          <div className="scene-glitch">
            {glitchSays && <div className="bubble bubble-villain bubble-small">{glitchSays}</div>}
            <Glitch className="scene-glitch-svg glitch-anim" mood={glitchSays ? 'evil' : 'angry'} />
          </div>
        </div>
      </div>

      <main className="room-main">
        <section className={`panel puzzle-panel ${shake ? (shake % 2 ? 'shake1' : 'shake2') : ''}`}>
          <div className="puzzle-head">
            <div className="stage-pill">
              Mission {state.stageIndex + 1}/{room.stages.length}
            </div>
            <h2>
              {stage.title} <SpeakButton text={instructionText} small />
            </h2>
            <p className="instr">{stage.instruction}</p>
            <p className="instr-de">{stage.instructionDe}</p>
          </div>

          {multi && (
            <div className="team-task">
              <span className="team-task-title">👥 Team mission</span>
              {(stage.kind === 'boss' ? stage.team.filter((t) => t.slot < state.heroes.length) : stage.team).map((t, i) => {
                  const h = heroForSlot(state.heroes, t.slot);
                  return (
                    <span key={i} className="team-role">
                      <HeroAvatar hero={h} bust className="role-avatar" />
                      <b>{h.name}</b> {t.task}
                    </span>
                  );
                })}
            </div>
          )}

          <PuzzleHost key={`${state.roomIndex}-${state.stageIndex}`} Puzzle={Puzzle} onCorrect={onCorrect} onWrong={onWrong} onSolved={onSolved} />
        </section>

        <HintBox />
      </main>

      {burst && <Burst key={burst.id} text={burst.text} kind={burst.kind} />}
      {state.showRoomIntro && <RoomIntro />}
    </div>
  );
}

/** Puzzle is keyed by room+stage, so it resets only when the stage changes */
function PuzzleHost({
  Puzzle,
  onCorrect,
  onWrong,
  onSolved,
}: {
  Puzzle: ComponentType<PuzzleProps>;
  onCorrect: PuzzleProps['onCorrect'];
  onWrong: PuzzleProps['onWrong'];
  onSolved: PuzzleProps['onSolved'];
}) {
  const { state } = useGame();
  return <Puzzle heroes={state.heroes} onCorrect={onCorrect} onWrong={onWrong} onSolved={onSolved} />;
}

function HintBox() {
  const { state, dispatch } = useGame();
  const stage = ROOMS[state.roomIndex].stages[state.stageIndex];
  const level = state.hintLevel;
  const freeAvailable =
    state.heroes.some((h) => h.power === 'mindhacker') && !state.roomStats[state.roomIndex].freeHintUsed;
  const nextCost = level === 0 ? POINTS.hint1 : POINTS.hint2;

  return (
    <aside className="panel hint-box">
      <div className="hint-head">
        <Echo className="hint-echo" talking={level > 0} />
        <div>
          <b>ECHO</b>
          <div className="muted small">HQ computer</div>
        </div>
      </div>
      {level === 0 && <p className="hint-idle">Stuck? Ask me for a hint!<br /><span className="de small">Kommt ihr nicht weiter? Fragt mich!</span></p>}
      {stage.hints.slice(0, level).map((h, i) => (
        <div key={i} className={`bubble bubble-echo hint-text hint-${i + 1}`}>
          <b>Hint {i + 1}:</b> {h}
        </div>
      ))}
      <button
        className="btn btn-blue full"
        disabled={level >= 2}
        onClick={() => {
          sfx.hint();
          dispatch({ type: 'HINT' });
        }}
      >
        💡 {level === 0 ? 'Hint 1: kleiner Tipp' : level === 1 ? 'Hint 2: fast die Lösung' : 'Keine Tipps mehr'}
        {level < 2 && <span className="cost">{freeAvailable ? 'gratis 🧠' : `−${nextCost} ★`}</span>}
      </button>
    </aside>
  );
}

function RoomIntro() {
  const { state, dispatch } = useGame();
  const room = ROOMS[state.roomIndex];
  return (
    <div className="modal-backdrop">
      <div className="panel room-intro pop-in">
        <div className="room-intro-title" style={{ ['--core' as string]: room.coreColor }}>
          <span className="room-num">ROOM {state.roomIndex + 1}</span>
          <h2>{room.name}</h2>
          <span className="de">{room.nameDe} · {room.topic}</span>
        </div>
        <div className="intro-row">
          <Glitch className="intro-glitch glitch-anim" />
          <div className="bubble bubble-villain">
            {room.glitchTaunt} <SpeakButton text={room.glitchTaunt} small />
          </div>
        </div>
        <div className="intro-row reverse">
          <Echo className="intro-echo" talking />
          <div className="bubble bubble-echo">
            {room.echoIntro} <SpeakButton text={room.echoIntro} small />
          </div>
        </div>
        <button
          className="btn btn-big btn-yellow"
          onClick={() => {
            sfx.whoosh();
            dispatch({ type: 'CLOSE_ROOM_INTRO' });
          }}
        >
          Let's go, heroes! →
        </button>
      </div>
    </div>
  );
}
