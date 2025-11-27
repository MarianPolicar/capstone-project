import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Calendar, LayoutDashboard, User, Settings, LogOut } from 'lucide-react';
import { User as UserType } from '../App';

interface NavigationProps {
  user: UserType;
  onLogout: () => void;
}

export default function Navigation({ user, onLogout }: NavigationProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-900">BookEase</span>
            </Link>

            <div className="hidden md:flex gap-2">
              <Link to="/dashboard">
                <Button
                  variant={isActive('/dashboard') ? 'default' : 'ghost'}
                  className="rounded-full"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/booking">
                <Button
                  variant={isActive('/booking') ? 'default' : 'ghost'}
                  className="rounded-full"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  New Booking
                </Button>
              </Link>
              <Link to="/profile">
                <Button
                  variant={isActive('/profile') ? 'default' : 'ghost'}
                  className="rounded-full"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin">
                  <Button
                    variant={isActive('/admin') ? 'default' : 'ghost'}
                    className="rounded-full"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-slate-900">{user.name}</p>
              <p className="text-slate-500">{user.email}</p>
            </div>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
