import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { BASE_URL } from '../utils/api';
import MeetupDateTimePicker from './MeetupDateTimePicker';

interface CreateMeetupStep1Props {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function CreateMeetupStep1({ user, onNavigate, onBack }: CreateMeetupStep1Props) {
  const [isCreating, setIsCreating] = useState(false);

  // Auto-set admin name
  const adminName = user?.name || user?.firstName || 'Admin';

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleCreateMeetup = async () => {
    // Validation
    if (!user) {
      toast.error('Please login to create a meetup');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    setIsCreating(true);

    try {
      const meetupTitle = `${adminName}'s Meetup`;

      const createRes = await fetch(`${BASE_URL}/api/meetups/create`, {
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
      <div className="max-w-[600px] mx-auto px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-[Arial] font-bold text-[#1a1a1a] mb-2">Create a Café Meetup</h1>
          <p className="text-neutral-500 text-[16px]">
            Plan, choose a café, order together, and split bills seamlessly
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-[#fdfbf9] to-[#ffffff] rounded-[20px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#be9d80]/20">
          <div className="space-y-6">
            {/* Organizer Name */}
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
                  readOnly
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#be9d80] rounded-[16px] text-[#1a1a1a] text-[15px] font-medium outline-none shadow-[0_2px_10px_rgba(139,89,67,0.05)] cursor-not-allowed"
                />
              </div>
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
            <Button
              onClick={handleCreateMeetup}
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
