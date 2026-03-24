import { ArrowLeft, LogOut, Trash2, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
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

export default function Settings({ onNavigate, user, onLogout }: SettingsProps) {
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

  return (
    <div className="bg-slate-50 min-h-screen w-full pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="size-6 text-neutral-900" />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-neutral-950">
            Settings
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-8 space-y-8">
        {/* Profile Card */}
        <Card className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col items-center text-center">
          <div className="relative mb-4">
            {user?.avatarId && (user?.gender === 'male' || user?.gender === 'female') ? (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center text-5xl bg-gradient-to-br from-[#e8d5c4] to-[#d9bf9d] border-4 border-[#be9d80] shadow-lg">
                {getAvatarById(user.avatarId)?.emoji}
              </div>
            ) : (
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-slate-100 shadow-sm">
                <AvatarImage src={user?.photo} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-[#e8d5c4] to-[#d9bf9d] text-[#8b5943] text-3xl font-medium">
                  {user?.firstName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
            <button className="absolute bottom-0 right-0 bg-[#be9d80] text-white p-2.5 rounded-full hover:bg-[#a88968] transition-colors shadow-md">
              <Camera className="size-4" />
            </button>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-neutral-950 mb-1">
            {user?.firstName || user?.name}
          </h3>
          <p className="text-sm sm:text-base text-slate-500 mb-2">{user?.email}</p>
          
          {user?.verified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs sm:text-sm font-medium rounded-full mt-2">
              ✓ Verified Account
            </span>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-14 rounded-xl text-base font-medium flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-50 text-neutral-800 transition-colors"
          >
            <LogOut className="size-5" />
            Logout
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="w-full h-14 rounded-xl text-base font-medium flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
              >
                <Trash2 className="size-5" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl max-w-[90vw] sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-base mt-2">
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-3">
                <AlertDialogCancel className="mt-0 h-12 rounded-xl text-base font-medium border-slate-200">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount} 
                  className="h-12 rounded-xl text-base font-medium bg-red-600 hover:bg-red-700"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
