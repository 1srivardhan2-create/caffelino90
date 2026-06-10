import { ArrowLeft, CheckCircle, Coffee, MapPin, Clock, Crown, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface VotingCompleteProps {
  onNavigate: (page: string, data?: any) => void;
  groupData: any;
}

export default function VotingComplete({ onNavigate, groupData }: VotingCompleteProps) {
  const selectedCafe = groupData?.selectedCafe;

  const handleGoToGroupHome = () => {
    onNavigate('group-home', {
      ...groupData,
      cafe: selectedCafe,
      cafeFinalized: true
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-[#be9d80] text-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-[20px] leading-[28px]">Voting Complete</h1>
              <p className="text-sm text-white/90 mt-1">
                {groupData?.name || 'Group Meetup'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white">
              <Coffee className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h2 className="text-[28px] leading-[36px] text-neutral-950 mb-2">
            Café Selected! 🎉
          </h2>
          <p className="text-slate-600">
            Everyone has voted. Your group's café is ready!
          </p>
        </div>

        {/* Selected Café Card */}
        <Card className="overflow-hidden mb-6 border-2 border-green-500">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Selected Café</span>
            </div>
          </div>
          
          <div className="p-4">
            {selectedCafe?.image && (
              <div className="w-full h-48 rounded-[12px] overflow-hidden mb-4">
                <img 
                  src={selectedCafe.image} 
                  alt={selectedCafe.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-[24px] leading-[32px] text-neutral-950 mb-2">
                  {selectedCafe?.name || 'Café Milano'}
                </h3>
                
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">
                    {selectedCafe?.location || 'Koramangala, Bangalore'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">
                    {selectedCafe?.hours || 'Open 8:00 AM - 10:00 PM'}
                  </span>
                </div>
              </div>

              {selectedCafe?.rating && (
                <div className="flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full">
                  <span className="text-green-700 font-medium">★</span>
                  <span className="text-green-900 font-medium">{selectedCafe.rating}</span>
                </div>
              )}
            </div>

            {selectedCafe?.tags && selectedCafe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCafe.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {selectedCafe?.price && (
              <div className="flex items-center gap-2 pt-3 border-t">
                <Coffee className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">
                  Average price: <span className="font-medium text-neutral-950">{selectedCafe.price}</span>
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Info Banner */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-900 mb-1">
                <span className="font-medium">Admin Menu Control:</span>
              </p>
              <p className="text-sm text-amber-800">
                Only the selected café's menu will be used. Admin can manage menu from Group Home.
              </p>
            </div>
          </div>
        </Card>

        {/* Primary Action Button */}
        <Button
          onClick={handleGoToGroupHome}
          className="w-full h-[52px] bg-[#030213] hover:bg-[#030213]/90 rounded-[8px] text-[16px] mb-4"
        >
          Go to Group Home
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Secondary Info */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            You can now chat with members, browse menu, and place orders
          </p>
        </div>
      </div>
    </div>
  );
}