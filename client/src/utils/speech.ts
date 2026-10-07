// Web Speech API Text-to-Speech manager

class SpeechManager {
  private isSupported: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speakingListeners: Array<(speaking: boolean) => void> = [];

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public subscribeSpeaking(callback: (speaking: boolean) => void) {
    this.speakingListeners.push(callback);
    return () => {
      this.speakingListeners = this.speakingListeners.filter(cb => cb !== callback);
    };
  }

  private notify(speaking: boolean) {
    this.speakingListeners.forEach(cb => cb(speaking));
  }

  public speak(text: string, rate: number = 0.95, pitch: number = 1.1) {
    if (!this.isSupported) return;

    window.speechSynthesis.cancel();

    // Clean emojis and markdown characters for cleaner speech
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[*_#`~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate; // slightly calmer pace for accessibility
    utterance.pitch = pitch; // slightly friendly warmer pitch

    // Try selecting friendly English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => this.notify(true);
    utterance.onend = () => this.notify(false);
    utterance.onerror = () => this.notify(false);

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if (!this.isSupported) return;
    window.speechSynthesis.cancel();
    this.notify(false);
  }

  public isSpeaking(): boolean {
    return this.isSupported && window.speechSynthesis.speaking;
  }
}

export const speech = new SpeechManager();
