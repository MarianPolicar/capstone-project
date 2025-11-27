import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Calendar, Clock, User, Trash2 } from 'lucide-react';
import * as localStorageUtils from '../../utils/localStorage';
import { Notification } from '../../utils/localStorage';
import { toast } from 'sonner@2.0.3';

interface NotificationPanelProps {
  onNotificationClick?: (bookingId: string) => void;
}

export default function NotificationPanel({ onNotificationClick }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();

    // Listen for new notifications via custom event
    const handleNewNotification = (event: CustomEvent) => {
      const newNotification = event.detail as Notification;
      console.log('New notification received:', newNotification);
      
      // Show toast notification
      toast.info(`📬 ${newNotification.message}`, {
        description: `${newNotification.service} - ${new Date(newNotification.date).toLocaleDateString()}`,
        duration: 5000,
      });
      
      // Reload notifications
      loadNotifications();
    };

    window.addEventListener('newNotification', handleNewNotification as EventListener);

    // Poll for new notifications every 2 seconds as backup
    const interval = setInterval(() => {
      loadNotifications();
    }, 2000);

    return () => {
      window.removeEventListener('newNotification', handleNewNotification as EventListener);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Close panel when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadNotifications = () => {
    const allNotifications = localStorageUtils.getNotifications();
    // Sort by date, newest first
    const sorted = allNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setNotifications(sorted);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    localStorageUtils.markNotificationAsRead(notification.id);
    loadNotifications();
    
    if (onNotificationClick) {
      onNotificationClick(notification.bookingId);
    }
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) {
        localStorageUtils.markNotificationAsRead(n.id);
      }
    });
    loadNotifications();
  };

  const handleDeleteNotification = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    localStorageUtils.deleteNotification(notificationId);
    loadNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_booking':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'booking_update':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'booking_cancelled':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_booking':
        return 'bg-blue-50 border-blue-200';
      case 'booking_update':
        return 'bg-green-50 border-green-200';
      case 'booking_cancelled':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-[32rem] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h3 className="text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No notifications yet</p>
                <p className="text-slate-500 text-sm mt-1">
                  You'll be notified when users book appointments
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)} flex-shrink-0`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm mb-1 ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{notification.userName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(notification.date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            {formatTime(notification.createdAt)}
                          </span>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDeleteNotification(e, notification.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}