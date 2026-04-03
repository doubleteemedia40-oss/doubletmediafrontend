'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Wallet, User as UserIcon, LogOut, Menu, X, ListOrdered } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/new-order', label: 'New Order', icon: ShoppingCart },
  { href: '/dashboard/orders', label: 'My Orders', icon: ListOrdered },
  { href: '/dashboard/add-funds', label: 'Add Funds', icon: Wallet },
  { href: '/dashboard/profile', label: 'My Profile', icon: UserIcon },
];

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/new-order': 'New Order',
  '/dashboard/orders': 'My Orders',
  '/dashboard/add-funds': 'Add Funds',
  '/dashboard/profile': 'My Profile',
};

export default function DashboardLayout({
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
    }
  }, [mounted, loading, user, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar open on mobile
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

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard';

  const SidebarContent = () => (
    <>
      <div>
        <div className="p-5 sm:p-6">
          <h2 className="text-xl font-black italic uppercase tracking-tight">
            Double<span className="text-red-600">t</span>media
          </h2>
          <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-bold mt-1">Growth Dashboard</p>
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
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-red-600' : 'text-red-600/50'} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 bg-red-600/10 border border-red-600/20 rounded-xl mb-3">
          <Wallet size={16} className="text-red-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-600">Balance</p>
            <p className="text-sm font-bold truncate">${user.walletBalance?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-white/[0.03] text-sm font-bold text-white/40 hover:text-red-600 transition-colors"
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
              {/* Close button on mobile drawer */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
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
      <main className="flex-1 overflow-y-auto bg-[#050505] min-w-0">
        <header className="h-16 sm:h-20 border-b border-white/5 flex items-center justify-between px-4 sm:px-8 bg-black/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base sm:text-lg font-black italic uppercase tracking-wider">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <p className="hidden sm:block text-xs font-bold text-white/50 truncate max-w-[180px]">{user.email}</p>
            <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <UserIcon size={14} />
            </div>
          </div>
        </header>
        
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
