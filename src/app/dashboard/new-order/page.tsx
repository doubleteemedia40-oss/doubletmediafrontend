'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { ShoppingCart, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface Service {
  id: string;
  name: string;
  category: string;
  userRate: number;
  min: number;
  max: number;
  description: string;
}

export default function NewOrderPage() {
  const { user, refreshUser } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  
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
      const list = data.data || data;
      setServices(list);
      if (list.length > 0) {
        setSelectedCategory(list[0].category);
      }
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  const searchLower = searchQuery.toLowerCase();

  const categories = Array.from(new Set(services.map(s => s.category)))
    .filter(cat => 
       cat.toLowerCase().includes(searchLower) || 
       services.some(s => s.category === cat && s.name.toLowerCase().includes(searchLower))
    );

  const filteredServices = services
    .filter(s => s.category === selectedCategory)
    .filter(s => s.name.toLowerCase().includes(searchLower) || s.category.toLowerCase().includes(searchLower));

  const selectedService = services.find(s => s.id === selectedServiceId);
  const totalCost = selectedService && quantity 
    ? (Number(selectedService.userRate) / 1000) * Number(quantity) 
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-8 w-8 border-2 border-white/20 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">New Order</h2>
        <p className="text-white/70 text-sm font-medium mt-1">Choose a service and enter your target link to get started.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-black border border-white/10"
      >
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-red-600/50 transition-all font-bold text-sm text-white"
              placeholder="Search services or categories (e.g. Instagram Followers)..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 ml-1">Service Category</label>
            <select 
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedServiceId('');
              }}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-600/50 transition-all font-bold text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-900 text-white">{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 ml-1">Select Service</label>
            <select 
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              required
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-600/50 transition-all font-bold text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled>Choose a specific service</option>
              {filteredServices.map((service) => (
                <option key={service.id} value={service.id} className="bg-zinc-900 text-white">
                  {service.name} — ${Number(service.userRate).toFixed(3)} / 1000
                </option>
              ))}
            </select>
          </div>

          {selectedService && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-xl bg-red-600/5 border border-red-600/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={14} className="text-red-600" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Service Details</p>
              </div>
              <p className="text-sm font-medium text-white/90 leading-relaxed mb-3">{selectedService.description}</p>
              <div className="flex gap-6 text-[11px] font-black uppercase tracking-wider text-white/70">
                <p>Min: <span className="text-white">{selectedService.min.toLocaleString()}</span></p>
                <p>Max: <span className="text-white">{selectedService.max.toLocaleString()}</span></p>
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 ml-1">Target Link</label>
            <input 
              type="text" 
              required
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-600/50 transition-all font-bold text-sm"
              placeholder="https://instagram.com/yourprofile"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 ml-1">Quantity</label>
            <input 
              type="number" 
              required
              value={quantity}
              onChange={(e) => {
                const val = e.target.value;
                setQuantity(val === '' ? '' : Number(val));
              }}
              min={selectedService?.min || 1}
              max={selectedService?.max || 10000000}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-600/50 transition-all font-bold text-sm"
              placeholder="Enter quantity"
            />
          </div>

          <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">Total Cost</p>
            <p className="text-2xl font-black">₦{totalCost.toFixed(2)}</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/20 text-red-600 text-sm font-bold flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold flex items-center gap-3">
              <CheckCircle2 size={16} className="shrink-0" />
              {success}
            </div>
          )}

          <button 
            type="submit"
            disabled={submitting || !selectedService || !quantity || !link}
            className="w-full py-4 rounded-2xl bg-red-600 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 shadow-[0_0_40px_-15px_rgba(220,38,38,0.6)]"
          >
            {submitting ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Place Order
                <ShoppingCart size={16} />
              </>
            )}
          </button>

        </form>
      </motion.div>
    </div>
  );
}
