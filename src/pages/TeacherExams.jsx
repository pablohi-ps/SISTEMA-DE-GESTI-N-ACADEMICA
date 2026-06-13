import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  CalendarCheck, Plus, Calendar, FileText, 
  ChevronRight, ArrowLeft, ArrowRight, 
  X, AlertTriangle, ShieldAlert
} from 'lucide-react';

export default function TeacherExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newExam, setNewExam] = useState({ subject_id: '', title: '', description: '', date: '' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const [resEx, resSub] = await Promise.all([
        fetch('/api/teacher/exams', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/teacher/subjects', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setExams(await resEx.json());
      setSubjects(await resSub.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/teacher/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newExam)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewExam({ subject_id: '', title: '', description: '', date: '' });
        fetchData();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden">
      <nav className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600 rounded-2xl shadow-xl shadow-purple-200 dark:shadow-none">
            <CalendarCheck className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none">Gestión de Exámenes</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Evaluaciones Críticas</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate('/teacher/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-muted transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Panel
        </Button>
      </nav>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Cinematic Header Section */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1454165833767-027ff39c137a?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent"></div>
          
          <div className="relative z-10 text-center lg:text-left space-y-4">
             <span className="text-[10px] font-black px-4 py-1.5 bg-purple-600 rounded-full uppercase tracking-widest">Protocolo de Evaluación Oficial</span>
             <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">Calendario de Exámenes</h2>
             <p className="text-slate-400 font-medium max-w-xl text-lg">Programa parciales, finales y evaluaciones extraordinarias con control de seguridad y seguimiento de actas.</p>
          </div>
          
          <div className="relative z-10">
             <Button onClick={() => setIsModalOpen(true)} className="h-20 px-10 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg rounded-[2rem] shadow-2xl shadow-purple-200 dark:shadow-none group transition-all active:scale-95">
                <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform" /> PROGRAMAR EXAMEN
             </Button>
          </div>
        </div>

        {/* Exams List */}
        <div className="space-y-6">
           <div className="flex items-center justify-between ml-2">
              <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                <div className="w-2 h-8 bg-purple-600 rounded-full"></div>
                Próximas Evaluaciones
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-4 py-1.5 rounded-full">
                <ShieldAlert className="w-3 h-3 text-purple-600" /> {exams.length} Pendientes
              </div>
           </div>

           <div className="grid gap-6">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-28 rounded-[2.5rem] bg-muted animate-pulse border border-border/50"></div>)
              ) : (
                <AnimatePresence mode="popLayout">
                  {exams.map((ex, idx) => (
                    <motion.div 
                      key={ex.id} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="border-none shadow-xl glass rounded-[2.5rem] hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden">
                         <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                               <div className="p-5 bg-purple-100 dark:bg-purple-900/30 rounded-[1.5rem] text-purple-600 group-hover:scale-110 transition-transform shadow-inner">
                                  <FileText className="w-8 h-8" />
                               </div>
                               <div className="space-y-1">
                                  <h3 className="font-black text-xl tracking-tight leading-none group-hover:text-purple-600 transition-colors uppercase">{ex.title}</h3>
                                  <p className="text-[10px] font-black text-muted-foreground flex items-center gap-1.5 uppercase tracking-widest pt-1">
                                    <Calendar className="w-3.5 h-3.5 text-purple-600" /> Fecha Programada: {ex.date}
                                  </p>
                               </div>
                            </div>

                            <div className="flex items-center gap-4">
                               <div className="text-right mr-4 hidden sm:block">
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Estatus</p>
                                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-tighter border border-amber-500/20">PENDIENTE</span>
                               </div>
                               <Button variant="outline" className="h-12 w-12 p-0 rounded-full border-border group-hover:bg-purple-600 group-hover:text-white transition-all">
                                  <ChevronRight className="w-6 h-6" />
                               </Button>
                            </div>
                         </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              {exams.length === 0 && !loading && (
                <div className="text-center py-24 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50">
                  <AlertTriangle className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No hay exámenes programados para este periodo</p>
                  <Button onClick={() => setIsModalOpen(true)} variant="ghost" className="mt-4 text-purple-600 font-black text-[10px] tracking-widest uppercase hover:bg-purple-50">PROGRAMAR PRIMER EXAMEN</Button>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-card w-full max-w-2xl rounded-[3rem] shadow-2xl border border-border overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="p-10 space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                     <div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase">Programar Evaluación</h2>
                        <p className="text-muted-foreground font-medium">Define los términos y fecha del examen oficial.</p>
                     </div>
                     <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full h-10 w-10"><X className="w-5 h-5" /></Button>
                  </div>

                  <form onSubmit={handleCreate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Asignatura</label>
                          <select 
                            className="w-full h-14 rounded-2xl bg-muted/50 border-none px-4 text-sm font-bold focus:ring-2 ring-purple-600 outline-none"
                            value={newExam.subject_id}
                            onChange={e => setNewExam({...newExam, subject_id: e.target.value})}
                            required
                          >
                            <option value="">Selecciona materia...</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Fecha del Examen</label>
                          <Input 
                            type="date"
                            className="h-14 rounded-2xl bg-muted/50 border-none px-4 font-bold"
                            value={newExam.date}
                            onChange={e => setNewExam({...newExam, date: e.target.value})}
                            required
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Título de la Evaluación</label>
                       <Input 
                         placeholder="Ej: Examen Parcial de Algoritmos" 
                         className="h-14 rounded-2xl bg-muted/50 border-none px-4 font-bold"
                         value={newExam.title}
                         onChange={e => setNewExam({...newExam, title: e.target.value})}
                         required
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Descripción / Temario Oficial</label>
                       <textarea 
                         className="w-full min-h-[120px] rounded-2xl bg-muted/50 border-none p-4 text-sm font-medium focus:ring-2 ring-purple-600 outline-none resize-none"
                         placeholder="Detalla los temas, duración y requisitos del examen..."
                         value={newExam.description}
                         onChange={e => setNewExam({...newExam, description: e.target.value})}
                         required
                       />
                    </div>

                    <div className="flex gap-4 pt-4">
                       <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl font-black border-border">CANCELAR</Button>
                       <Button type="submit" className="flex-1 h-14 rounded-2xl bg-purple-600 text-white font-black shadow-xl shadow-purple-200 dark:shadow-none transition-all active:scale-95">
                          PROGRAMAR EVALUACIÓN
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
