import React from 'react';
import type { VerificationStatus } from '@/lib/types';
import { ShieldCheck, Clock, ShieldX, Ban } from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
}

const config: Record<VerificationStatus, { label: string; className: string; icon: React.ElementType }> = {
  verified: { label: 'Verified', className: 'badge-verified', icon: ShieldCheck },
  under_review: { label: 'Under Review', className: 'badge-review', icon: Clock },
  not_verified: { label: 'Not Verified', className: 'badge-blocked', icon: ShieldX },
  blocked: { label: 'Blocked', className: 'badge-blocked', icon: Ban },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const { label, className, icon: Icon } = config[status];
  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${className} ${sizeClass}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {label}
    </span>
  );
}
