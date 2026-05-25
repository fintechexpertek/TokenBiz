import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAppStore } from '@/lib/store';
import StatusBadge from '@/components/StatusBadge';
import BuyModal from '@/components/BuyModal';
import ComplaintModal from '@/components/ComplaintModal';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, TrendingUp, Coins, BarChart3, ShoppingCart,
  Gift, AlertTriangle, Copy, ExternalLink, Building2,
} from 'lucide-react';

export default function TokenDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useAppStore();
  const { toast } = useToast();
  const [showBuy, setShowBuy] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);

  const project = state.projects.find(p => p.id === id);

  if (!project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">Project not found.</p>
          <Link to="/listings" className="text-primary text-sm hover:underline mt-4 inline-block">Back to listings</Link>
        </div>
      </Layout>
    );
  }

  const soldPercent = ((project.totalSupply - project.availableSupply) / project.totalSupply) * 100;
  const capitalRaised = (project.totalSupply - project.availableSupply) * project.priceUsd;

  function copyAddress() {
    navigator.clipboard.writeText(project.tokenAddress);
    toast({ title: 'Copied', description: 'Token address copied to clipboard.' });
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Link to="/listings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="card-elevated rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl font-mono shrink-0">
                  {project.tokenSymbol.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                    <StatusBadge status={project.issuerVerified} size="md" />
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm text-muted-foreground font-mono">${project.tokenSymbol}</span>
                    <span className="text-muted-foreground/50">|</span>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{project.issuerName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary mb-5">
                <span className="text-xs text-muted-foreground shrink-0">Token Address:</span>
                <code className="text-xs font-mono text-foreground truncate">{project.tokenAddress}</code>
                <button onClick={copyAddress} className="p-1 rounded hover:bg-muted shrink-0">
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <button className="p-1 rounded hover:bg-muted shrink-0">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>

              <h2 className="text-sm font-semibold text-foreground mb-2">About</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {project.description}
              </p>

              <h2 className="text-sm font-semibold text-foreground mb-2">Profitability Strategy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.profitabilityStrategy}
              </p>
            </div>

            {/* Supply Progress */}
            <div className="card-elevated rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4">Token Sale Progress</h2>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Sold: {(project.totalSupply - project.availableSupply).toLocaleString()} tokens</span>
                  <span className="text-primary font-semibold">{soldPercent.toFixed(1)}%</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${soldPercent}%`,
                      background: 'var(--gradient-primary)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0</span>
                  <span>{project.totalSupply.toLocaleString()} total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="card-elevated rounded-2xl p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Token Price</span>
                  </div>
                  <span className="text-lg font-bold text-foreground font-mono">${project.priceUsd.toFixed(2)}</span>
                </div>
                <div className="border-t border-border" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Available</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground font-mono">{project.availableSupply.toLocaleString()}</span>
                </div>
                <div className="border-t border-border" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-info" />
                    <span className="text-sm text-muted-foreground">Capital Raised</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground font-mono">${capitalRaised.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card-elevated rounded-2xl p-5 space-y-3">
              <button
                onClick={() => {
                  if (!state.currentUser) {
                    toast({ title: 'Sign in required', description: 'Please sign in to purchase tokens.', variant: 'destructive' });
                    return;
                  }
                  setShowBuy(true);
                }}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3"
              >
                <ShoppingCart className="h-4 w-4" />
                Buy Tokens
              </button>
              <button
                onClick={() => {
                  toast({ title: 'Claim initiated', description: 'Yield/dividend claim would execute on-chain.' });
                }}
                className="btn-accent w-full flex items-center justify-center gap-2 text-sm py-3"
              >
                <Gift className="h-4 w-4" />
                Claim Dividends
              </button>
              <button
                onClick={() => {
                  if (!state.currentUser) {
                    toast({ title: 'Sign in required', description: 'Please sign in to file a complaint.', variant: 'destructive' });
                    return;
                  }
                  setShowComplaint(true);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm py-2.5 text-muted-foreground hover:text-destructive transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                Submit Complaint
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBuy && <BuyModal project={project} onClose={() => setShowBuy(false)} />}
      {showComplaint && <ComplaintModal projectId={project.id} onClose={() => setShowComplaint(false)} />}
    </Layout>
  );
}
