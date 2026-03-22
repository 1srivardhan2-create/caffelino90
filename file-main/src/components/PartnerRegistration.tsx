import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Upload, X, Plus, Clock, MapPin, User, Mail, Phone, Briefcase, CreditCard, Wallet, Camera, Store, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, Zap, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { safeStorage } from '../utils/safeStorage';
import { Switch } from './ui/switch';
import LocationPicker from './LocationPicker';

interface PartnerRegistrationProps {
  onNavigate: (page: string, data?: any) => void;
}

interface OpeningHours {
  [key: string]: { open: string; close: string; closed: boolean };
}

export default function PartnerRegistration({ onNavigate }: PartnerRegistrationProps) {
  const [showVerificationScreen, setShowVerificationScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // 1. Café Information
    establishmentType: '', // 'Cafe' or 'Restaurant'
    cafeName: '',
    cafeAddress: '',
    cafeLatitude: 0,
    cafeLongitude: 0,
    averageCostPerPerson: '',
    description: '',
    // 3. Manager Information
    managerName: '',
    managerRole: '',
    primaryPhone: '',
    secondaryPhone: '',

    // 4. Confirmation
    acceptTerms: false,
    acceptPrivacy: false,
    acceptDataProcessing: false,
  });

  // 2. Operating Hours (Day-wise)
  const [openingHours, setOpeningHours] = useState({
    Monday: { open: '09:00', close: '22:00', closed: false },
    Tuesday: { open: '09:00', close: '22:00', closed: false },
    Wednesday: { open: '09:00', close: '22:00', closed: false },
    Thursday: { open: '09:00', close: '22:00', closed: false },
    Friday: { open: '09:00', close: '22:00', closed: false },
    Saturday: { open: '09:00', close: '22:00', closed: false },
    Sunday: { open: '09:00', close: '22:00', closed: false },
  } as OpeningHours);

  // 4. Café Photos (Minimum 5 mandatory)
  const [cafePics, setCafePics] = useState([] as File[]);

  // Profile Picture
  const [profilePic, setProfilePic] = useState(null as File | null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const roleOptions = ['Owner', 'Manager', 'Admin'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpeningHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setOpeningHours({
      ...openingHours,
      [day]: {
        ...openingHours[day],
        [field]: value,
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setCafePics([...cafePics, ...Array.from(files)]);
  };

  const removeFile = (index: number) => {
    setCafePics(cafePics.filter((_: any, i: number) => i !== index));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double-click

    // ✅ STRICT VALIDATION

    // 1. Café Information - all required
    if (!formData.establishmentType || !formData.cafeName || !formData.cafeAddress ||
      !formData.averageCostPerPerson) {
      toast.error('Please select an Establishment Type and fill in all required café information fields');
      return;
    }

    // 3. Manager Information - all required
    if (!formData.managerName || !formData.managerRole || !formData.primaryPhone) {
      toast.error('Please fill in all required manager information fields');
      return;
    }

    // 3.5. Profile Picture - required
    if (!profilePic) {
      toast.error('Please upload a profile picture');
      return;
    }

    // 4. Café Photos - minimum 5 required
    if (cafePics.length < 5) {
      toast.error('Please upload at least 5 café photos');
      return;
    }

    // 5. Confirmation - all must be accepted
    if (!formData.acceptTerms || !formData.acceptPrivacy || !formData.acceptDataProcessing) {
      toast.error('Please accept all terms and conditions');
      return;
    }

    // Convert photos to base64
    const photoPromises = cafePics.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const photoBase64Array = await Promise.all(photoPromises);

    // Convert profile picture to base64
    const profilePicBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(profilePic);
    });
    const ownerEmail = safeStorage.getItem('ownerEmail') || '';

    // Store café owner credentials securely (now using the Google Email)
    const cafeOwnerCredentials = {
      email: ownerEmail,
      cafeName: formData.cafeName,
      profilePicture: profilePicBase64,
      registeredDate: new Date().toISOString(),
    };
    safeStorage.setItem('cafeOwnerCredentials', JSON.stringify(cafeOwnerCredentials));

    // ═══════════════════════════════════════════════════════════
    // POST to Backend API — Save cafe in MongoDB
    // ═══════════════════════════════════════════════════════════
    setIsSubmitting(true);
    try {
      const { registerCafe } = await import('../services/cafeService');
      const ownerId = safeStorage.getItem('myCafeOwnerId') || safeStorage.getItem('userId') || '';

      const cafeResponse = await registerCafe({
        ownerId,
        cafeName: formData.cafeName,
        establishmentType: formData.establishmentType,
        location: formData.cafeAddress,
        latitude: formData.cafeLatitude,
        longitude: formData.cafeLongitude,
        tables: 0,
        email: ownerEmail,
        managerName: formData.managerName,
        phone: formData.primaryPhone,
        opening_hours: openingHours,
        profilePicture: profilePicBase64,
        averageCostPerPerson: formData.averageCostPerPerson,
        description: formData.description,
        cafePhotos: photoBase64Array
      });

      console.log('☕ Cafe registered in MongoDB:', cafeResponse);

      // Save the cafe ID for verification polling
      if (cafeResponse.cafe && cafeResponse.cafe.id) {
        safeStorage.setItem('myCafeId', cafeResponse.cafe.id);
      }
    } catch (apiError: any) {
      console.error('Backend API error:', apiError);
      toast.error(apiError.message || 'Failed to register cafe with the server.');
      setIsSubmitting(false);
      return; // Stop the flow, don't show success screen
    }

    // Store complete registration data in localStorage (for local UI)
    const cafeRegistrationData = {
      // 1. Café Information
      cafeName: formData.cafeName,
      cafeAddress: formData.cafeAddress,
      cafeType: formData.cafeType,
      averageCostPerPerson: formData.averageCostPerPerson,
      description: formData.description,

      // 2. Account Credentials
      accountEmail: ownerEmail,

      // 2. Operating Hours
      openingHours: openingHours,

      // 4. Manager/Contact Information
      managerName: formData.managerName,
      managerRole: formData.managerRole,
      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone,
      profilePicture: profilePicBase64,

      // 5. Café Photos
      cafePhotos: photoBase64Array,

      // Metadata
      registrationDate: new Date().toISOString(),
      status: 'pending',
    };

    safeStorage.setItem('cafeRegistrationData', JSON.stringify(cafeRegistrationData));
    safeStorage.setItem('pendingCafeName', formData.cafeName);
    safeStorage.setItem('pendingCafeEmail', ownerEmail);

    toast.success(`🎉 ${formData.cafeName} registered successfully!`);

    // Show verification screen
    setShowVerificationScreen(true);

    // Redirect after 4 seconds
    setTimeout(() => {
      onNavigate('cafe-verification-pending');
    }, 4000);
  };

  // Verification screen
  if (showVerificationScreen) {
    return (
      <div className="fixed inset-0 bg-[#f7efe8] flex items-center justify-center flex-col z-[9999]">
        <h2 className="text-[24px] mb-[25px] text-[#3b1f0e]">
          Verifying Your Cafe Registration...
        </h2>
        <div className="coffee-container">
          <div className="ball coffee-bean"></div>
          <div className="shadow"></div>
        </div>
        <p className="mt-[18px] text-[#5a3218] text-center text-[15px] max-w-md px-4">
          Please wait while we verify your details...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f5] min-h-screen w-full pb-20 relative">
      {/* Header with warm coffee color */}
      <div className="sticky top-0 z-50 w-full" style={{ backgroundColor: '#be9d80' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            {/* Logo Placeholder */}
            <span className="text-white text-xl font-bold tracking-widest">CAFFÉLINO</span>
          </div>
        </div>
      </div>

      {/* Back Button - Positioned on Left Side */}
      <button
        onClick={() => onNavigate('partner-login-choice')}
        className="fixed top-20 left-4 flex items-center gap-2 bg-[#8b5943] text-white px-4 py-2 rounded-2xl shadow-lg hover:scale-105 transition-all z-[60] sm:left-8 md:left-12"
      >
        <svg className="size-4" fill="none" viewBox="0 0 11 11">
          <g>
            <path d="M10 5.33333L0.666668 5.33333" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d="M5.33333 10L0.666666 5.33333L5.33333 0.666664" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </g>
        </svg>
        <span className="text-[14px]">Back</span>
      </button>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-10 text-center">
          <h1 className="text-[28px] sm:text-[36px] md:text-[42px] text-[#3b1f0e] mb-3" style={{ fontFamily: 'Arial, sans-serif' }}>
            ☕ Partner with Caffélino
          </h1>
          <p className="text-[15px] sm:text-[18px] text-[#6b4423]">
            Join our network of cafés and connect with amazing communities
          </p>
          <div className="mt-4 inline-block bg-[#fff8f0] border-2 border-[#be9d80] rounded-lg px-4 sm:px-6 py-3">
            <p className="text-[13px] sm:text-[14px] text-[#3b1f0e]">
              <span className="text-red-500">*</span> indicates mandatory fields
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. CAFÉ INFORMATION */}
          <Card className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border-2 border-[#e8d5c4]">
            <div className="mb-6 pb-4 border-b-2 border-[#be9d80]/30">
              <h2 className="text-[26px] text-[#3b1f0e] flex items-center gap-3">
                <Store className="w-7 h-7 text-[#be9d80]" />
                1. Café Information
              </h2>
              <p className="text-[14px] text-[#6b4423] mt-2">Tell us about your café</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-[#3b1f0e] mb-2 block">
                  Establishment Type <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, establishmentType: 'Cafe' })}
                    className={`py-3 px-4 sm:py-4 sm:px-6 rounded-xl border-2 text-left flex items-center gap-3 sm:gap-4 transition-all ${formData.establishmentType === 'Cafe'
                      ? 'border-[#8b5943] bg-[#be9d80]/10 ring-2 ring-[#8b5943]/20 shadow-md'
                      : 'border-[#e8d5c4] bg-white hover:border-[#be9d80]/50'
                      }`}
                  >
                    <div className={`p-2 sm:p-3 rounded-full ${formData.establishmentType === 'Cafe' ? 'bg-[#8b5943] text-white' : 'bg-[#faf8f5] text-[#be9d80]'}`}>
                      <Store className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-[15px] sm:text-[17px] ${formData.establishmentType === 'Cafe' ? 'text-[#3b1f0e]' : 'text-[#6b4423]'}`}>Café</h3>
                      <p className="text-[11px] sm:text-[13px] text-[#8b5943] mt-1 line-clamp-1">Coffee shop, bakery, etc.</p>
                    </div>
                  </button>
 
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, establishmentType: 'Restaurant' })}
                    className={`py-3 px-4 sm:py-4 sm:px-6 rounded-xl border-2 text-left flex items-center gap-3 sm:gap-4 transition-all ${formData.establishmentType === 'Restaurant'
                      ? 'border-[#8b5943] bg-[#be9d80]/10 ring-2 ring-[#8b5943]/20 shadow-md'
                      : 'border-[#e8d5c4] bg-white hover:border-[#be9d80]/50'
                      }`}
                  >
                    <div className={`p-2 sm:p-3 rounded-full ${formData.establishmentType === 'Restaurant' ? 'bg-[#8b5943] text-white' : 'bg-[#faf8f5] text-[#be9d80]'}`}>
                      <Store className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-[15px] sm:text-[17px] ${formData.establishmentType === 'Restaurant' ? 'text-[#3b1f0e]' : 'text-[#6b4423]'}`}>Restaurant</h3>
                      <p className="text-[11px] sm:text-[13px] text-[#8b5943] mt-1 line-clamp-1">Fine dining, casual, etc.</p>
                    </div>
                  </button>
                </div>
              </div>


              {/* Café Name */}
              <div>
                <Label className="text-[#3b1f0e] mb-2 block flex items-center gap-2">
                  Business Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="cafeName"
                  value={formData.cafeName}
                  onChange={handleInputChange}
                  placeholder="Enter your café or restaurant name"
                  className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
                  required
                />
              </div>

              {/* Location Picker Map */}
              <div>
                <Label className="text-[#3b1f0e] mb-3 block flex items-center gap-2 text-[16px] font-semibold">
                  <MapPin className="w-5 h-5 text-[#be9d80]" />
                  Café Location <span className="text-red-500">*</span>
                </Label>
                <p className="text-[13px] text-[#6b4423] mb-3">
                  Select your café's exact location on the map. You can search, use GPS, or click directly on the map.
                </p>
                <LocationPicker
                  onLocationSelect={({ address, lat, lng }) => {
                    setFormData(prev => ({
                      ...prev,
                      cafeAddress: address,
                      cafeLatitude: lat,
                      cafeLongitude: lng,
                    }));
                  }}
                  initialAddress={formData.cafeAddress}
                  initialLat={formData.cafeLatitude || undefined}
                  initialLng={formData.cafeLongitude || undefined}
                />
              </div>

              {/* Average Cost Per Person */}
              <div>
                <Label className="text-[#3b1f0e] mb-2 block">
                  Average Cost Per Person (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="averageCostPerPerson"
                  type="text"
                  value={formData.averageCostPerPerson}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and limit to 4 digits
                    if (/^\d{0,4}$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  placeholder="e.g., 300"
                  className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
                  pattern="\d{3,4}"
                  maxLength={4}
                  required
                />
                <p className="text-[12px] text-[#6b4423] mt-1">
                  Enter only numbers (3-4 digits)
                </p>
              </div>

              {/* Café Description */}
              <div>
                <Label className="text-[#3b1f0e] mb-2 block">
                  Café Description
                </Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about your café's ambiance, specialties, and what makes it unique"
                  className="min-h-[120px] bg-[#faf8f5] border-[#be9d80]/40"
                />
              </div>
            </div>
          </Card>


          {/* 2. OPERATING HOURS */}
          <Card className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border-2 border-[#e8d5c4]">
            <div className="mb-6 pb-4 border-b-2 border-[#be9d80]/30">
              <h2 className="text-[26px] text-[#3b1f0e] flex items-center gap-3">
                <Clock className="w-7 h-7 text-[#be9d80]" />
                3. Operating Hours
              </h2>
              <p className="text-[14px] text-[#6b4423] mt-2">Set your café's weekly schedule</p>
            </div>

            <div className="space-y-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-[#faf8f5] rounded-xl">
                  <div className="w-full sm:w-28">
                    <span className="text-[14px] sm:text-[15px] text-[#3b1f0e] font-medium">{day}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-1">
                    <Input
                      type="time"
                      value={openingHours[day].open}
                      onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                      disabled={openingHours[day].closed}
                      className="h-10 bg-white border-[#be9d80]/40"
                    />
                    <span className="text-[#6b4423]">to</span>
                    <Input
                      type="time"
                      value={openingHours[day].close}
                      onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                      disabled={openingHours[day].closed}
                      className="h-10 bg-white border-[#be9d80]/40"
                    />
                    <label className="flex items-center gap-2 cursor-pointer ml-2">
                      <Checkbox
                        checked={openingHours[day].closed}
                        onCheckedChange={(checked) => handleOpeningHoursChange(day, 'closed', checked as boolean)}
                      />
                      <span className="text-[13px] text-[#6b4423]">Closed</span>
                    </label>
                  </div>
                  <div className="ml-auto">
                    {openingHours[day].closed ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[12px]">
                        Closed
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[12px]">
                        Open
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 3. MANAGER / CONTACT INFORMATION */}
          <Card className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border-2 border-[#e8d5c4]">
            <div className="mb-6 pb-4 border-b-2 border-[#be9d80]/30">
              <h2 className="text-[26px] text-[#3b1f0e] flex items-center gap-3">
                <User className="w-7 h-7 text-[#be9d80]" />
                3. Manager / Contact Information
              </h2>
              <p className="text-[14px] text-[#6b4423] mt-2">Primary contact details for your café</p>
            </div>

            {/* Profile Picture Upload */}
            <div className="mb-8 pb-8 border-b-2 border-[#be9d80]/20">
              <Label className="text-[#3b1f0e] mb-4 block text-[16px]">
                <Camera className="inline w-5 h-5 mr-2" />
                Profile Picture <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="relative">
                  {profilePic ? (
                    <div className="relative group">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#be9d80] shadow-lg">
                        <img
                          src={URL.createObjectURL(profilePic)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setProfilePic(null)}
                        className="absolute top-0 right-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="profilePic"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-dashed border-[#be9d80] flex flex-col items-center justify-center cursor-pointer hover:border-[#8b5943] hover:bg-[#faf8f5] transition-colors"
                    >
                      <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-[#be9d80] mb-1" />
                      <span className="text-[10px] sm:text-[11px] text-[#6b4423] text-center px-2">Upload Photo</span>
                      <input
                        type="file"
                        id="profilePic"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setProfilePic(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="w-full sm:flex-1">
                  <div className="bg-[#fff8f0] border-2 border-[#be9d80]/40 rounded-xl p-3 sm:p-4">
                    <p className="text-[12px] sm:text-[13px] text-[#3b1f0e] mb-1 sm:mb-2">
                      <strong>📷 Photo Requirements:</strong>
                    </p>
                    <ul className="text-[11px] sm:text-[12px] text-[#6b4423] space-y-1 ml-4 list-disc">
                      <li>Upload a clear, professional headshot</li>
                      <li>Face should be clearly visible</li>
                      <li>This photo will appear on your dashboard and profile</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Manager Full Name */}
              <div>
                <Label className="text-[#3b1f0e] mb-2 block flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Manager Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleInputChange}
                  placeholder="Enter manager's full name"
                  className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <Label className="text-[#3b1f0e] mb-2 block flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Role <span className="text-red-500">*</span>
                </Label>
                <select
                  name="managerRole"
                  value={formData.managerRole}
                  onChange={(e: any) => handleInputChange(e)}
                  className="w-full h-12 px-4 rounded-lg bg-[#faf8f5] border border-[#be9d80]/40 text-[#3b1f0e]"
                  required
                >
                  <option value="">Select role</option>
                  {roleOptions.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Primary Phone */}
              <div>
                <Label className="text-[#3b1f0e] mb-2 block flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Primary Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="primaryPhone"
                  type="text"
                  value={formData.primaryPhone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and limit to 10 digits
                    if (/^\d{0,10}$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  placeholder="9876543210"
                  className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
                  pattern="\d{10}"
                  maxLength={10}
                  required
                />
                <p className="text-[12px] text-[#6b4423] mt-1">
                  Enter only numbers (exactly 10 digits)
                </p>
              </div>

              {/* Secondary Phone */}
              <div>
                <Label className="text-[#3b1f0e] mb-2 block flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Secondary Phone Number
                </Label>
                <Input
                  name="secondaryPhone"
                  type="text"
                  value={formData.secondaryPhone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and limit to 10 digits
                    if (/^\d{0,10}$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  placeholder="9876543210"
                  className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
                  pattern="\d{10}"
                  maxLength={10}
                />
                <p className="text-[12px] text-[#6b4423] mt-1">
                  Enter only numbers (exactly 10 digits)
                </p>
              </div>
            </div>
          </Card>

          {/* 4. CAFÉ PHOTOS */}
          <Card className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border-2 border-[#e8d5c4]">
            <div className="mb-6 pb-4 border-b-2 border-[#be9d80]/30">
              <h2 className="text-[26px] text-[#3b1f0e] flex items-center gap-3">
                <Camera className="w-7 h-7 text-[#be9d80]" />
                5. Café Photos <span className="text-red-500 text-[18px]">* (Minimum 5 Required)</span>
              </h2>
              <p className="text-[14px] text-[#6b4423] mt-2">
                Upload high-quality photos: interior, exterior, ambiance
              </p>
            </div>

            <div className="mb-6">
              <div className="bg-[#fff8f0] border-2 border-[#be9d80]/40 rounded-xl p-6">
                <p className="text-[14px] text-[#3b1f0e]">
                  📸 <strong>Photo Guidelines:</strong> Upload at least 5 clear, high-quality photos showcasing your café's interior, exterior, seating area, and ambiance. Great photos attract more customers!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {cafePics.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#faf8f5] border-2 border-[#be9d80]/40">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Cafe ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-[#8b5943]/80 text-white text-[11px] px-2 py-1 rounded">
                    Photo {index + 1}
                  </div>
                </div>
              ))}

              <label
                htmlFor="cafePics"
                className="aspect-square rounded-xl border-2 border-dashed border-[#be9d80] flex flex-col items-center justify-center cursor-pointer hover:border-[#8b5943] hover:bg-[#faf8f5] transition-colors"
              >
                <Plus className="w-12 h-12 text-[#be9d80] mb-2" />
                <p className="text-[13px] text-[#6b4423]">Add Photos</p>
                <input
                  type="file"
                  id="cafePics"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className={`text-[15px] p-4 rounded-xl ${cafePics.length < 5
              ? 'bg-red-50 border-2 border-red-200 text-red-700'
              : 'bg-green-50 border-2 border-green-200 text-green-700'
              }`}>
              {cafePics.length < 5 ? (
                <>⚠️ {cafePics.length}/5 photos uploaded. Please add {5 - cafePics.length} more photo(s).</>
              ) : (
                <>✅ {cafePics.length} photos uploaded. Great! You can add more if you like.</>
              )}
            </div>
          </Card>

          {/* 5. CONFIRMATION & SUBMIT */}
          <Card className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg border-2 border-[#e8d5c4]">
            <div className="mb-6 pb-4 border-b-2 border-[#be9d80]/30">
              <h2 className="text-[26px] text-[#3b1f0e]">
                5. Confirmation & Submit
              </h2>
            </div>

            <div className="space-y-4 mb-8">
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-[#faf8f5] rounded-xl hover:bg-[#fff8f0] transition-colors">
                <Checkbox
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                  className="mt-1"
                />
                <span className="text-[14px] text-[#3b1f0e]">
                  I accept the <strong>Partnership Terms & Conditions</strong> <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 bg-[#faf8f5] rounded-xl hover:bg-[#fff8f0] transition-colors">
                <Checkbox
                  checked={formData.acceptPrivacy}
                  onCheckedChange={(checked) => setFormData({ ...formData, acceptPrivacy: checked as boolean })}
                  className="mt-1"
                />
                <span className="text-[14px] text-[#3b1f0e]">
                  I accept the <strong>Privacy Policy</strong> <span className="text-red-500">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 bg-[#faf8f5] rounded-xl hover:bg-[#fff8f0] transition-colors">
                <Checkbox
                  checked={formData.acceptDataProcessing}
                  onCheckedChange={(checked) => setFormData({ ...formData, acceptDataProcessing: checked as boolean })}
                  className="mt-1"
                />
                <span className="text-[14px] text-[#3b1f0e]">
                  I consent to <strong>Data Processing & Storage</strong> <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* Commission Notice */}
            <div className="mb-8 bg-[#fff8f0] border-2 border-[#be9d80]/60 rounded-xl p-5">
              <p className="text-[15px] text-[#3b1f0e]">
                💰 <strong>Commission Fee:</strong> We will be charging a 6% commission on all transactions processed through the Caffélino platform.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate('partner-login-choice')}
                className="flex-1 h-14 text-[16px] border-2 border-[#be9d80] hover:bg-[#faf8f5]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-14 text-[16px] bg-[#8b5943] hover:bg-[#6b4423] text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration →'}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}