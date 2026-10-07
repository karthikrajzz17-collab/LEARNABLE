import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Star, 
  Trophy, 
  MessageSquare, 
  Compass, 
  Home, 
  Gamepad2, 
  BarChart2, 
  LogOut, 
  Shield 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sounds } from '../utils/sound';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { role, child, logout, switchRole } = useAuth();

  const handleNav = (view: string) => {
    sounds.playClick();
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav(role === 'administrator' ? 'admin-dashboard' : (role === 'child' ? 'child-home' : 'landing'))}
              className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:rotate-3 transition-transform">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                  LearnAble
                </span>
                <span className="block text-[10px] sm:text-xs font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                  {role === 'administrator' ? 'Admin Portal' : 'Inclusive Learning'}
                </span>
              </div>
            </button>
          </div>

          {/* Child Navigation Links */}
          {role === 'child' && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => handleNav('child-home')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'child-home'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-white/60'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleNav('child-path')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'child-path'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-white/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Journey</span>
              </button>

              <button
                onClick={() => handleNav('child-activity')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'child-activity'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-white/60'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Activities</span>
              </button>

              <button
                onClick={() => handleNav('child-progress')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'child-progress'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-white/60'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Progress</span>
              </button>

              <button
                onClick={() => handleNav('child-tutor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'child-tutor'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-600 hover:text-amber-600 hover:bg-white/60'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AI Buddy</span>
              </button>

              <button
                onClick={() => handleNav('child-achievements')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'child-achievements'
                    ? 'bg-white text-purple-600 shadow-xs'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-white/60'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Badges</span>
              </button>

              <button
                onClick={() => handleNav('child-calm')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'child-calm'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-white/60'
                }`}
              >
                <span>🌿</span>
                <span>Calm Corner</span>
              </button>
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {role === 'child' && child && (
              <>
                {/* Streak Badge */}
                <div 
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-black shadow-2xs"
                  title="Daily Adventure Streak"
                >
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
                  <span>{child.streak} Days</span>
                </div>

                {/* Level & XP Pill */}
                <div 
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900 border border-indigo-200 rounded-full text-xs font-black shadow-2xs"
                  title="Total Experience Points"
                >
                  <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded-full text-[10px]">
                    Lvl {child.level}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>{child.xp} XP</span>
                  </div>
                </div>

                {/* Child Avatar & Profile Button */}
                <button
                  onClick={() => handleNav('child-profile')}
                  className="flex items-center gap-2 p-1.5 pl-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all"
                  title="View Child Profile & Preferences"
                >
                  <span className="text-xl">{child.avatar || '🦊'}</span>
                  <span className="hidden sm:inline text-xs font-bold text-slate-700">{child.displayName.split(' ')[0]}</span>
                </button>
              </>
            )}

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5">
              {role === 'child' ? (
                <button
                  onClick={() => {
                    sounds.playClick();
                    switchRole('administrator');
                    onNavigate('admin-dashboard');
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
                  title="Switch to Admin Dashboard"
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Admin Mode</span>
                </button>
              ) : role === 'administrator' ? (
                <button
                  onClick={() => {
                    sounds.playClick();
                    switchRole('child');
                    onNavigate('child-home');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
                  title="Switch to Child Interactive View"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Child Mode</span>
                </button>
              ) : null}

              {/* Logout button */}
              {role ? (
                <button
                  onClick={() => {
                    sounds.playClick();
                    logout();
                    onNavigate('landing');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNav('login-child')}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md hover:scale-105 transition-all"
                  >
                    Child Login 🚀
                  </button>
                  <button
                    onClick={() => handleNav('login-admin')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all"
                  >
                    Admin Portal
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Sub-Navigation for Child */}
        {role === 'child' && (
          <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-100 text-xs">
            <button
              onClick={() => handleNav('child-home')}
              className={`flex flex-col items-center gap-1 font-bold ${currentView === 'child-home' ? 'text-indigo-600' : 'text-slate-500'}`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => handleNav('child-path')}
              className={`flex flex-col items-center gap-1 font-bold ${currentView === 'child-path' ? 'text-indigo-600' : 'text-slate-500'}`}
            >
              <Compass className="w-4 h-4" />
              <span>Journey</span>
            </button>
            <button
              onClick={() => handleNav('child-activity')}
              className={`flex flex-col items-center gap-1 font-bold ${currentView === 'child-activity' ? 'text-indigo-600' : 'text-slate-500'}`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Play</span>
            </button>
            <button
              onClick={() => handleNav('child-progress')}
              className={`flex flex-col items-center gap-1 font-bold ${currentView === 'child-progress' ? 'text-indigo-600' : 'text-slate-500'}`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Progress</span>
            </button>
            <button
              onClick={() => handleNav('child-tutor')}
              className={`flex flex-col items-center gap-1 font-bold ${currentView === 'child-tutor' ? 'text-amber-600' : 'text-slate-500'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Buddy</span>
            </button>
            <button
              onClick={() => handleNav('child-achievements')}
              className={`flex flex-col items-center gap-1 font-bold ${currentView === 'child-achievements' ? 'text-purple-600' : 'text-slate-500'}`}
            >
              <Trophy className="w-4 h-4" />
              <span>Badges</span>
            </button>
            <button
              onClick={() => handleNav('child-calm')}
              className={`flex flex-col items-center gap-1 font-bold ${currentView === 'child-calm' ? 'text-emerald-600' : 'text-slate-500'}`}
            >
              <span>🌿</span>
              <span>Calm</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
