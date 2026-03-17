import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface PaymentPageProps {
  onNavigate: (page: string) => void;
}

export default function PaymentPage({ onNavigate }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [splitBill, setSplitBill] = useState(true);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const totalBill = 930;
  const members = 4;
  const commission = Math.round(totalBill * 0.05);
  const cafeAmount = totalBill - commission;
  const perPersonAmount = splitBill ? Math.round(totalBill / members) : totalBill;

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentComplete(true);
      toast.success('Payment successful!');
    }, 1500);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl mb-2">Payment Successful!</h1>
          <p className="text-slate-600 mb-6">
            Your order has been sent to Café Milano.
          </p>

          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-slate-600">Amount Paid:</span>
              <span>₹{perPersonAmount}</span>
            </div>
            {splitBill && (
              <div className="flex justify-between mb-2">
                <span className="text-slate-600">Split Among:</span>
                <span>{members} members</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-600">Commission:</span>
              <span>₹{Math.round(commission / members)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.print()}
            >
              View Receipt
            </Button>
            <Button 
              className="flex-1"
              onClick={() => onNavigate('group-detail')}
            >
              Go to Group
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('cafe-menu')}
          className="caffelino-back-btn mb-8"
        >
          ← Back
        </button>
        
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Payment – Café Milano</h1>
          <p className="text-slate-600">Split bill among members or pay individually</p>
        </div>

        {/* Order Summary */}
        <Card className="p-6 mb-6">
          <h3 className="mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {[
              { name: 'Margherita Pizza', price: 350 },
              { name: 'Cappuccino', price: 150 },
              { name: 'French Fries', price: 120 },
              { name: 'Chocolate Cake', price: 180 },
              { name: 'Cold Coffee', price: 130 }
            ].map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between mb-2">
              <span>Total:</span>
              <span>₹{totalBill}</span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="mt-3">
            Edit Order
          </Button>
        </Card>

        {/* Split Bill Option */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="mb-1">Split Bill</h3>
              <p className="text-sm text-slate-600">
                Divide the total among group members
              </p>
            </div>
            <Switch checked={splitBill} onCheckedChange={setSplitBill} />
          </div>

          {splitBill && (
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span>Total Amount:</span>
                <span>₹{totalBill}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Members:</span>
                <span>{members}</span>
              </div>
              <div className="flex justify-between text-xl">
                <span>Each Pays:</span>
                <span>₹{perPersonAmount}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Payment Method */}
        <Card className="p-6 mb-6">
          <h3 className="mb-4">Payment Method</h3>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              {/* UPI Payment */}
              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Smartphone className="w-5 h-5" />
                  <div>
                    <div>Pay Online (UPI)</div>
                    <div className="text-sm text-slate-500">Fast & Secure Payment</div>
                  </div>
                </Label>
              </div>

              {/* Cash Payment */}
              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                  <CreditCard className="w-5 h-5" />
                  <div>
                    <div>Pay Cash at Meetup</div>
                    <div className="text-sm text-slate-500">Pay directly at the café</div>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </Card>

        {/* Commission Info */}
        <Card className="p-6 mb-6 bg-slate-50">
          <h3 className="mb-3 text-sm">Payment Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Amount:</span>
              <span>₹{totalBill}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Platform Fee (5%):</span>
              <span>₹{commission}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Amount to Café:</span>
              <span>₹{cafeAmount}</span>
            </div>
          </div>
        </Card>

        {/* Pay Button */}
        <Button 
          size="lg" 
          className="w-full"
          onClick={handlePayment}
        >
          Pay ₹{perPersonAmount}
        </Button>

        <p className="text-sm text-slate-500 text-center mt-4">
          Your payment is secure and encrypted. We take a 5% platform fee.
        </p>
      </div>
    </div>
  );
}
