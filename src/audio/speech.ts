// Read English text aloud with the browser's built-in voices (works offline on iPads).

let voice: SpeechSynthesisVoice | null = null;

function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  voice =
    voices.find((v) => v.lang === 'en-GB') ||
    voices.find((v) => v.lang.startsWith('en-GB')) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null;
  return voice;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = () => pickVoice();
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export interface SpeakOpts {
  pitch?: number;
  rate?: number;
  onEnd?: () => void;
}

export function speak(text: string, opts: SpeakOpts = {}) {
  if (!canSpeak()) {
    opts.onEnd?.();
    return;
  }
  const clean = text.replace(/_{2,}/g, ' blank ').replace(/[🔊😈✔✖🤝🔒]/gu, '');
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'en-GB';
  u.rate = opts.rate ?? 0.88;
  u.pitch = opts.pitch ?? 1;
  if (voice || pickVoice()) u.voice = voice;
  if (opts.onEnd) {
    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      opts.onEnd?.();
    };
    u.onend = end;
    u.onerror = end;
  }
  window.speechSynthesis.speak(u);
}

export const stopSpeaking = () => canSpeak() && window.speechSynthesis.cancel();

/** villain voice */
export const speakGlitch = (text: string, onEnd?: () => void) => speak(text, { pitch: 0.4, rate: 0.82, onEnd });
