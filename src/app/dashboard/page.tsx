'use client';

import { useAuth } from '@/context/auth-context';
import { motion } from 'framer-motion';
import { ShoppingCart, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Account Balance',
      value: `$${user?.walletBalance?.toFixed(2) || '0.00'}`,
      icon: Wallet,
      color: 'text-red-600',
      bg: 'bg-red-600/10 border-red-600/20',
      action: { label: 'Add Funds', href: '/dashboard/add-funds' }
    },
    {
      label: 'Quick Order',
      value: 'Place Order',
      icon: ShoppingCart,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      action: { label: 'Start Now', href: '/dashboard/new-order' }
    },
    {
      label: 'Order History',
      value: 'View All',
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-500/10 border-green-500/20',
      action: { label: 'My Orders', href: '/dashboard/orders' }
    },
  ];

  return (
    <div className="max-w-5xl space-y-6 sm:space-y-8">
      {/* Welcome banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/8"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl sm:text-2xl font-black italic uppercase">
              Welcome back{user?.name ? `, ${user.name}` : ''}!
            </h2>
            <p className="text-white/70 mt-1 text-sm font-medium">Your account is active. Start placing orders or add funds below.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Platform Online</span>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="p-5 sm:p-6 rounded-2xl bg-black border border-white/10 flex flex-col gap-4 group hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-2">{stat.label}</p>
                <h3 className="text-xl sm:text-2xl font-black">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl border ${stat.bg} ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <Link
              href={stat.action.href}
              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-red-600 transition-colors group-hover:text-white/80"
            >
              {stat.action.label} <ArrowRight size={12} className="ml-1" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-5 sm:p-6 rounded-2xl bg-black border border-white/10 flex flex-col gap-3"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Platform Status</h3>
          <div className="flex flex-col gap-2">
            {['Order Processing', 'Payment Gateway'].map((sys) => (
              <div key={sys} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <p className="text-sm font-bold text-white/70">{sys}</p>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">Operational</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="p-5 sm:p-6 rounded-2xl bg-black border border-white/10 flex flex-col gap-4"
        >
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Quick Start Guide</h3>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Add funds to your account wallet' },
              { step: '2', text: 'Browse our available SMM services' },
              { step: '3', text: 'Place your first order in seconds' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center text-[10px] font-black text-red-600 shrink-0">{step}</div>
                <p className="text-sm font-medium text-white/90">{text}</p>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/new-order"
            className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 hover:text-white transition-colors"
          >
            Place Your First Order <ArrowRight size={12} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
