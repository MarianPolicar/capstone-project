import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Booking } from '../App';

interface CancelConfirmDialogProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelConfirmDialog({ booking, open, onClose, onConfirm }: CancelConfirmDialogProps) {
  if (!booking) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-slate-900 mb-1">
            <strong>{booking.service}</strong>
          </p>
          <p className="text-slate-600">
            {new Date(booking.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} at {booking.timeSlot}
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-lg">Keep Booking</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="rounded-lg bg-red-600 hover:bg-red-700"
          >
            Yes, Cancel Booking
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
