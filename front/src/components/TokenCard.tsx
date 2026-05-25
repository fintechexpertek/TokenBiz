import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import type { Project } from '@/lib/types';
import { TrendingUp, Coins, ArrowRight } from 'lucide-react';

interface TokenCardProps {
  project: Project;
}

export default function TokenCard({ project }: TokenCardProps) {
  const soldPercent = ((project.totalSupply - project.availableSupply) / project.totalSupply) * 100;

  return (
    <div className="card-elevated rounded-2xl p-5 flex flex-col group hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg font-mono">
            {project.tokenSymbol.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
            <span className="text-xs text-muted-foreground font-mono">${project.tokenSymbol}</span>
          </div>
        </div>
        <StatusBadge status={project.issuerVerified} />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">
        {project.description}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-secondary">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">Price</span>
          </div>
          <p className="text-base font-bold text-foreground font-mono">${project.priceUsd.toFixed(2)}</p>
        </div>
        <div className="p-3 rounded-xl bg-secondary">
          <div className="flex items-center gap-1.5 mb-1">
            <Coins className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <p className="text-base font-bold text-foreground font-mono">{(project.availableSupply / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Sold</span>
          <span className="text-primary font-medium">{soldPercent.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${soldPercent}%` }}
          />
        </div>
      </div>

      <Link
        to={`/listings/${project.id}`}
        className="btn-secondary text-sm flex items-center justify-center gap-2 w-full"
      >
        View Details
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
