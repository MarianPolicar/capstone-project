import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Shield } from 'lucide-react';
import { User } from '../../App';
import NotificationPanel from './NotificationPanel';

interface AdminLayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({ user, onLogout, children }: AdminLayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-slate-900">Admin Panel</h2>
              <p className="text-slate-500">BookEase</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    className="w-full justify-start rounded-lg"
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="mb-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-900">{user.name}</p>
            <p className="text-slate-500">{user.email}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                <Shield className="w-3 h-3 mr-1" />
                Administrator
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full rounded-lg"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header with Notifications */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-slate-900 text-xl">
              {navItems.find(item => isActive(item.path))?.label || 'Admin Panel'}
            </h1>
            <p className="text-slate-500 text-sm">
              Manage your bookings and users
            </p>
          </div>
          
          {/* Notification Bell */}
          <NotificationPanel />
        </div>

        {/* Page Content */}
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}