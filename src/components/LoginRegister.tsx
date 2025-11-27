import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LoginRegisterProps {
  onLogin: (email: string, password: string, name?: string, isSignup?: boolean) => Promise<void>;
}

export default function LoginRegister({ onLogin }: LoginRegisterProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onLogin(formData.email, formData.password, formData.name, !isLogin);
      toast.success(isLogin ? 'Successfully logged in!' : 'Account created successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-blue-900">BookEase</h1>
          <p className="text-slate-600">Your modern booking solution</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={isLogin ? 'default' : 'outline'}
            className="flex-1 rounded-full"
            onClick={() => setIsLogin(true)}
          >
            Login
          </Button>
          <Button
            type="button"
            variant={!isLogin ? 'default' : 'outline'}
            className="flex-1 rounded-full"
            onClick={() => setIsLogin(false)}
          >
            Register
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required={!isLogin}
                className="rounded-lg"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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

          <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {error && (
          <p className="text-center text-red-500 mt-2">
            {error}
          </p>
        )}

        <p className="text-center text-slate-500 mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-slate-600">
            <strong>Demo User Account:</strong><br />
            Email: user@demo.com<br />
            Password: any<br /><br />
            <strong>Admin Access:</strong><br />
            <Link to="/admin/login" className="text-blue-600 hover:underline">
              Go to Admin Login →
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}