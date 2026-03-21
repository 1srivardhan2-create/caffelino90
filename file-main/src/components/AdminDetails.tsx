import { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, AlertCircle, Coffee, UserPlus } from 'lucide-react';
import { Button } from './ui/button';

interface AdminDetailsProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function AdminDetails({ user, onNavigate, onBack }: AdminDetailsProps) {
  const defaultAdminName = (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : (user?.name || user?.firstName || '');
  const [adminName, setAdminName] = useState(defaultAdminName);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState({
    adminName: '',
    date: '',
    time: ''
  });

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    const newErrors = {
      adminName: '',
      date: '',
      time: ''
    };

    let isValid = true;

    if (!adminName || adminName.trim() === '') {
      newErrors.adminName = 'Organizer name is required';
      isValid = false;
    }

    if (!date) {
      newErrors.date = 'Date is required';
      isValid = false;
    } else if (date < today) {
      newErrors.date = 'Date cannot be in the past';
      isValid = false;
    }

    if (!time) {
      newErrors.time = 'Time is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const [isCreating, setIsCreating] = useState(false);

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsCreating(true);

    try {
      const meetupTitle = `${adminName.trim()}'s Meetup`;
      const userId = user?.id || user?._id || `admin-${Date.now()}`;

      const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://caffelino90-9v4a.onrender.com';
      const res = await fetch(`${API_BASE}/api/meetups/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: meetupTitle,
          organizerId: userId,
          organizerName: adminName.trim(),
          date,
          time,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || 'Failed to create meetup');
        setIsCreating(false);
        return;
      }

      const newMeetup = data.meetup;

      const meetupData = {
        _id: newMeetup._id,
        code: newMeetup.meetupCode,
        meetupCode: newMeetup.meetupCode,
        meetupName: newMeetup.title,
        groupName: newMeetup.title,
        adminName: newMeetup.organizerName,
        adminId: newMeetup.organizerId,
        date: newMeetup.date,
        time: newMeetup.time,
        isAdmin: true,
        members: newMeetup.members || [{ userId, name: adminName.trim() }],
      };

      onNavigate('cafe-selection-create', meetupData);
    } catch (error) {
      console.error('Create meetup error:', error);
      alert('Network error. Is the server running?');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf5]">
      {/* Header */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-[#364153] hover:text-[#1e2939] transition-colors font-['Arial:Regular',sans-serif] text-[16px]"
            >
              ← Back
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#be9d80]" />
              <h1 className="font-['Arial:Bold',sans-serif] text-[18px] text-[#101828]">Create Meetup</h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-3">
          {/* Step 1 - Active */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#be9d80] text-white flex items-center justify-center font-['Arial:Bold',sans-serif] text-[16px] shadow-sm">
              1
            </div>
            <span className="font-['Arial:Bold',sans-serif] text-[14px] text-[#1e2939]">Details</span>
          </div>

          {/* Divider */}
          <div className="w-20 h-0.5 bg-[#d1d5dc]"></div>

          {/* Step 2 - Inactive */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e5e7eb] text-[#99a1af] flex items-center justify-center font-['Arial:Bold',sans-serif] text-[16px]">
              2
            </div>
            <span className="font-['Arial:Regular',sans-serif] text-[14px] text-[#99a1af]">Café</span>
          </div>

          {/* Divider */}
          <div className="w-20 h-0.5 bg-[#d1d5dc]"></div>

          {/* Step 3 - Inactive */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e5e7eb] text-[#99a1af] flex items-center justify-center font-['Arial:Bold',sans-serif] text-[16px]">
              3
            </div>
            <span className="font-['Arial:Regular',sans-serif] text-[14px] text-[#99a1af]">Code</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#be9d80] to-[#a88968] rounded-2xl mb-6 shadow-lg">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-['Arial:Bold',sans-serif] text-[30px] leading-[36px] text-[#101828] mb-3">
            Create a Café Meetup
          </h2>
          <p className="font-['Arial:Regular',sans-serif] text-[18px] leading-[28px] text-[#101828]">
            Plan, choose a café, order together, and split bills seamlessly
          </p>
        </div>

        {/* Form Card with Gradient Background */}
        <div
          className="rounded-2xl shadow-md p-8 border border-[#e5e7eb]"
          style={{
            background: "linear-gradient(55.1783deg, rgb(139, 89, 67) 0.97833%, rgb(217, 191, 157) 51.928%, rgb(139, 89, 67) 99.105%)"
          }}
        >
          <div className="space-y-6">
            {/* Organizer Name Field */}
            <div>
              <label className="block font-['Arial:Bold',sans-serif] text-[14px] leading-[20px] text-[#364153] mb-2">
                Organizer Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#101828]" />
                </div>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => {
                    setAdminName(e.target.value);
                    if (errors.adminName) {
                      setErrors({ ...errors, adminName: '' });
                    }
                  }}
                  placeholder="Enter your name"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl focus:outline-none transition-all font-['Arial:Regular',sans-serif] text-[16px] text-[#101828] placeholder:text-[#999] ${errors.adminName
                      ? 'border-red-500 bg-red-50'
                      : 'border-[#101828] bg-white/80 focus:bg-white'
                    }`}
                />
              </div>
              {errors.adminName && (
                <div className="flex items-center gap-2 mt-2 text-red-700 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.adminName}</span>
                </div>
              )}
            </div>

            {/* Meetup Date Field */}
            <div>
              <label className="block font-['Arial:Bold',sans-serif] text-[14px] leading-[20px] text-[#101828] mb-2">
                Meetup Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-[#101828]" />
                </div>
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) {
                      setErrors({ ...errors, date: '' });
                    }
                  }}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl focus:outline-none transition-all font-['Arial:Regular',sans-serif] text-[16px] text-[#101828] ${errors.date
                      ? 'border-red-500 bg-red-50'
                      : 'border-[#1e1e1e] bg-white/80 focus:bg-white'
                    }`}
                  style={{
                    colorScheme: 'light',
                  }}
                />
              </div>
              {errors.date && (
                <div className="flex items-center gap-2 mt-2 text-red-700 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.date}</span>
                </div>
              )}
            </div>

            {/* Meetup Time Field */}
            <div>
              <label className="block font-['Arial:Bold',sans-serif] text-[14px] leading-[20px] text-[#101828] mb-2">
                Meetup Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-[#1e1e1e]" />
                </div>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    if (errors.time) {
                      setErrors({ ...errors, time: '' });
                    }
                  }}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-2xl focus:outline-none transition-all font-['Arial:Regular',sans-serif] text-[16px] text-[#101828] ${errors.time
                      ? 'border-red-500 bg-red-50'
                      : 'border-[#1e1e1e] bg-white/80 focus:bg-white'
                    }`}
                  style={{
                    colorScheme: 'light',
                  }}
                />
              </div>
              {errors.time && (
                <div className="flex items-center gap-2 mt-2 text-red-700 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.time}</span>
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="pt-2">
              <button
                onClick={handleNext}
                disabled={isCreating}
                className={`w-full bg-[#8b5943] hover:bg-[#7a4a35] text-[#1e1e1e] py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 font-['Arial:Bold',sans-serif] text-[16px] ${isCreating ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <span>{isCreating ? 'Creating Meetup...' : 'Continue'}</span>
                {!isCreating && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center font-['Arial:Regular',sans-serif] text-[14px] leading-[20px] text-[#6a7282] mt-5">
          All fields are required to create your meetup
        </p>
      </div>

      {/* Brown theme for date/time pickers */}
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}