import AdminLayout from './AdminLayout';
import { Card } from '../ui/card';
import { Calendar, Users, CheckCircle2, XCircle, TrendingUp, Clock } from 'lucide-react';
import { User, Booking } from '../../App';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  user: User;
  bookings: Booking[];
  users: any[];
  onLogout: () => void;
}

function AdminDashboard({ user, bookings, users, onLogout }: AdminDashboardProps) {
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;
  const upcomingBookings = bookings.filter(b => 
    new Date(b.date) >= new Date() && b.status !== 'Cancelled'
  ).length;

  // Status distribution for pie chart
  const statusData = [
    { name: 'Confirmed', value: confirmedBookings, color: '#10b981' },
    { name: 'Pending', value: pendingBookings, color: '#f59e0b' },
    { name: 'Cancelled', value: cancelledBookings, color: '#ef4444' },
  ];

  // Bookings by service
  const serviceData = Object.entries(
    bookings.reduce((acc, booking) => {
      acc[booking.service] = (acc[booking.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([service, count]) => ({ service, count }));

  // Bookings trend (last 7 days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const trendData = getLast7Days().map(date => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    bookings: bookings.filter(b => b.createdAt === date).length
  }));

  const stats = [
    {
      label: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      label: 'Upcoming',
      value: upcomingBookings,
      icon: Clock,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      label: 'Confirmed',
      value: confirmedBookings,
      icon: CheckCircle2,
      color: 'bg-green-500',
      change: '+15%'
    },
    {
      label: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'bg-orange-500',
      change: '+5%'
    },
  ];

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">Dashboard Overview</h1>
          <p className="text-slate-600">Welcome Back, {user.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-slate-600 mb-1">{stat.label}</p>
                <p className="text-slate-900">{stat.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Booking Trend Chart */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-slate-900 mb-4">Booking Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Status Distribution */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-slate-900 mb-4">Booking Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Service Popularity Chart */}
        <Card className="p-6 shadow-sm">
          <h3 className="text-slate-900 mb-4">Bookings by Services</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="service" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 shadow-sm mt-6">
          <h3 className="text-slate-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-slate-900">{booking.service}</p>
                    <p className="text-slate-500">{new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full ${
                  booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
