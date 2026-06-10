import { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, Trash2, Camera, Bell, Shield, Moon, Sun, ChevronRight, Edit3, X, Check, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner';
import { getAvatarById, avatarData } from '../utils/avatarData';
import { BASE_URL } from '../utils/api';
import { safeStorage } from '../utils/safeStorage';

interface SettingsProps {
  onNavigate: (page: string) => void;
  user: any;
  onUpdateUser: (user: any) => void;
  onLogout: () => void;
}

export default function Settings({ onNavigate, user, onUpdateUser, onLogout }: SettingsProps) {
  // Screen States
  const [showAvatarGrid, setShowAvatarGrid] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // Edit Profile States
  const [editName, setEditName] = useState(user?.name || '');
  const [editAge, setEditAge] = useState(user?.age?.toString() || '');
  const [editCity, setEditCity] = useState(user?.city || '');
  const [editPhone, setEditPhone] = useState(user?.mobileNumber || '');
  const [isSaving, setIsSaving] = useState(false);

  // Toggles
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  const [meetupNotify, setMeetupNotify] = useState(() => safeStorage.getItem('notify_meetups') !== 'false');
  const [cafeNotify, setCafeNotify] = useState(() => safeStorage.getItem('notify_cafes') !== 'false');
  const [feedbackNotify, setFeedbackNotify] = useState(() => safeStorage.getItem('notify_feedbacks') !== 'false');

  // Sync Dark Mode state
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      safeStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      safeStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleUpdateAvatar = async (avatarId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/profile/${user.id || user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarId })
      });
      
      if (!response.ok) throw new Error('Failed to update avatar in database.');

      const data = await response.json();
      
      // Update app state & localStorage
      if (onUpdateUser && data.user) {
        onUpdateUser({
          ...user,
          avatarId: avatarId
        });
      }

      toast.success('Anime avatar updated successfully! 🎉');
      setShowAvatarGrid(false);
    } catch (err: any) {
      console.error('Avatar update failed:', err);
      toast.error('Could not save avatar changes.');
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${BASE_URL}/api/user/profile/${user.id || user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editName.trim(),
          lastName: '',
          age: parseInt(editAge) || 0,
          city: editCity.trim(),
          mobileNumber: editPhone.trim()
        })
      });

      if (!response.ok) throw new Error('Profile update failed.');

      const data = await response.json();

      if (onUpdateUser && data.user) {
        onUpdateUser({
          ...user,
          name: editName.trim(),
          firstName: editName.trim(),
          age: parseInt(editAge) || 0,
          city: editCity.trim(),
          mobileNumber: editPhone.trim()
        });
      }

      toast.success('Profile details updated! ☕');
      setShowEditProfile(false);
    } catch (err: any) {
      console.error('Profile save error:', err);
      toast.error('Failed to sync details to database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotifications = (type: 'meetups' | 'cafes' | 'feedbacks', val: boolean) => {
    if (type === 'meetups') {
      setMeetupNotify(val);
      safeStorage.setItem('notify_meetups', val.toString());
    } else if (type === 'cafes') {
      setCafeNotify(val);
      safeStorage.setItem('notify_cafes', val.toString());
    } else {
      setFeedbackNotify(val);
      safeStorage.setItem('notify_feedbacks', val.toString());
    }
    toast.success('Notification preferences updated!');
  };

  const handleDeleteAccount = () => {
    toast.success('Account deletion request submitted. You will receive a confirmation email.');
    setTimeout(() => {
      onLogout();
    }, 2000);
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    onLogout();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen w-full pb-20 transition-all duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="size-6 text-neutral-900 dark:text-white" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white font-['Arial:Bold',sans-serif]">
            App Settings
          </h1>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Profile Card */}
        <Card className="bg-white dark:bg-slate-800 p-6 rounded-[24px] shadow-sm flex flex-col items-center text-center border border-white/10">
          <div className="relative mb-4 group">
            {user?.avatarId && (user?.gender === 'male' || user?.gender === 'female') ? (
              <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-5xl bg-gradient-to-br from-[#e8d5c4] to-[#d9bf9d] border-4 border-[#be9d80] shadow-lg">
                {getAvatarById(user.avatarId)?.emoji}
              </div>
            ) : (
              <Avatar className="w-24 h-24 border-4 border-slate-100 dark:border-slate-700 shadow-sm">
                <AvatarImage src={user?.photo} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-[#e8d5c4] to-[#d9bf9d] text-[#8b5943] text-3xl font-medium">
                  {user?.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
            <button 
              onClick={() => setShowAvatarGrid(true)}
              className="absolute bottom-0 right-0 bg-[#be9d80] hover:bg-[#a88968] text-white p-2.5 rounded-full transition-all shadow-md active:scale-95"
            >
              <Camera className="size-4" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-neutral-950 dark:text-white mb-1">
            {user?.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{user?.email}</p>
          {user?.mobileNumber && (
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{user?.mobileNumber}</p>
          )}
        </Card>

        {/* Premium Settings Lists */}
        <div className="bg-white dark:bg-slate-800 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
          {/* Edit Profile */}
          <button 
            onClick={() => setShowEditProfile(true)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Edit3 className="size-5 text-[#be9d80]" />
              <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">Edit Profile Info</span>
            </div>
            <ChevronRight className="size-5 text-slate-400" />
          </button>

          {/* Change Avatar */}
          <button 
            onClick={() => setShowAvatarGrid(true)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎭</span>
              <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">Change Anime Avatar</span>
            </div>
            <ChevronRight className="size-5 text-slate-400" />
          </button>

          {/* Notification Settings */}
          <button 
            onClick={() => setShowNotificationDrawer(true)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Bell className="size-5 text-indigo-500" />
              <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">Push Notifications</span>
            </div>
            <ChevronRight className="size-5 text-slate-400" />
          </button>

          {/* Dark Mode Support */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="size-5 text-indigo-400" /> : <Sun className="size-5 text-amber-500" />}
              <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">Dark Mode Support</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={(e) => setDarkMode(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-750 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#be9d80]"></div>
            </label>
          </div>

          {/* Privacy Policy */}
          <button 
            onClick={() => setShowPrivacyPolicy(true)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Shield className="size-5 text-green-500" />
              <span className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base">Privacy Policy & Info</span>
            </div>
            <ChevronRight className="size-5 text-slate-400" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-14 rounded-2xl text-base font-bold flex items-center justify-center gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-neutral-800 dark:text-white transition-colors"
          >
            <LogOut className="size-5 text-red-500" />
            Logout Session
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="w-full h-14 rounded-2xl text-base font-bold flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-all shadow-sm"
              >
                <Trash2 className="size-5" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl max-w-[90vw] sm:max-w-md bg-white dark:bg-slate-800 border-none">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-base mt-2 dark:text-slate-300">
                  This action cannot be undone. This will permanently delete your Caffélino account and remove all personal feedback, meetups, and profiles.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 flex gap-3">
                <AlertDialogCancel className="h-12 rounded-xl text-base font-medium border-slate-200 dark:border-slate-700 dark:text-white dark:bg-slate-800">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount} 
                  className="h-12 rounded-xl text-base font-medium bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* 🎭 PREMIUM ANIME AVATAR SELECTOR OVERLAY */}
      {showAvatarGrid && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[28px] max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b dark:border-slate-700">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Choose Anime Avatar</h3>
              <button 
                onClick={() => setShowAvatarGrid(false)}
                className="p-1 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="size-5 text-neutral-700 dark:text-white" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 p-1">
              {avatarData.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleUpdateAvatar(avatar.id)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl bg-gradient-to-br from-slate-100 to-slate-200/50 hover:scale-105 active:scale-95 transition-all shadow border ${
                    user?.avatarId === avatar.id ? 'border-4 border-[#be9d80] scale-110 shadow-lg' : 'border-transparent'
                  }`}
                  title={avatar.name}
                >
                  {avatar.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ✏️ EDIT PROFILE OVERLAY */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[28px] max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center pb-2 border-b dark:border-slate-700">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Edit Profile Details</h3>
              <button 
                onClick={() => setShowEditProfile(false)}
                className="p-1 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="size-5 text-neutral-700 dark:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-700 rounded-xl text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  value={editPhone} 
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-700 rounded-xl text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Age</label>
                  <input 
                    type="number" 
                    value={editAge} 
                    onChange={(e) => setEditAge(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-700 rounded-xl text-neutral-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">City</label>
                  <input 
                    type="text" 
                    value={editCity} 
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-700 rounded-xl text-neutral-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowEditProfile(false)}
                className="flex-1 rounded-xl h-12"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 bg-[#be9d80] text-white hover:bg-[#a88968] rounded-xl h-12 flex justify-center items-center gap-1.5"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Check className="size-4" />
                    Save Details
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 🔔 PUSH NOTIFICATION SETTINGS DRAWER */}
      {showNotificationDrawer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[28px] max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center pb-2 border-b dark:border-slate-700">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Bell className="size-5 text-indigo-500" />
                Notification Options
              </h3>
              <button 
                onClick={() => setShowNotificationDrawer(false)}
                className="p-1 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="size-5 text-neutral-700 dark:text-white" />
              </button>
            </div>

            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">Meetup Reminders</h4>
                  <p className="text-xs text-slate-500">Alert me when a meetup date or voting ends.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={meetupNotify} 
                    onChange={(e) => handleToggleNotifications('meetups', e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">Cafe Updates</h4>
                  <p className="text-xs text-slate-500">Notification of new items and partner menus.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={cafeNotify} 
                    onChange={(e) => handleToggleNotifications('cafes', e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">Feedback Alerts</h4>
                  <p className="text-xs text-slate-500">Notify when other users post feedback comments.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={feedbackNotify} 
                    onChange={(e) => handleToggleNotifications('feedbacks', e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                </label>
              </div>
            </div>

            <Button 
              onClick={() => setShowNotificationDrawer(false)}
              className="w-full bg-slate-900 text-white rounded-xl h-12"
            >
              Close Preferences
            </Button>
          </div>
        </div>
      )}

      {/* 🛡️ PRIVACY POLICY OVERLAY */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[28px] max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b dark:border-slate-700">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Shield className="size-5 text-green-500" />
                Caffélino Privacy Policy
              </h3>
              <button 
                onClick={() => setShowPrivacyPolicy(false)}
                className="p-1 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="size-5 text-neutral-700 dark:text-white" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-650 dark:text-slate-300 leading-relaxed py-2">
              <p>
                At Caffélino, your privacy is our utmost priority. This policy outlines how we gather, utilize, and protect your information when running the mobile application.
              </p>
              
              <div className="space-y-1">
                <h4 className="font-bold text-[#be9d80]">1. What Data We Store</h4>
                <p className="text-xs">
                  We collect your Full Name, Mobile Number, and anime avatar preference during phone registration. This data is securely stored inside MongoDB Atlas database clusters.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-[#be9d80]">2. Secure User Sessions</h4>
                <p className="text-xs">
                  User accounts are verified via a one-time passcode (OTP). Successful logins return a cryptographically signed JWT token stored natively to protect API requests.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-[#be9d80]">3. Push Notification Events</h4>
                <p className="text-xs">
                  We trigger local/push notifications only for vital events such as meetup billing, booking validations, or community reviews.
                </p>
              </div>

              <p className="text-xs border-t pt-3 border-slate-150 dark:border-slate-700 italic">
                Last Updated: May 2026. For inquiries, email support@caffelino.app.
              </p>
            </div>

            <Button 
              onClick={() => setShowPrivacyPolicy(false)}
              className="w-full bg-[#be9d80] text-white hover:bg-[#a88968] rounded-xl h-12"
            >
              I Understand
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
