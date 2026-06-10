import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { safeStorage } from '../utils/safeStorage';
import GoogleLoginButton from './Auth/GoogleLogin';
import { BASE_URL } from '../utils/api';
import { isMobileApp } from '../utils/isMobile';

interface LoginSignupProps {
  onClose: () => void;
  onLogin: (user: any) => void;
}

const AVATAR_SEEDS = ['Felix', 'Luna', 'Jasper', 'Max', 'Buster', 'Bella', 'Simba', 'Lucy'];

export default function LoginSignup({ onClose, onLogin }: LoginSignupProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<any[]>([]);

  // Simple strict linear flow for Mobile:
  // step 1 = Mobile Number
  // step 2 = OTP Code
  // step 3 = Profile Setup (New User Only)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [receivedOtp, setReceivedOtp] = useState('');
  const [countdown, setCountdown] = useState(45);
  
  // Profile Setup Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_SEEDS[0]);
  const [tempUserId, setTempUserId] = useState('');

  // Load saved Google accounts from localStorage (Web only)
  useEffect(() => {
    if (!isMobileApp) {
      const existingUsers = JSON.parse(safeStorage.getItem('google_users') || '{}');
      const accounts = Object.values(existingUsers);
      setSavedAccounts(accounts);
    }
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const handleSavedAccountLogin = (account: any) => {
    toast.success(`Welcome back, ${account.name}!`);
    account.role = 'user';
    onLogin(account);
  };

  const handleGoogleLoginSuccess = (user: any) => {
    const existingUsers = JSON.parse(safeStorage.getItem('google_users') || '{}');
    existingUsers[user.id] = user;
    safeStorage.setItem('google_users', JSON.stringify(existingUsers));
    toast.success('Logged in successfully!');
    onLogin(user);
  };

  const handleGoogleLoginError = (errorMessage: string) => {
    toast.error(errorMessage);
  };

  // ─── Step 1: Send OTP ─────────────────────────
  const handleSendOtp = async () => {
    const cleanPhone = mobileNumber.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/mobile-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: cleanPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Authentication request failed.');
        setIsProcessing(false);
        return;
      }

      setReceivedOtp(data.otp);
      setCountdown(45);
      setOtpCode('');
      setStep(2);
      toast.success(`Demo OTP sent! Code: ${data.otp}`);
    } catch (err: any) {
      console.error('Mobile Auth Send OTP Error:', err);
      toast.error(err.message || 'Network connection error.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Step 2: Verify OTP ───────────────────────
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      toast.error('Please enter a valid 6-digit OTP code.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/mobile-verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: mobileNumber.trim(),
          otp: otpCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Incorrect OTP code. Please try again.');
        setIsProcessing(false);
        return;
      }

      localStorage.setItem('token', data.token);
      
      if (data.isNewUser) {
        // Needs profile setup
        setTempUserId(data.user.id);
        setStep(3);
      } else {
        // Returning user, ready to login
        toast.success(`Welcome back, ${data.user.name}!`);
        onLogin(data.user);
      }
    } catch (err: any) {
      console.error('Mobile Auth Verify OTP Error:', err);
      toast.error(err.message || 'Network verification error.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Step 3: Complete Profile Setup ───────────────────────
  const handleProfileSetup = async () => {
    if (!fullName.trim() || !username.trim()) {
      toast.error('Name and Username are required.');
      return;
    }

    setIsProcessing(true);
    try {
      const profilePicture = `https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedAvatar}`;
      
      const response = await fetch(`${BASE_URL}/api/auth/profile-setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: tempUserId,
          name: fullName.trim(),
          username: username.trim(),
          profilePicture
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Profile setup failed.');
        setIsProcessing(false);
        return;
      }

      toast.success('Account created successfully!');
      onLogin(data.user);
    } catch (err: any) {
      console.error('Mobile Auth Profile Setup Error:', err);
      toast.error(err.message || 'Network error.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Keypad Input Handler ──────────────────────────────────────────
  const handleKeypadPress = (key: string) => {
    if (step === 1) {
      if (key === 'delete') {
        setMobileNumber(prev => prev.slice(0, -1));
      } else if (mobileNumber.length < 10) {
        setMobileNumber(prev => prev + key);
      }
    } else if (step === 2) {
      if (key === 'delete') {
        setOtpCode(prev => prev.slice(0, -1));
      } else if (otpCode.length < 6) {
        setOtpCode(prev => prev + key);
      }
    }
  };

  const renderKeypad = () => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];
    return (
      <div className="grid grid-cols-3 gap-y-3 gap-x-6 w-full max-w-sm mx-auto mt-auto pb-6 select-none">
        {keys.map((key, i) => {
          if (key === '') return <div key={i} className="h-12 md:h-14"></div>;
          if (key === 'delete') {
            return (
              <button
                key={i}
                onClick={() => handleKeypadPress('delete')}
                className="h-12 md:h-14 flex items-center justify-center rounded-2xl bg-transparent text-black active:bg-black/5 active:scale-95 transition-all text-lg font-bold select-none"
              >⌫</button>
            );
          }
          return (
            <button
              key={i}
              onClick={() => handleKeypadPress(key)}
              className="h-12 md:h-14 flex items-center justify-center rounded-full bg-[#f3eee7] hover:bg-[#eae2d7] text-black active:scale-90 active:bg-black active:text-white transition-all text-xl font-bold select-none shadow-sm font-['Inter',sans-serif]"
            >{key}</button>
          );
        })}
      </div>
    );
  };

  const formatPhoneNumber = (num: string) => {
    if (!num) return '';
    if (num.length <= 5) return num;
    return `${num.slice(0, 5)} ${num.slice(5)}`;
  };

  const renderOtpSlots = () => {
    const slots = [];
    for (let i = 0; i < 6; i++) {
      const char = otpCode[i] || '';
      const isActive = i === otpCode.length;
      slots.push(
        <div
          key={i}
          className={`w-12 h-14 md:w-14 md:h-16 rounded-2xl border flex items-center justify-center text-xl font-black text-black transition-all ${
            isActive ? 'border-black bg-stone-100 ring-4 ring-black/5' : 'border-stone-200 bg-[#f7f4f0]'
          }`}
        >
          {char}
          {isActive && <span className="w-0.5 h-6 bg-black animate-pulse rounded-full"></span>}
        </div>
      );
    }
    return <div className="flex gap-2 justify-between w-full max-w-sm mx-auto my-6">{slots}</div>;
  };

  // ─── SIMPLE MOBILE NATIVE AUTH ──────────────
  if (isMobileApp) {
    return (
      <div 
        className="fixed inset-0 w-full h-full z-[9999] flex flex-col p-6 overflow-hidden select-none bg-[#fbf9f6]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#8d5943_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {step === 1 && (
          <div className="flex-1 flex flex-col h-full z-10 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Top Bar */}
            <div className="pt-4 flex items-center justify-between">
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-start text-black active:scale-90 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 overflow-y-auto pb-4 no-scrollbar">
              <h1 className="text-[32px] font-black text-black leading-tight tracking-tight text-left">
                Enter your<br />phone number
              </h1>
              
              <div className="mt-6 space-y-5">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black text-black uppercase tracking-wider ml-1">Mobile Number</label>
                  <div className="flex items-center w-full border-b-2 border-stone-200 py-2 bg-transparent">
                    <div className="flex items-center gap-1 text-xl font-black text-black pr-3 border-r border-stone-300">
                      <span>+91</span>
                      <span className="text-[10px] text-stone-400">▼</span>
                    </div>
                    
                    <div className="flex-1 pl-4 flex items-center text-xl font-extrabold text-black tracking-wider bg-transparent overflow-hidden">
                      {mobileNumber ? (
                        <span>{formatPhoneNumber(mobileNumber)}</span>
                      ) : (
                        <span className="text-stone-300 font-semibold tracking-normal text-lg">00000 00000</span>
                      )}
                      <span className="w-0.5 h-6 bg-black ml-1 animate-pulse rounded-full flex-shrink-0"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-4 w-full pt-2">
              <button
                onClick={handleSendOtp}
                disabled={isProcessing || mobileNumber.length < 10}
                className="w-full py-[18px] bg-black hover:bg-stone-900 active:scale-[0.98] transition-all rounded-full flex items-center justify-between px-8 text-white font-bold text-base shadow-[0_8px_32px_rgba(0,0,0,0.15)] disabled:opacity-25"
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </>
                )}
              </button>
              {renderKeypad()}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col h-full z-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="pt-4 flex items-center justify-start">
              <button 
                onClick={() => setStep(1)}
                className="w-10 h-10 rounded-full flex items-center justify-start text-black active:scale-90 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6">
              <h1 className="text-[32px] font-black text-black leading-tight tracking-tight text-left">
                Verify OTP
              </h1>
              <p className="text-xs font-semibold text-stone-500 mt-2 text-left leading-relaxed max-w-sm">
                Code sent to <span className="text-black font-bold">+91 {formatPhoneNumber(mobileNumber)}</span>.
              </p>
              <div className="inline-block px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 rounded-full text-[11px] font-bold mt-4 text-left shadow-sm">
                🔑 Demo OTP: {receivedOtp}
              </div>
            </div>

            {renderOtpSlots()}

            <div className="text-center mt-2">
              {countdown > 0 ? (
                <p className="text-xs font-medium text-stone-500">
                  Resend in <span className="text-black font-bold">00:{countdown < 10 ? '0' + countdown : countdown}</span>
                </p>
              ) : (
                <button 
                  onClick={() => { setCountdown(45); handleSendOtp(); }}
                  className="text-xs font-black uppercase tracking-wider text-[#a88968] hover:text-[#8d5943] transition-colors underline bg-transparent"
                >Resend Code</button>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-6 w-full">
              <button
                onClick={handleVerifyOtp}
                disabled={isProcessing || otpCode.length < 6}
                className="w-full py-[18px] bg-black hover:bg-stone-900 active:scale-[0.98] transition-all rounded-full flex items-center justify-between px-8 text-white font-bold text-base shadow-[0_8px_32px_rgba(0,0,0,0.15)] disabled:opacity-25"
              >
                {isProcessing ? <span>Verifying...</span> : <span>Verify & Continue</span>}
              </button>
              {renderKeypad()}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col h-full z-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="pt-4 flex items-center justify-start">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-3 py-1 rounded-full">New User Setup</span>
            </div>

            <div className="mt-6 overflow-y-auto pb-4 no-scrollbar">
              <h1 className="text-[32px] font-black text-black leading-tight tracking-tight text-left mb-6">
                Complete your<br />profile
              </h1>
              
              <div className="space-y-6">
                {/* Avatar Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-wider ml-1">Select Avatar</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
                    {AVATAR_SEEDS.map((seed) => (
                      <div 
                        key={seed}
                        onClick={() => setSelectedAvatar(seed)}
                        className={`flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedAvatar === seed ? 'border-black scale-110 shadow-md bg-[#f0ebe3]' : 'border-transparent opacity-60 bg-stone-100 hover:opacity-100'
                        }`}
                      >
                        <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`} alt={seed} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black text-black uppercase tracking-wider ml-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full border-b-2 border-stone-200 py-3 text-lg font-bold text-black focus:border-black outline-none placeholder:text-stone-300 bg-transparent transition-all"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black text-black uppercase tracking-wider ml-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe123"
                    className="w-full border-b-2 border-stone-200 py-3 text-lg font-bold text-black focus:border-black outline-none placeholder:text-stone-300 bg-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-4 w-full pt-4">
              <button
                onClick={handleProfileSetup}
                disabled={isProcessing || !fullName.trim() || !username.trim()}
                className="w-full py-[18px] bg-black hover:bg-stone-900 active:scale-[0.98] transition-all rounded-full flex items-center justify-between px-8 text-white font-bold text-base shadow-[0_8px_32px_rgba(0,0,0,0.15)] disabled:opacity-25"
              >
                {isProcessing ? <span>Saving...</span> : <span>Complete Profile</span>}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── STANDARD DESKTOP POPUP WINDOW FOR WEB BROWSERS ──────────────
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className="rounded-[28px] max-w-md w-full max-h-[92vh] overflow-hidden shadow-2xl border border-white/20"
        style={{ background: 'linear-gradient(135deg, rgb(62, 39, 35) 0%, rgb(93, 64, 55) 50%, rgb(61, 40, 23) 100%)' }}
      >
        <div className="bg-white/10 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-3xl">☕</span>
            <h2 className="text-xl font-bold text-white font-['Arial:Bold',sans-serif]">
              Welcome to Caffélino!
            </h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(92vh - 80px)' }}>
          <div className="space-y-5">
            {savedAccounts.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-200 text-center mb-1 font-medium">Choose an account to continue</p>
                {savedAccounts.map((account: any) => (
                  <button
                    key={account.id || account.email}
                    onClick={() => handleSavedAccountLogin(account)}
                    className="w-full bg-white/5 hover:bg-white/10 py-3 px-4 border border-white/10 rounded-xl flex items-center gap-3 transition-all shadow-sm"
                  >
                    <img
                      src={account.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=be9d80&color=fff`}
                      alt={account.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#be9d80]/30"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-white">{account.name}</p>
                      <p className="text-xs text-white/60">{account.email}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/50" />
                  </button>
                ))}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="text-xs text-white/40 font-bold tracking-wider">OR</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {savedAccounts.length === 0 && (
                <div className="text-center mb-2">
                  <p className="text-sm text-white/70">Sign in with your Google account to continue</p>
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
                <div className="w-full bg-white/5 py-4 px-4 border border-white/10 rounded-xl flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm text-white/80 font-medium">Authenticating...</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-[10px] text-center text-white/45 mt-8 leading-normal max-w-xs mx-auto">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
