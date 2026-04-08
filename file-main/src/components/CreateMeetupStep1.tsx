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

            {/* Replaced old native inputs with new premium component */}
            <div className="bg-white/95 rounded-2xl p-6 shadow-sm border border-white/50">
              <MeetupDateTimePicker 
                selectedDate={selectedDate} 
                selectedTime={selectedTime} 
                onDateTimeSelect={(d, t) => { setSelectedDate(d); setSelectedTime(t); }} 
              />
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
              disabled={isCreating || !selectedDate || !selectedTime}
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
