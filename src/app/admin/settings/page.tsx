'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Settings, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/settings');
      // Transform [{key, value}] to Record
      const map: Record<string, string> = {};
      if (Array.isArray(data)) {
        data.forEach((s: any) => { map[s.key] = s.value; });
      }
      setSettings(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.patch('/settings', settings);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings', err);
      alert('Failed to save settings');
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl space-y-6 sm:space-y-8 relative z-10 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">Global Settings</h2>
          <p className="text-black/70 dark:text-white/70 text-sm font-medium mt-1">Configure platform-wide variables and maintenance mode.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl sm:rounded-3xl bg-white dark:bg-black border border-black/10 dark:border-white/10 p-6 sm:p-8"
      >
        {loading ? (
          <div className="py-20 text-center">
             <div className="inline-block h-6 w-6 border-2 border-black/20 dark:border-white/20 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Maintenance Mode</label>
                <select 
                  value={settings['maintenance_mode'] || 'false'} 
                  onChange={(e) => handleChange('maintenance_mode', e.target.value)}
                  className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50 transition-all"
                >
                  <option value="false" className="bg-white dark:bg-black text-black dark:text-white">Disabled (Normal Operations)</option>
                  <option value="true" className="bg-white dark:bg-black text-red-500">Enabled (Purchasing Blocked)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Support Email</label>
                <input 
                  type="email"
                  value={settings['support_email'] || ''} 
                  onChange={(e) => handleChange('support_email', e.target.value)}
                  placeholder="support@doubletmedia.com"
                  className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Support WhatsApp</label>
                <input 
                  type="text"
                  value={settings['support_whatsapp'] || ''} 
                  onChange={(e) => handleChange('support_whatsapp', e.target.value)}
                  placeholder="+1234567890"
                  className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">WhatsApp Group Link</label>
                <input 
                  type="url"
                  value={settings['community_whatsapp_group'] || ''} 
                  onChange={(e) => handleChange('community_whatsapp_group', e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Telegram Channel Link</label>
                <input 
                  type="url"
                  value={settings['community_telegram_channel'] || ''} 
                  onChange={(e) => handleChange('community_telegram_channel', e.target.value)}
                  placeholder="https://t.me/yourchannel"
                  className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Telegram Direct Chat Link</label>
                <input 
                  type="url"
                  value={settings['community_telegram_direct'] || ''} 
                  onChange={(e) => handleChange('community_telegram_direct', e.target.value)}
                  placeholder="https://t.me/yourusername"
                  className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-black/10 dark:border-white/10 flex justify-end">
               <button 
                 onClick={handleSave}
                 className="px-6 py-3 bg-red-600 hover:bg-red-700 text-black dark:text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2"
               >
                 <Save size={16} /> Save Settings
               </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
