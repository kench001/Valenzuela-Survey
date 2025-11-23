// src/components/AdminDashboard.tsx
import { useState } from 'react';
import AuthService, { type AdminUser } from '../services/authService';

interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
}

export default function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      onLogout(); // Force logout even if Firebase call fails
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Bar */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <div>
              <h1 className="text-white text-lg font-bold">CITY GOVERNMENT OF VALENZUELA</h1>
              <p className="text-slate-400 text-sm">Survey Management System</p>
            </div>
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">👤</span>
              </div>
              <span className="text-sm">
                {currentUser.firstName} {currentUser.lastName}
              </span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-slate-700">
                  <p className="text-white text-sm font-medium">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-slate-400 text-xs">{currentUser.email}</p>
                  <p className="text-slate-400 text-xs">Role: {currentUser.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-white text-2xl mb-2">
              Welcome back, {currentUser.firstName}! 👋
            </h2>
            <p className="text-slate-400">
              Survey Management Dashboard - {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Surveys</p>
                  <p className="text-white text-2xl font-bold">12</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">✅</span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Active Surveys</p>
                  <p className="text-white text-2xl font-bold">5</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Responses</p>
                  <p className="text-white text-2xl font-bold">1,247</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📈</span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Completion Rate</p>
                  <p className="text-white text-2xl font-bold">87%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-white text-lg mb-4">Recent Survey Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div>
                  <p className="text-white">Valenzuela Development Survey 2025</p>
                  <p className="text-slate-400 text-sm">25 new responses today</p>
                </div>
                <span className="text-green-400 text-sm">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div>
                  <p className="text-white">Public Services Feedback</p>
                  <p className="text-slate-400 text-sm">12 new responses today</p>
                </div>
                <span className="text-green-400 text-sm">Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div>
                  <p className="text-white">Community Health Assessment</p>
                  <p className="text-slate-400 text-sm">Completed yesterday</p>
                </div>
                <span className="text-slate-400 text-sm">Closed</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition-colors">
              <span className="text-xl mb-2 block">📝</span>
              Create New Survey
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors">
              <span className="text-xl mb-2 block">📊</span>
              View Analytics
            </button>
            
            <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors">
              <span className="text-xl mb-2 block">⚙️</span>
              Manage Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}