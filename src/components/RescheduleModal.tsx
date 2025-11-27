import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Booking } from '../App';
import { toast } from 'sonner@2.0.3';
import * as localStorage from '../utils/localStorage';

interface RescheduleModalProps {
  booking: Booking;
  open: boolean;
  onClose: () => void;
  onReschedule: (bookingId: string, newDate: string, newTimeSlot: string) => Promise<void>;
}

export default function RescheduleModal({ booking, open, onClose, onReschedule }: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(booking.date));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(booking.timeSlot);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available time slots from localStorage
  const availableTimeSlots = localStorage.getTimeSlots();

  // Reset form when booking changes
  useEffect(() => {
    setSelectedDate(new Date(booking.date));
    setSelectedTimeSlot(booking.timeSlot);
  }, [booking]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select both date and time');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      await onReschedule(booking.id, formattedDate, selectedTimeSlot);
      toast.success('Booking rescheduled successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to reschedule booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reschedule Booking</DialogTitle>
          <DialogDescription>
            Choose a new date and time for your {booking.service} appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Booking Info */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-600 mb-2">Current Booking:</p>
            <p className="text-slate-900">
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

          {/* New Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">New Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left rounded-lg"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(selectedDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* New Time Slot Selection */}
          <div className="space-y-2">
            <Label htmlFor="timeSlot">New Time Slot</Label>
            <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
              <SelectTrigger className="rounded-lg">
                <Clock className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
