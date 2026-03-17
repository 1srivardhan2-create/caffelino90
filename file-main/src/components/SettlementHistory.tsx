import { useState } from 'react';
import { ArrowLeft, History, Calendar, MapPin, Receipt, CheckCircle, Clock, Filter, Search, Download } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { getUserSettlementHistory, type SettlementRecord } from '../utils/settlementData';

interface SettlementHistoryProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function SettlementHistory({ user, onNavigate, onBack }: SettlementHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');

  // Safety check for user
  if (!user || !user.id) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-[#be9d80] px-4 py-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Settlement History</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <p className="text-[16px] text-neutral-600 mb-4">Please log in to view settlement history</p>
            <Button onClick={() => onNavigate('login')}>
              Log In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get user's settlement history
  const allRecords = getUserSettlementHistory(user.id);

  // Filter records based on search and status
  const filteredRecords = allRecords.filter(record => {
    const matchesSearch = 
      record.meetupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.cafeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.orderCode.toLowerCase().includes(searchQuery.toLowerCase());

    const userMember = record.members.find(m => m.userId === user.id);
    const matchesStatus = 
      filterStatus === 'all' ||
      (userMember && userMember.status === filterStatus);

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalMeetups = allRecords.length;
  const totalSpent = allRecords.reduce((sum, record) => {
    const userMember = record.members.find(m => m.userId === user.id);
    return sum + (userMember?.share || 0);
  }, 0);
  const paidCount = allRecords.filter(record => {
    const userMember = record.members.find(m => m.userId === user.id);
    return userMember?.status === 'paid';
  }).length;

  const handleViewDetails = (record: SettlementRecord) => {
    onNavigate('settlement-detail', { record, user });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">
                Settlement History
              </h1>
              <p className="text-white/80 text-[12px]">
                Your payment records
              </p>
            </div>
            <History className="w-6 h-6 text-white/80" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-blue-700 mb-1">Total Meetups</p>
                <p className="text-[28px] font-bold text-blue-900">{totalMeetups}</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <History className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-green-700 mb-1">Total Spent</p>
                <p className="text-[28px] font-bold text-green-900">₹{totalSpent}</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <Receipt className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-purple-700 mb-1">Paid Bills</p>
                <p className="text-[28px] font-bold text-purple-900">{paidCount}/{totalMeetups}</p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search by meetup name, cafe, or order code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-[#8b5943] hover:bg-[#8b5943]/90' : ''}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'paid' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('paid')}
                className={filterStatus === 'paid' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Paid
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('pending')}
                className={filterStatus === 'pending' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                Pending
              </Button>
            </div>
          </div>
        </div>

        {/* History List */}
        {filteredRecords.length === 0 ? (
          <Card className="p-12 text-center">
            <History className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-[18px] font-medium text-neutral-950 mb-2">
              No records found
            </h3>
            <p className="text-[14px] text-neutral-600">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Your settlement history will appear here'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const userMember = record.members.find(m => m.userId === user.id);
              const isPaid = userMember?.status === 'paid';

              return (
                <Card
                  key={record.id}
                  className="p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewDetails(record)}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Left: Main Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-[18px] font-medium text-neutral-950 mb-1">
                            {record.meetupName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-[13px] text-neutral-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {record.cafeName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(record.date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Receipt className="w-4 h-4" />
                              {record.orderCode}
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={
                            isPaid
                              ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-300'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-300'
                          }
                        >
                          {isPaid ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>

                      {/* Payment Details */}
                      <div className="flex flex-wrap gap-6">
                        <div>
                          <p className="text-[11px] text-neutral-500 uppercase mb-1">Total Bill</p>
                          <p className="text-[16px] font-medium text-neutral-950">
                            ₹{record.totalBill}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-neutral-500 uppercase mb-1">Your Share</p>
                          <p className="text-[20px] font-bold text-[#8b5943]">
                            ₹{userMember?.share}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-neutral-500 uppercase mb-1">Members</p>
                          <p className="text-[16px] font-medium text-neutral-950">
                            {record.members.length}
                          </p>
                        </div>
                      </div>

                      {/* Payment Info */}
                      {isPaid && userMember?.paidAt && (
                        <div className="pt-3 border-t border-neutral-100">
                          <div className="flex flex-wrap items-center gap-4 text-[12px] text-neutral-600">
                            <span>
                              Paid on {new Date(userMember.paidAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {userMember.paymentMethod && (
                              <span>via {userMember.paymentMethod}</span>
                            )}
                            {userMember.transactionId && (
                              <span className="font-mono">ID: {userMember.transactionId}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}