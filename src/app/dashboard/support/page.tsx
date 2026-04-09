'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Mail, Send, CheckCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportMessage {
  id: string;
  sender: 'USER' | 'ADMIN';
  content: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export default function UserSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tickets');
      setTickets(data);
      
      if (activeTicket) {
        const fullTicket = await api.get(`/tickets/${activeTicket.id}`);
        setActiveTicket(fullTicket.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!subject.trim() || !message.trim()) return;
    try {
      await api.post('/tickets', { subject, message });
      setSubject('');
      setMessage('');
      setShowNew(false);
      fetchTickets();
    } catch (err) {
      console.error('Failed to create ticket', err);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !activeTicket) return;
    try {
      await api.post(`/tickets/${activeTicket.id}/messages`, { content: replyText });
      setReplyText('');
      fetchTickets(); // Will refresh active ticket
    } catch (err) {
      console.error('Failed to send reply', err);
    }
  };

  const viewTicket = async (ticket: SupportTicket) => {
    try {
      const { data } = await api.get(`/tickets/${ticket.id}`);
      setActiveTicket(data);
      setShowNew(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">Contact Support</h2>
          <p className="text-black/70 dark:text-white/70 text-sm font-medium mt-1">Submit inquiries or get help with your orders.</p>
        </div>
        <button 
          onClick={() => { setShowNew(true); setActiveTicket(null); }}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-black dark:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all w-fit"
        >
          + New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-1 space-y-3">
          {loading && tickets.length === 0 ? (
             <div className="py-20 text-center text-black/50 dark:text-white/50">Loading...</div>
          ) : tickets.length === 0 ? (
             <div className="py-10 text-center bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-2xl">
               <HelpCircle size={24} className="mx-auto text-black/50 dark:text-white/50 mb-3" />
               <p className="text-xs font-bold text-black/70 dark:text-white/70">No tickets found.</p>
             </div>
          ) : (
            tickets.map(ticket => (
              <div 
                key={ticket.id} 
                onClick={() => viewTicket(ticket)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${activeTicket?.id === ticket.id ? 'bg-black/[0.05] dark:bg-white/[0.05] border-black/20 dark:border-white/20' : 'bg-slate-50 dark:bg-[#050505] border-black/5 dark:border-white/5 hover:border-black/10 dark:border-white/10'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold truncate pr-4">{ticket.subject}</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider font-bold border shrink-0 ${ticket.status === 'ANSWERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ticket.status === 'RESOLVED' ? 'bg-black/10 dark:bg-white/10 text-black/80 dark:text-white/80 border-black/10 dark:border-white/10' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs text-black/70 dark:text-white/70 truncate">
                  {ticket.messages?.[0]?.content || "No messages"}
                </p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-black/50 dark:text-white/50 border-t border-black/5 dark:border-white/5 pt-2 mt-2">
                   {new Date(ticket.updatedAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* View Area */}
        <div className="lg:col-span-2">
          {showNew ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-black border border-black/10 dark:border-white/10 p-6 sm:p-8 rounded-3xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-black/70 dark:text-white/70 mb-6">Create Ticket</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-black/70 dark:text-white/70 uppercase tracking-widest mb-2 block ml-1">Subject</label>
                  <input 
                    type="text" 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)}
                    placeholder="E.g., Issue with Order #123"
                    className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-black/70 dark:text-white/70 uppercase tracking-widest mb-2 block ml-1">Message</label>
                  <textarea 
                    value={message} 
                    onChange={e => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Describe your issue in detail..."
                    className="w-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50 resize-none"
                  />
                </div>
                <div className="pt-2">
                  <button 
                    onClick={handleCreate}
                    disabled={!subject.trim() || !message.trim()}
                    className="px-6 py-3 bg-red-600 disabled:opacity-50 hover:bg-red-700 text-black dark:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    <Send size={14} /> Submit Ticket
                  </button>
                </div>
              </div>
            </motion.div>
          ) : activeTicket ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col h-[600px]">
               <div className="p-6 border-b border-black/5 dark:border-white/5 bg-slate-50 dark:bg-[#050505]">
                 <h3 className="text-lg font-black truncate">{activeTicket.subject}</h3>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-black/70 dark:text-white/70 mt-1">Ticket #{activeTicket.id.slice(0,8)}</p>
               </div>
               
               <div className="flex-1 p-6 overflow-y-auto space-y-6">
                 {activeTicket.messages.map(msg => (
                   <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'USER' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                     <p className="text-[10px] font-bold text-black/60 dark:text-white/60 uppercase tracking-widest mb-1.5 ml-1">
                       {msg.sender === 'USER' ? 'You' : 'Admin Staff'} • {new Date(msg.createdAt).toLocaleTimeString()}
                     </p>
                     <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.sender === 'USER' ? 'bg-red-600/20 border border-red-600/30 text-black dark:text-white' : 'bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-black/80 dark:text-white/80'}`}>
                       {msg.content}
                     </div>
                   </div>
                 ))}
               </div>

               {activeTicket.status !== 'RESOLVED' && (
                 <div className="p-4 border-t border-black/5 dark:border-white/5 bg-slate-50 dark:bg-[#050505]">
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={replyText} 
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleReply()}
                        placeholder="Write a reply..."
                        className="flex-1 bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50"
                      />
                      <button 
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="w-12 h-12 shrink-0 bg-black/10 dark:bg-white/10 disabled:opacity-50 hover:bg-black/20 dark:bg-white/20 text-black dark:text-white rounded-xl transition-all flex items-center justify-center"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                 </div>
               )}
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center bg-white dark:bg-black/50 border border-black/5 dark:border-white/5 rounded-3xl">
              <Mail size={32} className="text-black/50 dark:text-white/50 mb-4" />
              <p className="text-sm font-bold text-black/70 dark:text-white/70">Select a ticket or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
