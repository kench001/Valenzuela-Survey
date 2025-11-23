import { useState } from 'react';
import { Sidebar } from './admin/Sidebar';
import { TopBar } from './admin/TopBar';
import { DashboardOverview } from './admin/DashboardOverview';
import { SurveyManagement } from './admin/SurveyManagement';
import { SurveyTemplates } from './admin/SurveyTemplates';
import { Analytics } from './admin/Analytics';
import { Settings } from './admin/Settings';
import { UserManagement } from './admin/UserManagement';
import { type AdminUser } from '../services/authService';
import logo from '../assets/valenzuela-logo.png';

interface IntegratedAdminProps {
  currentUser: AdminUser;
  onLogout: () => void;
}

export default function IntegratedAdmin({ currentUser, onLogout }: IntegratedAdminProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview onNavigate={setCurrentPage} />;
      case 'surveys':
        return <SurveyManagement onNavigate={setCurrentPage} />;
      case 'form-builder':
        return (
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-white text-2xl mb-4">Form Builder</h2>
            <p className="text-slate-400">Survey form builder functionality coming soon...</p>
            <button
              onClick={() => setCurrentPage('surveys')}
              className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              ← Back to Surveys
            </button>
          </div>
        );
      case 'templates':
        return <SurveyTemplates onNavigate={setCurrentPage} />;
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />;
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
          logoImage={logo}
          currentUser={currentUser}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}