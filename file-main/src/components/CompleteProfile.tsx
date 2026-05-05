import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { getAvatarsByGender, getCategoriesByGender, getAvatarsByCategory, getAvatarById, type AvatarOption } from '../utils/avatarData';

interface CompleteProfileProps {
  user: any;
  onComplete: (profileData: any) => void;
}

export default function CompleteProfile({ user, onComplete }: CompleteProfileProps) {
  const [profileData, setProfileData] = useState({
    firstName: '',
    gender: '',
    avatarId: '',
  });

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

  const updateField = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    if (!profileData.firstName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!profileData.gender) {
      toast.error('Please select your gender');
      return;
    }
    if (!profileData.avatarId) {
      toast.error('Please choose an avatar');
      return;
    }

    onComplete(profileData);
    toast.success('Profile completed! ☕');
  };

  const genderOptions = [
    { value: 'male', label: 'Male', emoji: '👨', gradient: 'from-blue-100 to-blue-200' },
    { value: 'female', label: 'Female', emoji: '👩', gradient: 'from-pink-100 to-pink-200' },
    { value: 'other', label: 'Other', emoji: '👤', gradient: 'from-indigo-100 to-purple-100' },
  ];

  return (
    <div
      className="complete-profile-wrapper"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        background: 'linear-gradient(160deg, #f8f4f0 0%, #efe6dd 40%, #e8d8ca 100%)',
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Main Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 8px 40px rgba(139, 89, 83, 0.1), 0 2px 12px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #c4956c, #d4a97a, #be9d80)',
          }}
        />

        <div style={{ padding: '36px 28px 32px' }}>
          {/* Avatar Preview */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            {profileData.avatarId && (profileData.gender === 'male' || profileData.gender === 'female') ? (
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    background: 'linear-gradient(135deg, #f0e4d8, #e8d5c4)',
                    border: '3px solid #d4b896',
                    boxShadow: '0 4px 16px rgba(190, 157, 128, 0.25)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {getAvatarById(profileData.avatarId)?.emoji}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    background: '#be9d80',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fff',
                  }}
                >
                  <Check style={{ width: '12px', height: '12px', color: '#fff' }} />
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  background: 'linear-gradient(135deg, #f0e4d8, #e8d5c4)',
                  border: '3px solid #e0d0c0',
                  boxShadow: '0 4px 16px rgba(190, 157, 128, 0.15)',
                  color: '#b89f88',
                }}
              >
                {profileData.gender === 'male' ? '👨' : profileData.gender === 'female' ? '👩' : profileData.gender === 'other' ? '👤' : '😊'}
              </div>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              textAlign: 'center',
              fontSize: '22px',
              fontWeight: '700',
              color: '#2c1810',
              margin: '0 0 4px',
              letterSpacing: '-0.3px',
            }}
          >
            Complete Your Profile
          </h1>
          <p
            style={{
              textAlign: 'center',
              fontSize: '13px',
              color: '#8b7355',
              margin: '0 0 28px',
            }}
          >
            Just a few details to get started
          </p>

          {/* Full Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#4a3728',
                marginBottom: '6px',
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              placeholder="Enter your full name"
              style={{
                width: '100%',
                height: '44px',
                padding: '0 14px',
                fontSize: '14px',
                color: '#2c1810',
                background: '#faf7f4',
                border: '1.5px solid #e8ddd2',
                borderRadius: '12px',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#c4956c';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(196, 149, 108, 0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e8ddd2';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Gender Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#4a3728',
                marginBottom: '8px',
              }}
            >
              Gender
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateField('gender', option.value);
                    // Reset avatar when switching gender
                    if (option.value === 'other') {
                      updateField('avatarId', 'other-default');
                    } else if (option.value !== profileData.gender) {
                      setProfileData(prev => ({ ...prev, gender: option.value, avatarId: '' }));
                    }
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '12px 8px',
                    borderRadius: '14px',
                    border: profileData.gender === option.value
                      ? '2px solid #be9d80'
                      : '1.5px solid #e8ddd2',
                    background: profileData.gender === option.value
                      ? 'linear-gradient(135deg, #faf2ea, #f0e4d8)'
                      : '#faf7f4',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    transform: profileData.gender === option.value ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: profileData.gender === option.value
                      ? '0 2px 12px rgba(190, 157, 128, 0.2)'
                      : 'none',
                  }}
                >
                  <span style={{ fontSize: '24px', lineHeight: 1 }}>{option.emoji}</span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: profileData.gender === option.value ? '600' : '500',
                      color: profileData.gender === option.value ? '#4a3728' : '#8b7355',
                    }}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Selection */}
          <div style={{ marginBottom: '28px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#4a3728',
                marginBottom: '8px',
              }}
            >
              Choose Avatar
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Male Avatar Chip */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 10px',
                  borderRadius: '12px',
                  background: profileData.gender === 'male'
                    ? 'linear-gradient(135deg, #e8f0fb, #d8e6f8)'
                    : '#f5f2ef',
                  border: profileData.gender === 'male' ? '1.5px solid #a8c4e0' : '1px solid transparent',
                  opacity: profileData.gender === 'male' ? 1 : 0.4,
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                  }}
                >
                  👨
                </div>
                <span style={{ fontSize: '10px', color: '#4a5568', fontWeight: '500' }}>Male</span>
              </div>

              {/* Female Avatar Chip */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 10px',
                  borderRadius: '12px',
                  background: profileData.gender === 'female'
                    ? 'linear-gradient(135deg, #fce7f3, #fbcfe8)'
                    : '#f5f2ef',
                  border: profileData.gender === 'female' ? '1.5px solid #f0abcf' : '1px solid transparent',
                  opacity: profileData.gender === 'female' ? 1 : 0.4,
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
                  }}
                >
                  👩
                </div>
                <span style={{ fontSize: '10px', color: '#4a5568', fontWeight: '500' }}>Female</span>
              </div>

              {/* Other Avatar Chip */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 10px',
                  borderRadius: '12px',
                  background: profileData.gender === 'other'
                    ? 'linear-gradient(135deg, #e8e0f8, #ddd6f3)'
                    : '#f5f2ef',
                  border: profileData.gender === 'other' ? '1.5px solid #c4b5e0' : '1px solid transparent',
                  opacity: profileData.gender === 'other' ? 1 : 0.4,
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                  }}
                >
                  👤
                </div>
                <span style={{ fontSize: '10px', color: '#4a5568', fontWeight: '500' }}>Other</span>
              </div>

              {/* Custom Button */}
              <button
                onClick={() => setShowAvatarModal(true)}
                disabled={!profileData.gender || (profileData.gender !== 'male' && profileData.gender !== 'female')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  height: '66px',
                  borderRadius: '12px',
                  border: '1.5px dashed #c4956c',
                  background: '#fffcf9',
                  color: '#8b6f4e',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: (!profileData.gender || (profileData.gender !== 'male' && profileData.gender !== 'female'))
                    ? 'not-allowed'
                    : 'pointer',
                  opacity: (!profileData.gender || (profileData.gender !== 'male' && profileData.gender !== 'female'))
                    ? 0.4
                    : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                🎨 Custom
              </button>
            </div>
          </div>

          {/* Save Profile Button */}
          <button
            onClick={handleComplete}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #c4956c, #be9d80)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              letterSpacing: '0.3px',
              boxShadow: '0 4px 14px rgba(190, 157, 128, 0.35)',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(190, 157, 128, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(190, 157, 128, 0.35)';
            }}
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Custom Avatar Modal */}
      {showAvatarModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAvatarModal(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '75vh',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                borderBottom: '1px solid #f0e8df',
              }}
            >
              <h3
                style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#2c1810',
                  margin: 0,
                }}
              >
                Choose Your Avatar
              </h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#f5f0eb',
                  color: '#6b4423',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ece3d8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f0eb')}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', maxHeight: 'calc(75vh - 62px)' }}>
              {(profileData.gender === 'male' || profileData.gender === 'female') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {getCategoriesByGender(profileData.gender as 'male' | 'female').map(category => {
                    const avatars = getAvatarsByCategory(profileData.gender as 'male' | 'female', category);
                    return (
                      <div key={category}>
                        <div
                          style={{
                            display: 'inline-block',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#6b4423',
                            background: '#f5efe8',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            marginBottom: '12px',
                          }}
                        >
                          {category}
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: '8px',
                          }}
                        >
                          {avatars.map(avatar => (
                            <button
                              key={avatar.id}
                              onClick={() => {
                                updateField('avatarId', avatar.id);
                                setShowAvatarModal(false);
                                toast.success('Avatar selected!');
                              }}
                              style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '10px 4px',
                                borderRadius: '12px',
                                border: profileData.avatarId === avatar.id
                                  ? '2px solid #be9d80'
                                  : '1.5px solid transparent',
                                background: profileData.avatarId === avatar.id
                                  ? '#f5efe8'
                                  : '#faf7f4',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <div
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '22px',
                                  background: '#ffffff',
                                }}
                              >
                                {avatar.emoji}
                              </div>
                              {profileData.avatarId === avatar.id && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: '#be9d80',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Check style={{ width: '10px', height: '10px', color: '#fff' }} />
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

      {/* Keyframe animation for modal */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .complete-profile-wrapper input::placeholder {
          color: #b8a494;
        }
      `}</style>
    </div>
  );
}
