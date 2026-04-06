'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Box, RefreshCcw, XCircle, Search, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  link: string;
  quantity: number;
  charge: number;
  status: string;
  createdAt: string;
  service: { name: string };
  user: { email: string };
  remoteOrderId: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/admin');
      setOrders(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'refund' | 'complete' | 'cancel') => {
    if (!confirm(`Are you sure you want to ${action} this order?`)) return;
    try {
      if (action === 'refund') {
        await api.patch(`/orders/admin/${id}/refund`);
      } else if (action === 'complete') {
        await api.patch(`/orders/admin/${id}/status`, { status: 'COMPLETED' });
      } else if (action === 'cancel') {
        await api.patch(`/orders/admin/${id}/status`, { status: 'CANCELED' });
      }
      fetchOrders();
    } catch (err) {
      console.error(`Failed to process action ${action}`, err);
    }
  };

  return (
    <div className="max-w-7xl space-y-6 sm:space-y-8 relative z-10 w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">Global Orders</h2>
          <p className="text-white/70 text-sm font-medium mt-1">Oversight of all active and past SMM campaigns across the platform.</p>
        </div>
        
        <div className="relative w-full md:w-72">
           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
           <input 
             type="text"
             placeholder="Search by ID, User, or Link..."
             className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-12 pr-4 py-3 sm:py-3.5 text-sm font-bold placeholder:text-white/60 outline-none focus:border-red-600/50 transition-all"
           />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl sm:rounded-3xl bg-black border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-white/5 bg-[#050505]">
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Order IDs</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">User</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Service & Link</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Volume</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Status</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 text-right">Actions</th>
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
                  <td colSpan={6} className="px-6 py-20 text-center text-sm font-bold text-white/70">No orders in the system yet.</td>
                </tr>
              ) : (
                orders.map(order => (
                  <React.Fragment key={order.id}>
                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                      <td className="px-5 sm:px-6 py-4 align-top">
                        <p className="inline-block text-xs font-mono font-bold text-white bg-white/5 px-2 py-1 rounded-md mb-1.5">{order.id.slice(0,8)}</p>
                        <p className="text-[10px] font-mono text-white/70 uppercase tracking-widest flex items-center gap-1">EXT: <span className="text-white/90">{order.remoteOrderId || 'None'}</span></p>
                      </td>
                      <td className="px-5 sm:px-6 py-4 align-top">
                        <p className="text-xs font-bold text-white/90 truncate max-w-[150px]" title={order.user?.email}>{order.user?.email}</p>
                      </td>
                      <td className="px-5 sm:px-6 py-4 align-top max-w-[250px]">
                        <p className="text-sm font-bold truncate mb-1">{order.service?.name}</p>
                        <a href={order.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-400 truncate max-w-full group">
                          {order.link}
                          <ExternalLink size={10} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </td>
                      <td className="px-5 sm:px-6 py-4 align-top text-sm font-bold">
                        {order.quantity.toLocaleString()}
                      </td>
                      <td className="px-5 sm:px-6 py-4 align-top">
                         <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border ${
                           order.status === 'Completed' ? 'text-green-500 bg-green-500/10 border-green-500/20' :
                           order.status === 'Pending' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' :
                           'text-white/90 bg-white/5 border-white/10'
                         }`}>
                           {order.status}
                         </span>
                      </td>
                      <td className="px-5 sm:px-6 py-4 align-top text-right">
                         <div className="flex items-center justify-end gap-2">
                            {order.status !== 'REFUNDED' && order.status !== 'CANCELED' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'refund'); }}
                                className="p-2 rounded-lg bg-white/5 hover:bg-yellow-500/10 text-white/90 hover:text-yellow-500 transition-colors group relative border border-transparent"
                                title="Refund Order"
                              >
                                <RefreshCcw size={14} className="group-active:-rotate-180 transition-transform" />
                              </button>
                            )}
                            {order.status !== 'COMPLETED' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'complete'); }}
                                className="p-2 rounded-lg bg-white/5 hover:bg-green-500/10 text-white/90 hover:text-green-500 transition-colors group relative border border-transparent"
                                title="Mark Completed"
                              >
                                <Box size={14} />
                              </button>
                            )}
                            {order.status !== 'CANCELED' && (
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'cancel'); }}
                                 className="p-2 rounded-lg bg-white/5 hover:bg-red-600/10 border border-transparent hover:border-red-600/20 text-white/80 hover:text-red-500 transition-colors"
                                 title="Force Cancel"
                               >
                                 <XCircle size={14} />
                               </button>
                            )}
                         </div>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                       <tr>
                          <td colSpan={6} className="bg-[#080808] p-5 sm:p-8 border-b border-white/5">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                <div>
                                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-3 ml-1">Raw Database Record</p>
                                   <pre className="text-[10px] font-mono text-white/90 bg-black border border-white/10 p-5 rounded-2xl overflow-x-auto">
{JSON.stringify(order, null, 2)}
                                   </pre>
                                </div>
                                <div className="space-y-4">
                                   <div>
                                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-3 ml-1">Financials</p>
                                     <div className="bg-black border border-white/10 p-5 rounded-2xl">
                                        <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Total Cost</p>
                                        <p className="text-xl sm:text-2xl font-black text-green-500 mt-1">${Number(order.charge).toFixed(4)}</p>
                                     </div>
                                   </div>
                                   <div>
                                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-3 ml-1">Timeline</p>
                                     <div className="bg-black border border-white/10 p-5 rounded-2xl">
                                        <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Placed At</p>
                                        <p className="text-sm font-bold text-white mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                     </div>
                                   </div>
                                </div>
                             </div>
                          </td>
                       </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
