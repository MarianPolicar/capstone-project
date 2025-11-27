import Navigation from './Navigation';
import BookingCard from './BookingCard';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User, Booking } from '../App';

interface DashboardProps {
  user: User;
  bookings: Booking[];
  onLogout: () => void;
  onCancelBooking?: (booking: Booking) => void;
  onRescheduleBooking?: (booking: Booking) => void;
  onViewQRCode?: (booking: Booking) => void;
}

export default function Dashboard({ user, bookings, onLogout, onCancelBooking, onRescheduleBooking, onViewQRCode }: DashboardProps) {
  // Get today's date at midnight for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date + 'T00:00:00'); // Force midnight in local timezone
    return bookingDate >= today && b.status !== 'Cancelled' && b.status !== 'Completed';
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-slate-600">Manage your bookings and schedule</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 mb-1">Confirmed</p>
                <p className="text-slate-900">{confirmedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 mb-1">Pending</p>
                <p className="text-slate-900">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 mb-1">Cancelled</p>
                <p className="text-slate-900">{cancelledCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-slate-900 mb-1">Upcoming Bookings</h2>
            <p className="text-slate-600">Your scheduled appointments</p>
          </div>
          <Link to="/booking">
            <Button className="rounded-full">
              <Calendar className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </Link>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onCancel={onCancelBooking}
                onReschedule={onRescheduleBooking}
                onViewQRCode={onViewQRCode}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center shadow-sm">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-slate-900 mb-2">No upcoming bookings</h3>
            <p className="text-slate-600 mb-6">Start by creating your first booking</p>
            <Link to="/booking">
              <Button className="rounded-full">
                <Calendar className="w-4 h-4 mr-2" />
                Create Booking
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}