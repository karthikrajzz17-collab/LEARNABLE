import React, { useState, useEffect } from 'react';
import { CheckCircle2, Lock, Play, Star, Sparkles, Compass, Volume2, Trophy, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sounds } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { Lesson } from '../../types';

interface LearningPathViewProps {
  onNavigate: (view: string, extra?: { lessonId?: string }) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({ onNavigate }) => {
  const { child } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!child) return;
    fetch(`/api/lessons?childId=${child.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setLessons(data.lessons);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [child]);

  const handleSpeakPath = () => {
    sounds.playClick();
    speech.speak("Welcome to your Learning Journey! Follow the magical path, complete each world, and collect stars!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold mb-3">
          <Compass className="w-4 h-4" />
          <span>Interactive Visual Trail</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight m-0">
            Your Learning Journey
          </h1>
          <button
            onClick={handleSpeakPath}
            title="Read path aloud"
            className="p-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-full transition-transform active:scale-95"
            aria-label="Listen to journey instructions"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
        <p className="text-slate-500 font-medium text-xs sm:text-sm mt-2 max-w-md mx-auto">
          Explore each island node. Win activities to unlock magical badges and reach the galaxy star!
        </p>
      </div>

      {/* Visual Journey Road with Connected Nodes */}
      <div className="relative py-8">
        
        {/* Curving SVG Path Line in background */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-b from-indigo-300 via-purple-300 to-amber-200 rounded-full z-0 pointer-events-none" />

        {/* Nodes */}
        <div className="space-y-16 relative z-10">
          {lessons.map((lesson, index) => {
            const isCompleted = lesson.status === 'completed';
            const isCurrent = lesson.isUnlocked && !isCompleted;
            const isLocked = !lesson.isUnlocked;
            const isEven = index % 2 === 0;

            return (
              <div
                key={lesson.id}
                className={`flex flex-col sm:flex-row items-center gap-6 ${
                  isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Visual Node Card */}
                <div className="flex-1 w-full max-w-sm">
                  <div
                    onClick={() => {
                      if (!isLocked) {
                        sounds.playClick();
                        onNavigate('child-lesson', { lessonId: lesson.id });
                      } else {
                        sounds.playRetry();
                        speech.speak("This lesson is locked. Complete the previous adventure to unlock it!");
                      }
                    }}
                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                      isCompleted
                        ? 'bg-emerald-50/90 border-emerald-300 shadow-md hover:scale-102'
                        : isCurrent
                        ? 'bg-white border-indigo-500 shadow-xl ring-4 ring-indigo-200/60 scale-105'
                        : 'bg-slate-100/80 border-slate-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Badge Pill */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-white shadow-2xs border border-slate-200 text-slate-700">
                        {lesson.subject}
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Star
                        </span>
                      ) : isCurrent ? (
                        <span className="flex items-center gap-1 text-xs font-black text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full animate-pulse">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Current Quest
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-black text-slate-400 bg-slate-200 px-2.5 py-0.5 rounded-full">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                      )}
                    </div>

                    {/* Lesson Details */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-3xl flex-shrink-0">
                        {lesson.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 m-0">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-slate-500 m-0 mt-0.5 line-clamp-2">
                          {lesson.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Progress & Reward */}
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span>+50 XP Reward</span>
                      </div>
                      
                      {!isLocked ? (
                        <div className="flex items-center gap-1 text-indigo-600">
                          <span>{isCompleted ? 'Review' : 'Play Quest'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <span className="text-slate-400">Complete prior stage</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Central Step Marker */}
                <div className="w-14 h-14 rounded-full bg-white border-4 border-indigo-400 shadow-lg flex items-center justify-center text-xl font-black text-indigo-700 z-10 flex-shrink-0">
                  {isCompleted ? '⭐' : index + 1}
                </div>

                {/* Balance Spacer on desktop */}
                <div className="flex-1 hidden sm:block max-w-sm" />
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
