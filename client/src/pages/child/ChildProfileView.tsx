import React, { useState } from 'react';
import { User, Sparkles, Sliders, Check, ArrowLeft, Volume2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { sounds } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { AccessibilityProfile } from '../../types';

interface ChildProfileViewProps {
  onNavigate: (view: string) => void;
}

export const ChildProfileView: React.FC<ChildProfileViewProps> = ({ onNavigate }) => {
  const { child, updateChildPreferences } = useAuth();
  const { activeProfile, applyProfile } = useAccessibility();

  const [avatar, setAvatar] = useState(child?.avatar || '🦊');
  const [displayName, setDisplayName] = useState(child?.displayName || 'Leo Garcia');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableAvatars = ['🦊', '🚀', '🦉', '🐬', '🦁', '⭐', '🐼', '🦄'];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    await updateChildPreferences({
      avatar,
      displayName,
      accessibilityProfile: activeProfile
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    speech.speak("Your profile preferences have been updated wonderfully!");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('child-home');
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-2 border-indigo-100">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-sm">
            {avatar}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 m-0">
              Personalized Child Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium m-0">
              Customize your avatar, accessibility profile, and learning settings
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Avatar Choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Select Your Avatar
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {availableAvatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setAvatar(av);
                  }}
                  className={`p-3 rounded-2xl border-2 text-2xl flex items-center justify-center transition-all ${
                    avatar === av
                      ? 'border-indigo-600 bg-indigo-50 scale-105 shadow-sm'
                      : 'border-slate-200 hover:border-indigo-300 bg-white'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Active Inclusive Profile */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Active Inclusive Learning Profile
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'dyslexia', title: 'Dyslexia Mode 📖', desc: 'Lexend font, ruler, text-to-speech audio' },
                { id: 'adhd', title: 'ADHD Mode ⚡', desc: 'Focus highlights, micro-tasks, zero clutter' },
                { id: 'autism', title: 'Autism / Sensory 🌿', desc: 'Calm earth tones, reduced motion' },
                { id: 'slow_learning', title: 'Paced Practice 🐢', desc: 'Step-by-step repetition, extra hints' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    applyProfile(p.id as AccessibilityProfile);
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start justify-between ${
                    activeProfile === p.id
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-extrabold text-sm">{p.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.desc}</div>
                  </div>
                  {activeProfile === p.id && <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences Saved!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-md transition-all active:scale-95"
            >
              Save Profile
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
