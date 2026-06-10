import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { BASE_URL } from '../utils/api';
import { Card } from './ui/card';
import { DollarSign, Ticket } from 'lucide-react';

export default function EventRevenueDashboard() {
  const [stats, setStats] = useState<any>({ eventStats: [], totalRevenue: 0, totalTickets: 0, paymentCount: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/payments/revenue-stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      toast.error('Failed to fetch revenue stats');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-sans text-slate-800">Event Revenue Dashboard</h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm uppercase opacity-80">Total Platform Revenue</span>
            <DollarSign className="w-5 h-5 opacity-80" />
          </div>
          <div className="text-3xl font-extrabold">₹{stats.totalRevenue}</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm uppercase opacity-80">Tickets Sold</span>
            <Ticket className="w-5 h-5 opacity-80" />
          </div>
          <div className="text-3xl font-extrabold">{stats.totalTickets}</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-pink-500 to-rose-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm uppercase opacity-80">Total Payments</span>
            <DollarSign className="w-5 h-5 opacity-80" />
          </div>
          <div className="text-3xl font-extrabold">{stats.paymentCount}</div>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Tickets Sold</TableHead>
              <TableHead>Revenue (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.eventStats?.map((e: any) => (
              <TableRow key={e._id}>
                <TableCell className="font-semibold text-slate-800">{e.eventName}</TableCell>
                <TableCell>{e.ticketsSold || 0}</TableCell>
                <TableCell className="font-bold text-green-600">₹{e.revenue || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {stats.eventStats?.length === 0 && !isLoading && (
          <div className="p-8 text-center text-slate-500">No events found.</div>
        )}
      </div>
    </div>
  );
}
