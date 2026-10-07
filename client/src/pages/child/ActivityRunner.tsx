import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Volume2, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  Star, 
  Trophy,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sounds } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { MascotBuddy } from '../../components/MascotBuddy';
import { Activity } from '../../types';

interface ActivityRunnerProps {
  activityId?: string;
  lessonId?: string;
  onNavigate: (view: string, extra?: { lessonId?: string; activityId?: string }) => void;
}

export const ActivityRunner: React.FC<ActivityRunnerProps> = ({ activityId, lessonId, onNavigate }) => {
  const { child, refreshChildData } = useAuth();
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  // User input states across activity types
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Match the pairs state
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ [leftId: string]: string }>({});
  
  // Drag / Categorize state
  const [categorizedItems, setCategorizedItems] = useState<{ [itemId: string]: string }>({});

  // Memory card game state
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [solvedCards, setSolvedCards] = useState<string[]>([]);

  // Submission & Feedback states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState<string>('');

  useEffect(() => {
    // If activityId is passed, fetch it. Otherwise find activities for lessonId.
    let targetUrl = activityId ? `/api/activities/${activityId}` : null;

    if (!targetUrl && lessonId) {
      fetch(`/api/lessons/${lessonId}`)
        .then(r => r.json())
        .then(d => {
          if (d.success && d.activities?.length > 0) {
            setActivity(d.activities[0]);
            setLoading(false);
          } else {
            // fallback to first activity
            fetch('/api/activities/act-1').then(r => r.json()).then(res => {
              setActivity(res.activity);
              setLoading(false);
            });
          }
        });
    } else {
      fetch(targetUrl || '/api/activities/act-1')
        .then(r => r.json())
        .then(d => {
          if (d.success) setActivity(d.activity);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [activityId, lessonId]);

  // Reset local state when activity changes
  useEffect(() => {
    setSelectedOption(null);
    setSelectedLeft(null);
    setMatchedPairs({});
    setCategorizedItems({});
    setFlippedCards([]);
    setSolvedCards([]);
    setIsSubmitted(false);
    setSubmissionResult(null);
    setShowHint(false);
  }, [activity]);

  const handleSpeakPrompt = () => {
    if (!activity) return;
    sounds.playClick();
    speech.speak(activity.promptAudio || activity.question);
  };

  const handleAskBuddyHint = () => {
    sounds.playClick();
    setShowHint(true);
    setHintText(activity?.hint || "Take your time! Read each option slowly and trust your instincts.");
    speech.speak(`Here is a clue from Buddy: ${activity?.hint || ''}`);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Submit Answer to Backend
  const handleSubmitAnswer = async () => {
    if (!activity || !child) return;
    sounds.playClick();

    let answerPayload: any = null;

    if (activity.type === 'multiple_choice' || activity.type === 'image_id' || activity.type === 'story_choice' || activity.type === 'puzzle') {
      answerPayload = selectedOption;
    } else if (activity.type === 'match_pairs') {
      answerPayload = activity.pairs?.map(p => ({
        pairId: p.id,
        matched: matchedPairs[p.id] === p.right
      }));
    } else if (activity.type === 'drag_drop') {
      answerPayload = categorizedItems;
    } else if (activity.type === 'memory_game') {
      answerPayload = { completed: solvedCards.length >= (activity.cards?.length || 6) };
    }

    try {
      const res = await fetch(`/api/activities/${activity.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: child.id,
          answer: answerPayload,
          timeSpentSeconds: 35
        })
      });
      const data = await res.json();
      
      setSubmissionResult(data);
      setIsSubmitted(true);

      if (data.isCorrect) {
        sounds.playSuccess();
        triggerConfetti();
        if (data.leveledUp) {
          setTimeout(() => sounds.playLevelUp(), 800);
        }
        speech.speak("Sensational work! You got it right! High five!");
      } else {
        sounds.playRetry();
        speech.speak("That was a great try! Let's listen to Buddy's hint and try once more!");
      }

      await refreshChildData();
    } catch (err) {
      console.warn("Submission failed:", err);
    }
  };

  if (loading || !activity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-4xl animate-bounce mb-3">🧩</div>
        <p className="text-slate-500 font-bold">Setting up your learning game...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Top Bar Navigation */}
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

        {/* Hints and Voice Assistant */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAskBuddyHint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95"
            title="Ask Buddy for a clue"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Buddy's Hint</span>
          </button>

          <button
            onClick={handleSpeakPrompt}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95"
            title="Read question out loud"
            aria-label="Read prompt aloud"
          >
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Read Aloud</span>
          </button>
        </div>
      </div>

      {/* Main Activity Arena Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-2 border-indigo-100 space-y-6">
        
        {/* Activity Title & Question */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
              {activity.type.replace('_', ' ')} • +{activity.xpReward} XP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug m-0">
            {activity.question}
          </h1>
        </div>

        {/* Hint Box (if triggered) */}
        {showHint && (
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-start gap-3 text-amber-950 animate-in fade-in">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-800">
                Buddy's Secret Clue:
              </div>
              <p className="text-xs sm:text-sm font-semibold m-0 leading-relaxed mt-0.5">
                {hintText}
              </p>
            </div>
          </div>
        )}

        {/* ---------------- TYPE 1: MULTIPLE CHOICE & PUZZLE ---------------- */}
        {(activity.type === 'multiple_choice' || activity.type === 'puzzle') && activity.options && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {activity.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  if (isSubmitted) return;
                  sounds.playClick();
                  setSelectedOption(opt.id);
                  if (opt.audio || opt.text) speech.speak(opt.audio || opt.text || '');
                }}
                className={`p-6 rounded-3xl border-3 text-center transition-all flex flex-col items-center justify-center gap-3 ${
                  selectedOption === opt.id
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-md scale-102 ring-4 ring-indigo-200'
                    : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="text-xl sm:text-2xl font-black text-slate-800">
                  {opt.text}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {selectedOption === opt.id ? 'Selected ✨' : 'Tap to choose'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ---------------- TYPE 2: IMAGE IDENTIFICATION ---------------- */}
        {activity.type === 'image_id' && activity.options && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {activity.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  if (isSubmitted) return;
                  sounds.playClick();
                  setSelectedOption(opt.id);
                  speech.speak(opt.label || opt.description || '');
                }}
                className={`p-8 rounded-3xl border-3 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  selectedOption === opt.id
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-md scale-105 ring-4 ring-indigo-200'
                    : 'border-slate-200 hover:border-indigo-300 bg-white'
                }`}
              >
                <span className="text-6xl mb-2">{opt.emoji}</span>
                <span className="text-base font-black text-slate-800">{opt.label}</span>
                <span className="text-xs text-slate-500 font-medium">{opt.description}</span>
              </button>
            ))}
          </div>
        )}

        {/* ---------------- TYPE 3: STORY-BASED WITH CHOICES ---------------- */}
        {activity.type === 'story_choice' && (
          <div className="space-y-4">
            {activity.story && (
              <div className="p-5 bg-sky-50 rounded-2xl border border-sky-200 text-sky-950 text-base sm:text-lg font-bold leading-relaxed">
                📖 "{activity.story}"
              </div>
            )}
            <div className="space-y-3">
              {activity.options?.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    if (isSubmitted) return;
                    sounds.playClick();
                    setSelectedOption(opt.id);
                    speech.speak(opt.text || '');
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all flex items-center justify-between ${
                    selectedOption === opt.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span>{opt.text}</span>
                  {selectedOption === opt.id && <Check className="w-5 h-5 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TYPE 4: MATCH THE PAIRS ---------------- */}
        {activity.type === 'match_pairs' && activity.pairs && (
          <div className="space-y-4 pt-2">
            <p className="text-xs font-bold text-slate-500 m-0">
              Tap a letter on the left, then tap its matching friend on the right!
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                {activity.pairs.map((p) => {
                  const isMatched = !!matchedPairs[p.id];
                  const isSelected = selectedLeft === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedLeft(p.id);
                        speech.speak(p.left);
                      }}
                      className={`w-full p-4 rounded-2xl border-2 text-left font-black text-sm sm:text-base transition-all flex items-center justify-between ${
                        isMatched
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <span>{p.left}</span>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {activity.pairs.map((p) => {
                  const isMatched = Object.values(matchedPairs).includes(p.right);
                  return (
                    <button
                      key={p.right}
                      onClick={() => {
                        if (selectedLeft) {
                          sounds.playClick();
                          setMatchedPairs(prev => ({
                            ...prev,
                            [selectedLeft]: p.right
                          }));
                          setSelectedLeft(null);
                        } else {
                          speech.speak(p.right);
                        }
                      }}
                      className={`w-full p-4 rounded-2xl border-2 text-left font-black text-sm sm:text-base transition-all flex items-center justify-between ${
                        isMatched
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <span>{p.right}</span>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TYPE 5: DRAG AND DROP / CATEGORY SORTING ---------------- */}
        {activity.type === 'drag_drop' && activity.categories && activity.items && (
          <div className="space-y-4 pt-2">
            <p className="text-xs font-bold text-slate-500 m-0">
              Tap an animal, then tap the basket where it belongs!
            </p>

            {/* Unsorted Items */}
            <div className="flex flex-wrap gap-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              {activity.items.map((item) => {
                const assigned = categorizedItems[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedOption(item.id);
                      speech.speak(item.text);
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                      assigned
                        ? 'opacity-40 bg-slate-200 border-slate-300 line-through'
                        : selectedOption === item.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                        : 'bg-white text-slate-800 border-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {item.text}
                  </button>
                );
              })}
            </div>

            {/* Target Category Baskets */}
            <div className="grid grid-cols-2 gap-4">
              {activity.categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    if (selectedOption) {
                      sounds.playClick();
                      setCategorizedItems(prev => ({
                        ...prev,
                        [selectedOption]: cat.id
                      }));
                      setSelectedOption(null);
                    }
                  }}
                  className="p-5 rounded-3xl border-3 border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer min-h-[140px] transition-all flex flex-col justify-between"
                >
                  <h3 className="font-black text-slate-900 text-sm sm:text-base m-0 mb-2">
                    {cat.title}
                  </h3>
                  <div className="space-y-1.5">
                    {activity.items
                      ?.filter(item => categorizedItems[item.id] === cat.id)
                      .map(item => (
                        <div key={item.id} className="text-xs font-extrabold bg-white p-2 rounded-xl border border-indigo-200 text-indigo-900 shadow-2xs">
                          {item.text}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TYPE 6: MEMORY CARD MATCH ---------------- */}
        {activity.type === 'memory_game' && activity.cards && (
          <div className="grid grid-cols-3 gap-3 pt-2">
            {activity.cards.map((card, idx) => {
              const isFlipped = flippedCards.includes(idx) || solvedCards.includes(card.pairKey);
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    if (isFlipped || flippedCards.length === 2) return;
                    sounds.playClick();
                    const newFlipped = [...flippedCards, idx];
                    setFlippedCards(newFlipped);

                    if (newFlipped.length === 2) {
                      const firstCard = activity.cards![newFlipped[0]];
                      const secondCard = activity.cards![newFlipped[1]];
                      if (firstCard.pairKey === secondCard.pairKey) {
                        sounds.playSuccess();
                        setSolvedCards(prev => [...prev, firstCard.pairKey]);
                        setFlippedCards([]);
                      } else {
                        setTimeout(() => {
                          setFlippedCards([]);
                        }, 900);
                      }
                    }
                  }}
                  className={`h-24 sm:h-28 rounded-2xl border-2 font-black text-base sm:text-lg flex items-center justify-center transition-all ${
                    isFlipped
                      ? 'bg-amber-100 border-amber-400 text-amber-900 scale-102'
                      : 'bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isFlipped ? card.display : '🌟'}
                </button>
              );
            })}
          </div>
        )}

        {/* Submit Button */}
        {!isSubmitted && (
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSubmitAnswer}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-base rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Submit Answer! ⭐</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Result & Celebration Modal / Card */}
        {isSubmitted && submissionResult && (
          <div className={`p-6 rounded-3xl border-2 space-y-4 animate-in fade-in duration-300 ${
            submissionResult.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{submissionResult.isCorrect ? '🎉' : '💡'}</span>
              <div>
                <h3 className="text-xl font-black m-0">
                  {submissionResult.isCorrect ? 'Superstar Answer!' : 'Good Try! Here is How to Solve It:'}
                </h3>
                <p className="text-xs sm:text-sm font-semibold m-0 mt-0.5">
                  {submissionResult.explanation}
                </p>
              </div>
            </div>

            {/* XP & Rewards Gained */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="px-3.5 py-1.5 bg-white/80 rounded-full font-black text-xs text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>+{submissionResult.xpEarned} XP Awarded</span>
              </div>

              {submissionResult.leveledUp && (
                <div className="px-3.5 py-1.5 bg-amber-400 text-slate-950 rounded-full font-black text-xs flex items-center gap-1.5 animate-bounce">
                  <Trophy className="w-4 h-4" />
                  <span>LEVEL UP! Now Level {submissionResult.level}!</span>
                </div>
              )}

              {submissionResult.unlockedBadge && (
                <div className="px-3.5 py-1.5 bg-purple-600 text-white rounded-full font-black text-xs flex items-center gap-1.5">
                  <span>🏆 New Badge: {submissionResult.unlockedBadge.title}</span>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="pt-4 border-t border-emerald-200/60 flex items-center justify-between">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsSubmitted(false);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigate('child-home');
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Mascot Companion */}
      <div className="flex justify-center pt-2">
        <MascotBuddy
          mood={isSubmitted && submissionResult?.isCorrect ? 'celebrating' : 'guiding'}
          speechBubble={submissionResult ? submissionResult.adaptiveFeedback : "I'm cheering for you! Tap what feels right!"}
          size="sm"
        />
      </div>

    </div>
  );
};
