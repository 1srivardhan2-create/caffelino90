import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Clock, Store, Camera, Edit, Save, X, Lock, LogOut, Trash2, Plus, Image as ImageIcon, Briefcase, CreditCard, Wallet, Copy, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { toast } from 'sonner';
import { safeStorage } from '../utils/safeStorage';
import { getMyCafe, updateCafePhotos } from '../services/cafeService';

interface CafeOwnerProfileProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface ProfileData {
  // Personal Information (matches registration section 3)
  fullName: string;
  email: string;
  mobile: string;
  secondaryPhone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  city: string;
  area: string;

  // Café Information (matches registration section 1)
  cafeName: string;
  cafeAddress: string;
  cafeType: string[];
  averageCostPerPerson: string;
  description: string;
  seatingCapacity: string;
  cafeStatus: 'open' | 'closed';
  googleMapsLocation?: string; // Optional Google Maps link

  // Manager Role (from registration section 3)
  managerRole: string;

  // Profile Photo
  profilePhoto: string;
}

interface OpeningHours {
  [key: string]: { open: string; close: string; closed: boolean };
}

export default function CafeOwnerProfile({ onNavigate, onLogout }: CafeOwnerProfileProps) {
  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    email: '',
    mobile: '',
    secondaryPhone: '',
    gender: 'male',
    dateOfBirth: '',
    city: '',
    area: '',
    cafeName: '',
    cafeAddress: '',
    cafeType: [],
    averageCostPerPerson: '',
    description: '',
    seatingCapacity: '40',
    cafeStatus: 'open',
    managerRole: '',
    profilePhoto: '',
  });

  const [openingHours, setOpeningHours] = useState<OpeningHours>({
    Monday: { open: '09:00', close: '22:00', closed: false },
    Tuesday: { open: '09:00', close: '22:00', closed: false },
    Wednesday: { open: '09:00', close: '22:00', closed: false },
    Thursday: { open: '09:00', close: '22:00', closed: false },
    Friday: { open: '09:00', close: '22:00', closed: false },
    Saturday: { open: '09:00', close: '22:00', closed: false },
    Sunday: { open: '09:00', close: '22:00', closed: false },
  });

  const [cafePhotos, setCafePhotos] = useState<string[]>([]);
  const [cafeDbId, setCafeDbId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const cafeTypeOptions = ['Coffee Shop', 'Bakery', 'Restaurant', 'Multi-Cuisine', 'Vegan-Friendly', 'Fast Food', 'Fine Dining'];
  const paymentMethodOptions = ['UPI', 'Cash'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const roleOptions = ['Owner', 'Manager', 'Admin'];

  // Load profile from registration data on mount, then try to load photos from DB
  useEffect(() => {
    const registrationData = safeStorage.getItem('cafeRegistrationData');
    const savedProfile = safeStorage.getItem('cafeOwnerProfile');

    // Also load Google account info stored during login
    const googleEmail = safeStorage.getItem('ownerEmail') || '';
    const googleName = safeStorage.getItem('ownerName') || '';

    if (registrationData) {
      try {
        const regData = JSON.parse(registrationData);

        // Map ALL registration fields to profile
        const mappedProfile: ProfileData = {
          // From section 3: Manager/Contact Info
          fullName: regData.managerName || googleName || '',
          email: regData.managerEmail || regData.accountEmail || googleEmail || '',
          mobile: regData.primaryPhone || '',
          secondaryPhone: regData.secondaryPhone || '',
          managerRole: regData.managerRole || '',

          // Default personal fields (can be edited later)
          gender: 'male',
          dateOfBirth: '',
          city: '',
          area: '',

          // From section 1: Café Information
          cafeName: regData.cafeName || '',
          cafeAddress: regData.cafeAddress || '',
          cafeType: regData.cafeType || [],
          averageCostPerPerson: regData.averageCostPerPerson || '',
          description: regData.description || '',
          seatingCapacity: '40',
          cafeStatus: 'open',
          googleMapsLocation: regData.googleMapsLocation || '',

          profilePhoto: '',
        };

        // From section 2: Operating Hours
        if (regData.openingHours) {
          setOpeningHours(regData.openingHours);
        }

        // From section 5: Café Photos (fallback from localStorage)
        if (regData.cafePhotos) {
          setCafePhotos(regData.cafePhotos);
        }

        setProfile(mappedProfile);
        safeStorage.setItem('cafeOwnerProfile', JSON.stringify(mappedProfile));
      } catch (error) {
        console.error('Error loading registration data:', error);
      }
    } else if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        // Backfill Google email/name if empty in saved profile
        if (!parsedProfile.email && googleEmail) parsedProfile.email = googleEmail;
        if (!parsedProfile.fullName && googleName) parsedProfile.fullName = googleName;
        setProfile(parsedProfile);

        // Load operating hours
        const savedHours = safeStorage.getItem('cafeOpeningHours');
        if (savedHours) {
          setOpeningHours(JSON.parse(savedHours));
        }

        // Load photos from localStorage as fallback
        const savedPhotos = safeStorage.getItem('cafePhotos');
        if (savedPhotos) {
          setCafePhotos(JSON.parse(savedPhotos));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    } else {
      // No registration data found — populate from Google credentials at minimum
      const credentials = safeStorage.getItem('cafeOwnerCredentials');
      let cafeName = '';
      if (credentials) {
        try {
          const parsed = JSON.parse(credentials);
          cafeName = parsed.cafeName || '';
        } catch (e) { }
      }

      setProfile(prev => ({
        ...prev,
        email: googleEmail,
        fullName: googleName,
        cafeName: cafeName,
      }));
    }

    // Load cafe data (including photos) from MongoDB
    const ownerId = safeStorage.getItem('myCafeOwnerId') || safeStorage.getItem('userId');
    if (ownerId) {
      getMyCafe(ownerId).then((data: any) => {
        if (data && data.cafe) {
          setCafeDbId(data.cafe._id);
          // If DB has photos, use them (DB is source of truth)
          if (data.cafe.Cafe_photos && data.cafe.Cafe_photos.length > 0) {
            setCafePhotos(data.cafe.Cafe_photos);
            safeStorage.setItem('cafePhotos', JSON.stringify(data.cafe.Cafe_photos));
          }
        }
      }).catch((err: any) => {
        console.error('Error loading cafe from DB:', err);
      });
    }
  }, []);

  const handleSaveProfile = async () => {
    // Save profile data to localStorage
    safeStorage.setItem('cafeOwnerProfile', JSON.stringify(profile));
    safeStorage.setItem('cafeOpeningHours', JSON.stringify(openingHours));
    safeStorage.setItem('cafePhotos', JSON.stringify(cafePhotos));

    // Update registration data to keep in sync
    const registrationData = safeStorage.getItem('cafeRegistrationData');
    if (registrationData) {
      const regData = JSON.parse(registrationData);
      regData.managerName = profile.fullName;
      regData.managerEmail = profile.email;
      regData.primaryPhone = profile.mobile;
      regData.secondaryPhone = profile.secondaryPhone;
      regData.managerRole = profile.managerRole;
      regData.cafeName = profile.cafeName;
      regData.cafeAddress = profile.cafeAddress;
      regData.cafeType = profile.cafeType;
      regData.averageCostPerPerson = profile.averageCostPerPerson;
      regData.description = profile.description;
      regData.openingHours = openingHours;
      regData.cafePhotos = cafePhotos;
      regData.googleMapsLocation = profile.googleMapsLocation || '';
      regData.profilePhoto = profile.profilePhoto; // Sync profile photo to reg data
      safeStorage.setItem('cafeRegistrationData', JSON.stringify(regData));
    }

    // Sync photos and profile picture to MongoDB
    if (cafeDbId) {
      try {
        await updateCafePhotos(cafeDbId, { 
          cafePhotos, 
          profilePicture: profile.profilePhoto 
        });
        console.log('📸 Profile and photos synced to MongoDB');
      } catch (err) {
        console.error('Failed to sync data to DB:', err);
        toast.error('Data saved locally but failed to sync to server');
      }
    }

    toast.success('✅ Profile updated successfully!');
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Photo = reader.result as string;
        setProfile({ ...profile, profilePhoto: base64Photo });
        
        // Auto-sync profile photo to MongoDB if we have a cafeDbId
        if (cafeDbId) {
          try {
            const result = await updateCafePhotos(cafeDbId, { 
              profilePicture: base64Photo 
            });
            if (result?.cafe?.profilePicture) {
              setProfile(prev => ({ ...prev, profilePhoto: result.cafe.profilePicture }));
              toast.success('Profile photo updated & synced!');
            }
          } catch (error) {
            console.error('Failed to sync profile photo:', error);
            toast.success('Profile photo updated (sync pending)');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCafePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const readPromises = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(async (newPhotos) => {
      const updatedPhotos = [...cafePhotos, ...newPhotos];
      setCafePhotos(updatedPhotos);
      safeStorage.setItem('cafePhotos', JSON.stringify(updatedPhotos));

      // Auto-sync to MongoDB (which will upload base64 to Cloudinary)
      if (cafeDbId) {
        try {
          const result = await updateCafePhotos(cafeDbId, { 
            cafePhotos: updatedPhotos 
          });
          // Replace local base64 with Cloudinary URLs from server response
          if (result?.cafe?.Cafe_photos) {
            setCafePhotos(result.cafe.Cafe_photos);
            safeStorage.setItem('cafePhotos', JSON.stringify(result.cafe.Cafe_photos));
          }
          toast.success(`${newPhotos.length} photo(s) added & synced!`);
        } catch (err) {
          console.error('Failed to sync new photos to DB:', err);
          toast.success(`${newPhotos.length} photo(s) added (sync pending)`);
        }
      } else {
        toast.success(`${newPhotos.length} photo(s) added successfully!`);
      }
    });
  };

  const handleRemoveCafePhoto = async (index: number) => {
    const updatedPhotos = cafePhotos.filter((_, i) => i !== index);
    setCafePhotos(updatedPhotos);
    safeStorage.setItem('cafePhotos', JSON.stringify(updatedPhotos));

    // Auto-sync to MongoDB
    if (cafeDbId) {
      try {
        await updateCafePhotos(cafeDbId, { 
          cafePhotos: updatedPhotos 
        });
        toast.success('Photo removed & synced!');
      } catch (err) {
        console.error('Failed to sync photo removal to DB:', err);
        toast.success('Photo removed (sync pending)');
      }
    } else {
      toast.success('Photo removed successfully!');
    }
  };

  const toggleCafeType = (type: string) => {
    setProfile({
      ...profile,
      cafeType: profile.cafeType.includes(type)
        ? profile.cafeType.filter(t => t !== type)
        : [...profile.cafeType, type]
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

  const toggleCafeStatus = () => {
    const newStatus = profile.cafeStatus === 'open' ? 'closed' : 'open';
    setProfile({ ...profile, cafeStatus: newStatus });
    toast.success(`Cafe marked as ${newStatus === 'open' ? 'Open ✅' : 'Closed ❌'}`, { duration: 2000 });
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    toast.success('Password changed successfully!');
    setShowPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    safeStorage.removeItem('cafeOwnerProfile');
    safeStorage.removeItem('cafeOpeningHours');
    safeStorage.removeItem('cafePhotos');
    safeStorage.removeItem('cafeRegistrationData');
    toast.success('Account deleted successfully');
    setShowDeleteDialog(false);
    onLogout();
  };

  const getGenderAvatar = () => {
    if (profile.profilePhoto) return profile.profilePhoto;
    return profile.gender === 'male' ? '👨' : profile.gender === 'female' ? '👩' : '👤';
  };

  const copyLocationLink = () => {
    if (profile.googleMapsLocation) {
      navigator.clipboard.writeText(profile.googleMapsLocation);
      toast.success('Location link copied to clipboard!');
    }
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-[#fff8f0] to-white border-2 border-[#be9d80]/40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Profile Photo & Quick Info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className={`w-28 h-28 rounded-full ${profile.gender === 'male' ? 'bg-blue-100' : profile.gender === 'female' ? 'bg-pink-100' : 'bg-purple-100'} flex items-center justify-center overflow-hidden border-4 border-white shadow-xl`}>
                  {profile.profilePhoto ? (
                    <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">{getGenderAvatar()}</span>
                  )}
                </div>

                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#8b5943] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#6b4423] transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <h1 className="text-[32px] text-[#3b1f0e] mb-1">{profile.cafeName || 'Your Café'}</h1>
                <p className="text-[18px] text-[#6b4423] mb-3">{profile.fullName || 'Café Owner'}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1 bg-white">
                    <Mail className="w-3 h-3" />
                    {profile.email || 'email@cafe.com'}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1 bg-white">
                    <Phone className="w-3 h-3" />
                    {profile.mobile || '+91 XXXXX XXXXX'}
                  </Badge>
                  <Badge
                    className={profile.cafeStatus === 'open' ? 'bg-green-500' : 'bg-red-500'}
                    onClick={toggleCafeStatus}
                  >
                    {profile.cafeStatus === 'open' ? '✅ Open' : '❌ Closed'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Edit/Save Buttons */}
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-[#8b5943] hover:bg-[#6b4423]">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="border-[#be9d80]">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} className="bg-[#8b5943] hover:bg-[#6b4423]">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* 1. Personal Information */}
        <Card className="p-8 mb-8 border-2 border-[#e8d5c4]">
          <h3 className="text-[24px] text-[#3b1f0e] mb-6 flex items-center gap-3 pb-4 border-b-2 border-[#be9d80]/30">
            <User className="w-6 h-6 text-[#be9d80]" />
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Full Name</Label>
              <Input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                disabled={!isEditing}
                className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
              />
            </div>

            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Email</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
                className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
              />
            </div>

            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Phone Number</Label>
              <Input
                value={profile.mobile}
                onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                disabled={!isEditing}
                className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
              />
            </div>

            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Secondary Phone</Label>
              <Input
                value={profile.secondaryPhone}
                onChange={(e) => setProfile({ ...profile, secondaryPhone: e.target.value })}
                disabled={!isEditing}
                className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
              />
            </div>

            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Gender</Label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                disabled={!isEditing}
                className="w-full h-12 px-4 rounded-lg bg-[#faf8f5] border border-[#be9d80]/40 disabled:opacity-50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Date of Birth</Label>
              <Input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                disabled={!isEditing}
                className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
              />
            </div>

            <div>
              <Label className="text-[#3b1f0e] mb-2 block">City</Label>
              <Input
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                disabled={!isEditing}
                className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
              />
            </div>

            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Area / Locality</Label>
              <Input
                value={profile.area}
                onChange={(e) => setProfile({ ...profile, area: e.target.value })}
                disabled={!isEditing}
                className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
              />
            </div>
          </div>
        </Card>

        {/* 2. Café Information */}
        <Card className="p-8 mb-8 border-2 border-[#e8d5c4]">
          <h3 className="text-[24px] text-[#3b1f0e] mb-6 flex items-center gap-3 pb-4 border-b-2 border-[#be9d80]/30">
            <Store className="w-6 h-6 text-[#be9d80]" />
            Café Information
          </h3>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-[#3b1f0e] mb-2 block">Café Name</Label>
                <Input
                  value={profile.cafeName}
                  onChange={(e) => setProfile({ ...profile, cafeName: e.target.value })}
                  disabled={!isEditing}
                  className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
                />
              </div>

              <div>
                <Label className="text-[#3b1f0e] mb-2 block">Average Cost Per Person (₹)</Label>
                <Input
                  type="number"
                  value={profile.averageCostPerPerson}
                  onChange={(e) => setProfile({ ...profile, averageCostPerPerson: e.target.value })}
                  disabled={!isEditing}
                  className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
                />
              </div>
            </div>

            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Café Type</Label>
              {isEditing ? (
                <div className="flex flex-wrap gap-3">
                  {cafeTypeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleCafeType(type)}
                      className={`px-5 py-2.5 rounded-full text-[14px] transition-all ${profile.cafeType.includes(type)
                          ? 'bg-[#8b5943] text-white shadow-md'
                          : 'bg-[#e8d5c4] text-[#3b1f0e] hover:bg-[#be9d80] hover:text-white'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.cafeType.map(type => (
                    <Badge key={type} className="bg-[#8b5943]">{type}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Café Description</Label>
              <Textarea
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                disabled={!isEditing}
                className="min-h-[100px] bg-[#faf8f5] border-[#be9d80]/40"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-[#3b1f0e] mb-2 block">Seating Capacity</Label>
                <Input
                  type="number"
                  value={profile.seatingCapacity}
                  onChange={(e) => setProfile({ ...profile, seatingCapacity: e.target.value })}
                  disabled={!isEditing}
                  className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
                />
              </div>

              <div>
                <Label className="text-[#3b1f0e] mb-2 block">Current Status</Label>
                <Button
                  type="button"
                  onClick={toggleCafeStatus}
                  className={`w-full h-12 ${profile.cafeStatus === 'open' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {profile.cafeStatus === 'open' ? '✅ Open' : '❌ Closed'}
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Full Address</Label>
              <Textarea
                value={profile.cafeAddress}
                onChange={(e) => setProfile({ ...profile, cafeAddress: e.target.value })}
                disabled={!isEditing}
                className="min-h-[80px] bg-[#faf8f5] border-[#be9d80]/40"
              />
            </div>
          </div>
        </Card>

        {/* 3. Operating Hours */}
        <Card className="p-8 mb-8 border-2 border-[#e8d5c4]">
          <h3 className="text-[24px] text-[#3b1f0e] mb-6 flex items-center gap-3 pb-4 border-b-2 border-[#be9d80]/30">
            <Clock className="w-6 h-6 text-[#be9d80]" />
            Operating Hours
          </h3>

          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center gap-4 p-4 bg-[#faf8f5] rounded-xl">
                <div className="w-32">
                  <span className="text-[15px] text-[#3b1f0e]">{day}</span>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <Input
                    type="time"
                    value={openingHours[day].open}
                    onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                    disabled={!isEditing || openingHours[day].closed}
                    className="h-10 bg-white border-[#be9d80]/40"
                  />
                  <span className="text-[#6b4423]">to</span>
                  <Input
                    type="time"
                    value={openingHours[day].close}
                    onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                    disabled={!isEditing || openingHours[day].closed}
                    className="h-10 bg-white border-[#be9d80]/40"
                  />
                  {isEditing && (
                    <label className="flex items-center gap-2 cursor-pointer ml-2">
                      <Checkbox
                        checked={openingHours[day].closed}
                        onCheckedChange={(checked) => handleOpeningHoursChange(day, 'closed', checked as boolean)}
                      />
                      <span className="text-[13px] text-[#6b4423]">Closed</span>
                    </label>
                  )}
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

        {/* 4. Café Photo Gallery */}
        <Card className="p-8 mb-8 border-2 border-[#e8d5c4]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-[#be9d80]/30">
            <h3 className="text-[24px] text-[#3b1f0e] flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-[#be9d80]" />
              Café Photo Gallery
            </h3>
            {cafePhotos.length > 0 && (
              <Badge variant="outline" className="text-[14px]">
                {cafePhotos.length} {cafePhotos.length === 1 ? 'Photo' : 'Photos'}
              </Badge>
            )}
          </div>

          {cafePhotos.length === 0 ? (
            <div className="text-center py-16 bg-[#faf8f5] rounded-xl border-2 border-dashed border-[#be9d80]/40">
              <ImageIcon className="w-20 h-20 mx-auto mb-4 text-[#be9d80]" />
              <p className="text-[16px] text-[#3b1f0e] mb-2">No café photos yet</p>
              <p className="text-[14px] text-[#6b4423] mb-4">
                Add photos to showcase your café's ambiance and attract more customers
              </p>
              <label htmlFor="addCafePhotos" className="inline-block">
                <Button type="button" asChild className="bg-[#8b5943] hover:bg-[#6b4423]">
                  <span className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Photos
                  </span>
                </Button>
                <input
                  type="file"
                  id="addCafePhotos"
                  accept="image/*"
                  multiple
                  onChange={handleAddCafePhoto}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cafePhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#faf8f5] border-2 border-[#be9d80]/40">
                    <img
                      src={photo}
                      alt={`Cafe ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCafePhoto(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="absolute bottom-2 right-2 bg-[#8b5943]/80 text-white text-[11px] px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}

              {/* Always show Add Photos button */}
              <label
                htmlFor="addMorePhotos"
                className="aspect-square rounded-xl border-2 border-dashed border-[#be9d80] flex flex-col items-center justify-center cursor-pointer hover:border-[#8b5943] hover:bg-[#faf8f5] transition-colors"
              >
                <Plus className="w-12 h-12 text-[#be9d80] mb-2" />
                <p className="text-[13px] text-[#6b4423]">Add Photos</p>
                <input
                  type="file"
                  id="addMorePhotos"
                  accept="image/*"
                  multiple
                  onChange={handleAddCafePhoto}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {cafePhotos.length > 0 && (
            <div className="mt-6 p-4 bg-[#fff8f0] border-2 border-[#be9d80]/40 rounded-xl">
              <p className="text-[14px] text-[#3b1f0e]">
                💡 <strong>Tip:</strong> High-quality photos attract more customers! Minimum 5 photos recommended. {isEditing && 'Click on a photo to remove it in edit mode.'}
              </p>
            </div>
          )}
        </Card>

        {/* 5. Location Section */}
        <Card className="p-8 mb-8 border-2 border-[#e8d5c4]">
          <h3 className="text-[24px] text-[#3b1f0e] mb-6 flex items-center gap-3 pb-4 border-b-2 border-[#be9d80]/30">
            <MapPin className="w-6 h-6 text-[#be9d80]" />
            Location
          </h3>

          <div className="space-y-4">
            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Address</Label>
              <div className="p-4 bg-[#faf8f5] rounded-xl text-[#3b1f0e]">
                {profile.cafeAddress || 'No address provided'}
              </div>
            </div>

            <div>
              <Label className="text-[#3b1f0e] mb-2 block">Google Maps Link</Label>
              <div className="flex gap-2">
                <Input
                  value={profile.googleMapsLocation}
                  onChange={(e) => setProfile({ ...profile, googleMapsLocation: e.target.value })}
                  disabled={!isEditing}
                  className="h-12 bg-[#faf8f5] border-[#be9d80]/40"
                />
                {profile.googleMapsLocation && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={copyLocationLink}
                      className="border-[#be9d80]"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.open(profile.googleMapsLocation, '_blank')}
                      className="border-[#be9d80]"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 bg-[#fff8f0] border-2 border-[#be9d80]/40 rounded-xl">
              <p className="text-[14px] text-[#3b1f0e]">
                📍 <strong>Note:</strong> To display interactive map, add Google Maps API key
              </p>
            </div>
          </div>
        </Card>

        {/* 6. Account Settings */}
        <Card className="p-8 border-2 border-[#e8d5c4]">
          <h3 className="text-[24px] text-[#3b1f0e] mb-6 flex items-center gap-3 pb-4 border-b-2 border-[#be9d80]/30">
            <Lock className="w-6 h-6 text-[#be9d80]" />
            Account Settings
          </h3>

          <div className="space-y-4">
            <Button
              onClick={() => setShowPasswordDialog(true)}
              variant="outline"
              className="w-full h-12 justify-start border-[#be9d80]"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>

            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full h-12 justify-start border-[#be9d80]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>

            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="outline"
              className="w-full h-12 justify-start border-red-500 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword} className="bg-[#8b5943] hover:bg-[#6b4423]">
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-[14px]">
              ⚠️ <strong>Warning:</strong> All your data including café information, photos, and settings will be permanently deleted.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} className="bg-red-500 hover:bg-red-600">
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
