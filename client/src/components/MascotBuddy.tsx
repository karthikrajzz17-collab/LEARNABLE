import React from 'react';
import { speech } from '../utils/speech';
import { sounds } from '../utils/sound';
import { Volume2 } from 'lucide-react';

interface MascotBuddyProps {
  mood?: 'happy' | 'thinking' | 'celebrating' | 'guiding';
  speechBubble?: string;
  size?: 'sm' | 'md' | 'lg';
  onBubbleClick?: () => void;
  showAudioButton?: boolean;
}

export const MascotBuddy: React.FC<MascotBuddyProps> = ({
  mood = 'happy',
  speechBubble,
  size = 'md',
  onBubbleClick,
  showAudioButton = true,
}) => {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speechBubble) {
      sounds.playClick();
      speech.speak(speechBubble);
    }
  };

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  return (
    <div className="relative inline-flex items-center gap-3">
      {/* Buddy Mascot SVG Avatar */}
      <div 
        className={`relative ${sizeClasses[size]} rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 p-2 shadow-lg flex items-center justify-center transform transition-transform hover:scale-105 select-none`}
        title="LearnAble Buddy: Your Inclusive Learning Sidekick"
      >
        {/* Cute Mascot SVG with expressive eyes */}
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow">
          {/* Ears / Antennas */}
          <path d="M 30 25 L 20 10 L 40 18 Z" fill="#f59e0b" />
          <path d="M 70 25 L 80 10 L 60 18 Z" fill="#f59e0b" />
          
          {/* Head & Body */}
          <circle cx="50" cy="50" r="38" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
          <circle cx="50" cy="58" r="26" fill="#fef3c7" />

          {/* Cheeks */}
          <ellipse cx="30" cy="58" rx="6" ry="4" fill="#f43f5e" opacity="0.6" />
          <ellipse cx="70" cy="58" rx="6" ry="4" fill="#f43f5e" opacity="0.6" />

          {/* Eyes depending on mood */}
          {mood === 'celebrating' ? (
            <>
              {/* Happy squint curved eyes */}
              <path d="M 32 46 Q 38 40 44 46" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 56 46 Q 62 40 68 46" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          ) : mood === 'thinking' ? (
            <>
              {/* Curious looking up-right */}
              <circle cx="38" cy="44" r="5" fill="#1e293b" />
              <circle cx="62" cy="44" r="5" fill="#1e293b" />
              <circle cx="40" cy="42" r="2" fill="#ffffff" />
              <circle cx="64" cy="42" r="2" fill="#ffffff" />
            </>
          ) : (
            <>
              {/* Bright friendly wide eyes */}
              <circle cx="36" cy="46" r="6" fill="#1e293b" />
              <circle cx="64" cy="46" r="6" fill="#1e293b" />
              <circle cx="38" cy="44" r="2.5" fill="#ffffff" />
              <circle cx="66" cy="44" r="2.5" fill="#ffffff" />
            </>
          )}

          {/* Cute Beak/Nose */}
          <polygon points="50,52 45,58 55,58" fill="#f97316" stroke="#c2410c" strokeWidth="1" />

          {/* Smile */}
          <path d="M 45 63 Q 50 68 55 63" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>

        {/* Small floating sparkles / badge */}
        <span className="absolute -top-1 -right-1 text-xs">✨</span>
      </div>

      {/* Speech Bubble if present */}
      {speechBubble && (
        <div 
          onClick={onBubbleClick}
          className={`relative max-w-xs md:max-w-md bg-white text-slate-800 p-3.5 px-4 rounded-2xl shadow-md border-2 border-amber-200 text-sm leading-relaxed cursor-pointer hover:border-amber-400 transition-all ${
            onBubbleClick ? 'hover:scale-[1.02]' : ''
          }`}
        >
          {/* Arrow */}
          <div className="absolute top-1/2 -left-2 -mt-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-amber-200" />
          <div className="absolute top-1/2 -left-1.5 -mt-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white" />

          <div className="flex items-start justify-between gap-2">
            <p className="m-0 font-medium text-slate-700 text-xs sm:text-sm">{speechBubble}</p>
            {showAudioButton && (
              <button
                onClick={handleSpeak}
                title="Read out loud"
                className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-colors flex-shrink-0"
                aria-label="Listen to Buddy speak"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
