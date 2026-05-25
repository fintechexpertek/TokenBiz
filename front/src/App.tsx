import React, { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { AppProvider } from '@/lib/store';

import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Listings from './pages/Listings';
import TokenDetail from './pages/TokenDetail';
import BusinessDashboard from './pages/BusinessDashboard';
import InvestorDashboard from './pages/InvestorDashboard';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

import '@solana/wallet-adapter-react-ui/styles.css';

const App = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/:id" element={<TokenDetail />} />
              <Route path="/dashboard/business" element={<BusinessDashboard />} />
              <Route path="/dashboard/investor" element={<InvestorDashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AppProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
