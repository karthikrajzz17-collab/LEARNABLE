import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2, Award, Sparkles, BookOpen, Brain } from 'lucide-react';
import { sounds } from '../utils/sound';

interface IepReportModalProps {
  child: any;
  onClose: () => void;
}

export const IepReportModal: React.FC<IepReportModalProps> = ({ child, onClose }) => {
  if (!child) return null;

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 max-w-3xl w-full shadow-2xl border border-slate-200 my-8 space-y-6 animate-in zoom-in-95 duration-200 print:p-0 print:m-0 print:shadow-none print:border-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Actions (Hidden on Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-full uppercase tracking-wider">
              IEP Special Education Telemetry
            </span>
            <span className="text-xs text-slate-400 font-semibold">Report Generated: {currentDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= FORMAL IEP DOCUMENT CONTENT ================= */}
        <div className="space-y-6">
          
          {/* Document Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 font-black text-xl tracking-tight">
                <Sparkles className="w-6 h-6" />
                <span>LearnAble Inclusive Education Platform</span>
              </div>
              <h1 className="text-2xl font-black text-slate-950 m-0 mt-1">
                Individualized Education Program (IEP) Progress Summary
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Specialized Academic & Assistive Technology Performance Evaluation
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 block">DOC ID: IEP-2026-{child.id.toUpperCase()}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Current Status: Active Review
              </span>
            </div>
          </div>

          {/* Student Demographics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block font-bold">Student Name</span>
              <span className="font-black text-slate-900 text-sm">{child.displayName}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold">Age Group</span>
              <span className="font-bold text-slate-800">{child.ageGroup}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold">Special Ed Profile</span>
              <span className="font-black text-indigo-700 uppercase">{child.accessibilityProfile} Mode</span>
            </div>
            <div>
              <span className="text-slate-500 block font-bold">Mastery Level</span>
              <span className="font-bold text-slate-800">{child.learningLevel} (Level {child.level})</span>
            </div>
          </div>

          {/* Section 1: Active Assistive Accommodations */}
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Section 1: Documented Assistive Accommodations</span>
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">Typography & Layout:</span>
                <span className="text-slate-600">Lexend high-legibility character set with increased line spacing</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">Audio Scaffolding:</span>
                <span className="text-slate-600">Web Speech text-to-speech for all questions and guided hints</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">Sensory Pacing:</span>
                <span className="text-slate-600">Low-friction interface, calm sensory colors, zero timed penalties</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">Pedagogical Guardrails:</span>
                <span className="text-slate-600">Buddy AI guided prompts with positive reinforcement only</span>
              </div>
            </div>
          </div>

          {/* Section 2: Subject Mastery & Progress Metrics */}
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Section 2: Academic Goals & Objective Mastery</span>
            </h2>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Reading & Phonics (Goal 1.A)</span>
                  <span className="text-slate-500">Target: Recognize rhyming vowel pairs and initial consonants</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-700 text-sm">95% Mastery</span>
                  <span className="text-[10px] text-emerald-600 block">Goal Achieved ⭐</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Numeracy & Grouping (Goal 2.B)</span>
                  <span className="text-slate-500">Target: Compare animal groups of 1–10 and size classification</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-indigo-700 text-sm">90% Mastery</span>
                  <span className="text-[10px] text-indigo-600 block">Approaching Goal</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Social-Emotional Awareness (Goal 3.C)</span>
                  <span className="text-slate-500">Target: Identify facial emotions & practice calming breathing</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-purple-700 text-sm">85% Mastery</span>
                  <span className="text-[10px] text-purple-600 block">Steady Progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: AI Pedagogical Recommendations */}
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span>Section 3: AI Personalized Recommendations for Next IEP Review</span>
            </h2>
            <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 text-xs text-indigo-950 space-y-1.5 font-medium">
              <p className="m-0">
                • <strong>Pacing Recommendation:</strong> Student demonstrates strong engagement during 8–10 minute learning bursts with a verified {child.streak}-day streak. Continue short sessions with instant star rewards.
              </p>
              <p className="m-0">
                • <strong>Reading Continuation:</strong> Student has mastered short vowels. Transition to consonant blend matching while preserving multi-sensory audio synthesis.
              </p>
              <p className="m-0">
                • <strong>Sensory Accommodation:</strong> Continue utilizing Calm Mode and the Calm Down Corner when transitioning between subjects to maintain emotional equilibrium.
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-500">
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                Ms. Sarah Jenkins, M.Ed.
              </div>
              <span>Special Education Interventionist</span>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                LearnAble AI Pedagogical Engine
              </div>
              <span>Adaptive Telemetry System</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
