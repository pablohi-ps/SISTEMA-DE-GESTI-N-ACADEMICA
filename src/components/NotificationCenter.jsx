import React, { useState } from 'react';
import { Bell, X, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';

const sampleNotifications = [
  { id: 1, text: 'Tu mensualidad vence en 3 días.', time: 'Hace 2h', type: 'warning' },
  { id: 2, text: 'Nueva calificación disponible en Ingeniería de Software II.', time: 'Hace 1h', type: 'info' },
  { id: 3, text: 'Se ha publicado un nuevo anuncio en el Muro de clase.', time: 'Hace 30 min', type: 'success' }
];

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block ml-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setOpen(!open)} 
        className="rounded-2xl hover:bg-muted relative transition-all"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 bg-primary text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-lg">
          {sampleNotifications.length}
        </span>
      </Button>
      
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, rotateX: -20 }}
              style={{ transformOrigin: 'top right' }}
              className="absolute right-0 mt-4 w-96 glass z-50 rounded-[2rem] overflow-hidden border-border/50 shadow-2xl"
            >
              <div className="p-6 bg-muted/30 border-b border-border/50 flex items-center justify-between">
                <h4 className="font-black text-sm tracking-tighter uppercase">Notificaciones</h4>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">3 Nuevas</span>
                   <button onClick={() => setOpen(false)} className="hover:bg-muted p-1 rounded-full transition-colors">
                    <X className="h-4 w-4 text-muted-foreground" />
                   </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {sampleNotifications.map((notif, idx) => (
                  <motion.div 
                    key={notif.id} 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 border-b border-border/30 hover:bg-muted/40 transition-colors flex gap-4 cursor-pointer group"
                  >
                    <div className={`mt-1 p-2 rounded-xl shrink-0 ${
                      notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                      notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {notif.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                      {notif.type === 'success' && <CheckCircle className="w-4 h-4" />}
                      {notif.type === 'info' && <Info className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">{notif.text}</p>
                      <span className="text-[10px] text-muted-foreground mt-2 block font-medium uppercase tracking-wider">{notif.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-muted/20 text-center">
                 <Button variant="ghost" className="text-[10px] font-black text-primary hover:bg-transparent">MARCAR TODAS COMO LEÍDAS</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
