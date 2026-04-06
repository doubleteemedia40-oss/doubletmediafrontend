'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login: setAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      setAuth(access_token, user);
      
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col lg:flex-row pt-16 sm:pt-20 min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5rem)]">
        {/* Left marketing panel — desktop only */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between px-12 xl:px-20 py-16 relative overflow-hidden bg-[#050505] border-r border-white/5">
          <div className="relative z-10 mt-8 max-w-md w-full">
            <div className="space-y-10">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl xl:text-6xl font-black leading-[0.95] uppercase italic"
              >
                SKYROCKET. <br />
                <span className="text-red-600 underline decoration-white/20 decoration-2 underline-offset-4">YOUR SOCIAL</span> <br />
                PRESENCE.
              </motion.h2>
              
              <div className="space-y-5">
                {[
                  { icon: Zap, title: 'Instant Processing', desc: 'Orders start within minutes via our high-speed global delivery network.' },
                  { icon: ShieldCheck, title: 'Unbeatable Pricing', desc: 'Access the lowest rates for premium Instagram, TikTok, YouTube growth & more.' },
                  { icon: Globe, title: 'Guaranteed Results', desc: 'High-quality, stable engagement that sticks. Refills guaranteed.' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-2 rounded-lg bg-red-600/10 border border-red-600/20 text-red-600 shrink-0">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm tracking-tight uppercase italic">{item.title}</h4>
                      <p className="text-xs text-white/70 font-medium leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-md pt-10 border-t border-white/5 mb-8">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-3 italic">DoubleTmedia</p>
             <div className="flex gap-6 opacity-20">
                 <div className="h-5 w-20 bg-white/20 rounded-full border border-white/10" />
                 <div className="h-5 w-16 bg-white/20 rounded-full border border-white/10" />
                 <div className="h-5 w-24 bg-white/20 rounded-full border border-white/10" />
             </div>
          </div>

          {/* Decorative */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        </div>

        {/* Right side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 sm:px-12 xl:px-20 py-12 bg-black flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-8"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight uppercase italic">Sign In</h1>
              <div className="h-1 w-10 bg-red-600 mb-5" />
              <p className="text-white/70 text-sm font-medium">Log in to manage your growth campaigns and orders.</p>
            </div>

            {error && (
              <div className="bg-red-600/10 border border-red-600/20 text-red-600 text-xs p-4 rounded-2xl font-bold flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 flex flex-col w-full">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-600/50 focus:bg-white/[0.05] transition-all font-bold text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Password</label>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-red-600/50 focus:bg-white/[0.05] transition-all font-bold text-sm"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-red-600 font-black uppercase tracking-[0.2em] text-[11px] text-white shadow-[0_0_40px_-15px_rgba(220,38,38,0.6)] hover:bg-white hover:text-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-2"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center w-full text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">
              Don't have an account?{' '}
              <Link href="/register" className="text-red-600 hover:text-white transition-colors ml-1 underline decoration-white/10 underline-offset-4">Register Now</Link>
            </p>
          </motion.div>
        </div>
      </main>
      
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
