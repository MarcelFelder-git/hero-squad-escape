import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { loadState, reducer, saveState, type Action } from './state';
import type { GameState } from './types';
import { setMuted } from '../audio/sound';
import { applyVariant } from '../data/puzzles';

interface Ctx {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  // switch task set A/B before any puzzle renders
  applyVariant(state.variant);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    setMuted(state.muted);
  }, [state.muted]);

  return <GameCtx.Provider value={{ state, dispatch }}>{children}</GameCtx.Provider>;
}

export function useGame() {
  const c = useContext(GameCtx);
  if (!c) throw new Error('useGame outside provider');
  return c;
}
