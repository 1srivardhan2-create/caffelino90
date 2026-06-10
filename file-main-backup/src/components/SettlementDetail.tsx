import { ArrowLeft, Download, Share2, Calendar, MapPin, Receipt, CheckCircle, Clock, Users, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/clipboard';
import type { SettlementRecord } from '../utils/settlementData';

interface SettlementDetailProps {
  record: SettlementRecord;
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function SettlementDetail({ record, user, onNavigate, onBack }: SettlementDetailProps) {
  const userMember = record.members.find(m => m.userId === user.id);
  const isPaid = userMember?.status === 'paid';
  const isAdmin = user.id === record.adminId;
  const allPaid = record.members.every(m => m.status === 'paid');

  const handleDownloadReceipt = () => {
    toast.success('Downloading receipt...');
    setTimeout(() => {
      toast.success('Receipt downloaded successfully!');
    }, 1500);
  };

  const handleShare = async () => {
    const message = `Settlement Details\n\nMeetup: ${record.meetupName}\nCafe: ${record.cafeName}\nDate: ${new Date(record.date).toLocaleDateString('en-IN')}\n\nTotal Bill: ₹${record.totalBill}\nYour Share: ₹${userMember?.share}\nStatus: ${isPaid ? 'Paid ✅' : 'Pending ⏳'}`;
    
    await copyToClipboard(message, 'Settlement details copied to clipboard');
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
                Settlement Details
              </h1>
              <p className="text-white/80 text-[12px]">
                {record.orderCode}
              </p>
            </div>
            {isAdmin && (
              <Badge className="bg-white/20 hover:bg-white/20 text-white border-white/30">
                Admin
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Meetup Info */}
          <Card className="p-6 bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 border-[#8b5943]/30">
            <h2 className="text-[24px] font-medium text-neutral-950 mb-4">
              {record.meetupName}
            </h2>
            <div className="space-y-2 text-[14px]">
              <div className="flex items-center gap-2 text-neutral-700">
                <MapPin className="w-4 h-4 text-[#8b5943]" />
                <span>{record.cafeName}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Calendar className="w-4 h-4 text-[#8b5943]" />
                <span>
                  {new Date(record.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Users className="w-4 h-4 text-[#8b5943]" />
                <span>{record.members.length} members</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Receipt className="w-4 h-4 text-[#8b5943]" />
                <span>Order Code: {record.orderCode}</span>
              </div>
            </div>
          </Card>

          {/* Your Payment Status */}
          {userMember && (
            <Card className={`p-6 ${isPaid ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-medium text-neutral-950">Your Payment</h3>
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

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-neutral-600">Your Share</span>
                  <span className="text-[32px] font-bold text-[#8b5943]">₹{userMember.share}</span>
                </div>

                {isPaid && userMember.paidAt && (
                  <>
                    <div className="pt-3 border-t border-neutral-200 space-y-2 text-[13px]">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Paid On</span>
                        <span className="font-medium text-neutral-950">
                          {new Date(userMember.paidAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {userMember.paymentMethod && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Payment Method</span>
                          <span className="font-medium text-neutral-950">{userMember.paymentMethod}</span>
                        </div>
                      )}
                      {userMember.transactionId && (
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Transaction ID</span>
                          <span className="font-mono font-medium text-neutral-950 text-[11px]">
                            {userMember.transactionId}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Bill Summary */}
          <Card className="p-6">
            <h3 className="text-[18px] font-medium text-neutral-950 mb-4">Bill Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-[14px]">
                <span className="text-neutral-600">Total Bill Amount</span>
                <span className="font-medium text-neutral-950">₹{record.totalBill}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-neutral-600">Number of Members</span>
                <span className="font-medium text-neutral-950">{record.members.length}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-neutral-600">Average per Person</span>
                <span className="font-medium text-neutral-950">
                  ₹{(record.totalBill / record.members.length).toFixed(2)}
                </span>
              </div>
              <div className="pt-3 border-t-2 border-neutral-200 flex justify-between">
                <span className="text-[16px] font-medium text-neutral-950">Payment Status</span>
                <span className={`text-[16px] font-bold ${allPaid ? 'text-green-600' : 'text-orange-600'}`}>
                  {record.members.filter(m => m.status === 'paid').length}/{record.members.length} Paid
                </span>
              </div>
            </div>
          </Card>

          {/* Member Breakdown */}
          <Card className="p-6">
            <h3 className="text-[18px] font-medium text-neutral-950 mb-4">Member Breakdown</h3>
            <div className="space-y-3">
              {record.members.map((member) => (
                <div
                  key={member.userId}
                  className={`p-4 rounded-lg border-2 ${
                    member.userId === user.id
                      ? 'bg-[#8b5943]/5 border-[#8b5943]/30'
                      : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-medium text-neutral-950">
                        {member.userName}
                      </span>
                      {member.userId === user.id && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0">
                          You
                        </Badge>
                      )}
                      {member.userId === record.adminId && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0 bg-purple-50 border-purple-300 text-purple-700">
                          Admin
                        </Badge>
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
                        {member.status === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  {member.status === 'paid' && member.paidAt && (
                    <div className="text-[11px] text-neutral-600 mt-2">
                      Paid on {new Date(member.paidAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {member.paymentMethod && ` via ${member.paymentMethod}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadReceipt}
                className="h-[44px]"
              >
                <Download className="w-4 h-4 mr-2" />
                Receipt
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="h-[44px]"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {isAdmin && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-[13px] text-blue-900 mb-3">
                  <strong>Admin Actions:</strong> Export complete settlement breakdown
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      toast.success('Exporting PDF receipt...');
                      setTimeout(() => toast.success('PDF downloaded!'), 1500);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success('Exporting Excel file...');
                      setTimeout(() => toast.success('Excel downloaded!'), 1500);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
