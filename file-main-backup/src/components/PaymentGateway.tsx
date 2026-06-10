import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Wallet, ChevronRight, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface PaymentGatewayProps {
  user: any;
  paymentData: {
    amount: number;
    groupName: string;
    orderCode: string;
    memberName: string;
  };
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

type PaymentMethod = 'upi' | 'wallet' | 'card' | 'cash';

export default function PaymentGateway({ user, paymentData, onNavigate, onBack }: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    
    // Navigate to respective payment flow
    switch (method) {
      case 'upi':
        onNavigate('upi-payment', { ...paymentData, user });
        break;
      case 'wallet':
        onNavigate('wallet-payment', { ...paymentData, user });
        break;
      case 'card':
        onNavigate('card-payment', { ...paymentData, user });
        break;
      case 'cash':
        onNavigate('cash-payment', { ...paymentData, user });
        break;
    }
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
              Payment Gateway
            </h1>
            <p className="text-white/80 text-[12px]">
              Choose your payment method
            </p>
          </div>
          <Badge className="bg-white/20 hover:bg-white/20 text-white border-white/30">
            Secure
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Amount Card */}
          <Card className="p-6 bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 border-[#8b5943]/30">
            <div className="text-center">
              <p className="text-[14px] text-neutral-600 mb-2">Amount to Pay</p>
              <p className="text-[36px] font-bold text-[#8b5943]">
                ₹{paymentData.amount}
              </p>
              <p className="text-[12px] text-neutral-500 mt-2">
                For: {paymentData.groupName}
              </p>
            </div>
          </Card>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Shield className="w-5 h-5" />
            <span className="text-[14px] font-medium">256-bit Secure Encryption</span>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h2 className="text-[20px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-6">
              Select Payment Method
            </h2>

            {/* UPI Payment */}
            <button
              onClick={() => handleMethodSelect('upi')}
              className="w-full p-5 bg-white border-2 border-neutral-200 rounded-lg hover:border-[#8b5943] hover:bg-gradient-to-br hover:from-[#8b5943]/5 hover:to-[#d9bf9d]/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[16px] font-medium text-neutral-950 mb-1">
                    Pay Online (UPI)
                  </p>
                  <p className="text-[12px] text-neutral-600">
                    Fast & Secure Payment
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px] px-2 py-0">Instant</Badge>
                    <Badge variant="outline" className="text-[10px] px-2 py-0">Most Popular</Badge>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#8b5943]" />
              </div>
            </button>

            {/* Cash Payment */}
            <button
              onClick={() => handleMethodSelect('cash')}
              className="w-full p-5 bg-white border-2 border-neutral-200 rounded-lg hover:border-[#8b5943] hover:bg-gradient-to-br hover:from-[#8b5943]/5 hover:to-[#d9bf9d]/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[16px] font-medium text-neutral-950 mb-1">
                    Pay Cash at Meetup
                  </p>
                  <p className="text-[12px] text-neutral-600">
                    Pay directly at the café
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px] px-2 py-0">In-Person</Badge>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#8b5943]" />
              </div>
            </button>
          </div>

          {/* Terms */}
          <Card className="p-4 bg-neutral-50">
            <p className="text-[11px] text-neutral-600 text-center leading-relaxed">
              By proceeding, you agree to our Terms of Service and Privacy Policy. 
              Your payment information is encrypted and secure.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}