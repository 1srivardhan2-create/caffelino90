import { useState } from 'react';
import { ArrowLeft, User, Bell, Lock, CreditCard, Globe, HelpCircle, LogOut, Trash2, ChevronRight, Camera, Mail, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner';
import { getAvatarById } from '../utils/avatarData';

interface SettingsProps {
  onNavigate: (page: string) => void;
  user: any;
  onUpdateUser: (user: any) => void;
  onLogout: () => void;
}

type SettingsSection = 'main' | 'account' | 'notifications' | 'privacy' | 'preferences' | 'payment' | 'help';

export default function Settings({ onNavigate, user, onUpdateUser, onLogout }: SettingsProps) {
  const [currentSection, setCurrentSection] = useState<SettingsSection>('main');
  const [showPassword, setShowPassword] = useState(false);

  // Account Settings
  const [accountData, setAccountData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    meetupReminders: true,
    newMessages: true,
    groupInvites: true,
    promotionalEmails: false,
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', // public, friends, private
    showLocation: true,
    showAge: true,
    showEmail: false,
    allowMessages: true,
    allowGroupInvites: true,
  });

  // App Preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'light', // light, dark, auto
    currency: 'INR',
  });

  const handleAccountUpdate = () => {
    if (!accountData.name || !accountData.email) {
      toast.error('Name and email are required');
      return;
    }

    if (accountData.newPassword) {
      if (accountData.newPassword.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
      if (accountData.newPassword !== accountData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    onUpdateUser({
      ...user,
      name: accountData.name,
      email: accountData.email,
      phone: accountData.phone,
      city: accountData.city,
    });

    toast.success('Account settings updated successfully');
    setCurrentSection('main');
  };

  const handleNotificationUpdate = () => {
    toast.success('Notification preferences updated');
    setCurrentSection('main');
  };

  const handlePrivacyUpdate = () => {
    toast.success('Privacy settings updated');
    setCurrentSection('main');
  };

  const handlePreferencesUpdate = () => {
    toast.success('App preferences updated');
    setCurrentSection('main');
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

  // Main Settings Menu
  const renderMainMenu = () => (
    <div className="space-y-2">
      {/* Profile Card */}
      <Card className="bg-white p-6 rounded-[16px] shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {user?.avatarId && (user?.gender === 'male' || user?.gender === 'female') ? (
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-5xl bg-gradient-to-br from-[#e8d5c4] to-[#d9bf9d] border-4 border-[#be9d80] shadow-lg">
                {getAvatarById(user.avatarId)?.emoji}
              </div>
            ) : (
              <Avatar className="size-20">
                <AvatarImage src={user?.photo} />
                <AvatarFallback className="bg-gradient-to-br from-[#e8d5c4] to-[#d9bf9d] text-[#8b5943] text-xl">
                  {user?.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
            <button className="absolute bottom-0 right-0 bg-[#be9d80] text-white p-2 rounded-full hover:bg-[#a88968] transition-colors">
              <Camera className="size-3" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-[20px] leading-[28px] text-neutral-950">{user?.firstName || user?.name}</h3>
            <p className="text-[14px] text-slate-600">{user?.email}</p>
            {user?.verified && (
              <span className="inline-flex items-center gap-1 text-[12px] text-green-600 mt-1">
                ✓ Verified Account
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Settings Menu Items */}
      <SettingsMenuItem
        icon={<User className="size-5" />}
        title="Account Settings"
        description="Manage your personal information"
        onClick={() => setCurrentSection('account')}
      />

      <SettingsMenuItem
        icon={<Lock className="size-5" />}
        title="Privacy & Security"
        description="Control your privacy settings"
        onClick={() => setCurrentSection('privacy')}
      />

      <SettingsMenuItem
        icon={<CreditCard className="size-5" />}
        title="Payment Methods"
        description="Manage saved payment options"
        onClick={() => setCurrentSection('payment')}
      />

      <Separator className="my-4" />

      <SettingsMenuItem
        icon={<HelpCircle className="size-5" />}
        title="Help & Support"
        description="FAQs, contact us, feedback"
        onClick={() => setCurrentSection('help')}
      />

      <Separator className="my-4" />

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 p-4 rounded-[12px] hover:bg-red-50 transition-colors group"
      >
        <LogOut className="size-5 text-red-600" />
        <div className="flex-1 text-left">
          <h4 className="text-[16px] text-red-600">Logout</h4>
        </div>
      </button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="w-full flex items-center gap-3 p-4 rounded-[12px] hover:bg-red-50 transition-colors">
            <Trash2 className="size-5 text-red-600" />
            <div className="flex-1 text-left">
              <h4 className="text-[16px] text-red-600">Delete Account</h4>
            </div>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  // Account Settings Section
  const renderAccountSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-6">Personal Information</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-neutral-950 mb-2 block">
              Full Name
            </Label>
            <Input
              id="name"
              value={accountData.name}
              onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
              className="bg-slate-100 border-0 h-[44px] rounded-[8px]"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-neutral-950 mb-2 block">
              <Mail className="inline size-4 mr-1" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={accountData.email}
              onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
              className="bg-slate-100 border-0 h-[44px] rounded-[8px]"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-neutral-950 mb-2 block">
              <Phone className="inline size-4 mr-1" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={accountData.phone}
              onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
              className="bg-slate-100 border-0 h-[44px] rounded-[8px]"
            />
          </div>

          <div>
            <Label htmlFor="city" className="text-neutral-950 mb-2 block">
              <MapPin className="inline size-4 mr-1" />
              City
            </Label>
            <Input
              id="city"
              value={accountData.city}
              onChange={(e) => setAccountData({ ...accountData, city: e.target.value })}
              className="bg-slate-100 border-0 h-[44px] rounded-[8px]"
            />
          </div>
        </div>
      </Card>

      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-6">Change Password</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-neutral-950 mb-2 block">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={accountData.currentPassword}
              onChange={(e) => setAccountData({ ...accountData, currentPassword: e.target.value })}
              className="bg-slate-100 border-0 h-[44px] rounded-[8px]"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <Label htmlFor="newPassword" className="text-neutral-950 mb-2 block">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={accountData.newPassword}
                onChange={(e) => setAccountData({ ...accountData, newPassword: e.target.value })}
                className="bg-slate-100 border-0 h-[44px] rounded-[8px] pr-12"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-neutral-950"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-neutral-950 mb-2 block">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={accountData.confirmPassword}
              onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
              className="bg-slate-100 border-0 h-[44px] rounded-[8px]"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentSection('main')}
          className="flex-1 h-[44px] rounded-[8px]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleAccountUpdate}
          className="flex-1 h-[44px] bg-[#030213] hover:bg-[#030213]/90 rounded-[8px]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );

  // Notifications Settings Section
  const renderNotificationsSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-6">Notification Channels</h3>
        
        <div className="space-y-4">
          <SettingToggle
            label="Email Notifications"
            description="Receive notifications via email"
            checked={notifications.emailNotifications}
            onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
          />
          <SettingToggle
            label="Push Notifications"
            description="Receive push notifications on your device"
            checked={notifications.pushNotifications}
            onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
          />
          <SettingToggle
            label="SMS Notifications"
            description="Receive important updates via SMS"
            checked={notifications.smsNotifications}
            onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
          />
        </div>
      </Card>

      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-6">Notification Types</h3>
        
        <div className="space-y-4">
          <SettingToggle
            label="Meetup Reminders"
            description="Get reminded about upcoming meetups"
            checked={notifications.meetupReminders}
            onCheckedChange={(checked) => setNotifications({ ...notifications, meetupReminders: checked })}
          />
          <SettingToggle
            label="New Messages"
            description="Notifications for new chat messages"
            checked={notifications.newMessages}
            onCheckedChange={(checked) => setNotifications({ ...notifications, newMessages: checked })}
          />
          <SettingToggle
            label="Group Invites"
            description="Get notified when invited to groups"
            checked={notifications.groupInvites}
            onCheckedChange={(checked) => setNotifications({ ...notifications, groupInvites: checked })}
          />
          <SettingToggle
            label="Promotional Emails"
            description="Receive updates about offers and events"
            checked={notifications.promotionalEmails}
            onCheckedChange={(checked) => setNotifications({ ...notifications, promotionalEmails: checked })}
          />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentSection('main')}
          className="flex-1 h-[44px] rounded-[8px]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleNotificationUpdate}
          className="flex-1 h-[44px] bg-[#030213] hover:bg-[#030213]/90 rounded-[8px]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );

  // Privacy Settings Section
  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-6">Profile Privacy</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-neutral-950 mb-2 block">Profile Visibility</Label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
              className="w-full h-[44px] px-3 rounded-[8px] bg-slate-100 border-0"
            >
              <option value="public">Public - Everyone can see</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private - Only you</option>
            </select>
          </div>

          <SettingToggle
            label="Show Location"
            description="Display your city on your profile"
            checked={privacy.showLocation}
            onCheckedChange={(checked) => setPrivacy({ ...privacy, showLocation: checked })}
          />
          <SettingToggle
            label="Show Age"
            description="Display your age on your profile"
            checked={privacy.showAge}
            onCheckedChange={(checked) => setPrivacy({ ...privacy, showAge: checked })}
          />
          <SettingToggle
            label="Show Email"
            description="Make your email visible to others"
            checked={privacy.showEmail}
            onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
          />
        </div>
      </Card>

      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-6">Communication</h3>
        
        <div className="space-y-4">
          <SettingToggle
            label="Allow Messages"
            description="Let other users send you messages"
            checked={privacy.allowMessages}
            onCheckedChange={(checked) => setPrivacy({ ...privacy, allowMessages: checked })}
          />
          <SettingToggle
            label="Allow Group Invites"
            description="Let others invite you to groups"
            checked={privacy.allowGroupInvites}
            onCheckedChange={(checked) => setPrivacy({ ...privacy, allowGroupInvites: checked })}
          />
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentSection('main')}
          className="flex-1 h-[44px] rounded-[8px]"
        >
          Cancel
        </Button>
        <Button
          onClick={handlePrivacyUpdate}
          className="flex-1 h-[44px] bg-[#030213] hover:bg-[#030213]/90 rounded-[8px]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );

  // App Preferences Section
  const renderPreferencesSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-6">App Preferences</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="language" className="text-neutral-950 mb-2 block">
              Language
            </Label>
            <select
              id="language"
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="w-full h-[44px] px-3 rounded-[8px] bg-slate-100 border-0"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="currency" className="text-neutral-950 mb-2 block">
              Currency
            </Label>
            <select
              id="currency"
              value={preferences.currency}
              onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
              className="w-full h-[44px] px-3 rounded-[8px] bg-slate-100 border-0"
            >
              <option value="INR">₹ INR - Indian Rupee</option>
              <option value="USD">$ USD - US Dollar</option>
              <option value="EUR">€ EUR - Euro</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentSection('main')}
          className="flex-1 h-[44px] rounded-[8px]"
        >
          Cancel
        </Button>
        <Button
          onClick={handlePreferencesUpdate}
          className="flex-1 h-[44px] bg-[#030213] hover:bg-[#030213]/90 rounded-[8px]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );

  // Payment Methods Section
  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[20px] leading-[28px] text-neutral-950">Saved Payment Methods</h3>
          <Button variant="outline" size="sm" className="h-[36px] rounded-[8px]">
            <Plus className="size-4 mr-2" />
            Add New
          </Button>
        </div>
        
        <div className="space-y-3">
          {/* Mock Payment Methods */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[8px]">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-blue-100 rounded-[8px] flex items-center justify-center">
                <CreditCard className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[14px] text-neutral-950">•••• •••• •••• 4242</p>
                <p className="text-[12px] text-slate-600">Expires 12/25</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Remove
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[8px]">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-purple-100 rounded-[8px] flex items-center justify-center">
                <span className="text-[12px] text-purple-600">UPI</span>
              </div>
              <div>
                <p className="text-[14px] text-neutral-950">user@paytm</p>
                <p className="text-[12px] text-slate-600">UPI ID</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Remove
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-4">Payment History</h3>
        <p className="text-[14px] text-slate-600 mb-4">
          View your complete payment history and download invoices.
        </p>
        <Button variant="outline" className="w-full h-[44px] rounded-[8px]">
          View Payment History
        </Button>
      </Card>

      <Button
        variant="outline"
        onClick={() => setCurrentSection('main')}
        className="w-full h-[44px] rounded-[8px]"
      >
        Back
      </Button>
    </div>
  );

  // Help & Support Section
  const renderHelpSettings = () => (
    <div className="space-y-6">
      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-6">Help & Support</h3>
        
        <div className="space-y-3">
          <button className="w-full text-left p-4 rounded-[8px] hover:bg-slate-50 transition-colors">
            <h4 className="text-[16px] text-neutral-950 mb-1">FAQs</h4>
            <p className="text-[14px] text-slate-600">Find answers to common questions</p>
          </button>

          <button className="w-full text-left p-4 rounded-[8px] hover:bg-slate-50 transition-colors">
            <h4 className="text-[16px] text-neutral-950 mb-1">Contact Support</h4>
            <p className="text-[14px] text-slate-600">Get help from our support team</p>
          </button>

          <button className="w-full text-left p-4 rounded-[8px] hover:bg-slate-50 transition-colors">
            <h4 className="text-[16px] text-neutral-950 mb-1">Send Feedback</h4>
            <p className="text-[14px] text-slate-600">Share your thoughts with us</p>
          </button>

          <button 
            onClick={() => onNavigate('report-problem')}
            className="w-full text-left p-4 rounded-[8px] hover:bg-slate-50 transition-colors"
          >
            <h4 className="text-[16px] text-neutral-950 mb-1">Report a Problem</h4>
            <p className="text-[14px] text-slate-600">Let us know about any issues</p>
          </button>
        </div>
      </Card>

      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-6">Legal</h3>
        
        <div className="space-y-3">
          <button className="w-full text-left p-4 rounded-[8px] hover:bg-slate-50 transition-colors">
            <h4 className="text-[16px] text-neutral-950">Terms of Service</h4>
          </button>

          <button className="w-full text-left p-4 rounded-[8px] hover:bg-slate-50 transition-colors">
            <h4 className="text-[16px] text-neutral-950">Privacy Policy</h4>
          </button>

          <button className="w-full text-left p-4 rounded-[8px] hover:bg-slate-50 transition-colors">
            <h4 className="text-[16px] text-neutral-950">Community Guidelines</h4>
          </button>
        </div>
      </Card>

      <Card className="bg-white p-6 rounded-[16px] shadow-sm">
        <h3 className="text-[20px] leading-[28px] text-neutral-950 mb-2">App Version</h3>
        <p className="text-[14px] text-slate-600">Version 1.0.0</p>
        <p className="text-[12px] text-slate-500 mt-1">Last updated: October 2025</p>
      </Card>

      <Button
        variant="outline"
        onClick={() => setCurrentSection('main')}
        className="w-full h-[44px] rounded-[8px]"
      >
        Back
      </Button>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen w-full pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => currentSection === 'main' ? onNavigate('home') : setCurrentSection('main')}
              className="caffelino-back-btn"
            >
              ← Back
            </button>
            <h1 className="text-[24px] leading-[32px] text-neutral-950">
              {currentSection === 'main' && 'Settings'}
              {currentSection === 'account' && 'Account Settings'}
              {currentSection === 'notifications' && 'Notifications'}
              {currentSection === 'privacy' && 'Privacy & Security'}
              {currentSection === 'preferences' && 'App Preferences'}
              {currentSection === 'payment' && 'Payment Methods'}
              {currentSection === 'help' && 'Help & Support'}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentSection === 'main' && renderMainMenu()}
        {currentSection === 'account' && renderAccountSettings()}
        {currentSection === 'notifications' && renderNotificationsSettings()}
        {currentSection === 'privacy' && renderPrivacySettings()}
        {currentSection === 'preferences' && renderPreferencesSettings()}
        {currentSection === 'payment' && renderPaymentSettings()}
        {currentSection === 'help' && renderHelpSettings()}
      </div>
    </div>
  );
}

// Helper Components
function SettingsMenuItem({ icon, title, description, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-[12px] hover:bg-slate-50 transition-colors group"
    >
      <div className="text-neutral-950">{icon}</div>
      <div className="flex-1 text-left">
        <h4 className="text-[16px] text-neutral-950">{title}</h4>
        {description && <p className="text-[14px] text-slate-600">{description}</p>}
      </div>
      <ChevronRight className="size-5 text-slate-400 group-hover:text-neutral-950 transition-colors" />
    </button>
  );
}

function SettingToggle({ label, description, checked, onCheckedChange }: any) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <Label className="text-neutral-950 cursor-pointer">{label}</Label>
        {description && <p className="text-[12px] text-slate-600 mt-1">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
