import { useState, useEffect } from 'react';
import {
  Home,
  ClipboardList,
  DollarSign,
  Menu as MenuIcon,
  User,
  LogOut,
  Bell,
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import CafeLiveOrders from './CafeLiveOrders';
import CafeEarnings from './CafeEarnings';
import CafeMenuManagement from './CafeMenuManagement';
import CafeOwnerProfile from './CafeOwnerProfile';

import { safeStorage } from '../utils/safeStorage';

interface CafeOwnerDashboardProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onLogout: () => void;
}

export default function CafeOwnerDashboard({ user, onNavigate, onLogout }: CafeOwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'earnings' | 'menu' | 'profile'>('orders');
  const [isOnline, setIsOnline] = useState(true);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [profilePic, setProfilePic] = useState<string>('');

  // Load profile data on mount
  useEffect(() => {
    // Try loading profile picture from API first, then fall back to localStorage
    const loadProfilePic = async () => {
      try {
        const ownerId = safeStorage.getItem('myCafeOwnerId') || safeStorage.getItem('userId');
        if (ownerId) {
          const { getMyCafe } = await import('../services/cafeService');
          const result = await getMyCafe(ownerId);
          if (result && result.cafe && result.cafe.profilePicture) {
            setProfilePic(result.cafe.profilePicture);
            // Also refresh the token if a new one was returned
            if (result.token) {
              safeStorage.setItem('cafeToken', result.token);
            }
            return;
          }
        }
      } catch (err) {
        console.error('Error loading profile from API:', err);
      }

      // Fallback: Load from localStorage
      const credentials = safeStorage.getItem('cafeOwnerCredentials');
      if (credentials) {
        try {
          const parsedCredentials = JSON.parse(credentials);
          if (parsedCredentials.profilePicture) {
            setProfilePic(parsedCredentials.profilePicture);
          }
        } catch (error) {
          console.error('Error loading profile picture:', error);
        }
      }
    };

    loadProfilePic();
  }, []);

  // Check for new orders
  useEffect(() => {
    const checkNewOrders = () => {
      const orders = JSON.parse(safeStorage.getItem('cafeOrders') || '[]');
      const newOrders = orders.filter((order: any) => order.status === 'pending');
      setNewOrderCount(newOrders.length);
    };

    checkNewOrders();
    const interval = setInterval(checkNewOrders, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Toggle online status
  const handleOnlineToggle = (checked: boolean) => {
    setIsOnline(checked);
    if (!checked) {
      // Show notification that new orders won't be received
      alert('You are now offline. You will not receive new orders.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#be9d80] border-b border-[#a88968] shadow-sm">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Profile Picture */}
            {profilePic && (
              <div className="size-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h1 className="text-white">{user?.cafeName || 'The Coffee House'}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Online Status Toggle */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <span className="text-white text-sm">
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <Switch
                checked={isOnline}
                onCheckedChange={handleOnlineToggle}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            {/* Logout */}
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-[#a88968]"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>

        {/* Bottom Tab Navigation */}
        <div className="bg-white border-t border-slate-200 overflow-x-auto">
          <div className="flex min-w-max">
            <TabButton
              icon={ClipboardList}
              label="Live Orders"
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
              badge={newOrderCount > 0 ? newOrderCount : undefined}
            />
            <TabButton
              icon={DollarSign}
              label="Earnings"
              active={activeTab === 'earnings'}
              onClick={() => setActiveTab('earnings')}
            />
            <TabButton
              icon={MenuIcon}
              label="Menu"
              active={activeTab === 'menu'}
              onClick={() => setActiveTab('menu')}
            />
            <TabButton
              icon={User}
              label="Profile"
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'orders' && <CafeLiveOrders isOnline={isOnline} cafeId={user?.cafeId || user?.id || ''} />}
        {activeTab === 'earnings' && <CafeEarnings />}
        {activeTab === 'menu' && <CafeMenuManagement />}
        {activeTab === 'profile' && <CafeOwnerProfile onNavigate={onNavigate} onLogout={onLogout} />}
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
  badge
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center gap-1 px-6 py-3 transition-colors
        ${active
          ? 'text-[#8b5943] border-b-2 border-[#8b5943] bg-slate-50'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }
      `}
    >
      <Icon className="size-5" />
      <span className="text-xs whitespace-nowrap">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
          {badge}
        </Badge>
      )}
    </button>
  );
}