import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { CheckCircle2, Calendar as CalendarIcon, Clock, Briefcase } from 'lucide-react';
import { User, Booking } from '../App';
import { toast } from 'sonner@2.0.3';
import * as localStorage from '../utils/localStorage';

interface BookingFormProps {
  user: User;
  onLogout: () => void;
  onAddBooking: (booking: Omit<Booking, 'id' | 'userId' | 'createdAt' | 'status'>) => Promise<void>;
}

export default function BookingForm({ user, onLogout, onAddBooking }: BookingFormProps) {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [service, setService] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load services and time slots from localStorage
  const [services, setServices] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    const savedServices = localStorage.getServices();
    const savedTimeSlots = localStorage.getTimeSlots();
    setServices(savedServices);
    setTimeSlots(savedTimeSlots);
  }, []);

  const handleSubmit = async () => {
    if (!service || !date || !timeSlot) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    console.log('BookingForm: Starting booking submission...', { service, date: date.toISOString().split('T')[0], timeSlot });

    try {
      await onAddBooking({
        service,
        date: date.toISOString().split('T')[0],
        timeSlot
      });

      console.log('BookingForm: Booking created successfully!');
      toast.success('Booking created successfully!');
      
      // Reset form
      setService('');
      setDate(undefined);
      setTimeSlot('');
      setIsSubmitting(false);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('BookingForm: Failed to create booking:', error);
      console.error('BookingForm: Error details:', error.message, error.stack);
      
      // Check if it's a server connectivity error
      if (error.message && error.message.includes('Cannot connect to server')) {
        toast.error('Server is offline. Please login with a local account to create bookings.', {
          duration: 7000,
        });
      } else {
        toast.error(`Failed to create booking: ${error.message || 'Please try again.'}`, {
          duration: 5000,
        });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation user={user} onLogout={onLogout} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">Create New Booking</h1>
          <p className="text-slate-600">Schedule your appointment</p>
        </div>

        <Card className="p-8 shadow-lg">
          <div className="space-y-8">
            {/* Service Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Select Service
              </Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Select Date
              </Label>
              <div className="flex justify-center p-4 bg-slate-50 rounded-lg">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border"
                />
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time Slot
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {timeSlots.map(slot => (
                  <Button
                    key={slot}
                    type="button"
                    variant={timeSlot === slot ? 'default' : 'outline'}
                    className="rounded-lg"
                    onClick={() => setTimeSlot(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>

            {/* Booking Summary */}
            {(service || date || timeSlot) && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="text-slate-900 mb-4">Booking Summary</h3>
                <div className="space-y-2 text-slate-700">
                  {service && <p><strong>Service:</strong> {service}</p>}
                  {date && (
                    <p>
                      <strong>Date:</strong>{' '}
                      {date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                  {timeSlot && <p><strong>Time:</strong> {timeSlot}</p>}
                </div>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                onClick={handleSubmit}
                className="flex-1 rounded-full py-6"
                disabled={!date || !service || !timeSlot || isSubmitting}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Creating...' : 'Confirm Booking'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-8"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}