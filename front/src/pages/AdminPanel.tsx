import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAppStore, generateId } from '@/lib/store';
import StatusBadge from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import type { VerificationStatus } from '@/lib/types';
import {
  Shield, Users, Search, StickyNote, ChevronDown,
  ChevronUp, Send, Building2, User, ShoppingCart,
  Clock, CheckCircle, XCircle, Ban,
} from 'lucide-react';

const statusOptions: { value: VerificationStatus; label: string; icon: React.ElementType }[] = [
  { value: 'verified', label: 'Verified', icon: CheckCircle },
  { value: 'under_review', label: 'Under Review', icon: Clock },
  { value: 'not_verified', label: 'Not Verified', icon: XCircle },
  { value: 'blocked', label: 'Blocked', icon: Ban },
];

const roleIcons: Record<string, React.ElementType> = {
  BUSINESS: Building2,
  INDIVIDUAL: User,
  BUYER: ShoppingCart,
  ADMIN: Shield,
};

export default function AdminPanel() {
  const { state, dispatch } = useAppStore();
  const { toast } = useToast();
  const user = state.currentUser;

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | VerificationStatus>('all');
  const [filterRole, setFilterRole] = useState<'all' | string>('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<Record<string, string>>({});

  if (!user || user.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Admin access required.</p>
          <Link to="/login" className="text-primary text-sm hover:underline mt-4 inline-block">Sign in</Link>
        </div>
      </Layout>
    );
  }

  const filteredUsers = state.users.filter(u => {
    if (u.role === 'ADMIN') return false;
    const matchesSearch =
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.legalEntityName || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || u.verificationStatus === filterStatus;
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const pendingCount = state.users.filter(u => u.verificationStatus === 'under_review' && u.role !== 'ADMIN').length;
  const verifiedCount = state.users.filter(u => u.verificationStatus === 'verified' && u.role !== 'ADMIN').length;
  const blockedCount = state.users.filter(u => u.verificationStatus === 'blocked').length;

  function changeStatus(userId: string, status: VerificationStatus) {
    dispatch({ type: 'UPDATE_VERIFICATION', payload: { userId, status } });
    toast({ title: 'Status updated', description: `User verification set to ${status.replace('_', ' ')}.` });
  }

  function submitNote(targetUserId: string) {
    const text = noteText[targetUserId]?.trim();
    if (!text) return;
    dispatch({
      type: 'ADD_ADMIN_NOTE',
      payload: {
        id: generateId(),
        adminId: user!.id,
        targetUserId,
        note: text,
        createdAt: new Date().toISOString(),
      },
    });
    setNoteText(prev => ({ ...prev, [targetUserId]: '' }));
    toast({ title: 'Note added' });
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage user verifications and registrations</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="stat-card">
            <Clock className="h-5 w-5 text-warning mb-2" />
            <p className="text-2xl font-bold text-foreground font-mono">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </div>
          <div className="stat-card">
            <CheckCircle className="h-5 w-5 text-success mb-2" />
            <p className="text-2xl font-bold text-foreground font-mono">{verifiedCount}</p>
            <p className="text-xs text-muted-foreground">Verified Users</p>
          </div>
          <div className="stat-card">
            <Ban className="h-5 w-5 text-destructive mb-2" />
            <p className="text-2xl font-bold text-foreground font-mono">{blockedCount}</p>
            <p className="text-xs text-muted-foreground">Blocked Accounts</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or entity..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
            className="input-field w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
            <option value="not_verified">Not Verified</option>
            <option value="blocked">Blocked</option>
          </select>
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Roles</option>
            <option value="BUSINESS">Business</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="BUYER">Buyer</option>
          </select>
        </div>

        {/* User list */}
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="card-elevated rounded-2xl p-10 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No users match your filters.</p>
            </div>
          ) : (
            filteredUsers.map(u => {
              const RoleIcon = roleIcons[u.role] || User;
              const isExpanded = expandedUser === u.id;
              const userNotes = state.adminNotes.filter(n => n.targetUserId === u.id);

              return (
                <div key={u.id} className="card-elevated rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                        <RoleIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">{u.firstName} {u.lastName}</span>
                          <StatusBadge status={u.verificationStatus} />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{u.email}</span>
                          <span className="text-muted-foreground/40">|</span>
                          <span className="text-xs text-muted-foreground">{u.role}</span>
                          {u.legalEntityName && (
                            <>
                              <span className="text-muted-foreground/40">|</span>
                              <span className="text-xs text-muted-foreground">{u.legalEntityName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border p-5 bg-secondary/20 animate-slide-up">
                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* User Details */}
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">User Details</h4>
                          <div className="space-y-2 text-sm">
                            {u.phone && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Phone</span>
                                <span className="text-foreground">{u.phone}</span>
                              </div>
                            )}
                            {u.citizenship && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Citizenship</span>
                                <span className="text-foreground">{u.citizenship}</span>
                              </div>
                            )}
                            {u.representativePosition && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Position</span>
                                <span className="text-foreground">{u.representativePosition}</span>
                              </div>
                            )}
                            {u.countryOfIncorporation && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Country</span>
                                <span className="text-foreground">{u.countryOfIncorporation}</span>
                              </div>
                            )}
                            {u.projectName && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Project</span>
                                <span className="text-foreground">{u.projectName}</span>
                              </div>
                            )}
                            {u.projectDescription && (
                              <div>
                                <span className="text-muted-foreground block mb-1">Project Description</span>
                                <p className="text-foreground text-xs leading-relaxed p-2 rounded-lg bg-secondary">{u.projectDescription}</p>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Registered</span>
                              <span className="text-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Status Controls */}
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-5 mb-3">Change Status</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {statusOptions.map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => changeStatus(u.id, opt.value)}
                                disabled={u.verificationStatus === opt.value}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-30 ${
                                  opt.value === 'verified' ? 'bg-primary/10 text-primary hover:bg-primary/20' :
                                  opt.value === 'under_review' ? 'bg-warning/10 text-warning hover:bg-warning/20' :
                                  opt.value === 'not_verified' ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' :
                                  'bg-destructive/10 text-destructive hover:bg-destructive/20'
                                }`}
                              >
                                <opt.icon className="h-3.5 w-3.5" />
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            <StickyNote className="h-3.5 w-3.5 inline mr-1" />
                            Internal Notes ({userNotes.length})
                          </h4>

                          {userNotes.length > 0 && (
                            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                              {userNotes.map(note => (
                                <div key={note.id} className="p-2.5 rounded-lg bg-secondary text-xs">
                                  <p className="text-foreground leading-relaxed">{note.note}</p>
                                  <p className="text-muted-foreground mt-1.5">
                                    {new Date(note.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <input
                              value={noteText[u.id] || ''}
                              onChange={e => setNoteText(prev => ({ ...prev, [u.id]: e.target.value }))}
                              placeholder="Add internal note..."
                              className="input-field text-xs"
                              onKeyDown={e => e.key === 'Enter' && submitNote(u.id)}
                            />
                            <button
                              onClick={() => submitNote(u.id)}
                              className="p-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
