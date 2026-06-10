import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, FileText, AlertCircle, Receipt, ArrowLeft, Edit2, Check, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { safeStorage } from '../utils/safeStorage';

interface PendingBill {
  orderNumber: string;
  cafeName: string;
  cafeId: string;
  totalAmount: number;
  submittedAt: string;
  groupName: string;
  items: any[];
  paymentBreakdown: any;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

export default function AdminBillVerification({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [pendingBills, setPendingBills] = useState<PendingBill[]>([]);
  const [selectedBill, setSelectedBill] = useState<PendingBill | null>(null);
  const [editedAmount, setEditedAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadPendingBills();
    const interval = setInterval(loadPendingBills, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadPendingBills = () => {
    const bills = JSON.parse(safeStorage.getItem('pendingBills') || '[]');
    const pending = bills.filter((bill: PendingBill) => bill.verificationStatus === 'pending');
    setPendingBills(pending);
  };

  const handleViewBill = (bill: PendingBill) => {
    setSelectedBill(bill);
    setEditedAmount(bill.totalAmount.toString());
    setIsEditing(false);
  };

  const handleApproveBill = () => {
    if (!selectedBill) return;

    const finalAmount = parseFloat(editedAmount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Update pending bills
    const bills = JSON.parse(safeStorage.getItem('pendingBills') || '[]');
    const updatedBills = bills.map((bill: PendingBill) =>
      bill.orderNumber === selectedBill.orderNumber
        ? { ...bill, verificationStatus: 'approved', approvedAmount: finalAmount }
        : bill
    );
    safeStorage.setItem('pendingBills', JSON.stringify(updatedBills));

    // Update cafe order status
    const orders = JSON.parse(safeStorage.getItem('cafeOrders') || '[]');
    const updatedOrders = orders.map((order: any) =>
      order.orderNumber === selectedBill.orderNumber
        ? { 
            ...order, 
            billVerified: true, 
            verifiedAmount: finalAmount,
            billVerificationStatus: 'approved' 
          }
        : order
    );
    safeStorage.setItem('cafeOrders', JSON.stringify(updatedOrders));

    toast.success('Bill approved successfully! ✅');
    setSelectedBill(null);
    loadPendingBills();
  };

  const handleRejectBill = () => {
    if (!selectedBill) return;

    if (!confirm('Are you sure you want to reject this bill? The cafe will be notified to re-upload.')) {
      return;
    }

    // Update pending bills
    const bills = JSON.parse(safeStorage.getItem('pendingBills') || '[]');
    const updatedBills = bills.map((bill: PendingBill) =>
      bill.orderNumber === selectedBill.orderNumber
        ? { ...bill, verificationStatus: 'rejected' }
        : bill
    );
    safeStorage.setItem('pendingBills', JSON.stringify(updatedBills));

    // Update cafe order
    const orders = JSON.parse(safeStorage.getItem('cafeOrders') || '[]');
    const updatedOrders = orders.map((order: any) =>
      order.orderNumber === selectedBill.orderNumber
        ? { 
            ...order, 
            billVerified: false, 
            billVerificationStatus: 'rejected',
            status: 'ready' // Reset to ready for re-upload
          }
        : order
    );
    safeStorage.setItem('cafeOrders', JSON.stringify(updatedOrders));

    toast.error('Bill rejected. Cafe owner will be notified.');
    setSelectedBill(null);
    loadPendingBills();
  };

  if (selectedBill) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="sticky top-0 bg-[#be9d80] text-white px-4 py-3 border-b border-[#a88968]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedBill(null)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h2 className="text-white">Verify Bill</h2>
              <p className="text-sm text-white/80">{selectedBill.orderNumber}</p>
            </div>
          </div>
        </div>

        <div className="p-4 max-w-2xl mx-auto space-y-4">
          {/* Order Info */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="text-blue-900 mb-2">Order Information</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Group:</span>
                <span className="text-blue-900">{selectedBill.groupName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Cafe:</span>
                <span className="text-blue-900">{selectedBill.cafeName}</span>
              </div>
            </div>
          </Card>

          {/* Bill Amount */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900">Bill Amount</h3>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  <Edit2 className="size-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label>Total Amount (₹)</Label>
                  <Input
                    type="number"
                    value={editedAmount}
                    onChange={(e) => setEditedAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedAmount(selectedBill.totalAmount.toString());
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-3xl text-green-900">₹{editedAmount}</div>
                  <div className="text-sm text-green-700 mt-1">Final Bill Amount</div>
                </div>
              </div>
            )}

            {/* Extracted Data */}
            <div className="pt-3 border-t border-slate-200 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Submitted:</span>
                <span className="text-slate-900">
                  {new Date(selectedBill.submittedAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleApproveBill}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="size-4 mr-2" />
              Approve Bill
            </Button>
            <Button
              onClick={handleRejectBill}
              variant="destructive"
              className="flex-1"
            >
              <X className="size-4 mr-2" />
              Reject
            </Button>
          </div>

          <div className="text-xs text-slate-500 text-center">
            Once approved, the bill amount will be locked and forwarded to members for payment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 bg-[#be9d80] text-white px-4 py-3 border-b border-[#a88968]">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h2 className="text-white">Bill Verification</h2>
            <p className="text-sm text-white/80">Review and approve cafe bills</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-4">
        {/* Stats */}
        <Card className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Pending Verification</div>
              <div className="text-3xl mt-1">{pendingBills.length}</div>
            </div>
            <FileText className="size-12 opacity-20" />
          </div>
        </Card>

        {/* Pending Bills List */}
        {pendingBills.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="bg-slate-100 size-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="size-8 text-slate-400" />
            </div>
            <h3 className="text-slate-900 mb-2">All Caught Up!</h3>
            <p className="text-sm text-slate-600">
              No bills pending verification at the moment
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingBills.map((bill) => (
              <Card key={bill.orderNumber} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-[#8b5943] text-white">
                        {bill.orderNumber}
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Pending Review
                      </Badge>
                    </div>
                    <h4 className="text-slate-900">{bill.groupName}</h4>
                    <p className="text-sm text-slate-600">{bill.cafeName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl text-slate-900">₹{bill.totalAmount}</div>
                    <div className="text-xs text-slate-500">Bill Amount</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                    <span className="text-slate-500">Cafe:</span> {bill.cafeName}
                  </div>
                  <Button
                    onClick={() => handleViewBill(bill)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Verify Bill →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
