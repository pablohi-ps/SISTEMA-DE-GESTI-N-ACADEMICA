import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Target, Calendar, Clock, User, MessageSquare, 
  CheckCircle2, AlertCircle, Plus, Info, Home, Video, 
  ExternalLink, Sparkles, ChevronRight
} from 'lucide-react';

export default function StudentTutoring() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [subject, setSubject] = useState('Ingeniería de Software II');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/student/tutoring', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setSessions(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSessions();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/student/tutoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject,
          teacher: subject === 'Ingeniería de Software II' ? 'Dr. Roberto Casas' : subject === 'IA Generativa' ? 'Dra. Elena Rossi' : 'Dr. Roberto Casas',
          date,
          time,
          type: 'Virtual'
        })
      });
      if (res.ok) {
        setIsBooking(false);
        setDate('');
        setTime('');
        setDescription('');
        await fetchSessions();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSession = async (id) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta tutoría?')) return;
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch(`/api/student/tutoring/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchSessions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden font-sans">
      
      {/* Cinematic Navbar */}
      <nav className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-600 rounded-2xl shadow-xl shadow-rose-200 dark:shadow-none rotate-3">
            <Target className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none uppercase">Centro de Tutorías</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Apoyo Académico Personalizado • NovaEdu</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2">
            <Home className="w-4 h-4" /> Hub
          </Button>
          <Button onClick={() => setIsBooking(true)} className="rounded-2xl h-12 px-6 bg-rose-600 text-white font-black shadow-xl shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-2">
             <Plus className="w-5 h-5" /> SOLICITAR SESIÓN
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border">
            <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Cinematic Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <Card className="border-none shadow-2xl glass rounded-[3rem] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="space-y-4">
                 <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl w-fit"><CheckCircle2 className="w-8 h-8" /></div>
                 <h3 className="text-4xl font-black tracking-tighter">{sessions.filter(s => s.status === 'Completado').length}</h3>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sesiones Completadas</p>
              </div>
           </Card>
           <Card className="border-none shadow-2xl glass rounded-[3rem] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="space-y-4">
                 <div className="p-4 bg-amber-500/10 text-amber-600 rounded-2xl w-fit"><Clock className="w-8 h-8" /></div>
                 <h3 className="text-4xl font-black tracking-tighter">{sessions.filter(s => s.status === 'Pendiente').length}</h3>
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Petición Pendiente</p>
              </div>
           </Card>
           <Card className="border-none shadow-2xl glass rounded-[3rem] p-10 relative overflow-hidden group bg-slate-900 text-white">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              <div className="relative z-10 space-y-4">
                 <div className="p-4 bg-white/10 rounded-2xl w-fit"><Sparkles className="w-8 h-8 text-rose-400" /></div>
                 <h3 className="text-2xl font-black tracking-tighter leading-tight uppercase">Eleva tu <br/> Promedio</h3>
                 <p className="text-[10px] font-medium opacity-60 leading-relaxed uppercase tracking-widest">Las tutorías aumentan un 25% el rendimiento académico.</p>
              </div>
           </Card>
        </div>

        {/* Tutoring History List */}
        <div className="space-y-8">
           <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3 uppercase">
              <div className="w-2 h-8 bg-rose-600 rounded-full"></div>
              Historial de Soporte Académico
           </h3>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sessions.map((session, idx) => (
                <motion.div 
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                   <Card className="border-none shadow-xl glass rounded-[2.5rem] overflow-hidden group hover:scale-[1.01] transition-all">
                      <CardContent className="p-8">
                         <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                 session.status === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                 session.status === 'Pendiente' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                 'bg-slate-500/10 text-slate-600 border-slate-500/20'
                               }`}>
                                  {session.status}
                               </span>
                               <h4 className="text-xl font-black tracking-tighter uppercase mt-2">{session.subject}</h4>
                            </div>
                            <div className="p-3 bg-muted rounded-xl text-muted-foreground"><Calendar className="w-5 h-5" /></div>
                         </div>

                         <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border/50">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Docente</p>
                               <p className="text-xs font-bold flex items-center gap-2"><User className="w-3.5 h-3.5" /> {session.teacher}</p>
                            </div>
                            <div className="space-y-1 text-right">
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fecha & Hora</p>
                               <p className="text-xs font-bold flex items-center justify-end gap-2">{session.date} • {session.time} <Clock className="w-3.5 h-3.5" /></p>
                            </div>
                         </div>

                         <div className="pt-6 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                               {session.type === 'Virtual' ? <Video className="w-4 h-4 text-rose-500" /> : <Home className="w-4 h-4 text-indigo-500" />}
                               Modalidad {session.type}
                            </div>
                            <div className="flex gap-2">
                               {session.status === 'Pendiente' && (
                                 <Button 
                                   onClick={() => handleCancelSession(session.id)}
                                   variant="outline" 
                                   className="h-10 px-4 border-border text-rose-600 hover:bg-rose-50 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                                 >
                                    CANCELAR
                                 </Button>
                               )}
                               {session.status === 'Aprobado' && session.link && (
                                 <a href={session.link} target="_blank" rel="noopener noreferrer">
                                   <Button className="h-10 px-6 bg-rose-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-all">
                                      UNIRSE A LA SESIÓN <ExternalLink className="w-3.5 h-3.5 ml-2" />
                                   </Button>
                                 </a>
                               )}
                               {session.status === 'Completado' && (
                                 <Button variant="ghost" className="h-10 text-[10px] font-black uppercase tracking-widest text-primary">VER RESUMEN</Button>
                               )}
                             </div>
                         </div>
                      </CardContent>
                   </Card>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Global Disclaimer */}
        <div className="p-8 bg-muted/30 rounded-[2.5rem] border border-border/50 flex items-center gap-4">
           <Info className="w-6 h-6 text-rose-600" />
           <p className="text-xs font-medium text-muted-foreground italic">
              Las solicitudes de tutoría deben realizarse con al menos 48 horas de anticipación. El docente tiene la facultad de proponer una nueva fecha según su disponibilidad.
           </p>
        </div>
      </div>

      {/* Booking Drawer/Modal */}
      <AnimatePresence>
         {isBooking && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-card w-full max-w-lg p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                 
                 <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <h3 className="text-3xl font-black tracking-tighter uppercase">Nueva Solicitud</h3>
                          <p className="text-sm font-medium text-muted-foreground">Formulario de Soporte Académico</p>
                       </div>
                       <Button onClick={() => setIsBooking(false)} variant="ghost" size="icon" className="rounded-full"><Home className="w-6 h-6" /></Button>
                    </div>

                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Materia Relacionada</label>
                          <select 
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="w-full h-14 rounded-2xl bg-muted border-none px-6 text-sm font-bold focus:ring-2 ring-rose-500 outline-none transition-all"
                            required
                          >
                             <option>Ingeniería de Software II</option>
                             <option>IA Generativa</option>
                             <option>Sistemas Distribuidos</option>
                          </select>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Fecha Sugerida</label>
                             <Input 
                               type="date" 
                               value={date}
                               onChange={e => setDate(e.target.value)}
                               className="h-14 rounded-2xl bg-muted border-none px-6 font-bold" 
                               required
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Horario Sugerido</label>
                             <Input 
                               type="time" 
                               value={time}
                               onChange={e => setTime(e.target.value)}
                               className="h-14 rounded-2xl bg-muted border-none px-6 font-bold" 
                               required
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Descripción del Problema</label>
                          <textarea 
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full min-h-[120px] rounded-2xl bg-muted border-none p-6 text-sm font-bold focus:ring-2 ring-rose-500 outline-none transition-all" 
                            placeholder="Ej: No entiendo la implementación de Redux Saga..."
                            required
                          ></textarea>
                       </div>

                       <div className="flex gap-4 pt-4">
                          <Button type="button" onClick={() => setIsBooking(false)} variant="outline" className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] border-border">CANCELAR</Button>
                          <Button type="submit" disabled={loading} className="flex-1 h-16 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-600/20 active:scale-95 transition-all">
                             {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
                                <span className="flex items-center justify-center gap-2">ENVIAR SOLICITUD <ChevronRight className="w-5 h-5" /></span>
                             )}
                          </Button>
                       </div>
                    </form>
                 </div>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

const Loader2 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
