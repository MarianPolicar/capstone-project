import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Shield, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

function AdminLogin({ onLogin }: AdminLoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onLogin(formData.email, formData.password);
      toast.success('Admin login successful!');
    } catch (err: any) {
      toast.error(err.message || 'Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Card className="w-full max-w-md p-8 shadow-2xl border-slate-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-slate-900">Administrator Access</h1>
          <p className="text-slate-600">Secure admin portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Admin Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="rounded-lg"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full rounded-lg py-6 bg-gradient-to-r from-blue-600 to-blue-700"
            disabled={isLoading}
          >
            <Shield className="w-5 h-5 mr-2" />
            {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-slate-700">
            <strong>Admin Accounts:</strong><br />
            roger@gmail.com<br />
            val@gmail.com<br />
            marian@gmail.com<br />
            Password: gerger1
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            ← Back to User Login
          </Link>
        </div>
      </Card>
    </div>
  );
}

// Explicit default export for clarity
export default AdminLogin;