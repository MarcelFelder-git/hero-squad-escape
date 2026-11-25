const INK = '#141018';

/** small rocket for the top bar progress track */
export function RocketIcon({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden="true">
      <path d="M12,1 C18,7 19,16 17,23 H7 C5,16 6,7 12,1Z" fill={color} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={12} cy={11} r={3} fill="#caf0f8" stroke={INK} strokeWidth={1.5} />
      <path d="M7,17 L3,25 L7,23Z M17,17 L21,25 L17,23Z" fill={color} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

/** big rocket used on the reward screen */
export function Rocket({ color, className, flame = true }: { color: string; className?: string; flame?: boolean }) {
  return (
    <svg viewBox="0 0 120 220" className={className} aria-hidden="true">
      {flame && (
        <g className="flame">
          <path d="M42,170 Q60,230 78,170Z" fill="#ff7b00" stroke={INK} strokeWidth={3} />
          <path d="M50,170 Q60,206 70,170Z" fill="#ffd60a" />
        </g>
      )}
      <path d="M60,6 C92,38 98,100 86,170 H34 C22,100 28,38 60,6Z" fill="#f1f3f5" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M60,6 C76,22 84,40 88,58 H32 C36,40 44,22 60,6Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={60} cy={92} r={17} fill="#4cc9f0" stroke={INK} strokeWidth={5} />
      <circle cx={54} cy={86} r={5} fill="#fff" opacity={0.8} />
      <path d="M34,124 L8,170 L36,162Z M86,124 L112,170 L84,162Z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <rect x={40} y={140} width={40} height={10} fill={color} stroke={INK} strokeWidth={3} />
    </svg>
  );
}

/** gift box the rocket delivers */
export function GearBox({ color, open, className }: { color: string; open?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 120 110" className={className} aria-hidden="true">
      <rect x={14} y={44} width={92} height={62} fill={color} stroke={INK} strokeWidth={5} />
      <rect x={52} y={44} width={16} height={62} fill="#ffd60a" stroke={INK} strokeWidth={3} />
      <g className={open ? 'lid-open' : ''}>
        <rect x={8} y={28} width={104} height={20} fill={color} stroke={INK} strokeWidth={5} />
        <rect x={52} y={28} width={16} height={20} fill="#ffd60a" stroke={INK} strokeWidth={3} />
        <path d="M60,28 C40,6 28,18 44,28 M60,28 C80,6 92,18 76,28" fill="none" stroke={INK} strokeWidth={5} />
      </g>
    </svg>
  );
}
