// Hall of Heroes: finished teams are shown live on the presenter screen (/hall).
// With Supabase env vars it works across all iPads; without them it falls back to
// this browser only (localStorage + BroadcastChannel) – good for testing.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { HeroLook, PowerId } from '../game/types';

export interface HallHero {
  name: string;
  power: PowerId;
  look: HeroLook;
  profile?: string;
}

export interface HallEntry {
  id: string;
  created_at: string;
  team: HallHero[];
  score: number;
  time_ms: number;
  stars: number;
  rank: string;
}

export type NewHallEntry = Omit<HallEntry, 'id' | 'created_at'>;

const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const hallOnline = Boolean(URL && KEY);

let clientPromise: Promise<SupabaseClient> | null = null;
function client() {
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(URL!, KEY!, { auth: { persistSession: false } }),
    );
  }
  return clientPromise;
}

/* ---------- local fallback ---------- */
const LOCAL_KEY = 'hero-hall-local';
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('hero-hall') : null;

function readLocal(): HallEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]') as HallEntry[];
  } catch {
    return [];
  }
}

/* ---------- API ---------- */
export async function sendToHall(entry: NewHallEntry): Promise<boolean> {
  const full: HallEntry = { ...entry, id: crypto.randomUUID?.() ?? String(Date.now()), created_at: new Date().toISOString() };
  if (!hallOnline) {
    const list = [...readLocal(), full].slice(-60);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    channel?.postMessage(full);
    return true;
  }
  try {
    const sb = await client();
    const { error } = await sb.from('hall').insert({
      team: entry.team,
      score: entry.score,
      time_ms: entry.time_ms,
      stars: entry.stars,
      rank: entry.rank,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function loadHall(sinceIso?: string): Promise<HallEntry[]> {
  if (!hallOnline) {
    return readLocal().filter((e) => !sinceIso || e.created_at >= sinceIso);
  }
  const sb = await client();
  let q = sb.from('hall').select('*').order('created_at', { ascending: true }).limit(100);
  if (sinceIso) q = q.gte('created_at', sinceIso);
  const { data } = await q;
  return (data as HallEntry[] | null) ?? [];
}

export function subscribeHall(cb: (e: HallEntry) => void): () => void {
  if (!hallOnline) {
    const onMsg = (ev: MessageEvent<HallEntry>) => cb(ev.data);
    channel?.addEventListener('message', onMsg);
    return () => channel?.removeEventListener('message', onMsg);
  }
  let stop = () => {};
  client().then((sb) => {
    const ch = sb
      .channel('hall-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'hall' }, (payload) => cb(payload.new as HallEntry))
      .subscribe();
    stop = () => void sb.removeChannel(ch);
  });
  return () => stop();
}
