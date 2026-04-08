import { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, AlertCircle, Coffee, UserPlus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import MeetupDateTimePicker from './MeetupDateTimePicker';

interface AdminDetailsProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function AdminDetails({ user, onNavigate, onBack }: AdminDetailsProps) {
  const defaultAdminName = (user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : (user?.name || user?.firstName || '');
  const [adminName, setAdminName] = useState(defaultAdminName);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [errors, setErrors] = useState({
    adminName: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { adminName: '' };

    if (!adminName || adminName.trim() === '') {
      newErrors.adminName = 'Organizer name is required';
      isValid = false;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
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
          date: selectedDate,
          time: selectedTime,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Failed to create meetup');
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
      <div className="max-w-[600px] mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#fdfbf9] to-[#ffffff] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#be9d80]/20 rounded-2xl mb-6">
            <UserPlus className="w-8 h-8 text-[#8b5943]" />
          </div>
          <h2 className="text-3xl font-[Arial] font-bold text-[#1a1a1a] mb-2">
            Create a Café Meetup
          </h2>
          <p className="text-neutral-500 text-[16px]">
            Plan, choose a café, order together, and split bills seamlessly
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-[#fdfbf9] to-[#ffffff] rounded-[20px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#be9d80]/20">
          <div className="space-y-6">
            {/* Organizer Name Field */}
            <div>
              <label className="block text-[#1a1a1a] font-['Arial:Bold',sans-serif] mb-2 text-[15px]">
                Organizer Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#8b5943]" />
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
                  className={`w-full pl-11 pr-4 py-3.5 bg-white rounded-[16px] text-[#1a1a1a] text-[15px] font-medium transition-all shadow-[0_2px_10px_rgba(139,89,67,0.05)] focus:ring-2 focus:ring-[#8b5943]/30 outline-none ${errors.adminName
                      ? 'border-2 border-red-500 bg-red-50'
                      : 'border border-[#be9d80] focus:border-[#8b5943]'
                    }`}
                />
              </div>
              {errors.adminName && (
                <div className="flex items-center gap-2 mt-2 text-red-700 text-[13px] font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.adminName}</span>
                </div>
              )}
            </div>

            {/* Date & Time Picker */}
            <div className="bg-white rounded-[20px] p-1">
              <MeetupDateTimePicker 
                selectedDate={selectedDate} 
                selectedTime={selectedTime} 
                onDateTimeSelect={(d, t) => { setSelectedDate(d); setSelectedTime(t); }} 
              />
            </div>

            {/* Continue Button */}
            <div className="pt-2">
              <button
                onClick={handleNext}
                disabled={isCreating || !selectedDate || !selectedTime}
                className={`w-full py-4 text-[16px] font-bold rounded-full transition-all duration-200 mt-4 disabled:opacity-100 flex items-center justify-center gap-2 ${
                  isCreating || !selectedDate || !selectedTime
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border-0'
                    : 'bg-gradient-to-r from-[#8b5943] to-[#be9d80] text-white shadow-[0_8px_20px_-4px_rgba(139,89,67,0.5)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-4px_rgba(139,89,67,0.6)]'
                }`}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Meetup...
                  </>
                ) : (
                  <>
                    Continue
                    <span className="text-xl leading-none ml-1">→</span>
                  </>
                )}
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