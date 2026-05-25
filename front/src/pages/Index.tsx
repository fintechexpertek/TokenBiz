import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAppStore } from '@/lib/store';
import TokenCard from '@/components/TokenCard';
import {
  Shield, Building2, Users, Coins,
  ArrowRight, Lock, Globe, BarChart3, Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '@/assets/logo.png';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function IndexPage() {
  const { state } = useAppStore();
  const featuredProjects = state.projects.slice(0, 3);

  const stats = [
    { label: 'Total Projects', value: state.projects.length.toString(), icon: Building2 },
    { label: 'Registered Users', value: state.users.length.toString(), icon: Users },
    { label: 'Tokens Listed', value: state.projects.reduce((a, p) => a + p.totalSupply, 0).toLocaleString(), icon: Coins },
    { label: 'Verified Issuers', value: state.users.filter(u => u.verificationStatus === 'verified' && u.role === 'BUSINESS').length.toString(), icon: Shield },
  ];

  const features = [
    { icon: Lock, title: 'Compliant by Design', desc: 'KYC/AML verification for all issuers. Transfer restrictions until verification is confirmed.' },
    { icon: Globe, title: 'Global Access', desc: 'Tokenize real-world assets and reach investors worldwide through blockchain infrastructure.' },
    { icon: BarChart3, title: 'Full Transparency', desc: 'On-chain transactions, real-time supply tracking, and auditable smart contracts.' },
    { icon: Zap, title: 'Instant Settlement', desc: 'Leveraging Solana for sub-second finality and near-zero transaction costs.' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <img src={logoImg} alt="TokenBiz" className="h-24 w-24 sm:h-28 sm:w-28 object-contain animate-float" />
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" />
              Built on Solana
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-5">
              Tokenize Real-World
              <br />
              <span className="text-gradient-primary">Assets with Confidence</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              The institutional-grade platform for security token issuance. List your business, tokenize assets, 
              and connect with verified investors — all with built-in compliance.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="btn-primary text-base px-7 py-3 flex items-center gap-2">
                Start Tokenizing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/listings" className="btn-secondary text-base px-7 py-3">
                Browse Tokens
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-4 mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="stat-card"
            >
              <s.icon className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground font-mono">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Why TokenBiz</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Purpose-built infrastructure for compliant tokenization of real-world assets.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-elevated rounded-2xl p-5 hover:border-primary/20 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Tokens */}
      <section className="container mx-auto px-4 mb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Featured Tokens</h2>
            <p className="text-muted-foreground text-sm">Explore tokenized real-world asset opportunities</p>
          </div>
          <Link to="/listings" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProjects.map(project => (
            <TokenCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 mb-20">
        <div className="card-elevated rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Ready to Tokenize Your Assets?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Whether you are an established business or an aspiring entrepreneur, TokenBiz provides the infrastructure to bring your assets on-chain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary text-sm px-6 py-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Register as Business
            </Link>
            <Link to="/register" className="btn-accent text-sm px-6 py-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Register as Investor
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}