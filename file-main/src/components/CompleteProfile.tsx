import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import GenderAvatar from './GenderAvatar';
import { Hash, Check, Phone } from 'lucide-react';
import { getAvatarsByGender, getCategoriesByGender, getAvatarsByCategory, getAvatarById, type AvatarOption } from '../utils/avatarData';

interface CompleteProfileProps {
  user: any;
  onComplete: (profileData: any) => void;
}

export default function CompleteProfile({ user, onComplete }: CompleteProfileProps) {
  const [profileData, setProfileData] = useState({
    firstName: '',
    age: '',
    gender: '',
    avatarId: '',
    mobileNumber: '',
  });

  const [ageError, setAgeError] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Auto-select default avatar when gender changes
  useEffect(() => {
    if (profileData.gender === 'male' || profileData.gender === 'female') {
      const avatars = getAvatarsByGender(profileData.gender as 'male' | 'female');
      if (avatars.length > 0 && !profileData.avatarId) {
        setProfileData(prev => ({ ...prev, avatarId: avatars[0].id }));
      }
    }
  }, [profileData.gender]);

  const validateMobileNumber = (mobile: string): boolean => {
    const mobileRegex = /^\+91[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const updateField = (field: string, value: any) => {
    if (field === 'age') {
      const ageValue = value.replace(/\D/g, '').slice(0, 2);
      setProfileData(prev => ({ ...prev, [field]: ageValue }));
      setAgeError(ageValue.length > 0 && ageValue.length !== 2);
    } else if (field === 'mobileNumber') {
      let mobileValue = value;
      
      if (!mobileValue.startsWith('+91') && mobileValue.length > 0) {
        mobileValue = '+91' + mobileValue.replace(/\D/g, '');
      }
      
      if (mobileValue.startsWith('+91')) {
        const digitsAfter = mobileValue.slice(3).replace(/\D/g, '').slice(0, 10);
        mobileValue = '+91' + digitsAfter;
      }
      
      setProfileData(prev => ({ ...prev, [field]: mobileValue }));
      
      if (mobileValue.length > 0 && !validateMobileNumber(mobileValue)) {
        setMobileError(mobileValue.length < 13 ? 'Must be 13 characters' : 'Invalid format');
      } else {
        setMobileError('');
      }
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleComplete = () => {
    if (!profileData.firstName || !profileData.age || !profileData.gender || !profileData.avatarId || !profileData.mobileNumber) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (!validateMobileNumber(profileData.mobileNumber)) {
      toast.error('Please enter a valid mobile number');
      return;
    }
    
    if (ageError) {
      toast.error('Age must be 2 digits');
      return;
    }
    
    onComplete(profileData);
    toast.success('Profile completed! ☕');
  };

  return (
    <div 
      className="relative w-full min-h-screen" 
      style={{ 
        backgroundImage: "linear-gradient(130.551deg, rgb(139, 89, 83) 2.2799%, rgb(217, 191, 159) 40.897%, rgb(139, 89, 83) 88.328%), linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%)" 
      }}
    >
      <div className="box-border content-stretch flex flex-col items-start pb-0 pt-[32px] px-4 md:px-[127.6px] relative w-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative w-full max-w-[600px] mx-auto">
          {/* Header */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative w-full">
            <div className="h-[36px] relative w-full">
              <p className="absolute font-['Archivo_Black',sans-serif] leading-[36px] left-1/2 text-[#2c1810] text-[30px] text-center text-nowrap top-[-2.6px] -translate-x-1/2 whitespace-pre">Complete Profile</p>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white relative rounded-[16px] w-full border-[0.8px] border-[rgba(139,69,19,0.15)]">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[20px] items-start p-6 relative w-full">
              
              {/* Profile Picture Preview */}
              <div className="flex justify-center w-full">
                {profileData.avatarId && (profileData.gender === 'male' || profileData.gender === 'female') ? (
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-5xl bg-gradient-to-br from-[#e8d5c4] to-[#d9bf9d] border-4 border-[#be9d80] shadow-lg">
                      {getAvatarById(profileData.avatarId)?.emoji}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-[#be9d80] rounded-full p-1.5 border-2 border-white">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                ) : (
                  <GenderAvatar 
                    photo=""
                    gender={profileData.gender}
                    name={profileData.firstName}
                    size="2xl"
                    showBorder={true}
                  />
                )}
              </div>

              {/* Full Name */}
              <div className="content-stretch flex flex-col gap-[6px] items-start w-full">
                <p className="font-['Arial',sans-serif] leading-[14px] text-[#2c1810] text-[14px]">Full Name *</p>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-[#fff8f0] h-[40px] rounded-[10px] w-full px-[14px] py-[4px] font-['Arial',sans-serif] text-[14px] text-[#2c1810] placeholder:text-[#6b4423] border-[0.8px] border-[rgba(0,0,0,0)] focus:outline-none focus:border-[#be9d80]"
                />
              </div>

              {/* Age & Gender Row */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Age */}
                <div className="content-stretch flex flex-col gap-[6px] items-start">
                  <p className="font-['Arial',sans-serif] leading-[14px] text-[#2c1810] text-[14px]">Age *</p>
                  <div className="relative w-full">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={profileData.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      placeholder="25"
                      maxLength={2}
                      className={`bg-[#fff8f0] h-[40px] rounded-[10px] w-full px-[14px] pr-[36px] py-[4px] font-['Arial',sans-serif] text-[14px] text-[#2c1810] placeholder:text-[#6b4423] border-[0.8px] focus:outline-none ${
                        ageError ? 'border-red-500' : 'border-[rgba(0,0,0,0)] focus:border-[#be9d80]'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Hash className="w-4 h-4 text-[#6b4423]" opacity={0.5} />
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="content-stretch flex flex-col gap-[6px] items-start">
                  <p className="font-['Arial',sans-serif] leading-[14px] text-[#2c1810] text-[14px]">Gender *</p>
                  <div className="relative w-full">
                    <select
                      value={profileData.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                      className="bg-[#fff8f0] h-[40px] rounded-[10px] w-full px-[14px] py-[4px] font-['Arial',sans-serif] text-[14px] text-[#2c1810] border-[0.8px] border-[rgba(0,0,0,0)] appearance-none focus:outline-none focus:border-[#be9d80]"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6L8 10L12 6" stroke="#6B4423" strokeOpacity="0.5" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="content-stretch flex flex-col gap-[6px] items-start w-full">
                <p className="font-['Arial',sans-serif] leading-[14px] text-[#2c1810] text-[14px]">Avatar *</p>
                
                {/* Quick Avatar Selection */}
                <div className="flex gap-3 items-center w-full">
                  {/* Male Avatar */}
                  <div 
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all cursor-pointer ${
                      profileData.gender === 'male' 
                        ? 'bg-[#e8d5c4] ring-2 ring-[#be9d80]' 
                        : 'bg-[#fff8f0] opacity-40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-xl">
                      👨
                    </div>
                    <p className="text-[10px] font-['Arial',sans-serif] text-[#2c1810]">Male</p>
                  </div>

                  {/* Female Avatar */}
                  <div 
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all cursor-pointer ${
                      profileData.gender === 'female' 
                        ? 'bg-[#e8d5c4] ring-2 ring-[#be9d80]' 
                        : 'bg-[#fff8f0] opacity-40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-200 text-xl">
                      👩
                    </div>
                    <p className="text-[10px] font-['Arial',sans-serif] text-[#2c1810]">Female</p>
                  </div>

                  {/* Other Avatar */}
                  <div 
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all cursor-pointer ${
                      profileData.gender === 'other' 
                        ? 'bg-[#e8d5c4] ring-2 ring-[#be9d80]' 
                        : 'bg-[#fff8f0] opacity-40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 text-xl">
                      👤
                    </div>
                    <p className="text-[10px] font-['Arial',sans-serif] text-[#2c1810]">Other</p>
                  </div>

                  {/* Custom Button */}
                  <button 
                    onClick={() => setShowAvatarModal(true)}
                    disabled={!profileData.gender || (profileData.gender !== 'male' && profileData.gender !== 'female')}
                    className="flex-1 bg-white border-2 border-[#be9d80] text-[#6b4423] px-3 py-2 rounded-[8px] font-['Arial',sans-serif] text-[13px] hover:bg-[#fff8f0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    🎨 Custom
                  </button>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="content-stretch flex flex-col gap-[6px] items-start w-full">
                <p className="font-['Arial',sans-serif] leading-[14px] text-[#2c1810] text-[14px]">Mobile *</p>
                <div className="relative w-full">
                  <input
                    type="tel"
                    inputMode="tel"
                    value={profileData.mobileNumber}
                    onChange={(e) => updateField('mobileNumber', e.target.value)}
                    placeholder="+919876543210"
                    maxLength={13}
                    className={`bg-[#fff8f0] h-[40px] rounded-[10px] w-full px-[14px] pr-[36px] py-[4px] font-['Arial',sans-serif] text-[14px] text-[#2c1810] placeholder:text-[#6b4423] border-[0.8px] focus:outline-none ${
                      mobileError ? 'border-red-500' : 'border-[rgba(0,0,0,0)] focus:border-[#be9d80]'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Phone className="w-4 h-4 text-[#6b4423]" opacity={0.5} />
                  </div>
                </div>
                {mobileError && (
                  <p className="font-['Arial',sans-serif] text-[11px] text-red-500">{mobileError}</p>
                )}
              </div>

              {/* Save Button */}
              <button 
                onClick={handleComplete}
                className="bg-[#be9d80] hover:bg-[#a88968] h-[44px] rounded-[10px] w-full text-white font-['Arial',sans-serif] text-[15px] text-center flex items-center justify-center transition-colors shadow-sm"
              >
                Save Profile ✨
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[600px] max-h-[80vh] overflow-y-auto border-[0.8px] border-[rgba(139,69,19,0.15)]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-3 border-b border-[rgba(139,69,19,0.1)]">
                <h3 className="font-['Arial',sans-serif] text-[18px] text-[#2c1810]">Choose Avatar</h3>
                <button 
                  onClick={() => setShowAvatarModal(false)}
                  className="text-[#6b4423] hover:text-[#2c1810] transition-colors text-xl"
                >
                  ✕
                </button>
              </div>
              
              {(profileData.gender === 'male' || profileData.gender === 'female') && (
                <div className="space-y-6">
                  {getCategoriesByGender(profileData.gender as 'male' | 'female').map(category => {
                    const avatars = getAvatarsByCategory(profileData.gender as 'male' | 'female', category);
                    return (
                      <div key={category}>
                        <h4 className="font-['Arial',sans-serif] text-[13px] text-[#2c1810] mb-3 flex items-center gap-2">
                          <span className="bg-[#e8d5c4] px-2 py-1 rounded-md">{category}</span>
                        </h4>
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                          {avatars.map(avatar => (
                            <button
                              key={avatar.id}
                              onClick={() => {
                                updateField('avatarId', avatar.id);
                                setShowAvatarModal(false);
                                toast.success('Avatar selected!');
                              }}
                              className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all hover:scale-105 ${
                                profileData.avatarId === avatar.id
                                  ? 'bg-[#e8d5c4] ring-2 ring-[#be9d80]'
                                  : 'bg-[#fff8f0] hover:bg-[#e8d5c4]'
                              }`}
                            >
                              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-2xl bg-white">
                                {avatar.emoji}
                              </div>
                              {profileData.avatarId === avatar.id && (
                                <div className="absolute top-1 right-1 bg-[#be9d80] rounded-full p-0.5">
                                  <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
