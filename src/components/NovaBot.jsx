import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send, Bot, Sparkles, Zap, HelpCircle } from 'lucide-react';

const predefinedAnswers = {
  'pago': 'La próxima fecha límite de pago es el 15 de Mayo. Puedes realizarlo en la sección "Sistema Financiero".',
  'calificaciones': 'Tus calificaciones han sido actualizadas. Actualmente tienes un promedio de 9.4 en el semestre actual.',
  'hola': '¡Hola! Soy NovaBot, tu asistente inteligente. ¿Cómo puedo facilitar tu vida académica hoy?',
  'asistencia': 'Tu registro de asistencia está al día. Tienes un 98% de presencialidad.',
  'clima': 'Hoy en el campus tendremos un día despejado con 24°C. ¡Ideal para estudiar al aire libre!'
};

const suggestions = ["¿Cuándo pago?", "Ver mis notas", "Estado de asistencia"];

export default function NovaBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: '¡Hola! Soy NovaBot. Estoy aquí para ayudarte con cualquier duda sobre el SGA.' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const query = text || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      let answer = 'Lo siento, no tengo esa información exacta, pero puedo conectarte con soporte técnico si lo deseas.';
      
      for (let key in predefinedAnswers) {
        if (lower.includes(key)) {
          answer = predefinedAnswers[key];
          break;
        }
      }

      setMessages(prev => [...prev, { sender: 'bot', text: answer }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-8 right-8 z-[60] bg-gradient-to-br from-primary to-indigo-600 text-white rounded-[2rem] w-16 h-16 flex items-center justify-center shadow-2xl shadow-primary/40 border border-white/20 group"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-7 h-7" /> : <Bot className="w-7 h-7 group-hover:animate-pulse" />}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-ping"></div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            className="fixed bottom-28 right-8 w-96 max-w-[calc(100vw-2rem)] h-[500px] glass z-[60] flex flex-col rounded-[2.5rem] overflow-hidden border-primary/20"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary to-indigo-600 text-white relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg leading-tight">NovaBot AI</h3>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Asistente Virtual Activo</p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 no-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-4 rounded-3xl max-w-[85%] text-sm shadow-sm ${
                    msg.sender === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-muted/50 dark:bg-slate-800/50 text-foreground rounded-tl-none border border-border/50'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-muted/50 p-4 rounded-3xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Smart Suggestions */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
               {suggestions.map(s => (
                 <button 
                  key={s} 
                  onClick={() => handleSend(s)}
                  className="whitespace-nowrap px-3 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 transition-all"
                 >
                   {s}
                 </button>
               ))}
            </div>

            {/* Footer Input */}
            <div className="p-6 pt-2">
              <div className="relative group">
                <Input
                  placeholder="Pregunta algo..."
                  className="pl-6 pr-12 py-7 rounded-[2rem] bg-muted/30 border-border/50 focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-slate-900 transition-all shadow-inner"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                />
                <Button 
                  onClick={() => handleSend()}
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-center text-[9px] text-muted-foreground mt-4 font-bold tracking-widest uppercase">Impulsado por Nova Intelligence</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
