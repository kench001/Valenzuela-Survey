import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, LogIn, Shield, BarChart3, Users, FileText } from 'lucide-react';
import logoImage from 'figma:asset/af81db3161d88598d5899e189bb64eb0b86eded2.png';

export default function LoginSplitScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-red-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <img src={logoImage} alt="Valenzuela Logo" className="w-16 h-16 rounded-full" />
            <div>
              <h2 className="text-white">VALENZUELA</h2>
              <p className="text-red-100">Survey Management System</p>
            </div>
          </div>
          
          <div className="mt-12">
            <h1 className="text-white mb-4">
              Empowering Communities
              <br />
              Through Data
            </h1>
            <p className="text-red-100 max-w-md">
              A comprehensive platform for creating, managing, and analyzing community surveys
              to drive informed decision-making across Valenzuela City.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 grid grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white mb-1">Smart Surveys</h3>
            <p className="text-red-100">Create custom surveys in minutes</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white mb-1">Real-time Analytics</h3>
            <p className="text-red-100">Instant insights and reports</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white mb-1">Community Focus</h3>
            <p className="text-red-100">Engage citizens effectively</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white mb-1">Secure Platform</h3>
            <p className="text-red-100">Enterprise-grade security</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Background Pattern for Mobile */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={logoImage} alt="Valenzuela Logo" className="w-20 h-20 rounded-full" />
            </div>
            <h1 className="text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">City Government of Valenzuela</p>
          </div>

          <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 p-8">
            <div className="mb-8">
              <h2 className="text-white mb-2">Sign In</h2>
              <p className="text-slate-400">Access your admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="admin@valenzuela.gov.ph"
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

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-slate-800 text-slate-400">or</span>
                </div>
              </div>

              {/* SSO Button */}
              <button
                type="button"
                className="w-full py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors border border-slate-600"
              >
                Sign in with SSO
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Need help?{' '}
                <a href="mailto:support@valenzuela.gov.ph" className="text-red-500 hover:text-red-400 transition-colors">
                  Contact Support
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-500">
              © 2024 City Government of Valenzuela
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
