import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  Sparkles, 
  Play, 
  BookOpen, 
  CheckCircle2, 
  Lightbulb, 
  RotateCcw 
} from 'lucide-react';
import { sounds } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { MascotBuddy } from '../../components/MascotBuddy';
import { Lesson } from '../../types';

interface LessonViewProps {
  lessonId: string;
  onNavigate: (view: string, extra?: { lessonId?: string; activityId?: string }) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lessonId, onNavigate }) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLesson(data.lesson);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lessonId]);

  const currentSlide = lesson?.slides?.[currentSlideIndex];

  const handleSpeakSlide = () => {
    if (!currentSlide) return;
    sounds.playClick();
    speech.speak(`${currentSlide.title}. ${currentSlide.text}. Tip: ${currentSlide.tip || ''}`);
  };

  const handleNextSlide = () => {
    if (!lesson?.slides) return;
    sounds.playClick();
    if (currentSlideIndex < lesson.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      // Completed slides, jump to activity!
      sounds.playSuccess();
      onNavigate('child-activity', { lessonId: lesson.id });
    }
  };

  const handlePrevSlide = () => {
    sounds.playClick();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  if (loading || !lesson || !currentSlide) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-4xl animate-bounce mb-3">📖</div>
        <p className="text-slate-500 font-bold">Opening your lesson adventure...</p>
      </div>
    );
  }

  const isLastSlide = currentSlideIndex === (lesson.slides.length - 1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('child-path');
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journey</span>
        </button>

        {/* Progress tracker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            Slide {currentSlideIndex + 1} of {lesson.slides.length}
          </span>
          <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentSlideIndex + 1) / lesson.slides.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-2 border-indigo-100 space-y-6">
        
        {/* Header of the slide */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{lesson.icon}</span>
            <div>
              <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {lesson.subject}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 m-0">
                {currentSlide.title}
              </h1>
            </div>
          </div>

          <button
            onClick={handleSpeakSlide}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm rounded-2xl border border-indigo-200 transition-all active:scale-95"
            title="Listen to this page"
            aria-label="Read this slide aloud"
          >
            <Volume2 className="w-5 h-5 text-indigo-600" />
            <span className="hidden sm:inline">Read Aloud</span>
          </button>
        </div>

        {/* Slide Body Content */}
        <div className="py-4">
          <p className="text-lg sm:text-2xl font-bold text-slate-800 leading-relaxed sm:leading-loose">
            {currentSlide.text}
          </p>
        </div>

        {/* Friendly Tip Box */}
        {currentSlide.tip && (
          <div className="p-4 bg-amber-50/80 rounded-2xl border-2 border-amber-200 flex items-start gap-3 text-amber-950">
            <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 block mb-0.5">
                Buddy's Helpful Tip
              </span>
              <p className="text-xs sm:text-sm font-semibold m-0 leading-relaxed">
                {currentSlide.tip}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
              currentSlideIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700 active:scale-95'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNextSlide}
            className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <span>{isLastSlide ? 'Ready for Activities! 🎯' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mascot Companion at footer */}
      <div className="flex justify-center pt-2">
        <MascotBuddy
          mood="guiding"
          speechBubble="Take your time reading! When you are ready, test your superpowers in the activity!"
          size="sm"
        />
      </div>

    </div>
  );
};
