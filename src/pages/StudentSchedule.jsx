import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ArrowLeft, Calendar, Clock, MapPin, User, Download, 
  ExternalLink, Home, Info, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const HOURS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const MOCK_SCHEDULE = [
  { id: 1, day: 'Lunes', start: '08:00', end: '10:00', subject: 'IA Generativa', room: 'Lab 2', teacher: 'Dr. Alan Turing', color: 'bg-indigo-500' },
  { id: 2, day: 'Lunes', start: '14:00', end: '16:00', subject: 'Ing. Software II', room: 'Salón 402', teacher: 'Dra. Margaret Hamilton', color: 'bg-emerald-500' },
  { id: 3, day: 'Martes', start: '10:00', end: '12:00', subject: 'Seguridad Informática', room: 'Virtual', teacher: 'Dr. Kevin Mitnick', color: 'bg-rose-500' },
  { id: 4, day: 'Miércoles', start: '08:00', end: '10:00', subject: 'IA Generativa', room: 'Lab 2', teacher: 'Dr. Alan Turing', color: 'bg-indigo-500' },
  { id: 5, day: 'Miércoles', start: '11:00', end: '13:00', subject: 'Base de Datos NoSQL', room: 'Salón 101', teacher: 'MSc. Grace Hopper', color: 'bg-amber-500' },
  { id: 6, day: 'Jueves', start: '14:00', end: '16:00', subject: 'Ing. Software II', room: 'Salón 402', teacher: 'Dra. Margaret Hamilton', color: 'bg-emerald-500' },
  { id: 7, day: 'Viernes', start: '09:00', end: '11:00', subject: 'Sistemas Distribuidos', room: 'Salón 305', teacher: 'Dr. Leslie Lamport', color: 'bg-purple-500' },
];

export default function StudentSchedule() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);
  const [schedule, setSchedule] = useState([]);
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const res = await fetch('/api/student/schedule', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setSchedule(data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchSchedule();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden font-sans">
      
      {/* Cinematic Navbar */}
      <nav className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none rotate-3">
            <Calendar className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none uppercase">Horario Semestral</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Ingeniería de Software • 2026-A</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2">
            <Home className="w-4 h-4" /> Hub
          </Button>
          <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-border group">
             <Download className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform" /> EXPORTAR .ICS
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border">
            <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Cinematic Controls */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 bg-white/50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-border/50 backdrop-blur-md">
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 text-primary"><ChevronLeft className="w-6 h-6" /></Button>
              <h2 className="text-xl font-black uppercase tracking-tighter">Mayo 11 - Mayo 15, 2026</h2>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 text-primary"><ChevronRight className="w-6 h-6" /></Button>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 animate-pulse">
                 <div className="w-2 h-2 bg-emerald-600 rounded-full"></div> En Curso: IA Generativa
              </div>
              <Button className="rounded-2xl bg-primary text-white font-black px-6 shadow-xl shadow-primary/20">IR A HOY</Button>
           </div>
        </div>

        {/* The Grid */}
        <div className="relative border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
           <div className="overflow-x-auto no-scrollbar">
              <div className="min-w-[1000px]">
                 {/* Header Days */}
                 <div className="grid grid-cols-6 border-b border-border/50 bg-muted/30">
                    <div className="p-6 border-r border-border/50 flex items-center justify-center">
                       <Clock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    {DAYS.map(day => (
                       <div key={day} className="p-6 text-center border-r last:border-0 border-border/50">
                          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{day}</span>
                       </div>
                    ))}
                 </div>

                 {/* Hours Rows */}
                 <div className="relative">
                    {HOURS.map((hour) => (
                       <div key={hour} className="grid grid-cols-6 border-b last:border-0 border-border/50 h-24">
                          <div className="p-4 border-r border-border/50 flex items-start justify-center">
                             <span className="text-[10px] font-black text-muted-foreground/50 tabular-nums">{hour}</span>
                          </div>
                          {DAYS.map(day => (
                             <div key={`${day}-${hour}`} className="border-r last:border-0 border-border/50 relative group">
                                {/* Subject Placement Logic */}
                                {schedule.filter(s => s.day === day && s.start === hour).map(cls => {
                                   // Calculate span
                                   const startIdx = HOURS.indexOf(cls.start);
                                   const endIdx = HOURS.indexOf(cls.end);
                                   const height = (endIdx - startIdx) * 100; // percent height
                                   
                                   return (
                                     <motion.div 
                                       key={cls.id}
                                       initial={{ opacity: 0, y: 10 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       onClick={() => setSelectedClass(cls)}
                                       className={`absolute inset-x-2 top-2 rounded-2xl p-4 cursor-pointer z-10 shadow-xl transition-all hover:scale-[1.02] active:scale-95 ${cls.color} text-white`}
                                       style={{ height: `calc(${height}% - 1rem)` }}
                                     >
                                        <div className="flex justify-between items-start mb-2">
                                           <p className="text-[9px] font-black uppercase tracking-widest opacity-80">{cls.start} - {cls.end}</p>
                                           <Info className="w-3.5 h-3.5 opacity-50" />
                                        </div>
                                        <h4 className="font-black text-xs leading-tight uppercase line-clamp-2 mb-1">{cls.subject}</h4>
                                        <p className="text-[9px] font-bold flex items-center gap-1 opacity-90"><MapPin className="w-3 h-3" /> {cls.room}</p>
                                        
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <Sparkles className="w-4 h-4 text-white/50" />
                                        </div>
                                     </motion.div>
                                   );
                                })}
                             </div>
                          ))}
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Detailed View Modal (Side) */}
        <AnimatePresence>
           {selectedClass && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] flex items-center justify-end bg-black/40 backdrop-blur-md"
               onClick={() => setSelectedClass(null)}
             >
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="w-full max-w-md h-full bg-card shadow-2xl p-10 flex flex-col justify-between"
                  onClick={e => e.stopPropagation()}
                >
                   <div className="space-y-10">
                      <div className="flex justify-between items-start">
                         <div className={`p-4 rounded-2xl text-white ${selectedClass.color}`}>
                            <Calendar className="w-8 h-8" />
                         </div>
                         <Button onClick={() => setSelectedClass(null)} variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-6 h-6 rotate-180" />
                         </Button>
                      </div>

                      <div className="space-y-2">
                         <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Materia Oficial</span>
                         <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">{selectedClass.subject}</h2>
                         <p className="text-muted-foreground font-medium text-lg">Semestre 2026-A • Ingeniería de Software</p>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Docente Titular</p>
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
                               <p className="font-bold text-sm">{selectedClass.teacher}</p>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ubicación</p>
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center"><MapPin className="w-5 h-5 text-indigo-500" /></div>
                               <p className="font-bold text-sm">{selectedClass.room}</p>
                            </div>
                         </div>
                      </div>

                      <div className="p-8 bg-muted/30 rounded-[2rem] border border-border/50 space-y-4">
                         <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" /> Observaciones Académicas
                         </h4>
                         <p className="text-xs text-muted-foreground leading-relaxed">Asistencia obligatoria del 80%. Las sesiones prácticas se llevan a cabo en el laboratorio asignado.</p>
                      </div>
                   </div>

                   <div className="space-y-4 pt-10">
                      <Button className="w-full h-16 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                         VER AULA VIRTUAL <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" className="w-full h-16 rounded-2xl font-black border-border uppercase tracking-widest text-[10px]">
                         SOLICITAR TUTORÍA
                      </Button>
                   </div>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Global Disclaimer */}
        <div className="p-8 bg-muted/30 rounded-[2.5rem] border border-border/50 flex items-center gap-4">
           <Info className="w-6 h-6 text-indigo-500" />
           <p className="text-xs font-medium text-muted-foreground italic">
              Los horarios están sujetos a cambios por parte de la secretaría académica. Las actualizaciones se reflejan en tiempo real en este panel.
           </p>
        </div>
      </div>
    </div>
  );
}
