import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, DollarSign, Eye, Check, MessageSquare, Filter, Search } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import CoffeeLoader from './CoffeeLoader';

interface Booking {
  id: string;
  date: string;
  groupName: string;
  people: number;
  time: string;
  payment: number;
  status: 'paid' | 'pending' | 'completed';
  orderedItems?: string[];
  contactPerson?: string;
  contactPhone?: string;
}

const MOCK_BOOKINGS: Booking[] = [];

export default function CafeBookingsPage() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading effect
  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      // Simulate fetching bookings data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    
    loadBookings();
  }, []);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const handleMarkCompleted = (bookingId: string) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'completed' as const } : b
    ));
    toast.success('Booking marked as completed!');
    setShowDetailsDialog(false);
  };

  const handleMarkPaid = (bookingId: string) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'paid' as const } : b
    ));
    toast.success('Payment marked as received!');
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = booking.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    paid: bookings.filter(b => b.status === 'paid').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  if (isLoading) {
    return <CoffeeLoader message="Loading bookings..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] leading-[36px] text-neutral-950 mb-2">📅 Bookings Management</h1>
        <p className="text-[14px] text-slate-600">Manage and track all your cafe bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-[12px] text-slate-600 mb-1">Total Bookings</p>
          <p className="text-[24px] leading-[32px] text-neutral-950">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12px] text-slate-600 mb-1">Paid</p>
          <p className="text-[24px] leading-[32px] text-green-600">{stats.paid}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12px] text-slate-600 mb-1">Pending</p>
          <p className="text-[24px] leading-[32px] text-amber-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[12px] text-slate-600 mb-1">Completed</p>
          <p className="text-[24px] leading-[32px] text-blue-600">{stats.completed}</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by group name or contact person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 border-0"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'paid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('paid')}
            >
              Paid
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </Button>
          </div>
        </div>
      </Card>

      {/* Bookings Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Group Name</TableHead>
              <TableHead>People</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="text-[14px]">{booking.date}</TableCell>
                <TableCell className="text-[14px]">{booking.groupName}</TableCell>
                <TableCell className="text-[14px]">
                  <div className="flex items-center gap-1">
                    <Users className="size-4 text-slate-400" />
                    {booking.people}
                  </div>
                </TableCell>
                <TableCell className="text-[14px]">
                  <div className="flex items-center gap-1">
                    <Clock className="size-4 text-slate-400" />
                    {booking.time}
                  </div>
                </TableCell>
                <TableCell className="text-[14px]">₹{booking.payment}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.status === 'paid' ? 'default' :
                      booking.status === 'pending' ? 'secondary' :
                      'outline'
                    }
                    className={
                      booking.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' :
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                      'bg-blue-100 text-blue-700 border-blue-200'
                    }
                  >
                    {booking.status === 'paid' ? '✅ Paid' :
                     booking.status === 'pending' ? '⏳ Pending' :
                     '✓ Completed'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <Eye className="size-4" />
                    </Button>
                    {booking.status !== 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkCompleted(booking.id)}
                      >
                        <Check className="size-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="size-16 text-slate-300 mx-auto mb-4" />
            <p className="text-[14px] text-slate-600">No bookings found</p>
          </div>
        )}
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about this booking
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Group Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] text-slate-600 mb-1">Group Name</p>
                  <p className="text-[16px] text-neutral-950">{selectedBooking.groupName}</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-600 mb-1">Contact Person</p>
                  <p className="text-[16px] text-neutral-950">{selectedBooking.contactPerson}</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-600 mb-1">Phone</p>
                  <p className="text-[16px] text-neutral-950">{selectedBooking.contactPhone}</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-600 mb-1">Number of People</p>
                  <p className="text-[16px] text-neutral-950">{selectedBooking.people} people</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-600 mb-1">Date & Time</p>
                  <p className="text-[16px] text-neutral-950">{selectedBooking.date} at {selectedBooking.time}</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-600 mb-1">Payment Amount</p>
                  <p className="text-[20px] leading-[28px] text-green-600">₹{selectedBooking.payment}</p>
                </div>
              </div>

              {/* Ordered Items */}
              <div>
                <p className="text-[14px] text-neutral-950 mb-3">Ordered Items:</p>
                <div className="bg-slate-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedBooking.orderedItems?.map((item, index) => (
                      <li key={index} className="text-[14px] text-slate-700">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <p className="text-[14px] text-slate-600">Status:</p>
                <Badge
                  variant={selectedBooking.status === 'paid' ? 'default' : 'secondary'}
                  className={
                    selectedBooking.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' :
                    selectedBooking.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-blue-100 text-blue-700 border-blue-200'
                  }
                >
                  {selectedBooking.status === 'paid' ? '✅ Paid' :
                   selectedBooking.status === 'pending' ? '⏳ Pending' :
                   '✓ Completed'}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedBooking.status === 'pending' && (
                  <Button
                    onClick={() => handleMarkPaid(selectedBooking.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <DollarSign className="size-4 mr-2" />
                    Mark as Paid
                  </Button>
                )}
                {selectedBooking.status !== 'completed' && (
                  <Button
                    onClick={() => handleMarkCompleted(selectedBooking.id)}
                    className="flex-1"
                  >
                    <Check className="size-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => toast.success('Chat feature coming soon!')}
                >
                  <MessageSquare className="size-4 mr-2" />
                  Chat with Manager
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
