'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Globe, ShieldCheck, Users } from 'lucide-react';
import { api } from '@/lib/api';

export default function ContactPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        const map: Record<string, string> = {};
        if (Array.isArray(data)) {
          data.forEach((s: any) => { map[s.key] = s.value; });
        }
        setSettings(map);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 sm:pb-32">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* Left Side: Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-8 italic uppercase text-black dark:text-white">
                Get in <span className="text-red-600">Touch.</span>
              </h1>
              <p className="text-lg text-black/70 dark:text-white/70 font-medium leading-relaxed mb-12 max-w-md">
                Have questions about our services or need custom volume pricing? Our support team is here to help you scale your social presence 24/7.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6 group">
                  <div className="h-14 w-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-black dark:text-white transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60 mb-1">Email Support</p>
                    <p className="text-xl font-bold text-black dark:text-white">{settings['support_email'] || 'support@doubletboosting.com'}</p>
                  </div>
                </div>

                {settings['community_telegram_direct'] && (
                  <a href={settings['community_telegram_direct']} target="_blank" rel="noreferrer" className="flex items-center gap-6 group cursor-pointer">
                    <div className="h-14 w-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#0088cc] group-hover:bg-[#0088cc] group-hover:text-black dark:text-white transition-all">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60 mb-1">Direct Chat</p>
                      <p className="text-xl font-bold text-black dark:text-white hover:text-[#0088cc] transition-colors">Telegram Support</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Community Section */}
              {(settings['community_whatsapp_group'] || settings['community_telegram_channel']) && (
                <div className="mt-12">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50 mb-4">Join our Community</h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {settings['community_whatsapp_group'] && (
                      <a href={settings['community_whatsapp_group']} target="_blank" rel="noreferrer" className="flex-1 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all flex items-center gap-4 group">
                        <div className="h-10 w-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Users size={18} />
                        </div>
                        <span className="text-sm font-bold text-black dark:text-white group-hover:text-[#25D366] transition-colors">WhatsApp Group</span>
                      </a>
                    )}
                    {settings['community_telegram_channel'] && (
                      <a href={settings['community_telegram_channel']} target="_blank" rel="noreferrer" className="flex-1 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 hover:border-[#0088cc] hover:bg-[#0088cc]/10 transition-all flex items-center gap-4 group">
                        <div className="h-10 w-10 rounded-xl bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Users size={18} />
                        </div>
                        <span className="text-sm font-bold text-black dark:text-white group-hover:text-[#0088cc] transition-colors">Telegram Channel</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-16 p-8 rounded-3xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="text-red-600 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-bold text-black dark:text-white text-sm mb-1">Secure Communication</p>
                    <p className="text-black/60 dark:text-white/60 text-xs leading-relaxed">All messages are encrypted and handled with strict confidentiality by our account managers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Globe className="text-red-600 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-bold text-black dark:text-white text-sm mb-1">Global Support</p>
                    <p className="text-black/60 dark:text-white/60 text-xs leading-relaxed">We provide multi-language assistance for our clients in over 120 countries.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-red-600/5 blur-3xl rounded-full pointer-events-none" />
              <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-slate-50 dark:bg-[#050505] border border-black/10 dark:border-white/10 shadow-2xl">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/70 dark:text-white/70 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full h-14 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 text-black dark:text-white focus:outline-none focus:border-red-600 focus:bg-black/10 dark:bg-white/10 transition-all font-medium placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/70 dark:text-white/70 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full h-14 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 text-black dark:text-white focus:outline-none focus:border-red-600 focus:bg-black/10 dark:bg-white/10 transition-all font-medium placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/70 dark:text-white/70 ml-1">Subject</label>
                    <select className="w-full h-14 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-6 text-black dark:text-white focus:outline-none focus:border-red-600 focus:bg-black/10 dark:bg-white/10 transition-all font-medium appearance-none cursor-pointer">
                      <option className="bg-white dark:bg-black">General Inquiry</option>
                      <option className="bg-white dark:bg-black">Volume Pricing</option>
                      <option className="bg-white dark:bg-black">Technical Support</option>
                      <option className="bg-white dark:bg-black">Partnership</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/70 dark:text-white/70 ml-1">Message</label>
                    <textarea 
                      rows={4}
                      placeholder="Tell us how we can help..."
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-6 text-black dark:text-white focus:outline-none focus:border-red-600 focus:bg-black/10 dark:bg-white/10 transition-all font-medium placeholder:text-white/40 resize-none"
                    ></textarea>
                  </div>

                  <button className="w-full h-16 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[11px] rounded-2xl flex items-center justify-center gap-3 hover:bg-red-600 hover:text-black dark:text-white transition-all group active:scale-[0.98]">
                    Send Message
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
