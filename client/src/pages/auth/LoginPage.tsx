import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Sparkles, Volume2, ArrowLeft, ArrowRight, Lock, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sounds } from '../../utils/sound';
import { speech } from '../../utils/speech';
import { MascotBuddy } from '../../components/MascotBuddy';

interface LoginPageProps {
  initialRole?: 'child' | 'administrator';
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialRole = 'child', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'child' | 'administrator'>(initialRole);
  
  // Child Login State
  const [selectedChildUsername, setSelectedChildUsername] = useState('leo');
  
  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('admin@learnable.edu');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginAdmin, loginChild } = useAuth();

  const handleSpeakInstruction = () => {
    sounds.playClick();
    if (activeTab === 'child') {
      speech.speak("Welcome to LearnAble! Pick your friendly animal avatar or click Start My Adventure to begin playing!");
    } else {
      speech.speak("Welcome to the LearnAble Administrator Portal. Enter your credentials to sign in.");
    }
  };

  const handleChildSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sounds.playClick();
    setErrorMsg('');
    setLoading(true);

    const res = await loginChild(selectedChildUsername, false);
    setLoading(false);
    if (res.success) {
      sounds.playSuccess();
      onNavigate('child-home');
    } else {
      sounds.playRetry();
      setErrorMsg(res.message || 'Could not log in. Please select your student profile.');
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setErrorMsg('');
    setLoading(true);

    const res = await loginAdmin(adminEmail, adminPassword, false);
    setLoading(false);
    if (res.success) {
      sounds.playSuccess();
      onNavigate('admin-dashboard');
    } else {
      sounds.playRetry();
      setErrorMsg(res.message || 'Invalid administrator credentials.');
    }
  };

  const handleOneClickDemo = async (role: 'child' | 'administrator') => {
    sounds.playSuccess();
    setLoading(true);
    if (role === 'child') {
      await loginChild('leo', true);
      onNavigate('child-home');
    } else {
      await loginAdmin('admin@learnable.edu', '', true);
      onNavigate('admin-dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Top back link */}
      <div className="max-w-md w-full mx-auto mb-4 flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('landing');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={handleSpeakInstruction}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 transition-transform active:scale-95"
          title="Audio Assistance"
          aria-label="Listen to audio instructions"
        >
          <Volume2 className="w-4 h-4" />
          <span>Read Aloud</span>
        </button>
      </div>

      <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        
        {/* Header */}
        <div className="pt-8 pb-6 px-6 sm:px-8 text-center bg-gradient-to-b from-indigo-50/50 to-transparent">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome to LearnAble
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Learning that understands you.
          </p>

          {/* Role Segment Toggle */}
          <div className="mt-6 p-1.5 bg-slate-100 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('child');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'child'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Child Login</span>
              <span>🎒</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('administrator');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'administrator'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Administrator</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 pt-2">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl text-center">
              {errorMsg}
            </div>
          )}

          {/* CHILD LOGIN FORM */}
          {activeTab === 'child' && (
            <div>
              <div className="mb-5 flex justify-center">
                <MascotBuddy
                  mood="happy"
                  speechBubble="Click your friendly avatar or tap Start Adventure below!"
                  size="sm"
                  showAudioButton={false}
                />
              </div>

              {/* Avatar Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-600 mb-2 text-center uppercase tracking-wider">
                  Pick Your Learning Buddy:
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { username: 'leo', name: 'Leo', avatar: '🦊', tag: 'Dyslexia' },
                    { username: 'maya', name: 'Maya', avatar: '🚀', tag: 'ADHD' },
                    { username: 'samir', name: 'Samir', avatar: '🦉', tag: 'Autism' },
                    { username: 'chloe', name: 'Chloe', avatar: '🐬', tag: 'Paced' }
                  ].map((ch) => (
                    <button
                      key={ch.username}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSelectedChildUsername(ch.username);
                      }}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                        selectedChildUsername === ch.username
                          ? 'border-amber-400 bg-amber-50/80 scale-105 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-3xl">{ch.avatar}</span>
                      <span className="text-xs font-extrabold text-slate-800">{ch.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{ch.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Child Login Button */}
              <button
                type="button"
                onClick={() => handleChildSubmit()}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-base rounded-2xl shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Start My Adventure!</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Quick Sign-In Child */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => handleOneClickDemo('child')}
                  className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 cursor-pointer"
                >
                  ⚡ Quick Sign-In (Leo Miller)
                </button>
              </div>
            </div>
          )}

          {/* ADMINISTRATOR LOGIN FORM */}
          {activeTab === 'administrator' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Admin Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@learnable.edu"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setShowPassword(!showPassword);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-md hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => handleOneClickDemo('administrator')}
                  className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 cursor-pointer"
                >
                  ⚡ Quick Sign-In (School Administrator)
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
