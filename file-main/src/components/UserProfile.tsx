import { ArrowLeft, Settings, Star, Users, Calendar, Shield, MapPin, Coffee, Heart, Clock, Instagram, Linkedin, Phone, Edit2, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { useState, useEffect } from 'react';
import GenderAvatar from './GenderAvatar';
import { getAvatarById } from '../utils/avatarData';
import { toast } from 'sonner';

interface UserProfileProps {
  user: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onUpdateUser?: (userData: any) => void;
}



export default function UserProfile({ user, onNavigate, onLogout, onUpdateUser }: UserProfileProps) {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user.mobileNumber || '');
  const [phoneError, setPhoneError] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState(user.name || '');
  const [nameError, setNameError] = useState('');
  
  // Update phone number state when user changes
  useEffect(() => {
    setPhoneNumber(user.mobileNumber || '');
  }, [user.mobileNumber]);
  
  // Update name state when user changes
  useEffect(() => {
    setUserName(user.name || '');
  }, [user.name]);
  
  if (!user) {
    return null;
  }

  const trustLevel = 70;
  const totalMeetups = 0; // TODO: fetch real count from API

  const validatePhoneNumber = (value: string) => {
    // Remove +91 prefix for validation
    const numberPart = value.replace('+91', '').trim();
    
    // Check if contains non-numeric characters
    if (numberPart && !/^\d*$/.test(numberPart)) {
      setPhoneError('Phone number can only contain digits');
      return false;
    }
    
    // Check if length is not 10
    if (numberPart.length > 0 && numberPart.length < 10) {
      setPhoneError('Phone number must be exactly 10 digits');
      return false;
    }
    
    if (numberPart.length > 10) {
      setPhoneError('Phone number cannot exceed 10 digits');
      return false;
    }
    
    setPhoneError('');
    return numberPart.length === 10;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Always ensure +91 prefix
    if (!value.startsWith('+91')) {
      value = '+91' + value.replace(/^\+91/, '');
    }
    
    // Extract only the number part after +91
    const numberPart = value.substring(3);
    
    // Only allow digits and limit to 10
    const cleanNumber = numberPart.replace(/\D/g, '').substring(0, 10);
    
    const finalValue = '+91' + cleanNumber;
    setPhoneNumber(finalValue);
    validatePhoneNumber(finalValue);
  };

  const isPhoneValid = () => {
    const numberPart = phoneNumber.replace('+91', '').trim();
    return numberPart.length === 10 && /^\d{10}$/.test(numberPart);
  };

  const handleSavePhone = () => {
    if (!isPhoneValid()) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Update user data
    if (onUpdateUser) {
      onUpdateUser({ ...user, mobileNumber: phoneNumber });
    }
    
    setIsEditingPhone(false);
    setPhoneError('');
    toast.success('Phone number updated successfully');
  };

  const handleCancelPhoneEdit = () => {
    setPhoneNumber(user.mobileNumber || '');
    setPhoneError('');
    setIsEditingPhone(false);
  };

  const handleStartEditing = () => {
    // Initialize with +91 if no number exists
    if (!user.mobileNumber || user.mobileNumber.trim() === '') {
      setPhoneNumber('+91');
    }
    setIsEditingPhone(true);
  };
  
  const validateName = (value: string) => {
    // Check if name is empty
    if (!value.trim()) {
      setNameError('Name cannot be empty');
      return false;
    }
    
    // Check if name contains only alphabets and spaces
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      setNameError('Name can only contain alphabets and spaces');
      return false;
    }
    
    setNameError('');
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);
    validateName(value);
  };

  const isNameValid = () => {
    return !nameError && userName.trim() !== '';
  };

  const handleSaveName = () => {
    if (!isNameValid()) {
      setNameError('Please enter a valid name');
      return;
    }
    
    // Update user data - update both name and firstName to ensure header updates
    if (onUpdateUser) {
      onUpdateUser({ 
        ...user, 
        name: userName,
        firstName: userName // Also update firstName for header display
      });
    }
    
    setIsEditingName(false);
    setNameError('');
    toast.success('Name updated successfully');
  };

  const handleCancelNameEdit = () => {
    setUserName(user.name || '');
    setNameError('');
    setIsEditingName(false);
  };

  const handleStartNameEditing = () => {
    setIsEditingName(true);
  };
  
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('home')}
          className="caffelino-back-btn mb-4"
        >
          ← Back
        </button>

        {/* Profile Header Card */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              {/* Show custom avatar if selected, otherwise fallback to GenderAvatar */}
              {user.avatarId && (user.gender === 'male' || user.gender === 'female') ? (
                <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-6xl bg-gradient-to-br from-[#e8d5c4] to-[#d9bf9d] border-4 border-[#be9d80] shadow-lg">
                  {getAvatarById(user.avatarId)?.emoji}
                </div>
              ) : (
                <GenderAvatar 
                  photo={user.photo}
                  gender={user.gender}
                  name={user.name}
                  size="xl"
                  showBorder={true}
                />
              )}
              {user.cafeMood && (
                <span className="absolute -bottom-1 -right-1 text-2xl bg-white rounded-full p-1 shadow-sm">
                  {user.cafeMood}
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl">{user.name}, {user.age}</h1>
                    {user.verified && (
                      <span className="text-green-600" title="Verified">✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.city}{user.locality ? `, ${user.locality}` : ''}</span>
                  </div>
                  {user.gender && (
                    <p className="text-sm text-slate-500 capitalize">{user.gender}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>4.8</span>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => onNavigate('settings')}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Settings className="w-4 h-4 mr-2 text-white" />
                  Settings
                </Button>
              </div>

              {user.bio && (
                <p className="text-slate-700 mb-4">{user.bio}</p>
              )}

              {user.favoriteDrink && (
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <Coffee className="w-4 h-4 text-orange-600" />
                  <span className="text-slate-600">Favorite: {user.favoriteDrink}</span>
                </div>
              )}

              {user.hobbies && user.hobbies.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-slate-500 mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {user.hobbies.map((hobby: string, i: number) => (
                      <Badge key={i} variant="secondary">{hobby}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Café Preferences Card */}
        {(user.cafeVibe || user.cuisinePreference || user.beverage) && (
          <Card className="p-6 mb-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-orange-600" />
              Café Preferences
            </h3>
            <div className="space-y-4">
              {user.cafeVibe && user.cafeVibe.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Favorite Vibes</p>
                  <div className="flex flex-wrap gap-2">
                    {user.cafeVibe.map((vibe: string, i: number) => (
                      <Badge key={i} variant="outline">{vibe}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {user.cuisinePreference && user.cuisinePreference.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Cuisine Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {user.cuisinePreference.map((cuisine: string, i: number) => (
                      <Badge key={i} variant="outline">{cuisine}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {user.beverage && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Beverage Preference</p>
                  <p className="capitalize">{user.beverage === 'both' ? 'Coffee & Tea' : user.beverage} {user.beverage === 'coffee' ? '☕' : user.beverage === 'tea' ? '🍵' : '☕🍵'}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Availability & Preferences Card */}
        {(user.availableDays || user.preferredTime || user.distance) && (
          <Card className="p-6 mb-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Availability & Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.availableDays && user.availableDays.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Available Days</p>
                  <div className="flex flex-wrap gap-1">
                    {user.availableDays.map((day: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">{day}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {user.preferredTime && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Preferred Time</p>
                  <p className="capitalize">{user.preferredTime}</p>
                </div>
              )}
              {user.distance && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Café Distance</p>
                  <p>Within {user.distance}</p>
                </div>
              )}
              {user.groupSize && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Group Size Preference</p>
                  <p className="capitalize">{user.groupSize} group</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Looking For Card */}
        {(user.lookingFor || user.purpose) && (
          <Card className="p-6 mb-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              What I'm Looking For
            </h3>
            <div className="space-y-4">
              {user.lookingFor && user.lookingFor.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Goals</p>
                  <div className="flex flex-wrap gap-2">
                    {user.lookingFor.map((goal: string, i: number) => (
                      <Badge key={i} variant="outline">{goal}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {user.purpose && user.purpose.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Here For</p>
                  <div className="flex flex-wrap gap-2">
                    {user.purpose.map((p: string, i: number) => (
                      <Badge key={i} variant="outline">{p}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Social Links */}
        {(user.instagram || user.linkedin) && (
          <Card className="p-6 mb-6">
            <h3 className="mb-4">Social Links</h3>
            <div className="flex flex-col gap-3">
              {user.instagram && (
                <a 
                  href={`https://instagram.com/${user.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-700 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span>{user.instagram}</span>
                </a>
              )}
              {user.linkedin && (
                <a 
                  href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
            </div>
          </Card>
        )}

        {/* Phone Number Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#be9d80]" />
              Phone Number
            </h3>
            {!isEditingPhone && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleStartEditing}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
          {isEditingPhone ? (
            <div className="space-y-3">
              <Input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="+91XXXXXXXXXX"
                className="w-full"
              />
              {phoneError && (
                <p className="text-red-500 text-sm">{phoneError}</p>
              )}
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={handleSavePhone}
                  disabled={!isPhoneValid()}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Save
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={handleCancelPhoneEdit}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-slate-700">
              {user.mobileNumber || 'No phone number added'}
            </p>
          )}
        </Card>

        {/* Name Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-[#be9d80]" />
              Name
            </h3>
            {!isEditingName && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleStartNameEditing}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
          {isEditingName ? (
            <div className="space-y-3">
              <Input
                type="text"
                value={userName}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className="w-full"
              />
              {nameError && (
                <p className="text-red-500 text-sm">{nameError}</p>
              )}
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={handleSaveName}
                  disabled={!isNameValid()}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Save
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={handleCancelNameEdit}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-slate-700">
              {user.name || 'No name added'}
            </p>
          )}
        </Card>

        {/* Trust & Verification */}
        <Card className="p-6 mb-6">
          <h3 className="mb-4">Verification & Trust</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Phone Verified</span>
              </div>
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Email Verified</span>
              </div>
              <span className="text-green-600">✓</span>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between mb-2">
                <span>Trust Level</span>
                <span>{trustLevel}%</span>
              </div>
              <Progress value={trustLevel} />
              <p className="text-sm text-slate-500 mt-2">
                Build trust by being an active member
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
