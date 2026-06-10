import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { BASE_URL } from '../utils/api';

export default function AdminPaymentHistory() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/payments/history`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      toast.error('Failed to fetch payment history');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-sans text-slate-800">Payment History</h3>
        <span className="text-sm text-slate-500">{payments.length} Records</span>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Event Name</TableHead>
              <TableHead>Amount (₹)</TableHead>
              <TableHead>Razorpay ID</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{new Date(p.date).toLocaleString()}</TableCell>
                <TableCell className="font-semibold">{p.userName}</TableCell>
                <TableCell>{p.eventName}</TableCell>
                <TableCell className="font-bold text-green-600">₹{p.amount}</TableCell>
                <TableCell className="text-xs text-slate-500 font-mono">{p.razorpayPaymentId}</TableCell>
                <TableCell>
                  <Badge variant={p.status === 'captured' ? 'default' : p.status === 'failed' ? 'destructive' : 'secondary'}>
                    {p.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {payments.length === 0 && !isLoading && (
          <div className="p-8 text-center text-slate-500">No payment records found.</div>
        )}
      </div>
    </div>
  );
}
