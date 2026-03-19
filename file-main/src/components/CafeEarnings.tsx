import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Banknote, 
  ShoppingBag, 
  CheckCircle, 
  Clock,
  Calendar,
  TrendingDown,
  Wallet,
  IndianRupee,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { safeStorage } from '../utils/safeStorage';

interface EarningsSummary {
  today: number;
  week: number;
  month: number;
  allTime: number;
}

interface EarningItem {
  _id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
}

export default function CafeEarnings() {
  const [summary, setSummary] = useState<EarningsSummary>({ today: 0, week: 0, month: 0, allTime: 0 });
  const [earnings, setEarnings] = useState<EarningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we're in browser environment
  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  
  // Resolve cafeId from localStorage (same as CafeLiveOrders)
  const resolvedCafeId = isBrowser ? (safeStorage.getItem('myCafeOwnerId') || safeStorage.getItem('myCafeId') || safeStorage.getItem('userId') || '') : '';

  useEffect(() => {
    fetchEarnings();
    // Auto-update every 10 seconds
    const interval = setInterval(fetchEarnings, 10000);
    return () => clearInterval(interval);
  }, [resolvedCafeId]);

  const fetchEarnings = async () => {
    if (!resolvedCafeId) return;
    try {
      const res = await fetch(`https://caffelino90-9v4a.onrender.com/api/meetup-orders/earnings/${resolvedCafeId}`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setEarnings(data.earnings);
      }
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Earnings Dashboard
          </h1>
          <p className="text-slate-600">
            Complete financial overview • {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long',
              day: 'numeric', 
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Today's Earnings */}
          <Card className="p-6 bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                <IndianRupee className="w-6 h-6 text-green-700" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-none">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
            <h3 className="text-sm text-slate-600 mb-2">Today's Earnings</h3>
            <div className="text-3xl font-bold text-slate-900 mb-3">
              ₹{summary.today.toLocaleString('en-IN')}
            </div>
          </Card>

          {/* 2. This Week's Earnings */}
          <Card className="p-6 bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-700" />
              </div>
            </div>
            <h3 className="text-sm text-slate-600 mb-2">This Week</h3>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              ₹{summary.week.toLocaleString('en-IN')}
            </div>
          </Card>

          {/* 3. This Month's Earnings */}
          <Card className="p-6 bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-700" />
              </div>
            </div>
            <h3 className="text-sm text-slate-600 mb-2">This Month</h3>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              ₹{summary.month.toLocaleString('en-IN')}
            </div>
          </Card>

          {/* 4. Total Lifetime Earnings */}
          <Card className="p-6 bg-gradient-to-br from-amber-600 to-orange-700 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-none">
                All Time
              </Badge>
            </div>
            <h3 className="text-sm text-white/80 mb-2">Lifetime Earnings</h3>
            <div className="text-3xl font-bold mb-2">
              ₹{summary.allTime.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-white/70">Since café joined platform</p>
          </Card>
        </div>

        {/* Detailed Earnings Breakdown Table */}
        <Card className="p-6 bg-white border-none shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Detailed Earnings History</h2>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">Date & Time</TableHead>
                  <TableHead className="font-semibold">Order Details</TableHead>
                  <TableHead className="font-semibold">Payment Mode</TableHead>
                  <TableHead className="font-semibold text-right">Collected Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.length > 0 ? (
                  earnings.map((earning) => (
                    <TableRow key={earning._id} className="hover:bg-slate-50">
                      <TableCell className="text-sm">
                        {new Date(earning.createdAt).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-slate-100 text-slate-900">
                          Order #{earning.orderId ? earning.orderId.slice(-6).toUpperCase() : 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-amber-100 text-amber-700 text-xs">
                          <Banknote className="w-3 h-3 mr-1" />
                          {earning.paymentMethod || 'Cash'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-700">
                        ₹{(earning.amount || 0).toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-slate-100 size-16 rounded-full flex items-center justify-center">
                          <DollarSign className="size-8 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">No earnings data yet</h3>
                          <p className="text-sm text-slate-600">Transactions will appear here once orders are completed</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Auto-Update Indicator */}
        <div className="text-center pb-6">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm text-slate-700">
              Auto-updating real-time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}