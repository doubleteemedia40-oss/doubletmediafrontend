'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DownloadCloud, Percent, Trash2, Power, Webhook } from 'lucide-react';

interface SmmProvider {
  id: string;
  name: string;
  apiUrl: string;
  balance: number;
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<SmmProvider[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newProvider, setNewProvider] = useState({ name: '', apiUrl: '', apiKey: '' });
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', apiUrl: '', apiKey: '' });
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [pingStatus, setPingStatus] = useState<Record<string, 'success'|'fail'>>({});

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/providers');
      setProviders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAdding(true);
      await api.post('/admin/providers', newProvider);
      setNewProvider({ name: '', apiUrl: '', apiKey: '' });
      fetchProviders();
    } catch (err) {
      console.error('Failed to add provider', err);
    } finally {
      setAdding(false);
    }
  };

  const handleSync = async (id: string) => {
    try {
      await api.get(`/admin/providers/${id}/balance`);
      fetchProviders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Destroy this provider link?')) return;
    try {
       await api.delete(`/admin/providers/${id}`);
       fetchProviders();
    } catch (err) {
       console.error(err);
    }
  };

  const handleEditSave = async (id: string) => {
    try {
      await api.patch(`/admin/providers/${id}`, editForm);
      setEditingId(null);
      fetchProviders();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePing = async (id: string) => {
    setPingingId(id);
    try {
      await api.get(`/admin/providers/${id}/balance`);
      setPingStatus(prev => ({ ...prev, [id]: 'success' }));
    } catch (err) {
      setPingStatus(prev => ({ ...prev, [id]: 'fail' }));
    } finally {
      setPingingId(null);
      setTimeout(() => setPingStatus(prev => { const n = {...prev}; delete n[id]; return n; }), 3000);
    }
  };

  return (
    <div className="max-w-6xl space-y-8 relative z-10">
      <div>
        <h2 className="text-3xl font-black italic uppercase tracking-tight">External Nodes</h2>
        <p className="text-black/70 dark:text-white/70 text-sm font-medium mt-1">Manage API gateways to SMM reseller panels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Provider */}
        <div className="lg:col-span-1 border border-black/10 dark:border-white/10 rounded-3xl bg-white dark:bg-black p-6 h-fit">
           <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-600 mb-6 flex items-center gap-2">
             <Webhook size={16} /> Establish Link
           </h3>
           <form onSubmit={handleAdd} className="space-y-4">
              <input 
                 className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold placeholder:text-black/60 dark:text-white/60 outline-none focus:border-red-600/50"
                 placeholder="Alias (e.g. SMM Raja)" type="text" required
                 value={newProvider.name} onChange={e => setNewProvider({...newProvider, name: e.target.value})}
              />
              <input 
                 className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold placeholder:text-black/60 dark:text-white/60 outline-none focus:border-red-600/50"
                 placeholder="API Endpoint URL" type="url" required
                 value={newProvider.apiUrl} onChange={e => setNewProvider({...newProvider, apiUrl: e.target.value})}
              />
              <input 
                 className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold placeholder:text-black/60 dark:text-white/60 outline-none focus:border-red-600/50"
                 placeholder="API Secret Key" type="password" required
                 value={newProvider.apiKey} onChange={e => setNewProvider({...newProvider, apiKey: e.target.value})}
              />
              <button 
                 type="submit" disabled={adding}
                 className="w-full bg-red-600 text-black dark:text-white font-black uppercase text-[10px] tracking-widest py-4 rounded-xl hover:bg-black dark:bg-white hover:text-white dark:text-black transition-colors"
              >
                 {adding ? 'Connecting...' : 'Establish Provider'}
              </button>
           </form>
        </div>

         {/* Existing Providers */}
         <div className="lg:col-span-2 space-y-4">
            {loading ? (
               <div className="p-10 flex justify-center"><div className="h-8 w-8 border-2 border-black/20 dark:border-white/20 border-t-red-600 rounded-full animate-spin"></div></div>
            ) : providers.length === 0 ? (
               <div className="p-10 border border-black/5 dark:border-white/5 rounded-3xl text-center text-sm font-bold text-black/70 dark:text-white/70">No external providers linked.</div>
            ) : (
               providers.map((p) => (
                  <div key={p.id} className={`p-6 border ${pingStatus[p.id] === 'success' ? 'border-green-500/50 bg-green-500/5' : pingStatus[p.id] === 'fail' ? 'border-red-600/50 bg-red-600/5' : 'border-black/10 dark:border-white/10 bg-white dark:bg-black'} rounded-3xl flex flex-col md:flex-row md:items-center gap-6 justify-between group transition-colors duration-300`}>
                     {editingId === p.id ? (
                        <div className="flex-1 space-y-3">
                           <input className="w-full bg-black/[0.05] dark:bg-white/[0.05] border border-black/20 dark:border-white/20 rounded-xl px-4 py-2 text-sm font-bold placeholder:text-black/60 dark:text-white/60" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Alias" />
                           <input className="w-full bg-black/[0.05] dark:bg-white/[0.05] border border-black/20 dark:border-white/20 rounded-xl px-4 py-2 text-sm font-bold placeholder:text-black/60 dark:text-white/60" value={editForm.apiUrl} onChange={e => setEditForm({...editForm, apiUrl: e.target.value})} placeholder="URL" />
                           <input className="w-full bg-black/[0.05] dark:bg-white/[0.05] border border-black/20 dark:border-white/20 rounded-xl px-4 py-2 text-sm font-bold placeholder:text-black/60 dark:text-white/60" value={editForm.apiKey} onChange={e => setEditForm({...editForm, apiKey: e.target.value})} placeholder="New API Key (Leave blank to keep)" type="password" />
                           <div className="flex gap-2">
                             <button onClick={() => handleEditSave(p.id)} className="px-4 py-2 bg-green-500/20 text-green-500 border border-green-500/30 text-xs font-black uppercase tracking-widest rounded-lg">Save</button>
                             <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 text-xs font-black uppercase tracking-widest rounded-lg">Cancel</button>
                           </div>
                        </div>
                     ) : (
                        <>
                           <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-center">
                                 <Webhook size={20} className={pingStatus[p.id] === 'success' ? 'text-green-500' : pingStatus[p.id] === 'fail' ? 'text-red-600' : 'text-black/70 dark:text-white/70'} />
                              </div>
                              <div>
                                 <h4 className="text-lg font-black">{p.name}</h4>
                                 <p className="text-xs text-black/70 dark:text-white/70 font-bold truncate max-w-[200px]">{p.apiUrl}</p>
                              </div>
                           </div>
                           
                           <div className="flex flex-col md:flex-row md:items-center gap-6">
                              <div className="text-right">
                                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/70 dark:text-white/70">API Reserve</p>
                                 <p className="text-xl font-black text-green-500">₦{p.balance !== undefined ? p.balance.toFixed(2) : '---'}</p>
                              </div>
                              
                              <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                                 <button onClick={() => handlePing(p.id)} disabled={pingingId === p.id} className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:text-black dark:text-white hover:border-black/40 dark:hover:border-white/40 disabled:opacity-50 transition-colors">
                                    {pingingId === p.id ? '...' : 'Ping'}
                                 </button>
                                 <button onClick={() => handleSync(p.id)} className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:text-black dark:text-white hover:border-black/40 dark:hover:border-white/40 transition-colors">
                                    Sync
                                 </button>
                                 <button onClick={() => { setEditingId(p.id); setEditForm({ name: p.name, apiUrl: p.apiUrl, apiKey: '' }); }} className="px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-widest hover:text-black dark:text-white hover:border-black/40 dark:hover:border-white/40 transition-colors">
                                    Edit
                                 </button>
                                 <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-black dark:text-white transition-colors">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </div>
                        </>
                     )}
                  </div>
               ))
            )}
         </div>
        
      </div>
    </div>
  );
}
