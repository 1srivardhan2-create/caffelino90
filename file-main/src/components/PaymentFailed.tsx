import { XCircle, RotateCcw, Home, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';

interface PaymentFailedProps {
  paymentData: any;
  onNavigate: (page: string, data?: any) => void;
}

export default function PaymentFailed({ paymentData, onNavigate }: PaymentFailedProps) {
  const handleRetry = () => {
    // Go back to payment gateway to select another method
    onNavigate('payment-gateway', paymentData);
  };

  const handleGoHome = () => {
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
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
          {/* Failed Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <XCircle className="w-14 h-14 text-white" />
            </div>
          </motion.div>

          {/* Failed Message */}
          <div className="text-center space-y-2">
            <h2 className="text-[28px] font-['Arial:Regular',_sans-serif] text-red-700">
              Payment Failed
            </h2>
            <p className="text-[16px] text-neutral-600">
              We couldn't process your payment
            </p>
          </div>

          {/* Amount Card */}
          <Card className="p-6 bg-white border-2 border-red-200">
            <div className="text-center mb-4">
              <p className="text-[14px] text-neutral-600 mb-2">Attempted Amount</p>
              <p className="text-[42px] font-bold text-neutral-400">
                ₹{paymentData.amount}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-300">
                ❌ Payment Failed
              </Badge>
            </div>
          </Card>

          {/* Failure Reason */}
          <Card className="p-5 bg-red-50 border-red-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] font-medium text-red-900 mb-1">
                  Reason for Failure
                </p>
                <p className="text-[13px] text-red-800">
                  {paymentData.reason || 'Payment could not be processed. Please try again with a different payment method.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Common Reasons */}
          <Card className="p-5 bg-white">
            <h3 className="text-[16px] font-medium text-neutral-950 mb-3">
              Common Reasons for Failure
            </h3>
            <ul className="space-y-2 text-[13px] text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 mt-1">•</span>
                <span>Insufficient balance in account/wallet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 mt-1">•</span>
                <span>Incorrect OTP or PIN entered</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 mt-1">•</span>
                <span>Transaction declined by bank/payment provider</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 mt-1">•</span>
                <span>Card expired or invalid details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-400 mt-1">•</span>
                <span>Network or connectivity issues</span>
              </li>
            </ul>
          </Card>

          {/* What to do next */}
          <Card className="p-5 bg-blue-50 border-blue-200">
            <h3 className="text-[14px] font-medium text-blue-900 mb-2">
              What to do next?
            </h3>
            <ul className="space-y-1.5 text-[12px] text-blue-800">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>Check your account balance and try again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>Try a different payment method</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>Contact your bank if issue persists</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>Ensure stable internet connection</span>
              </li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full h-[48px] bg-[#8b5943] hover:bg-[#8b5943]/90"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again with Another Method
            </Button>

            <Button
              variant="outline"
              onClick={handleGoHome}
              className="w-full h-[44px]"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Support Info */}
          <Card className="p-4 bg-neutral-50">
            <p className="text-[12px] text-neutral-600 text-center leading-relaxed">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@caffelino.com" className="text-[#8b5943] hover:underline">
                support@caffelino.com
              </a>
              {' '}or call <strong>1800-123-4567</strong>
            </p>
          </Card>

          {/* Important Note */}
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                <strong>Note:</strong> No amount has been deducted from your account. 
                If you see any deduction, it will be automatically refunded within 3-5 business days.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
