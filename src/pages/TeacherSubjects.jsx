import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  BookUser, Search, ArrowLeft, ArrowRight, Clock, 
  Users, MapPin, GraduationCap
} from 'lucide-react';

export default function TeacherSubjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const res = await fetch('/api/teacher/subjects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setSubjects(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchSubjects();
  }, []);

  const filtered = subjects.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden">
      <nav className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20">
            <BookUser className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none">Mis Materias</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Gestión de Carga Académica</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate('/teacher/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-muted transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Panel
        </Button>
      </nav>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Cinematic Header Section */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 text-center lg:text-left space-y-4">
             <span className="text-[10px] font-black px-4 py-1.5 bg-white/10 rounded-full uppercase tracking-widest border border-white/10 backdrop-blur-md">Periodo Académico 2026-A</span>
             <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">Resumen de Carga Docente</h2>
             <p className="text-slate-400 font-medium max-w-xl text-lg">Administra tus cursos asignados, gestiona sílabos y realiza el seguimiento de tus estudiantes inscritos.</p>
          </div>
          <div className="relative z-10 flex gap-6 text-center">
             <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/10 min-w-[120px]">
                <p className="text-4xl font-black">{subjects.length}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Materias</p>
             </div>
             <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/10 min-w-[120px]">
                <p className="text-4xl font-black">128</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Alumnos</p>
             </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
           <div className="flex items-center gap-3 ml-2">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <h3 className="text-2xl font-black tracking-tighter">Listado de Asignaturas</h3>
           </div>
           <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Filtrar por nombre o código..." 
                className="pl-12 h-14 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-border/50 shadow-xl focus:ring-primary font-medium"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
        </div>

        {/* Subjects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-[3rem] bg-muted animate-pulse border border-border/50"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((s, idx) => (
                <motion.div 
                  key={s.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="h-full"
                >
                  <Card className="h-full border-none shadow-2xl glass rounded-[3rem] overflow-hidden group hover:shadow-primary/10 transition-all duration-500 flex flex-col">
                    <div className="h-32 bg-slate-900 relative overflow-hidden">
                       <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                       <div className="absolute bottom-4 left-6 flex items-center gap-2">
                          <span className="text-[10px] font-black px-2 py-0.5 bg-primary text-white rounded-md uppercase tracking-tighter shadow-lg">{s.code}</span>
                       </div>
                    </div>
                    <CardContent className="p-8 space-y-6 flex-1 flex flex-col">
                      <div>
                        <h4 className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{s.name}</h4>
                        <div className="flex items-center gap-4 mt-3">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              <Users className="w-3.5 h-3.5 text-primary" /> 32 Estudiantes
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              <GraduationCap className="w-3.5 h-3.5 text-primary" /> 4 UV
                           </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-border/50">
                         <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Lunes - 14:00</div>
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Salón 402</div>
                         </div>
                      </div>

                      <div className="mt-auto pt-6 flex gap-2">
                         <Button onClick={() => navigate(`/teacher/classroom?subject_id=${s.id}`)} className="flex-1 h-14 bg-primary text-white font-black text-xs rounded-2xl shadow-xl shadow-primary/10 group/btn overflow-hidden relative">
                            <span className="relative z-10 flex items-center justify-center gap-2">GESTIONAR <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></span>
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                         </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50">
                 <BookUser className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                 <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No se encontraron materias que coincidan</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
