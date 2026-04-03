'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Users, Edit2, ShieldBan, ShieldCheck, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface User {
  id: string;
  email: string;
  name: string;
  balance: any;
  role: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editBalanceId, setEditBalanceId] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState<number>(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setUsers(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (id: string, currentStatus: boolean) => {
    alert('User suspending is currently disabled in this environment.');
  };

  const updateBalance = async (id: string) => {
    const user = users.find(u => u.id === id);
    if(!user) return;
    const diff = newBalance - Number(user.balance || 0);
    if(diff === 0) { setEditBalanceId(null); return; }
    
    try {
      await api.patch(`/users/${id}/balance`, { 
         amount: Math.abs(diff), 
         type: diff > 0 ? 'increment' : 'decrement' 
      });
      setEditBalanceId(null);
      fetchUsers();
    } catch (err) {
      console.error('Failed to update balance', err);
    }
  };

  return (
    <div className="max-w-7xl space-y-6 sm:space-y-8 relative z-10 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">User Management</h2>
          <p className="text-white/40 text-sm font-medium mt-1">Manage platform users and account balances.</p>
        </div>
        <div className="w-fit px-4 py-2 rounded-xl bg-red-600/10 text-red-600 border border-red-600/20 text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Users size={14} /> Total Users: {users.length}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl sm:rounded-3xl bg-black border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-[#050505]">
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">User Info</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Access Level</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Wallet Balance</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</th>
                <th className="px-5 sm:px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                     <div className="inline-block h-6 w-6 border-2 border-white/20 border-t-red-600 rounded-full animate-spin" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-sm font-bold text-white/40">No users found on the platform.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b last:border-0 border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 sm:px-6 py-4 align-middle">
                      <p className="text-sm font-bold truncate max-w-[200px]">{user.name || 'Unnamed User'}</p>
                      <p className="text-xs text-white/40 font-medium mt-0.5 truncate max-w-[200px]">{user.email}</p>
                    </td>
                    <td className="px-5 sm:px-6 py-4 align-middle">
                      <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] ${user.role === 'ADMIN' ? 'bg-red-600/10 text-red-600 border border-red-600/20' : 'bg-white/5 text-white/60 border border-white/10'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4 align-middle">
                      {editBalanceId === user.id ? (
                        <div className="flex items-center gap-2">
                           <div className="relative w-28">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40 text-xs">$</span>
                              <input 
                                type="number" 
                                value={newBalance} 
                                onChange={(e) => setNewBalance(Number(e.target.value))}
                                className="w-full bg-white/[0.05] border border-white/20 rounded-lg pl-6 pr-2 py-1.5 outline-none font-bold text-sm"
                              />
                           </div>
                           <button onClick={() => updateBalance(user.id)} className="p-1.5 bg-green-500 rounded text-black hover:bg-green-400">
                             <DollarSign size={14} />
                           </button>
                           <button onClick={() => setEditBalanceId(null)} className="text-[10px] font-black uppercase tracking-wider text-white/40 hover:text-white px-2">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                           <p className="text-sm font-bold">${Number(user.balance || 0).toFixed(2)}</p>
                           <button onClick={() => { setEditBalanceId(user.id); setNewBalance(Number(user.balance || 0)); }} className="text-white/30 hover:text-white transition-colors">
                             <Edit2 size={12} />
                           </button>
                        </div>
                      )}
                    </td>
                    <td className="px-5 sm:px-6 py-4 align-middle">
                         <span className="px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] bg-green-500/10 border border-green-500/20 text-green-500 flex w-fit items-center gap-1.5">
                           <ShieldCheck size={10} /> Active
                         </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4 align-middle text-right">
                       <button 
                         onClick={() => toggleBan(user.id, false)}
                         className="text-[9px] font-black uppercase tracking-[0.1em] px-3 py-2 rounded-xl bg-white/5 hover:bg-red-600/20 border border-transparent hover:border-red-600/30 text-white/60 hover:text-red-500 transition-all font-medium flex items-center gap-1.5 ml-auto"
                       >
                         <ShieldBan size={12} />
                         Suspend
                       </button>
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
