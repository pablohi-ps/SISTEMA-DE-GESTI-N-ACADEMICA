import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Search, Mail, Send, Check, CheckCheck, 
  Plus, MessageSquare, User, Calendar, Home, Sparkles, AlertCircle
} from 'lucide-react';

export default function MessagingCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received', 'sent'
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  
  // Compose message states
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [composeError, setComposeError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('novaedu_token');
      
      // Fetch messages and contacts in parallel
      const [resMsgs, resContacts] = await Promise.all([
        fetch('/api/messages', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/contacts', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (resMsgs.ok && resContacts.ok) {
        const msgs = await resMsgs.json();
        const cnts = await resContacts.json();
        setMessages(msgs);
        setContacts(cnts);
      }
    } catch (err) {
      console.error('Error fetching messaging data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleSelectMessage = async (msg) => {
    setSelectedMsg(msg);
    if (msg.receiver_id === user.id && !msg.is_read) {
      // Mark as read in DB
      try {
        const token = localStorage.getItem('novaedu_token');
        const res = await fetch(`/api/messages/${msg.id}/read`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          // Update local state
          setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: 1 } : m));
        }
      } catch (err) {
        console.error('Error marking message as read:', err);
      }
    }
  };

  const handleComposeSubmit = async (e) => {
    e.preventDefault();
    if (!recipientId || !subject.trim() || !content.trim()) {
      setComposeError('Todos los campos son obligatorios.');
      return;
    }
    
    setSending(true);
    setComposeError('');
    try {
      const token = localStorage.getItem('novaedu_token');
      const selectedContact = contacts.find(c => c.id === recipientId);
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: recipientId,
          receiver_name: selectedContact ? selectedContact.name : recipientId,
          subject,
          content
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Clear state & close modal
        setRecipientId('');
        setSubject('');
        setContent('');
        setIsComposing(false);
        // Refresh messages list
        await fetchData();
      } else {
        setComposeError(data.error || 'Error al enviar el mensaje.');
      }
    } catch (err) {
      setComposeError('Error de red al intentar enviar.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Filter messages
  const receivedMessages = messages.filter(m => m.receiver_id === user.id);
  const sentMessages = messages.filter(m => m.sender_id === user.id);
  const displayedMessages = activeTab === 'received' ? receivedMessages : sentMessages;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 font-sans">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-violet-600 rounded-2xl shadow-xl shadow-violet-200 dark:shadow-none rotate-3">
            <Mail className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none uppercase">Centro de Mensajes</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Bandeja de Entrada Escolar • NovaEdu</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2">
            <Home className="w-4 h-4" /> Hub
          </Button>
          <Button onClick={() => setIsComposing(true)} className="rounded-2xl h-12 px-6 bg-violet-600 hover:bg-violet-700 text-white font-black shadow-xl shadow-violet-600/20 active:scale-95 transition-all flex items-center gap-2">
             <Plus className="w-5 h-5" /> REDACTAR
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border">
            <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
          </Button>
        </div>
      </nav>

      {/* Main Mail Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        
        {/* Left column: Tabs & Message List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-border/50 shadow-md">
            <button
              onClick={() => { setActiveTab('received'); setSelectedMsg(null); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                activeTab === 'received' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/10' : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Recibidos ({receivedMessages.length})
            </button>
            <button
              onClick={() => { setActiveTab('sent'); setSelectedMsg(null); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                activeTab === 'sent' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/10' : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Enviados ({sentMessages.length})
            </button>
          </div>

          <Card className="border-none shadow-2xl glass rounded-[2.5rem] overflow-hidden min-h-[450px]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black tracking-tight uppercase flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-violet-500" />
                {activeTab === 'received' ? 'Bandeja de Entrada' : 'Mensajes Enviados'}
              </CardTitle>
              <CardDescription className="font-bold">Total: {displayedMessages.length} mensajes</CardDescription>
            </CardHeader>
            <CardContent className="p-0 max-h-[500px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-violet-500 border-t-transparent"></div>
                  <p className="text-xs font-black uppercase tracking-widest">Cargando correspondencia...</p>
                </div>
              ) : displayedMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-center px-8 space-y-2">
                  <Mail className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-bold uppercase tracking-tight">Sin mensajes</p>
                  <p className="text-xs font-medium text-slate-400">No hay correspondencia en este buzón.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {displayedMessages.map(msg => {
                    const isUnread = activeTab === 'received' && !msg.is_read;
                    const contactName = activeTab === 'received' ? msg.sender_name : msg.receiver_name;
                    return (
                      <div
                        key={msg.id}
                        onClick={() => handleSelectMessage(msg)}
                        className={`p-6 cursor-pointer hover:bg-violet-500/5 transition-all flex flex-col gap-2 relative ${
                          selectedMsg?.id === msg.id ? 'bg-violet-500/10' : ''
                        } ${isUnread ? 'border-l-4 border-l-violet-600 pl-5 bg-violet-600/5' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-black truncate max-w-[70%] ${isUnread ? 'text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {contactName}
                          </span>
                          <span className="text-[9px] font-black text-muted-foreground tracking-wider uppercase">
                            {new Date(msg.timestamp).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </span>
                        </div>
                        <h4 className={`text-sm tracking-tight truncate ${isUnread ? 'font-black text-foreground' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
                          {msg.subject}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {msg.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Message view */}
        <div className="lg:col-span-7">
          <Card className="border-none shadow-2xl glass rounded-[2.5rem] overflow-hidden min-h-[530px] flex flex-col h-full">
            {selectedMsg ? (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-8 border-b border-border/50 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black px-2.5 py-1 bg-violet-600/10 text-violet-600 rounded-full uppercase tracking-widest border border-violet-500/20">
                        {activeTab === 'received' ? 'Recibido' : 'Enviado'}
                      </span>
                      <h2 className="text-2xl font-black tracking-tight leading-tight uppercase pt-2">{selectedMsg.subject}</h2>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      {new Date(selectedMsg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 py-3 px-4 bg-muted/30 rounded-2xl border border-border/40">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-black text-sm">
                      {activeTab === 'received' ? selectedMsg.sender_name?.[0] : selectedMsg.receiver_name?.[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none">
                        {activeTab === 'received' ? 'De: ' : 'Para: '}
                        <span className="text-foreground">{activeTab === 'received' ? selectedMsg.sender_name : selectedMsg.receiver_name}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase font-medium">
                        ID: {activeTab === 'received' ? selectedMsg.sender_id : selectedMsg.receiver_id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium whitespace-pre-wrap">
                  {selectedMsg.content}
                </div>

                {/* Footer / Reply quick action */}
                {activeTab === 'received' && (
                  <div className="p-6 border-t border-border/50 bg-muted/20 flex gap-4">
                    <Button 
                      onClick={() => {
                        setRecipientId(selectedMsg.sender_id);
                        setSubject(`Re: ${selectedMsg.subject}`);
                        setIsComposing(true);
                      }}
                      className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-violet-500/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> RESPONDER MENSAJE
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center p-12 text-muted-foreground space-y-4">
                <div className="p-6 bg-violet-500/5 rounded-[2rem] border border-violet-500/10">
                  <Mail className="w-16 h-16 text-violet-500/40" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Lectura de Mensajes</h3>
                <p className="text-xs font-medium max-w-sm">
                  Selecciona un mensaje de la bandeja de entrada para visualizar su contenido completo y entablar correspondencia.
                </p>
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* Compose Message Modal */}
      <AnimatePresence>
        {isComposing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsComposing(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-900 border-none rounded-[3rem] max-w-lg w-full p-10 shadow-2xl text-foreground space-y-6 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-600 rounded-2xl text-white">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight uppercase leading-none">Redactar Mensaje</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Envío de correspondencia interna</p>
                </div>
              </div>

              {composeError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-xs font-bold">{composeError}</p>
                </div>
              )}

              <form onSubmit={handleComposeSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Destinatario</label>
                  <select 
                    value={recipientId} 
                    onChange={e => setRecipientId(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl bg-muted border-none text-sm font-bold focus:ring-2 ring-violet-500 transition-all outline-none"
                    required
                  >
                    <option value="">-- Selecciona un Contacto --</option>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name} ({contact.role === 'admin' ? 'Administrador' : contact.role === 'teacher' ? 'Docente' : 'Estudiante'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asunto</label>
                  <Input 
                    placeholder="Ej. Duda sobre la tarea / Reporte mensual" 
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="h-14 rounded-2xl bg-muted border-none text-sm font-bold focus:ring-2 ring-violet-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contenido del Mensaje</label>
                  <textarea 
                    placeholder="Escribe el cuerpo de tu mensaje aquí..." 
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full min-h-[140px] p-5 rounded-2xl bg-muted border-none text-sm font-bold focus:ring-2 ring-violet-500 transition-all outline-none resize-none"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsComposing(false)}
                    className="flex-1 h-14 rounded-2xl font-bold border-border"
                  >
                    CANCELAR
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={sending}
                    className="flex-1 h-14 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-violet-600/20 active:scale-95 transition-all"
                  >
                    {sending ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
