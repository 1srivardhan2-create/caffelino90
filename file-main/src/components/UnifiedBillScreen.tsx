import { ArrowLeft, Download, Share2, CheckCircle, Clock, MapPin, User, Phone, Lock, Wallet, CreditCard, Banknote, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useState } from 'react';

interface UnifiedBillScreenProps {
  meetupData: any;
  user: any;
  isAdmin: boolean;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function UnifiedBillScreen({ 
  meetupData, 
  user, 
  isAdmin,
  onNavigate,
  onBack 
}: UnifiedBillScreenProps) {
  const billData = meetupData?.billData;
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'cash' | 'online' | null>(
    meetupData?.paymentMode || null
  );
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!billData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-[#be9d80] px-4 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Bill</h1>
          </div>
        </div>
        <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
          <p className="text-[16px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
            No bill available. Order hasn't been confirmed yet.
          </p>
          <Button onClick={onBack} className="mt-6 bg-[#030213] hover:bg-[#030213]/90">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleDownloadBill = () => {
    if (!isAdmin) {
      toast.error('Only admin can download the bill');
      return;
    }
    toast.success('Bill downloaded successfully!');
  };

  const handleShareBill = () => {
    toast.success('Bill link copied to clipboard!');
  };

  const handleSelectPaymentMode = async (mode: 'cash' | 'online') => {
    if (!isAdmin) {
      toast.error('Only admin can select payment mode');
      return;
    }

    setSelectedPaymentMode(mode);

    // Save payment mode to meetup data
    const meetupId = meetupData?.meetupId || meetupData?.code || 'default';
    const meetupKey = `meetup_${meetupId}`;
    const savedMeetup = localStorage.getItem(meetupKey);
    
    if (savedMeetup) {
      const meetupDataParsed = JSON.parse(savedMeetup);
      meetupDataParsed.paymentMode = mode;
      localStorage.setItem(meetupKey, JSON.stringify(meetupDataParsed));
    }

    toast.success(`Payment mode set to ${mode === 'cash' ? 'Cash' : 'Online Payment'}`);
  };

  const handleProceedPayment = async () => {
    if (!isAdmin) {
      toast.error('Only admin can initiate payment');
      return;
    }

    if (!selectedPaymentMode) {
      toast.error('Please select a payment mode');
      return;
    }

    if (selectedPaymentMode === 'cash') {
      // Mark as paid with cash
      setIsProcessingPayment(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update payment status
      const meetupId = meetupData?.meetupId || meetupData?.code || 'default';
      const meetupKey = `meetup_${meetupId}`;
      const savedMeetup = localStorage.getItem(meetupKey);
      
      if (savedMeetup) {
        const meetupDataParsed = JSON.parse(savedMeetup);
        meetupDataParsed.paymentStatus = 'paid';
        meetupDataParsed.paymentMethod = 'cash';
        meetupDataParsed.paidAt = new Date().toISOString();
        localStorage.setItem(meetupKey, JSON.stringify(meetupDataParsed));
      }
      
      setIsProcessingPayment(false);
      toast.success('Payment marked as completed (Cash)');
    } else {
      // Navigate to payment gateway for online payment
      onNavigate('payment-method-choice', {
        ...meetupData,
        paymentMode: 'online',
        amount: Math.ceil(billData.total)
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-[#be9d80] text-white sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-[20px] leading-[28px] font-['Arial:Regular',_sans-serif]">
                Bill Details
              </h1>
              <p className="text-[13px] text-white/90 mt-1">
                Order #{billData.orderNumber}
              </p>
            </div>
            <Badge className="bg-green-500 text-white border-0">
              <CheckCircle className="w-3 h-3 mr-1" />
              Paid
            </Badge>
          </div>

          {/* Read-Only Banner for Members */}
          {!isAdmin && (
            <div className="bg-blue-500/20 border border-blue-300/30 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-white" />
                <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-white">
                  View only – Bill managed by admin
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bill Content */}
      <div className="max-w-[800px] mx-auto px-4 py-6">
        {/* Bill Card */}
        <Card className="p-0 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-[#8b5943] to-[#be9d80] text-white p-6">
            <div className="text-center mb-4">
              <h2 className="text-[24px] font-['Arial:Regular',_sans-serif] mb-2">
                {billData.cafeName}
              </h2>
              {billData.cafeAddress && (
                <p className="text-[13px] text-white/90">
                  {billData.cafeAddress}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-[12px] text-white/70 mb-1">Order Number</p>
                <p className="text-[16px] font-medium">{billData.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-white/70 mb-1">Date & Time</p>
                <p className="text-[14px]">{billData.orderDate}</p>
                <p className="text-[13px] text-white/90">{billData.orderTime}</p>
              </div>
            </div>
          </div>

          {/* Meetup Info */}
          <div className="bg-blue-50 border-b px-6 py-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-blue-600" />
              <p className="text-[14px] text-blue-900 font-['Arial:Regular',_sans-serif]">
                <span className="font-bold">{billData.meetupName}</span>
              </p>
            </div>
            <div className="flex items-center gap-4 text-[13px] text-blue-700">
              <span>Admin: {billData.adminName}</span>
              <span>•</span>
              <span>{billData.memberCount} {billData.memberCount === 1 ? 'member' : 'members'}</span>
            </div>
          </div>

          {/* Items List */}
          <div className="p-6">
            <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4 pb-2 border-b">
              Order Items
            </h3>

            <div className="space-y-3">
              {billData.items.map((item: any, index: number) => (
                <div key={index} className="flex items-start justify-between py-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-sm flex items-center justify-center border ${
                        item.veg ? 'border-green-600' : 'border-red-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          item.veg ? 'bg-green-600' : 'bg-red-600'
                        }`}></div>
                      </div>
                      <p className="text-[15px] text-neutral-950 font-['Arial:Regular',_sans-serif]">
                        {item.name}
                      </p>
                    </div>
                    <p className="text-[13px] text-neutral-600 font-['Arial:Regular',_sans-serif] ml-6">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-[15px] font-medium text-neutral-950">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Bill Breakdown */}
            <div className="mt-6 pt-4 border-t space-y-3">
              <div className="flex items-center justify-between text-[15px]">
                <span className="text-neutral-600 font-['Arial:Regular',_sans-serif]">
                  Subtotal
                </span>
                <span className="text-neutral-950 font-medium">
                  ₹{billData.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[15px]">
                <span className="text-neutral-600 font-['Arial:Regular',_sans-serif]">
                  CGST (5%)
                </span>
                <span className="text-neutral-950 font-medium">
                  ₹{billData.cgst.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[15px]">
                <span className="text-neutral-600 font-['Arial:Regular',_sans-serif]">
                  SGST (5%)
                </span>
                <span className="text-neutral-950 font-medium">
                  ₹{billData.sgst.toFixed(2)}
                </span>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                    Total Amount
                  </span>
                  <span className="text-[28px] font-bold text-green-600">
                    ₹{Math.ceil(billData.total)}
                  </span>
                </div>
              </div>

              {/* Split Amount */}
              {billData.memberCount > 1 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] text-amber-700 font-['Arial:Regular',_sans-serif] mb-1">
                        Split Among {billData.memberCount} Members
                      </p>
                      <p className="text-[12px] text-amber-600 font-['Arial:Regular',_sans-serif]">
                        Each person pays
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[24px] font-bold text-amber-900">
                        ₹{Math.ceil(billData.total / billData.memberCount)}
                      </p>
                      <p className="text-[12px] text-amber-600">
                        per person
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-slate-50 border-t px-6 py-4">
            <div className="flex items-center gap-2 text-[13px] text-neutral-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Order confirmed on {billData.orderDate} at {billData.orderTime}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {isAdmin && (
            <Button
              onClick={handleDownloadBill}
              variant="outline"
              className="h-[48px]"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Bill
            </Button>
          )}
          <Button
            onClick={handleShareBill}
            variant={isAdmin ? "outline" : "default"}
            className={`h-[48px] ${!isAdmin ? 'col-span-2' : ''}`}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Bill
          </Button>
        </div>

        {/* Payment Mode Selection - ONLY AFTER ORDER CONFIRMATION */}
        {meetupData?.orderConfirmed && (
          <Card className="mt-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                Payment Method
              </h3>
              {!isAdmin && (
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  <Lock className="w-3 h-3 mr-1" />
                  Admin Only
                </Badge>
              )}
            </div>

            {/* Admin: Payment Mode Selection */}
            {isAdmin ? (
              <>
                <p className="text-[14px] text-neutral-600 font-['Arial:Regular',_sans-serif] mb-4">
                  Select how you want to pay for this order
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Cash Option */}
                  <button
                    onClick={() => handleSelectPaymentMode('cash')}
                    className={`relative p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                      selectedPaymentMode === 'cash'
                        ? 'border-green-500 bg-green-50'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedPaymentMode === 'cash'
                          ? 'bg-green-500'
                          : 'bg-neutral-100'
                      }`}>
                        <Banknote className={`w-6 h-6 ${
                          selectedPaymentMode === 'cash'
                            ? 'text-white'
                            : 'text-neutral-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-1">
                          Cash Payment
                        </h4>
                        <p className="text-[13px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                          Pay in cash at the café
                        </p>
                      </div>
                      {selectedPaymentMode === 'cash' && (
                        <CheckCircle className="w-6 h-6 text-green-500 absolute top-4 right-4" />
                      )}
                    </div>
                  </button>

                  {/* Online Option */}
                  <button
                    onClick={() => handleSelectPaymentMode('online')}
                    className={`relative p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                      selectedPaymentMode === 'online'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedPaymentMode === 'online'
                          ? 'bg-blue-500'
                          : 'bg-neutral-100'
                      }`}>
                        <Wallet className={`w-6 h-6 ${
                          selectedPaymentMode === 'online'
                            ? 'text-white'
                            : 'text-neutral-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-1">
                          Online Payment
                        </h4>
                        <p className="text-[13px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                          UPI, Cards, or Wallets
                        </p>
                      </div>
                      {selectedPaymentMode === 'online' && (
                        <CheckCircle className="w-6 h-6 text-blue-500 absolute top-4 right-4" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Proceed Button - Admin Only */}
                {selectedPaymentMode && (
                  <Button
                    onClick={handleProceedPayment}
                    disabled={isProcessingPayment}
                    className="w-full h-[52px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {selectedPaymentMode === 'cash' ? (
                          <>
                            <Banknote className="w-5 h-5 mr-2" />
                            Mark as Paid (Cash)
                          </>
                        ) : (
                          <>
                            <Wallet className="w-5 h-5 mr-2" />
                            Proceed to Payment
                          </>
                        )}
                      </>
                    )}
                  </Button>
                )}
              </>
            ) : (
              /* Joined User: View Selected Payment Mode */
              <>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-['Arial:Regular',_sans-serif] text-blue-900 font-bold">
                        Payment handled by admin
                      </p>
                      <p className="text-[13px] text-blue-700 font-['Arial:Regular',_sans-serif]">
                        You don't need to pay separately
                      </p>
                    </div>
                  </div>

                  {selectedPaymentMode && (
                    <div className="bg-white/60 rounded-lg p-4 mt-3 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedPaymentMode === 'cash' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {selectedPaymentMode === 'cash' ? (
                          <Banknote className="w-5 h-5 text-green-600" />
                        ) : (
                          <Wallet className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] text-neutral-600 font-['Arial:Regular',_sans-serif]">
                          Selected Payment Mode
                        </p>
                        <p className="text-[15px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                          {selectedPaymentMode === 'cash' ? 'Cash Payment' : 'Online Payment'}
                        </p>
                      </div>
                    </div>
                  )}

                  {!selectedPaymentMode && (
                    <div className="bg-white/60 rounded-lg p-4 mt-3">
                      <p className="text-[13px] text-blue-800 font-['Arial:Regular',_sans-serif] text-center">
                        Waiting for admin to select payment mode...
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>
        )}

        {/* Payment Complete Status - Only show if already paid */}
        {meetupData?.paymentStatus === 'paid' && (
          <Card className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-green-900 font-bold">
                  Payment Complete
                </h3>
                <p className="text-[14px] text-green-700 font-['Arial:Regular',_sans-serif]">
                  Thank you for your order!
                </p>
              </div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 mt-4">
              <p className="text-[13px] text-green-800 font-['Arial:Regular',_sans-serif]">
                A confirmation has been sent to all members. You can view this bill anytime in your group chat.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Info Footer */}
      {!isAdmin && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-50 border-t-2 border-blue-200 z-50">
          <div className="max-w-[1400px] mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-[13px] text-blue-900 font-['Arial:Regular',_sans-serif]">
                This is a read-only view. Admin manages all payment actions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
