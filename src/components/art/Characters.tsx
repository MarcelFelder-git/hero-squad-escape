const INK = '#141018';

/** The villain: a glitchy robot with a TV-screen face. */
export function Glitch({ className, mood = 'evil' }: { className?: string; mood?: 'evil' | 'angry' | 'defeated' }) {
  const face = (dx: number, color: string, op = 1) => (
    <g transform={`translate(${dx} 0)`} opacity={op}>
      {mood === 'defeated' ? (
        <>
          <path d="M48,52 l10,10 M58,52 l-10,10 M82,52 l10,10 M92,52 l-10,10" stroke={color} strokeWidth={5} strokeLinecap="square" />
          <path d="M55,82 q15,-10 30,0" fill="none" stroke={color} strokeWidth={5} />
        </>
      ) : (
        <>
          <rect x={46} y={50} width={14} height={12} fill={color} />
          <rect x={80} y={50} width={14} height={12} fill={color} />
          <path d="M42,44 l20,6 M98,44 l-20,6" stroke={color} strokeWidth={5} />
          {mood === 'angry' ? (
            <path d="M52,84 h36" stroke={color} strokeWidth={6} />
          ) : (
            <path d="M50,76 h6 v6 h6 v-6 h6 v6 h6 v-6 h6 v6 h6 v-6" fill="none" stroke={color} strokeWidth={4} />
          )}
        </>
      )}
    </g>
  );
  return (
    <svg viewBox="0 0 140 190" className={`glitch-svg ${className ?? ''}`} role="img" aria-label="The Glitch">
      {/* cloak */}
      <path d="M30,96 C14,130 10,160 6,186 L134,186 C130,160 126,130 110,96Z" fill="#3c096c" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M44,100 L70,186 L96,100" fill="#240046" stroke={INK} strokeWidth={3} />
      <polygon points="70,108 60,128 68,128 62,150 82,122 72,122 78,108" fill="#39ff14" stroke={INK} strokeWidth={2.5} />
      {/* antennas */}
      <path d="M44,22 L32,4 M96,22 L108,4" stroke={INK} strokeWidth={4} />
      <circle cx={32} cy={4} r={5} fill="#ff006e" className="blink" />
      <circle cx={108} cy={4} r={5} fill="#ff006e" className="blink" />
      {/* tv head */}
      <rect x={24} y={20} width={92} height={82} rx={14} fill="#5a189a" stroke={INK} strokeWidth={4} />
      <rect x={34} y={30} width={72} height={62} rx={8} fill="#10002b" stroke={INK} strokeWidth={3} />
      <g className="glitch-face">
        {face(-2, '#ff006e', 0.8)}
        {face(2, '#00f5d4', 0.8)}
        {face(0, '#39ff14')}
      </g>
      <g className="scanlines" opacity={0.25}>
        {[36, 44, 52, 60, 68, 76, 84].map((y) => (
          <rect key={y} x={34} y={y} width={72} height={2} fill="#ffffff" />
        ))}
      </g>
    </svg>
  );
}

/** ECHO – the friendly HQ computer that gives hints. */
export function Echo({ className, talking }: { className?: string; talking?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="ECHO">
      <rect x={10} y={14} width={80} height={64} rx={16} fill="#4cc9f0" stroke={INK} strokeWidth={4} />
      <rect x={20} y={24} width={60} height={44} rx={10} fill="#0b2545" stroke={INK} strokeWidth={3} />
      <circle cx={38} cy={42} r={6} fill="#caf0f8" className="blink-slow" />
      <circle cx={62} cy={42} r={6} fill="#caf0f8" className="blink-slow" />
      <path d={talking ? 'M38,56 Q50,66 62,56 Q50,60 38,56Z' : 'M38,56 Q50,63 62,56'} fill={talking ? '#caf0f8' : 'none'} stroke="#caf0f8" strokeWidth={3} strokeLinecap="round" className={talking ? 'talk' : ''} />
      <rect x={40} y={78} width={20} height={8} fill="#adb5bd" stroke={INK} strokeWidth={3} />
      <rect x={26} y={86} width={48} height={8} rx={4} fill="#adb5bd" stroke={INK} strokeWidth={3} />
      <path d="M50,14 V4" stroke={INK} strokeWidth={3} />
      <circle cx={50} cy={4} r={4} fill="#ffd60a" stroke={INK} strokeWidth={2} />
    </svg>
  );
}

/** Glowing energy core collected after each room */
export function Core({ color, className, label }: { color: string; className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={label ?? 'core'}>
      <defs>
        <radialGradient id={`cg-${color.slice(1)}`}>
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity={0.2} />
        </radialGradient>
      </defs>
      <circle cx={50} cy={50} r={46} fill={`url(#cg-${color.slice(1)})`} className="pulse" />
      <polygon points="50,14 80,32 80,68 50,86 20,68 20,32" fill={color} stroke={INK} strokeWidth={4} />
      <polygon points="50,26 70,38 70,62 50,74 30,62 30,38" fill="#ffffff" fillOpacity={0.45} />
      <circle cx={50} cy={50} r={9} fill="#fff" />
    </svg>
  );
}
