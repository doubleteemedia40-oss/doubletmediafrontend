'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Globe, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
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
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-8 italic uppercase text-white">
                Get in <span className="text-red-600">Touch.</span>
              </h1>
              <p className="text-lg text-white/70 font-medium leading-relaxed mb-12 max-w-md">
                Have questions about our services or need custom volume pricing? Our support team is here to help you scale your social presence 24/7.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6 group">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Email Support</p>
                    <p className="text-xl font-bold text-white">support@doubletmedia.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Live Telegram</p>
                    <p className="text-xl font-bold text-white">@DoubleTmediaSupport</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="text-red-600 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-bold text-white text-sm mb-1">Secure Communication</p>
                    <p className="text-white/60 text-xs leading-relaxed">All messages are encrypted and handled with strict confidentiality by our account managers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Globe className="text-red-600 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-bold text-white text-sm mb-1">Global Support</p>
                    <p className="text-white/60 text-xs leading-relaxed">We provide multi-language assistance for our clients in over 120 countries.</p>
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
              <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-[#050505] border border-white/10 shadow-2xl">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/70 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:outline-none focus:border-red-600 focus:bg-white/10 transition-all font-medium placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/70 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:outline-none focus:border-red-600 focus:bg-white/10 transition-all font-medium placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/70 ml-1">Subject</label>
                    <select className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:outline-none focus:border-red-600 focus:bg-white/10 transition-all font-medium appearance-none cursor-pointer">
                      <option className="bg-black">General Inquiry</option>
                      <option className="bg-black">Volume Pricing</option>
                      <option className="bg-black">Technical Support</option>
                      <option className="bg-black">Partnership</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/70 ml-1">Message</label>
                    <textarea 
                      rows={4}
                      placeholder="Tell us how we can help..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:border-red-600 focus:bg-white/10 transition-all font-medium placeholder:text-white/40 resize-none"
                    ></textarea>
                  </div>

                  <button className="w-full h-16 bg-white text-black font-black uppercase tracking-widest text-[11px] rounded-2xl flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all group active:scale-[0.98]">
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
