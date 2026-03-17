import { useState } from 'react';
import { User, Mail, Phone, MapPin, Clock, Edit2, Save, LogOut } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface CafeProfileProps {
  user: any;
  onLogout: () => void;
}

export default function CafeProfile({ user, onLogout }: CafeProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    cafeName: user?.cafeName || 'The Coffee House',
    ownerName: user?.ownerName || 'Rahul Sharma',
    email: user?.email || 'cafe@example.com',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || '123 MG Road, Bangalore',
    openingTime: '08:00',
    closingTime: '22:00',
  });

  const handleSave = () => {
    // In real app, save to backend
    toast.success('Profile updated successfully! ✓');
    setIsEditing(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      {/* Profile Header */}
      <Card className="p-6 bg-gradient-to-br from-[#8b5943] to-[#6d4532] text-white">
        <div className="flex items-center gap-4">
          <div className="size-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <User className="size-10" />
          </div>
          <div className="flex-1">
            <h2 className="text-white mb-1">{profileData.cafeName}</h2>
            <p className="text-sm text-white/80">{profileData.ownerName}</p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="secondary"
              size="sm"
            >
              <Edit2 className="size-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </Card>

      {/* Profile Details */}
      <Card className="p-4 space-y-4">
        <h3 className="text-slate-900">Cafe Information</h3>

        <div className="space-y-3">
          <div>
            <Label>Cafe Name</Label>
            <Input
              value={profileData.cafeName}
              onChange={(e) => setProfileData({ ...profileData, cafeName: e.target.value })}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Owner Name</Label>
            <Input
              value={profileData.ownerName}
              onChange={(e) => setProfileData({ ...profileData, ownerName: e.target.value })}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Phone</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Address</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 size-4 text-slate-400" />
              <Input
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Operating Hours */}
      <Card className="p-4 space-y-4">
        <h3 className="text-slate-900 flex items-center gap-2">
          <Clock className="size-5" />
          Operating Hours
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Opening Time</Label>
            <Input
              type="time"
              value={profileData.openingTime}
              onChange={(e) => setProfileData({ ...profileData, openingTime: e.target.value })}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Closing Time</Label>
            <Input
              type="time"
              value={profileData.closingTime}
              onChange={(e) => setProfileData({ ...profileData, closingTime: e.target.value })}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
        </div>

        <div className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
          Current hours: {profileData.openingTime} - {profileData.closingTime}
        </div>
      </Card>

      {/* Actions */}
      {isEditing && (
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Save className="size-4 mr-2" />
            Save Changes
          </Button>
          <Button
            onClick={() => setIsEditing(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Logout */}
      <Button
        onClick={onLogout}
        variant="destructive"
        className="w-full"
      >
        <LogOut className="size-4 mr-2" />
        Logout
      </Button>

      {/* App Info */}
      <Card className="p-4 bg-slate-50 text-center">
        <p className="text-sm text-slate-600">Caffélino Cafe Partner</p>
        <p className="text-xs text-slate-500 mt-1">Version 1.0.0</p>
      </Card>
    </div>
  );
}
