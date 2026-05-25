import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAppStore } from '@/lib/store';
import StatusBadge from './StatusBadge';
import {
  Menu, X, LayoutDashboard, Store,
  UserCircle, Shield, LogOut, ChevronDown,
} from 'lucide-react';
import logoImg from '@/assets/logo.png';

export default function Navbar() {
  const { state, dispatch } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = state.currentUser;

  const navLinks = [
    { to: '/listings', label: 'Token Listings', icon: Store },
    ...(user?.role === 'BUSINESS'
      ? [{ to: '/dashboard/business', label: 'Business Dashboard', icon: LayoutDashboard }]
      : []),
    ...(user?.role === 'BUYER' || user?.role === 'INDIVIDUAL'
      ? [{ to: '/dashboard/investor', label: 'Portfolio', icon: LayoutDashboard }]
      : []),
    ...(user?.role === 'ADMIN'
      ? [{ to: '/admin', label: 'Admin Panel', icon: Shield }]
      : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  function handleLogout() {
    dispatch({ type: 'LOGOUT' });
    setUserMenuOpen(false);
    navigate('/');
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logoImg} alt="TokenBiz" className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            Token<span className="text-primary">Biz</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <WalletMultiButton />
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm font-medium text-secondary-foreground hover:bg-muted transition-colors"
              >
                <UserCircle className="h-4 w-4" />
                <span className="hidden sm:inline">{user.firstName}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card p-3 shadow-lg z-50 animate-scale-in">
                    <div className="mb-3 px-2">
                      <p className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                      <div className="mt-2">
                        <StatusBadge status={user.verificationStatus} />
                      </div>
                    </div>
                    <div className="border-t border-border pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-2 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn-secondary text-sm hidden sm:inline-flex"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 animate-slide-up">
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border sm:hidden">
            <WalletMultiButton />
          </div>
        </div>
      )}
    </nav>
  );
}