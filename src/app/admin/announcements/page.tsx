'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Megaphone, Plus, Trash2, Power } from 'lucide-react';
import { motion } from 'framer-motion';

interface Announcement {
  id: string;
  message: string;
  active: boolean;
  type: string;
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState('info');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/announcements');
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post('/announcements', { message: newMessage, type: newType, active: true });
      setNewMessage('');
      fetchAnnouncements();
    } catch (err) {
      console.error('Failed to create announcement', err);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/announcements/${id}`, { active: !currentStatus });
      fetchAnnouncements();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  return (
    <div className="max-w-5xl space-y-6 sm:space-y-8 relative z-10 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">Announcements</h2>
          <p className="text-white/40 text-sm font-medium mt-1">Broadcast messages to all users on their dashboard.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl sm:rounded-3xl bg-black border border-white/10 p-6 sm:p-8 mb-8"
      >
        <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-6">Create New Broadcast</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="e.g. Server maintenance tonight at 12 AM EST..."
            className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50 transition-all"
          />
          <select 
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="w-full sm:w-40 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50 transition-all"
          >
            <option value="info" className="bg-black text-blue-400">Info (Blue)</option>
            <option value="warning" className="bg-black text-yellow-500">Warning (Yellow)</option>
            <option value="success" className="bg-black text-green-500">Success (Green)</option>
            <option value="danger" className="bg-black text-red-500">Danger (Red)</option>
          </select>
          <button 
            onClick={handleCreate}
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-red-600 disabled:opacity-50 hover:bg-red-700 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Broadcast
          </button>
        </div>
      </motion.div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center">
             <div className="inline-block h-6 w-6 border-2 border-white/20 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-10 bg-white/[0.02] rounded-2xl border border-white/5">
            <Megaphone size={32} className="mx-auto text-white/20 mb-4" />
            <p className="text-sm font-bold text-white/40">No announcements created yet.</p>
          </div>
        ) : (
          announcements.map(ann => (
            <motion.div 
              key={ann.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${ann.active ? 'bg-white/[0.02] border-white/20' : 'bg-black border-white/5 opacity-50'}`}
            >
              <div>
                <p className={`text-sm font-bold ${
                  ann.type === 'danger' ? 'text-red-500' :
                  ann.type === 'warning' ? 'text-yellow-500' :
                  ann.type === 'success' ? 'text-green-500' : 'text-blue-400'
                }`}>{ann.message}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1 font-bold">
                  {new Date(ann.createdAt).toLocaleString()} • {ann.type}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => toggleStatus(ann.id, ann.active)}
                  className={`p-2.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${ann.active ? 'bg-white/5 text-white/60 hover:text-white' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
                >
                  <Power size={14} /> {ann.active ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleDelete(ann.id)}
                  className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
