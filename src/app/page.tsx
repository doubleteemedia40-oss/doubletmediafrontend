'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, BarChart3, ShieldCheck, Globe, Star, Users, ArrowRight, TrendingUp, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black flex flex-col items-center justify-center min-h-[100dvh] py-16 sm:py-32 gap-8 sm:gap-20">
          {/* Advanced Dribbble Lighting & Grid */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
             {/* Center Glow */}
             <div className="absolute top-0 w-full max-w-[1000px] h-[600px] bg-red-600/15 blur-[150px] rounded-full mix-blend-screen transform -translate-y-1/2" />
             <div className="absolute top-1/4 w-[400px] h-[400px] bg-red-800/20 blur-[120px] rounded-full mix-blend-screen" />
             
             {/* Perspective Grid Fading Out */}
             <div className="absolute bottom-0 left-0 w-full h-[80vh] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_10%,#000_10%,transparent_70%)] [transform:perspective(1000px)_rotateX(60deg)_scale(2.5)] origin-top pointer-events-none" />
          </div>

          <div className="container-custom relative z-20 flex flex-col items-center text-center w-full max-w-5xl mx-auto h-full flex-grow py-6 sm:py-12">
            


            {/* Main Typography */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.5rem] sm:text-7xl md:text-8xl lg:text-[100px] xl:text-[110px] font-black tracking-[-0.04em] mb-4 sm:mb-6 leading-[0.95] text-white"
            >
               #1 Social Media
               <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/30 tracking-tight">Marketplace.</span>
            </motion.h1>

             <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-base sm:text-xl lg:text-2xl text-white/40 font-medium max-w-2xl mb-6 sm:mb-10 leading-relaxed px-2 sm:px-0"
             >
                Accelerate your social media growth with DoubleTmedia. Quickly gain real followers, viewers, likes & more with our advanced blend of marketing tactics.
             </motion.p>

             {/* Buttons */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto"
             >
                <Link href="/register" className="group relative w-full sm:w-auto h-14 px-10 rounded-full bg-white text-black font-black uppercase tracking-[0.1em] text-[11px] flex items-center justify-center gap-3 transition-transform active:scale-[0.98] overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">Start Growing <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link href="#services" className="w-full sm:w-auto h-14 px-10 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-white font-bold uppercase tracking-[0.1em] text-[11px] flex items-center justify-center transition-all backdrop-blur-md">
                  View Services
                </Link>
             </motion.div>

             {/* Dribbble-Style Floating Glass UI */}
             <motion.div 
               initial={{ opacity: 0, y: 60 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
               className="mt-8 sm:mt-16 lg:mt-24 w-full max-w-4xl relative"
             >
               <div className="relative w-full aspect-[16/9] sm:aspect-[21/8] bg-[#050505]/40 backdrop-blur-3xl border border-white/[0.08] rounded-t-[1.5rem] sm:rounded-t-[2.5rem] shadow-[0_-20px_80px_rgba(220,38,38,0.05)] overflow-hidden flex items-end justify-center">
                 {/* Top Window Bar */}
                 <div className="absolute top-0 left-0 w-full h-8 sm:h-12 border-b border-white/[0.05] flex items-center px-4 sm:px-6 gap-1.5 sm:gap-2 bg-white/[0.01]">
                   <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500/50" />
                   <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-500/50" />
                   <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-500/50" />
                 </div>

                 {/* Simulated UI Content */}
                 <div className="w-full h-[calc(100%-2rem)] sm:h-[calc(100%-3rem)] flex items-end justify-center p-3 sm:p-8 gap-2 sm:gap-8 opacity-80">
                   {/* Card 1 */}
                   <div className="w-1/2 sm:w-1/3 h-full max-h-[100px] sm:max-h-[140px] bg-white/[0.02] border border-white/[0.05] rounded-xl sm:rounded-2xl flex flex-col justify-end p-3 sm:p-5 relative overflow-hidden group hover:border-red-600/30 transition-colors">
                     <div className="absolute top-3 left-3 sm:top-5 sm:left-5 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white/[0.05] flex items-center justify-center text-white/30"><BarChart3 size={12} className="sm:hidden" /><BarChart3 size={14} className="hidden sm:block" /></div>
                     <p className="text-[8px] sm:text-[10px] font-bold text-white/40 uppercase tracking-wider mb-0.5 sm:mb-1">Followers</p>
                     <p className="text-lg sm:text-2xl font-black text-white">+14,029</p>
                     <p className="text-[8px] sm:text-[10px] font-bold text-green-500 mt-1 sm:mt-2 flex items-center gap-1"><TrendingUp size={10} className="sm:hidden" /><TrendingUp size={12} className="hidden sm:block" /> 94%</p>
                   </div>
                   {/* Card 2 (Elevated) */}
                   <div className="w-1/2 sm:w-1/3 h-full max-h-[130px] sm:max-h-[190px] bg-red-600/10 border border-red-600/20 rounded-xl sm:rounded-2xl flex flex-col justify-end p-3 sm:p-5 relative overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.15)] transform -translate-y-2 sm:-translate-y-4">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600/0 via-red-500 to-red-600/0" />
                     <div className="absolute top-3 left-3 sm:top-5 sm:left-5 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-red-600/20 flex items-center justify-center text-red-500"><Zap size={12} className="sm:hidden" /><Zap size={14} className="hidden sm:block" /></div>
                     <p className="text-[8px] sm:text-[10px] font-bold text-red-500/80 uppercase tracking-wider mb-0.5 sm:mb-1">Active Orders</p>
                     <p className="text-xl sm:text-3xl font-black text-white">402</p>
                     <p className="text-[8px] sm:text-[10px] font-bold text-white/40 mt-1 sm:mt-2">Delivering currently</p>
                   </div>
                   {/* Card 3 */}
                   <div className="w-1/3 h-full max-h-[140px] bg-white/[0.02] border border-white/[0.05] rounded-xl sm:rounded-2xl flex flex-col justify-end p-3 sm:p-5 relative overflow-hidden group hover:border-red-600/30 transition-colors hidden sm:flex">
                     <div className="absolute top-5 left-5 h-8 w-8 rounded-full bg-white/[0.05] flex items-center justify-center text-white/30"><Wallet size={14} /></div>
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Spent Today</p>
                     <p className="text-2xl font-black text-white">$84.50</p>
                     <p className="text-[10px] font-bold text-white/30 mt-2">API Balance</p>
                   </div>
                 </div>
                 
                 {/* Fades out bottom */}
                 <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
               </div>
             </motion.div>
          </div>
        </section>

        {/* Spacer to guarantee Banner is off-screen */}
        <div className="h-24 sm:h-32 lg:h-48 bg-black w-full" />




        {/* Banner Section — Animated Marquee */}
        <section className="w-full relative z-10 border-y border-white/[0.06]">
          <div className="w-full h-24 sm:h-32 md:h-40 xl:h-48 relative overflow-hidden bg-black">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[120px] rounded-full" />
            </div>

            {/* Marquee Row 1 — scrolls left */}
            <div className="absolute top-[15%] sm:top-[18%] left-0 w-full flex whitespace-nowrap animate-marquee">
              {[...Array(2)].map((_, i) => (
                <span key={i} className="flex items-center gap-4 sm:gap-6 mr-4 sm:mr-6 text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-[0.25em] text-white/[0.06]">
                  {['Followers', 'Likes', 'Views', 'Subscribers', 'Comments', 'Shares', 'Retweets', 'Saves', 'Impressions', 'Reach', 'Engagement', 'Growth'].map((w) => (
                    <span key={w} className="flex items-center gap-4 sm:gap-6">
                      {w}
                      <span className="text-red-600/30">✦</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>

            {/* Marquee Row 2 — scrolls right */}
            <div className="absolute bottom-[15%] sm:bottom-[18%] left-0 w-full flex whitespace-nowrap animate-marquee-reverse">
              {[...Array(2)].map((_, i) => (
                <span key={i} className="flex items-center gap-4 sm:gap-6 mr-4 sm:mr-6 text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-[0.25em] text-white/[0.06]">
                  {['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter / X', 'Spotify', 'Threads', 'Discord', 'Telegram', 'LinkedIn', 'Twitch', 'Snapchat'].map((w) => (
                    <span key={w} className="flex items-center gap-4 sm:gap-6">
                      {w}
                      <span className="text-red-600/30">✦</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>

            {/* Floating glass stat pills */}
            <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 sm:gap-6 pointer-events-none">
              {[
                { label: '2 M+ Orders', accent: true },
                { label: '10 K+ Clients', accent: false },
                { label: '99.9% Uptime', accent: false },
              ].map((pill) => (
                <div
                  key={pill.label}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full backdrop-blur-xl text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] border shadow-lg
                    ${pill.accent
                      ? 'bg-red-600/15 border-red-600/30 text-red-400 shadow-red-600/10'
                      : 'bg-white/[0.04] border-white/[0.08] text-white/60'
                    }`}
                >
                  {pill.label}
                </div>
              ))}
            </div>

            {/* Edge fades */}
            <div className="absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-20" />
            <div className="absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-20" />
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 sm:py-32">
          <div className="container-custom">
            <div className="mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 tracking-tight uppercase italic underline decoration-red-600 decoration-4 underline-offset-8">Social Boosting</h2>
                <p className="text-white/40 font-medium leading-relaxed">
                  Professional Social Boosting. Accelerate your reach with real engagement and algorithmic impact. Instantly delivered across all major platforms.
                </p>
              </div>
              <Link href="/register" className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 hover:text-white flex items-center gap-2 group transition-colors whitespace-nowrap">
                Create Free Account <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { image: '/platforms/instagram.png', title: 'Instagram', desc: 'Accelerate your influence with high-quality followers, likes, and reel views delivered instantly.' },
                { image: '/platforms/tiktok.png', title: 'TikTok', desc: 'Skyrocket your videos to the For You page with real engagement and massive view spikes.' },
                { image: '/platforms/youtube.png', title: 'YouTube', desc: 'Gain real subscribers and high-retention views to boost your channel rank and watch time.' },
                { image: '/platforms/facebook.png', title: 'Facebook', desc: 'Solidify your social proof with professional page likes and post engagement at scale.' },
                { image: '/platforms/x.png', title: 'X (Twitter)', desc: 'Amplify your voice with real followers and retweets to dominate global conversations.' },
                { icon: Globe, title: 'More Platforms', desc: 'Support for Spotify, Threads, Discord, and 20+ other major social ecosystems worldwide.' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="p-8 sm:p-10 rounded-3xl bg-[#080808] border border-white/5 group hover:border-red-600/30 transition-all duration-500 relative overflow-hidden flex flex-col h-full">
                     <div className="p-3 sm:p-4 rounded-2xl bg-red-600/10 border border-red-600/20 text-red-600 w-fit mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500">
                       {item.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={item.image} alt={item.title} className="w-12 h-12 object-contain" />
                       ) : (
                          Icon && <Icon size={28} />
                       )}
                     </div>
                     <h4 className="text-lg sm:text-2xl font-black mb-3 sm:mb-4 uppercase tracking-tight italic">{item.title}</h4>
                     <p className="text-sm text-white/40 font-medium leading-relaxed mb-6 flex-grow">{item.desc}</p>
                     
                     <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-red-600/5 blur-3xl rounded-full group-hover:bg-red-600/10 transition-all pointer-events-none" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
