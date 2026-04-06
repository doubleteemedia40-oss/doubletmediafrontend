'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Mail, Send, CheckCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
  user: { email: string };
  messages: SupportMessage[];
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tickets/admin');
      setTickets(data);
      
      if (activeTicket) {
        const fullTicket = await api.get(`/tickets/admin/${activeTicket.id}`);
        setActiveTicket(fullTicket.data);
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !activeTicket) return;
    try {
      await api.post(`/tickets/admin/${activeTicket.id}/messages`, { content: replyText });
      setReplyText('');
      fetchTickets();
    } catch (err) {
      console.error('Failed to send reply', err);
    }
  };

  const updateStatus = async (status: string) => {
    if (!activeTicket) return;
    try {
      await api.patch(`/tickets/admin/${activeTicket.id}/status`, { status });
      fetchTickets();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const viewTicket = async (ticket: SupportTicket) => {
    try {
      const { data } = await api.get(`/tickets/admin/${ticket.id}`);
      setActiveTicket(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">Support Desk</h2>
          <p className="text-white/70 text-sm font-medium mt-1">Manage user inquiries and tickets submitted via Contact Us.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-1 space-y-3 h-[700px] overflow-y-auto pr-2">
          {loading && tickets.length === 0 ? (
             <div className="py-20 text-center text-white/50">Loading...</div>
          ) : tickets.length === 0 ? (
             <div className="py-10 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
               <HelpCircle size={24} className="mx-auto text-white/50 mb-3" />
               <p className="text-xs font-bold text-white/70">No incoming tickets.</p>
             </div>
          ) : (
            tickets.map(ticket => (
              <div 
                key={ticket.id} 
                onClick={() => viewTicket(ticket)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${activeTicket?.id === ticket.id ? 'bg-red-600/10 border-red-600/30' : 'bg-[#050505] border-white/5 hover:border-white/10'}`}
              >
                <div className="flex justify-between items-start mb-2 gap-2">
                  <p className="text-sm font-bold truncate flex-1">{ticket.subject}</p>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider font-bold border shrink-0 ${ticket.status === 'ANSWERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ticket.status === 'RESOLVED' ? 'bg-white/10 text-white/80 border-white/10' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-[10px] text-white/80 font-bold mb-1.5">{ticket.user?.email}</p>
                <p className="text-xs text-white/60 truncate">
                  {ticket.messages?.[0]?.content || "No messages"}
                </p>
                <p className="text-[9px] uppercase font-bold tracking-widest text-white/50 border-t border-white/5 pt-2 mt-2">
                   {new Date(ticket.updatedAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* View Area */}
        <div className="lg:col-span-2">
          {activeTicket ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black border border-white/10 rounded-3xl overflow-hidden flex flex-col h-[700px]">
               <div className="p-6 border-b border-white/5 bg-[#050505] flex justify-between items-center">
                 <div className="flex-1 min-w-0 pr-4">
                   <h3 className="text-lg font-black truncate">{activeTicket.subject}</h3>
                   <p className="text-[10px] uppercase font-bold tracking-widest text-white/70 mt-1">
                     Ticket #{activeTicket.id.slice(0,8)} • {activeTicket.user?.email}
                   </p>
                 </div>
                 {activeTicket.status !== 'RESOLVED' && (
                   <button 
                     onClick={() => updateStatus('RESOLVED')}
                     className="px-4 py-2 bg-white/5 hover:bg-green-500/20 text-white/90 hover:text-green-500 border border-transparent hover:border-green-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                   >
                     Mark Resolved
                   </button>
                 )}
               </div>
               
               <div className="flex-1 p-6 overflow-y-auto space-y-6">
                 {activeTicket.messages.map(msg => (
                   <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'ADMIN' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                     <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1.5 ml-1">
                       {msg.sender === 'ADMIN' ? 'You (Admin)' : 'User'} • {new Date(msg.createdAt).toLocaleTimeString()}
                     </p>
                     <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.sender === 'ADMIN' ? 'bg-red-600/20 border border-red-600/30 text-white' : 'bg-white/[0.03] border border-white/10 text-white/80'}`}>
                       {msg.content}
                     </div>
                   </div>
                 ))}
               </div>

               {activeTicket.status !== 'RESOLVED' && (
                 <div className="p-4 border-t border-white/5 bg-[#050505]">
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={replyText} 
                        onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleReply()}
                        placeholder="Write a reply to the user..."
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-red-600/50"
                      />
                      <button 
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="w-12 h-12 shrink-0 bg-red-600 disabled:opacity-50 hover:bg-red-700 text-white rounded-xl transition-all flex items-center justify-center"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                 </div>
               )}
            </motion.div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center bg-black/50 border border-white/5 rounded-3xl">
              <Mail size={32} className="text-white/50 mb-4" />
              <p className="text-sm font-bold text-white/70">Select a ticket from the list to view and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
