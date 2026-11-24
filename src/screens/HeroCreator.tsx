import { useState, type ReactNode } from 'react';
import { useGame } from '../game/GameContext';
import type { Hero, HeroLook } from '../game/types';
import {
  ACCESSORIES,
  CAPE_COLORS,
  EMBLEMS,
  HAIR_COLORS,
  HAIR_STYLES,
  MASKS,
  POWERS,
  SKIN_TONES,
  SUIT_COLORS,
  fullyRandomHero,
  randomHeroName,
} from '../data/heroOptions';
import { HeroAvatar } from '../components/art/HeroAvatar';
import { EmblemShape } from '../components/art/Person';
import { sfx } from '../audio/sound';

type Tab = 'power' | 'colours' | 'hair' | 'extras';

function Swatches({ colors, value, onPick, label }: { colors: string[]; value: string; onPick: (c: string) => void; label: string }) {
  return (
    <div className="opt-group">
      <div className="opt-label">{label}</div>
      <div className="swatches">
        {colors.map((c) => (
          <button
            key={c}
            className={`swatch ${value === c ? 'swatch-on' : ''}`}
            style={{ background: c }}
            onClick={() => {
              sfx.click();
              onPick(c);
            }}
            aria-label={c}
          />
        ))}
      </div>
    </div>
  );
}

function Chips<T extends string>({
  items,
  value,
  onPick,
  label,
  render,
}: {
  items: { id: T; label: string }[];
  value: T;
  onPick: (v: T) => void;
  label: string;
  render?: (id: T) => ReactNode;
}) {
  return (
    <div className="opt-group">
      <div className="opt-label">{label}</div>
      <div className="chip-row">
        {items.map((it) => (
          <button
            key={it.id}
            className={`chip chip-big ${value === it.id ? 'chip-on' : ''}`}
            onClick={() => {
              sfx.click();
              onPick(it.id);
            }}
          >
            {render?.(it.id)}
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HeroCreator() {
  const { state, dispatch } = useGame();
  const idx = state.creatorIndex;
  const hero = state.heroes[idx];
  const [tab, setTab] = useState<Tab>('power');
  const [pop, setPop] = useState(0);

  if (!hero) return null;
  const taken = state.heroes.filter((_, i) => i !== idx).map((h) => h.name);

  const update = (h: Hero) => {
    dispatch({ type: 'UPDATE_HERO', index: idx, hero: h });
    setPop((p) => p + 1);
  };
  const look = (patch: Partial<HeroLook>) => update({ ...hero, look: { ...hero.look, ...patch } });
  const isLast = idx === state.heroes.length - 1;
  const nameOk = hero.name.trim().length > 0;

  return (
    <div className="screen creator-screen">
      <div className="creator-head">
        <h1 className="comic-h">
          Create your hero{state.heroes.length > 1 && <span className="hero-count"> · Player {idx + 1} of {state.heroes.length}</span>}
        </h1>
        <p className="de">Gestalte deine*n Superheld*in – Name, Superkraft und Look.</p>
      </div>

      <div className="creator-grid">
        <div className="creator-preview panel">
          <div className="preview-stage">
            <div className="preview-glow" style={{ background: hero.look.cape }} />
            <HeroAvatar key={pop} hero={hero} className="preview-avatar pop-in" />
          </div>
          <div className="name-row">
            <input
              className="input name-input"
              value={hero.name}
              maxLength={20}
              onChange={(e) => dispatch({ type: 'UPDATE_HERO', index: idx, hero: { ...hero, name: e.target.value } })}
              placeholder="Hero name"
              aria-label="Heldenname"
              autoCorrect="off"
            />
            <button className="btn btn-blue" onClick={() => { sfx.select(); update({ ...hero, name: randomHeroName(taken) }); }} title="Zufallsname">
              🎲
            </button>
          </div>
          <button
            className="btn btn-ghost full"
            onClick={() => {
              sfx.power();
              update(fullyRandomHero(taken));
            }}
          >
            🎲 Alles zufällig (Schnellstart)
          </button>
        </div>

        <div className="creator-options panel">
          <div className="tabs">
            {(
              [
                ['power', '⚡ Power'],
                ['colours', '🎨 Colours'],
                ['hair', '💇 Hair & face'],
                ['extras', '⭐ Extras'],
              ] as [Tab, string][]
            ).map(([t, l]) => (
              <button key={t} className={`tab ${tab === t ? 'tab-on' : ''}`} onClick={() => { sfx.click(); setTab(t); }}>
                {l}
              </button>
            ))}
          </div>

          {tab === 'power' && (
            <div className="power-list">
              {POWERS.map((p) => (
                <button
                  key={p.id}
                  className={`power-card ${hero.power === p.id ? 'power-on' : ''}`}
                  onClick={() => {
                    sfx.power();
                    update({ ...hero, power: p.id });
                  }}
                >
                  <span className="power-icon">{p.icon}</span>
                  <span className="power-text">
                    <b>{p.name}</b>
                    <span>{p.effectEn}</span>
                    <span className="de small">{p.effectDe}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {tab === 'colours' && (
            <>
              <Swatches label="Suit / Anzug" colors={SUIT_COLORS} value={hero.look.suit} onPick={(c) => look({ suit: c })} />
              <Swatches label="Cape / Umhang" colors={CAPE_COLORS} value={hero.look.cape} onPick={(c) => look({ cape: c })} />
              <Swatches label="Skin / Hautfarbe" colors={SKIN_TONES} value={hero.look.skin} onPick={(c) => look({ skin: c })} />
            </>
          )}

          {tab === 'hair' && (
            <>
              <Chips label="Hair: curly = lockig, straight = glatt" items={HAIR_STYLES} value={hero.look.hairStyle} onPick={(v) => look({ hairStyle: v })} />
              <Swatches label="Hair colour / Haarfarbe" colors={HAIR_COLORS} value={hero.look.hair} onPick={(c) => look({ hair: c })} />
              <Chips label="Mask / Maske" items={MASKS} value={hero.look.mask} onPick={(v) => look({ mask: v })} />
            </>
          )}

          {tab === 'extras' && (
            <>
              <Chips
                label="Emblem"
                items={EMBLEMS}
                value={hero.look.emblem}
                onPick={(v) => look({ emblem: v })}
                render={(id) => (
                  <svg viewBox="-12 -12 24 24" className="chip-icon">
                    <EmblemShape emblem={id} x={0} y={0} color="#ffd60a" />
                  </svg>
                )}
              />
              <Chips
                label="Accessory: glasses = Brille, braces = Zahnspange"
                items={ACCESSORIES}
                value={hero.look.accessory}
                onPick={(v) => look({ accessory: v })}
              />
            </>
          )}
        </div>
      </div>

      <div className="creator-foot">
        <button className="btn btn-ghost" onClick={() => { sfx.click(); dispatch({ type: 'PREV_HERO' }); setTab('power'); }}>
          ← Zurück
        </button>
        <button
          className="btn btn-big btn-yellow"
          disabled={!nameOk}
          onClick={() => {
            sfx.unlock();
            dispatch({ type: 'UPDATE_HERO', index: idx, hero: { ...hero, name: hero.name.trim() } });
            dispatch({ type: 'NEXT_HERO' });
            setTab('power');
          }}
        >
          {isLast ? '✔ Team ready!' : `Next: Player ${idx + 2} →`}
        </button>
      </div>
    </div>
  );
}
