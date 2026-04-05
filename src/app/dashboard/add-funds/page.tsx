'use client';

import { useState, useEffect, Suspense } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useSearchParams } from 'next/navigation';

function AddFundsContent() {
  const { user, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState('');

  const predefinedAmounts = [1000, 2000, 5000, 10000];

  // Handle redirect back from Korapay checkout
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      verifyPayment(ref);
    }
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    try {
      setVerifying(true);
      setError('');
      const { data } = await api.get(`/payments/korapay/verify?reference=${reference}`);
      if (data.status === 'success') {
        setSuccess('Payment verified successfully! Your balance has been updated.');
        if (refreshUser) refreshUser();
      } else {
        setError(`Payment status: ${data.status}. If you were charged, please contact support.`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not verify payment. Contact support if you were charged.');
    } finally {
      setVerifying(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 100) {
       setError('Minimum deposit amount is ₦100');
       return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const { data } = await api.post('/payments/korapay/init', { amount: Number(amount) });
      
      if (data.checkoutUrl) {
         window.location.href = data.checkoutUrl; 
      } else {
         setError('Payment gateway synchronization failed. Please try again later.');
      }
    } catch (err: any) {
       setError(err.response?.data?.message || 'Failed to initialize payment gateway.');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">Add Funds</h2>
        <p className="text-white/40 text-sm font-medium mt-1">Top up your account balance to launch new social growth campaigns.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-black border border-white/10"
        >
          <div className="flex items-center gap-3 mb-2">
            <Wallet size={16} className="text-red-600" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Current Balance</h3>
          </div>
          <p className="text-3xl sm:text-4xl font-black">₦{user?.walletBalance?.toFixed(2) || '0.00'}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-red-600/5 border border-red-600/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={16} className="text-red-600" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Secure Payment</h3>
          </div>
          <p className="text-sm font-bold text-white/80">Payments are securely processed directly by KoraPay. We never store your card data.</p>
        </motion.div>
      </div>

      {verifying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-center"
        >
          <div className="h-6 w-6 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-yellow-500">Verifying your payment...</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-4"
        >
          <CheckCircle size={24} className="text-green-500 shrink-0" />
          <p className="text-sm font-bold text-green-500">{success}</p>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 sm:p-8 rounded-3xl bg-black border border-white/10"
      >
        <form onSubmit={handleCheckout} className="space-y-5 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Quick Select</label>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
               {predefinedAmounts.map((val) => (
                 <button
                   key={val}
                   type="button"
                   onClick={() => setAmount(val)}
                   className={`h-12 rounded-xl text-xs font-black uppercase transition-all ${
                     amount === val 
                     ? 'bg-red-600 text-white shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)]' 
                     : 'bg-white/[0.02] border border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                   }`}
                 >
                   ₦{val.toLocaleString()}
                 </button>
               ))}
             </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 ml-1 sm:ml-2">Custom Amount (NGN)</label>
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-5 sm:pl-6 flex items-center pointer-events-none">
                 <span className="text-white/40 font-black">₦</span>
               </div>
               <input 
                 type="number" 
                 value={amount}
                 onChange={(e) => setAmount(Number(e.target.value))}
                 min={100}
                 step={1}
                 required
                 className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-10 sm:pl-12 pr-5 sm:pr-6 py-4 outline-none focus:border-red-600/50 transition-all font-bold text-lg"
                 placeholder="1000"
               />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/20 text-red-600 text-sm font-bold flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse shrink-0" />
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading || verifying || !amount}
            className="w-full h-14 sm:h-16 mt-4 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_40px_-15px_rgba(255,255,255,0.4)]"
          >
            {loading ? (
               <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                 Proceed to Checkout
                 <CreditCard size={18} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AddFundsPage() {
  return (
    <Suspense fallback={
       <div className="max-w-2xl animate-pulse">
         <div className="h-10 w-48 bg-white/5 rounded-lg mb-4" />
         <div className="h-4 w-72 bg-white/5 rounded-lg mb-8" />
         <div className="grid grid-cols-2 gap-6 mb-8">
           <div className="h-32 bg-white/5 rounded-2xl" />
           <div className="h-32 bg-white/5 rounded-2xl" />
         </div>
         <div className="h-[400px] bg-white/5 rounded-3xl" />
       </div>
    }>
      <AddFundsContent />
    </Suspense>
  );
}
