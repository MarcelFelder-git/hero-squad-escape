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

export function speak(text: string) {
  if (!canSpeak()) return;
  const clean = text.replace(/_{2,}/g, ' blank ').replace(/[🔊😈✔✖]/gu, '');
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'en-GB';
  u.rate = 0.88;
  if (voice || pickVoice()) u.voice = voice;
  window.speechSynthesis.speak(u);
}
