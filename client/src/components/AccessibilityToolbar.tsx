import React, { useState } from 'react';
import { 
  Eye, 
  Type, 
  Volume2, 
  VolumeX, 
  Sliders, 
  X, 
  Sparkles, 
  Moon, 
  Sun, 
  Compass, 
  Check, 
  Play
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { sounds } from '../utils/sound';
import { speech } from '../utils/speech';

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.isMuted());
  const { settings, activeProfile, setSetting, applyProfile } = useAccessibility();

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playClick();
  };

  const handleTestTTS = () => {
    speech.speak("Hello! LearnAble speaks aloud to help you learn smoothly and happily!");
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        <button
          onClick={handleToggleMute}
          title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
          className="p-3 bg-white/90 backdrop-blur-md text-slate-700 hover:text-indigo-600 rounded-full shadow-lg border-2 border-indigo-100 transition-all hover:scale-105 active:scale-95 focus:ring-4 focus:ring-indigo-200"
          aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-indigo-600" />}
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white/40 focus:ring-4 focus:ring-indigo-300"
          aria-label="Open Accessibility Menu"
          aria-expanded={isOpen}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">Accessibility</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
        </button>
      </div>

      {/* Accessibility Modal Drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full sm:w-[480px] max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-title"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="accessibility-title" className="text-lg font-bold text-slate-800 m-0">
                    Accessibility & Inclusion
                  </h2>
                  <p className="text-xs text-slate-500 m-0">Customized learning comfort for every child</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/50 transition-colors"
                aria-label="Close accessibility menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* 1-Click Neurodiversity Profiles */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  1-Click Inclusive Profiles
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      applyProfile('dyslexia');
                    }}
                    className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                      activeProfile === 'dyslexia'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-sm'
                        : 'border-slate-200 hover:border-indigo-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">📖</span>
                      {activeProfile === 'dyslexia' && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div className="mt-1.5">
                      <div className="font-bold text-sm">Dyslexia</div>
                      <div className="text-[11px] text-slate-500 leading-tight">Lexend font, ruler, text-to-speech</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      applyProfile('adhd');
                    }}
                    className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                      activeProfile === 'adhd'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-sm'
                        : 'border-slate-200 hover:border-amber-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">⚡</span>
                      {activeProfile === 'adhd' && <Check className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div className="mt-1.5">
                      <div className="font-bold text-sm">ADHD</div>
                      <div className="text-[11px] text-slate-500 leading-tight">Focus ruler, micro-goals, clear flow</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      applyProfile('autism');
                    }}
                    className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                      activeProfile === 'autism'
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-sm'
                        : 'border-slate-200 hover:border-emerald-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🌿</span>
                      {activeProfile === 'autism' && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="mt-1.5">
                      <div className="font-bold text-sm">Autism / Sensory</div>
                      <div className="text-[11px] text-slate-500 leading-tight">Calm colors, zero jarring motion</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      applyProfile('slow_learning');
                    }}
                    className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                      activeProfile === 'slow_learning'
                        ? 'border-sky-500 bg-sky-50/70 text-sky-900 shadow-sm'
                        : 'border-slate-200 hover:border-sky-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🐢</span>
                      {activeProfile === 'slow_learning' && <Check className="w-4 h-4 text-sky-600" />}
                    </div>
                    <div className="mt-1.5">
                      <div className="font-bold text-sm">Paced Learning</div>
                      <div className="text-[11px] text-slate-500 leading-tight">Step-by-step, hints, large cues</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Text Size Control */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-bold text-slate-700">Text Size</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 capitalize">{settings.fontSize}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'large', 'xlarge'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        sounds.playClick();
                        setSetting('fontSize', size);
                      }}
                      className={`py-2 px-3 rounded-xl font-medium text-xs border transition-all ${
                        settings.fontSize === size
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {size === 'normal' ? 'Regular' : size === 'large' ? 'Large (+15%)' : 'Extra (+30%)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading Assistance & Focus Tools */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Visual & Reading Tools
                </label>

                {/* Dyslexia Font */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <div className="text-sm font-bold text-slate-800">Dyslexia-Friendly Typography</div>
                    <div className="text-xs text-slate-500">Enhanced letterforms and wide spacing</div>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSetting('fontFamily', settings.fontFamily === 'lexend' ? 'sans' : 'lexend');
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.fontFamily === 'lexend' ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        settings.fontFamily === 'lexend' ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* ADHD Reading Ruler */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <div className="text-sm font-bold text-slate-800">Reading Focus Ruler</div>
                    <div className="text-xs text-slate-500">Highlight bar tracks sentences on cursor</div>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSetting('readingRuler', !settings.readingRuler);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.readingRuler ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        settings.readingRuler ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <div className="text-sm font-bold text-slate-800">High Contrast Mode</div>
                    <div className="text-xs text-slate-500">Bold yellow on deep contrast dark</div>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSetting('highContrast', !settings.highContrast);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.highContrast ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        settings.highContrast ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Calm Mode */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <div className="text-sm font-bold text-slate-800">Calm Sensory Mode</div>
                    <div className="text-xs text-slate-500">Muted earth tones, reduces sensory fatigue</div>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSetting('calmMode', !settings.calmMode);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.calmMode ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        settings.calmMode ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Reduced Animation */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <div className="text-sm font-bold text-slate-800">Reduced Motion</div>
                    <div className="text-xs text-slate-500">Disable bouncing and spinning animations</div>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSetting('reducedAnimation', !settings.reducedAnimation);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.reducedAnimation ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        settings.reducedAnimation ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Text-to-Speech Test */}
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-purple-900">Audio Speech Assistant</div>
                  <div className="text-xs text-purple-700">Reads text out loud with Web Speech API</div>
                </div>
                <button
                  onClick={handleTestTTS}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Test Voice</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  sounds.playClick();
                  applyProfile('default');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
