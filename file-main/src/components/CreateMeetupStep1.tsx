import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface CreateMeetupStep1Props {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function CreateMeetupStep1({ user, onNavigate, onBack }: CreateMeetupStep1Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');

  // Helper functions - defined first before state initialization
  // Format date to YYYY-MM-DD for storage
  const formatDateValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format time to HH:MM for storage
  const formatTimeValue = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Auto-set admin name
  const adminName = user?.name || user?.firstName || 'Admin';

  // Initialize with empty values to require user input
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Get formatted display date (without year)
  const getFormattedDate = (dateStr: string) => {
    if (!dateStr) return 'Select date';
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get formatted display time
  const getFormattedTime = (timeStr: string) => {
    if (!timeStr) return 'Select time';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Validate date
  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    if (value) {
      const selected = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        setDateError('Date cannot be in the past');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  };

  // Validate time
  const handleTimeChange = (value: string) => {
    setSelectedTime(value);
    if (!value) {
      setTimeError('Time is required');
    } else {
      setTimeError('');
    }
  };

  const handleCreateMeetup = async () => {
    // Validation
    if (!user) {
      toast.error('Please login to create a meetup');
      return;
    }

    // Validate all fields
    let hasError = false;

    if (!selectedDate) {
      setDateError('Date is required');
      hasError = true;
    }

    if (!selectedTime) {
      setTimeError('Time is required');
      hasError = true;
    }

    if (dateError || hasError) {
      toast.error('Please fix all errors before continuing');
      return;
    }

    setIsCreating(true);

    try {
      const meetupTitle = `${adminName}'s Meetup`;

      const createRes = await fetch('https://caffelino90-9v4a.onrender.com/api/meetups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: meetupTitle,
          organizerId: user.id || user._id || `user-admin-${Date.now()}`,
          organizerName: adminName,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      const createData = await createRes.json();

      if (!createRes.ok || !createData.success) {
        toast.error(createData.message || 'Failed to create meetup');
        setIsCreating(false);
        return;
      }

      const newMeetup = createData.meetup;

      // Create meetup data structured for the frontend
      const meetupData = {
        _id: newMeetup._id,
        code: newMeetup.meetupCode,
        meetupName: newMeetup.title,
        groupName: newMeetup.title,
        date: newMeetup.date,
        time: newMeetup.time,
        adminId: newMeetup.organizerId,
        adminName: newMeetup.organizerName,
        isAdmin: true,
        members: newMeetup.members || [
          {
            id: newMeetup.organizerId,
            name: newMeetup.organizerName,
            role: 'admin',
            status: 'approved',
            isAdmin: true
          }
        ],
        // Dashboard state
        cafeSelectionPhase: 'selecting', // selecting | voting | finalized
        selectedCafes: [],
        finalizedCafe: null,
        menuItems: [],
        orderStatus: 'pending', // pending | confirmed
        billingType: null, // null | split | no-split
        billingVisible: false,
        createdAt: newMeetup.createdAt || new Date().toISOString()
      };

      toast.success(`Meetup created!`);

      // Admin must select a cafe immediately after creating
      onNavigate('cafe-selection-create', meetupData);
    } catch (error) {
      console.error('Create meetup error:', error);
      toast.error('Network error while creating meetup.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1ed] via-[#faf8f6] to-[#ede8e3]">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Create Meetup</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[680px] mx-auto px-4 py-16">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">Create a Café Meetup</h1>
          <p className="text-neutral-600 text-lg">
            Plan, choose a café, order together, and split bills seamlessly
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-[#be9d80] via-[#c9a889] to-[#b08968] rounded-3xl p-8 shadow-2xl">
          <div className="space-y-7">
            {/* Organizer Name */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-3 text-[15px]">
                Organizer Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={adminName}
                  readOnly
                  className="w-full pl-4 pr-12 py-4 bg-white/95 border-2 border-white/50 rounded-xl text-neutral-900 text-[16px] focus:outline-none focus:border-white transition-all cursor-not-allowed shadow-sm"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User className="w-5 h-5 text-neutral-500" />
                </div>
              </div>
            </div>

            {/* Meetup Date */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-3 text-[15px]">
                Meetup Date
              </label>
              <div className="relative group">
                {/* Hidden native date input */}
                <input
                  type="date"
                  id="meetup-date-input"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={formatDateValue(new Date())}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  style={{
                    colorScheme: 'light',
                  }}
                />
                {/* Visible display field */}
                <div className="w-full pl-4 pr-12 py-4 bg-white/95 border-2 border-white/50 rounded-xl text-neutral-900 text-[16px] transition-all shadow-sm hover:shadow-md hover:bg-white cursor-pointer relative z-10 pointer-events-none">
                  {selectedDate ? getFormattedDate(selectedDate) : 'Select date'}
                </div>
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-transform group-hover:scale-110 z-30"
                  onClick={() => document.getElementById('meetup-date-input')?.showPicker()}
                >
                  <Calendar className="w-5 h-5 text-[#8b5943] group-hover:text-[#6d422e] transition-colors" />
                </div>
              </div>
              {!selectedDate && (
                <p className="text-[13px] text-neutral-700 mt-2 ml-1">
                  Click to select day and month
                </p>
              )}
              {dateError && (
                <div className="flex items-center gap-2 mt-2 text-red-700 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-[13px] font-medium">{dateError}</p>
                </div>
              )}
            </div>

            {/* Meetup Time */}
            <div>
              <label className="block text-neutral-900 font-semibold mb-3 text-[15px]">
                Meetup Time
              </label>
              <div className="relative group">
                {/* Hidden native time input */}
                <input
                  type="time"
                  id="meetup-time-input"
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  style={{
                    colorScheme: 'light',
                  }}
                />
                {/* Visible display field */}
                <div className="w-full pl-4 pr-12 py-4 bg-white/95 border-2 border-white/50 rounded-xl text-neutral-900 text-[16px] transition-all shadow-sm hover:shadow-md hover:bg-white cursor-pointer relative z-10 pointer-events-none">
                  {selectedTime ? getFormattedTime(selectedTime) : 'Select time'}
                </div>
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-transform group-hover:scale-110 z-30"
                  onClick={() => document.getElementById('meetup-time-input')?.showPicker()}
                >
                  <Clock className="w-5 h-5 text-[#8b5943] group-hover:text-[#6d422e] transition-colors" />
                </div>
              </div>
              {!selectedTime && (
                <p className="text-[13px] text-neutral-700 mt-2 ml-1">
                  Click to select hours and minutes
                </p>
              )}
              {timeError && (
                <div className="flex items-center gap-2 mt-2 text-red-700 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-[13px] font-medium">{timeError}</p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#8b5943] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <p className="text-[14px] text-neutral-800 leading-relaxed">
                  Select your preferred date and time. You'll receive a unique join code to share with friends and family.
                </p>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleCreateMeetup}
              disabled={isCreating}
              className="w-full bg-[#8b5943] hover:bg-[#6d422e] text-white py-5 text-[17px] font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 mt-8"
            >
              {isCreating ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Meetup...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Continue
                  <span className="text-xl">→</span>
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-neutral-600 text-[15px]">
            All fields are required to create your meetup
          </p>
          <p className="text-neutral-500 text-[13px]">
            Next: Share join code → Select café → Order together → Split bills
          </p>
        </div>
      </div>
    </div>
  );
}
