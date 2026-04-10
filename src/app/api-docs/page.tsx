'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { Code, Terminal, Key, Cpu, ArrowRight, Zap, Database } from 'lucide-react';
import Link from 'next/link';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 sm:pb-32">
        <div className="container-custom max-w-6xl mx-auto">
          
          <div className="mb-16 sm:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-8 italic uppercase text-black dark:text-white">
                Developer <span className="text-red-600">API.</span>
              </h1>
              <p className="text-lg sm:text-xl text-black/70 dark:text-white/70 font-medium leading-relaxed">
                Integrate DoubleTBoosting's industry-leading social infrastructure into your own applications. Our robust REST API allows for seamless order automation, service sync, and balance management.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-20">
            {/* Sidebar Sticky Nav */}
            <div className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-32 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/50 dark:text-white/50 mb-6">Documentation</p>
                {['Introduction', 'Authentication', 'Services', 'Orders', 'User Balance', 'Error Codes'].map((item) => (
                  <button key={item} className="block w-full text-left text-sm font-bold text-black/70 dark:text-white/70 hover:text-red-600 transition-colors py-2 border-l-2 border-transparent hover:border-red-600 pl-4">
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Docs Content */}
            <div className="lg:col-span-9 space-y-24">
              
              {/* Intro Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4 text-red-600 mb-4">
                  <Terminal size={24} />
                  <h2 className="text-2xl font-black uppercase tracking-tight italic">Getting Started</h2>
                </div>
                <div className="prose prose-invert max-w-none text-black/80 dark:text-white/80 leading-relaxed space-y-4">
                  <p>Our API is built on REST principles and returns JSON-encoded responses. The base URL for all requests is:</p>
                  <div className="p-6 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 font-mono text-sm text-red-500 overflow-x-auto">
                    http://localhost:3001/api
                  </div>
                  <p>All requests must be made over HTTPS in production. Ensure your application handles rate limiting gracefully to avoid temporary suspensions.</p>
                </div>
              </section>

              {/* Auth Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4 text-red-600 mb-4">
                  <Key size={24} />
                  <h2 className="text-2xl font-black uppercase tracking-tight italic">Authentication</h2>
                </div>
                <p className="text-black/80 dark:text-white/80 leading-relaxed">To authenticate your requests, you must include your personal Bearer token in the `Authorization` header of every request.</p>
                <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-[#050505] overflow-hidden shadow-2xl">
                  <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">Header Example</span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600/30" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-600/30" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-600/30" />
                    </div>
                  </div>
                  <pre className="p-8 font-mono text-sm leading-relaxed overflow-x-auto text-black/70 dark:text-white/70">
                    <code>{`Authorization: Bearer YOUR_API_KEY_HERE`}</code>
                  </pre>
                </div>
              </section>

              {/* Endpoint: Orders Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4 text-red-600 mb-4">
                  <Zap size={24} />
                  <h2 className="text-2xl font-black uppercase tracking-tight italic">Create Order</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-black/80 dark:text-white/80 leading-relaxed">Place a new order for any social boosting service available in our catalog.</p>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-md bg-green-900/30 border border-green-600/30 text-green-500 text-[10px] font-black uppercase tracking-widest">POST</span>
                    <span className="text-sm font-mono text-black/80 dark:text-white/80">/orders</span>
                  </div>

                  <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-[#050505] overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                       <span className="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">Request Payload (JSON)</span>
                    </div>
                    <pre className="p-8 font-mono text-[13px] leading-relaxed overflow-x-auto text-blue-400">
                      <code>{`{
  "serviceId": "inst-001",
  "link": "https://instagram.com/p/yourpost",
  "quantity": 1000,
  "comments": "" // Optional
}`}</code>
                    </pre>
                  </div>

                  <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-[#050505] overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                       <span className="text-[10px] font-black uppercase tracking-widest text-black/60 dark:text-white/60">Response (201 Created)</span>
                    </div>
                    <pre className="p-8 font-mono text-[13px] leading-relaxed overflow-x-auto text-green-400">
                      <code>{`{
  "id": 84201,
  "status": "pending",
  "charge": "4.50",
  "currency": "USD",
  "remains": 1000
}`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Pro-User CTA */}
              <section className="relative p-10 sm:p-16 rounded-[3rem] bg-black dark:bg-white text-white dark:text-black overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-white dark:text-black opacity-10 transform translate-x-4 -rotate-12 group-hover:scale-110 transition-transform">
                   <Code size={180} />
                </div>
                <div className="relative z-10 max-w-xl">
                  <h3 className="text-3xl sm:text-4xl font-black italic uppercase mb-6 leading-tight">Need custom<br/>API higher limits?</h3>
                  <p className="text-black/60 font-medium mb-8 leading-relaxed">If you're processing over 100,000 orders monthly, contact our engineering team for dedicated infrastructure and private endpoints.</p>
                  <Link href="/contact" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white dark:bg-black text-black dark:text-white font-black uppercase tracking-widest text-[11px] group active:scale-95 transition-all">
                    Contact Engineering <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
