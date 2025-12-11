import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardOverview } from './components/DashboardOverview';
import { SurveyManagement } from './components/SurveyManagement';
import { FormBuilder } from './components/FormBuilder';
// import { SurveyTemplates } from './components/SurveyTemplates';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
// import { UserManagement } from './components/UserManagement';
import AuthService, { AdminUser } from './services/authService';

// Use the same logo from the main app
const logoImage = '/src/assets/valenzuela-logo.png';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          } else {
            // Invalid authentication, redirect to login
            AuthService.navigateToLogin();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          AuthService.navigateToLogin();
        }
      } else {
        // Not authenticated, redirect to login
        AuthService.navigateToLogin();
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth state changes
    const unsubscribe = AuthService.onAuthStateChange((user, adminData) => {
      if (user && adminData) {
        setCurrentUser(adminData);
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        AuthService.navigateToLogin();
      }
    });

    return () => unsubscribe();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show redirect message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Redirecting to login...</p>
          <button
            onClick={AuthService.navigateToLogin}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'surveys':
        return <SurveyManagement onNavigate={setCurrentPage} />;
      case 'form-builder':
        return <FormBuilder onBack={() => setCurrentPage('surveys')} />;
      // case 'templates':
      //   return <SurveyTemplates onNavigate={setCurrentPage} />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />;
      // case 'users':
      //   return <UserManagement />;
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
          currentUser={currentUser}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
