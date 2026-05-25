import React, { useState } from 'react';
import { X, ShoppingCart, Loader2 } from 'lucide-react';
import { useAppStore, generateId } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/lib/types';

interface BuyModalProps {
  project: Project;
  onClose: () => void;
}

export default function BuyModal({ project, onClose }: BuyModalProps) {
  const { state, dispatch } = useAppStore();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const numAmount = Number(amount) || 0;
  const totalCost = numAmount * project.priceUsd;

  async function handleBuy(e: React.FormEvent) {
    e.preventDefault();
    if (numAmount <= 0 || numAmount > project.availableSupply) return;
    if (!state.currentUser) {
      toast({ title: 'Error', description: 'You must be signed in to purchase.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    // Simulate transaction delay
    await new Promise(r => setTimeout(r, 1500));

    const txHash = generateId() + generateId();
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: generateId(),
        buyerId: state.currentUser.id,
        projectId: project.id,
        amount: numAmount,
        priceAtPurchase: project.priceUsd,
        txHash,
        type: 'BUY',
        createdAt: new Date().toISOString(),
      },
    });

    // Update portfolio
    const existingItem = state.portfolio.find(p => p.projectId === project.id);
    if (existingItem) {
      dispatch({ type: 'UPDATE_PORTFOLIO', payload: { projectId: project.id, amount: numAmount } });
    } else {
      dispatch({
        type: 'ADD_PORTFOLIO_ITEM',
        payload: {
          projectId: project.id,
          projectName: project.name,
          tokenSymbol: project.tokenSymbol,
          amount: numAmount,
          currentPrice: project.priceUsd,
          totalValue: numAmount * project.priceUsd,
          issuerVerified: project.issuerVerified,
          description: project.description,
        },
      });
    }

    setLoading(false);
    toast({ title: 'Purchase successful', description: `Purchased ${numAmount} ${project.tokenSymbol} tokens.` });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Buy {project.tokenSymbol}</h3>
            <p className="text-sm text-muted-foreground">${project.priceUsd.toFixed(2)} per token</p>
          </div>
        </div>

        <form onSubmit={handleBuy}>
          <div className="mb-4">
            <label className="text-sm font-medium text-foreground mb-1.5 block">Token Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="input-field"
              min="1"
              max={project.availableSupply}
              required
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Available: {project.availableSupply.toLocaleString()} {project.tokenSymbol}
            </p>
          </div>

          {numAmount > 0 && (
            <div className="mb-5 p-3.5 rounded-xl bg-secondary border border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-foreground font-mono">{numAmount.toLocaleString()} {project.tokenSymbol}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Price per token</span>
                <span className="text-foreground font-mono">${project.priceUsd.toFixed(2)}</span>
              </div>
              <div className="border-t border-border mt-2.5 pt-2.5 flex justify-between">
                <span className="text-sm font-semibold text-foreground">Total Cost</span>
                <span className="text-sm font-bold text-primary font-mono">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary text-sm flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || numAmount <= 0}
              className="btn-primary text-sm flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Purchase'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
