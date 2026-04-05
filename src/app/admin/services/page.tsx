'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DownloadCloud, Power, CheckSquare, Search } from 'lucide-react';

interface Service {
  id: string;
  providerServiceId: string;
  name: string;
  category: string;
  providerRate: number;
  userRate: number;
  enabled: boolean;
  provider: { name: string };
}

interface ProviderOption { id: string; name: string; }

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [providers, setProviders] = useState<ProviderOption[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [globalMarkup, setGlobalMarkup] = useState('50');
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<string>('');

  useEffect(() => {
    fetchServices();
    fetchSettings();
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
     try {
       const { data } = await api.get('/admin/providers');
       setProviders(data || []);
       if (data && data.length > 0) setSelectedProviderId(data[0].id);
     } catch (err) {
       console.error('Failed to fetch providers', err);
     }
  };

  const fetchSettings = async () => {
     try {
       const { data } = await api.get('/services/admin/settings');
       if (data.globalMarkup) setGlobalMarkup(data.globalMarkup.toString());
     } catch (err) {
       console.error('Failed to fetch settings', err);
     }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/services/admin');
      setServices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
     if (!selectedProviderId) return alert('Please select a provider first.');
     try {
       setImporting(true);
       await api.post('/services/admin/import', { providerId: selectedProviderId });
       fetchServices();
     } catch (err) {
       console.error('Import failed', err);
     } finally {
       setImporting(false);
     }
  };

  const toggleStatus = async (id: string, current: boolean) => {
     try {
       await api.patch(`/services/admin/${id}`, { enabled: !current });
       fetchServices();
     } catch (err) {
       console.error(err);
     }
  };

  const saveRate = async (id: string) => {
     try {
       await api.patch(`/services/admin/${id}`, { userRate: parseFloat(editRate) });
       setEditingId(null);
       fetchServices();
     } catch (err) {
       console.error(err);
     }
  };

  const applyGlobalMarkup = async () => {
     if(!confirm(`Apply a global +${globalMarkup}% markup to all services based on their origin provider rate?`)) return;
     try {
       setBulkUpdating(true);
       await api.patch('/services/admin/markup', { markup: parseFloat(globalMarkup) });
       fetchServices();
     } catch (err) {
       console.error(err);
     } finally {
       setBulkUpdating(false);
     }
  };

  return (
    <div className="max-w-7xl space-y-8 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tight">Service Directory</h2>
          <p className="text-white/40 text-sm font-medium mt-1">Regulate active services and internal markup margins.</p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
           <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden p-1">
             <span className="px-3 text-[10px] font-black uppercase tracking-widest text-white/40">Global Markup (%)</span>
             <input type="number" step="1" value={globalMarkup} onChange={e => setGlobalMarkup(e.target.value)} className="w-16 bg-transparent text-sm font-bold text-center outline-none" />
             <button onClick={applyGlobalMarkup} disabled={bulkUpdating} className="px-3 py-2 bg-red-600/20 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50">
                {bulkUpdating ? '...' : 'Apply'}
             </button>
           </div>
           
           <div className="flex items-center bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden p-1">
             <span className="px-3 text-[10px] font-black uppercase tracking-widest text-white/40">From Provider</span>
             <select 
               value={selectedProviderId} 
               onChange={e => setSelectedProviderId(e.target.value)}
               className="bg-transparent text-sm font-bold outline-none px-2 py-1 max-w-[150px] italic"
             >
               <option value="" disabled className="bg-black">Select Provider</option>
               {providers.map(p => (
                 <option key={p.id} value={p.id} className="bg-black">{p.name}</option>
               ))}
             </select>
             <button 
                onClick={handleImport} disabled={importing || !selectedProviderId}
                className="px-4 py-2 bg-red-600 text-white hover:bg-white hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
             >
                {importing ? '...' : <DownloadCloud size={14} />}
             </button>
           </div>
        </div>
      </div>

      <div className="rounded-3xl bg-black border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#050505]">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">ID / Category</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Service Asset</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Base Rate</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Client Rate (Markup)</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Provider</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                       <div className="inline-block h-8 w-8 border-2 border-white/20 border-t-red-600 rounded-full animate-spin"></div>
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-sm font-bold text-white/40">No services synchronized. Click "Sync External Nodes" to pull upstream inventory.</td>
                  </tr>
                ) : (
                  services.map(srv => (
                    <tr key={srv.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${!srv.enabled ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4 align-top">
                        <p className="text-xs font-mono font-bold text-white/60 mb-1">{srv.providerServiceId}</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest truncate max-w-[150px]">{srv.category}</p>
                      </td>
                      <td className="px-6 py-4 align-top max-w-[300px]">
                        <p className="text-sm font-bold truncate">{srv.name}</p>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <p className="text-sm font-bold text-white/40">${Number(srv.providerRate).toFixed(3)}</p>
                      </td>
                      <td className="px-6 py-4 align-top">
                        {editingId === srv.id ? (
                           <div className="flex gap-2">
                              <input type="number" step="0.001" autoFocus value={editRate} onChange={(e) => setEditRate(e.target.value)} onKeyDown={(e) => { if(e.key==='Enter') saveRate(srv.id); if(e.key==='Escape') setEditingId(null); }} className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm font-bold" />
                              <button onClick={() => saveRate(srv.id)} className="text-[10px] font-black uppercase px-2 py-1 bg-green-500/20 text-green-500 rounded">Save</button>
                           </div>
                        ) : (
                           <button onClick={() => { setEditingId(srv.id); setEditRate(srv.userRate.toString()); }} className="text-sm font-black text-green-400 hover:text-green-300 transition-colors border-b border-transparent hover:border-green-300 pb-0.5">
                             ${Number(srv.userRate).toFixed(3)}
                           </button>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="px-2 py-1 rounded bg-white/[0.02] border border-white/10 text-[9px] font-black uppercase tracking-widest">{srv.provider?.name || 'Unknown'}</span>
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                         <button 
                           onClick={() => toggleStatus(srv.id, srv.enabled)}
                           className={`p-2 rounded-xl transition-all ${srv.enabled ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black' : 'bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white'}`}
                         >
                           <Power size={14} />
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
