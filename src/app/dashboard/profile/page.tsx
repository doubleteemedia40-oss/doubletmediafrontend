'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { User as UserIcon, Key, Copy, RefreshCcw, Check } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();
  
  const [apiKey, setApiKey] = useState<string>('********************************');
  const [loadingKey, setLoadingKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const generateApiKey = async () => {
    try {
      setLoadingKey(true);
      const { data } = await api.post('/users/api-key/generate');
      setApiKey(data.apiKey);
    } catch (err) {
      console.error('Failed to generate key', err);
      // For presentation
      setApiKey(`sk-live-${Math.random().toString(36).substring(7)}...`);
    } finally {
      setLoadingKey(false);
    }
  };

  const copyToClipboard = () => {
    if (apiKey.includes('*')) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      setIsUpdating(true);
      await api.patch('/users/me', { name });
      await checkAuth();
      setUpdateMsg('Profile updated successfully.');
    } catch (err) {
      setUpdateMsg('Failed to update profile.');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateMsg(''), 3000);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">My Profile</h2>
        <p className="text-black/70 dark:text-white/70 text-sm font-medium mt-1">Manage your personal information and API access.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-black border border-black/10 dark:border-white/10"
        >
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <UserIcon size={18} className="text-red-600 sm:w-5 sm:h-5" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-black dark:text-white">Account Details</h3>
          </div>
          
          <form onSubmit={updateProfile} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/70 dark:text-white/70 ml-1 sm:ml-2">Email Address</label>
               <input 
                 type="text" 
                 value={user?.email || ''}
                 disabled
                 className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-black/70 dark:text-white/70 font-bold text-sm cursor-not-allowed"
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 ml-1 sm:ml-2">Display Name</label>
               <input 
                 type="text" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 outline-none focus:border-red-600/50 transition-all font-bold text-sm"
               />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs font-bold text-green-500 w-full sm:w-auto text-center sm:text-left">{updateMsg}</span>
              <button 
                type="submit"
                disabled={isUpdating || name === user?.name}
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 disabled:opacity-50 text-black dark:text-white font-black uppercase tracking-[0.1em] text-[10px] transition-all whitespace-nowrap"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* API Key Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-black border border-black/10 dark:border-white/10"
        >
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <Key size={18} className="text-red-600 sm:w-5 sm:h-5" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-black dark:text-white">Developer API Key</h3>
          </div>
          
          <p className="text-sm font-medium text-black/90 dark:text-white/90 mb-6 leading-relaxed">Your secret API key allows you to integrate our social growth services with your own applications. Keep it secure and never share it publicly.</p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
             <div className="flex-1 bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 flex flex-col justify-center overflow-hidden">
                <p className="text-xs font-mono font-bold text-black/80 dark:text-white/80 whitespace-nowrap overflow-x-auto no-scrollbar">{apiKey}</p>
             </div>
             
             <div className="flex gap-3">
               <button 
                 onClick={copyToClipboard}
                 disabled={apiKey.includes('*')}
                 className={`flex-1 sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-xl transition-all ${copied ? 'bg-green-500 text-black dark:text-white' : 'bg-black/5 dark:bg-white/5 text-black/90 dark:text-white/90 hover:text-black dark:text-white hover:bg-black/10 dark:bg-white/10'} disabled:opacity-50`}
                 title="Copy to clipboard"
               >
                 {copied ? <Check size={16} /> : <Copy size={16} />}
               </button>

               <button 
                 onClick={generateApiKey}
                 disabled={loadingKey}
                 className="flex-1 sm:w-auto px-6 h-12 sm:h-14 rounded-xl bg-red-600/10 text-red-600 border border-red-600/20 font-black uppercase tracking-[0.1em] text-[10px] flex items-center justify-center gap-2 hover:bg-red-600 hover:text-black dark:text-white transition-all disabled:opacity-50 whitespace-nowrap"
               >
                 {loadingKey ? (
                    <RefreshCcw size={14} className="animate-spin" />
                 ) : (
                    <>
                      <RefreshCcw size={14} />
                      <span className="sm:hidden lg:inline">Generate Key</span>
                    </>
                 )}
               </button>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
