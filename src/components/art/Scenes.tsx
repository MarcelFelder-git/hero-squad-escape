import type { LevelMeta } from '../../data/levels';

type SceneId = LevelMeta['scene'];

const INK = '#141018';

function Stars({ n = 40, h = 120 }: { n?: number; h?: number }) {
  const stars = Array.from({ length: n }, (_, i) => ({
    x: (i * 137.5) % 800,
    y: (i * 53.3) % h,
    r: (i % 3) * 0.6 + 0.8,
    d: (i % 5) * 0.6,
  }));
  return (
    <g fill="#fff">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} className="twinkle" style={{ animationDelay: `${s.d}s` }} />
      ))}
    </g>
  );
}

function Floor({ color = '#2b2160' }: { color?: string }) {
  return (
    <g>
      <rect x={0} y={170} width={800} height={30} fill={color} />
      {Array.from({ length: 17 }, (_, i) => (
        <path key={i} d={`M${i * 50},170 L${i * 50 - 30},200`} stroke="#ffffff" strokeOpacity={0.12} strokeWidth={2} />
      ))}
      <path d="M0,170 H800" stroke={INK} strokeWidth={4} />
    </g>
  );
}

function Lab() {
  return (
    <g>
      {/* screens */}
      {[60, 170, 560, 670].map((x, i) => (
        <g key={x}>
          <rect x={x} y={40} width={90} height={60} rx={6} fill="#0b2545" stroke={INK} strokeWidth={4} />
          <path d={`M${x + 10},80 l15,-15 l15,10 l15,-20 l15,12 l10,-8`} fill="none" stroke="#39ff14" strokeWidth={3} className="blink-slow" style={{ animationDelay: `${i * 0.4}s` }} />
          <rect x={x + 35} y={100} width={20} height={70} fill="#3a3f58" stroke={INK} strokeWidth={3} />
        </g>
      ))}
      {/* scanner arch */}
      <path d="M320,170 V60 Q400,10 480,60 V170" fill="none" stroke={INK} strokeWidth={22} />
      <path d="M320,170 V60 Q400,10 480,60 V170" fill="none" stroke="#adb5bd" strokeWidth={14} />
      <rect x={334} y={60} width={132} height={110} fill="#4cc9f0" fillOpacity={0.12} />
      <rect x={334} y={60} width={132} height={4} fill="#ff006e" className="scan-line" />
      <text x={400} y={52} textAnchor="middle" fontSize={14} fontWeight={900} fill="#ffd60a" stroke={INK} strokeWidth={0.5}>
        HERO ID
      </text>
    </g>
  );
}

function Generator() {
  return (
    <g>
      {[120, 680].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={100} r={62} fill="#3a3f58" stroke={INK} strokeWidth={5} />
          <g className="spin" style={{ transformOrigin: `${cx}px 100px` }}>
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <path key={a} d={`M${cx},100 L${cx + 50},88 L${cx + 50},112Z`} fill="#ffd60a" stroke={INK} strokeWidth={3} transform={`rotate(${a} ${cx} 100)`} />
            ))}
          </g>
          <circle cx={cx} cy={100} r={12} fill="#e63946" stroke={INK} strokeWidth={4} />
        </g>
      ))}
      {/* power bar */}
      <rect x={280} y={40} width={240} height={110} rx={12} fill="#22223b" stroke={INK} strokeWidth={5} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={298 + i * 27} y={60} width={20} height={70} rx={3} fill={i < 5 ? '#ffd60a' : '#4a4e69'} stroke={INK} strokeWidth={2} className={i < 5 ? 'blink-seq' : ''} style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
      <polygon points="400,0 384,30 396,30 386,52 414,20 402,20 410,0" fill="#ffd60a" stroke={INK} strokeWidth={3} className="blink" />
    </g>
  );
}

function Vault() {
  return (
    <g>
      {/* gears */}
      {[
        [90, 70, 40],
        [150, 130, 28],
        [700, 80, 44],
      ].map(([x, y, r], i) => (
        <g key={i} className={i % 2 ? 'spin-rev' : 'spin-slow'} style={{ transformOrigin: `${x}px ${y}px` }}>
          {Array.from({ length: 10 }, (_, k) => (
            <rect key={k} x={x - 6} y={y - r - 8} width={12} height={16} fill="#b08968" stroke={INK} strokeWidth={2} transform={`rotate(${k * 36} ${x} ${y})`} />
          ))}
          <circle cx={x} cy={y} r={r} fill="#b08968" stroke={INK} strokeWidth={4} />
          <circle cx={x} cy={y} r={r / 3} fill="#7f5539" stroke={INK} strokeWidth={3} />
        </g>
      ))}
      {/* vault door */}
      <circle cx={400} cy={100} r={92} fill="#6c757d" stroke={INK} strokeWidth={6} />
      <circle cx={400} cy={100} r={74} fill="#adb5bd" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 12 }, (_, k) => (
        <circle key={k} cx={400 + 83 * Math.cos((k * Math.PI) / 6)} cy={100 + 83 * Math.sin((k * Math.PI) / 6)} r={4} fill="#343a40" />
      ))}
      <g className="spin-slow" style={{ transformOrigin: '400px 100px' }}>
        <circle cx={400} cy={100} r={34} fill="#495057" stroke={INK} strokeWidth={4} />
        {[0, 90, 180, 270].map((a) => (
          <rect key={a} x={396} y={52} width={8} height={30} rx={3} fill="#ced4da" stroke={INK} strokeWidth={2} transform={`rotate(${a} 400 100)`} />
        ))}
      </g>
      <text x={400} y={106} textAnchor="middle" fontSize={16} fontWeight={900} fill="#ffd60a">
        PAST
      </text>
      {/* clock */}
      <circle cx={620} cy={140} r={24} fill="#fff8e7" stroke={INK} strokeWidth={4} />
      <path d="M620,140 V124" stroke={INK} strokeWidth={3} className="spin" style={{ transformOrigin: '620px 140px' }} />
      <path d="M620,140 H632" stroke={INK} strokeWidth={3} />
    </g>
  );
}

function Radio() {
  return (
    <g>
      {/* moon */}
      <circle cx={680} cy={50} r={30} fill="#fff3b0" stroke={INK} strokeWidth={3} />
      <circle cx={670} cy={44} r={5} fill="#e9d8a6" />
      <circle cx={690} cy={60} r={7} fill="#e9d8a6" />
      {/* tower */}
      <path d="M180,170 L210,30 L240,170 M190,120 H230 M198,80 H222 M186,140 L232,100 M234,140 L188,100" fill="none" stroke={INK} strokeWidth={5} />
      <circle cx={210} cy={28} r={7} fill="#ff006e" stroke={INK} strokeWidth={3} className="blink" />
      {[1, 2, 3].map((i) => (
        <circle key={i} cx={210} cy={28} r={20 * i} fill="none" stroke="#4cc9f0" strokeWidth={3} className="wave" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
      {/* radio console */}
      <rect x={330} y={70} width={260} height={100} rx={10} fill="#7f5539" stroke={INK} strokeWidth={5} />
      <rect x={346} y={84} width={130} height={56} rx={6} fill="#0b2545" stroke={INK} strokeWidth={3} />
      <path d="M352,112 q10,-20 20,0 t20,0 t20,0 t20,0 t20,0 t20,0" fill="none" stroke="#39ff14" strokeWidth={3} className="osc" />
      {[510, 556].map((x) => (
        <g key={x}>
          <circle cx={x} cy={112} r={20} fill="#343a40" stroke={INK} strokeWidth={4} />
          <path d={`M${x},112 L${x},96`} stroke="#ffd60a" strokeWidth={4} className="spin-slow" style={{ transformOrigin: `${x}px 112px` }} />
        </g>
      ))}
    </g>
  );
}

function Gate() {
  return (
    <g>
      <circle cx={110} cy={50} r={32} fill="#fff3b0" stroke={INK} strokeWidth={3} />
      {/* gate */}
      <rect x={230} y={10} width={340} height={160} fill="#495057" stroke={INK} strokeWidth={6} />
      <rect x={250} y={26} width={146} height={144} fill="#6c757d" stroke={INK} strokeWidth={4} className="gate-left" />
      <rect x={404} y={26} width={146} height={144} fill="#6c757d" stroke={INK} strokeWidth={4} className="gate-right" />
      {[60, 100, 140].map((y) => (
        <g key={y}>
          <path d={`M250,${y} H550`} stroke={INK} strokeWidth={3} />
          {[270, 320, 370, 430, 480, 530].map((x) => (
            <circle key={x} cx={x} cy={y - 8} r={3.5} fill="#343a40" />
          ))}
        </g>
      ))}
      <circle cx={400} cy={98} r={24} fill="#ff7b00" stroke={INK} strokeWidth={4} className="pulse" />
      <text x={400} y={104} textAnchor="middle" fontSize={16} fontWeight={900} fill={INK}>
        HQ
      </text>
      {/* warning stripes */}
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${230 + i * 25},170 l12,-12 h12 l-12,12z`} fill="#ffd60a" />
      ))}
      {[640, 700, 750].map((x, i) => (
        <rect key={x} x={x} y={90 - i * 20} width={40} height={80 + i * 20} fill="#22223b" stroke={INK} strokeWidth={3} />
      ))}
    </g>
  );
}

const SKY: Record<SceneId, [string, string]> = {
  lab: ['#1b1446', '#3a0ca3'],
  generator: ['#370617', '#9d0208'],
  vault: ['#0b2545', '#13315c'],
  radio: ['#081c15', '#1b4332'],
  gate: ['#10002b', '#5a189a'],
  studio: ['#240046', '#7b2cbf'],
  dark: ['#000000', '#120a1f'],
  academy: ['#03045e', '#0077b6'],
};

function Studio() {
  return (
    <g>
      {/* on-air sign */}
      <rect x={330} y={22} width={140} height={40} rx={8} fill="#e63946" stroke={INK} strokeWidth={4} className="blink-slow" />
      <text x={400} y={50} textAnchor="middle" fontSize={22} fontWeight={900} fill="#fff">ON AIR</text>
      {/* microphone */}
      <rect x={385} y={80} width={30} height={50} rx={15} fill="#adb5bd" stroke={INK} strokeWidth={4} />
      <path d="M375,110 q25,36 50,0 M400,140 v30" fill="none" stroke={INK} strokeWidth={5} />
      {/* speakers + sound waves */}
      {[90, 650].map((x) => (
        <g key={x}>
          <rect x={x} y={70} width={60} height={100} rx={6} fill="#22223b" stroke={INK} strokeWidth={4} />
          <circle cx={x + 30} cy={100} r={14} fill="#4a4e69" stroke={INK} strokeWidth={3} className="pulse" />
          <circle cx={x + 30} cy={145} r={18} fill="#4a4e69" stroke={INK} strokeWidth={3} className="pulse" />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${200 + i * 20},${90 - i * 10} q-20,${30 + i * 10} 0,${60 + i * 20} M${600 - i * 20},${90 - i * 10} q20,${30 + i * 10} 0,${60 + i * 20}`} fill="none" stroke="#c77dff" strokeWidth={4} className="blink-slow" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
    </g>
  );
}

function Dark() {
  return (
    <g>
      {[120, 300, 500, 680].map((x, i) => (
        <g key={x} opacity={0.35}>
          <rect x={x - 30} y={60} width={60} height={110} fill="#1b1b2f" stroke="#333" strokeWidth={3} />
          <circle cx={x - 8} cy={100} r={3} fill="#ffd60a" className="blink" style={{ animationDelay: `${i * 0.7}s` }} />
          <circle cx={x + 8} cy={100} r={3} fill="#ffd60a" className="blink" style={{ animationDelay: `${i * 0.7}s` }} />
        </g>
      ))}
      <text x={190} y={150} textAnchor="middle" fontSize={22} fontWeight={900} fill="#ff9f1c" opacity={0.6} className="blink-slow">
        POWER: 0%
      </text>
    </g>
  );
}

function Academy() {
  return (
    <g>
      {/* board */}
      <rect x={250} y={30} width={300} height={120} fill="#1b4332" stroke="#8d5524" strokeWidth={10} />
      <text x={400} y={78} textAnchor="middle" fontSize={24} fontWeight={900} fill="#fff" fontFamily="Bangers, Impact, sans-serif">
        hero · save · strong
      </text>
      <text x={400} y={116} textAnchor="middle" fontSize={20} fill="#ffd60a" fontFamily="Bangers, Impact, sans-serif">
        retten = save ✓
      </text>
      {/* book shelves */}
      {[60, 640].map((x) => (
        <g key={x}>
          <rect x={x} y={40} width={100} height={130} fill="#6f4518" stroke={INK} strokeWidth={4} />
          {[0, 1, 2].map((r) =>
            ['#e63946', '#1e88e5', '#ffd60a', '#2ecc71', '#c77dff'].map((c, k) => (
              <rect key={`${r}-${k}`} x={x + 8 + k * 18} y={48 + r * 40} width={14} height={32} fill={c} stroke={INK} strokeWidth={2} />
            )),
          )}
        </g>
      ))}
    </g>
  );
}

export function SceneBackdrop({ scene }: { scene: SceneId }) {
  const [a, b] = SKY[scene];
  return (
    <svg className="scene-svg" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${scene}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#ffffff" fillOpacity="0.08" />
        </pattern>
      </defs>
      <rect width={800} height={200} fill={`url(#sky-${scene})`} />
      <rect width={800} height={200} fill="url(#dots)" />
      {scene !== 'dark' && <Stars n={30} h={110} />}
      {scene === 'lab' && <Lab />}
      {scene === 'generator' && <Generator />}
      {scene === 'vault' && <Vault />}
      {scene === 'radio' && <Radio />}
      {scene === 'gate' && <Gate />}
      {scene === 'studio' && <Studio />}
      {scene === 'dark' && <Dark />}
      {scene === 'academy' && <Academy />}
      <Floor />
    </svg>
  );
}

/** Big night city for title / briefing / ending screens */
export function CityBackdrop({ open = false }: { open?: boolean }) {
  const buildings = [
    [0, 120, 70], [60, 90, 60], [115, 140, 50], [160, 70, 80], [235, 110, 55],
    [520, 100, 60], [575, 60, 70], [640, 130, 50], [685, 85, 65], [745, 115, 60],
  ];
  return (
    <svg className="city-svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10002b" />
          <stop offset="0.6" stopColor="#3c096c" />
          <stop offset="1" stopColor="#ff006e" />
        </linearGradient>
      </defs>
      <rect width={800} height={300} fill="url(#night)" />
      <Stars n={60} h={180} />
      <circle cx={640} cy={70} r={42} fill="#fff3b0" stroke={INK} strokeWidth={3} />
      <circle cx={628} cy={60} r={7} fill="#e9d8a6" />
      <circle cx={655} cy={84} r={9} fill="#e9d8a6" />
      {buildings.map(([x, h, w], i) => (
        <g key={i}>
          <rect x={x} y={300 - h} width={w} height={h} fill="#1b1446" stroke={INK} strokeWidth={3} />
          {Array.from({ length: Math.floor(h / 22) }, (_, r) =>
            Array.from({ length: Math.floor(w / 18) }, (_, c) => (
              <rect key={`${r}-${c}`} x={x + 6 + c * 18} y={300 - h + 8 + r * 22} width={8} height={10} fill={(r * 7 + c * 3 + i) % 4 === 0 ? '#ffd60a' : '#2d2a5a'} />
            )),
          )}
        </g>
      ))}
      {/* HQ */}
      <rect x={300} y={110} width={200} height={190} fill="#5a189a" stroke={INK} strokeWidth={5} />
      <polygon points="290,112 400,60 510,112" fill="#7b2cbf" stroke={INK} strokeWidth={5} />
      <circle cx={400} cy={150} r={26} fill="#ffd60a" stroke={INK} strokeWidth={4} />
      <text x={400} y={160} textAnchor="middle" fontSize={28} fontWeight={900} fill={INK}>
        H
      </text>
      <rect x={350} y={210} width={100} height={90} fill="#22223b" stroke={INK} strokeWidth={4} />
      <rect x={352} y={212} width={48} height={88} fill={open ? '#ffd60a' : '#495057'} stroke={INK} strokeWidth={2} className={open ? 'door-open-l' : ''} />
      <rect x={400} y={212} width={48} height={88} fill={open ? '#ffd60a' : '#495057'} stroke={INK} strokeWidth={2} className={open ? 'door-open-r' : ''} />
      {!open && <path d="M352,256 H448" stroke="#39ff14" strokeWidth={4} className="blink" />}
      {/* search light */}
      <polygon points="400,60 330,0 470,0" fill="#ffd60a" opacity={0.15} className="searchlight" />
    </svg>
  );
}
