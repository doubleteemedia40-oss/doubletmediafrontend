'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'API', href: '/api-docs' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-black/40 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="container-custom h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-black tracking-tighter text-red-600 shrink-0" onClick={() => setOpen(false)}>
            DoubleTmedia
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_0_20px_-5px_rgba(220,38,38,0.4)]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0a0a0a] border-l border-white/10 flex flex-col md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <span className="text-lg font-black tracking-tighter text-red-600">DoubleTmedia</span>
                <button
                  className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
                  onClick={() => setOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 p-6 space-y-1">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-3.5 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/[0.04] transition-all"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-6 mt-6 border-t border-white/5 space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center px-4 py-3.5 rounded-xl text-sm font-bold text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)]"
                  >
                    Get Started <ArrowRight size={16} />
                  </Link>
                </div>
              </nav>

              {/* Footer tag */}
              <div className="p-6 border-t border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                  Premium Social Growth Platform
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
