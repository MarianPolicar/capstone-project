import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Briefcase, Clock, Plus, X, Save } from 'lucide-react';
import { User } from '../../App';
import { toast } from 'sonner@2.0.3';
import * as localStorage from '../../utils/localStorage';

interface AdminSettingsProps {
  user: User;
  onLogout: () => void;
}

function AdminSettings({ user, onLogout }: AdminSettingsProps) {
  const [services, setServices] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');

  const [systemSettings, setSystemSettings] = useState({
    bookingWindow: '30',
    maxBookingsPerDay: '10',
    autoApproval: false,
    emailNotifications: true
  });

  // Load services and time slots from localStorage on mount
  useEffect(() => {
    const savedServices = localStorage.getServices();
    const savedTimeSlots = localStorage.getTimeSlots();
    setServices(savedServices);
    setTimeSlots(savedTimeSlots);
  }, []);

  const handleAddService = () => {
    if (newService.trim()) {
      const updatedServices = localStorage.addService(newService.trim());
      setServices(updatedServices);
      setNewService('');
      toast.success('Service added successfully');
    }
  };

  const handleRemoveService = (service: string) => {
    const updatedServices = localStorage.removeService(service);
    setServices(updatedServices);
    toast.success('Service removed');
  };

  const handleAddTimeSlot = () => {
    if (newTimeSlot.trim()) {
      const updatedTimeSlots = localStorage.addTimeSlot(newTimeSlot.trim());
      setTimeSlots(updatedTimeSlots);
      setNewTimeSlot('');
      toast.success('Time slot added successfully');
    }
  };

  const handleRemoveTimeSlot = (slot: string) => {
    const updatedTimeSlots = localStorage.removeTimeSlot(slot);
    setTimeSlots(updatedTimeSlots);
    toast.success('Time slot removed');
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">System Settings</h1>
          <p className="text-slate-600">Configure services, time slots, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Services Management */}
          <Card className="p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-slate-900">Services Offered</h2>
                <p className="text-slate-600">Manage available booking services</p>
              </div>
            </div>

            <div className="space-y-4 mb-4">
              {services.map((service) => (
                <div key={service} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-900">{service}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-lg text-red-600 hover:bg-red-50"
                    onClick={() => handleRemoveService(service)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="New service name..."
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
                className="rounded-lg"
              />
              <Button onClick={handleAddService} className="rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </Card>

          {/* Time Slots Management */}
          <Card className="p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-slate-900">Available Time Slots</h2>
                <p className="text-slate-600">Configure booking time slots</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {timeSlots.map((slot) => (
                <div key={slot} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-900">{slot}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-lg text-red-600 hover:bg-red-50 h-auto p-1"
                    onClick={() => handleRemoveTimeSlot(slot)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="e.g., 6:00 PM"
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTimeSlot()}
                className="rounded-lg"
              />
              <Button onClick={handleAddTimeSlot} className="rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </Card>
        </div>

        {/* System Preferences */}
        <Card className="p-6 shadow-lg">
          <h2 className="text-slate-900 mb-6">System Preferences</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bookingWindow">Booking Window (days ahead)</Label>
              <Input
                id="bookingWindow"
                type="number"
                value={systemSettings.bookingWindow}
                onChange={(e) => setSystemSettings({ ...systemSettings, bookingWindow: e.target.value })}
                className="rounded-lg"
              />
              <p className="text-slate-500">How far in advance users can book</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxBookings">Max Bookings Per Day</Label>
              <Input
                id="maxBookings"
                type="number"
                value={systemSettings.maxBookingsPerDay}
                onChange={(e) => setSystemSettings({ ...systemSettings, maxBookingsPerDay: e.target.value })}
                className="rounded-lg"
              />
              <p className="text-slate-500">Maximum daily booking capacity</p>
            </div>

            <div className="space-y-2">
              <Label>Auto-Approval</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant={systemSettings.autoApproval ? 'default' : 'outline'}
                  className="rounded-lg"
                  onClick={() => setSystemSettings({ ...systemSettings, autoApproval: !systemSettings.autoApproval })}
                >
                  {systemSettings.autoApproval ? 'Enabled' : 'Disabled'}
                </Button>
                <p className="text-slate-500">Automatically approve new bookings</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Notifications</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant={systemSettings.emailNotifications ? 'default' : 'outline'}
                  className="rounded-lg"
                  onClick={() => setSystemSettings({ ...systemSettings, emailNotifications: !systemSettings.emailNotifications })}
                >
                  {systemSettings.emailNotifications ? 'Enabled' : 'Disabled'}
                </Button>
                <p className="text-slate-500">Send email confirmations</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <Button onClick={handleSaveSettings} className="rounded-lg px-8">
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;