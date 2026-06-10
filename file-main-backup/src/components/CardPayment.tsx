import { useState } from 'react';
import { ArrowLeft, CreditCard, Loader2, Lock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface CardPaymentProps {
  paymentData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function CardPayment({ paymentData, onNavigate, onBack }: CardPaymentProps) {
  const [step, setStep] = useState<'card-details' | 'otp-verification'>('card-details');
  const [processing, setProcessing] = useState(false);
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // OTP
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  // Detect card type
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^6(?:011|5)/.test(cleaned)) return 'Rupay';
    if (/^3[47]/.test(cleaned)) return 'Amex';
    return null;
  };

  const handleCardSubmit = () => {
    // Validation
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      toast.error('Please enter a valid card number');
      return;
    }
    if (!cardName.trim()) {
      toast.error('Please enter cardholder name');
      return;
    }
    if (!expiryDate || expiryDate.length < 5) {
      toast.error('Please enter valid expiry date');
      return;
    }
    if (!cvv || cvv.length < 3) {
      toast.error('Please enter valid CVV');
      return;
    }

    // Validate expiry date
    const [month, year] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (month < 1 || month > 12) {
      toast.error('Invalid expiry month');
      return;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      toast.error('Card has expired');
      return;
    }

    // Proceed to OTP
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setOtpSent(true);
      setStep('otp-verification');
      toast.success('OTP sent to your registered mobile number');
    }, 1500);
  };

  const handleOTPSubmit = () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    setProcessing(true);

    // Simulate OTP verification
    setTimeout(() => {
      setProcessing(false);
      
      // Simulate success/failure
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        toast.success('Payment successful!');
        onNavigate('payment-success', {
          ...paymentData,
          transactionId: `CRD${Date.now()}`,
          paymentMethod: `Card - ${detectCardType(cardNumber) || 'Card'} ending ${cardNumber.slice(-4)}`,
          timestamp: new Date()
        });
      } else {
        onNavigate('payment-failed', {
          ...paymentData,
          reason: 'OTP verification failed or card declined'
        });
      }
    }, 2000);
  };

  const handleResendOTP = () => {
    toast.success('OTP resent successfully');
    setOtp('');
  };

  const cardType = detectCardType(cardNumber);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          <button
            onClick={step === 'otp-verification' ? () => setStep('card-details') : onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">
              Card Payment
            </h1>
            <p className="text-white/80 text-[12px]">
              {step === 'card-details' ? 'Enter card details' : 'Verify OTP'}
            </p>
          </div>
          <Badge className="bg-white/20 hover:bg-white/20 text-white border-white/30">
            ₹{paymentData.amount}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-8">
        {step === 'card-details' ? (
          <div className="space-y-6">
            {/* Payment Amount */}
            <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-6 h-6 text-green-600" />
                <h3 className="text-[16px] font-medium text-neutral-950">Payment Amount</h3>
              </div>
              <div className="text-center">
                <p className="text-[36px] font-bold text-green-600">
                  ₹{paymentData.amount}
                </p>
                <p className="text-[12px] text-neutral-600 mt-1">
                  For: {paymentData.groupName}
                </p>
              </div>
            </Card>

            {/* Card Form */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-green-600" />
                <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                  Enter Card Details
                </h3>
              </div>

              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-[12px] text-neutral-600 mb-2">
                    Card Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value.replace(/\D/g, ''));
                        if (formatted.replace(/\s/g, '').length <= 16) {
                          setCardNumber(formatted);
                        }
                      }}
                      className="pr-16 font-mono"
                      disabled={processing}
                    />
                    {cardType && (
                      <Badge className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px]">
                        {cardType}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-[12px] text-neutral-600 mb-2">
                    Cardholder Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Name as on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    disabled={processing}
                  />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] text-neutral-600 mb-2">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value);
                        if (formatted.replace(/\D/g, '').length <= 4) {
                          setExpiryDate(formatted);
                        }
                      }}
                      className="font-mono"
                      disabled={processing}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-neutral-600 mb-2">
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="font-mono text-center tracking-widest"
                      disabled={processing}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCardSubmit}
                  disabled={processing}
                  className="w-full h-[48px] bg-green-600 hover:bg-green-700 mt-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Pay Securely ₹{paymentData.amount}
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Security Badges */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-[11px] bg-white">
                🔒 SSL Secured
              </Badge>
              <Badge variant="outline" className="text-[11px] bg-white">
                💳 PCI DSS Compliant
              </Badge>
              <Badge variant="outline" className="text-[11px] bg-white">
                ✅ 3D Secure
              </Badge>
            </div>

            {/* Info */}
            <Card className="p-4 bg-neutral-50">
              <p className="text-[11px] text-neutral-600 text-center leading-relaxed">
                Your card details are encrypted and secure. We never store your CVV. 
                All transactions are processed through secure payment gateways.
              </p>
            </Card>
          </div>
        ) : (
          // OTP Verification
          <div className="space-y-6">
            {/* Card Info */}
            <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] text-neutral-600 mb-1">Paying with</p>
                  <p className="text-[16px] font-medium text-neutral-950">
                    {cardType || 'Card'} •••• {cardNumber.slice(-4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[24px] font-bold text-green-600">
                    ₹{paymentData.amount}
                  </p>
                </div>
              </div>
            </Card>

            {/* OTP Input */}
            <Card className="p-6">
              <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-2">
                Enter OTP
              </h3>
              <p className="text-[14px] text-neutral-600 mb-4">
                We've sent a 6-digit OTP to your registered mobile number
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] text-neutral-600 mb-2">
                    6-Digit OTP <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-[24px] tracking-[0.5em] font-mono"
                    disabled={processing}
                  />
                </div>

                <Button
                  onClick={handleOTPSubmit}
                  disabled={processing || otp.length !== 6}
                  className="w-full h-[48px] bg-green-600 hover:bg-green-700"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Pay'
                  )}
                </Button>

                <button
                  onClick={handleResendOTP}
                  disabled={processing}
                  className="w-full text-[14px] text-green-600 hover:text-green-700 font-medium"
                >
                  Resend OTP
                </button>
              </div>
            </Card>

            {/* Info */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-blue-900 mb-1">
                    OTP expires in 5 minutes
                  </p>
                  <p className="text-[12px] text-blue-800">
                    Check your SMS or banking app for the OTP. Don't share it with anyone.
                  </p>
                </div>
              </div>
            </Card>

            {/* Demo Hint */}
            <Card className="p-3 bg-amber-50 border-amber-200">
              <p className="text-[11px] text-amber-800 text-center">
                💡 <strong>Demo Mode:</strong> Enter any 6-digit code to test
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
