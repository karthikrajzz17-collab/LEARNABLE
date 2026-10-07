import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Gamepad2, 
  Brain, 
  ArrowRight, 
  Volume2, 
  Users, 
  Info, 
  Eye, 
  X,
  CheckCircle2,
  Heart,
  BookOpen
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { speech } from '../utils/speech';
import { MascotBuddy } from '../components/MascotBuddy';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onQuickDemo: (role: 'child' | 'administrator') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onQuickDemo }) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);

  const handleSpeakHero = () => {
    sounds.playClick();
    speech.speak("Welcome to LearnAble! An inclusive, AI-powered learning platform designed with love for children of all abilities.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50/40 text-slate-800">
      
      {/* Top Secondary Nav for Public Pages */}
      <div className="border-b border-slate-200/60 bg-white/60 backdrop-blur-xs py-2 px-4 sm:px-8 text-xs font-bold text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sounds.playClick();
              setShowAboutModal(true);
            }}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>About LearnAble</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setShowAccessibilityModal(true);
            }}
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span>Accessibility Information</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          WCAG 2.1 AA Compliant • Safe AI Platform
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Soft background glow circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-purple-200/40 via-sky-200/50 to-pink-200/30 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-indigo-100 shadow-xs mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-indigo-900 tracking-wide">
              AI-Powered Inclusive Learning Platform • Version 1.0
            </span>
          </div>

          {/* Heading */}
          <div className="relative inline-block mb-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
              Learning that <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                understands you.
              </span>
            </h1>
            <button
              onClick={handleSpeakHero}
              title="Listen to introduction"
              className="absolute -top-2 -right-10 p-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-transform active:scale-95"
              aria-label="Listen to introductory text"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 font-medium leading-relaxed mb-8">
            An inclusive, joyful platform that adapts learning experiences to individual children with special learning needs through safe AI, gamification, and universal accessibility.
          </p>

          {/* Mascot Preview */}
          <div className="mb-10 flex justify-center">
            <MascotBuddy
              mood="happy"
              speechBubble="Hi friend! I'm LearnAble Buddy! Ready to learn with games, stories, and zero stress? 🌟"
              size="lg"
            />
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Student Portal Button */}
            <button
              onClick={() => {
                sounds.playSuccess();
                onQuickDemo('child');
              }}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Start Learning as Student 🦊</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => {
                sounds.playClick();
                onQuickDemo('administrator');
              }}
              className="flex items-center gap-2.5 px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-indigo-300" />
              <span>Administrator Portal 📊</span>
            </button>
          </div>

          <div className="mt-4 text-xs font-semibold text-slate-400">
            Certified Inclusive Education • WCAG 2.1 AA Compliant • Safe AI Scaffolding
          </div>
        </div>
      </section>

      {/* 4 Pillars of Inclusive Learning */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Designed for Every Unique Mind</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm sm:text-base">
              Personalized profiles tailored to specific neurodivergent and learning needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Dyslexia Card */}
            <div className="p-6 rounded-3xl bg-sky-50/70 border border-sky-100 hover:border-sky-300 transition-all shadow-xs">
              <div className="text-3xl mb-3">📖</div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Dyslexia Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Readable typography (Lexend), increased letter & line spacing, text-to-speech audio for every prompt, and reduced visual density.
              </p>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-100/80 px-2.5 py-1 rounded-full">
                Phonics & Audio-First
              </span>
            </div>

            {/* ADHD Card */}
            <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-100 hover:border-amber-300 transition-all shadow-xs">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-black text-slate-900 mb-1">ADHD Focus Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Chunked 3-minute micro-lessons, interactive ADHD reading ruler, clear visual milestone checklists, and immediate star feedback.
              </p>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full">
                Zero Clutter & Quick Rewards
              </span>
            </div>

            {/* Autism Card */}
            <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-100 hover:border-emerald-300 transition-all shadow-xs">
              <div className="text-3xl mb-3">🌿</div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Autism & Sensory Friendly</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Predictable visual schedule, calming muted earth tones (Calm Mode), consistent layouts, and no jarring transitions or sounds.
              </p>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                Sensory Soothing
              </span>
            </div>

            {/* Paced Learning */}
            <div className="p-6 rounded-3xl bg-purple-50/70 border border-purple-100 hover:border-purple-300 transition-all shadow-xs">
              <div className="text-3xl mb-3">🐢</div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Paced Practice</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Adaptive difficulty engine with step-by-step scaffolding, unlimited friendly hints from Buddy, and repetition without penalties.
              </p>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100/80 px-2.5 py-1 rounded-full">
                Confidence Building
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            Everything needed for inclusive success
          </h2>
          <p className="text-slate-500 font-medium">
            Bridging joyful play for children with professional intelligence for educators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
              <Brain className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Safe AI Companion</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              "LearnAble Buddy" guides children with gentle hints instead of blurting out answers, celebrates effort, and never asks for personal data.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Gamified Mini-Games</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Multiple choice, match the pairs, size sorting, emotional expressions, and cosmic memory flip games that keep learning joyful!
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Educator Analytics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Deep analytics for teachers and administrators with AI insights highlighting students needing assistance and difficult concept heatmaps.
            </p>
          </div>

        </div>
      </section>

      {/* Role Selection Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to experience LearnAble?</h2>
          <p className="text-indigo-200 max-w-xl mx-auto mb-8 font-medium text-sm sm:text-base">
            Choose your learning portal below to enter the LearnAble platform.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('login-child')}
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-base"
            >
              Child Login Screen 🎒
            </button>
            <button
              onClick={() => onNavigate('login-admin')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-base"
            >
              Administrator Login 🔐
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-950 text-slate-400 text-center text-xs">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300 font-bold">
            <button onClick={() => setShowAboutModal(true)} className="hover:text-amber-400 transition-colors">
              About LearnAble
            </button>
            <button onClick={() => setShowAccessibilityModal(true)} className="hover:text-amber-400 transition-colors">
              Accessibility Information
            </button>
            <button onClick={() => onNavigate('login-child')} className="hover:text-amber-400 transition-colors">
              Child Portal
            </button>
            <button onClick={() => onNavigate('login-admin')} className="hover:text-amber-400 transition-colors">
              Administrator Portal
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2 font-bold text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>LearnAble • AI-Powered Inclusive Learning Platform</span>
          </div>
          <p className="text-slate-500 m-0">
            Built with Child-First Design • Universal Accessibility • Safe AI Tutor
          </p>
        </div>
      </footer>

      {/* ================= MODAL: ABOUT LEARNABLE ================= */}
      {showAboutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAboutModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 m-0">About LearnAble</h3>
                  <p className="text-xs text-slate-500 m-0">Inclusive Education Powered by Safe AI</p>
                </div>
              </div>
              <button onClick={() => setShowAboutModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
              <p>
                <strong>LearnAble</strong> is built on the belief that traditional educational technology often leaves neurodivergent learners behind with overwhelming visual noise, rigid pacing, and one-size-fits-all assessments.
              </p>
              <p>
                Our core principles center on <strong>child-first empathy</strong>, <strong>accessibility by default</strong>, and <strong>safe generative AI assistance</strong> that never penalizes curiosity or replaces human educators.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <span className="font-black text-indigo-900 text-xs block mb-1">Safe AI Interaction</span>
                  <p className="text-xs text-slate-600 m-0">Buddy provides clues and guided hints, never direct answers or judgment.</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                  <span className="font-black text-amber-900 text-xs block mb-1">Multi-Sensory Learning</span>
                  <p className="text-xs text-slate-600 m-0">Speech synthesis, tactile card sorting, and interactive memory challenges.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ACCESSIBILITY INFORMATION ================= */}
      {showAccessibilityModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAccessibilityModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 m-0">Accessibility Information</h3>
                  <p className="text-xs text-slate-500 m-0">Universal Design & WCAG 2.1 AA Standards</p>
                </div>
              </div>
              <button onClick={() => setShowAccessibilityModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              <p>
                LearnAble adheres to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> across all interfaces:
              </p>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">OpenDyslexic & Lexend Typography:</strong>
                    Enhanced character differentiation, extra kerning, and increased line height to reduce visual crowding.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">ADHD Reading Focus Ruler:</strong>
                    A cursor-following highlight strip to anchor attention on a single line of text at a time.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">High Contrast & Calm Sensory Mode:</strong>
                    High-contrast yellow-on-black for low vision, plus a Calm Sensory Mode that mutes bright saturations and disables transitions.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Complete Speech Integration:</strong>
                    Every learning prompt, slide, and AI Buddy response can be read out loud using browser speech synthesis.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowAccessibilityModal(false)}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
