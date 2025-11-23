import { Menu, Bell, Search, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import AuthService from '../services/authService';

interface TopBarProps {
  onToggleSidebar: () => void;
  logoImage: string;
  currentUser?: { email: string; firstName: string; lastName: string } | null;
}

export function TopBar({ onToggleSidebar, logoImage, currentUser }: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-slate-300 hover:text-white p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Logo" className="w-12 h-12 rounded-full" />
            <div>
              <h1 className="text-white">CITY GOVERNMENT OF VALENZUELA</h1>
              <p className="text-slate-400">Metropolitan Manila</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors w-64"
            />
          </div>
          
          <button className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <User className="w-6 h-6" />
              {currentUser && (
                <span className="hidden md:block text-sm">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
              )}
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-slate-700">
                  <p className="text-white text-sm font-medium">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-slate-400 text-xs">{currentUser?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
