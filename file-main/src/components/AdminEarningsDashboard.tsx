import { ArrowLeft, TrendingUp } from 'lucide-react';

interface AdminEarningsDashboardProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function AdminEarningsDashboard({ user, onNavigate, onBack }: AdminEarningsDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-4 shadow-lg">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-white text-[24px] font-['Arial:Regular',_sans-serif] flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Earnings Dashboard
              </h1>
              <p className="text-white/90 text-[13px]">
                Real-time revenue tracking & payouts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Empty page - content removed */}
      </div>
    </div>
  );
}
