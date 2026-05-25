import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAppStore } from '@/lib/store';
import TokenCard from '@/components/TokenCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ListingsPage() {
  const { state } = useAppStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'under_review'>('all');

  const filtered = state.projects.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tokenSymbol.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' || p.issuerVerified === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 lg:py-14">
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Token Listings</h1>
          <p className="text-muted-foreground">
            Browse tokenized real-world asset opportunities from verified issuers.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, symbol, or description..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
            {(['all', 'verified', 'under_review'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-secondary text-muted-foreground hover:text-foreground border border-transparent'
                }`}
              >
                {f === 'all' ? 'All' : f === 'verified' ? 'Verified' : 'Under Review'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(project => (
              <TokenCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No tokens found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
