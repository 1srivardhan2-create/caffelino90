import { useState, useEffect } from 'react';
import { ArrowLeft, Smartphone, Copy, CheckCircle, Loader2, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/clipboard';

interface UPIPaymentProps {
  paymentData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', color: 'from-blue-500 to-blue-700', deepLink: 'gpay://upi' },
  { id: 'phonepe', name: 'PhonePe', color: 'from-purple-600 to-purple-800', deepLink: 'phonepe://upi' },
  { id: 'paytm', name: 'Paytm', color: 'from-cyan-500 to-cyan-700', deepLink: 'paytm://upi' },
  { id: 'bhim', name: 'BHIM', color: 'from-orange-500 to-orange-700', deepLink: 'bhim://upi' },
];

export default function UPIPayment({ paymentData, onNavigate, onBack }: UPIPaymentProps) {
  const [upiId, setUpiId] = useState('');
  const [generatedUPI, setGeneratedUPI] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Generate UPI payment link
  useEffect(() => {
    const merchantUPI = 'caffelino@paytm'; // Merchant UPI ID
    const amount = paymentData.amount;
    const transactionNote = `Payment for ${paymentData.groupName}`;
    const transactionId = `TXN${Date.now()}`;
    
    const upiLink = `upi://pay?pa=${merchantUPI}&pn=Caffelino&am=${amount}&tn=${encodeURIComponent(transactionNote)}&tr=${transactionId}`;
    setGeneratedUPI(upiLink);
  }, [paymentData]);

  const handleUPIAppClick = (app: typeof UPI_APPS[0]) => {
    // Simulate opening UPI app
    toast.success(`Opening ${app.name}...`);
    
    // Start verification countdown
    setVerifying(true);
    setCountdown(30);
    
    // In production, this would open the actual app
    // window.location.href = `${app.deepLink}?${generatedUPI}`;
    
    // Simulate payment verification
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          verifyPayment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyPayment = () => {
    // Simulate payment verification
    setTimeout(() => {
      setVerifying(false);
      
      // Randomly simulate success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        onNavigate('payment-success', {
          ...paymentData,
          transactionId: `TXN${Date.now()}`,
          paymentMethod: 'UPI',
          timestamp: new Date()
        });
      } else {
        onNavigate('payment-failed', {
          ...paymentData,
          reason: 'Transaction declined by bank'
        });
      }
    }, 2000);
  };

  const handleManualUPI = () => {
    if (!upiId.trim()) {
      toast.error('Please enter your UPI ID');
      return;
    }

    // Validate UPI ID format
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiRegex.test(upiId)) {
      toast.error('Invalid UPI ID format');
      return;
    }

    toast.success('Processing payment...');
    setVerifying(true);
    
    // Simulate payment
    setTimeout(() => {
      verifyPayment();
    }, 3000);
  };

  const handleCopyUPI = async () => {
    await copyToClipboard('caffelino@paytm', 'UPI ID copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">
              UPI Payment
            </h1>
            <p className="text-white/80 text-[12px]">Fast & Secure</p>
          </div>
          <Badge className="bg-white/20 hover:bg-white/20 text-white border-white/30">
            ₹{paymentData.amount}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-8">
        {!verifying ? (
          <div className="space-y-6">
            {/* Payment Details */}
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone className="w-6 h-6 text-blue-600" />
                <h3 className="text-[16px] font-medium text-neutral-950">Payment Details</h3>
              </div>
              <div className="space-y-2 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Amount:</span>
                  <span className="font-bold text-blue-600">₹{paymentData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">To:</span>
                  <span className="font-medium text-neutral-950">Caffelino Payments</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">For:</span>
                  <span className="font-medium text-neutral-950">{paymentData.groupName}</span>
                </div>
              </div>
            </Card>

            {/* Quick Pay - UPI Apps */}
            <div>
              <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-3">
                Quick Pay with UPI Apps
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {UPI_APPS.map(app => (
                  <button
                    key={app.id}
                    onClick={() => handleUPIAppClick(app)}
                    className="p-4 bg-white border-2 border-neutral-200 rounded-lg hover:border-blue-500 transition-all group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${app.color} rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-[14px] font-medium text-neutral-950 text-center">
                      {app.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-[12px]">
                <span className="bg-white px-4 text-neutral-500">OR</span>
              </div>
            </div>

            {/* Manual UPI Entry */}
            <Card className="p-5">
              <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                Enter UPI ID Manually
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] text-neutral-600 mb-2">
                    Your UPI ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="text-[14px]"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Example: 9876543210@paytm or username@ybl
                  </p>
                </div>
                <Button
                  onClick={handleManualUPI}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Pay ₹{paymentData.amount}
                </Button>
              </div>
            </Card>

            {/* Merchant UPI */}
            <Card className="p-4 bg-neutral-50">
              <p className="text-[12px] text-neutral-600 mb-2">
                <strong>Pay to this UPI ID:</strong>
              </p>
              <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg p-3">
                <code className="flex-1 text-[14px] font-mono text-neutral-950">
                  caffelino@paytm
                </code>
                <button
                  onClick={handleCopyUPI}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
            </Card>

            {/* QR Code Option */}
            <Button
              variant="outline"
              onClick={() => setShowQR(!showQR)}
              className="w-full"
            >
              <QrCode className="w-4 h-4 mr-2" />
              {showQR ? 'Hide' : 'Show'} QR Code
            </Button>

            {showQR && (
              <Card className="p-6">
                <div className="bg-white border-2 border-neutral-300 rounded-lg p-4 text-center">
                  <div className="w-48 h-48 bg-neutral-100 mx-auto mb-3 flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-neutral-400" />
                  </div>
                  <p className="text-[12px] text-neutral-600">
                    Scan this QR code with any UPI app to pay
                  </p>
                </div>
              </Card>
            )}
          </div>
        ) : (
          // Verification Screen
          <div className="space-y-6 text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <div>
              <h3 className="text-[20px] font-medium text-neutral-950 mb-2">
                Verifying Payment...
              </h3>
              <p className="text-[14px] text-neutral-600">
                Please complete the payment in your UPI app
              </p>
            </div>

            {countdown > 0 && (
              <Card className="p-4 bg-blue-50 border-blue-200 max-w-sm mx-auto">
                <p className="text-[14px] text-blue-800">
                  Auto-checking in <strong>{countdown}s</strong>
                </p>
              </Card>
            )}

            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  setVerifying(false);
                  setCountdown(0);
                }}
                className="w-full max-w-xs mx-auto"
              >
                Cancel Payment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
