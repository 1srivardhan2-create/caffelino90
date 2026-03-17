import { CheckCircle, Download, Share2, ArrowLeft, Home } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface PaymentSuccessScreenProps {
  orderId: string;
  orderData: {
    meetupName: string;
    groupName: string;
    cafeName?: string;
    totalAmount: number;
    memberCount?: number;
    orderDate?: string;
  };
  onNavigate: (page: string, data?: any) => void;
}

export default function PaymentSuccessScreen({ 
  orderId, 
  orderData, 
  onNavigate 
}: PaymentSuccessScreenProps) {
  const userAmount = orderData.memberCount ? Math.ceil(orderData.totalAmount / orderData.memberCount) : orderData.totalAmount;
  const completedAt = new Date().toISOString();
  const paymentMethod = 'UPI'; // This would come from the actual payment

  const handleDownloadReceipt = () => {
    // In real app, this would generate a PDF
    alert('Receipt download feature - would generate PDF in production');
  };

  const handleShare = () => {
    // In real app, this would use Web Share API
    if (navigator.share) {
      navigator.share({
        title: 'Payment Successful',
        text: `Payment completed for ${orderData.meetupName}. Order ID: ${orderId}`,
      });
    } else {
      alert(`Order ID: ${orderId}\nPayment successful for ${orderData.meetupName}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        {/* Success Animation */}
        <div className="text-center">
          <div className="size-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4 animate-bounce shadow-lg">
            <CheckCircle className="size-14 text-white" />
          </div>
          <h1 className="text-3xl text-green-900 mb-2">Payment Successful!</h1>
          <p className="text-green-700">Your payment has been processed</p>
        </div>

        {/* Order ID Card */}
        <Card className="p-6 bg-white shadow-xl border-2 border-green-200">
          <div className="text-center">
            <div className="text-sm text-slate-600 mb-2">Order ID</div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl mb-4">
              <div className="text-2xl tracking-wider">{orderId}</div>
            </div>
            <p className="text-xs text-slate-500">
              Save this Order ID for future reference
            </p>
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-4 bg-white shadow-lg">
          <h3 className="text-slate-900 mb-3">Order Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Meetup</span>
              <span className="text-sm text-slate-900">{orderData.meetupName}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Group</span>
              <span className="text-sm text-slate-900">{orderData.groupName}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Cafe</span>
              <span className="text-sm text-slate-900">{orderData.cafeName}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Date</span>
              <span className="text-sm text-slate-900">{orderData.orderDate}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Payment Method</span>
              <Badge className="bg-blue-100 text-blue-800">{paymentMethod}</Badge>
            </div>

            <div className="bg-green-50 rounded-lg p-3 mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-green-700">Your Amount</span>
                <span className="text-xl text-green-900">₹{userAmount}</span>
              </div>
              <div className="text-xs text-green-600">
                Paid at {new Date(completedAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="w-full"
          >
            <Download className="size-4 mr-2" />
            Download Receipt
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full"
          >
            <Share2 className="size-4 mr-2" />
            Share Order Details
          </Button>

          <Button
            onClick={() => onNavigate('group-home')}
            className="w-full bg-[#8b5943] hover:bg-[#6d4532]"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Group
          </Button>

          <Button
            onClick={() => onNavigate('home')}
            variant="ghost"
            className="w-full"
          >
            <Home className="size-4 mr-2" />
            Go to Home
          </Button>
        </div>

        {/* Success Message */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <p className="text-sm text-blue-900 text-center">
            ✨ Thank you for your payment! Your order has been confirmed and the cafe has been notified.
          </p>
        </Card>
      </div>
    </div>
  );
}