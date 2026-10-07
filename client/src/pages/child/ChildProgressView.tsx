import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Flame, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Brain, 
  Volume2, 
  Sparkles,
  BarChart2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sounds } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { MascotBuddy } from '../../components/MascotBuddy';

interface ChildProgressViewProps {
  onNavigate: (view: string) => void;
}

export const ChildProgressView: React.FC<ChildProgressViewProps> = ({ onNavigate }) => {
  const { child } = useAuth();
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!child) return;
    fetch(`/api/children/${child.id}/progress`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setProgressData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [child]);

  const handleSpeakOverview = () => {
    sounds.playClick();
    speech.speak(`Awesome job ${child?.displayName}! You have completed ${progressData?.stats?.completedLessons || 1} lessons with an average accuracy of ${progressData?.stats?.averageAccuracy || 90} percent!`);
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
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={handleSpeakOverview}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 transition-all active:scale-95"
          title="Read progress aloud"
          aria-label="Read progress aloud"
        >
          <Volume2 className="w-4 h-4" />
          <span>Read Aloud</span>
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner border border-white/30">
              {child?.avatar || '🦊'}
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-pink-200 block">
                Personal Learning Journey
              </span>
              <h1 className="text-2xl sm:text-3xl font-black m-0 mt-0.5">
                {child?.displayName}'s Progress Report
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 m-0 mt-1 font-medium">
                {child?.learningLevel} Explorer • {child?.accessibilityProfile?.toUpperCase()} Learning Accommodations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-center border border-white/20">
              <span className="text-xl sm:text-2xl font-black block">{progressData?.stats?.completedLessons || 1}</span>
              <span className="text-[10px] font-bold text-indigo-100 uppercase">Mastered</span>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-center border border-white/20">
              <span className="text-xl sm:text-2xl font-black block text-amber-300">{progressData?.stats?.averageAccuracy || 90}%</span>
              <span className="text-[10px] font-bold text-indigo-100 uppercase">Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Mastery Progress Bars */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900 m-0">Subject Mastery</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">Adaptive Pace</span>
        </div>

        <div className="space-y-4">
          {[
            { subject: 'Reading & Phonics 📚', progress: 100, accuracy: 95, color: 'from-sky-400 to-blue-500' },
            { subject: 'Safari Math 🦁', progress: 80, accuracy: 90, color: 'from-amber-400 to-orange-500' },
            { subject: 'Big Feelings & Calm 💖', progress: 40, accuracy: 85, color: 'from-pink-400 to-rose-500' },
            { subject: 'Curious Planet 🌱', progress: 10, accuracy: 80, color: 'from-emerald-400 to-teal-500' },
            { subject: 'Memory Galaxy ✨', progress: 20, accuracy: 88, color: 'from-purple-400 to-indigo-500' },
          ].map((subj) => (
            <div key={subj.subject} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">{subj.subject}</span>
                <span className="text-indigo-600">{subj.progress}% Completed ({subj.accuracy}% Acc)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                <div
                  className={`bg-gradient-to-r ${subj.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${subj.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson-by-Lesson Activity Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-4">
        <h2 className="text-lg font-black text-slate-900 m-0">Adventure Quest History</h2>
        
        <div className="space-y-3">
          {progressData?.progress?.map((p: any) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.lessonIcon || '📖'}</span>
                <div>
                  <h3 className="text-sm font-black text-slate-900 m-0">{p.lessonTitle}</h3>
                  <span className="text-[11px] text-slate-500 font-medium">{p.lessonSubject}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="text-right">
                  <span className="text-emerald-600 block">{p.accuracy}% Accuracy</span>
                  <span className="text-slate-400 text-[10px]">{Math.round(p.timeSpent / 60)} mins played</span>
                </div>
                {p.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px]">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buddy Mascot Encouragement */}
      <div className="flex justify-center pt-2">
        <MascotBuddy
          mood="celebrating"
          speechBubble="Look at how much you have accomplished! Your brain grows stronger with every fun quest!"
          size="md"
        />
      </div>

    </div>
  );
};
