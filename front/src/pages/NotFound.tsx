import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ArrowLeft } from 'lucide-react';
import logoImg from '@/assets/logo.png';

export default function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <img src={logoImg} alt="TokenBiz" className="h-16 w-16 object-contain" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-2 font-mono">404</h1>
          <p className="text-muted-foreground mb-6">Page not found.</p>
          <Link to="/" className="btn-primary text-sm inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}