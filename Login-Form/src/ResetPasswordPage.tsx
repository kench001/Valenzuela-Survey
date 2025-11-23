import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';
import logoImage from 'figma:asset/af81db3161d88598d5899e189bb64eb0b86eded2.png';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordRequirements = [
    { id: 1, text: 'At least 8 characters', met: newPassword.length >= 8 },
    { id: 2, text: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
    { id: 3, text: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
    { id: 4, text: 'Contains number', met: /[0-9]/.test(newPassword) },
    { id: 5, text: 'Contains special character', met: /[!@#$%^&*]/.test(newPassword) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRequirementsMet || !passwordsMatch) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Reset Password Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={logoImage} alt="Valenzuela Logo" className="w-20 h-20 rounded-full" />
            </div>
            {!isSuccess ? (
              <>
                <h1 className="text-white mb-2">Reset Password</h1>
                <p className="text-slate-400">
                  Create a strong password to secure your account
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-green-600/20 rounded-full p-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                <h1 className="text-white mb-2">Password Reset Successful</h1>
                <p className="text-slate-400">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
              </>
            )}
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password Input */}
              <div>
                <label htmlFor="newPassword" className="block text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full pl-10 pr-12 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {newPassword && (
                <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <p className="text-slate-300 mb-3">Password Requirements:</p>
                  <div className="space-y-2">
                    {passwordRequirements.map((req) => (
                      <div key={req.id} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        )}
                        <span className={req.met ? 'text-green-400' : 'text-slate-400'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className={`w-full pl-10 pr-12 py-3 bg-slate-700 text-white rounded-lg border transition-colors placeholder:text-slate-500 ${
                      confirmPassword && !passwordsMatch
                        ? 'border-red-500 focus:border-red-500'
                        : confirmPassword && passwordsMatch
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-slate-600 focus:border-red-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-red-400 mt-2">Passwords do not match</p>
                )}
                {confirmPassword && passwordsMatch && (
                  <p className="text-green-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !allRequirementsMet || !passwordsMatch}
                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              {/* Success Actions */}
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                Sign In Now
              </button>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Need help?{' '}
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
