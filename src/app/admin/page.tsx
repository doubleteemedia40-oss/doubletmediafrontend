'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Activity, Terminal, Banknote, Users, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', profit: 41.2 },
  { name: 'Tue', profit: 54.8 },
  { name: 'Wed', profit: 99.3 },
  { name: 'Thu', profit: 70.1 },
  { name: 'Fri', profit: 112.5 },
  { name: 'Sat', profit: 195.0 },
  { name: 'Sun', profit: 245.8 },
];

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalProfit: number;
  activeAutomations: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrders: 0,
    totalProfit: 0,
    activeAutomations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-6 sm:space-y-8 relative z-10 w-full overflow-hidden">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">System Overview</h2>
        <p className="text-black/70 dark:text-white/70 text-sm font-medium mt-1">Real-time SMM platform statistics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-black dark:text-white' },
          { label: 'Orders Processed', value: stats.totalOrders.toLocaleString(), icon: Terminal, color: 'text-blue-500' },
          { label: 'Platform Yield', value: `₦${stats.totalProfit.toFixed(2)}`, icon: Banknote, color: 'text-green-500' },
          { label: 'Active Providers', value: stats.activeAutomations, icon: Activity, color: 'text-red-600' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-black border border-black/10 dark:border-white/10 relative overflow-hidden group hover:border-red-600/30 transition-all duration-300"
          >
            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/70 dark:text-white/70 mb-2">{stat.label}</p>
                <h3 className="text-2xl sm:text-3xl font-black">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 ${stat.color}`}>
                 <stat.icon size={18} className="sm:w-5 sm:h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1 lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-black border border-black/10 dark:border-white/10 flex flex-col"
         >
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-black/70 dark:text-white/70 mb-6 flex items-center gap-2">
               <TrendingUp size={14} className="text-blue-500" />
               7-Day Revenue
            </h3>
            <div className="w-full relative -ml-4 h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v}`} width={40} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#22c55e', fontWeight: 900, fontSize: '14px' }}
                  />
                  <Area type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </motion.div>

         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-1 p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 flex flex-col"
         >
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-black/70 dark:text-white/70 mb-6 flex items-center gap-2">
               <Activity size={14} className="text-red-600" />
               Platform Health
            </h3>
            
            <div className="space-y-4 sm:space-y-6 flex-1">
               {['SMM API Providers', 'Payment Gateway', 'Database Service', 'Order Queue'].map((sys, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-4 sm:pb-0 border-b sm:border-0 border-black/5 dark:border-white/5 last:border-0">
                     <p className="text-xs font-bold text-black/90 dark:text-white/90 uppercase tracking-wider">{sys}</p>
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-green-500 bg-green-500/10 px-2 py-1 rounded">Online</span>
                  </div>
               ))}
            </div>
         </motion.div>
      </div>
    </div>
  );
}
