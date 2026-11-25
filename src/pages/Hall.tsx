// Hall of Heroes (/hall): big-screen wall that shows every team that finished the mission – live.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Hero } from '../game/types';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { Echo, Glitch } from '../components/art/Characters';
import { formatTime } from '../game/state';
import { powerInfo } from '../data/heroOptions';
import { hallOnline, loadHall, subscribeHall, type HallEntry } from '../hall/hall';
import { sfx, setMuted, unlockAudio } from '../audio/sound';
import { canSpeak, speak, speakGlitch, unlockSpeech } from '../audio/speech';

const SINCE_KEY = 'hall-since';

const teamNames = (e: HallEntry) => {
  const n = e.team.map((h) => h.name);
  return n.length <= 1 ? n[0] ?? 'Hero' : `${n.slice(0, -1).join(', ')} & ${n[n.length - 1]}`;
};

function TeamCard({ e, rank, big }: { e: HallEntry; rank?: number; big?: boolean }) {
  return (
    <div className={`hall-card ${big ? 'big' : ''}`}>
      {rank !== undefined && rank < 3 && <div className={`hall-rank r${rank}`}>{['🥇', '🥈', '🥉'][rank]}</div>}
      <div className="hall-avatars">
        {e.team.map((h, i) => (
          <HeroAvatar key={i} hero={h as Hero} gear={8} className="hall-avatar" />
        ))}
      </div>
      <div className="hall-names">{teamNames(e)}</div>
      <div className="hall-stats">
        <span className="hall-stars">{'★'.repeat(e.stars)}{'☆'.repeat(3 - e.stars)}</span>
        <span>★ {e.score}</span>
        <span>⏱ {formatTime(e.time_ms)}</span>
      </div>
      <div className="hall-powers">{e.team.map((h) => powerInfo(h.power).icon).join(' ')}</div>
      {e.team.some((h) => h.profile) && (
        <div className="hall-profiles">
          {e.team
            .filter((h) => h.profile)
            .map((h, i) => (
              <p key={i}>{h.profile}</p>
            ))}
        </div>
      )}
    </div>
  );
}

export default function Hall() {
  const [entries, setEntries] = useState<HallEntry[]>([]);
  const [since, setSince] = useState<string>(() => localStorage.getItem(SINCE_KEY) ?? '');
  const [queue, setQueue] = useState<HallEntry[]>([]);
  const [spot, setSpot] = useState<HallEntry | null>(null);
  const [finale, setFinale] = useState(false);
  const [voice, setVoice] = useState(true);
  // iPad: the voice needs one tap on a button that speaks out loud. Until then (or whenever an
  // announcement stays silent) the yellow button is shown; tapping it reads the missed text.
  const [voiceReady, setVoiceReady] = useState(() => !canSpeak());
  const missed = useRef<string | null>(null);
  const known = useRef(new Set<string>());
  const first = useRef(true);

  useEffect(() => {
    setMuted(false);
    document.title = 'Hall of Heroes';
  }, []);

  /** speak and watch: if the voice does not start, show the button again and remember the text */
  const announce = useCallback((text: string) => {
    let started = false;
    speak(text, { onStart: () => (started = true) });
    window.setTimeout(() => {
      if (!started && !window.speechSynthesis.speaking) {
        missed.current = text;
        setVoiceReady(false);
      }
    }, 2500);
  }, []);

  const enableVoice = () => {
    unlockAudio();
    const text = missed.current ?? 'Voice on! Welcome to the Hall of Heroes.';
    missed.current = null;
    speak(text); // inside the tap → Safari allows it, and afterwards also the automatic announcements
    setVoiceReady(true);
  };

  const add = useCallback(
    (list: HallEntry[], announce: boolean) => {
      const fresh = list.filter((e) => !known.current.has(e.id) && (!since || e.created_at >= since));
      if (!fresh.length) return;
      fresh.forEach((e) => known.current.add(e.id));
      setEntries((old) => [...old, ...fresh].sort((a, b) => a.created_at.localeCompare(b.created_at)));
      if (announce) setQueue((q) => [...q, ...fresh]);
    },
    [since],
  );

  // initial load + live updates (+ polling as safety net)
  useEffect(() => {
    known.current = new Set();
    setEntries([]);
    first.current = true;
    loadHall(since || undefined).then((l) => {
      add(l, false);
      first.current = false;
    });
    const stop = subscribeHall((e) => add([e], true));
    const poll = setInterval(() => loadHall(since || undefined).then((l) => add(l, !first.current)), 10000);
    return () => {
      stop();
      clearInterval(poll);
    };
  }, [since, add]);

  // spotlight queue
  useEffect(() => {
    if (spot || !queue.length) return;
    const [e, ...rest] = queue;
    setQueue(rest);
    setSpot(e);
  }, [queue, spot]);

  useEffect(() => {
    if (!spot) return;
    sfx.victory();
    const s = voice ? setTimeout(() => announce(`Welcome to the Hall of Heroes, ${teamNames(spot).replace('&', 'and')}!`), 900) : 0;
    const t = setTimeout(() => setSpot(null), 8000);
    return () => {
      clearTimeout(s);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot]);

  const ranked = useMemo(() => [...entries].sort((a, b) => b.score - a.score), [entries]);
  const rankOf = (e: HallEntry) => ranked.indexOf(e);
  const allHeroes = entries.flatMap((e) => e.team);
  const totalScore = entries.reduce((s, e) => s + e.score, 0);

  const resetView = () => {
    const now = new Date().toISOString();
    localStorage.setItem(SINCE_KEY, now);
    setSince(now);
  };

  const startFinale = () => {
    unlockAudio();
    setFinale(true);
    sfx.transform();
    setTimeout(() => sfx.victory(), 600);
    if (voice)
      setTimeout(
        () =>
          speakGlitch(
            'Thank you, heroes! I was alone and angry. But you showed me what friendship means. You are the best heroes in Hero City!',
          ),
        1500,
      );
  };

  return (
    <div className="hall-page">
      <header className="hall-head">
        <h1 className="comic-title small">
          <span className="t1">HALL OF HEROES</span>
        </h1>
        <div className="hall-meta">
          <span>
            🦸 {allHeroes.length} heroes · 👥 {entries.length} teams
          </span>
          <span className={`hall-dot ${hallOnline ? 'on' : 'off'}`} title={hallOnline ? 'live' : 'offline – nur dieses Gerät'}>
            {hallOnline ? '● LIVE' : '● OFFLINE'}
          </span>
        </div>
        <div className="hall-tools">
          <button
            className="icon-btn"
            onClick={() => {
              unlockAudio();
              unlockSpeech();
              if (!voice) {
                speak('Voice on!');
                setVoiceReady(true);
              }
              setVoice((v) => !v);
            }}
            title="Stimme an/aus"
          >
            {voice ? '🗣' : '🤐'}
          </button>
          <button className="icon-btn" onClick={resetView} title="Neue Ansicht (alte Teams ausblenden)">
            🧹
          </button>
          <button className="btn btn-yellow" onClick={startFinale}>
            🎉 Finale
          </button>
        </div>
      </header>

      {voice && !voiceReady && (
        <button className="hall-voice-tip pop-in" onClick={enableVoice}>
          🔊 Tap here once to turn on the voice
          <span>Einmal antippen – dann werden neue Heldenteams vorgelesen (nötig auf iPad).</span>
        </button>
      )}

      {entries.length === 0 ? (
        <div className="hall-empty">
          <Echo className="hall-empty-echo" talking />
          <p>
            Waiting for the first heroes …<br />
            <span className="de">Sobald ein Team fertig ist, erscheint es hier.</span>
          </p>
        </div>
      ) : (
        <div className="hall-grid">
          {[...entries].reverse().map((e) => (
            <TeamCard key={e.id} e={e} rank={rankOf(e)} />
          ))}
        </div>
      )}

      {spot && (
        <div className="hall-spot" onClick={() => setSpot(null)}>
          <div className="spot-rays" />
          <div className="spot-title">NEW HEROES!</div>
          <div className="pop-in">
            <TeamCard e={spot} big />
          </div>
        </div>
      )}

      {finale && (
        <div className="hall-finale" onClick={() => setFinale(false)}>
          <div className="spot-rays" />
          <div className="finale-title">THANK YOU, HEROES!</div>
          <div className="finale-parade">
            {allHeroes.slice(0, 40).map((h, i) => (
              <HeroAvatar key={i} hero={h as Hero} gear={8} className="parade-hero" />
            ))}
          </div>
          <div className="finale-glitch">
            <Glitch className="finale-glitch-svg" mood="happy" />
            <div className="bubble bubble-villain friendly">
              Thank you, heroes! You showed me what friendship means. 💛
            </div>
          </div>
          <div className="finale-stats">
            {allHeroes.length} heroes · {entries.length} teams · {totalScore} points
          </div>
          <div className="finale-confetti" aria-hidden="true">
            {Array.from({ length: 60 }, (_, i) => (
              <i
                key={i}
                style={{
                  left: `${(i * 37) % 100}%`,
                  animationDelay: `${(i % 10) * 0.3}s`,
                  background: ['#ffd60a', '#ff006e', '#4cc9f0', '#39ff14', '#ff7b00'][i % 5],
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
