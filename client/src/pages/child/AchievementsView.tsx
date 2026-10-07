import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Sparkles, CheckCircle2, Lock, ArrowLeft, Volume2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sounds } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { Achievement } from '../../types';

interface AchievementsViewProps {
  onNavigate: (view: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ onNavigate }) => {
  const { child } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!child) return;
    fetch(`/api/children/${child.id}/achievements`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setAchievements(d.achievements);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [child]);

  const earnedCount = achievements.filter(a => a.earnedAt).length;

  const handleSpeakBadge = (ach: Achievement) => {
    sounds.playClick();
    speech.speak(`${ach.title}. ${ach.description}. ${ach.earnedAt ? 'Earned and shining!' : 'Locked challenge.'}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      
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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-black">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
            <span>{child?.streak || 5} Day Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-full text-xs font-black">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{child?.xp || 420} Total XP</span>
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="inline-flex p-3 bg-white/20 rounded-2xl backdrop-blur-md mb-3">
          <Trophy className="w-8 h-8 text-amber-300" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight m-0">
          Trophy & Badge Showcase
        </h1>
        <p className="text-indigo-100 font-medium text-sm sm:text-base mt-2 max-w-lg mx-auto">
          Every quest you finish unlocks permanent badges and shines in your hall of fame!
        </p>

        {/* Unlocked ratio */}
        <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-white text-indigo-950 font-black text-sm rounded-full shadow-md">
          <span>{earnedCount} of {achievements.length} Badges Unlocked</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          const isEarned = !!ach.earnedAt;
          return (
            <div
              key={ach.id}
              onClick={() => handleSpeakBadge(ach)}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isEarned
                  ? 'bg-gradient-to-b from-amber-50 to-white border-amber-300 shadow-md hover:scale-102 hover:border-amber-400'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-sm ${
                    isEarned ? 'bg-amber-100 border border-amber-300' : 'bg-slate-200 grayscale'
                  }`}>
                    {ach.icon}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isEarned ? (
                      <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-black text-slate-400 bg-slate-200 px-2.5 py-0.5 rounded-full">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakBadge(ach);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                      title="Read badge"
                      aria-label="Listen to badge info"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  {ach.category}
                </span>

                <h3 className="text-lg font-black text-slate-900 mt-2 mb-1">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed m-0">
                  {ach.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-amber-700">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>+{ach.xpReward} XP</span>
                </div>
                {isEarned && (
                  <span className="text-[11px] text-slate-400">Earned in adventure</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
