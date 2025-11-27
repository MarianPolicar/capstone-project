import { useState } from 'react';
import Navigation from './Navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Filter, Download } from 'lucide-react';
import { User, Booking } from '../App';
import { toast } from 'sonner@2.0.3';

interface AdminViewProps {
  user: User;
  bookings: Booking[];
  onLogout: () => void;
  onUpdateStatus: (bookingId: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => void;
}

export default function AdminView({ user, bookings, onLogout, onUpdateStatus }: AdminViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const services = Array.from(new Set(bookings.map(b => b.service)));
  
  const filteredBookings = bookings.filter(booking => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
    if (serviceFilter !== 'all' && booking.service !== serviceFilter) return false;
    if (dateFilter === 'upcoming' && new Date(booking.date) < new Date()) return false;
    if (dateFilter === 'past' && new Date(booking.date) >= new Date()) return false;
    return true;
  });

  const handleStatusChange = (bookingId: string, newStatus: 'Confirmed' | 'Pending' | 'Cancelled') => {
    onUpdateStatus(bookingId, newStatus);
    toast.success('Booking status updated');
  };

  const handleExport = () => {
    toast.success('Exporting bookings data...');
  };

  const statusColors = {
    Confirmed: 'bg-green-100 text-green-700 hover:bg-green-100',
    Pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    Cancelled: 'bg-red-100 text-red-700 hover:bg-red-100'
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Manage all bookings and appointments</p>
          </div>
          <Button onClick={handleExport} className="rounded-full">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-sm">
            <p className="text-slate-600 mb-1">Total Bookings</p>
            <p className="text-slate-900">{bookings.length}</p>
          </Card>
          <Card className="p-6 shadow-sm">
            <p className="text-slate-600 mb-1">Confirmed</p>
            <p className="text-slate-900">{bookings.filter(b => b.status === 'Confirmed').length}</p>
          </Card>
          <Card className="p-6 shadow-sm">
            <p className="text-slate-600 mb-1">Pending</p>
            <p className="text-slate-900">{bookings.filter(b => b.status === 'Pending').length}</p>
          </Card>
          <Card className="p-6 shadow-sm">
            <p className="text-slate-600 mb-1">Cancelled</p>
            <p className="text-slate-900">{bookings.filter(b => b.status === 'Cancelled').length}</p>
          </Card>
        </div>

        <Card className="shadow-lg">
          {/* Filters */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-slate-600" />
              <h2 className="text-slate-900">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-slate-600">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-slate-600">Service</label>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {services.map(service => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-slate-600">Date</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell>#{booking.id}</TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell>{formatDate(booking.date)}</TableCell>
                      <TableCell>{booking.timeSlot}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[booking.status]}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">{formatDate(booking.createdAt)}</TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusChange(booking.id, value as any)}
                        >
                          <SelectTrigger className="w-36 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
