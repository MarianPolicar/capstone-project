// Local storage utilities for offline mode

export interface LocalUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface LocalBooking {
  id: string;
  userId: string;
  service: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  createdAt: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export interface Notification {
  id: string;
  type: 'new_booking' | 'booking_update' | 'booking_cancelled';
  bookingId: string;
  userId: string;
  userName: string;
  service: string;
  date: string;
  timeSlot: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const USERS_KEY = 'booking_system_users';
const BOOKINGS_KEY = 'booking_system_bookings';
const CURRENT_USER_KEY = 'booking_system_current_user';
const SERVICES_KEY = 'booking_system_services';
const TIME_SLOTS_KEY = 'booking_system_time_slots';
const NOTIFICATIONS_KEY = 'booking_system_notifications';

// Initialize with demo data
export function initializeLocalStorage() {
  if (!localStorage.getItem(USERS_KEY)) {
    const demoUsers: LocalUser[] = [
      {
        id: '1',
        email: 'demo@user.com',
        password: 'demo123',
        name: 'Demo User',
        role: 'user',
        createdAt: '2025-11-01'
      },
      {
        id: '2',
        email: 'roger@gmail.com',
        password: 'gerger1',
        name: 'Roger',
        role: 'admin',
        createdAt: '2025-10-15'
      },
      {
        id: '3',
        email: 'val@gmail.com',
        password: 'gerger1',
        name: 'Val',
        role: 'admin',
        createdAt: '2025-10-16'
      },
      {
        id: '4',
        email: 'marian@gmail.com',
        password: 'gerger1',
        name: 'Marian',
        role: 'admin',
        createdAt: '2025-10-17'
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  }

  if (!localStorage.getItem(BOOKINGS_KEY)) {
    const demoBookings: LocalBooking[] = [
      {
        id: '1',
        userId: '1',
        service: 'Consultation',
        date: '2025-11-28',
        timeSlot: '10:00 AM',
        status: 'Confirmed',
        createdAt: '2025-11-20'
      },
      {
        id: '2',
        userId: '1',
        service: 'Design Review',
        date: '2025-12-02',
        timeSlot: '2:00 PM',
        status: 'Pending',
        createdAt: '2025-11-22'
      },
      {
        id: '3',
        userId: '2',
        service: 'Strategy Session',
        date: '2025-11-25',
        timeSlot: '11:00 AM',
        status: 'Confirmed',
        createdAt: '2025-11-19'
      }
    ];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(demoBookings));
  }

  if (!localStorage.getItem(SERVICES_KEY)) {
    const defaultServices = [
      'Consultation',
      'Design Review',
      'Strategy Session',
      'Technical Support',
      'Training Session',
      'Project Planning'
    ];
    localStorage.setItem(SERVICES_KEY, JSON.stringify(defaultServices));
  }

  if (!localStorage.getItem(TIME_SLOTS_KEY)) {
    const defaultTimeSlots = [
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
      '5:00 PM'
    ];
    localStorage.setItem(TIME_SLOTS_KEY, JSON.stringify(defaultTimeSlots));
  }

  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    const defaultNotifications: Notification[] = [];
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(defaultNotifications));
  }
}

// User management
export function getUsers(): LocalUser[] {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function getUserByEmail(email: string): LocalUser | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(email: string, password: string, name: string): LocalUser {
  const users = getUsers();
  const newUser: LocalUser = {
    id: crypto.randomUUID(),
    email,
    password,
    name,
    role: 'user',
    createdAt: new Date().toISOString().split('T')[0]
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
}

export function getCurrentUser(): LocalUser | null {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

export function setCurrentUser(user: LocalUser | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function updateUserProfile(userId: string, name: string): LocalUser | null {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  
  users[userIndex].name = name;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Update current user if it's the same
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    currentUser.name = name;
    setCurrentUser(currentUser);
  }
  
  return users[userIndex];
}

// Booking management
export function getBookings(): LocalBooking[] {
  const bookings = localStorage.getItem(BOOKINGS_KEY);
  return bookings ? JSON.parse(bookings) : [];
}

export function getBookingsByUserId(userId: string): LocalBooking[] {
  return getBookings().filter(b => b.userId === userId);
}

export function createBooking(
  userId: string,
  service: string,
  date: string,
  timeSlot: string
): LocalBooking {
  const bookings = getBookings();
  const newBooking: LocalBooking = {
    id: crypto.randomUUID(),
    userId,
    service,
    date,
    timeSlot,
    status: 'Pending',
    createdAt: new Date().toISOString().split('T')[0]
  };
  bookings.push(newBooking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return newBooking;
}

export function updateBookingStatus(
  bookingId: string,
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed'
): LocalBooking | null {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) return null;
  
  bookings[bookingIndex].status = status;
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return bookings[bookingIndex];
}

export function rescheduleBooking(
  bookingId: string,
  newDate: string,
  newTimeSlot: string
): LocalBooking | null {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) return null;
  
  bookings[bookingIndex].date = newDate;
  bookings[bookingIndex].timeSlot = newTimeSlot;
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return bookings[bookingIndex];
}

// Auth
export function login(email: string, password: string): LocalUser | null {
  const user = getUserByEmail(email);
  if (!user || user.password !== password) {
    return null;
  }
  setCurrentUser(user);
  return user;
}

export function logout() {
  setCurrentUser(null);
}

export function signup(email: string, password: string, name: string): LocalUser | null {
  // Check if user already exists
  if (getUserByEmail(email)) {
    return null;
  }
  const user = createUser(email, password, name);
  setCurrentUser(user);
  return user;
}

// Services management
export function getServices(): string[] {
  const services = localStorage.getItem(SERVICES_KEY);
  return services ? JSON.parse(services) : [];
}

export function setServices(services: string[]) {
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
}

export function addService(service: string): string[] {
  const services = getServices();
  if (!services.includes(service)) {
    services.push(service);
    setServices(services);
  }
  return services;
}

export function removeService(service: string): string[] {
  const services = getServices().filter(s => s !== service);
  setServices(services);
  return services;
}

// Time slots management
export function getTimeSlots(): string[] {
  const timeSlots = localStorage.getItem(TIME_SLOTS_KEY);
  return timeSlots ? JSON.parse(timeSlots) : [];
}

export function setTimeSlots(timeSlots: string[]) {
  localStorage.setItem(TIME_SLOTS_KEY, JSON.stringify(timeSlots));
}

export function addTimeSlot(timeSlot: string): string[] {
  const timeSlots = getTimeSlots();
  if (!timeSlots.includes(timeSlot)) {
    timeSlots.push(timeSlot);
    setTimeSlots(timeSlots);
  }
  return timeSlots;
}

export function removeTimeSlot(timeSlot: string): string[] {
  const timeSlots = getTimeSlots().filter(s => s !== timeSlot);
  setTimeSlots(timeSlots);
  return timeSlots;
}

// Review management
export function addReview(
  bookingId: string,
  rating: number,
  comment: string
): LocalBooking | null {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex === -1) return null;
  
  bookings[bookingIndex].review = {
    rating,
    comment,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return bookings[bookingIndex];
}

// Get average rating for a service
export function getServiceRating(serviceName: string): { average: number; count: number } {
  const bookings = getBookings();
  const serviceBookings = bookings.filter(b => b.service === serviceName && b.review);
  
  if (serviceBookings.length === 0) {
    return { average: 0, count: 0 };
  }
  
  const totalRating = serviceBookings.reduce((sum, b) => sum + (b.review?.rating || 0), 0);
  return {
    average: totalRating / serviceBookings.length,
    count: serviceBookings.length
  };
}

// Notifications management
export function getNotifications(): Notification[] {
  const notifications = localStorage.getItem(NOTIFICATIONS_KEY);
  return notifications ? JSON.parse(notifications) : [];
}

export function addNotification(notification: Notification) {
  const notifications = getNotifications();
  notifications.push(notification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  
  // Dispatch custom event for real-time notification updates
  window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
}

export function markNotificationAsRead(notificationId: string) {
  const notifications = getNotifications();
  const notificationIndex = notifications.findIndex(n => n.id === notificationId);
  if (notificationIndex === -1) return;
  
  notifications[notificationIndex].read = true;
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

export function deleteNotification(notificationId: string) {
  const notifications = getNotifications();
  const notificationIndex = notifications.findIndex(n => n.id === notificationId);
  if (notificationIndex === -1) return;
  
  notifications.splice(notificationIndex, 1);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

export function markAllNotificationsAsRead() {
  const notifications = getNotifications();
  notifications.forEach(n => n.read = true);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}