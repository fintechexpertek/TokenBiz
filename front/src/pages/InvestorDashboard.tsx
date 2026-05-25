import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAppStore, generateId } from '@/lib/store';
import StatusBadge from '@/components/StatusBadge';
import BuyModal from '@/components/BuyModal';
import { useToast } from '@/hooks/use-toast';
import {
  Wallet, TrendingUp, PieChart, ShoppingCart,
  ArrowDownUp, Building2, ExternalLink,
} from 'lucide-react';

export default function InvestorDashboard() {
  const { state, dispatch } = useAppStore();
  const { toast } = useToast();
  const user = state.currentUser;
  const [buyingProject, setBuyingProject] = useState<string | null>(null);

  if (!user || (user.role !== 'BUYER' && user.role !== 'INDIVIDUAL')) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">You must be logged in as an investor.</p>
          <Link to="/login" className="text-primary text-sm hover:underline mt-4 inline-block">Sign in</Link>
        </div>
      </Layout>
    );
  }

  const portfolio = state.portfolio;
  const totalValue = portfolio.reduce((sum, p) => sum + p.totalValue, 0);
  const totalTokens = portfolio.reduce((sum, p) => sum + p.amount, 0);

  function handleSellRequest(projectId: string, projectName: string, tokenSymbol: string, amount: number) {
    dispatch({
      type: 'ADD_BUYBACK',
      payload: {
        id: generateId(),
        buyerId: user!.id,
        buyerName: `${user!.firstName} ${user!.lastName}`,
        projectId,
        tokenAmount: Math.floor(amount * 0.5),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
    });
    toast({
      title: 'Sell request submitted',
      description: `Buyback request for ${Math.floor(amount * 0.5)} ${tokenSymbol} sent to issuer.`,
    });
  }

  const projectForBuy = buyingProject ? state.projects.find(p => p.id === buyingProject) : null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">Investor Portfolio</h1>
              <StatusBadge status={user.verificationStatus} size="md" />
            </div>
            <p className="text-sm text-muted-foreground">{user.firstName} {user.lastName}</p>
          </div>
          <Link to="/listings" className="btn-primary text-sm flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Browse Tokens
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="stat-card">
            <Wallet className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground font-mono">${totalValue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Portfolio Value</p>
          </div>
          <div className="stat-card">
            <PieChart className="h-5 w-5 text-accent mb-2" />
            <p className="text-2xl font-bold text-foreground font-mono">{portfolio.length}</p>
            <p className="text-xs text-muted-foreground">Projects Held</p>
          </div>
          <div className="stat-card">
            <TrendingUp className="h-5 w-5 text-info mb-2" />
            <p className="text-2xl font-bold text-foreground font-mono">{totalTokens.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Tokens</p>
          </div>
        </div>

        {/* Portfolio */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Holdings</h2>

        {portfolio.length === 0 ? (
          <div className="card-elevated rounded-2xl p-10 text-center">
            <Wallet className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-3">No tokens in your portfolio yet.</p>
            <Link to="/listings" className="btn-primary text-sm inline-flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Browse Tokens
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {portfolio.map(item => (
              <div key={item.projectId} className="card-elevated rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xl font-mono shrink-0">
                      {item.tokenSymbol.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-foreground">{item.projectName}</h3>
                        <StatusBadge status={item.issuerVerified} />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground font-mono">${item.tokenSymbol}</span>
                        <span className="text-muted-foreground/40">|</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-foreground font-mono">${item.totalValue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.amount.toLocaleString()} tokens @ ${item.currentPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => setBuyingProject(item.projectId)}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Buy More
                  </button>
                  <button
                    onClick={() => handleSellRequest(item.projectId, item.projectName, item.tokenSymbol, item.amount)}
                    className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <ArrowDownUp className="h-3.5 w-3.5" />
                    Sell / Buyback
                  </button>
                  <Link
                    to={`/listings/${item.projectId}`}
                    className="ml-auto text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    View Project
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Transactions */}
        {state.transactions.filter(t => t.buyerId === user.id).length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
            <div className="card-elevated rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Project</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Tx Hash</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.transactions
                      .filter(t => t.buyerId === user.id)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map(tx => {
                        const proj = state.projects.find(p => p.id === tx.projectId);
                        return (
                          <tr key={tx.id} className="border-b border-border last:border-0">
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                tx.type === 'BUY' ? 'badge-verified' : tx.type === 'SELL' ? 'badge-blocked' : 'badge-info'
                              }`}>
                                {tx.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-foreground font-medium">{proj?.name || 'Unknown'}</td>
                            <td className="px-4 py-3 text-right font-mono text-foreground">{tx.amount.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-mono text-foreground">${tx.priceAtPurchase.toFixed(2)}</td>
                            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{tx.txHash}</td>
                            <td className="px-4 py-3 text-right text-muted-foreground text-xs">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {projectForBuy && <BuyModal project={projectForBuy} onClose={() => setBuyingProject(null)} />}
    </Layout>
  );
}
