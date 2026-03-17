import { useState } from 'react';
import { ArrowLeft, Wallet, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface WalletPaymentProps {
  paymentData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

const WALLETS = [
  { id: 'paytm', name: 'Paytm Wallet', color: 'from-cyan-500 to-cyan-700', balance: 2500 },
  { id: 'amazonpay', name: 'Amazon Pay', color: 'from-orange-500 to-orange-700', balance: 1800 },
  { id: 'mobikwik', name: 'Mobikwik', color: 'from-red-500 to-red-700', balance: 950 },
  { id: 'freecharge', name: 'Freecharge', color: 'from-blue-500 to-blue-700', balance: 500 },
];

export default function WalletPayment({ paymentData, onNavigate, onBack }: WalletPaymentProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [walletPin, setWalletPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);

  const handleWalletSelect = (walletId: string) => {
    const wallet = WALLETS.find(w => w.id === walletId);
    if (!wallet) return;

    if (wallet.balance < paymentData.amount) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setSelectedWallet(walletId);
    setShowPinInput(true);
  };

  const handlePayment = () => {
    if (!walletPin || walletPin.length !== 4) {
      toast.error('Please enter 4-digit wallet PIN');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      
      // Simulate success/failure
      const isSuccess = Math.random() > 0.15; // 85% success rate
      
      if (isSuccess) {
        toast.success('Payment successful!');
        onNavigate('payment-success', {
          ...paymentData,
          transactionId: `WLT${Date.now()}`,
          paymentMethod: `Wallet - ${WALLETS.find(w => w.id === selectedWallet)?.name}`,
          timestamp: new Date()
        });
      } else {
        onNavigate('payment-failed', {
          ...paymentData,
          reason: 'Wallet payment declined. Please try another method.'
        });
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          <button
            onClick={showPinInput ? () => setShowPinInput(false) : onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">
              Wallet Payment
            </h1>
            <p className="text-white/80 text-[12px]">
              {showPinInput ? 'Enter PIN' : 'Select your wallet'}
            </p>
          </div>
          <Badge className="bg-white/20 hover:bg-white/20 text-white border-white/30">
            ₹{paymentData.amount}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-8">
        {!showPinInput ? (
          <div className="space-y-6">
            {/* Payment Info */}
            <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="w-6 h-6 text-purple-600" />
                <h3 className="text-[16px] font-medium text-neutral-950">Payment Amount</h3>
              </div>
              <div className="text-center">
                <p className="text-[36px] font-bold text-purple-600">
                  ₹{paymentData.amount}
                </p>
                <p className="text-[12px] text-neutral-600 mt-1">
                  For: {paymentData.groupName}
                </p>
              </div>
            </Card>

            {/* Wallet Options */}
            <div className="space-y-3">
              <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-3">
                Choose Wallet
              </h3>

              {WALLETS.map(wallet => {
                const hasSufficientBalance = wallet.balance >= paymentData.amount;
                
                return (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet.id)}
                    disabled={!hasSufficientBalance}
                    className={`w-full p-5 bg-white border-2 rounded-lg transition-all ${
                      hasSufficientBalance
                        ? 'border-neutral-200 hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50'
                        : 'border-neutral-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${wallet.color} rounded-lg flex items-center justify-center`}>
                        <Wallet className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[16px] font-medium text-neutral-950 mb-1">
                          {wallet.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] text-neutral-600">
                            Balance: ₹{wallet.balance}
                          </span>
                          {hasSufficientBalance ? (
                            <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-300">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-300">
                              Insufficient
                            </Badge>
                          )}
                        </div>
                      </div>
                      {hasSufficientBalance && (
                        <CheckCircle className="w-5 h-5 text-neutral-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Info Card */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-blue-900 mb-1">
                    Instant Payment
                  </p>
                  <p className="text-[12px] text-blue-800">
                    Amount will be deducted from your wallet instantly. Make sure you have sufficient balance.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // PIN Input Screen
          <div className="space-y-6">
            {/* Wallet Info */}
            <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${WALLETS.find(w => w.id === selectedWallet)?.color} rounded-lg flex items-center justify-center`}>
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] text-neutral-600 mb-1">Paying with</p>
                  <p className="text-[18px] font-medium text-neutral-950">
                    {WALLETS.find(w => w.id === selectedWallet)?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[24px] font-bold text-purple-600">
                    ₹{paymentData.amount}
                  </p>
                </div>
              </div>
            </Card>

            {/* PIN Input */}
            <Card className="p-6">
              <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                Enter Wallet PIN
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] text-neutral-600 mb-2">
                    4-Digit PIN <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    value={walletPin}
                    onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-[24px] tracking-[1em] font-mono"
                    disabled={processing}
                  />
                  <p className="text-[11px] text-neutral-500 mt-1 text-center">
                    Enter your wallet security PIN
                  </p>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={processing || walletPin.length !== 4}
                  className="w-full h-[48px] bg-purple-600 hover:bg-purple-700"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay ₹{paymentData.amount}
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Security Info */}
            <Card className="p-4 bg-neutral-50">
              <p className="text-[12px] text-neutral-600 text-center">
                🔒 Your PIN is encrypted and secure. We never store your PIN.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
