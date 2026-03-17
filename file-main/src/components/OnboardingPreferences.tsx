import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { toast } from 'sonner';

interface OnboardingPreferencesProps {
  user: any;
  onComplete: () => void;
}

const INTERESTS = [
  '🎮 Gaming', '☕ Coffee Talks', '🎸 Music', '🎬 Movies', '📚 Study/Tech',
  '💼 Business', '✈️ Travel', '🤝 Networking', '🧠 Motivation', '⚽ Sports',
  '🎨 Art/Design', '🍕 Foodie Vibes', '❤️ Relationships', '💻 Coding'
];

const MEETUP_TYPES = [
  { icon: '☕', label: 'Small Talks' },
  { icon: '👥', label: 'Friendship Meetup' },
  { icon: '💻', label: 'Study/IT Group' },
  { icon: '💼', label: 'Startup & Business' },
  { icon: '🌍', label: 'Language Exchange' },
  { icon: '🎮', label: 'Game Night' }
];

export default function OnboardingPreferences({ user, onComplete }: OnboardingPreferencesProps) {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedMeetupTypes, setSelectedMeetupTypes] = useState<string[]>([]);
  const [distance, setDistance] = useState('5');
  const [budget, setBudget] = useState('200-400');
  const [ageRange, setAgeRange] = useState([18, 30]);
  const [meetupDays, setMeetupDays] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState('public');

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else if (selectedInterests.length < 10) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleMeetupType = (type: string) => {
    if (selectedMeetupTypes.includes(type)) {
      setSelectedMeetupTypes(selectedMeetupTypes.filter(t => t !== type));
    } else {
      setSelectedMeetupTypes([...selectedMeetupTypes, type]);
    }
  };

  const toggleDay = (day: string) => {
    if (meetupDays.includes(day)) {
      setMeetupDays(meetupDays.filter(d => d !== day));
    } else {
      setMeetupDays([...meetupDays, day]);
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedInterests.length < 3) {
      toast.error('Please select at least 3 interests');
      return;
    }
    if (step === 2 && selectedMeetupTypes.length === 0) {
      toast.error('Please select at least one meetup type');
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
      toast.success('Preferences saved!');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Step 1: Interests */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-2">Select Your Interests</h2>
                <p className="text-slate-600">Pick 3–10 interests that describe you</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                    className="cursor-pointer px-4 py-2 text-base"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                Selected: {selectedInterests.length}/10
              </p>
            </div>
          )}

          {/* Step 2: Meetup Types */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-2">Choose Meetup Type</h2>
                <p className="text-slate-600">What kind of meetups do you prefer?</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {MEETUP_TYPES.map((type) => (
                  <div
                    key={type.label}
                    onClick={() => toggleMeetupType(type.label)}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all text-center ${
                      selectedMeetupTypes.includes(type.label)
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{type.icon}</div>
                    <div>{type.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Distance */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-2">Distance Preference</h2>
                <p className="text-slate-600">How far are you willing to travel?</p>
              </div>
              <div className="space-y-4">
                {['2', '5', '10', '15+'].map((dist) => (
                  <div
                    key={dist}
                    onClick={() => setDistance(dist)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      distance === dist
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {dist} km
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Budget */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-2">Budget Comfort</h2>
                <p className="text-slate-600">What's your average meetup budget?</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: '₹100 – ₹200 (Budget friendly)', value: '100-200' },
                  { label: '₹200 – ₹400 (Mid range)', value: '200-400' },
                  { label: '₹400 – ₹800 (Premium)', value: '400-800' },
                  { label: 'Any (Flexible)', value: 'any' }
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setBudget(option.value)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      budget === option.value
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Age Range */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-2">Age Preference</h2>
                <p className="text-slate-600">Select preferred age range of meetup members</p>
              </div>
              <div className="px-4 py-8">
                <div className="mb-4 text-center">
                  <span className="text-2xl">{ageRange[0]} - {ageRange[1]} years</span>
                </div>
                <Slider
                  value={ageRange}
                  onValueChange={setAgeRange}
                  min={18}
                  max={60}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Step 6: Meetup Days */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-2">Meetup Days</h2>
                <p className="text-slate-600">When are you usually free?</p>
              </div>
              <div className="space-y-3">
                {['Weekdays', 'Saturday', 'Sunday', 'Anytime'].map((day) => (
                  <div
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      meetupDays.includes(day)
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                        meetupDays.includes(day) ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                      }`}>
                        {meetupDays.includes(day) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {day}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Privacy */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-2">Privacy Settings</h2>
                <p className="text-slate-600">Who can view your profile?</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Public', value: 'public', desc: 'Anyone can see your profile' },
                  { label: 'Only same group', value: 'group', desc: 'Only members in your groups' },
                  { label: 'Private (join only)', value: 'private', desc: 'Hidden from search' }
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setPrivacy(option.value)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      privacy === option.value
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div>{option.label}</div>
                    <div className="text-sm text-slate-500 mt-1">{option.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1">
              {step === totalSteps ? 'Continue to App' : 'Next'}
              {step < totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          {step > 1 && (
            <Button variant="ghost" onClick={onComplete} className="w-full mt-4">
              Skip for now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
