import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, FileText, MessageSquare, AlertCircle, Store } from 'lucide-react';
import { toast } from 'sonner';

interface RestaurantDisputeReviewProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

// Mock disputes forwarded to restaurant
const RESTAURANT_DISPUTES = [
  {
    id: 'DIS1702345678902',
    meetupId: 'MTG124',
    groupName: 'Office Lunch Gang',
    userId: 'user456',
    userName: 'Priya Patel',
    paymentId: 'TXN987654322',
    amount: 680,
    reason: 'food_service',
    reasonLabel: 'Food/service issue',
    description: 'Food was cold and service was poor',
    orderItems: [
      { name: 'Paneer Butter Masala', quantity: 2, price: 280 },
      { name: 'Garlic Naan', quantity: 4, price: 60 },
      { name: 'Dal Makhani', quantity: 1, price: 200 },
    ],
    billCopy: 'bill_12346.pdf',
    status: 'restaurant_review',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    cafeName: 'Café Delights',
    cafeAddress: '123 MG Road, Bangalore',
  },
];

export default function RestaurantDisputeReview({ user, onNavigate, onBack }: RestaurantDisputeReviewProps) {
  const [disputes, setDisputes] = useState(RESTAURANT_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [action, setAction] = useState<'accept' | 'deny' | null>(null);
  const [response, setResponse] = useState('');
  const [partialRefund, setPartialRefund] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectDispute = (dispute: any) => {
    setSelectedDispute(dispute);
    setAction(null);
    setResponse('');
    setPartialRefund('');
  };

  const handleAction = (actionType: 'accept' | 'deny') => {
    setAction(actionType);
    
    if (actionType === 'accept') {
      setResponse('We acknowledge the issue with food quality and service. We apologize for the inconvenience.');
    } else {
      setResponse('After checking with our kitchen staff, the food was served hot and fresh. Service standards were met.');
    }
  };

  const handleSubmitReview = () => {
    if (!response.trim()) {
      toast.error('Please provide a response');
      return;
    }

    if (action === 'accept' && partialRefund && (parseFloat(partialRefund) > selectedDispute.amount || parseFloat(partialRefund) <= 0)) {
      toast.error('Invalid refund amount');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const updatedDispute = { ...selectedDispute };
      
      if (action === 'accept') {
        updatedDispute.restaurantResponse = response;
        updatedDispute.restaurantDecision = 'accepted';
        updatedDispute.status = 'approved';
        updatedDispute.refundAmount = partialRefund ? parseFloat(partialRefund) : selectedDispute.amount;
        
        toast.success('Dispute accepted. Refund will be processed by admin.');
      } else {
        updatedDispute.restaurantResponse = response;
        updatedDispute.restaurantDecision = 'denied';
        updatedDispute.status = 'under_review'; // Goes back to admin for final decision
        
        toast.success('Response submitted. Admin will make final decision.');
      }

      setDisputes(disputes.map(d => d.id === updatedDispute.id ? updatedDispute : d));
      setSelectedDispute(null);
      setAction(null);
      setResponse('');
      setPartialRefund('');
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#be9d80] px-4 py-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <Store className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Restaurant Dispute Review</h1>
                <p className="text-white/80 text-[12px]">Review customer disputes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Disputes List */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <h2 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                Pending Reviews ({disputes.length})
              </h2>
              {disputes.length > 0 ? (
                <div className="space-y-3">
                  {disputes.map((dispute) => (
                    <button
                      key={dispute.id}
                      onClick={() => handleSelectDispute(dispute)}
                      className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                        selectedDispute?.id === dispute.id
                          ? 'border-[#8b5943] bg-[#8b5943]/5'
                          : 'border-neutral-200 hover:border-[#8b5943]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">
                          {dispute.userName}
                        </p>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          Pending Review
                        </span>
                      </div>
                      <p className="text-[12px] text-neutral-600 mb-1">{dispute.reasonLabel}</p>
                      <p className="text-[12px] text-neutral-500">₹{dispute.amount}</p>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        {new Date(dispute.createdAt).toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-[14px] text-neutral-600">No pending disputes</p>
                </div>
              )}
            </div>
          </div>

          {/* Dispute Details */}
          <div className="lg:col-span-2">
            {selectedDispute ? (
              <div className="space-y-6">
                {/* Customer & Order Info */}
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                    Dispute Information
                  </h3>
                  
                  {/* Alert */}
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-purple-900 font-bold mb-1">
                          Customer Dispute
                        </p>
                        <p className="text-[12px] text-purple-800">
                          Review the customer's complaint carefully and provide an honest assessment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[12px] text-neutral-600">Customer Name</p>
                      <p className="text-[14px] text-neutral-950 font-bold">{selectedDispute.userName}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-neutral-600">Dispute ID</p>
                      <p className="text-[14px] text-neutral-950 font-bold">{selectedDispute.id}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-neutral-600">Bill Amount</p>
                      <p className="text-[14px] text-neutral-950 font-bold">₹{selectedDispute.amount}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-neutral-600">Complaint Type</p>
                      <p className="text-[14px] text-neutral-950 font-bold">{selectedDispute.reasonLabel}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[12px] text-neutral-600">Customer's Complaint</p>
                      <p className="text-[14px] text-neutral-950 bg-red-50 border border-red-200 p-3 rounded-lg mt-1">
                        "{selectedDispute.description}"
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="pt-4 border-t border-neutral-200">
                    <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold mb-3">
                      Order Items
                    </p>
                    <div className="space-y-2">
                      {selectedDispute.orderItems.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg">
                          <div>
                            <p className="text-[14px] text-neutral-950">{item.name}</p>
                            <p className="text-[12px] text-neutral-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="text-[14px] text-neutral-950 font-bold">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between">
                      <span className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 font-bold">Total</span>
                      <span className="text-[18px] text-[#8b5943] font-bold">₹{selectedDispute.amount}</span>
                    </div>
                  </div>
                </div>

                {/* Action Selector */}
                {!action && (
                  <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                      Your Response
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleAction('accept')}
                        className="p-6 border-2 border-green-300 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
                      >
                        <CheckCircle className="w-10 h-10 text-green-600 mb-3" />
                        <p className="text-[16px] text-green-900 font-bold mb-1">Accept Issue</p>
                        <p className="text-[12px] text-green-700">
                          Acknowledge the complaint and offer refund
                        </p>
                      </button>
                      <button
                        onClick={() => handleAction('deny')}
                        className="p-6 border-2 border-red-300 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left"
                      >
                        <XCircle className="w-10 h-10 text-red-600 mb-3" />
                        <p className="text-[16px] text-red-900 font-bold mb-1">Deny Complaint</p>
                        <p className="text-[12px] text-red-700">
                          Provide explanation for denial
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Response Form */}
                {action && (
                  <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                      {action === 'accept' ? '✅ Accept Issue' : '❌ Deny Complaint'}
                    </h3>

                    {action === 'accept' && (
                      <div className="mb-4">
                        <label className="text-[14px] text-neutral-700 mb-2 block">
                          Refund Amount (Optional - Leave blank for full refund)
                        </label>
                        <input
                          type="number"
                          value={partialRefund}
                          onChange={(e) => setPartialRefund(e.target.value)}
                          placeholder={`Enter amount (Max: ₹${selectedDispute.amount})`}
                          className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg text-[14px] focus:border-[#8b5943] focus:outline-none"
                        />
                        <p className="text-[12px] text-neutral-500 mt-1">
                          Full refund: ₹{selectedDispute.amount} | Partial refund: Enter custom amount
                        </p>
                      </div>
                    )}

                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Explain your decision to the customer and admin..."
                      className="w-full h-[120px] px-4 py-3 border-2 border-neutral-200 rounded-lg text-[14px] focus:border-[#8b5943] focus:outline-none resize-none mb-4"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setAction(null);
                          setResponse('');
                          setPartialRefund('');
                        }}
                        className="flex-1 bg-white border-2 border-neutral-300 text-neutral-700 h-[44px] rounded-lg text-[14px] hover:bg-neutral-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        disabled={isProcessing}
                        className={`flex-1 h-[44px] rounded-lg text-[14px] text-white transition-colors disabled:bg-neutral-300 flex items-center justify-center gap-2 ${
                          action === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          `Submit ${action === 'accept' ? 'Acceptance' : 'Denial'}`
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Important Info */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-[12px] text-orange-900">
                    <span className="font-bold">⚠️ Important:</span> Your response will be shared with the customer and platform admin. 
                    If you accept the issue, the admin will process the refund. If you deny, the admin will make the final decision.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
                <Store className="w-16 h-16 text-neutral-400 mx-auto mb-3" />
                <p className="text-[16px] text-neutral-600 mb-2">Select a dispute to review</p>
                <p className="text-[12px] text-neutral-500">
                  Review customer complaints and provide your assessment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
