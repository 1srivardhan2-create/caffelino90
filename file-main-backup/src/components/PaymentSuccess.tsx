import { useEffect, useState } from 'react';
import { CheckCircle, Download, Share2, Home, Receipt, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/clipboard';
import { motion } from 'framer-motion';
import { PAYMENT_STATUS } from './PaymentStatusTracker';
import { notifyPaymentSuccess } from '../utils/notificationManager';

interface PaymentSuccessProps {
  paymentData: any;
  onNavigate: (page: string, data?: any) => void;
}

export default function PaymentSuccess({ paymentData, onNavigate }: PaymentSuccessProps) {
  const [adminNotified, setAdminNotified] = useState(false);

  useEffect(() => {
    // Update payment status in global tracker
    const meetupCode = paymentData.orderCode || paymentData.meetupData?.code;
    const userId = paymentData.userId;

    if (meetupCode && userId && PAYMENT_STATUS[meetupCode] && PAYMENT_STATUS[meetupCode][userId]) {
      PAYMENT_STATUS[meetupCode][userId].status = 'paid';
      PAYMENT_STATUS[meetupCode][userId].paidAt = new Date();
    }

    // Create payment success notification with bill details
    notifyPaymentSuccess({
      amount: paymentData.amount,
      transactionId: paymentData.transactionId,
      paymentMethod: paymentData.paymentMethod,
      groupName: paymentData.groupName || 'Meetup',
      cafeName: paymentData.cafeName,
      orderNumber: paymentData.orderNumber,
    });

    // Simulate admin notification
    setTimeout(() => {
      setAdminNotified(true);
      toast.success('Admin has been notified of your payment');
    }, 2000);
  }, [paymentData]);

  const handleShare = async () => {
    const message = `Payment Successful!\n\nTransaction ID: ${paymentData.transactionId}\nAmount: ₹${paymentData.amount}\nGroup: ${paymentData.groupName}\n\nPaid via ${paymentData.paymentMethod}`;
    
    await copyToClipboard(message, 'Payment details copied to clipboard');
  };

  const handleDownloadReceipt = () => {
    toast.success('Receipt downloaded successfully');
    // In production, this would generate and download a PDF receipt
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">
            Payment Status
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
          </motion.div>

          {/* Success Message */}
          <div className="text-center space-y-2">
            <h2 className="text-[28px] font-['Arial:Regular',_sans-serif] text-green-700">
              Payment Successful!
            </h2>
            <p className="text-[16px] text-neutral-600">
              Your payment has been processed successfully
            </p>
          </div>

          {/* Amount Card */}
          <Card className="p-6 bg-white border-2 border-green-200">
            <div className="text-center mb-4">
              <p className="text-[14px] text-neutral-600 mb-2">Amount Paid</p>
              <p className="text-[42px] font-bold text-green-600">
                ₹{paymentData.amount}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-300">
                ✅ Paid & Verified
              </Badge>
            </div>
          </Card>

          {/* Transaction Details */}
          <Card className="p-6 bg-white">
            <h3 className="text-[16px] font-medium text-neutral-950 mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#8b5943]" />
              Transaction Details
            </h3>
            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Transaction ID</span>
                <span className="font-mono font-medium text-neutral-950">
                  {paymentData.transactionId}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Payment Method</span>
                <span className="font-medium text-neutral-950">
                  {paymentData.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Group</span>
                <span className="font-medium text-neutral-950">
                  {paymentData.groupName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-100">
                <span className="text-neutral-600">Member</span>
                <span className="font-medium text-neutral-950">
                  {paymentData.memberName}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-600">Date & Time</span>
                <span className="font-medium text-neutral-950">
                  {new Date(paymentData.timestamp).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </Card>

          {/* Admin Notification */}
          {adminNotified && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-blue-900">
                      Admin Notified
                    </p>
                    <p className="text-[12px] text-blue-700">
                      Your group admin has been informed about your payment
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
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

            {/* Raise Dispute Button */}
            <Button
              variant="outline"
              onClick={() => onNavigate('raise-dispute', {
                ...paymentData.meetupData,
                paymentData: {
                  transactionId: paymentData.transactionId,
                  amount: paymentData.amount,
                  method: paymentData.paymentMethod,
                  timestamp: paymentData.timestamp,
                  billCopy: 'bill_' + paymentData.transactionId + '.pdf'
                }
              })}
              className="w-full h-[44px] border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Raise Dispute
            </Button>

            <Button
              onClick={() => onNavigate('home')}
              className="w-full h-[48px] bg-[#8b5943] hover:bg-[#8b5943]/90"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Info */}
          <Card className="p-4 bg-neutral-50">
            <p className="text-[12px] text-neutral-600 text-center leading-relaxed">
              Your payment confirmation has been sent to your registered email and phone number.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
