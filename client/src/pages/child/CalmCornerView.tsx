import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Wind, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  Heart, 
  Smile, 
  Sun, 
  Waves, 
  CloudRain 
} from 'lucide-react';
import { sounds } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { MascotBuddy } from '../../components/MascotBuddy';

interface CalmCornerViewProps {
  onNavigate: (view: string) => void;
}

export const CalmCornerView: React.FC<CalmCornerViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'breathe' | 'fidget' | 'sounds'>('breathe');

  // Breathing state
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCounter, setBreathCounter] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(true);

  // Bubble Popper state (5x5 grid of 25 bubbles)
  const [poppedBubbles, setPoppedBubbles] = useState<boolean[]>(new Array(25).fill(false));

  // Ambient sound state
  const [activeAmbient, setActiveAmbient] = useState<string | null>(null);

  // Breathing timer loop
  useEffect(() => {
    if (!isBreathingActive || activeTab !== 'breathe') return;

    let timer: ReturnType<typeof setTimeout>;
    if (breathPhase === 'Inhale') {
      sounds.playMeditationChime();
      timer = setTimeout(() => {
        setBreathPhase('Hold');
      }, 4000);
    } else if (breathPhase === 'Hold') {
      timer = setTimeout(() => {
        setBreathPhase('Exhale');
      }, 2500);
    } else if (breathPhase === 'Exhale') {
      timer = setTimeout(() => {
        setBreathCounter(prev => prev + 1);
        setBreathPhase('Inhale');
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [breathPhase, isBreathingActive, activeTab]);

  const handlePop = (index: number) => {
    if (!poppedBubbles[index]) {
      sounds.playPop(index % 5);
      setPoppedBubbles(prev => {
        const next = [...prev];
        next[index] = true;
        return next;
      });
    }
  };

  const handleResetBubbles = () => {
    sounds.playClick();
    setPoppedBubbles(new Array(25).fill(false));
  };

  const poppedCount = poppedBubbles.filter(Boolean).length;

  const handleSpeakBreathe = () => {
    sounds.playClick();
    speech.speak("Welcome to the Calm Down Corner! Relax your shoulders, follow the balloon breathing circle, or pop the sensory bubbles!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('child-home');
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-700 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Adventures</span>
        </button>

        <button
          onClick={handleSpeakBreathe}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3.5 py-2 rounded-full border border-emerald-200 transition-all active:scale-95"
          title="Audio guidance"
          aria-label="Listen to calm instructions"
        >
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>Calm Guidance</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-300 text-slate-900 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden border-2 border-emerald-300">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-3xl bg-white/40 backdrop-blur-md flex items-center justify-center text-4xl shadow-sm border border-white/50">
              🌿
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900 block">
                Sensory & Emotional Reset
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 m-0 mt-0.5">
                The Calm Down Corner
              </h1>
              <p className="text-xs sm:text-sm text-emerald-950/80 m-0 mt-1 font-semibold">
                A cozy, pressure-free sanctuary to pause, breathe, and reset whenever you need.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-xs">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('breathe');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'breathe'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800'
              }`}
            >
              🎈 Balloon Breath
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('fidget');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'fidget'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800'
              }`}
            >
              🫧 Bubble Popper
            </button>
          </div>
        </div>
      </div>

      {/* ================= SECTION 1: BALLOON BREATHING ================= */}
      {activeTab === 'breathe' && (
        <div className="bg-white rounded-3xl p-8 sm:p-14 shadow-md border-2 border-emerald-100 flex flex-col items-center justify-center text-center space-y-8">
          
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Guided 4-2-4 Mindful Rhythm
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 m-0">
              {breathPhase === 'Inhale' && 'Breathe In Deeply... 🌸'}
              {breathPhase === 'Hold' && 'Gently Hold... ☁️'}
              {breathPhase === 'Exhale' && 'Slowly Blow Out Like a Cloud... 🎈'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Follow the expanding circle with your gentle breath. No hurry at all.
            </p>
          </div>

          {/* Expanding / Contracting Breathing Circle */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Outer Glow Ring */}
            <div
              className={`absolute rounded-full transition-all duration-[4000ms] ease-in-out ${
                breathPhase === 'Inhale'
                  ? 'w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-emerald-200 to-teal-200 opacity-60 scale-100 shadow-2xl ring-8 ring-emerald-300'
                  : breathPhase === 'Hold'
                  ? 'w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-teal-200 to-sky-200 opacity-70 scale-100 ring-8 ring-teal-300'
                  : 'w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-tr from-emerald-100 to-teal-100 opacity-40 scale-75'
              }`}
            />

            {/* Inner Heart Mascot Bubble */}
            <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white shadow-lg border-4 border-emerald-300 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl">
                {breathPhase === 'Inhale' ? '🌱' : breathPhase === 'Hold' ? '✨' : '🎈'}
              </span>
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider mt-1">
                {breathPhase}
              </span>
            </div>
          </div>

          {/* Breath Counter & Controls */}
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-black text-emerald-800">
              🌿 {breathCounter} Peaceful Breaths Completed
            </div>

            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              {isBreathingActive ? 'Pause Rhythm' : 'Resume Rhythm'}
            </button>
          </div>

        </div>
      )}

      {/* ================= SECTION 2: SENSORY BUBBLE POPPER (FIDGET TOY) ================= */}
      {activeTab === 'fidget' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border-2 border-emerald-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 m-0">Sensory Pop Pad 🫧</h2>
              <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">
                Tap the soft bubbles to release sensory energy and hear gentle pops!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                {poppedCount} of 25 Popped! 🎉
              </span>
              <button
                onClick={handleResetBubbles}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                title="Reset all bubbles"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* 5x5 Silicone Bubble Pad */}
          <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-sky-100 rounded-3xl border-4 border-white shadow-xl">
            <div className="grid grid-cols-5 gap-3 sm:gap-4">
              {poppedBubbles.map((isPopped, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePop(idx)}
                  className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full transition-all transform flex items-center justify-center font-black ${
                    isPopped
                      ? 'bg-slate-300/80 shadow-inner scale-90 border-2 border-slate-400 text-slate-400'
                      : 'bg-gradient-to-b from-white to-pink-200 shadow-md hover:scale-105 active:scale-90 border-2 border-white'
                  }`}
                  aria-label={`Sensory bubble ${idx + 1}`}
                >
                  <span className="text-xs opacity-60">{isPopped ? '•' : '🫧'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mascot Companion */}
      <div className="flex justify-center pt-2">
        <MascotBuddy
          mood="happy"
          speechBubble="Whenever you feel tired or restless, you can always visit me here in the Calm Down Corner! You are safe and doing great!"
          size="md"
        />
      </div>

    </div>
  );
};
