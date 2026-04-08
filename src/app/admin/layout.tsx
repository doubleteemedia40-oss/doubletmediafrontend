'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Webhook, Box, ShieldAlert, LogOut, FileCode2, Menu, X, Settings, Megaphone, LifeBuoy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/orders', label: 'All Orders', icon: Box },
  { href: '/admin/services', label: 'Services', icon: FileCode2 },
  { href: '/admin/providers', label: 'Providers', icon: Webhook },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/support', label: 'Support Desk', icon: LifeBuoy },
];

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Admin Overview',
  '/admin/users': 'Users',
  '/admin/orders': 'All Orders',
  '/admin/services': 'Services',
  '/admin/providers': 'Providers',
  '/admin/announcements': 'Announcements',
  '/admin/settings': 'Settings',
  '/admin/support': 'Support Desk',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/login');
    } else if (mounted && !loading && user && user.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [mounted, loading, user, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-white/20 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const pageTitle = PAGE_TITLES[pathname] || 'Admin';

  const SidebarContent = () => (
    <>
      <div>
        <div className="p-5 sm:p-6">
          <h2 className="text-xl font-black italic uppercase tracking-tight">
            Double<span className="text-red-600">t</span>media
          </h2>
          <p className="text-[10px] text-red-600 tracking-[0.2em] uppercase font-bold mt-1">Admin Panel</p>
        </div>
        
        <nav className="mt-4 px-3 sm:px-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-red-600/10 border border-red-600/20 text-red-600'
                    : 'text-white/80 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-red-600' : 'text-red-600/40'} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#050505] border border-white/10 rounded-xl mb-3">
          <ShieldAlert size={16} className="text-red-600 animate-pulse shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Access Level</p>
            <p className="text-xs font-bold text-red-600 truncate">Administrator</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-sm font-bold text-white/70 hover:text-red-600 transition-colors"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-black text-white font-manrope overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-white/5 flex-col justify-between bg-black shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0a0a0a] border-r border-white/10 flex flex-col justify-between lg:hidden"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#030303] relative min-w-0">
        <header className="h-16 sm:h-20 border-b border-white/5 flex items-center justify-between px-4 sm:px-8 bg-black/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
              <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-white/80">{pageTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden sm:block text-xs font-bold text-red-600 truncate max-w-[180px]">{user.email}</p>
            <Link 
              href="/admin/settings"
              className="h-8 w-8 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center shrink-0 hover:bg-red-600/30 transition-all group"
            >
              <ShieldAlert size={14} className="text-red-600" />
            </Link>
          </div>
        </header>
        
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[150px] pointer-events-none" />
      </main>
    </div>
  );
}
