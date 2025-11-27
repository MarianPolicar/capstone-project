import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, XCircle, CalendarClock, QrCode } from 'lucide-react';
import { Booking } from '../App';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (booking: Booking) => void;
  onReschedule?: (booking: Booking) => void;
  onViewQRCode?: (booking: Booking) => void;
  showActions?: boolean;
}

export default function BookingCard({ booking, onCancel, onReschedule, onViewQRCode, showActions }: BookingCardProps) {
  const statusColors = {
    Confirmed: 'bg-green-100 text-green-700 hover:bg-green-100',
    Pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
    Cancelled: 'bg-red-100 text-red-700 hover:bg-red-100',
    Completed: 'bg-blue-100 text-blue-700 hover:bg-blue-100'
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const canCancelOrReschedule = showActions && booking.status !== 'Cancelled' && booking.status !== 'Completed';

  return (
    <Card className="p-6 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-slate-900">{bookings.service}</h3>
        <Badge className={statusColors[booking.status]}>
          {booking.status}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(booking.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4" />
          <span>{booking.timeSlot}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-slate-500">
          Booked on {formatDate(booking.createdAt)}
        </p>
      </div>

      {canCancelOrReschedule && (
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 rounded-lg text-red-600 hover:bg-red-50 border-red-200"
            onClick={() => onCancel && onCancel(booking)}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            size="sm"
            className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700"
            onClick={() => onReschedule && onReschedule(booking)}
          >
            <CalendarClock className="w-4 h-4 mr-2" />
            Reschedule
          </Button>
        </div>
      )}

      {/* QR Code button - always show for non-cancelled bookings */}
      {showActions && booking.status !== 'Cancelled' && onViewQRCode && (
        <div className="mt-4">
          <Button
            size="sm"
            className="w-full rounded-lg bg-gray-700 hover:bg-gray-800"
            onClick={() => onViewQRCode(booking)}
          >
            <QrCode className="w-4 h-4 mr-2" />
            View QR Code Receipt
          </Button>
        </div>
      )}
    </Card>
  );
}
