import { useEffect, useRef } from 'react';
import { X, Download, QrCode } from 'lucide-react';
import { Booking, User } from '../App';
import QRCode from 'qrcode';

interface QRCodeReceiptProps {
  booking: Booking;
  user: User;
  open: boolean;
  onClose: () => void;
}

export default function QRCodeReceipt({ booking, user, open, onClose }: QRCodeReceiptProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (open && canvasRef.current) {
      // Encode booking data in URL so it can be verified on any device
      const bookingData = {
        id: booking.id,
        service: booking.service,
        date: booking.date,
        timeSlot: booking.timeSlot,
        status: booking.status,
        userName: user.name,
        userEmail: user.email,
        createdAt: booking.createdAt
      };
      
      // Encode as base64 for compact URL
      const encodedData = btoa(JSON.stringify(bookingData));
      const verificationUrl = `${window.location.origin}/verify/${booking.id}?data=${encodedData}`;
      
      QRCode.toCanvas(canvasRef.current, verificationUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff',
        },
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [open, booking, user]);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    // Convert canvas to image and download
    const link = document.createElement('a');
    link.download = `booking-${booking.id}-qr-code.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      case 'Completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-slate-900">QR Code Receipts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* QR Code */}
          <div className="bg-slate-50 rounded-lg p-6 flex flex-col items-center">
            <canvas ref={canvasRef} className="mb-4"></canvas>
            <p className="text-slate-600 text-center text-sm">
              Scan this QR code to verify booking details
            </p>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-slate-900 mb-3">Booking Information</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Booking ID:</span>
                  <span className="text-slate-900">{booking.id.substring(0, 8)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Service:</span>
                  <span className="text-slate-900">{booking.service}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="text-slate-900">{formatDate(booking.date)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Time:</span>
                  <span className="text-slate-900">{booking.timeSlot}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-slate-900 mb-3">Customer Information</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Name:</span>
                  <span className="text-slate-900">{user.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="text-slate-900 text-sm">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download QR Code
          </button>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>✓ Works on Any Device:</strong> This QR code contains all your booking information encoded within it. 
              Scan it with any device to instantly verify your booking details - no login required!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
