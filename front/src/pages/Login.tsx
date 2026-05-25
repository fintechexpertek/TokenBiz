import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';
import { LogIn } from 'lucide-react';
import logoImg from '@/assets/logo.png';

export default function LoginPage() {
  const { dispatch } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { access_token, user } = await api.auth.login(email, password);
      localStorage.setItem('access_token', access_token);
      dispatch({ type: 'LOGIN', payload: user as User });
      toast({ title: `Welcome back, ${(user as User).firstName}!` });

      const role = (user as User).role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'BUSINESS' || role === 'INDIVIDUAL') navigate('/dashboard/business');
      else navigate('/dashboard/investor');
    } catch (err: unknown) {
      toast({
        title: 'Login failed',
        description: err instanceof Error ? err.message : 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={logoImg} alt="TokenBiz" className="h-14 w-14 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your TokenBiz account</p>
          </div>

          <div className="card-elevated rounded-2xl p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
              >
                <LogIn className="h-4 w-4" />
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
