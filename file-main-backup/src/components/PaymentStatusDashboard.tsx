import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, Bell, Users, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { PAYMENT_STATUS } from './PaymentStatusTracker';

interface PaymentStatusDashboardProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function PaymentStatusDashboard({ user, meetupData, onNavigate, onBack }: PaymentStatusDashboardProps) {
  const [paymentStatuses, setPaymentStatuses] = useState<any[]>([]);
  
  const isAdmin = user.id === meetupData?.adminId || user.name === meetupData?.adminName;

  // Poll for payment status updates
  useEffect(() => {
    const updateStatuses = () => {
      const statuses = Object.values(PAYMENT_STATUS[meetupData?.code] || {});
      setPaymentStatuses(statuses);

      // Check if all paid
      const allPaid = statuses.every((s: any) => s.status === 'paid');
      if (allPaid && statuses.length > 0) {
        // Navigate to completion screen
        setTimeout(() => {
          onNavigate('payment-completion', meetupData);
        }, 1500);
      }
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 1000);

    return () => clearInterval(interval);
  }, [meetupData, onNavigate]);

  const paidCount = paymentStatuses.filter(s => s.status === 'paid').length;
  const pendingCount = paymentStatuses.filter(s => s.status === 'pending').length;
  const totalAmount = paymentStatuses.reduce((sum, s) => sum + s.amount, 0);
  const paidAmount = paymentStatuses.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.amount, 0);
  const progressPercentage = paymentStatuses.length > 0 ? (paidCount / paymentStatuses.length) * 100 : 0;

  const handleSendReminder = (memberId: string, memberName: string) => {
    toast.success(`Reminder sent to ${memberName}`);
    // In real app, this would trigger a notification
  };

  const handlePayMyShare = () => {
    onNavigate('member-payment-screen', meetupData);
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
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Payment Status</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="text-center mb-6">
            <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif]">Step 4 of 5</p>
            <div className="flex gap-2 justify-center mt-2">
              <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
              <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
              <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
              <div className="w-12 h-1 bg-[#8b5943] rounded"></div>
              <div className="w-12 h-1 bg-neutral-200 rounded"></div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg p-6">
            <h2 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">Payment Progress</h2>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-[12px] text-neutral-600 mb-2">
                <span>{paidCount} of {paymentStatuses.length} paid</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-[12px] text-neutral-600 mb-1">Total Amount</p>
                <p className="text-[20px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">₹{totalAmount.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-[12px] text-neutral-600 mb-1">Collected</p>
                <p className="text-[20px] font-['Arial:Regular',_sans-serif] text-green-600 font-bold">₹{paidAmount.toFixed(2)}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-[12px] text-neutral-600">Paid</p>
                  <p className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">{paidCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-[12px] text-neutral-600">Pending</p>
                  <p className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">{pendingCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Members Payment Status */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">Members ({paymentStatuses.length})</h3>
            
            <div className="space-y-3">
              {paymentStatuses.map((status: any) => (
                <div
                  key={status.memberId}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    status.status === 'paid'
                      ? 'bg-green-50 border-green-200'
                      : status.paymentType === 'cash'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      status.status === 'paid' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {status.status === 'paid' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                        {status.memberName}
                        {status.memberId === user.id && ' (You)'}
                      </p>
                      <p className="text-[12px] text-neutral-600">₹{status.amount.toFixed(2)}</p>
                      {/* Payment Type Badge */}
                      {status.paymentType && (
                        <div className="flex items-center gap-1 mt-1">
                          {status.paymentType === 'online' ? (
                            <>
                              <CreditCard className="w-3 h-3 text-blue-600" />
                              <span className="text-[10px] text-blue-700 font-medium">Online</span>
                            </>
                          ) : status.paymentType === 'cash' ? (
                            <>
                              <Banknote className="w-3 h-3 text-amber-600" />
                              <span className="text-[10px] text-amber-700 font-medium">Cash</span>
                            </>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    {status.status === 'paid' ? (
                      <span className="text-[12px] font-['Arial:Regular',_sans-serif] text-green-700 font-medium">
                        ✅ Online - Paid
                      </span>
                    ) : status.paymentType === 'cash' ? (
                      <span className="text-[12px] font-['Arial:Regular',_sans-serif] text-amber-700 font-medium">
                        🕒 Cash - Pending
                      </span>
                    ) : (
                      <>
                        <span className="text-[12px] font-['Arial:Regular',_sans-serif] text-orange-700 font-medium">
                          Pending ⏳
                        </span>
                        {isAdmin && status.memberId !== user.id && (
                          <button
                            onClick={() => handleSendReminder(status.memberId, status.memberName)}
                            className="mt-1 bg-[#8b5943] text-white px-3 py-1 rounded text-[12px] hover:bg-[#8b5943]/90 transition-colors flex items-center gap-1"
                          >
                            <Bell className="w-3 h-3" />
                            Remind
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Action Button */}
          {!isAdmin && PAYMENT_STATUS[meetupData?.code]?.[user.id]?.status === 'pending' && (
            <button
              onClick={handlePayMyShare}
              className="w-full bg-[#8b5943] text-white h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/90 transition-colors flex items-center justify-center gap-2"
            >
              Pay My Share (₹{PAYMENT_STATUS[meetupData?.code]?.[user.id]?.amount.toFixed(2)})
            </button>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-[12px] text-blue-900 font-['Arial:Regular',_sans-serif]">
              <span className="font-bold">Live Updates:</span> This page automatically updates when members complete their payments. {isAdmin && 'As admin, you can send reminders to members who haven\'t paid yet.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
