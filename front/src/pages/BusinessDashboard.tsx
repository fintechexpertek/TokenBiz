import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAppStore, generateId } from '@/lib/store';
import StatusBadge from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import {
  DollarSign, Coins, AlertTriangle, RotateCcw,
  Plus, Flame, TrendingUp, MessageSquare, Loader2,
  Building2, ArrowRight,
} from 'lucide-react';

export default function BusinessDashboard() {
  const { state, dispatch } = useAppStore();
  const { toast } = useToast();
  const user = state.currentUser;

  const [issueAmount, setIssueAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [issuingProject, setIssuingProject] = useState('');
  const [burningProject, setBurningProject] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  if (!user || (user.role !== 'BUSINESS' && user.role !== 'INDIVIDUAL')) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">You must be logged in as a business user.</p>
          <Link to="/login" className="text-primary text-sm hover:underline mt-4 inline-block">Sign in</Link>
        </div>
      </Layout>
    );
  }

  const userProjects = state.projects.filter(p => p.userId === user.id);
  const totalCapital = userProjects.reduce((sum, p) => sum + (p.totalSupply - p.availableSupply) * p.priceUsd, 0);
  const totalAvailable = userProjects.reduce((sum, p) => sum + p.availableSupply, 0);
  const projectComplaints = state.complaints.filter(c => userProjects.some(p => p.id === c.projectId));
  const projectBuybacks = state.buybackRequests.filter(b => userProjects.some(p => p.id === b.projectId));

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    if (!issuingProject || !issueAmount) return;
    setLoading('issue');
    await new Promise(r => setTimeout(r, 1000));
    dispatch({ type: 'ISSUE_TOKENS', payload: { projectId: issuingProject, amount: Number(issueAmount) } });
    toast({ title: 'Tokens issued', description: `${Number(issueAmount).toLocaleString()} tokens minted successfully.` });
    setIssueAmount('');
    setLoading(null);
  }

  async function handleBurn(e: React.FormEvent) {
    e.preventDefault();
    if (!burningProject || !burnAmount) return;
    const proj = state.projects.find(p => p.id === burningProject);
    if (proj && Number(burnAmount) > proj.availableSupply) {
      toast({ title: 'Error', description: 'Cannot burn more than available (unsold) supply.', variant: 'destructive' });
      return;
    }
    setLoading('burn');
    await new Promise(r => setTimeout(r, 1000));
    dispatch({ type: 'BURN_TOKENS', payload: { projectId: burningProject, amount: Number(burnAmount) } });
    toast({ title: 'Tokens burned', description: `${Number(burnAmount).toLocaleString()} unsold tokens burned.` });
    setBurnAmount('');
    setLoading(null);
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">Business Dashboard</h1>
              <StatusBadge status={user.verificationStatus} size="md" />
            </div>
            <p className="text-sm text-muted-foreground">{user.legalEntityName || `${user.firstName} ${user.lastName}`}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <DollarSign className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground font-mono">${totalCapital.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Capital Raised</p>
          </div>
          <div className="stat-card">
            <Coins className="h-5 w-5 text-accent mb-2" />
            <p className="text-2xl font-bold text-foreground font-mono">{totalAvailable.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Tokens Available</p>
          </div>
          <div className="stat-card">
            <RotateCcw className="h-5 w-5 text-info mb-2" />
            <p className="text-2xl font-bold text-foreground font-mono">{projectBuybacks.length}</p>
            <p className="text-xs text-muted-foreground">Buyback Requests</p>
          </div>
          <div className="stat-card">
            <AlertTriangle className="h-5 w-5 text-destructive mb-2" />
            <p className="text-2xl font-bold text-foreground font-mono">{projectComplaints.filter(c => c.status === 'OPEN').length}</p>
            <p className="text-xs text-muted-foreground">Open Complaints</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Issue Tokens */}
          <div className="card-elevated rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Issue Additional Tokens</h2>
            </div>
            <form onSubmit={handleIssue} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Project</label>
                <select
                  value={issuingProject}
                  onChange={e => setIssuingProject(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select project</option>
                  {userProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.tokenSymbol})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Amount to Mint</label>
                <input
                  type="number"
                  value={issueAmount}
                  onChange={e => setIssueAmount(e.target.value)}
                  placeholder="10000"
                  className="input-field"
                  min="1"
                  required
                />
              </div>
              <button type="submit" disabled={loading === 'issue'} className="btn-primary w-full flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                {loading === 'issue' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {loading === 'issue' ? 'Minting...' : 'Issue Tokens'}
              </button>
            </form>
          </div>

          {/* Burn Tokens */}
          <div className="card-elevated rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-destructive" />
              <h2 className="text-base font-semibold text-foreground">Burn Unsold Tokens</h2>
            </div>
            <form onSubmit={handleBurn} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Project</label>
                <select
                  value={burningProject}
                  onChange={e => setBurningProject(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select project</option>
                  {userProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.tokenSymbol}) - {p.availableSupply.toLocaleString()} available</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Amount to Burn</label>
                <input
                  type="number"
                  value={burnAmount}
                  onChange={e => setBurnAmount(e.target.value)}
                  placeholder="5000"
                  className="input-field"
                  min="1"
                  required
                />
              </div>
              <button type="submit" disabled={loading === 'burn'} className="w-full flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-lg font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50">
                {loading === 'burn' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flame className="h-4 w-4" />}
                {loading === 'burn' ? 'Burning...' : 'Burn Tokens'}
              </button>
            </form>
          </div>

          {/* Buyback Requests */}
          <div className="card-elevated rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="h-5 w-5 text-info" />
              <h2 className="text-base font-semibold text-foreground">Buyback Requests</h2>
            </div>
            {projectBuybacks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No buyback requests yet.</p>
            ) : (
              <div className="space-y-3">
                {projectBuybacks.map(bb => {
                  const proj = state.projects.find(p => p.id === bb.projectId);
                  return (
                    <div key={bb.id} className="p-3 rounded-xl bg-secondary">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground">{bb.buyerName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          bb.status === 'PENDING' ? 'badge-review' : bb.status === 'ACCEPTED' ? 'badge-verified' : 'badge-blocked'
                        }`}>
                          {bb.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {bb.tokenAmount.toLocaleString()} {proj?.tokenSymbol} tokens
                      </p>
                      {bb.status === 'PENDING' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_BUYBACK', payload: { id: bb.id, status: 'ACCEPTED' } })}
                            className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_BUYBACK', payload: { id: bb.id, status: 'REJECTED' } })}
                            className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Complaints */}
          <div className="card-elevated rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-warning" />
              <h2 className="text-base font-semibold text-foreground">Complaints</h2>
            </div>
            {projectComplaints.length === 0 ? (
              <p className="text-sm text-muted-foreground">No complaints filed.</p>
            ) : (
              <div className="space-y-3">
                {projectComplaints.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-secondary">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{c.submitterName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        c.status === 'OPEN' ? 'badge-review' : 'badge-verified'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{c.submitterEmail}</p>
                    <p className="text-sm text-foreground leading-relaxed">{c.text}</p>
                    {c.status === 'OPEN' && (
                      <button
                        onClick={() => {
                          dispatch({ type: 'UPDATE_COMPLAINT', payload: { id: c.id, status: 'RESOLVED' } });
                          toast({ title: 'Complaint resolved' });
                        }}
                        className="text-xs px-3 py-1.5 mt-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Projects */}
        {userProjects.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Your Projects</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProjects.map(p => (
                <Link key={p.id} to={`/listings/${p.id}`} className="card-elevated rounded-2xl p-5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold font-mono">
                      {p.tokenSymbol.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                      <span className="text-xs text-muted-foreground font-mono">${p.tokenSymbol}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 rounded-lg bg-secondary">
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-sm font-bold text-foreground font-mono">${p.priceUsd.toFixed(2)}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-secondary">
                      <p className="text-xs text-muted-foreground">Available</p>
                      <p className="text-sm font-bold text-foreground font-mono">{(p.availableSupply / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
