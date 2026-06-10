import { useState } from 'react';
import { Users, Calendar, DollarSign, Coffee, AlertCircle, LogOut, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const MOCK_STATS = {
  totalUsers: 0,
  activeGroups: 0,
  ordersToday: 0,
  revenueToday: 0,
  commission: 0
};

const MOCK_CAFES: any[] = [];
const MOCK_GROUPS: any[] = [];
const MOCK_ORDERS: any[] = [];
const MOCK_USERS: any[] = [];
const MOCK_REPORTS: any[] = [];

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-slate-900 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <h2 className="text-xl mb-8">Admin Dashboard</h2>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
              <Coffee className="w-4 h-4 mr-2" />
              Cafés
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
              <Calendar className="w-4 h-4 mr-2" />
              Groups
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
              <DollarSign className="w-4 h-4 mr-2" />
              Payments
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
              <Users className="w-4 h-4 mr-2" />
              Users
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800">
              <AlertCircle className="w-4 h-4 mr-2" />
              Reports
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-slate-800 mt-8"
              onClick={() => onNavigate('home')}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Exit Admin
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl">Welcome, Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Notifications
            </Button>
            <Button variant="ghost" size="sm">
              Settings
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600">Total Users</span>
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl">{MOCK_STATS.totalUsers}</div>
              <p className="text-sm text-green-600 mt-1">+12% this month</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600">Active Groups</span>
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl">{MOCK_STATS.activeGroups}</div>
              <p className="text-sm text-green-600 mt-1">+8% this week</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600">Orders Today</span>
                <Coffee className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl">{MOCK_STATS.ordersToday}</div>
              <p className="text-sm text-green-600 mt-1">+15% vs yesterday</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600">Revenue Today</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl">₹{MOCK_STATS.revenueToday}</div>
              <p className="text-sm text-green-600 mt-1">+20% vs yesterday</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600">Commission</span>
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl">₹{MOCK_STATS.commission}</div>
              <p className="text-sm text-slate-600 mt-1">5% platform fee</p>
            </Card>
          </div>

          {/* Tables */}
          <Tabs defaultValue="cafes" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="cafes">Cafés</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            {/* Cafés */}
            <TabsContent value="cafes">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Café Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_CAFES.map((cafe) => (
                      <TableRow key={cafe.id}>
                        <TableCell>{cafe.name}</TableCell>
                        <TableCell>{cafe.location}</TableCell>
                        <TableCell>{cafe.rating} ⭐</TableCell>
                        <TableCell>{cafe.orders}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="outline">View</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Groups */}
            <TabsContent value="groups">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Group Name</TableHead>
                      <TableHead>Café</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_GROUPS.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell>{group.name}</TableCell>
                        <TableCell>{group.cafe}</TableCell>
                        <TableCell>{group.members}</TableCell>
                        <TableCell>
                          <Badge variant={group.status === 'active' ? 'secondary' : 'default'}>
                            {group.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Close</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_ORDERS.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.group}</TableCell>
                        <TableCell>₹{order.amount}</TableCell>
                        <TableCell>₹{order.commission}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'paid' ? 'secondary' : 'default'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.method}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Refund</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Users */}
            <TabsContent value="users">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Groups Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_USERS.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.age}</TableCell>
                        <TableCell>{user.city}</TableCell>
                        <TableCell>{user.groups}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Block</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Reports */}
            <TabsContent value="reports">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_REPORTS.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.user}</TableCell>
                        <TableCell>{report.issue}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Badge variant={report.status === 'resolved' ? 'secondary' : 'default'}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Resolve</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
