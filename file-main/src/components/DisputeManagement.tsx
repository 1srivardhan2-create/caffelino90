import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, FileText, AlertCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

interface DisputeManagementProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

// Mock disputes data
const MOCK_DISPUTES: any[] = [];

export default function DisputeManagement({ user, onNavigate, onBack }: DisputeManagementProps) {
  const [disputes, setDisputes] = useState<any[]>(MOCK_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [action, setAction] = useState<'approve' | 'reject' | 'request_info' | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isAdmin = true; // In real app, check user role

  const handleSelectDispute = (dispute: any) => {
    setSelectedDispute(dispute);
    setAction(null);
    setResponseMessage('');
  };

  const handleAction = (actionType: 'approve' | 'reject' | 'request_info') => {
    setAction(actionType);
    
    // Set default messages
    if (actionType === 'approve') {
      setResponseMessage('Your dispute has been approved. Refund will be processed within 3-5 business days.');
    } else if (actionType === 'reject') {
      setResponseMessage('After reviewing your dispute, we found no discrepancy in the bill amount.');
    } else if (actionType === 'request_info') {
      setResponseMessage('Please provide a screenshot of your payment confirmation showing the charged amount.');
    }
  };

  const handleSubmitAction = () => {
    if (!responseMessage.trim()) {
      toast.error('Please provide a response message');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Update dispute
      const updatedDispute = { ...selectedDispute };
      
      if (action === 'approve') {
        updatedDispute.status = 'approved';
        updatedDispute.timeline.push({
          status: 'approved',
          timestamp: new Date(),
          message: 'Dispute approved by admin',
          details: responseMessage,
        });
        updatedDispute.adminResponse = responseMessage;
        
        // Simulate refund processing
        setTimeout(() => {
          updatedDispute.status = 'refunded';
          updatedDispute.refundDetails = {
            amount: updatedDispute.amount,
            method: 'Original Payment Method',
            timestamp: new Date(),
          };
          updatedDispute.timeline.push({
            status: 'refunded',
            timestamp: new Date(),
            message: 'Refund processed successfully',
          });
        }, 2000);
      } else if (action === 'reject') {
        updatedDispute.status = 'rejected';
        updatedDispute.timeline.push({
          status: 'rejected',
          timestamp: new Date(),
          message: 'Dispute rejected by admin',
          details: responseMessage,
        });
        updatedDispute.adminResponse = responseMessage;
      } else if (action === 'request_info') {
        updatedDispute.status = 'info_requested';
        updatedDispute.timeline.push({
          status: 'info_requested',
          timestamp: new Date(),
          message: 'Admin requested additional information',
          details: responseMessage,
        });
        updatedDispute.adminResponse = responseMessage;
      }

      setDisputes(disputes.map(d => d.id === updatedDispute.id ? updatedDispute : d));
      setSelectedDispute(updatedDispute);
      setIsProcessing(false);
      setAction(null);
      setResponseMessage('');
      
      toast.success(`Dispute ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'updated'} successfully!`);
    }, 1500);
  };

  const handleForwardToRestaurant = () => {
    if (!selectedDispute) return;

    const updatedDispute = { ...selectedDispute };
    updatedDispute.status = 'restaurant_review';
    updatedDispute.timeline.push({
      status: 'forwarded_to_restaurant',
      timestamp: new Date(),
      message: 'Forwarded to restaurant for review',
    });

    setDisputes(disputes.map(d => d.id === updatedDispute.id ? updatedDispute : d));
    setSelectedDispute(updatedDispute);
    
    toast.success('Dispute forwarded to restaurant owner');
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
            <div>
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Dispute Management</h1>
              <p className="text-white/80 text-[12px]">Review and manage user disputes</p>
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
                Active Disputes ({disputes.length})
              </h2>
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
                      <span className={`text-[10px] px-2 py-1 rounded-full ${
                        dispute.status === 'under_review' ? 'bg-orange-100 text-orange-700' :
                        dispute.status === 'restaurant_review' ? 'bg-purple-100 text-purple-700' :
                        dispute.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {dispute.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[12px] text-neutral-600 mb-1">{dispute.reasonLabel}</p>
                    <p className="text-[12px] text-neutral-500">₹{dispute.amount} • {dispute.id}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dispute Details & Actions */}
          <div className="lg:col-span-2">
            {selectedDispute ? (
              <div className="space-y-6">
                {/* Dispute Info */}
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                    Dispute Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[12px] text-neutral-600">Dispute ID</p>
                      <p className="text-[14px] text-neutral-950 font-bold">{selectedDispute.id}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-neutral-600">User</p>
                      <p className="text-[14px] text-neutral-950 font-bold">{selectedDispute.userName}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-neutral-600">Amount</p>
                      <p className="text-[14px] text-neutral-950 font-bold">₹{selectedDispute.amount}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-neutral-600">Reason</p>
                      <p className="text-[14px] text-neutral-950 font-bold">{selectedDispute.reasonLabel}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[12px] text-neutral-600">Description</p>
                      <p className="text-[14px] text-neutral-950">{selectedDispute.description}</p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="pt-4 border-t border-neutral-200">
                    <p className="text-[12px] text-neutral-600 mb-2">Documents</p>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[12px] hover:bg-neutral-100">
                        <FileText className="w-4 h-4" />
                        {selectedDispute.billCopy}
                      </button>
                      {selectedDispute.attachments.map((file: string, index: number) => (
                        <button key={index} className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-[12px] hover:bg-neutral-100">
                          <FileText className="w-4 h-4" />
                          {file}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Selector */}
                {!action && selectedDispute.status === 'under_review' && (
                  <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                      Take Action
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={() => handleAction('approve')}
                        className="p-4 border-2 border-green-300 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
                      >
                        <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                        <p className="text-[14px] text-green-900 font-bold">Approve Refund</p>
                        <p className="text-[12px] text-green-700">Grant full refund</p>
                      </button>
                      <button
                        onClick={() => handleAction('reject')}
                        className="p-4 border-2 border-red-300 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left"
                      >
                        <XCircle className="w-8 h-8 text-red-600 mb-2" />
                        <p className="text-[14px] text-red-900 font-bold">Reject Dispute</p>
                        <p className="text-[12px] text-red-700">Deny the request</p>
                      </button>
                      <button
                        onClick={() => handleAction('request_info')}
                        className="p-4 border-2 border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
                      >
                        <MessageSquare className="w-8 h-8 text-blue-600 mb-2" />
                        <p className="text-[14px] text-blue-900 font-bold">Request Info</p>
                        <p className="text-[12px] text-blue-700">Ask for details</p>
                      </button>
                    </div>

                    {/* Forward to Restaurant */}
                    {(selectedDispute.reason === 'food_service' || selectedDispute.reason === 'wrong_amount') && (
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <button
                          onClick={handleForwardToRestaurant}
                          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white h-[44px] rounded-lg text-[14px] hover:bg-purple-700 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Forward to Restaurant Owner
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Form */}
                {action && (
                  <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                      {action === 'approve' ? '✅ Approve Refund' : action === 'reject' ? '❌ Reject Dispute' : '📝 Request Information'}
                    </h3>
                    <textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Enter response message..."
                      className="w-full h-[120px] px-4 py-3 border-2 border-neutral-200 rounded-lg text-[14px] focus:border-[#8b5943] focus:outline-none resize-none mb-4"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setAction(null);
                          setResponseMessage('');
                        }}
                        className="flex-1 bg-white border-2 border-neutral-300 text-neutral-700 h-[44px] rounded-lg text-[14px] hover:bg-neutral-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitAction}
                        disabled={isProcessing}
                        className={`flex-1 h-[44px] rounded-lg text-[14px] text-white transition-colors disabled:bg-neutral-300 flex items-center justify-center gap-2 ${
                          action === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                          action === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                          'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Submit ${action === 'approve' ? 'Approval' : action === 'reject' ? 'Rejection' : 'Request'}`
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
                    Timeline
                  </h3>
                  <div className="space-y-4">
                    {selectedDispute.timeline.map((event: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-[#8b5943]' : 'bg-neutral-300'}`} />
                          {index < selectedDispute.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-neutral-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-[14px] text-neutral-950 font-bold">{event.message}</p>
                          <p className="text-[12px] text-neutral-600">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                          {event.details && (
                            <p className="text-[12px] text-neutral-700 mt-1 bg-neutral-50 p-2 rounded">
                              {event.details}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
                <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-[14px] text-neutral-600">Select a dispute to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
