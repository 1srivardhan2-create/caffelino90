import { DollarSign, TrendingUp, Users, Megaphone, PieChart } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface RevenueBreakdownProps {
  commissionEarnings: number;
  sponsoredEarnings: number;
  premiumEarnings: number;
  adsEarnings: number;
  totalEarnings: number;
}

export default function RevenueBreakdown({
  commissionEarnings,
  sponsoredEarnings,
  premiumEarnings,
  adsEarnings,
  totalEarnings
}: RevenueBreakdownProps) {
  const revenueData = [
    {
      type: 'Meetup Commissions',
      amount: commissionEarnings,
      percentage: (commissionEarnings / totalEarnings) * 100,
      icon: DollarSign,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      description: '2.5% commission per meetup bill'
    },
    {
      type: 'Sponsored Cafés',
      amount: sponsoredEarnings,
      percentage: (sponsoredEarnings / totalEarnings) * 100,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      description: 'Premium listing fees from cafés'
    },
    {
      type: 'Premium Subscriptions',
      amount: premiumEarnings,
      percentage: (premiumEarnings / totalEarnings) * 100,
      icon: Users,
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      description: '₹299/month per premium user'
    },
    {
      type: 'Advertisement Revenue',
      amount: adsEarnings,
      percentage: (adsEarnings / totalEarnings) * 100,
      icon: Megaphone,
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      description: 'Banner ads & promotions'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-200 rounded-lg flex items-center justify-center">
            <PieChart className="w-6 h-6 text-indigo-700" />
          </div>
          <div>
            <h3 className="text-[20px] font-medium text-neutral-950">Revenue Sources Breakdown</h3>
            <p className="text-[13px] text-neutral-600">Distribution of total earnings</p>
          </div>
        </div>
      </Card>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {revenueData.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.type} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <Badge className={`${item.bgColor} ${item.textColor} hover:${item.bgColor} text-[12px]`}>
                  {item.percentage.toFixed(1)}%
                </Badge>
              </div>

              <h4 className="text-[16px] font-medium text-neutral-950 mb-2">
                {item.type}
              </h4>
              <p className="text-[13px] text-neutral-600 mb-4">
                {item.description}
              </p>

              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-bold text-neutral-950">
                  ₹{item.amount.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Visual Breakdown */}
      <Card className="p-6">
        <h4 className="text-[18px] font-medium text-neutral-950 mb-4">Revenue Distribution</h4>
        
        {/* Stacked Bar */}
        <div className="h-16 bg-neutral-100 rounded-lg overflow-hidden flex mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-medium text-[12px]"
            style={{ width: `${(commissionEarnings / totalEarnings) * 100}%` }}
          >
            {((commissionEarnings / totalEarnings) * 100).toFixed(0)}%
          </div>
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white font-medium text-[12px]"
            style={{ width: `${(sponsoredEarnings / totalEarnings) * 100}%` }}
          >
            {((sponsoredEarnings / totalEarnings) * 100).toFixed(0)}%
          </div>
          <div
            className="bg-gradient-to-r from-green-500 to-green-700 flex items-center justify-center text-white font-medium text-[12px]"
            style={{ width: `${(premiumEarnings / totalEarnings) * 100}%` }}
          >
            {((premiumEarnings / totalEarnings) * 100).toFixed(0)}%
          </div>
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-700 flex items-center justify-center text-white font-medium text-[12px]"
            style={{ width: `${(adsEarnings / totalEarnings) * 100}%` }}
          >
            {((adsEarnings / totalEarnings) * 100).toFixed(0)}%
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-blue-700"></div>
            <span className="text-[13px] text-neutral-700">Commissions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-500 to-purple-700"></div>
            <span className="text-[13px] text-neutral-700">Sponsored</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-green-700"></div>
            <span className="text-[13px] text-neutral-700">Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-500 to-orange-700"></div>
            <span className="text-[13px] text-neutral-700">Ads</span>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <h4 className="text-[16px] font-medium text-neutral-950 mb-3">💡 Key Insights</h4>
        <div className="space-y-2 text-[13px] text-neutral-700">
          <p>• <strong>Primary Revenue:</strong> {revenueData.sort((a, b) => b.amount - a.amount)[0].type} contributes the most (₹{revenueData.sort((a, b) => b.amount - a.amount)[0].amount.toLocaleString()})</p>
          <p>• <strong>Growth Opportunity:</strong> Sponsored listings show strong potential for expansion</p>
          <p>• <strong>Recurring Income:</strong> Premium subscriptions provide steady monthly revenue</p>
          <p>• <strong>Diversification:</strong> Revenue spread across {revenueData.filter(r => r.amount > 0).length} different sources</p>
        </div>
      </Card>
    </div>
  );
}
