'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-[#050505] border-t border-black/5 dark:border-white/5 py-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <Link href="/" className="text-3xl font-black tracking-tighter text-red-600">
              DoubleTmedia
            </Link>
            <p className="text-black/70 dark:text-white/70 text-sm font-medium leading-relaxed max-w-sm">
              Accelerate your social media growth with DoubleTmedia. Quickly gain real followers, viewers, likes & more with our advanced blend of marketing tactics.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">Platform</h4>
            <div className="flex flex-col gap-4">
              {['Services', 'API Docs', 'Status', 'Affiliates'].map(item => (
                <Link key={item} href="#" className="text-sm font-bold text-black/60 dark:text-white/60 hover:text-black dark:text-white transition-colors">{item}</Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">Support</h4>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Help Center', href: '#' },
                { name: 'Terms', href: '#' },
                { name: 'Privacy', href: '/privacy' },
                { name: 'Contact', href: '#' }
              ].map(item => (
                <Link key={item.name} href={item.href} className="text-sm font-bold text-black/60 dark:text-white/60 hover:text-black dark:text-white transition-colors">{item.name}</Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/50">
            &copy; 2026 DoubleTmedia. SECURED BY ENCRYPTION PROTOCOL 2.4.0
          </p>
          <div className="flex gap-8">
             {/* Payment badges removed */}
          </div>
        </div>
      </div>
    </footer>
  );
}
