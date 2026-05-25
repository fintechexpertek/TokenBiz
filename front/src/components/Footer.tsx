import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '@/assets/logo.png';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <img src={logoImg} alt="TokenBiz" className="h-8 w-8 object-contain" />
              <span className="text-base font-bold text-foreground">
                Token<span className="text-primary">Biz</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Institutional-grade tokenization platform for real-world assets. Compliant, transparent, secure.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Platform</h4>
            <div className="flex flex-col gap-2">
              <Link to="/listings" className="text-sm text-muted-foreground hover:text-primary transition-colors">Token Listings</Link>
              <Link to="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">Get Started</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Resources</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Documentation</span>
              <span className="text-sm text-muted-foreground">API Reference</span>
              <span className="text-sm text-muted-foreground">Smart Contracts</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Terms of Service</span>
              <span className="text-sm text-muted-foreground">Privacy Policy</span>
              <span className="text-sm text-muted-foreground">Compliance</span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} TokenBiz. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built on Solana &middot; Devnet
          </p>
        </div>
      </div>
    </footer>
  );
}