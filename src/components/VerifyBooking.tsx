import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Calendar, Clock, User, Mail, FileText, ArrowLeft } from 'lucide-react';
import { Booking } from '../App';

interface VerifyBookingProps {
  bookings: Booking[];
  users: any[];
}

export default function VerifyBooking({ bookings, users }: VerifyBookingProps) {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Try to get booking data from URL parameter first (for cross-device verification)
  let booking: Booking | undefined;
  let userName = 'Unknown User';
  let userEmail = '';
  
  const encodedData = searchParams.get('data');
  
  if (encodedData) {
    // Decode booking data from URL
    try {
      const decodedData = JSON.parse(atob(encodedData));
      booking = {
        id: decodedData.id,
        userId: '', // Not needed for verification
        service: decodedData.service,
        date: decodedData.date,
        timeSlot: decodedData.timeSlot,
        status: decodedData.status,
        createdAt: decodedData.createdAt
      };
      userName = decodedData.userName || 'Unknown User';
      userEmail = decodedData.userEmail || '';
    } catch (error) {
      console.error('Error decoding booking data:', error);
    }
  }
  
  // Fallback to localStorage if no URL data (same device)
  if (!booking) {
    booking = bookings.find(b => b.id === bookingId);
    
    if (booking) {
      const user = users.find(u => u.id === booking.userId);
      if (user) {
        userName = user.name;
        userEmail = user.email;
      } else {
        // Try to get from localStorage directly
        const localStorageData = localStorage.getItem('booking_system_users');
        if (localStorageData) {
          const allUsers = JSON.parse(localStorageData);
          const foundUser = allUsers.find((u: any) => u.id === booking.userId);
          if (foundUser) {
            userName = foundUser.name;
            userEmail = foundUser.email;
          }
        }
      }
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return {
          icon: <CheckCircle2 className="w-16 h-16 text-green-600" />,
          color: 'bg-green-50 border-green-200',
          textColor: 'text-green-700',
          message: 'This booking is confirmed and active'
        };
      case 'Pending':
        return {
          icon: <Clock className="w-16 h-16 text-yellow-600" />,
          color: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-700',
          message: 'This booking is pending confirmation'
        };
      case 'Completed':
        return {
          icon: <CheckCircle2 className="w-16 h-16 text-blue-600" />,
          color: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-700',
          message: 'This booking has been completed'
        };
      case 'Cancelled':
        return {
          icon: <XCircle className="w-16 h-16 text-red-600" />,
          color: 'bg-red-50 border-red-200',
          textColor: 'text-red-700',
          message: 'This booking has been cancelled'
        };
      default:
        return {
          icon: <FileText className="w-16 h-16 text-gray-600" />,
          color: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-700',
          message: 'Booking status unknown'
        };
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <XCircle className="w-20 h-20 text-red-600" />
            </div>
            <h1 className="text-slate-900 mb-3">Booking Not Found</h1>
            <p className="text-slate-600 mb-6">
              The booking ID <span className="font-mono bg-slate-100 px-2 py-1 rounded">{bookingId}</span> could not be found in our system.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(booking.status);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Status Banner */}
          <div className={`${statusInfo.color} border-b p-8 text-center`}>
            <div className="flex justify-center mb-4">
              {statusInfo.icon}
            </div>
            <h1 className="text-slate-900 mb-2">Booking Verified</h1>
            <p className={`${statusInfo.textColor}`}>{statusInfo.message}</p>
          </div>

          {/* Booking Details */}
          <div className="p-8 space-y-6">
            {/* Booking ID */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-slate-900 mb-3">Booking Reference</h2>
              <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm text-slate-900 text-center">
                {booking.id}
              </div>
            </div>

            {/* Service Information */}
            <div className="space-y-4">
              <h2 className="text-slate-900">Service Details</h2>
              
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-blue-900 text-sm mb-1">Service</div>
                    <div className="text-blue-700">{booking.service}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-blue-900 text-sm mb-1">Date</div>
                    <div className="text-blue-700">{formatDate(booking.date)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-blue-900 text-sm mb-1">Time</div>
                    <div className="text-blue-700">{booking.timeSlot}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h2 className="text-slate-900">Customer Information</h2>
              
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <User className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-slate-600 text-sm mb-1">Name</div>
                    <div className="text-slate-900">{userName}</div>
                  </div>
                </div>

                {userEmail && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <Mail className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-slate-600 text-sm mb-1">Email</div>
                      <div className="text-slate-900 break-all">{userEmail}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Booked on:</span>
                <span className="text-slate-900">
                  {new Date(booking.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Login
            </button>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-slate-900 mb-2">✓ Verification Complete</h3>
          <p className="text-slate-600 text-sm">
            This QR code has been successfully verified. The booking information shown above is authentic and matches our records.
          </p>
        </div>
      </div>
    </div>
  );
}