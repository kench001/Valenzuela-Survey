// src/components/LoginForm.tsx
import { useState } from 'react';
import AuthService, { type AdminUser } from '../services/authService';

interface LoginFormProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToSurvey: () => void;
}

export default function LoginForm({ onLoginSuccess, onBackToSurvey }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = await AuthService.login(email, password);
      onLoginSuccess(user);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-white text-2xl mb-2">Welcome</h1>
            <p className="text-slate-400">City Government of Valenzuela</p>
            <p className="text-slate-400">Survey Management System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-600 rounded-lg p-3">
                <span className="text-red-200">⚠️ {error}</span>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>🔑 Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Back to Survey */}
          <div className="mt-6">
            <button
              onClick={onBackToSurvey}
              className="w-full py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors border border-slate-600"
            >
              ← Back to Survey
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Need help? Contact{' '}
              <a href="mailto:support@valenzuela.gov.ph" className="text-red-500 hover:text-red-400 transition-colors">
                IT Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}