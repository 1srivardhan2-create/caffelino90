import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { safeStorage } from '../utils/safeStorage';
import GoogleLoginButton from './Auth/GoogleLogin';

interface LoginSignupProps {
  onClose: () => void;
  onLogin: (user: any) => void;
}

export default function LoginSignup({ onClose, onLogin }: LoginSignupProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<any[]>([]);

  // Load saved Google accounts from localStorage
  useEffect(() => {
    const existingUsers = JSON.parse(safeStorage.getItem('google_users') || '{}');
    const accounts = Object.values(existingUsers);
    setSavedAccounts(accounts);
  }, []);

  // Handle login with a saved account
  const handleSavedAccountLogin = (account: any) => {
    toast.success(`Welcome back, ${account.name}!`);
    // Ensure regular user logins default to 'user' role
    account.role = 'user';
    onLogin(account);
  };

  // Handle successful Google login from the button
  const handleGoogleLoginSuccess = (user: any) => {
    // Save to localStorage for saved accounts feature
    const existingUsers = JSON.parse(safeStorage.getItem('google_users') || '{}');
    existingUsers[user.id] = user;
    safeStorage.setItem('google_users', JSON.stringify(existingUsers));

    toast.success('Logged in successfully!');
    onLogin(user);
  };

  // Handle Google login error
  const handleGoogleLoginError = (errorMessage: string) => {
    toast.error(errorMessage);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #d4b5a0 0%, #be9d80 50%, #a8866c 100%)'
        }}
      >
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <h2 className="text-lg">Welcome to Caffélino!</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-5">
            {/* Saved Accounts Section */}
            {savedAccounts.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-800 text-center mb-1">
                  Choose an account to continue
                </p>
                {savedAccounts.map((account: any) => (
                  <button
                    key={account.id || account.email}
                    onClick={() => handleSavedAccountLogin(account)}
                    className="w-full bg-white hover:bg-gray-50 py-3 px-4 rounded-lg flex items-center gap-3 transition-all shadow-sm hover:shadow-md"
                  >
                    <img
                      src={account.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=be9d80&color=fff`}
                      alt={account.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#be9d80]/30"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-neutral-900">{account.name}</p>
                      <p className="text-xs text-neutral-500">{account.email}</p>
                    </div>
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}

                {/* Divider */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-px bg-gray-800/20"></div>
                  <span className="text-xs text-gray-800">OR</span>
                  <div className="flex-1 h-px bg-gray-800/20"></div>
                </div>
              </div>
            )}

            {/* Google Login Button */}
            <div className="space-y-3">
              {savedAccounts.length === 0 && (
                <div className="text-center mb-2">
                  <p className="text-sm text-gray-800">
                    Sign in with your Google account to continue
                  </p>
                </div>
              )}

              <div className={isProcessing ? "opacity-0 h-0 w-0 overflow-hidden pointer-events-none" : "block"}>
                <GoogleLoginButton
                  loginRole="user"
                  onLoginSuccess={handleGoogleLoginSuccess}
                  onLoginError={handleGoogleLoginError}
                  onProcessing={setIsProcessing}
                />
              </div>
              
              {isProcessing && (
                <div className="w-full bg-white py-3.5 px-4 rounded-lg flex items-center justify-center gap-3 shadow-sm">
                  <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
                  <span className="text-sm text-neutral-600">Authenticating...</span>
                </div>
              )}
            </div>

            {/* Terms & Privacy */}
            <p className="text-xs text-center text-gray-800 mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
