import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './components/LoginRegister';
import Dashboard from './components/Dashboard';
import BookingForm from './components/BookingForm';
import Profile from './components/Profile';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import BookingManagement from './components/admin/BookingManagement';
import UserManagement from './components/admin/UserManagement';
import AdminSettings from './components/admin/AdminSettings';
import RescheduleModal from './components/RescheduleModal';
import CancelConfirmDialog from './components/CancelConfirmDialog';
import QRCodeReceipt from './components/QRCodeReceipt';
import VerifyBooking from './components/VerifyBooking';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import * as localStorageUtils from './utils/localStorage';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Booking {
  id: string;
  userId: string;
  service: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  createdAt: string;
  userName?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [bookingToReschedule, setBookingToReschedule] = useState<Booking | null>(null);
  const [bookingForQR, setBookingForQR] = useState<Booking | null>(null);

  useEffect(() => {
    localStorageUtils.initializeLocalStorage();
    
    const savedUser = localStorageUtils.getCurrentUser();
    if (savedUser) {
      console.log('Found saved session in localStorage:', savedUser.email);
      setUser({
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      });
      
      const allBookings = localStorageUtils.getBookings();
      setBookings(allBookings);
      
      if (savedUser.role === 'admin') {
        const allUsers = localStorageUtils.getUsers();
        setUsers(allUsers.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt
        })));
      }
    }
  }, []);

  const handleLogin = async (email: string, password: string, name?: string, isSignup?: boolean) => {
    try {
      console.log('Login attempt:', {email, isSignup});
      
      if (isSignup) {
        const newUser = localStorageUtils.signup(email, password, name || email.split('@')[0]);
        if (!newUser) {
          throw new Error('User already exists');
        }
        
        setUser({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        });
        
        const userBookings = localStorageUtils.getBookingsByUserId(newUser.id);
        setBookings(userBookings);
        
        toast.success('Account created successfully!');
        return;
      }
      
      const localUser = localStorageUtils.login(email, password);
      if (localUser) {
        console.log('Logged in with localStorage:', localUser.email);
        
        setUser({
          id: localUser.id,
          name: localUser.name,
          email: localUser.email,
          role: localUser.role
        });
        
        const allBookings = localStorageUtils.getBookings();
        setBookings(allBookings);
        
        if (localUser.role === 'admin') {
          const allUsers = localStorageUtils.getUsers();
          setUsers(allUsers.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt
          })));
        }
        
        toast.success(`Welcome back, ${localUser.name}!`);
        return;
      }
      
      throw new Error('Invalid email or password');
      
    } catch (error: any) {
      console.error('Login/Signup error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorageUtils.logout();
    setUser(null);
    setBookings([]);
    setUsers([]);
  };

  const addBooking = async (booking: Omit<Booking, 'id' | 'userId' | 'createdAt' | 'status'>) => {
    if (!user) return;

    console.log('Adding booking for user:', user.id, 'Booking:', booking);

    const newBooking = localStorageUtils.createBooking(
      user.id,
      booking.service,
      booking.date,
      booking.timeSlot
    );
    console.log('LocalStorage booking created:', newBooking);
    
    // Create notification for admin
    const notification: localStorageUtils.Notification = {
      id: crypto.randomUUID(),
      type: 'new_booking',
      bookingId: newBooking.id,
      userId: user.id,
      userName: user.name,
      service: booking.service,
      date: booking.date,
      timeSlot: booking.timeSlot,
      message: `New booking from ${user.name} for ${booking.service}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    localStorageUtils.addNotification(notification);
    console.log('Notification created for admin:', notification);
    
    const allBookings = localStorageUtils.getBookings();
    setBookings(allBookings);
    
    toast.success('Booking created successfully!');
  };

  const updateBookingStatus = (bookingId: string, status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed') => {
    localStorageUtils.updateBookingStatus(bookingId, status);
    const allBookings = localStorageUtils.getBookings();
    setBookings(allBookings);
  };

  const handleCancelBooking = (booking: Booking) => {
    localStorageUtils.updateBookingStatus(booking.id, 'Cancelled');
    const allBookings = localStorageUtils.getBookings();
    setBookings(allBookings);
  };

  const handleRescheduleBooking = (bookingId: string, newDate: string, newTimeSlot: string) => {
    localStorageUtils.rescheduleBooking(bookingId, newDate, newTimeSlot);
    const allBookings = localStorageUtils.getBookings();
    setBookings(allBookings);
  };

  const updateUserProfile = (name: string) => {
    if (!user) return;

    localStorageUtils.updateUserProfile(user.id, name);
    setUser({ ...user, name });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : <LoginRegister onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/admin/login" 
            element={
              user?.role === 'admin' ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <>
                  <Dashboard 
                    user={user} 
                    bookings={bookings.filter(b => b.userId === user.id)} 
                    onLogout={handleLogout}
                    onCancelBooking={setBookingToCancel}
                    onRescheduleBooking={setBookingToReschedule}
                    onViewQRCode={setBookingForQR}
                  />
                  {bookingToCancel && (
                    <CancelConfirmDialog
                      booking={bookingToCancel}
                      open={!!bookingToCancel}
                      onClose={() => setBookingToCancel(null)}
                      onConfirm={async () => {
                        await handleCancelBooking(bookingToCancel);
                        setBookingToCancel(null);
                        toast.success('Booking cancelled successfully');
                      }}
                    />
                  )}
                  {bookingToReschedule && (
                    <RescheduleModal
                      booking={bookingToReschedule}
                      open={!!bookingToReschedule}
                      onClose={() => setBookingToReschedule(null)}
                      onReschedule={handleRescheduleBooking}
                    />
                  )}
                  {bookingForQR && user && (
                    <QRCodeReceipt
                      booking={bookingForQR}
                      user={user}
                      open={!!bookingForQR}
                      onClose={() => setBookingForQR(null)}
                    />
                  )}
                </>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/booking" 
            element={
              user ? (
                <BookingForm user={user} onLogout={handleLogout} onAddBooking={addBooking} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/profile" 
            element={
              user ? (
                <Profile 
                  user={user} 
                  bookings={bookings.filter(b => b.userId === user.id)} 
                  onLogout={handleLogout}
                  onUpdateProfile={updateUserProfile}
                />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              user?.role === 'admin' ? (
                <AdminDashboard user={user} bookings={bookings} users={users} onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin/login" />
              )
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              user?.role === 'admin' ? (
                <BookingManagement user={user} bookings={bookings} users={users} onLogout={handleLogout} onUpdateStatus={updateBookingStatus} />
              ) : (
                <Navigate to="/admin/login" />
              )
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              user?.role === 'admin' ? (
                <UserManagement user={user} users={users} onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin/login" />
              )
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              user?.role === 'admin' ? (
                <AdminSettings user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin/login" />
              )
            } 
          />
          <Route 
            path="/admin" 
            element={
              user?.role === 'admin' ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/admin/login" />
              )
            } 
          />
          <Route 
            path="/verify/:bookingId" 
            element={<VerifyBooking bookings={bookings} users={users} />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;