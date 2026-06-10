import { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Coffee, AlertCircle, LogOut, Menu, Trash2, ShieldCheck, Check, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { BASE_URL } from '../utils/api';
import AdminCouponManagement from './AdminCouponManagement';
import AdminPaymentHistory from './AdminPaymentHistory';
import EventRevenueDashboard from './EventRevenueDashboard';
interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  // Dynamic States
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeGroups: 0,
    totalFeedbacks: 0,
    approvedCafes: 0,
    pendingCafes: 0,
    totalRevenue: 0,
    totalTickets: 0
  });

  const [cafes, setCafes] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load Admin Data
  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Consolidated Stats
      const statsRes = await fetch(`${BASE_URL}/api/admin/stats`);
      let baseStats = {};
      if (statsRes.ok) {
        baseStats = await statsRes.json();
      }

      // Fetch Revenue Stats
      const revRes = await fetch(`${BASE_URL}/api/payments/revenue-stats`);
      let revStats = {};
      if (revRes.ok) {
        revStats = await revRes.json();
      }

      setStats({
        totalUsers: baseStats.totalUsers || 0,
        activeGroups: baseStats.activeGroups || 0,
        totalFeedbacks: baseStats.totalFeedbacks || 0,
        approvedCafes: baseStats.approvedCafes || 0,
        pendingCafes: baseStats.pendingCafes || 0,
        totalRevenue: revStats.totalRevenue || 0,
        totalTickets: revStats.totalTickets || 0
      });

      // 2. Fetch Users
      const usersRes = await fetch(`${BASE_URL}/api/admin/users`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      // 3. Fetch Active Meetups
      const groupsRes = await fetch(`${BASE_URL}/api/meetup/all`);
      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setGroups(groupsData.meetups || []);
      }

      // 4. Fetch Feedback
      const fbRes = await fetch(`${BASE_URL}/api/feedback`);
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        setFeedbacks(fbData || []);
      }

      // 5. Fetch Pending Cafes
      const cafesRes = await fetch(`${BASE_URL}/api/admin/get/cafe`);
      if (cafesRes.ok) {
        const cafesData = await cafesRes.json();
        setCafes(cafesData || []);
      }
    } catch (error) {
      console.error("Admin dashboard fetch error:", error);
      toast.error("Failed to fetch administrative records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Action: Block/Delete User
  const handleBlockUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user account?")) return;
    try {
      const response = await fetch(`${BASE_URL}/api/admin/users/${userId}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success("User account deleted successfully.");
        fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error("Failed to delete user.");
    }
  };

  // Action: Approve Cafe
  const handleApproveCafe = async (cafeId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/approve-cafe/${cafeId}`, { method: 'PUT' });
      if (response.ok) {
        toast.success("Café approved successfully!");
        fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error("Failed to approve café.");
    }
  };

  // Action: Delete Feedback
  const handleDeleteFeedback = async (fbId: string) => {
    if (!window.confirm("Are you sure you want to delete this feedback comment?")) return;
    try {
      const response = await fetch(`${BASE_URL}/api/admin/feedback/${fbId}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success("Feedback comment deleted.");
        fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error("Failed to delete feedback.");
    }
  };

  // Action: Close Meetup
  const handleCloseMeetup = async (meetupId: string) => {
    if (!window.confirm("Are you sure you want to close/delete this meetup?")) return;
    try {
      const response = await fetch(`${BASE_URL}/api/admin/meetups/${meetupId}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success("Meetup closed successfully.");
        fetchAdminData();
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error("Failed to close meetup.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-slate-900 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <h2 className="text-xl mb-8 font-bold font-sans">Admin Portal</h2>
          <nav className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setActiveTab('stats')}
            >
              Dashboard Overview
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setActiveTab('cafes')}
            >
              <Coffee className="w-4 h-4 mr-2 text-[#be9d80]" />
              Pending Cafés ({cafes.length})
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setActiveTab('groups')}
            >
              <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
              Active Groups ({groups.length})
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setActiveTab('coupons')}
            >
              <Tag className="w-4 h-4 mr-2 text-pink-400" />
              Manage Coupons
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setActiveTab('revenue')}
            >
              <DollarSign className="w-4 h-4 mr-2 text-yellow-400" />
              Event Revenue
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setActiveTab('payments')}
            >
              <DollarSign className="w-4 h-4 mr-2 text-emerald-400" />
              Payment History
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setActiveTab('users')}
            >
              <Users className="w-4 h-4 mr-2 text-green-400" />
              Active Users ({users.length})
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setActiveTab('feedbacks')}
            >
              <AlertCircle className="w-4 h-4 mr-2 text-amber-400" />
              User Feedback ({feedbacks.length})
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-slate-800 mt-8"
              onClick={() => onNavigate('home')}
            >
              <LogOut className="w-4 h-4 mr-2 text-red-400" />
              Exit Admin Dashboard
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold font-sans text-slate-800">Caffélino Administration System</h1>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAdminData} disabled={isLoading}>
            {isLoading ? 'Reloading...' : 'Refresh Records'}
          </Button>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-white border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-bold text-sm uppercase">Total Users</span>
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.totalUsers}</div>
              <p className="text-sm text-green-600 mt-1 font-semibold">Registered in MongoDB</p>
            </Card>

            <Card className="p-6 bg-white border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-bold text-sm uppercase">Active Meetups</span>
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.activeGroups}</div>
              <p className="text-sm text-indigo-600 mt-1 font-semibold">Live Socket rooms</p>
            </Card>

            <Card className="p-6 bg-white border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-bold text-sm uppercase">Feedback Logs</span>
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.totalFeedbacks}</div>
              <p className="text-sm text-amber-600 mt-1 font-semibold">Loved By Users list</p>
            </Card>

            <Card className="p-6 bg-white border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-bold text-sm uppercase">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">₹{stats.totalRevenue}</div>
              <p className="text-sm text-green-600 mt-1 font-semibold">Overall Earnings</p>
            </Card>

            <Card className="p-6 bg-white border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-bold text-sm uppercase">Tickets Sold</span>
                <Tag className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{stats.totalTickets}</div>
              <p className="text-sm text-blue-600 mt-1 font-semibold">Event Registrations</p>
            </Card>

            <Card className="p-6 bg-white border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-bold text-sm uppercase">Cafés Status</span>
                <Coffee className="w-5 h-5 text-amber-700" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {stats.approvedCafes} <span className="text-sm text-slate-400 font-normal">({stats.pendingCafes} pending)</span>
              </div>
              <p className="text-sm text-amber-800 mt-1 font-semibold">Approved Caffélino partners</p>
            </Card>
          </div>

          {/* Active Tab Panel */}
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-150 p-6">
            {activeTab === 'stats' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-sans text-neutral-900 mb-2">Dashboard Instructions</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                  Welcome to the partner control dashboard. As an administrator, you can moderate unapproved café onboarding requests, close/prune stale group codes, moderate community review logs, and view active database metrics synced in real-time. Use the sidebar to inspect specific collections.
                </p>
                <div className="inline-flex gap-2 items-center px-4 py-2 bg-green-50 border border-green-200 text-green-800 font-bold text-xs rounded-full">
                  <ShieldCheck className="size-4" />
                  MongoDB Atlas Connected & Live
                </div>
              </div>
            )}

            {/* Coupons */}
            {activeTab === 'coupons' && (
              <AdminCouponManagement />
            )}

            {/* Revenue */}
            {activeTab === 'revenue' && (
              <EventRevenueDashboard />
            )}

            {/* Payment History */}
            {activeTab === 'payments' && (
              <AdminPaymentHistory />
            )}

            {/* Pending Cafés */}
            {activeTab === 'cafes' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-sans text-slate-800 mb-2">Pending Onboarding Requests ({cafes.length})</h3>
                {cafes.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">No pending café verification requests at this moment.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Café Name</TableHead>
                        <TableHead>Manager Email</TableHead>
                        <TableHead>Locality</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cafes.map((cafe) => (
                        <TableRow key={cafe._id}>
                          <TableCell className="font-semibold">{cafe.cafeName || cafe.Name}</TableCell>
                          <TableCell className="font-mono text-xs">{cafe.email_address_manager || cafe.email}</TableCell>
                          <TableCell>{cafe.city || 'TBD'}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveCafe(cafe._id)}
                              className="bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1.5"
                            >
                              <Check className="size-4" />
                              Approve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}

            {/* Active Groups */}
            {activeTab === 'groups' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-sans text-slate-800 mb-2">Active Meetup Group Codes ({groups.length})</h3>
                {groups.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">No active meetup groups in the database.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group Title</TableHead>
                        <TableHead>Organizer Name</TableHead>
                        <TableHead>Meetup Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groups.map((group) => (
                        <TableRow key={group._id}>
                          <TableCell className="font-semibold">{group.title}</TableCell>
                          <TableCell>{group.organizerName}</TableCell>
                          <TableCell>
                            <span className="font-mono bg-slate-100 border px-2 py-0.5 rounded font-bold text-[#8b5943]">
                              {group.meetupCode}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={group.status === 'active' ? 'secondary' : 'default'} className="capitalize">
                              {group.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleCloseMeetup(group._id)}
                              className="rounded-lg flex items-center gap-1.5"
                            >
                              <Trash2 className="size-4" />
                              Close
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}

            {/* Active Users */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-sans text-slate-800 mb-2">Registered User Accounts ({users.length})</h3>
                {users.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">No user accounts found in MongoDB User collection.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Name</TableHead>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell className="font-semibold">{u.name}</TableCell>
                          <TableCell className="font-mono text-xs text-slate-500">{u.email}</TableCell>
                          <TableCell>{u.mobileNumber || 'N/A'}</TableCell>
                          <TableCell>{u.city || 'N/A'}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleBlockUser(u._id)}
                              className="rounded-lg flex items-center gap-1.5"
                            >
                              <Trash2 className="size-4" />
                              Block User
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}

            {/* User Feedbacks */}
            {activeTab === 'feedbacks' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-sans text-slate-800 mb-2">User Feedback Comments ({feedbacks.length})</h3>
                {feedbacks.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">No feedback records found inside MongoDB Feedback collection.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Name</TableHead>
                        <TableHead>Stars</TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedbacks.map((fb) => (
                        <TableRow key={fb._id}>
                          <TableCell className="font-semibold">{fb.username}</TableCell>
                          <TableCell>
                            <div className="flex gap-0.5">
                              {[...Array(fb.rating)].map((_, i) => (
                                <span key={i} className="text-amber-500">★</span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate italic">"{fb.comment}"</TableCell>
                          <TableCell className="text-xs text-slate-400">
                            {new Date(fb.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteFeedback(fb._id)}
                              className="rounded-lg flex items-center gap-1.5"
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
