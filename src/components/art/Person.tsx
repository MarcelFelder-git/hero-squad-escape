import type { Accessory, Emblem, HairStyle, MaskStyle } from '../../game/types';

export interface PersonProps {
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  suit: string;
  cape?: string;
  emblem?: Emblem;
  mask?: MaskStyle;
  accessory?: Accessory;
  glasses?: boolean;
  braces?: boolean;
  /** trousers colour (jeans before the hero suit arrives) */
  legs?: string;
  gloves?: string;
  boots?: string;
  belt?: boolean;
  /** glowing power aura colour */
  aura?: string;
  flying?: boolean;
  /** show only head + shoulders */
  bust?: boolean;
  className?: string;
  title?: string;
}

const INK = '#141018';

function darken(hex: string, amt = 0.25) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor(((n >> 16) & 255) * (1 - amt)));
  const g = Math.max(0, Math.floor(((n >> 8) & 255) * (1 - amt)));
  const b = Math.max(0, Math.floor((n & 255) * (1 - amt)));
  return `rgb(${r},${g},${b})`;
}

export function EmblemShape({ emblem, x, y, s = 1, color = '#fff' }: { emblem: Emblem; x: number; y: number; s?: number; color?: string }) {
  const t = `translate(${x} ${y}) scale(${s})`;
  switch (emblem) {
    case 'star':
      return <polygon transform={t} points="0,-9 2.6,-3 9,-2.8 4,1.4 5.6,8 0,4.4 -5.6,8 -4,1.4 -9,-2.8 -2.6,-3" fill={color} stroke={INK} strokeWidth={1.5} />;
    case 'bolt':
      return <polygon transform={t} points="2,-10 -6,1 -1,1 -3,10 6,-2 1,-2" fill={color} stroke={INK} strokeWidth={1.5} />;
    case 'heart':
      return <path transform={t} d="M0,8 C-12,0 -8,-10 0,-4 C8,-10 12,0 0,8Z" fill={color} stroke={INK} strokeWidth={1.5} />;
    case 'shield':
      return <path transform={t} d="M0,-9 L8,-6 L7,3 C5,7 2,9 0,10 C-2,9 -5,7 -7,3 L-8,-6Z" fill={color} stroke={INK} strokeWidth={1.5} />;
    case 'moon':
      return <path transform={t} d="M3,-9 A9,9 0 1,0 3,9 A7,7 0 1,1 3,-9Z" fill={color} stroke={INK} strokeWidth={1.5} />;
  }
}

function HairBack({ style, color }: { style: HairStyle; color: string }) {
  if (style === 'straight')
    return <path d="M34,48 C34,22 86,22 86,48 L88,86 L74,86 L74,60 L46,60 L46,86 L32,86Z" fill={color} stroke={INK} strokeWidth={3} strokeLinejoin="round" />;
  if (style === 'curly')
    return (
      <g fill={color} stroke={INK} strokeWidth={2.5}>
        {[
          [34, 56], [33, 68], [37, 78], [86, 56], [87, 68], [83, 78],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={8} />
        ))}
      </g>
    );
  return null;
}

function HairFront({ style, color }: { style: HairStyle; color: string }) {
  switch (style) {
    case 'straight':
      return <path d="M36,46 C36,24 84,24 84,46 C76,38 64,34 56,40 C50,36 42,40 36,46Z" fill={color} stroke={INK} strokeWidth={3} strokeLinejoin="round" />;
    case 'curly':
      return (
        <g fill={color} stroke={INK} strokeWidth={2.5}>
          {[
            [38, 38], [46, 29], [56, 25], [66, 26], [75, 30], [82, 39], [36, 47], [84, 47],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={8.5} />
          ))}
        </g>
      );
    case 'spiky':
      return <path d="M36,46 L34,30 L44,34 L46,18 L55,30 L62,14 L67,30 L78,18 L77,34 L88,30 L84,46 C74,38 46,38 36,46Z" fill={color} stroke={INK} strokeWidth={3} strokeLinejoin="round" />;
    case 'short':
      return <path d="M36,44 C36,22 84,22 84,44 C78,36 70,33 60,33 C50,33 42,36 36,44Z" fill={color} stroke={INK} strokeWidth={3} strokeLinejoin="round" />;
  }
}

export function Person(p: PersonProps) {
  const mask = p.mask ?? 'none';
  const acc = p.accessory ?? 'none';
  const glasses = p.glasses || acc === 'glasses';
  const braces = p.braces || acc === 'braces';
  const vb = p.bust ? '20 10 80 100' : '0 0 120 170';

  return (
    <svg viewBox={vb} className={`${p.className ?? ''} ${p.flying ? 'is-flying' : ''}`} role="img" aria-label={p.title ?? 'person'}>
      {p.aura && <ellipse cx={60} cy={92} rx={56} ry={78} fill={p.aura} opacity={0.35} className="aura-pulse" />}
      {p.flying && !p.bust && (
        <g stroke="#ffffff" strokeWidth={3} strokeLinecap="round" opacity={0.8} className="wind">
          <path d="M40,168 v-0 M38,166 h-14 M86,166 h14 M50,169 h-8 M78,169 h8" />
        </g>
      )}
      {/* cape */}
      {p.cape && (
        <path d="M40,84 C28,110 22,140 16,166 L104,166 C98,140 92,110 80,84Z" fill={p.cape} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      )}
      {/* legs */}
      <rect x={45} y={124} width={13} height={36} rx={4} fill={p.legs ?? darken(p.suit, 0.35)} stroke={INK} strokeWidth={3} />
      <rect x={62} y={124} width={13} height={36} rx={4} fill={p.legs ?? darken(p.suit, 0.35)} stroke={INK} strokeWidth={3} />
      {p.boots ? (
        <g fill={p.boots} stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
          <path d="M43,142 h16 v22 h-21 v-6 h5z" />
          <path d="M61,142 h16 v16 h5 v6 h-21z" />
          <path d="M43,146 h16 M61,146 h16" stroke="#ffffff" strokeOpacity={0.6} />
        </g>
      ) : (
        <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
          <path d="M42,155 h18 v9 h-20z" fill="#f8f9fa" />
          <path d="M60,155 h18 l2,9 h-20z" fill="#f8f9fa" />
          <path d="M41,161 h19 M61,161 h19" stroke="#e63946" strokeWidth={2} />
        </g>
      )}
      {/* arms */}
      <rect x={27} y={84} width={13} height={40} rx={6} fill={p.suit} stroke={INK} strokeWidth={3} transform="rotate(8 33 84)" />
      <rect x={80} y={84} width={13} height={40} rx={6} fill={p.suit} stroke={INK} strokeWidth={3} transform="rotate(-8 87 84)" />
      <circle cx={29} cy={125} r={p.gloves ? 7.5 : 6} fill={p.gloves ?? p.skin} stroke={INK} strokeWidth={2.5} />
      <circle cx={91} cy={125} r={p.gloves ? 7.5 : 6} fill={p.gloves ?? p.skin} stroke={INK} strokeWidth={2.5} />
      {/* torso */}
      <rect x={38} y={78} width={44} height={52} rx={12} fill={p.suit} stroke={INK} strokeWidth={3} />
      {p.belt ? (
        <g>
          <rect x={38} y={113} width={44} height={9} fill="#ffd60a" stroke={INK} strokeWidth={2.5} />
          <rect x={54} y={111} width={12} height={13} rx={2} fill="#adb5bd" stroke={INK} strokeWidth={2.5} />
          <rect x={41} y={115} width={6} height={5} fill="#39ff14" />
          <rect x={73} y={115} width={6} height={5} fill="#ff006e" />
        </g>
      ) : (
        <path d="M40,118 h40" stroke={darken(p.suit, 0.4)} strokeWidth={5} />
      )}
      {p.emblem && (
        <>
          <circle cx={60} cy={98} r={12} fill={darken(p.suit, 0.3)} stroke={INK} strokeWidth={2.5} />
          <EmblemShape emblem={p.emblem} x={60} y={98} s={0.95} color={p.cape && p.cape !== p.suit ? p.cape : '#ffd60a'} />
        </>
      )}
      {/* neck */}
      <rect x={54} y={68} width={12} height={14} fill={p.skin} stroke={INK} strokeWidth={2.5} />
      <HairBack style={p.hairStyle} color={p.hair} />
      {/* head */}
      <circle cx={60} cy={50} r={24} fill={p.skin} stroke={INK} strokeWidth={3} />
      <circle cx={46} cy={58} r={3.5} fill="#ff8fa3" opacity={0.6} />
      <circle cx={74} cy={58} r={3.5} fill="#ff8fa3" opacity={0.6} />
      {/* masks */}
      {mask === 'eyemask' && (
        <path d="M36,44 C44,40 52,42 60,46 C68,42 76,40 84,44 L83,55 C76,58 68,56 60,52 C52,56 44,58 37,55Z" fill={p.cape ?? INK} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      )}
      {/* eyes */}
      {mask === 'visor' ? (
        <rect x={37} y={42} width={46} height={14} rx={7} fill="#4cc9f0" fillOpacity={0.85} stroke={INK} strokeWidth={2.5} />
      ) : (
        <>
          <ellipse cx={51} cy={50} rx={mask === 'eyemask' ? 4 : 3.2} ry={mask === 'eyemask' ? 3 : 4} fill={mask === 'eyemask' ? '#fff' : INK} stroke={INK} strokeWidth={mask === 'eyemask' ? 1.5 : 0} />
          <ellipse cx={69} cy={50} rx={mask === 'eyemask' ? 4 : 3.2} ry={mask === 'eyemask' ? 3 : 4} fill={mask === 'eyemask' ? '#fff' : INK} stroke={INK} strokeWidth={mask === 'eyemask' ? 1.5 : 0} />
          {mask === 'eyemask' && (
            <>
              <circle cx={51} cy={50} r={1.6} fill={INK} />
              <circle cx={69} cy={50} r={1.6} fill={INK} />
            </>
          )}
        </>
      )}
      {mask === 'goggles' && (
        <g>
          <path d="M36,48 h48" stroke={INK} strokeWidth={4} />
          <circle cx={50} cy={49} r={8} fill="#ffd60a" fillOpacity={0.55} stroke={INK} strokeWidth={3} />
          <circle cx={70} cy={49} r={8} fill="#ffd60a" fillOpacity={0.55} stroke={INK} strokeWidth={3} />
        </g>
      )}
      {glasses && (
        <g fill="none" stroke={INK} strokeWidth={2.5}>
          <circle cx={51} cy={50} r={7} fill="#ffffff" fillOpacity={0.25} />
          <circle cx={69} cy={50} r={7} fill="#ffffff" fillOpacity={0.25} />
          <path d="M58,50 h4 M44,49 l-7,-2 M76,49 l7,-2" />
        </g>
      )}
      {/* mouth */}
      {braces ? (
        <g>
          <path d="M50,60 Q60,70 70,60 Z" fill="#fff" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M51,62.5 h18" stroke="#8a8f98" strokeWidth={2} />
          {[54, 58, 62, 66].map((x) => (
            <rect key={x} x={x - 1.2} y={61.3} width={2.4} height={2.4} fill="#8a8f98" />
          ))}
        </g>
      ) : (
        <path d="M51,61 Q60,68 69,61" fill="none" stroke={INK} strokeWidth={2.8} strokeLinecap="round" />
      )}
      <HairFront style={p.hairStyle} color={p.hair} />
      {acc === 'headphones' && (
        <g>
          <path d="M34,50 C34,18 86,18 86,50" fill="none" stroke={INK} strokeWidth={5} />
          <rect x={29} y={44} width={10} height={16} rx={4} fill="#e63946" stroke={INK} strokeWidth={2.5} />
          <rect x={81} y={44} width={10} height={16} rx={4} fill="#e63946" stroke={INK} strokeWidth={2.5} />
        </g>
      )}
      {acc === 'antenna' && (
        <g>
          <path d="M60,26 L60,8" stroke={INK} strokeWidth={3} />
          <circle cx={60} cy={7} r={5} fill="#ffd60a" stroke={INK} strokeWidth={2.5} className="blink" />
        </g>
      )}
    </svg>
  );
}
