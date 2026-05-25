import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useAppStore, generateId } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

interface ComplaintModalProps {
  projectId: string;
  onClose: () => void;
}

export default function ComplaintModal({ projectId, onClose }: ComplaintModalProps) {
  const { state, dispatch } = useAppStore();
  const { toast } = useToast();
  const [text, setText] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    if (!state.currentUser) {
      toast({ title: 'Error', description: 'You must be signed in to submit a complaint.', variant: 'destructive' });
      return;
    }
    dispatch({
      type: 'ADD_COMPLAINT',
      payload: {
        id: generateId(),
        submitterId: state.currentUser.id,
        submitterName: `${state.currentUser.firstName} ${state.currentUser.lastName}`,
        submitterEmail: state.currentUser.email,
        projectId,
        text: text.trim(),
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      },
    });
    toast({ title: 'Complaint submitted', description: 'Your complaint has been recorded and will be reviewed.' });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lg animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Submit Complaint</h3>
            <p className="text-sm text-muted-foreground">Report an issue with this project</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Describe your complaint in detail..."
            rows={5}
            className="input-field resize-none mb-4"
            required
          />
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn-secondary text-sm">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
