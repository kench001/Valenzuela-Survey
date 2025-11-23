import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardOverview } from './components/DashboardOverview';
import { SurveyManagement } from './components/SurveyManagement';
import { FormBuilder } from './components/FormBuilder';
import { SurveyTemplates } from './components/SurveyTemplates';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { UserManagement } from './components/UserManagement';
import LoginPage from './LoginPage';
import LoginSplitScreen from './LoginSplitScreen';
import ForgotPasswordPage from './ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage';
import logoImage from 'figma:asset/af81db3161d88598d5899e189bb64eb0b86eded2.png';

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'login-split' | 'forgot' | 'reset' | 'dashboard'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Login view selector
  if (currentView === 'login') {
    return (
      <div className="relative">
        <LoginPage />
        {/* View Switcher - for demo purposes */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-3 z-50">
          <p className="text-slate-400 mb-2 text-center">Demo: Switch Views</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentView('login')} className="px-3 py-2 bg-red-600 text-white rounded text-xs">
              Centered
            </button>
            <button onClick={() => setCurrentView('login-split')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Split Screen
            </button>
            <button onClick={() => setCurrentView('forgot')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Forgot Password
            </button>
            <button onClick={() => setCurrentView('reset')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Reset Password
            </button>
            <button onClick={() => setCurrentView('dashboard')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'login-split') {
    return (
      <div className="relative">
        <LoginSplitScreen />
        {/* View Switcher */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-3 z-50">
          <p className="text-slate-400 mb-2 text-center">Demo: Switch Views</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentView('login')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Centered
            </button>
            <button onClick={() => setCurrentView('login-split')} className="px-3 py-2 bg-red-600 text-white rounded text-xs">
              Split Screen
            </button>
            <button onClick={() => setCurrentView('forgot')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Forgot Password
            </button>
            <button onClick={() => setCurrentView('reset')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Reset Password
            </button>
            <button onClick={() => setCurrentView('dashboard')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'forgot') {
    return (
      <div className="relative">
        <ForgotPasswordPage />
        {/* View Switcher */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-3 z-50">
          <p className="text-slate-400 mb-2 text-center">Demo: Switch Views</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentView('login')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Centered
            </button>
            <button onClick={() => setCurrentView('login-split')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Split Screen
            </button>
            <button onClick={() => setCurrentView('forgot')} className="px-3 py-2 bg-red-600 text-white rounded text-xs">
              Forgot Password
            </button>
            <button onClick={() => setCurrentView('reset')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Reset Password
            </button>
            <button onClick={() => setCurrentView('dashboard')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'reset') {
    return (
      <div className="relative">
        <ResetPasswordPage />
        {/* View Switcher */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-3 z-50">
          <p className="text-slate-400 mb-2 text-center">Demo: Switch Views</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentView('login')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Centered
            </button>
            <button onClick={() => setCurrentView('login-split')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Split Screen
            </button>
            <button onClick={() => setCurrentView('forgot')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Forgot Password
            </button>
            <button onClick={() => setCurrentView('reset')} className="px-3 py-2 bg-red-600 text-white rounded text-xs">
              Reset Password
            </button>
            <button onClick={() => setCurrentView('dashboard')} className="px-3 py-2 bg-slate-700 text-white rounded text-xs hover:bg-slate-600">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard view
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'surveys':
        return <SurveyManagement onNavigate={setCurrentPage} />;
      case 'form-builder':
        return <FormBuilder onBack={() => setCurrentPage('surveys')} />;
      case 'templates':
        return <SurveyTemplates onNavigate={setCurrentPage} />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />;
      case 'users':
        return <UserManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-800 overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          logoImage={logoImage}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}