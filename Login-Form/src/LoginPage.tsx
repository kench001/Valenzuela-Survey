import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, LogIn, AlertCircle } from 'lucide-react';
import logoImage from 'figma:asset/af81db3161d88598d5899e189bb64eb0b86eded2.png';
import AuthService from './services/authService';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.login(email, password);
      
      // Show success message briefly then redirect
      setTimeout(() => {
        AuthService.navigateToAdmin();
      }, 500);
      
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
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={logoImage} alt="Valenzuela Logo" className="w-20 h-20 rounded-full" />
            </div>
            <h1 className="text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">City Government of Valenzuela</p>
            <p className="text-slate-400">Survey Management System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-200">{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-600 focus:ring-red-500 focus:ring-offset-slate-800"
                />
                <span className="text-slate-300">Remember me</span>
              </label>
              <a href="#" className="text-red-500 hover:text-red-400 transition-colors">
                Forgot Password?
              </a>
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
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-slate-800 text-slate-400">or</span>
            </div>
          </div>

          {/* Alternative Options */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={AuthService.navigateToSurvey}
              className="w-full py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors border border-slate-600"
            >
              ← Back to Survey
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Need help? Contact{' '}
              <a href="mailto:support@valenzuela.gov.ph" className="text-red-500 hover:text-red-400 transition-colors">
                IT Support
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-slate-500">
            © 2024 City Government of Valenzuela. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <a href="#" className="text-slate-500 hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-600">•</span>
            <a href="#" className="text-slate-500 hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
