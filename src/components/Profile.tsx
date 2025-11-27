import { useState } from 'react';
import Navigation from './Navigation';
import BookingCard from './BookingCard';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User as UserIcon, Mail, Edit2, Save, X } from 'lucide-react';
import { User, Booking } from '../App';
import { toast } from 'sonner@2.0.3';

interface ProfileProps {
  user: User;
  bookings: Booking[];
  onLogout: () => void;
  onUpdateProfile: (name: string) => Promise<void>;
}

export default function Profile({ user, bookings, onLogout, onUpdateProfile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });

  const handleSave = async () => {
    await onUpdateProfile(formData.name);
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ name: user.name, email: user.email });
    setIsEditing(false);
  };

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">Profile</h1>
          <p className="text-slate-600">Manage your account and booking history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-slate-900">User Details</h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white -mt-8 ml-16"></div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      className="flex-1 rounded-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <UserIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-500">Name</p>
                      <p className="text-slate-900">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-500">Email</p>
                      <p className="text-slate-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-slate-500">Account Type</p>
                    <p className="text-slate-900 capitalize">{user.role}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Booking History */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg">
              <h2 className="text-slate-900 mb-6">Booking History</h2>
              
              {sortedBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedBookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500">No bookings yet</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}