import { useState } from 'react';
import { ArrowLeft, History, Download, FileText, Table2, Calendar, MapPin, Receipt, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { getAdminSettlementHistory, type SettlementRecord } from '../utils/settlementData';

interface SettlementHistoryAdminProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function SettlementHistoryAdmin({ user, onNavigate, onBack }: SettlementHistoryAdminProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<SettlementRecord | null>(null);

  // Get admin's settlement history
  const allRecords = getAdminSettlementHistory(user.id);

  // Filter records based on search
  const filteredRecords = allRecords.filter(record => 
    record.meetupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.cafeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.orderCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalMeetups = allRecords.length;
  const totalRevenue = allRecords.reduce((sum, record) => sum + record.totalBill, 0);
  const totalMembers = new Set(
    allRecords.flatMap(record => record.members.map(m => m.userId))
  ).size;
  const completedPayments = allRecords.filter(record => 
    record.members.every(m => m.status === 'paid')
  ).length;

  const handleExportPDF = (record: SettlementRecord) => {
    toast.success(`Exporting PDF receipt for ${record.meetupName}...`);
    // In production, this would generate and download a PDF
    setTimeout(() => {
      toast.success('PDF receipt downloaded successfully!');
    }, 1500);
  };

  const handleExportExcel = (record: SettlementRecord) => {
    toast.success(`Exporting Excel settlement for ${record.meetupName}...`);
    // In production, this would generate and download an Excel file
    setTimeout(() => {
      toast.success('Excel file downloaded successfully!');
    }, 1500);
  };

  const handleExportAllRecords = () => {
    toast.success('Exporting complete settlement history...');
    setTimeout(() => {
      toast.success('Complete history exported successfully!');
    }, 2000);
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
                Admin Settlement Dashboard
              </h1>
              <p className="text-white/80 text-[12px]">
                Manage all meetup settlements
              </p>
            </div>
            <Badge className="bg-white/20 hover:bg-white/20 text-white border-white/30">
              Admin
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <History className="w-6 h-6 text-blue-700" />
              </div>
            </div>
            <p className="text-[12px] text-blue-700 mb-1">Total Meetups</p>
            <p className="text-[32px] font-bold text-blue-900">{totalMeetups}</p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-700" />
              </div>
            </div>
            <p className="text-[12px] text-green-700 mb-1">Total Revenue</p>
            <p className="text-[32px] font-bold text-green-900">₹{totalRevenue}</p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-700" />
              </div>
            </div>
            <p className="text-[12px] text-purple-700 mb-1">Total Members</p>
            <p className="text-[32px] font-bold text-purple-900">{totalMembers}</p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-700" />
              </div>
            </div>
            <p className="text-[12px] text-orange-700 mb-1">Completed</p>
            <p className="text-[32px] font-bold text-orange-900">{completedPayments}/{totalMeetups}</p>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search meetups, cafes, or order codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4"
            />
          </div>
          <Button
            onClick={handleExportAllRecords}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export All Records
          </Button>
        </div>

        {/* History List */}
        {filteredRecords.length === 0 ? (
          <Card className="p-12 text-center">
            <History className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-[18px] font-medium text-neutral-950 mb-2">
              No settlement records
            </h3>
            <p className="text-[14px] text-neutral-600">
              Settlement history will appear here once meetups are completed
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => {
              const allPaid = record.members.every(m => m.status === 'paid');
              const paidCount = record.members.filter(m => m.status === 'paid').length;

              return (
                <Card key={record.id} className="p-6 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-[20px] font-medium text-neutral-950 mb-2">
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
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
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
                            allPaid
                              ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-300'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-300'
                          }
                        >
                          {allPaid ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Complete
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              {paidCount}/{record.members.length} Paid
                            </>
                          )}
                        </Badge>
                      </div>

                      {/* Bill Summary */}
                      <div className="flex flex-wrap gap-6 mb-4">
                        <div>
                          <p className="text-[11px] text-neutral-500 uppercase mb-1">Total Bill</p>
                          <p className="text-[24px] font-bold text-[#8b5943]">
                            ₹{record.totalBill}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-neutral-500 uppercase mb-1">Members</p>
                          <p className="text-[18px] font-medium text-neutral-950">
                            {record.members.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-neutral-500 uppercase mb-1">Avg Share</p>
                          <p className="text-[18px] font-medium text-neutral-950">
                            ₹{(record.totalBill / record.members.length).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Export Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Button
                        onClick={() => handleExportPDF(record)}
                        variant="outline"
                        className="flex-1 lg:flex-none"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        onClick={() => handleExportExcel(record)}
                        variant="outline"
                        className="flex-1 lg:flex-none"
                      >
                        <Table2 className="w-4 h-4 mr-2" />
                        Excel
                      </Button>
                    </div>
                  </div>

                  {/* Member Breakdown */}
                  <div className="border-t border-neutral-200 pt-4">
                    <button
                      onClick={() => setSelectedRecord(selectedRecord?.id === record.id ? null : record)}
                      className="text-[14px] font-medium text-[#8b5943] hover:text-[#8b5943]/80 mb-3"
                    >
                      {selectedRecord?.id === record.id ? 'Hide' : 'Show'} Payment Breakdown
                    </button>

                    {selectedRecord?.id === record.id && (
                      <div className="space-y-2 mt-3">
                        {record.members.map((member) => (
                          <div
                            key={member.userId}
                            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="text-[14px] font-medium text-neutral-950 mb-1">
                                {member.userName}
                              </p>
                              {member.status === 'paid' && member.paidAt && (
                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-600">
                                  <span>
                                    Paid on {new Date(member.paidAt).toLocaleDateString('en-IN', {
                                      day: '2-digit',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                  {member.paymentMethod && (
                                    <span>via {member.paymentMethod}</span>
                                  )}
                                  {member.transactionId && (
                                    <span className="font-mono">ID: {member.transactionId}</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[18px] font-bold text-[#8b5943]">
                                ₹{member.share}
                              </span>
                              <Badge
                                className={
                                  member.status === 'paid'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                                }
                              >
                                {member.status === 'paid' ? (
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
                          </div>
                        ))}
                      </div>
                    )}
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
