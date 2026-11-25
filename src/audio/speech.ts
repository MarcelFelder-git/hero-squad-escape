// Read English text aloud with the browser's built-in voices (works offline on iPads).

let voice: SpeechSynthesisVoice | null = null;

function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  // iPad/iPhone: only voices that are on the device – a voice that is not downloaded stays silent
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const voices = window.speechSynthesis.getVoices().filter((v) => !ios || v.localService !== false);
  voice =
    voices.find((v) => v.lang === 'en-GB' && v.default) ||
    voices.find((v) => v.lang === 'en-GB') ||
    voices.find((v) => v.lang.replace('_', '-').startsWith('en-GB')) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null;
  return voice;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = () => pickVoice();
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

/*
 * iPad / iPhone (Safari): speech only works after the page has spoken once INSIDE a real tap.
 * Speech that starts later from a timer or a network event (e.g. a new team in the Hall) stays silent
 * until then. Best effort: the first tap anywhere speaks a (quiet) utterance. Pages that speak on their
 * own (Hall) additionally offer a button that speaks out loud and check with onStart whether it worked.
 */
let speechUnlocked = false;

export function unlockSpeech() {
  if (speechUnlocked || !canSpeak()) return;
  speechUnlocked = true;
  const u = new SpeechSynthesisUtterance('.');
  u.volume = 0;
  u.lang = 'en-GB';
  window.speechSynthesis.speak(u);
}

if (typeof window !== 'undefined') {
  const first = () => {
    unlockSpeech();
    window.removeEventListener('pointerdown', first, true);
    window.removeEventListener('touchend', first, true);
    window.removeEventListener('keydown', first, true);
  };
  window.addEventListener('pointerdown', first, true);
  window.addEventListener('touchend', first, true);
  window.addEventListener('keydown', first, true);
}

export interface SpeakOpts {
  pitch?: number;
  rate?: number;
  onEnd?: () => void;
  /** fires when the voice really starts – if it never fires, the browser blocked the speech */
  onStart?: () => void;
}

export function speak(text: string, opts: SpeakOpts = {}) {
  if (!canSpeak()) {
    opts.onEnd?.();
    return;
  }
  const clean = text.replace(/_{2,}/g, ' blank ').replace(/[🔊😈✔✖🤝🔒]/gu, '');
  const synth = window.speechSynthesis;
  if (synth.speaking || synth.pending) synth.cancel();
  synth.resume();
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
  if (opts.onStart) u.onstart = () => opts.onStart?.();
  synth.speak(u);
}

export const stopSpeaking = () => canSpeak() && window.speechSynthesis.cancel();

/** villain voice */
export const speakGlitch = (text: string, onEnd?: () => void) => speak(text, { pitch: 0.4, rate: 0.82, onEnd });
