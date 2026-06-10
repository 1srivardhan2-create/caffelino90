import { useState } from 'react';
import { ArrowLeft, AlertCircle, FileText, CreditCard, ShoppingBag, MessageSquare, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface RaiseDisputeProps {
  user: any;
  meetupData: any;
  paymentData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

const DISPUTE_REASONS = [
  { id: 'wrong_amount', label: 'Wrong bill amount', icon: FileText },
  { id: 'duplicate_payment', label: 'Duplicate payment', icon: CreditCard },
  { id: 'food_service', label: 'Food/service issue', icon: ShoppingBag },
  { id: 'other', label: 'Other', icon: MessageSquare },
];

export default function RaiseDispute({ user, meetupData, paymentData, onNavigate, onBack }: RaiseDisputeProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
      toast.success(`${e.target.files.length} file(s) uploaded`);
    }
  };

  const handleSubmitDispute = () => {
    if (!selectedReason) {
      toast.error('Please select a reason for dispute');
      return;
    }

    if (selectedReason === 'other' && !description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    setIsSubmitting(true);

    // Create dispute object
    const dispute = {
      id: `DIS${Date.now()}`,
      meetupId: meetupData.id,
      groupName: meetupData.groupName,
      userId: user.id,
      userName: user.name,
      paymentId: paymentData.transactionId,
      amount: paymentData.amount,
      reason: selectedReason,
      reasonLabel: DISPUTE_REASONS.find(r => r.id === selectedReason)?.label,
      description: description,
      attachments: uploadedFiles.map(f => f.name),
      billCopy: paymentData.billCopy || 'bill_12345.pdf',
      status: 'under_review',
      createdAt: new Date(),
      timeline: [
        {
          status: 'submitted',
          timestamp: new Date(),
          message: 'Dispute raised by user',
        }
      ],
      adminResponse: null,
      restaurantResponse: null,
      refundStatus: null,
    };

    // Initialize disputes array if not exists
    if (!meetupData.disputes) {
      meetupData.disputes = [];
    }

    meetupData.disputes.push(dispute);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Dispute raised successfully!');
      onNavigate('dispute-tracking', { ...meetupData, currentDispute: dispute });
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
            <div>
              <h1 className="text-white text-[20px] font-['Arial:Regular',_sans-serif]">Raise Dispute</h1>
              <p className="text-white/80 text-[12px]">{meetupData?.groupName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Payment Details */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-[14px] font-['Arial:Regular',_sans-serif] text-blue-900 font-bold mb-2">
                Payment Information
              </p>
              <div className="space-y-1 text-[12px] text-blue-800">
                <p>Transaction ID: <span className="font-bold">{paymentData?.transactionId}</span></p>
                <p>Amount Paid: <span className="font-bold">₹{paymentData?.amount}</span></p>
                <p>Payment Method: <span className="font-bold">{paymentData?.method}</span></p>
                <p>Date: <span className="font-bold">{new Date(paymentData?.timestamp).toLocaleString()}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Select Reason */}
        <div className="mb-6">
          <h2 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-3">
            Select Dispute Reason *
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DISPUTE_REASONS.map((reason) => {
              const Icon = reason.icon;
              const isSelected = selectedReason === reason.id;
              return (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`p-4 border-2 rounded-lg transition-all text-left ${
                    isSelected
                      ? 'border-[#8b5943] bg-[#8b5943]/5'
                      : 'border-neutral-200 hover:border-[#8b5943]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-[#8b5943]' : 'bg-neutral-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-neutral-600'}`} />
                    </div>
                    <div>
                      <p className={`text-[14px] font-['Arial:Regular',_sans-serif] ${
                        isSelected ? 'text-[#8b5943] font-bold' : 'text-neutral-950'
                      }`}>
                        {reason.label}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-3">
            Description {selectedReason === 'other' && '*'}
          </h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide details about your dispute..."
            className="w-full h-[120px] px-4 py-3 border-2 border-neutral-200 rounded-lg text-[14px] focus:border-[#8b5943] focus:outline-none resize-none"
          />
          <p className="text-[12px] text-neutral-500 mt-2">
            {description.length}/500 characters
          </p>
        </div>

        {/* Upload Additional Evidence */}
        <div className="mb-6">
          <h2 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-3">
            Upload Additional Evidence (Optional)
          </h2>
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-[14px] text-neutral-600 mb-2">
              Upload screenshots or documents
            </p>
            <label className="inline-block bg-[#8b5943] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#8b5943]/90 transition-colors text-[14px]">
              Choose Files
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-[12px] text-neutral-500 mt-2">
              Supported: JPG, PNG, PDF (Max 5MB each)
            </p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-[12px] text-green-900">{file.name}</span>
                  </div>
                  <button
                    onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                    className="text-[12px] text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auto-Attached Documents */}
        <div className="mb-6">
          <h2 className="text-[16px] font-['Arial:Regular',_sans-serif] text-neutral-950 mb-3">
            Auto-Attached Documents
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
              <FileText className="w-5 h-5 text-neutral-600" />
              <div className="flex-1">
                <p className="text-[14px] text-neutral-950">Bill Copy</p>
                <p className="text-[12px] text-neutral-600">{paymentData?.billCopy || 'bill_12345.pdf'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
              <CreditCard className="w-5 h-5 text-neutral-600" />
              <div className="flex-1">
                <p className="text-[14px] text-neutral-950">Payment Receipt</p>
                <p className="text-[12px] text-neutral-600">Transaction #{paymentData?.transactionId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-[12px] text-orange-900">
            <span className="font-bold">⚠️ Important:</span> Disputes are typically reviewed within 24-48 hours. 
            You will receive notifications at each stage. False disputes may result in account suspension.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-white border-2 border-neutral-300 text-neutral-700 h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitDispute}
            disabled={isSubmitting || !selectedReason || (selectedReason === 'other' && !description.trim())}
            className="flex-1 bg-[#8b5943] text-white h-[48px] rounded-lg text-[16px] font-['Arial:Regular',_sans-serif] hover:bg-[#8b5943]/90 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Dispute'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
