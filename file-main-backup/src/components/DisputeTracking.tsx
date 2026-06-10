import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, FileText, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DisputeTrackingProps {
  user: any;
  meetupData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

const STATUS_CONFIG = {
  under_review: {
    icon: Clock,
    label: 'Under Review',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    emoji: '⏳',
  },
  info_requested: {
    icon: AlertCircle,
    label: 'Info Requested',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    emoji: '📝',
  },
  restaurant_review: {
    icon: Clock,
    label: 'Restaurant Review',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    emoji: '🍽️',
  },
  approved: {
    icon: CheckCircle,
    label: 'Approved',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    emoji: '✅',
  },
  rejected: {
    icon: XCircle,
    label: 'Rejected',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    emoji: '❌',
  },
  refunded: {
    icon: CheckCircle,
    label: 'Refunded',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    emoji: '✅',
  },
};

export default function DisputeTracking({ user, meetupData, onNavigate, onBack }: DisputeTrackingProps) {
  const dispute = meetupData?.currentDispute || meetupData?.disputes?.[0];
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!dispute) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-[14px] text-neutral-600">No dispute found</p>
          <button
            onClick={onBack}
            className="mt-4 bg-[#8b5943] text-white px-6 py-2 rounded-lg text-[14px]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[dispute.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusConfig?.icon || Clock;

  const handleSubmitInfo = () => {
    if (!additionalInfo.trim()) {
      toast.error('Please provide the requested information');
      return;
    }

    setIsSubmitting(true);

    // Add to timeline
    dispute.timeline.push({
      status: 'info_submitted',
      timestamp: new Date(),
      message: 'Additional information provided by user',
      details: additionalInfo,
    });

    dispute.status = 'under_review';

    setTimeout(() => {
      setIsSubmitting(false);
      setAdditionalInfo('');
      toast.success('Information submitted successfully!');
    }, 1000);
  };

  const handleViewBill = () => {
    toast.success('Opening bill copy...');
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
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Dispute Tracking</h1>
              <p className="text-white/80 text-[12px]">ID: {dispute.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-8">
        {/* Current Status */}
        <div className={`${statusConfig.bg} border-2 ${statusConfig.border} rounded-lg p-6 mb-6`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 ${statusConfig.bg} rounded-full flex items-center justify-center border-2 ${statusConfig.border}`}>
              <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className={`text-[18px] font-['Arial:Regular',_sans-serif] ${statusConfig.color} font-bold`}>
                  {statusConfig.emoji} {statusConfig.label}
                </h2>
              </div>
              <p className="text-[14px] text-neutral-700 mb-3">
                {dispute.status === 'under_review' && 'Your dispute is being reviewed by our team. You will be notified once a decision is made.'}
                {dispute.status === 'info_requested' && 'Admin has requested additional information. Please provide details below.'}
                {dispute.status === 'restaurant_review' && 'The restaurant owner is reviewing your dispute.'}
                {dispute.status === 'approved' && 'Your dispute has been approved. Refund will be processed shortly.'}
                {dispute.status === 'rejected' && 'Your dispute has been rejected. See reason below.'}
                {dispute.status === 'refunded' && 'Refund has been processed to your original payment method.'}
              </p>
              {dispute.status === 'refunded' && dispute.refundDetails && (
                <div className="bg-white border border-green-300 rounded-lg p-3 text-[12px]">
                  <p className="text-green-900">
                    <span className="font-bold">Refund Amount:</span> ₹{dispute.refundDetails.amount}
                  </p>
                  <p className="text-green-900">
                    <span className="font-bold">Method:</span> {dispute.refundDetails.method}
                  </p>
                  <p className="text-green-900">
                    <span className="font-bold">Date:</span> {new Date(dispute.refundDetails.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dispute Details */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
          <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
            Dispute Details
          </h3>
          <div className="space-y-3 text-[14px]">
            <div className="flex justify-between">
              <span className="text-neutral-600">Dispute ID:</span>
              <span className="text-neutral-950 font-bold">{dispute.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Group Name:</span>
              <span className="text-neutral-950 font-bold">{dispute.groupName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Amount:</span>
              <span className="text-neutral-950 font-bold">₹{dispute.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Reason:</span>
              <span className="text-neutral-950 font-bold">{dispute.reasonLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Filed On:</span>
              <span className="text-neutral-950">{new Date(dispute.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {dispute.description && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-[12px] text-neutral-600 mb-1">Description:</p>
              <p className="text-[14px] text-neutral-950">{dispute.description}</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-[12px] text-neutral-600 mb-2">Attached Documents:</p>
            <div className="space-y-2">
              <button
                onClick={handleViewBill}
                className="w-full flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-lg p-3 hover:bg-neutral-100 transition-colors text-left"
              >
                <FileText className="w-5 h-5 text-neutral-600" />
                <div>
                  <p className="text-[14px] text-neutral-950">Bill Copy</p>
                  <p className="text-[12px] text-neutral-600">{dispute.billCopy}</p>
                </div>
              </button>
              {dispute.attachments && dispute.attachments.map((file: string, index: number) => (
                <div key={index} className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                  <FileText className="w-5 h-5 text-neutral-600" />
                  <p className="text-[14px] text-neutral-950">{file}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin/Restaurant Response */}
        {(dispute.adminResponse || dispute.restaurantResponse) && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-blue-900 font-bold mb-2">
                  {dispute.restaurantResponse ? 'Restaurant Response' : 'Admin Response'}
                </p>
                <p className="text-[14px] text-blue-800">
                  {dispute.restaurantResponse || dispute.adminResponse}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Request for Additional Info */}
        {dispute.status === 'info_requested' && (
          <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
            <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-3">
              Provide Additional Information
            </h3>
            <p className="text-[14px] text-neutral-600 mb-4">
              {dispute.adminResponse}
            </p>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Enter the requested information..."
              className="w-full h-[100px] px-4 py-3 border-2 border-neutral-200 rounded-lg text-[14px] focus:border-[#8b5943] focus:outline-none resize-none mb-3"
            />
            <button
              onClick={handleSubmitInfo}
              disabled={isSubmitting}
              className="w-full bg-[#8b5943] text-white h-[44px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/90 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Information'
              )}
            </button>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-4">
            Dispute Timeline
          </h3>
          <div className="space-y-4">
            {dispute.timeline.map((event: any, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-[#8b5943]' : 'bg-neutral-300'}`} />
                  {index < dispute.timeline.length - 1 && (
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

        {/* Help Section */}
        <div className="mt-6 bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <p className="text-[12px] text-neutral-700">
            <span className="font-bold">Need help?</span> Contact support at support@caffelino.com or call 1800-XXX-XXXX
          </p>
        </div>
      </div>
    </div>
  );
}
