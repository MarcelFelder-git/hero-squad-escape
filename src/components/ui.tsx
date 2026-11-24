import { useEffect, type ReactNode } from 'react';
import { canSpeak, speak } from '../audio/speech';
import { sfx } from '../audio/sound';

export function Modal({
  title,
  onClose,
  children,
  wide,
  className,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal panel ${wide ? 'modal-wide' : ''} ${className ?? ''}`} role="dialog" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Schließen">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  text,
  yes,
  no = 'Abbrechen',
  onYes,
  onNo,
}: {
  title: string;
  text: string;
  yes: string;
  no?: string;
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <Modal title={title} onClose={onNo}>
      <p className="confirm-text">{text}</p>
      <div className="row-btns">
        <button className="btn btn-ghost" onClick={onNo}>
          {no}
        </button>
        <button className="btn btn-red" onClick={onYes}>
          {yes}
        </button>
      </div>
    </Modal>
  );
}

export function SpeakButton({ text, small }: { text: string; small?: boolean }) {
  if (!canSpeak()) return null;
  return (
    <button
      className={`speak-btn ${small ? 'speak-small' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        sfx.click();
        speak(text);
      }}
      aria-label="Vorlesen"
      title="Vorlesen / read aloud"
    >
      🔊
    </button>
  );
}

export function Burst({ text, kind }: { text: string; kind: 'good' | 'bad' }) {
  return (
    <div className={`burst burst-${kind}`} aria-hidden="true">
      <svg viewBox="0 0 200 140">
        <polygon
          points="100,4 118,38 160,14 146,52 196,56 154,78 184,116 134,100 122,136 100,104 76,136 66,100 16,116 46,78 4,56 54,52 40,14 82,38"
          fill={kind === 'good' ? '#ffd60a' : '#ff4d6d'}
          stroke="#141018"
          strokeWidth={5}
          strokeLinejoin="round"
        />
      </svg>
      <span>{text}</span>
    </div>
  );
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
