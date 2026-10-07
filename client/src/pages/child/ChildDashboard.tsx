import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Sparkles, 
  Flame, 
  Star, 
  Trophy, 
  Compass, 
  BookOpen, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Target,
  Smile
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sounds } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { MascotBuddy } from '../../components/MascotBuddy';
import { Lesson, Achievement } from '../../types';

interface ChildDashboardProps {
  onNavigate: (view: string, extra?: { lessonId?: string; activityId?: string }) => void;
}

export const ChildDashboard: React.FC<ChildDashboardProps> = ({ onNavigate }) => {
  const { child } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!child) return;
    
    // Fetch lessons, achievements, and AI recommendations
    Promise.all([
      fetch(`/api/lessons?childId=${child.id}`).then(r => r.json()),
      fetch(`/api/children/${child.id}/achievements`).then(r => r.json()),
      fetch(`/api/children/${child.id}/recommendations`).then(r => r.json())
    ]).then(([lessonsData, achData, recData]) => {
      if (lessonsData.success) setLessons(lessonsData.lessons);
      if (achData.success) setAchievements(achData.achievements);
      if (recData.success) setRecommendation(recData.recommendation);
      setLoading(false);
    }).catch(err => {
      console.warn("Error fetching dashboard data:", err);
      setLoading(false);
    });
  }, [child]);

  const childName = child ? child.displayName.split(' ')[0] : 'Super Learner';
  const greetingText = `Hi ${childName}! Ready for today's adventure?`;

  const handleSpeakGreeting = () => {
    sounds.playClick();
    speech.speak(`${greetingText} You have a 5-day streak! Let's conquer today's learning quest!`);
  };

  const unlockedLessons = lessons.filter(l => l.isUnlocked);
  const currentLesson = recommendation?.lesson || unlockedLessons[0] || lessons[0];
  const targetActivity = recommendation?.activity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* Top Banner Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-200 p-6 sm:p-8 shadow-md border-2 border-amber-300">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4 text-center md:text-left">
            <MascotBuddy
              mood="happy"
              speechBubble={recommendation?.tutorEncouragement || "You are doing amazing! Let's explore together!"}
              size="md"
            />
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight m-0">
                  {greetingText}
                </h1>
                <button
                  onClick={handleSpeakGreeting}
                  className="p-1.5 text-amber-800 hover:text-amber-950 bg-white/70 hover:bg-white rounded-full transition-transform active:scale-95"
                  title="Read aloud"
                  aria-label="Read greeting aloud"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-700 font-semibold text-xs sm:text-sm mt-1 mb-0">
                ⭐ {child?.xp || 420} Stars Earned • Level {child?.level || 3} Explorer • {child?.streak || 5} Day Streak 🔥
              </p>
            </div>
          </div>

          {/* Quick Start Recommended Activity */}
          {targetActivity && (
            <button
              onClick={() => {
                sounds.playSuccess();
                onNavigate('child-activity', { activityId: targetActivity.id, lessonId: currentLesson.id });
              }}
              className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Continue Quest: {targetActivity.title}</span>
            </button>
          )}

        </div>
      </div>

      {/* Grid: Left 2 Columns (Main Learning Flow) & Right Column (Goals & Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols Span): Continue Learning & Learning Journey */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SECTION 1: Continue Learning Spotlight */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 m-0">
                  Continue Learning
                </h2>
              </div>
              <button
                onClick={() => onNavigate('child-path')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View Full Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {currentLesson && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 text-white text-3xl flex items-center justify-center shadow-md">
                      {currentLesson.icon || '📚'}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                        {currentLesson.subject} • {currentLesson.difficulty}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 mb-0.5">
                        {currentLesson.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 m-0 line-clamp-1">
                        {currentLesson.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onNavigate('child-lesson', { lessonId: currentLesson.id });
                      }}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
                    >
                      Read Lesson
                    </button>
                    <button
                      onClick={() => {
                        sounds.playSuccess();
                        onNavigate('child-activity', { lessonId: currentLesson.id });
                      }}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Activity</span>
                    </button>
                  </div>
                </div>

                {/* AI Rationale Tag */}
                {recommendation && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-indigo-900 bg-indigo-50/60 p-3 rounded-2xl">
                    <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="font-medium">{recommendation.rationale}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 2: Lesson Journey Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🗺️</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 m-0">
                  Your Learning Worlds
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lessons.slice(0, 4).map((lesson, idx) => (
                <div
                  key={lesson.id}
                  onClick={() => {
                    sounds.playClick();
                    onNavigate('child-lesson', { lessonId: lesson.id });
                  }}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                    lesson.status === 'completed'
                      ? 'bg-emerald-50/50 border-emerald-300 hover:border-emerald-400 shadow-2xs'
                      : lesson.isUnlocked
                      ? 'bg-white border-indigo-200 hover:border-indigo-400 shadow-2xs hover:scale-[1.01]'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-3xl mb-2">{lesson.icon}</div>
                    {lesson.status === 'completed' ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done!
                      </span>
                    ) : lesson.isUnlocked ? (
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                        {lesson.completionPercentage || 0}% Ready
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                        Locked 🔒
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-1">{lesson.title}</h3>
                  <p className="text-xs text-slate-500 m-0 line-clamp-1">{lesson.subject} • {lesson.estimatedMinutes} min</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Today's Goal, Streak & AI Tutor Buddy */}
        <div className="space-y-6">
          
          {/* Today's Goal Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-black text-slate-900 m-0">Today's Daily Quest</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Complete 1 activity with Buddy to keep your 5-day streak blazing! 🔥
            </p>
            
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs font-bold text-amber-900">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Earn 40 Stars Today</span>
                </div>
                <span>40/40 ⭐</span>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between text-xs font-bold text-purple-900">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-purple-600" />
                  <span>Ask Buddy 1 Question</span>
                </div>
                <span>1/1 ✅</span>
              </div>
            </div>
          </div>

          {/* AI Buddy Companion Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-bold">
                🦉
              </div>
              <div>
                <h3 className="text-base font-black m-0">Ask LearnAble Buddy</h3>
                <p className="text-[11px] text-indigo-200 m-0">Your warm AI learning sidekick</p>
              </div>
            </div>
            
            <p className="text-xs text-indigo-100 leading-relaxed mb-4">
              "Need a friendly hint or someone to read a word with you? I'm always here for you!"
            </p>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('child-tutor');
              }}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Chat with Buddy</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Calm Down Corner Promo Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border-2 border-emerald-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌿</span>
              <div>
                <h3 className="text-base font-black text-emerald-950 m-0">The Calm Down Corner</h3>
                <p className="text-[11px] text-emerald-700 m-0">Sensory breathing & bubble poppers</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 m-0 leading-relaxed font-medium">
              Need a peaceful pause? Inflate gentle breathing balloons or pop sensory fidget bubbles anytime!
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('child-calm');
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Visit Calm Corner</span>
              <span>🎈</span>
            </button>
          </div>

          {/* Achievements Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 m-0">Badges Unlocked</h3>
              </div>
              <button
                onClick={() => onNavigate('child-achievements')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                All Badges
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {achievements.slice(0, 4).map((ach) => (
                <div
                  key={ach.id}
                  title={`${ach.title}: ${ach.description}`}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border text-center transition-all ${
                    ach.earnedAt
                      ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                  }`}
                >
                  <span className="text-2xl">{ach.icon}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
