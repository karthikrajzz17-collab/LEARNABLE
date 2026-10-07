import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Brain, 
  Sliders, 
  Settings, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  RotateCcw,
  Eye,
  X,
  Gamepad2,
  SlidersHorizontal,
  Play,
  FileText
} from 'lucide-react';
import { sounds } from '../../utils/sound';
import { IepReportModal } from '../../components/IepReportModal';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'children' | 'teachers' | 'content' | 'activities' | 'analytics' | 'insights' | 'accessibility' | 'settings'>('overview');
  
  // Data states
  const [stats, setStats] = useState<any>(null);
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [lessonsList, setLessonsList] = useState<any[]>([]);
  const [activitiesList, setActivitiesList] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [insightsData, setInsightsData] = useState<any>(null);
  const [settingsData, setSettingsData] = useState<any>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [profileFilter, setProfileFilter] = useState('all');
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');

  // Modals & Forms
  const [selectedChildDetail, setSelectedChildDetail] = useState<any | null>(null);
  const [selectedChildForIep, setSelectedChildForIep] = useState<any | null>(null);
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonSubject, setNewLessonSubject] = useState('Math');
  const [newLessonDifficulty, setNewLessonDifficulty] = useState('Easy');
  const [newLessonDesc, setNewLessonDesc] = useState('');

  // Activity Create Modal
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [newActLessonId, setNewActLessonId] = useState('');
  const [newActType, setNewActType] = useState('multiple_choice');
  const [newActQuestion, setNewActQuestion] = useState('');
  const [newActOptionA, setNewActOptionA] = useState('');
  const [newActOptionB, setNewActOptionB] = useState('');
  const [newActHint, setNewActHint] = useState('');
  const [newActXp, setNewActXp] = useState(40);

  // Fetch initial admin data
  const fetchAllAdminData = () => {
    Promise.all([
      fetch('/api/admin/dashboard').then(r => r.json()),
      fetch('/api/admin/children').then(r => r.json()),
      fetch('/api/admin/teachers').then(r => r.json()),
      fetch('/api/lessons').then(r => r.json()),
      fetch('/api/activities').then(r => r.json()),
      fetch('/api/admin/analytics').then(r => r.json()),
      fetch('/api/admin/insights').then(r => r.json()),
      fetch('/api/admin/settings').then(r => r.json())
    ]).then(([dStats, dChildren, dTeachers, dLessons, dActivities, dAnalytics, dInsights, dSettings]) => {
      if (dStats.success) setStats(dStats.stats);
      if (dChildren.success) setChildrenList(dChildren.children);
      if (dTeachers.success) setTeachersList(dTeachers.teachers);
      if (dLessons.success) {
        setLessonsList(dLessons.lessons);
        if (dLessons.lessons.length > 0 && !newActLessonId) {
          setNewActLessonId(dLessons.lessons[0].id);
        }
      }
      if (dActivities.success) setActivitiesList(dActivities.activities);
      if (dAnalytics.success) setAnalyticsData(dAnalytics);
      if (dInsights.success) setInsightsData(dInsights);
      if (dSettings.success) setSettingsData(dSettings.settings);
    }).catch(err => {
      console.warn("Failed fetching admin data:", err);
    });
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  // Handlers for Content CRUD
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (!newLessonTitle.trim()) return;

    try {
      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLessonTitle,
          subject: newLessonSubject,
          difficulty: newLessonDifficulty,
          description: newLessonDesc || 'Interactive learning module',
          icon: newLessonSubject === 'Math' ? '🔢' : '📖',
          estimatedMinutes: 8
        })
      });
      if (res.ok) {
        sounds.playSuccess();
        setShowCreateLessonModal(false);
        setNewLessonTitle('');
        setNewLessonDesc('');
        fetchAllAdminData();
      }
    } catch (err) {
      console.warn("Failed creating lesson:", err);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this lesson?")) return;
    sounds.playClick();
    try {
      const res = await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAllAdminData();
      }
    } catch (err) {
      console.warn("Delete failed:", err);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (!newActQuestion.trim()) return;

    try {
      const res = await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: newActLessonId || lessonsList[0]?.id,
          type: newActType,
          title: 'Custom Challenge',
          question: newActQuestion,
          options: [
            { id: 'opt-1', text: newActOptionA || 'Correct Choice ⭐', isCorrect: true },
            { id: 'opt-2', text: newActOptionB || 'Alternative Choice', isCorrect: false }
          ],
          hint: newActHint || 'Think carefully and check each option!',
          explanation: 'Fantastic job solving this challenge!',
          xpReward: Number(newActXp) || 40
        })
      });
      if (res.ok) {
        sounds.playSuccess();
        setShowCreateActivityModal(false);
        setNewActQuestion('');
        setNewActOptionA('');
        setNewActOptionB('');
        fetchAllAdminData();
      }
    } catch (err) {
      console.warn("Failed creating activity:", err);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm("Reset database to standard platform baseline?")) return;
    sounds.playClick();
    await fetch('/api/admin/reset', { method: 'POST' });
    fetchAllAdminData();
    sounds.playSuccess();
  };

  // Filtered children
  const filteredChildren = childrenList.filter(c => {
    const matchesSearch = c.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProfile = profileFilter === 'all' || c.accessibilityProfile === profileFilter;
    return matchesSearch && matchesProfile;
  });

  // Filtered activities
  const filteredActivities = activitiesList.filter(a => {
    return activityTypeFilter === 'all' || a.type === activityTypeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-white text-base tracking-tight">LearnAble</div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Admin Control</div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'children', label: 'Children Roster', icon: Users },
              { id: 'teachers', label: 'Teachers', icon: ShieldCheck },
              { id: 'content', label: 'Learning Content', icon: BookOpen },
              { id: 'activities', label: 'Activity Manager', icon: Gamepad2 },
              { id: 'analytics', label: 'Deep Analytics', icon: TrendingUp },
              { id: 'insights', label: 'AI Insights', icon: Brain },
              { id: 'accessibility', label: 'Accessibility Admin', icon: SlidersHorizontal },
              { id: 'settings', label: 'System Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800/80">
          <button
            onClick={handleResetDatabase}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline Data</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* ================= VIEW 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-6xl mx-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white m-0">
                Platform Intelligence Overview
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Real-time accessibility usage, student progression, and system health
              </p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Enrolled</span>
                <span className="text-3xl font-black text-white">{stats?.totalChildren || 4}</span>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1">100% Active this week</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Completed Lessons</span>
                <span className="text-3xl font-black text-amber-400">{stats?.completedLessons || 3}</span>
                <div className="text-[11px] text-slate-400 font-semibold mt-1">Across 5 subjects</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Average Accuracy</span>
                <span className="text-3xl font-black text-indigo-400">{stats?.averageAccuracy || 87}%</span>
                <div className="text-[11px] text-indigo-300 font-semibold mt-1">+4.2% since adaptive hints</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Engagement Rate</span>
                <span className="text-3xl font-black text-emerald-400">{stats?.learningEngagement || '94.2%'}</span>
                <div className="text-[11px] text-emerald-300 font-semibold mt-1">Avg 24m session time</div>
              </div>
            </div>

            {/* Quick Insights Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border border-indigo-800/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-400 text-slate-950 rounded-2xl font-black text-xl">
                  💡
                </div>
                <div>
                  <h3 className="text-base font-black text-white m-0">AI Adaptive Learning Report</h3>
                  <p className="text-xs text-indigo-200 m-0 mt-0.5">
                    Dyslexia audio-first assistance increased phonics quiz completion by 48% across enrolled students.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('insights')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex-shrink-0"
              >
                View Interventions
              </button>
            </div>

            {/* Quick Children Table Preview */}
            <div className="bg-slate-800/60 rounded-3xl border border-slate-700 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white m-0">Active Students & Inclusion Profiles</h3>
                <button
                  onClick={() => setActiveTab('children')}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  View All Students →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="pb-3 font-bold">Child</th>
                      <th className="pb-3 font-bold">Profile</th>
                      <th className="pb-3 font-bold">Learning Level</th>
                      <th className="pb-3 font-bold">Streak</th>
                      <th className="pb-3 font-bold">Avg Accuracy</th>
                      <th className="pb-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {childrenList.slice(0, 4).map((child) => (
                      <tr key={child.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 flex items-center gap-2">
                          <span className="text-lg">{child.avatar}</span>
                          <span className="font-extrabold text-white">{child.displayName}</span>
                        </td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full uppercase font-bold text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                            {child.accessibilityProfile}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300 font-medium">{child.learningLevel}</td>
                        <td className="py-3 text-amber-400 font-bold">{child.streak} Days 🔥</td>
                        <td className="py-3 text-slate-200 font-bold">{child.averageAccuracy || 88}%</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            child.supportFlag === 'Needs Assistance'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {child.supportFlag || 'On Track'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= VIEW 2: CHILDREN ROSTER ================= */}
        {activeTab === 'children' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white m-0">Children Directory</h1>
                <p className="text-xs text-slate-400 mt-1">Manage individual learning profiles, accommodations, and progress</p>
              </div>

              {/* Search & Profile Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={profileFilter}
                  onChange={(e) => setProfileFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Profiles</option>
                  <option value="dyslexia">Dyslexia</option>
                  <option value="adhd">ADHD</option>
                  <option value="autism">Autism</option>
                  <option value="slow_learning">Slow Learning</option>
                </select>
              </div>
            </div>

            {/* Children Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChildren.map((child) => (
                <div
                  key={child.id}
                  className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl">
                          {child.avatar}
                        </div>
                        <div>
                          <h3 className="text-base font-black text-white m-0">{child.displayName}</h3>
                          <span className="text-[11px] text-slate-400">{child.ageGroup} • Level {child.level}</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        child.supportFlag === 'Needs Assistance'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {child.supportFlag || 'On Track'}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Profile</span>
                        <span className="text-xs font-black text-indigo-400 capitalize">{child.accessibilityProfile}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Total XP</span>
                        <span className="text-xs font-black text-amber-400">{child.xp} ⭐</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Accuracy</span>
                        <span className="text-xs font-black text-emerald-400">{child.averageAccuracy}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                    <span className="text-slate-400 text-[11px]">Streak: {child.streak} days 🔥</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setSelectedChildForIep(child);
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-700/60 font-bold rounded-xl transition-all flex items-center gap-1 active:scale-95"
                        title="Generate Official IEP Progress Summary"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>IEP Report</span>
                      </button>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setSelectedChildDetail(child);
                        }}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center gap-1 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Progress</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Child Detail Modal */}
            {selectedChildDetail && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedChildDetail(null)}
              >
                <div
                  className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedChildDetail.avatar}</span>
                      <div>
                        <h2 className="text-xl font-black text-white m-0">{selectedChildDetail.displayName}</h2>
                        <span className="text-xs text-indigo-400 font-bold uppercase">{selectedChildDetail.accessibilityProfile} Profile</span>
                      </div>
                    </div>
                    <button onClick={() => setSelectedChildDetail(null)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Accessibility Accommodations:</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-800 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Font Choice</span>
                        <span className="font-bold text-white capitalize">{selectedChildDetail.accessibilitySettings?.fontFamily || 'Sans'}</span>
                      </div>
                      <div className="p-2.5 bg-slate-800 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Text Size</span>
                        <span className="font-bold text-white capitalize">{selectedChildDetail.accessibilitySettings?.fontSize || 'Normal'}</span>
                      </div>
                      <div className="p-2.5 bg-slate-800 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Text-to-Speech</span>
                        <span className="font-bold text-emerald-400">Enabled</span>
                      </div>
                      <div className="p-2.5 bg-slate-800 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Reading Ruler</span>
                        <span className="font-bold text-amber-400">{selectedChildDetail.accessibilitySettings?.readingRuler ? 'Active' : 'Disabled'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setSelectedChildForIep(selectedChildDetail);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Generate Official IEP Summary</span>
                    </button>

                    <button
                      onClick={() => setSelectedChildDetail(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= VIEW 3: TEACHERS ================= */}
        {activeTab === 'teachers' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h1 className="text-2xl font-black text-white m-0">Special Education Staff & Teachers</h1>
              <p className="text-xs text-slate-400 mt-1">Classroom assignments and intervention specialists</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teachersList.map((t) => (
                <div key={t.id} className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-900/60 border border-indigo-700 flex items-center justify-center text-xl font-black text-indigo-300">
                    {t.name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white m-0">{t.name}</h3>
                    <p className="text-xs text-indigo-400 font-semibold m-0 mt-0.5">{t.subject}</p>
                    <p className="text-[11px] text-slate-400 m-0 mt-1">{t.email}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>{t.assignedChildren} Assigned Children</span>
                    <span className="text-emerald-400 font-black">{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 4: LEARNING CONTENT STUDIO ================= */}
        {activeTab === 'content' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white m-0">Learning Content & Lessons</h1>
                <p className="text-xs text-slate-400 mt-1">Author interactive lesson slides and organize learning journeys</p>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  setShowCreateLessonModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Lesson</span>
              </button>
            </div>

            {/* Lessons Listing */}
            <div className="space-y-3">
              {lessonsList.map((les) => (
                <div
                  key={les.id}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{les.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-indigo-300 border border-slate-700 uppercase">
                          {les.subject}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {les.difficulty} • {les.estimatedMinutes} min
                        </span>
                      </div>
                      <h3 className="text-base font-black text-white m-0 mt-1">{les.title}</h3>
                      <p className="text-xs text-slate-400 m-0 line-clamp-1">{les.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteLesson(les.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                      title="Delete lesson"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Create Lesson */}
            {showCreateLessonModal && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowCreateLessonModal(false)}
              >
                <div
                  className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-lg font-black text-white m-0">Add Inclusive Lesson</h3>
                    <button onClick={() => setShowCreateLessonModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateLesson} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Lesson Title</label>
                      <input
                        type="text"
                        required
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        placeholder="e.g. Sunny Addition Adventure"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Subject</label>
                        <select
                          value={newLessonSubject}
                          onChange={(e) => setNewLessonSubject(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Math">Math</option>
                          <option value="Reading & Phonics">Reading & Phonics</option>
                          <option value="Emotions & Social">Emotions & Social</option>
                          <option value="Science & Nature">Science & Nature</option>
                          <option value="Focus & Logic">Focus & Logic</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Difficulty</label>
                        <select
                          value={newLessonDifficulty}
                          onChange={(e) => setNewLessonDifficulty(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Challenging">Challenging</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Summary Description</label>
                      <textarea
                        rows={2}
                        value={newLessonDesc}
                        onChange={(e) => setNewLessonDesc(e.target.value)}
                        placeholder="Short overview of the lesson goals..."
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCreateLessonModal(false)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
                      >
                        Publish Lesson
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= VIEW 5: ACTIVITY MANAGER ================= */}
        {activeTab === 'activities' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white m-0">Activity & Mini-Game Manager</h1>
                <p className="text-xs text-slate-400 mt-1">Configure interactive quizzes, matching pairs, and puzzles</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={activityTypeFilter}
                  onChange={(e) => setActivityTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Mini-Game Types</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="match_pairs">Match Pairs</option>
                  <option value="drag_drop">Drag and Drop</option>
                  <option value="image_id">Image Identification</option>
                  <option value="story_choice">Story Choice</option>
                  <option value="memory_game">Memory Match</option>
                  <option value="puzzle">Simple Puzzle</option>
                </select>

                <button
                  onClick={() => setShowCreateActivityModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Activity</span>
                </button>
              </div>
            </div>

            {/* Activities Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {act.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-amber-400">+{act.xpReward} XP</span>
                    </div>
                    <h3 className="text-base font-black text-white m-0">{act.title}</h3>
                    <p className="text-xs text-slate-300 m-0 mt-1 font-medium">{act.question}</p>
                    {act.hint && (
                      <p className="text-[11px] text-amber-300/80 m-0 mt-1.5 font-semibold">
                        💡 Hint: {act.hint}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span className="capitalize">Difficulty: {act.difficulty}</span>
                    <span className="text-emerald-400 font-bold">Active in Curriculum</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Create Activity */}
            {showCreateActivityModal && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowCreateActivityModal(false)}
              >
                <div
                  className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-lg font-black text-white m-0">Create Learning Challenge</h3>
                    <button onClick={() => setShowCreateActivityModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateActivity} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Target Lesson</label>
                      <select
                        value={newActLessonId}
                        onChange={(e) => setNewActLessonId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white outline-none"
                      >
                        {lessonsList.map(l => (
                          <option key={l.id} value={l.id}>{l.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Activity Type</label>
                        <select
                          value={newActType}
                          onChange={(e) => setNewActType(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white outline-none"
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="puzzle">Simple Puzzle</option>
                          <option value="story_choice">Story Choice</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">XP Reward</label>
                        <input
                          type="number"
                          value={newActXp}
                          onChange={(e) => setNewActXp(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Question Prompt</label>
                      <input
                        type="text"
                        required
                        value={newActQuestion}
                        onChange={(e) => setNewActQuestion(e.target.value)}
                        placeholder="e.g. Which number is bigger?"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Correct Choice</label>
                        <input
                          type="text"
                          value={newActOptionA}
                          onChange={(e) => setNewActOptionA(e.target.value)}
                          placeholder="e.g. 10 🦁"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Wrong Choice</label>
                        <input
                          type="text"
                          value={newActOptionB}
                          onChange={(e) => setNewActOptionB(e.target.value)}
                          placeholder="e.g. 2 🐭"
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Buddy Hint</label>
                      <input
                        type="text"
                        value={newActHint}
                        onChange={(e) => setNewActHint(e.target.value)}
                        placeholder="e.g. Think about counting on your fingers!"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white outline-none"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCreateActivityModal(false)}
                        className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl"
                      >
                        Save Activity
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= VIEW 6: DEEP ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 max-w-6xl mx-auto">
            <div>
              <h1 className="text-2xl font-black text-white m-0">Learning Analytics</h1>
              <p className="text-xs text-slate-400 mt-1">Accuracy trends, subject mastery, and accessibility distribution</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Subject Performance Breakdown */}
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                <h3 className="text-base font-black text-white m-0">Subject Accuracy & Mastery</h3>
                <div className="space-y-3">
                  {analyticsData?.subjectPerformance?.map((sp: any) => (
                    <div key={sp.subject} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-300">{sp.subject}</span>
                        <span className="text-indigo-400">{sp.accuracy}% Accuracy</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                          style={{ width: `${sp.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Engagement Bars */}
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                <h3 className="text-base font-black text-white m-0">Weekly Active Sessions</h3>
                <div className="grid grid-cols-7 gap-2 h-44 items-end pt-4">
                  {analyticsData?.weeklyEngagement?.map((we: any) => (
                    <div key={we.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div
                        className="w-full bg-amber-400 hover:bg-amber-300 rounded-t-lg transition-all"
                        style={{ height: `${(we.sessions / 40) * 100}%` }}
                        title={`${we.sessions} sessions on ${we.day}`}
                      />
                      <span className="text-[10px] font-bold text-slate-400">{we.day}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= VIEW 7: AI INSIGHTS & INTERVENTIONS ================= */}
        {activeTab === 'insights' && (
          <div className="space-y-8 max-w-6xl mx-auto">
            <div>
              <h1 className="text-2xl font-black text-white m-0">AI Learning Insights</h1>
              <p className="text-xs text-slate-400 mt-1">Predictive notifications and tailored pedagogical recommendations</p>
            </div>

            {/* Students Needing Support Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Students Needing Immediate Support</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insightsData?.supportStudents?.map((s: any) => (
                  <div key={s.childId} className="p-6 rounded-3xl bg-amber-950/30 border border-amber-800/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-amber-200 m-0">{s.displayName}</h3>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700">
                        {s.profile}
                      </span>
                    </div>
                    <p className="text-xs text-amber-100/90 leading-relaxed m-0 font-medium">
                      ⚠️ {s.reason}
                    </p>
                    <div className="p-3 bg-slate-900/80 rounded-2xl border border-amber-800/40 text-xs font-semibold text-slate-300">
                      <span className="text-amber-400 font-bold block mb-0.5">Recommended Intervention:</span>
                      {s.suggestedAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Difficult Concepts */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <span>Common Concept Friction Points</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insightsData?.commonDifficultConcepts?.map((c: any) => (
                  <div key={c.concept} className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-white m-0">{c.concept}</h3>
                      <span className="text-xs font-bold text-rose-400">{c.failureRate} error rate</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 block">{c.subject}</span>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2 m-0 font-medium">
                      💡 {c.aiRecommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= VIEW 8: ACCESSIBILITY MANAGEMENT ================= */}
        {activeTab === 'accessibility' && (
          <div className="space-y-8 max-w-6xl mx-auto">
            <div>
              <h1 className="text-2xl font-black text-white m-0">Accessibility & Inclusion Management</h1>
              <p className="text-xs text-slate-400 mt-1">Telemetry on accommodations, assistive tools, and WCAG compliance</p>
            </div>

            {/* Accommodation Usage Distribution */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 block mb-1">Text-to-Speech</span>
                <span className="text-2xl font-black text-emerald-400">100%</span>
                <span className="text-[10px] text-slate-400 block mt-1">Active across 4 children</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 block mb-1">Dyslexia Typography</span>
                <span className="text-2xl font-black text-indigo-400">50%</span>
                <span className="text-[10px] text-slate-400 block mt-1">Lexend font enabled</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 block mb-1">ADHD Reading Ruler</span>
                <span className="text-2xl font-black text-amber-400">50%</span>
                <span className="text-[10px] text-slate-400 block mt-1">Cursor highlight tracking</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-xs font-bold text-slate-400 block mb-1">Calm Sensory Mode</span>
                <span className="text-2xl font-black text-purple-400">25%</span>
                <span className="text-[10px] text-slate-400 block mt-1">Reduced stimulation</span>
              </div>
            </div>

            {/* Neurodiversity Profiles Breakdown */}
            <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <h3 className="text-base font-black text-white m-0">Active Inclusion Profiles</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Dyslexia Mode', count: 1, icon: '📖', desc: 'Audio-first & spaced letters' },
                  { name: 'ADHD Mode', count: 1, icon: '⚡', desc: 'Micro-goals & focus strip' },
                  { name: 'Autism Sensory', count: 1, icon: '🌿', desc: 'Muted palette & low motion' },
                  { name: 'Paced Practice', count: 1, icon: '🐢', desc: 'Step-by-step repetition' }
                ].map(p => (
                  <div key={p.name} className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <span className="text-2xl mb-1 block">{p.icon}</span>
                    <h4 className="text-xs font-black text-white m-0">{p.name}</h4>
                    <span className="text-xs font-extrabold text-indigo-400">{p.count} Enrolled Student</span>
                    <p className="text-[10px] text-slate-400 m-0 mt-1">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 9: SYSTEM SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h1 className="text-2xl font-black text-white m-0">System & AI Configuration</h1>
              <p className="text-xs text-slate-400 mt-1">Configure LearnAble Buddy safety guidelines and platform defaults</p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  AI Companion Name
                </label>
                <input
                  type="text"
                  value={settingsData?.tutorName || 'LearnAble Buddy'}
                  readOnly
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Safety Guardrails Mode
                </label>
                <div className="p-3 bg-slate-900 rounded-xl border border-emerald-800 text-xs text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Maximum Child Safety Filter Active (No personal info, pedagogical hints only)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Platform Database Baseline
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Restore all student roster metrics, progress telemetry, and curriculum modules to factory defaults.
                </p>
                <button
                  onClick={handleResetDatabase}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95 cursor-pointer"
                >
                  Reset Platform Database
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Official IEP Progress Report Modal */}
        {selectedChildForIep && (
          <IepReportModal
            child={selectedChildForIep}
            onClose={() => setSelectedChildForIep(null)}
          />
        )}

      </main>

    </div>
  );
};
