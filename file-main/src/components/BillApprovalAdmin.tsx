import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Edit, AlertTriangle, Users, Calendar, Clock, Receipt, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface BillApprovalAdminProps {
  billData: any;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export default function BillApprovalAdmin({ billData, onNavigate, onBack }: BillApprovalAdminProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(billData?.extractedData?.totalAmount || 0);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleApprove = () => {
    setProcessing(true);

    // Simulate approval process
    setTimeout(() => {
      const finalBillData = {
        ...billData,
        extractedData: {
          ...billData.extractedData,
          totalAmount: editedAmount
        },
        status: 'approved',
        approvedAt: new Date().toISOString(),
        locked: true
      };

      toast.success('Bill approved and locked!');
      
      // Navigate to bill splitting system
      onNavigate('order-based-billing', {
        ...finalBillData,
        groupData: {
          code: billData.code,
          groupName: billData.groupName,
          memberCount: billData.memberCount
        }
      });
    }, 1500);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);

    // Simulate rejection process
    setTimeout(() => {
      toast.error('Bill rejected');
      
      // In production, this would notify the restaurant to resubmit
      onBack();
    }, 1500);
  };

  const handleEditAmount = () => {
    if (isEditing) {
      // Save the edit
      if (editedAmount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }
      toast.success('Amount updated');
    }
    setIsEditing(!isEditing);
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
              Bill Verification
            </h1>
            <p className="text-white/80 text-[12px]">
              Admin Review Required
            </p>
          </div>
          <Badge className="bg-amber-500 hover:bg-amber-600">
            Pending
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Group Info */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-medium text-neutral-900">
                  {billData?.groupName}
                </h3>
                <p className="text-[14px] text-neutral-600 mt-1">
                  Order Code: <span className="font-mono font-bold">{billData?.code}</span>
                </p>
                <div className="flex items-center gap-4 mt-2 text-[12px] text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {billData?.memberCount} members
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {billData?.extractedData?.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {billData?.extractedData?.time}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Alert */}
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-[14px] font-medium text-amber-900 mb-1">
                  Review Carefully Before Approving
                </p>
                <p className="text-[12px] text-amber-800">
                  Once approved, the bill amount will be permanently locked and distributed among all members for payment.
                </p>
              </div>
            </div>
          </Card>

          {/* Bill Image */}
          <Card className="p-4">
            <h3 className="text-[16px] font-medium text-neutral-900 mb-3">
              Scanned Bill Image
            </h3>
            {billData?.billImage && (
              <div className="rounded-lg border-2 border-neutral-200 overflow-hidden">
                <img
                  src={billData.billImage}
                  alt="Bill"
                  className="w-full"
                />
              </div>
            )}
          </Card>

          {/* Extracted Details */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-['Arial:Regular',_sans-serif] text-neutral-950">
                Bill Details
              </h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <Receipt className="w-3 h-3" />
                OCR Extracted
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Restaurant Name */}
              <div>
                <label className="block text-[12px] text-neutral-600 mb-1">
                  Restaurant Name
                </label>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3">
                  <p className="text-[14px] text-neutral-900">
                    {billData?.extractedData?.restaurantName}
                  </p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-neutral-600 mb-1">
                    Date
                  </label>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3">
                    <p className="text-[14px] text-neutral-900">
                      {billData?.extractedData?.date}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] text-neutral-600 mb-1">
                    Time
                  </label>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3">
                    <p className="text-[14px] text-neutral-900">
                      {billData?.extractedData?.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bill Number */}
              {billData?.extractedData?.billNumber && (
                <div>
                  <label className="block text-[12px] text-neutral-600 mb-1">
                    Bill Number
                  </label>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3">
                    <p className="text-[14px] text-neutral-900 font-mono">
                      {billData?.extractedData?.billNumber}
                    </p>
                  </div>
                </div>
              )}

              {/* Total Amount - Editable */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[12px] text-neutral-600">
                    Total Bill Amount
                  </label>
                  <button
                    onClick={handleEditAmount}
                    className="text-[12px] text-[#8b5943] hover:underline flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] font-bold text-neutral-700">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={editedAmount}
                    onChange={(e) => setEditedAmount(parseFloat(e.target.value) || 0)}
                    disabled={!isEditing}
                    className={`pl-12 text-[24px] font-bold text-[#8b5943] h-[60px] ${
                      isEditing ? 'border-2 border-[#8b5943]' : 'bg-neutral-50'
                    }`}
                  />
                </div>
                {isEditing && (
                  <p className="text-[12px] text-neutral-500 mt-1">
                    Correct the amount if OCR extraction is incorrect
                  </p>
                )}
              </div>

              {/* Per Person Calculation */}
              <div className="p-4 bg-gradient-to-br from-[#8b5943]/10 to-[#d9bf9d]/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[12px] text-neutral-600">Amount per person</p>
                    <p className="text-[10px] text-neutral-500">
                      ({billData?.memberCount} members)
                    </p>
                  </div>
                  <p className="text-[24px] font-bold text-[#8b5943]">
                    ₹{Math.ceil(editedAmount / (billData?.memberCount || 1))}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(true)}
              disabled={processing}
              className="h-[48px] border-2 border-red-300 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Bill
            </Button>
            <Button
              onClick={handleApprove}
              disabled={processing}
              className="h-[48px] bg-green-600 hover:bg-green-700 text-white"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve & Lock Bill
                </>
              )}
            </Button>
          </div>

          {/* Info Card */}
          <Card className="p-4 bg-neutral-50">
            <p className="text-[12px] text-neutral-600">
              <strong>What happens after approval?</strong>
            </p>
            <ul className="text-[12px] text-neutral-600 mt-2 space-y-1 list-disc list-inside">
              <li>Bill amount will be permanently locked</li>
              <li>Amount will be distributed equally among members</li>
              <li>All members will be notified to complete payment</li>
              <li>Payment tracking will be activated</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Rejection Dialog */}
      <AnimatePresence>
        {showRejectDialog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowRejectDialog(false)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-lg shadow-xl z-50 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-[18px] font-medium text-neutral-900">
                  Reject Bill
                </h3>
              </div>

              <p className="text-[14px] text-neutral-600 mb-4">
                Please provide a reason for rejection. The restaurant will be notified to correct and resubmit.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] text-neutral-600 mb-2">
                    Reason for rejection <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Bill amount is incorrect, image is not clear, wrong restaurant..."
                    className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectDialog(false)}
                    disabled={processing}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={processing || !rejectionReason.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      'Confirm Rejection'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
