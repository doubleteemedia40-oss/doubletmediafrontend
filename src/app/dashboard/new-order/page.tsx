'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, CheckCircle2, AlertCircle, ShoppingCart, Info, Star, ListCollapse } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface Service {
  id: string;
  name: string;
  category: string;
  providerServiceId: string;
  userRate: number;
  min: number;
  max: number;
  description: string;
}

export default function NewOrderPage() {
  const { user, refreshUser } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'single' | 'mass'>('single');

  // Filters
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('All');
  const [category, setCategory] = useState('All');
  const [budget, setBudget] = useState('No limit');
  const [sort, setSort] = useState('Relevance');

  // Single Order State
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');

  // Mass Order State
  const [massFormat, setMassFormat] = useState<'id_link_qty' | 'one_service_many_urls' | 'link_qty'>('one_service_many_urls');
  const [massData, setMassData] = useState('');
  const [massLinesProcessing, setMassLinesProcessing] = useState(false);
  const [massResults, setMassResults] = useState<{total: number, success: number, failed: number} | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/services');
      setServices(data.data || data);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  const platforms = useMemo(() => {
    const list = ['All', 'Instagram', 'Facebook', 'Twitter', 'TikTok', 'YouTube', 'Telegram', 'Spotify'];
    return list;
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return ['All', ...Array.from(cats)];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.providerServiceId.includes(search)) return false;
      if (category !== 'All' && s.category !== category) return false;
      if (platform !== 'All' && !s.name.toLowerCase().includes(platform.toLowerCase()) && !s.category.toLowerCase().includes(platform.toLowerCase())) return false;
      
      if (budget !== 'No limit') {
        const rate = Number(s.userRate);
        if (budget === '< ₦500' && rate >= 500) return false;
        if (budget === '₦500 - ₦2000' && (rate < 500 || rate > 2000)) return false;
        if (budget === '> ₦2000' && rate <= 2000) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sort === 'Price: Low to High') return Number(a.userRate) - Number(b.userRate);
      if (sort === 'Price: High to Low') return Number(b.userRate) - Number(a.userRate);
      return 0; // Relevance
    });
  }, [services, search, category, platform, budget, sort]);

  const selectedService = services.find(s => s.id === selectedServiceId);
  const totalCost = selectedService && quantity ? (Number(selectedService.userRate) / 1000) * Number(quantity) : 0;

  const clearFilters = () => {
    setSearch('');
    setPlatform('All');
    setCategory('All');
    setBudget('No limit');
    setSort('Relevance');
  };

  const handleSingleSubmit = async () => {
    if (!selectedService || !quantity || !link) return;

    if (totalCost > (user?.walletBalance || 0)) {
       setError('Insufficient account balance. Please add funds first.');
       return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      await api.post('/orders', {
        serviceId: selectedService.id,
        link,
        quantity: Number(quantity)
      });
      
      await refreshUser();
      setSuccess('Order placed successfully! It will start processing shortly.');
      setLink('');
      setQuantity('');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      setError(typeof msg === 'string' ? msg : msg[0]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMassSubmit = async () => {
    const lines = massData.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) {
      setError("Please paste your orders in the data box.");
      return;
    }
    
    if ((massFormat === 'one_service_many_urls' || massFormat === 'link_qty') && !selectedService) {
      setError("Please select a service from the list first.");
      return;
    }

    setError(null);
    setSuccess(null);
    setMassResults(null);
    setMassLinesProcessing(true);

    const ordersToSubmit = [];
    let failCount = 0;

    for (const line of lines) {
      try {
        let sid = selectedService?.id;
        let l = '';
        let q = 0;

        if (massFormat === 'id_link_qty') {
           const parts = line.split(/[|\s,]+/).filter(Boolean);
           if (parts.length < 3) throw new Error("Invalid format");
           const dbService = services.find(s => s.providerServiceId === parts[0]);
           if (!dbService) throw new Error("Service ID not found");
           sid = dbService.id;
           l = parts[1];
           q = parseInt(parts[2]);
        } else if (massFormat === 'link_qty') {
           const parts = line.split(/[|\s,]+/).filter(Boolean);
           if (parts.length < 2) throw new Error("Invalid format");
           l = parts[0];
           q = parseInt(parts[1]);
        } else if (massFormat === 'one_service_many_urls') {
           l = line;
           q = Number(quantity);
           if (!q) throw new Error("Missing quantity");
        }

        if (!sid || !l || !q || isNaN(q)) throw new Error("Incomplete data");
        ordersToSubmit.push({ serviceId: sid, link: l, quantity: q });
      } catch (err) {
        failCount++;
      }
    }

    if (ordersToSubmit.length === 0) {
      setError(`All lines failed validation. Check your format.`);
      setMassLinesProcessing(false);
      return;
    }

    try {
      await api.post('/orders/bulk', { orders: ordersToSubmit });
      await refreshUser();
      
      if (failCount === 0) {
        setSuccess(`Successfully placed all ${ordersToSubmit.length} orders!`);
        setMassData('');
      } else {
        setError(`Placed ${ordersToSubmit.length} orders, but ${failCount} lines had formatting issues.`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to place bulk orders.';
      setError(typeof msg === 'string' ? msg : msg[0]);
    } finally {
      setMassLinesProcessing(false);
    }
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto pb-20">
      
      {/* Top Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 p-1 bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl w-fit">
        <button 
          onClick={() => { setActiveTab('single'); setError(null); setSuccess(null); }}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'single' ? 'bg-[#ff4e4e] text-black dark:text-white shadow-lg' : 'text-black/60 dark:text-white/60 hover:text-black dark:text-white hover:bg-black/5 dark:bg-white/5'}`}
        >
          Single order
        </button>
        <button 
          onClick={() => { setActiveTab('mass'); setError(null); setSuccess(null); }}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'mass' ? 'bg-[#ff4e4e] text-black dark:text-white shadow-lg' : 'text-black/60 dark:text-white/60 hover:text-black dark:text-white hover:bg-black/5 dark:bg-white/5'}`}
        >
          Mass order
        </button>
        <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white/40 cursor-not-allowed">
          Subscription
        </button>
        <div className="ml-2 flex items-center gap-2 bg-[#00e1ff]/10 text-[#00e1ff] px-4 py-2 rounded-xl text-xs font-bold border border-[#00e1ff]/20 hidden sm:flex">
          <CheckCircle2 size={14} /> New services
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* LEFT COMPONENT */}
        <div className="flex-1 w-full space-y-6">
          
          {activeTab === 'mass' && (
            <div className="bg-[#18181A] border border-black/5 dark:border-white/5 rounded-[24px] p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-4">
                 <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                    <ListCollapse className="text-red-500" />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-black dark:text-white">Mass order</h2>
                   <p className="text-black/60 dark:text-white/60 text-sm mt-1">Place many orders at once — pick a format and paste your data</p>
                 </div>
              </div>
              
              <div className="mt-8">
                 <p className="text-[10px] font-black uppercase tracking-[0.1em] text-black/50 dark:text-white/50 mb-3 ml-2">FORMAT</p>
                 <div className="flex flex-wrap gap-3">
                   {[
                     { id: 'id_link_qty', label: 'ID · Link · Qty per line' },
                     { id: 'one_service_many_urls', label: 'One service, many URLs' },
                     { id: 'link_qty', label: 'Link · Qty per line' }
                   ].map(fmt => (
                     <button
                       key={fmt.id}
                       onClick={() => setMassFormat(fmt.id as any)}
                       className={`px-5 py-3 rounded-[16px] text-sm font-bold transition-all border ${
                         massFormat === fmt.id 
                         ? 'bg-[#ff4e4e] text-black dark:text-white border-[#ff4e4e] shadow-lg shadow-red-500/20' 
                         : 'bg-[#222224] text-black/70 dark:text-white/70 border-black/5 dark:border-white/5 hover:border-black/20 dark:border-white/20'
                       }`}
                     >
                       {fmt.label}
                     </button>
                   ))}
                 </div>
              </div>
            </div>
          )}

          <div className="bg-[#18181A] border border-black/5 dark:border-white/5 rounded-[24px] p-4 sm:p-6 lg:p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-black/50 dark:text-white/50 ml-2">SERVICE</p>
              <button onClick={clearFilters} className="text-xs font-bold text-[#ff4e4e] hover:text-[#ff3030]">Clear filters</button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Search by ID, name, category or geo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-[20px] pl-14 pr-6 py-4 text-sm font-bold text-black dark:text-white outline-none focus:border-red-500/50 transition-colors"
               />
            </div>

            {/* Dropdown Filters */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
               <div className="min-w-0">
                 <label className="text-[10px] font-semibold text-white/40 ml-1 mb-1 block">Platform</label>
                 <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-[#18181A] border-b border-black/10 dark:border-white/10 pb-2 text-sm text-black/80 dark:text-white/80 outline-none hover:text-black dark:text-white cursor-pointer appearance-none">
                   {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                 </select>
               </div>
               <div className="min-w-0">
                 <label className="text-[10px] font-semibold text-white/40 ml-1 mb-1 block">Type</label>
                 <select className="w-full bg-[#18181A] border-b border-black/10 dark:border-white/10 pb-2 text-sm text-black/80 dark:text-white/80 outline-none hover:text-black dark:text-white cursor-pointer appearance-none">
                   <option>All</option>
                 </select>
               </div>
               <div className="min-w-0">
                 <label className="text-[10px] font-semibold text-white/40 ml-1 mb-1 block">Category</label>
                 <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#18181A] border-b border-black/10 dark:border-white/10 pb-2 text-sm text-black/80 dark:text-white/80 outline-none hover:text-black dark:text-white cursor-pointer appearance-none truncate">
                   {categories.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <div className="min-w-0">
                 <label className="text-[10px] font-semibold text-white/40 ml-1 mb-1 block">Budget</label>
                 <select value={budget} onChange={e => setBudget(e.target.value)} className="w-full bg-[#18181A] border-b border-black/10 dark:border-white/10 pb-2 text-sm text-black/80 dark:text-white/80 outline-none hover:text-black dark:text-white cursor-pointer appearance-none">
                   <option>No limit</option>
                   <option>&lt; ₦500</option>
                   <option>₦500 - ₦2000</option>
                   <option>&gt; ₦2000</option>
                 </select>
               </div>
               <div className="min-w-0">
                 <label className="text-[10px] font-semibold text-white/40 ml-1 mb-1 block">Sort by</label>
                 <select value={sort} onChange={e => setSort(e.target.value)} className="w-full bg-[#18181A] border-b border-black/10 dark:border-white/10 pb-2 text-sm text-black/80 dark:text-white/80 outline-none hover:text-black dark:text-white cursor-pointer appearance-none">
                   <option>Relevance</option>
                   <option>Price: Low to High</option>
                   <option>Price: High to Low</option>
                 </select>
               </div>
            </div>

            {/* Services List Box */}
            <div className="border border-black/5 dark:border-white/5 rounded-2xl bg-[#111112] overflow-hidden flex flex-col h-[500px]">
               <div className="px-5 py-3 border-b border-black/5 dark:border-white/5 bg-[#18181A] flex items-center justify-between shadow-sm">
                 <p className="text-xs font-semibold text-black/60 dark:text-white/60">Showing {filteredServices.length} of {services.length} services</p>
               </div>
               <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {loading ? (
                     <div className="p-8 flex justify-center"><div className="h-6 w-6 rounded-full border-2 border-red-500 border-t-transparent animate-spin"/></div>
                  ) : filteredServices.length === 0 ? (
                     <p className="p-8 text-center text-white/40 text-sm">No services found matching your filters.</p>
                  ) : (
                     <div className="flex flex-col">
                        {filteredServices.map((service, i) => (
                           <div 
                             key={service.id}
                             onClick={() => setSelectedServiceId(service.id)}
                             className={`p-5 border-b border-black/5 dark:border-white/5 cursor-pointer transition-all hover:bg-black/[0.02] dark:bg-white/[0.02] ${selectedServiceId === service.id ? 'bg-red-500/5 hover:bg-red-500/10 relative z-10' : ''}`}
                           >
                             <div className="flex items-start gap-3">
                               <div className="flex-1">
                                 <h4 className="text-[14px] font-bold text-black/90 dark:text-white/90 leading-snug tracking-tight mb-2">
                                    {service.name}
                                 </h4>
                                 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium">
                                   <span className="text-white/40">ID {service.providerServiceId}</span>
                                   <span className="text-white/20">&bull;</span>
                                   <span className="text-[#ff4e4e] font-bold">₦{Number(service.userRate).toFixed(2)}<span className="text-[#ff4e4e]/60 font-medium">/1k</span></span>
                                   <span className="text-white/20">&bull;</span>
                                   <span className="text-black/60 dark:text-white/60 hidden sm:inline">{service.category}</span>
                                   <span className="text-white/20 hidden sm:inline">&bull;</span>
                                   <span className="text-black/50 dark:text-white/50">{service.min.toLocaleString()} - {service.max.toLocaleString()}</span>
                                 </div>
                               </div>
                               {selectedServiceId === service.id && (
                                 <div className="text-red-500 mt-1"><CheckCircle2 size={18} /></div>
                               )}
                             </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
            
            {/* MASS ORDER DATA TEXTAREA */}
            {activeTab === 'mass' && (
              <div className="mt-8 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-black/50 dark:text-white/50 ml-2">DATA</p>
                <textarea 
                  value={massData}
                  onChange={e => setMassData(e.target.value)}
                  disabled={massLinesProcessing}
                  placeholder={`Paste your orders here... ${massFormat === 'id_link_qty' ? '\nExample:\n3214 https://instagram.com/p/123 100\n3214 https://instagram.com/p/456 500' : ''}`}
                  className="w-full h-[200px] bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-5 text-sm font-medium text-black/90 dark:text-white/90 outline-none focus:border-red-500/50 resize-y font-mono whitespace-nowrap overflow-x-auto scrollbar-thin disabled:opacity-50"
                  spellCheck="false"
                />
              </div>
            )}
            
          </div>
        </div>

        {/* RIGHT COMPONENT */}
        <div className="w-full xl:w-[400px] shrink-0 sticky top-6 space-y-6">
          
          <div className="bg-[#18181A] border border-black/5 dark:border-white/5 rounded-[24px] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-black/5 dark:border-white/5">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-black/50 dark:text-white/50 text-center">SERVICE DETAILS</p>
            </div>
            
            {!selectedService ? (
               <div className="p-10 flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 mb-4 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5">
                     <ListCollapse className="text-white/20" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-2">Select a service</h3>
                  <p className="text-sm text-white/40">Pick one from the list to review details and place your order.</p>
               </div>
            ) : (
               <div className="p-6 space-y-6">
                  
                  <div>
                    <h3 className="text-base font-bold text-black dark:text-white leading-snug mb-3">{selectedService.name}</h3>
                    <div className="p-4 bg-white dark:bg-black/30 rounded-xl border border-black/5 dark:border-white/5 text-sm text-black/70 dark:text-white/70 leading-relaxed font-medium">
                       {selectedService.description || "No description provided for this service."}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-4 bg-white dark:bg-black/30 rounded-xl border border-black/5 dark:border-white/5">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">MIN ORDER</p>
                       <p className="text-lg font-bold text-black dark:text-white">{selectedService.min.toLocaleString()}</p>
                     </div>
                     <div className="p-4 bg-white dark:bg-black/30 rounded-xl border border-black/5 dark:border-white/5">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">MAX ORDER</p>
                       <p className="text-lg font-bold text-black dark:text-white">{selectedService.max.toLocaleString()}</p>
                     </div>
                  </div>

                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent my-6" />

                  {/* FORM RENDERED BASED ON TAB AND LOGIC */}
                  
                  {(activeTab === 'single') && (
                     <div className="space-y-5">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50 ml-1">Link</label>
                         <input 
                           type="text" 
                           value={link}
                           onChange={e => setLink(e.target.value)}
                           className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-[16px] px-5 py-4 outline-none focus:border-red-500/50 text-sm font-bold placeholder:text-white/20 hover:bg-white dark:bg-black/60 transition-colors"
                           placeholder="https://..."
                         />
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50 ml-1">Quantity</label>
                         <div className="relative">
                           <input 
                             type="number" 
                             value={quantity}
                             min={selectedService.min}
                             max={selectedService.max}
                             onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                             className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-[16px] pl-5 pr-12 py-4 outline-none focus:border-red-500/50 text-sm font-bold placeholder:text-white/20 hover:bg-white dark:bg-black/60 transition-colors"
                             placeholder={`Min: ${selectedService.min}`}
                           />
                         </div>
                       </div>
                       
                       <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-[16px] p-5">
                          <p className="text-xs font-black uppercase tracking-widest text-red-500/70">Total Cost</p>
                          <p className="text-2xl font-black text-red-500">₦{totalCost.toFixed(2)}</p>
                       </div>
                     </div>
                  )}

                  {activeTab === 'mass' && massFormat === 'one_service_many_urls' && (
                     <div className="space-y-5">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-[#00e1ff] ml-1">Quantity Per Link</label>
                         <input 
                           type="number" 
                           value={quantity}
                           onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                           className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-[16px] px-5 py-4 outline-none focus:border-[#00e1ff]/50 text-sm font-bold placeholder:text-white/20 transition-colors shadow-[0_0_15px_-3px_rgba(0,225,255,0.1)]"
                           placeholder={`Quantity applied to each link`}
                         />
                       </div>
                       <p className="text-xs text-white/40 leading-relaxed bg-black/5 dark:bg-white/5 p-4 rounded-xl">In <strong className="text-black dark:text-white">"One service, many URLs"</strong> format, just paste links in the Data textbox. We will apply this service and quantity to every link automatically.</p>
                     </div>
                  )}
                  
                  {activeTab === 'mass' && massFormat === 'link_qty' && (
                     <div className="space-y-5">
                       <p className="text-xs text-white/40 leading-relaxed bg-black/5 dark:bg-white/5 p-4 rounded-xl">In <strong className="text-black dark:text-white">"Link · Qty per line"</strong> format, parse your text as `link quantity` on each line. This chosen service will apply to all of them.</p>
                     </div>
                  )}
                  
               </div>
            )}
          </div>
          
          {/* RESULTS/MESSAGES (Sticky under details) */}
          <AnimatePresence>
             {error && (
               <motion.div initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y: 0 }} exit={{ opacity:0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex gap-3">
                 <AlertCircle className="shrink-0 mt-0.5" size={16} />
                 <span>{error}</span>
               </motion.div>
             )}
             {success && (
               <motion.div initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y: 0 }} exit={{ opacity:0 }} className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold flex gap-3">
                 <CheckCircle2 className="shrink-0 mt-0.5" size={16} />
                 <span>{success}</span>
               </motion.div>
             )}
          </AnimatePresence>

          {/* ACTION BUTTON */}
          <div className="pt-2">
             {activeTab === 'single' ? (
                <button 
                  onClick={handleSingleSubmit}
                  disabled={submitting || !selectedService || !quantity || !link}
                  className="w-full py-5 rounded-[20px] bg-[#ff4e4e] text-black dark:text-white font-black uppercase tracking-widest text-xs hover:bg-black dark:bg-white hover:text-white dark:text-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 shadow-[0_0_40px_-10px_rgba(255,78,78,0.4)]"
                >
                  {submitting ? <div className="h-5 w-5 border-2 border-black/30 dark:border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit Order'}
                </button>
             ) : (
                <button 
                  onClick={handleMassSubmit}
                  disabled={massLinesProcessing}
                  className="w-full py-5 rounded-[20px] bg-[#ff4e4e] text-black dark:text-white font-black uppercase tracking-widest text-xs hover:bg-black dark:bg-white hover:text-white dark:text-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 shadow-[0_0_40px_-10px_rgba(255,78,78,0.4)]"
                >
                  {massLinesProcessing ? 'Processing mass order...' : 'Submit Mass Order'}
                </button>
             )}
          </div>

        </div>

      </div>
    </div>
  );
}
