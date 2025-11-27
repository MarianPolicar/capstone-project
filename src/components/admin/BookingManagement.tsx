import { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { CheckCircle2, XCircle, Calendar as CalendarIcon, Search, Filter, Download, Check } from 'lucide-react';
import { User, Booking } from '../../App';
import { toast } from 'sonner@2.0.3';

interface BookingManagementProps {
  user: User;
  bookings: Booking[];
  users: User[];
  onLogout: () => void;
  onUpdateStatus: (bookingId: string, status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed') => Promise<void>;
}

function BookingManagement({ user, bookings, users, onLogout, onUpdateStatus }: BookingManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const services = Array.from(new Set(bookings.map(b => b.service)));

  // Helper function to get user name - MUST be defined before filteredBookings
  const getUserName = (userId: string): string => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.name : 'Unknown User';
  };

  const filteredBookings = bookings.filter(booking => {
    const userName = getUserName(booking.userId);
    const matchesSearch = booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesService = serviceFilter === 'all' || booking.service === serviceFilter;
    
    let matchesDate = true;
    if (dateFilter === 'upcoming') {
      matchesDate = new Date(booking.date) >= new Date();
    } else if (dateFilter === 'past') {
      matchesDate = new Date(booking.date) < new Date();
    }

    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  const handleApprove = async (bookingId: string) => {
    await onUpdateStatus(bookingId, 'Confirmed');
    toast.success('Booking approved successfully');
  };

  const handleCancel = async (bookingId: string) => {
    await onUpdateStatus(bookingId, 'Cancelled');
    toast.success('Booking cancelled');
  };

  const handleDone = async (bookingId: string) => {
    await onUpdateStatus(bookingId, 'Completed');
    toast.success('Booking marked as completed and moved to history');
  };

  const handleExport = () => {
    toast.success('Exporting bookings data...');
  };

  const statusColors = {
    Confirmed: 'bg-green-100 text-green-700 hover:bg-green-100',
    Pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    Cancelled: 'bg-red-100 text-red-700 hover:bg-red-100',
    Completed: 'bg-blue-100 text-blue-700 hover:bg-blue-100'
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-slate-900 mb-2">Booking Management</h1>
            <p className="text-slate-600">Manage all bookings and appointments</p>
          </div>
          <Button onClick={handleExport} className="rounded-lg">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <Card className="shadow-lg mb-6">
          {/* Search and Filters */}
          <div className="p-6 border-b border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search by name, service, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-lg">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
            <p className="text-slate-600">
              Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
            </p>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell>{getUserName(booking.userId)}</TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell>{formatDate(booking.date)}</TableCell>
                      <TableCell>{booking.timeSlot}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[booking.status]}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">{formatDate(booking.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {booking.status === 'Pending' && (
                            <Button
                              size="sm"
                              className="rounded-lg bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(booking.id)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {booking.status === 'Confirmed' && (
                            <Button
                              size="sm"
                              className="rounded-lg bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleDone(booking.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Done
                            </Button>
                          )}
                          {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg text-red-600 hover:bg-red-50"
                              onClick={() => handleCancel(booking.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
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
    </AdminLayout>
  );
}

export default BookingManagement;