import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';
import { Building2, User as UserIcon, ShoppingCart, ArrowRight, Check } from 'lucide-react';

type Tab = 'BUSINESS' | 'INDIVIDUAL' | 'BUYER';

const tabs: { key: Tab; label: string; icon: React.ElementType; desc: string }[] = [
  { key: 'BUSINESS', label: 'Business', icon: Building2, desc: 'Existing legal entity' },
  { key: 'INDIVIDUAL', label: 'Individual', icon: UserIcon, desc: 'Want to incorporate' },
  { key: 'BUYER', label: 'Token Buyer', icon: ShoppingCart, desc: 'Retail investor' },
];

export default function RegisterPage() {
  const { dispatch } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('BUSINESS');
  const [loading, setLoading] = useState(false);

  // shared password field
  const [password, setPassword] = useState('');

  // Business fields
  const [bFirstName, setBFirstName] = useState('');
  const [bLastName, setBLastName] = useState('');
  const [bPosition, setBPosition] = useState('');
  const [bEntity, setBEntity] = useState('');
  const [bCountry, setBCountry] = useState('');
  const [bEmail, setBEmail] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bProjectName, setBProjectName] = useState('');
  const [bProjectDesc, setBProjectDesc] = useState('');

  // Individual fields
  const [iFirstName, setIFirstName] = useState('');
  const [iLastName, setILastName] = useState('');
  const [iCitizenship, setICitizenship] = useState('');
  const [iEmail, setIEmail] = useState('');
  const [iPhone, setIPhone] = useState('');
  const [iProjectDesc, setIProjectDesc] = useState('');

  // Buyer fields
  const [buyFirstName, setBuyFirstName] = useState('');
  const [buyLastName, setBuyLastName] = useState('');
  const [buyCitizenship, setBuyCitizenship] = useState('');
  const [buyEmail, setBuyEmail] = useState('');
  const [buyPhone, setBuyPhone] = useState('');

  async function submitBusiness(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { access_token, user } = await api.auth.register({
        email: bEmail, password, role: 'BUSINESS',
        first_name: bFirstName, last_name: bLastName, phone: bPhone,
        representative_position: bPosition, legal_entity_name: bEntity,
        country_of_incorporation: bCountry, project_name: bProjectName,
        project_description: bProjectDesc,
      });
      localStorage.setItem('access_token', access_token);
      dispatch({ type: 'REGISTER_USER', payload: user as User });
      toast({ title: 'Registration submitted', description: 'Your business application is under review.' });
      navigate('/dashboard/business');
    } catch (err: unknown) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Registration failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function submitIndividual(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { access_token, user } = await api.auth.register({
        email: iEmail, password, role: 'INDIVIDUAL',
        first_name: iFirstName, last_name: iLastName, phone: iPhone,
        citizenship: iCitizenship, project_description: iProjectDesc,
      });
      localStorage.setItem('access_token', access_token);
      dispatch({ type: 'REGISTER_USER', payload: user as User });
      toast({ title: 'Registration submitted', description: 'Your application is under review.' });
      navigate('/dashboard/investor');
    } catch (err: unknown) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Registration failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function submitBuyer(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { access_token, user } = await api.auth.register({
        email: buyEmail, password, role: 'BUYER',
        first_name: buyFirstName, last_name: buyLastName,
        phone: buyPhone, citizenship: buyCitizenship,
      });
      localStorage.setItem('access_token', access_token);
      dispatch({ type: 'REGISTER_USER', payload: user as User });
      toast({ title: 'Welcome to TokenBiz!', description: 'Your account is active. Start browsing tokens.' });
      navigate('/listings');
    } catch (err: unknown) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Registration failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'input-field';
  const labelClass = 'text-sm font-medium text-foreground mb-1.5 block';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">Select your account type and fill in your details</p>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex flex-col items-center gap-1.5 px-3 py-4 rounded-xl border text-center transition-all ${
                  activeTab === tab.key
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30'
                }`}
              >
                {activeTab === tab.key && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <tab.icon className="h-5 w-5" />
                <span className="text-sm font-semibold">{tab.label}</span>
                <span className="text-xs opacity-70">{tab.desc}</span>
              </button>
            ))}
          </div>

          <div className="card-elevated rounded-2xl p-6 sm:p-8">
            {/* Business Form */}
            {activeTab === 'BUSINESS' && (
              <form onSubmit={submitBusiness} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input value={bFirstName} onChange={e => setBFirstName(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input value={bLastName} onChange={e => setBLastName(e.target.value)} className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Representative Position</label>
                  <input value={bPosition} onChange={e => setBPosition(e.target.value)} placeholder="CEO, CFO, Director..." className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Legal Entity Name</label>
                  <input value={bEntity} onChange={e => setBEntity(e.target.value)} placeholder="Company Pty Ltd" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Country of Incorporation</label>
                  <input value={bCountry} onChange={e => setBCountry(e.target.value)} placeholder="United States" className={inputClass} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Contact Email</label>
                    <input type="email" value={bEmail} onChange={e => setBEmail(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Contact Phone</label>
                    <input type="tel" value={bPhone} onChange={e => setBPhone(e.target.value)} className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Project Name</label>
                  <input value={bProjectName} onChange={e => setBProjectName(e.target.value)} placeholder="My Token Project" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Project Description</label>
                  <textarea value={bProjectDesc} onChange={e => setBProjectDesc(e.target.value)} rows={3} placeholder="Describe your tokenization project..." className={`${inputClass} resize-none`} required />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} required />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-sm mt-2">
                  {loading ? 'Submitting...' : 'Submit Application'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  Your application will be reviewed by our compliance team.
                </p>
              </form>
            )}

            {/* Individual Form */}
            {activeTab === 'INDIVIDUAL' && (
              <form onSubmit={submitIndividual} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input value={iFirstName} onChange={e => setIFirstName(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input value={iLastName} onChange={e => setILastName(e.target.value)} className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Citizenship</label>
                  <input value={iCitizenship} onChange={e => setICitizenship(e.target.value)} placeholder="Country" className={inputClass} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Contact Email</label>
                    <input type="email" value={iEmail} onChange={e => setIEmail(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Contact Phone</label>
                    <input type="tel" value={iPhone} onChange={e => setIPhone(e.target.value)} className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Project Description</label>
                  <textarea value={iProjectDesc} onChange={e => setIProjectDesc(e.target.value)} rows={3} placeholder="Describe the company you want to form and what you plan to tokenize..." className={`${inputClass} resize-none`} required />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} required />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-sm mt-2">
                  {loading ? 'Submitting...' : 'Submit Application'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  We will help you incorporate and set up your token project.
                </p>
              </form>
            )}

            {/* Buyer Form */}
            {activeTab === 'BUYER' && (
              <form onSubmit={submitBuyer} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input value={buyFirstName} onChange={e => setBuyFirstName(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input value={buyLastName} onChange={e => setBuyLastName(e.target.value)} className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Citizenship</label>
                  <input value={buyCitizenship} onChange={e => setBuyCitizenship(e.target.value)} placeholder="Country" className={inputClass} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Contact Email</label>
                    <input type="email" value={buyEmail} onChange={e => setBuyEmail(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Contact Phone</label>
                    <input type="tel" value={buyPhone} onChange={e => setBuyPhone(e.target.value)} className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} required />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-sm mt-2">
                  {loading ? 'Creating...' : 'Create Account'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  Immediate access to browse and purchase tokens.
                </p>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}