'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Layers, Clock, ExternalLink } from 'lucide-react';

interface Order {
  id: string;
  link: string;
  quantity: number;
  charge: number;
  status: string;
  createdAt: string;
  service: {
    name: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(data.data || data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'processing': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'canceled':
      case 'partial': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="max-w-6xl space-y-6 sm:space-y-8">
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">Order History</h2>
          <p className="text-white/40 text-sm font-medium mt-1">Track the status of all your campaigns.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="h-10 px-4 flex items-center justify-center gap-2 rounded-xl bg-white/[0.02] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.05] transition-all text-xs font-bold shrink-0 shadow-sm"
        >
           <Clock size={14} className={loading ? "animate-spin" : ""} />
           Refresh List
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 overflow-hidden bg-black"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-[#050505]">
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Order ID</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Date & Time</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Service & Link</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Amount</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Cost</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="inline-block h-6 w-6 border-2 border-white/20 border-t-red-600 rounded-full animate-spin" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-sm font-bold text-white/40">
                    <Layers size={32} className="mx-auto mb-3 opacity-30" />
                    No orders found. Support campaigns to see data here.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 sm:px-6 py-4 align-top">
                      <span className="text-xs font-bold font-mono text-white/60 bg-white/5 px-2 py-1 rounded-md">{order.id.slice(0,8)}</span>
                    </td>
                    <td className="px-5 sm:px-6 py-4 align-top">
                      <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-white/40 font-medium mt-0.5">{new Date(order.createdAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-5 sm:px-6 py-4 align-top max-w-[250px]">
                      <p className="text-sm font-bold truncate mb-1">{order.service?.name}</p>
                      <a href={order.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-400 truncate max-w-full group">
                        {order.link}
                        <ExternalLink size={10} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </td>
                    <td className="px-5 sm:px-6 py-4 align-top">
                      <p className="text-sm font-bold">{order.quantity.toLocaleString()}</p>
                    </td>
                    <td className="px-5 sm:px-6 py-4 align-top">
                      <p className="text-sm font-bold">${order.charge.toFixed(3)}</p>
                    </td>
                    <td className="px-5 sm:px-6 py-4 align-top">
                      <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
