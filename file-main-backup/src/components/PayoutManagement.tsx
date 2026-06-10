import { useState } from 'react';
import { CreditCard, Smartphone, Plus, CheckCircle, Clock, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import type { Payout, BankAccount, UPIAccount } from '../utils/earningsData';

interface PayoutManagementProps {
  availableBalance: number;
  payoutHistory: Payout[];
  onNavigate: (page: string, data?: any) => void;
}

export default function PayoutManagement({ availableBalance, payoutHistory, onNavigate }: PayoutManagementProps) {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accountType, setAccountType] = useState<'bank' | 'upi'>('bank');
  const [showRequestPayout, setShowRequestPayout] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');

  // Mock stored accounts
  const [bankAccounts] = useState<BankAccount[]>([
    {
      accountNumber: '****1234',
      ifscCode: 'HDFC0001234',
      accountHolderName: 'Platform Admin',
      bankName: 'HDFC Bank'
    }
  ]);

  const [upiAccounts] = useState<UPIAccount[]>([
    {
      upiId: 'admin@paytm',
      name: 'Platform Admin'
    }
  ]);

  const [selectedAccount, setSelectedAccount] = useState<string>('bank-0');

  const pendingPayouts = payoutHistory.filter(p => p.status === 'pending' || p.status === 'processing');
  const completedPayouts = payoutHistory.filter(p => p.status === 'completed');

  const handleRequestPayout = () => {
    const amount = parseFloat(payoutAmount);
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    if (amount < 1000) {
      toast.error('Minimum payout amount is ₹1,000');
      return;
    }

    toast.success('Payout request submitted successfully!');
    setShowRequestPayout(false);
    setPayoutAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Available Balance Card */}
      <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 border-0 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[13px] text-white/90 uppercase tracking-wide mb-2">Available for Withdrawal</p>
            <p className="text-[48px] font-bold text-white mb-2">₹{availableBalance.toLocaleString()}</p>
            <p className="text-[13px] text-white/80">
              Minimum withdrawal: ₹1,000 • Processing time: 2-3 business days
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowRequestPayout(true)}
          className="w-full bg-white text-green-700 hover:bg-white/90 h-[48px] text-[16px] font-medium"
          disabled={availableBalance < 1000}
        >
          <ArrowRight className="w-5 h-5 mr-2" />
          Request Payout
        </Button>
      </Card>

      {/* Request Payout Modal */}
      {showRequestPayout && (
        <Card className="p-6 border-2 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-medium text-neutral-950">Request Payout</h3>
            <button
              onClick={() => setShowRequestPayout(false)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-[13px] text-neutral-700 mb-2">
                Payout Amount (₹) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                className="text-[18px] h-[48px]"
              />
              <p className="text-[12px] text-neutral-500 mt-1">
                Available: ₹{availableBalance.toLocaleString()} • Min: ₹1,000
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[5000, 10000, availableBalance].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setPayoutAmount(amount.toString())}
                  className="flex-1 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-[14px] font-medium transition-colors"
                  disabled={amount > availableBalance}
                >
                  ₹{amount.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Select Account */}
            <div>
              <label className="block text-[13px] text-neutral-700 mb-2">
                Payout To <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {bankAccounts.map((acc, idx) => (
                  <button
                    key={`bank-${idx}`}
                    onClick={() => setSelectedAccount(`bank-${idx}`)}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                      selectedAccount === `bank-${idx}`
                        ? 'border-green-500 bg-green-50'
                        : 'border-neutral-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-[14px] font-medium text-neutral-950">{acc.bankName}</p>
                        <p className="text-[12px] text-neutral-600">{acc.accountNumber} • {acc.ifscCode}</p>
                      </div>
                    </div>
                    {selectedAccount === `bank-${idx}` && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </button>
                ))}

                {upiAccounts.map((acc, idx) => (
                  <button
                    key={`upi-${idx}`}
                    onClick={() => setSelectedAccount(`upi-${idx}`)}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                      selectedAccount === `upi-${idx}`
                        ? 'border-green-500 bg-green-50'
                        : 'border-neutral-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-[14px] font-medium text-neutral-950">UPI Account</p>
                        <p className="text-[12px] text-neutral-600">{acc.upiId}</p>
                      </div>
                    </div>
                    {selectedAccount === `upi-${idx}` && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleRequestPayout}
              className="w-full h-[48px] bg-green-600 hover:bg-green-700"
            >
              Submit Payout Request
            </Button>
          </div>
        </Card>
      )}

      {/* Linked Accounts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-medium text-neutral-950">Linked Accounts</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddAccount(!showAddAccount)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>

        {showAddAccount && (
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-[13px] text-blue-900 mb-3">
              <strong>Add New Account:</strong> Choose account type
            </p>
            <div className="flex gap-2">
              <Button
                variant={accountType === 'bank' ? 'default' : 'outline'}
                onClick={() => setAccountType('bank')}
                className="flex-1"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Bank Account
              </Button>
              <Button
                variant={accountType === 'upi' ? 'default' : 'outline'}
                onClick={() => setAccountType('upi')}
                className="flex-1"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                UPI ID
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {bankAccounts.map((account, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-950">{account.bankName}</p>
                    <p className="text-[12px] text-neutral-600">
                      {account.accountNumber} • {account.ifscCode}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
              </div>
            </div>
          ))}

          {upiAccounts.map((account, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-neutral-950">UPI Account</p>
                    <p className="text-[12px] text-neutral-600">{account.upiId}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payout History */}
      <Card className="p-6">
        <h3 className="text-[18px] font-medium text-neutral-950 mb-4">Payout History</h3>

        {/* Pending Payouts */}
        {pendingPayouts.length > 0 && (
          <div className="mb-6">
            <h4 className="text-[14px] font-medium text-neutral-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Pending & Processing
            </h4>
            <div className="space-y-3">
              {pendingPayouts.map((payout) => (
                <div key={payout.id} className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[16px] font-bold text-neutral-950">₹{payout.amount.toLocaleString()}</p>
                      <p className="text-[12px] text-neutral-600">
                        Requested {new Date(payout.requestedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                      <Clock className="w-3 h-3 mr-1" />
                      {payout.status === 'pending' ? 'Pending' : 'Processing'}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-neutral-600">To: {payout.accountDetails}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Payouts */}
        {completedPayouts.length > 0 && (
          <div>
            <h4 className="text-[14px] font-medium text-neutral-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Completed Payouts
            </h4>
            <div className="space-y-3">
              {completedPayouts.map((payout) => (
                <div key={payout.id} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[16px] font-bold text-neutral-950">₹{payout.amount.toLocaleString()}</p>
                      <p className="text-[12px] text-neutral-600">
                        Completed {new Date(payout.completedAt!).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-neutral-600">
                    <span>To: {payout.accountDetails}</span>
                    {payout.transactionId && (
                      <span className="font-mono">{payout.transactionId}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-[13px] text-blue-900">
            <p><strong>Payout Guidelines:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Minimum withdrawal amount: ₹1,000</li>
              <li>• Processing time: 2-3 business days</li>
              <li>• Bank transfers: No fees</li>
              <li>• UPI transfers: Instant (subject to bank limits)</li>
              <li>• Maximum 3 payout requests per month</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
