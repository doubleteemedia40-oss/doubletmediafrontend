'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <Link href="/" className="text-3xl font-black tracking-tighter text-red-600">
              DoubleTmedia
            </Link>
            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm">
              The world's first decentralized social dominance grid. Empowering 10,000+ elite agencies with proprietary neural growth nodes and surgical precision.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">Platform</h4>
            <div className="flex flex-col gap-4">
              {['Services', 'API Docs', 'Status', 'Affiliates'].map(item => (
                <Link key={item} href="#" className="text-sm font-bold text-white/30 hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">Support</h4>
            <div className="flex flex-col gap-4">
              {['Help Center', 'Terms', 'Privacy', 'Contact'].map(item => (
                <Link key={item} href="#" className="text-sm font-bold text-white/30 hover:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
            &copy; 2026 DoubleTmedia. SECURED BY ENCRYPTION PROTOCOL 2.4.0
          </p>
          <div className="flex gap-8">
             <div className="h-6 w-20 bg-white/5 rounded-md border border-white/10 flex items-center justify-center text-[8px] font-black tracking-tighter text-white/20 uppercase">Visa</div>
             <div className="h-6 w-20 bg-white/5 rounded-md border border-white/10 flex items-center justify-center text-[8px] font-black tracking-tighter text-white/20 uppercase">Mastercard</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
