import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { Navbar } from './components/Navbar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ChildDashboard } from './pages/child/ChildDashboard';
import { LearningPathView } from './pages/child/LearningPathView';
import { LessonView } from './pages/child/LessonView';
import { ActivityRunner } from './pages/child/ActivityRunner';
import { ChildProgressView } from './pages/child/ChildProgressView';
import { CalmCornerView } from './pages/child/CalmCornerView';
import { AiTutorView } from './pages/child/AiTutorView';
import { AchievementsView } from './pages/child/AchievementsView';
import { ChildProfileView } from './pages/child/ChildProfileView';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { role, loginChild, loginAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeLessonId, setActiveLessonId] = useState<string>('les-1');
  const [activeActivityId, setActiveActivityId] = useState<string>('act-1');

  const handleNavigate = (view: string, extra?: { lessonId?: string; activityId?: string }) => {
    if (extra?.lessonId) setActiveLessonId(extra.lessonId);
    if (extra?.activityId) setActiveActivityId(extra.activityId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickDemo = async (targetRole: 'child' | 'administrator') => {
    if (targetRole === 'child') {
      await loginChild('leo', true);
      setCurrentView('child-home');
    } else {
      await loginAdmin('admin@learnable.edu', '', true);
      setCurrentView('admin-dashboard');
    }
  };

  // Determine which page component to display
  const renderCurrentPage = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} onQuickDemo={handleQuickDemo} />;

      case 'login-child':
        return <LoginPage initialRole="child" onNavigate={handleNavigate} />;

      case 'login-admin':
        return <LoginPage initialRole="administrator" onNavigate={handleNavigate} />;

      case 'child-home':
        return <ChildDashboard onNavigate={handleNavigate} />;

      case 'child-path':
        return <LearningPathView onNavigate={handleNavigate} />;

      case 'child-lesson':
        return <LessonView lessonId={activeLessonId} onNavigate={handleNavigate} />;

      case 'child-activity':
        return <ActivityRunner activityId={activeActivityId} lessonId={activeLessonId} onNavigate={handleNavigate} />;

      case 'child-progress':
        return <ChildProgressView onNavigate={handleNavigate} />;

      case 'child-calm':
        return <CalmCornerView onNavigate={handleNavigate} />;

      case 'child-tutor':
        return <AiTutorView onNavigate={handleNavigate} />;

      case 'child-achievements':
        return <AchievementsView onNavigate={handleNavigate} />;

      case 'child-profile':
        return <ChildProfileView onNavigate={handleNavigate} />;

      case 'admin-dashboard':
        return <AdminDashboard />;

      default:
        return <LandingPage onNavigate={handleNavigate} onQuickDemo={handleQuickDemo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Universal Sticky Navbar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Page Content */}
      <div className="flex-1">
        {renderCurrentPage()}
      </div>

      {/* Universal Floating Accessibility Toolbar & Profiles */}
      <AccessibilityToolbar />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <AppContent />
      </AccessibilityProvider>
    </AuthProvider>
  );
};

export default App;
