import { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import logoImage from 'figma:asset/af81db3161d88598d5899e189bb64eb0b86eded2.png';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleBackToLogin = () => {
    // Navigate back to login
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Forgot Password Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={logoImage} alt="Valenzuela Logo" className="w-20 h-20 rounded-full" />
            </div>
            {!isSubmitted ? (
              <>
                <h1 className="text-white mb-2">Forgot Password?</h1>
                <p className="text-slate-400">
                  No worries! Enter your email address and we'll send you instructions to reset your password.
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-green-600/20 rounded-full p-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                <h1 className="text-white mb-2">Check Your Email</h1>
                <p className="text-slate-400">
                  We've sent password reset instructions to <span className="text-white">{email}</span>
                </p>
              </>
            )}
          </div>

          {!isSubmitted ? (
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
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>

              {/* Back to Login */}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors border border-slate-600 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Login</span>
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Instructions */}
              <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <h3 className="text-white mb-2">What's next?</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>Check your email inbox</li>
                  <li>Click the reset link we sent you</li>
                  <li>Create a new password</li>
                  <li>Sign in with your new password</li>
                </ol>
              </div>

              {/* Resend Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors border border-slate-600"
              >
                Didn't receive the email? Resend
              </button>

              {/* Back to Login */}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Login</span>
              </button>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Still having trouble?{' '}
              <a href="mailto:support@valenzuela.gov.ph" className="text-red-500 hover:text-red-400 transition-colors">
                Contact IT Support
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-slate-500">
            © 2024 City Government of Valenzuela. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
