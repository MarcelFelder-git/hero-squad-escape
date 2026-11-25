import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { useGame } from '../game/GameContext';
import { LEVELS, type StageKind } from '../data/levels';
import { POINTS, gearCount, heroForSlot } from '../game/state';
import { hintsFor } from '../data/puzzles';
import type { Hero, PuzzleProps } from '../game/types';
import { SceneBackdrop } from '../components/art/Scenes';
import { Echo, Glitch } from '../components/art/Characters';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { Burst, SpeakButton } from '../components/ui';
import { HackEvent, CallEvent } from '../components/Events';
import { sfx } from '../audio/sound';
import { speakGlitch, stopSpeaking } from '../audio/speech';

import { WireMatch } from '../puzzles/WireMatch';
import { SpotTheSpy } from '../puzzles/SpotTheSpy';
import { BugHunt } from '../puzzles/BugHunt';
import { SentenceBuilder } from '../puzzles/SentenceBuilder';
import { VerbVault } from '../puzzles/VerbVault';
import { DiaryGaps } from '../puzzles/DiaryGaps';
import { QuestionRadio } from '../puzzles/QuestionRadio';
import { FrequencyCode } from '../puzzles/FrequencyCode';
import { BossBattle } from '../puzzles/BossBattle';
import { VocabBlitzEnDe, VocabBlitzDeEn } from '../puzzles/VocabBlitz';
import { VocabSpell } from '../puzzles/VocabSpell';
import { ListeningShow } from '../puzzles/ListeningShow';
import { QuestionMachine } from '../puzzles/QuestionMachine';
import { LightsOut } from '../puzzles/LightsOut';
import { GapText } from '../puzzles/GapText';
import { GlitchTwist } from '../puzzles/GlitchTwist';
import { HeroProfile } from '../puzzles/HeroProfile';

const PUZZLES: Record<StageKind, ComponentType<PuzzleProps>> = {
  wires: WireMatch,
  spy: SpotTheSpy,
  vocab1: VocabBlitzEnDe,
  bughunt: BugHunt,
  builder: SentenceBuilder,
  listening: ListeningShow,
  vault: VerbVault,
  diary: DiaryGaps,
  questions: QuestionMachine,
  reading: LightsOut,
  radio: QuestionRadio,
  frequency: FrequencyCode,
  vocab2: VocabBlitzDeEn,
  spelling: VocabSpell,
  gaptext: GapText,
  boss: BossBattle,
  twist: GlitchTwist,
  profile: HeroProfile,
};

const GOOD = ['POW!', 'ZAP!', 'BOOM!', 'WHAM!', 'YES!', 'SUPER!', 'KAPOW!'];
const BAD = ['OOPS!', 'BZZT!', 'NOPE!'];
const GLITCH_LAUGH = ['Ha ha! Wrong!', 'Bzzzt! Try again, heroes!', 'Mwahaha! A mistake!', 'Oh no… for YOU!', 'I love mistakes!'];

export function LevelScreen() {
  const { state, dispatch } = useGame();
  const level = LEVELS[state.levelIndex];
  const stage = level.stages[state.stageIndex];
  const Puzzle = PUZZLES[stage.kind];
  const gear = gearCount(state);
  const friendly = stage.kind === 'profile';
  const [burst, setBurst] = useState<{ id: number; text: string; kind: 'good' | 'bad' } | null>(null);
  const [shake, setShake] = useState(0);
  const [glitchSays, setGlitchSays] = useState<string | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const solvedRef = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    solvedRef.current = false;
    setHintOpen(false);
    setRolesOpen(false);
  }, [state.levelIndex, state.stageIndex]);

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
    if (Math.random() < 0.6) {
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

  const updateHero = useCallback((index: number, hero: Hero) => dispatch({ type: 'UPDATE_HERO', index, hero }), [dispatch]);

  const multi = state.heroes.length > 1;
  const roles = stage.kind === 'boss' ? stage.team.filter((t) => t.slot < state.heroes.length) : stage.team;
  const dark = level.scene === 'dark';

  return (
    <div className={`screen level-screen ${dark ? 'is-dark' : ''}`} style={{ ['--lvl' as string]: level.color }}>
      <div className="level-banner">
        <SceneBackdrop scene={level.scene} />
        <div className="banner-overlay">
          <div className="level-badge">
            <span className="level-num">LEVEL {state.levelIndex + 1}</span>
            <span className="level-name">{level.name}</span>
          </div>
          <div className="banner-heroes">
            {state.heroes.map((h, i) => (
              <HeroAvatar key={i} hero={h} gear={gear} className="banner-hero bob" />
            ))}
          </div>
          <div className={`banner-glitch ${glitchSays ? 'peek' : ''}`}>
            {glitchSays && <div className="bubble bubble-villain bubble-small">{glitchSays}</div>}
            <Glitch className="banner-glitch-svg glitch-anim" mood={friendly ? 'happy' : glitchSays ? 'evil' : 'angry'} />
          </div>
        </div>
      </div>

      <main className="level-main">
        <section className={`panel puzzle-panel ${shake ? (shake % 2 ? 'shake1' : 'shake2') : ''}`}>
          <header className="task-head">
            <div className="task-title-row">
              <span className="stage-pill">
                {level.stages.map((_, i) => (
                  <i key={i} className={i < state.stageIndex ? 'done' : i === state.stageIndex ? 'now' : ''} />
                ))}
              </span>
              <h2>{stage.title}</h2>
              <div className="task-tools">
                {multi && (
                  <button className={`tool-btn ${rolesOpen ? 'on' : ''}`} onClick={() => { sfx.click(); setRolesOpen((r) => !r); setHintOpen(false); }}>
                    👥 <span>Roles</span>
                  </button>
                )}
                <button
                  className={`tool-btn tool-hint ${hintOpen ? 'on' : ''} ${state.hintLevel > 0 ? 'used' : ''}`}
                  onClick={() => { sfx.click(); setHintOpen((h) => !h); setRolesOpen(false); }}
                >
                  💡 <span>Hint</span>
                  {state.hintLevel > 0 && <b className="hint-count">{state.hintLevel}</b>}
                </button>
              </div>
            </div>
            <div className="task-instr">
              <Echo className="instr-echo" talking />
              <div className="instr-text">
                <p className="instr-en">
                  {stage.instruction} <SpeakButton text={stage.instruction} small />
                </p>
                <p className="instr-de">{stage.instructionDe}</p>
              </div>
            </div>
            <div className="grammar-strip" key={`g-${state.levelIndex}-${state.stageIndex}`}>
              <span className="grammar-tag">📘 {stage.grammar.topic}</span>
              <span className="grammar-rule">{stage.grammar.rule}</span>
            </div>

            {rolesOpen && multi && (
              <div className="pop-card roles-card pop-in">
                {roles.map((t, i) => {
                  const h = heroForSlot(state.heroes, t.slot);
                  return (
                    <div key={i} className="role-line">
                      <HeroAvatar hero={h} gear={gear} bust className="role-avatar" />
                      <span>
                        <b>{h.name}</b> {t.task}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {hintOpen && <HintCard onClose={() => setHintOpen(false)} />}
          </header>

          <div className="puzzle-body">
            <Puzzle
              key={`${state.levelIndex}-${state.stageIndex}-${state.variant}`}
              heroes={state.heroes}
              gear={gear}
              onCorrect={onCorrect}
              onWrong={onWrong}
              onSolved={onSolved}
              updateHero={updateHero}
            />
          </div>
        </section>
      </main>

      {burst && <Burst key={burst.id} text={burst.text} kind={burst.kind} />}
      {state.levelStep === 'event' && level.event === 'hack' && <HackEvent onDone={() => dispatch({ type: 'EVENT_DONE' })} />}
      {state.levelStep === 'event' && level.event === 'call' && <CallEvent onDone={() => dispatch({ type: 'EVENT_DONE' })} />}
      {state.levelStep === 'intro' && <LevelIntro />}
    </div>
  );
}

function HintCard({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();
  const stage = LEVELS[state.levelIndex].stages[state.stageIndex];
  const level = state.hintLevel;
  const freeAvailable = state.heroes.some((h) => h.power === 'mindhacker') && !state.levelStats[state.levelIndex].freeHintUsed;
  const nextCost = level === 0 ? POINTS.hint1 : POINTS.hint2;

  return (
    <div className="pop-card hint-card pop-in">
      <button className="pop-close" onClick={onClose} aria-label="Schließen">
        ✕
      </button>
      {level === 0 && (
        <p className="hint-idle">
          Stuck? ECHO can help! <span className="de">Ein Tipp kostet ein paar Punkte.</span>
        </p>
      )}
      {hintsFor(stage.kind, stage.hints).slice(0, level).map((h, i) => (
        <div key={i} className={`hint-text hint-${i + 1}`}>
          <b>Hint {i + 1}</b> {h}
        </div>
      ))}
      {level < 2 && (
        <button
          className="btn btn-blue"
          onClick={() => {
            sfx.hint();
            dispatch({ type: 'HINT' });
          }}
        >
          💡 {level === 0 ? 'Show hint 1' : 'Show hint 2 (almost the answer)'}
          <span className="cost">{freeAvailable ? 'free 🧠' : `−${nextCost} ★`}</span>
        </button>
      )}
    </div>
  );
}

function LevelIntro() {
  const { state, dispatch } = useGame();
  const level = LEVELS[state.levelIndex];
  const [talking, setTalking] = useState(false);

  const say = () => {
    setTalking(true);
    speakGlitch(level.glitchTaunt, () => setTalking(false));
  };

  useEffect(() => {
    sfx.whoosh();
    let t = 0;
    if (!state.muted) t = window.setTimeout(say, 700);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="modal-backdrop intro-backdrop">
      <div className="level-splash" style={{ ['--lvl' as string]: level.color }}>
        <div className="splash-rays" />
        <div className="splash-num pop-in">LEVEL {state.levelIndex + 1}</div>
        <h1 className="splash-name pop-in">{level.name}</h1>
        <div className="splash-topic">{level.topic}</div>
        <div className="splash-glitch">
          <Glitch className={`splash-glitch-svg ${talking ? 'talking' : ''} glitch-anim`} />
          <div className="bubble bubble-villain">
            {level.glitchTaunt}{' '}
            <button className="speak-btn speak-small" onClick={say} aria-label="Vorlesen">
              🔊
            </button>
          </div>
        </div>
        <button
          className="btn btn-big btn-yellow pulse-btn"
          onClick={() => {
            stopSpeaking();
            sfx.power();
            dispatch({ type: 'INTRO_DONE' });
          }}
        >
          GO, HEROES! →
        </button>
      </div>
    </div>
  );
}
