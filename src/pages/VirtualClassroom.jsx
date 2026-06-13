import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ArrowLeft, Library, Video, Download, MessageSquare, Clock, Users, ArrowRight, 
  Play, BookOpen, CheckCircle, FileText, Bot, Sparkles, TrendingUp, Search, Home
} from 'lucide-react';

export default function VirtualClassroom() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const res = await fetch('/api/student/subjects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setSubjects(data);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden">
      
      {/* Premium Navbar */}
      <nav className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none rotate-3 hover:rotate-0 transition-transform">
            <Library className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none">Entorno Virtual</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">LMS Enterprise NovaEdu</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2">
            <Home className="w-4 h-4" /> Hub
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border">
            <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Cinematic Welcome Header */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
          
          <div className="relative z-10 text-center lg:text-left space-y-6">
             <span className="text-[10px] font-black px-4 py-1.5 bg-emerald-600 rounded-full uppercase tracking-widest border border-emerald-500/30">Plataforma Activa • 2026-A</span>
             <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none uppercase max-w-lg">Tu Futuro se Construye Aquí</h2>
             <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                   <Video className="w-5 h-5 text-indigo-400" /> 1 Clase en Vivo
                </div>
                <div className="w-px h-5 bg-white/20 hidden sm:block"></div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                   <FileText className="w-5 h-5 text-amber-400" /> 4 Tareas Pendientes
                </div>
             </div>
          </div>

          <div className="relative z-10 hidden xl:block">
             <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 w-80 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-3 bg-indigo-600 rounded-2xl"><Sparkles className="w-5 h-5 text-white" /></div>
                   <h4 className="font-black text-sm uppercase tracking-tighter">AI Study Buddy</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic mb-6">"Tienes un examen de IA en 2 días. He preparado un resumen para ti."</p>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 font-black h-12 rounded-xl text-xs uppercase tracking-widest">REVISAR AHORA</Button>
             </Card>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between ml-2">
             <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3 uppercase">
               <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
               Mis Asignaturas
             </h3>
             <div className="flex items-center gap-4">
                <div className="relative group hidden md:block">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <input className="h-10 pl-11 pr-4 rounded-full bg-muted/50 border-none text-xs font-bold w-48 focus:w-64 transition-all" placeholder="Filtrar cursos..." />
                </div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-4 py-1.5 rounded-full">{subjects.length} Cursos Activos</span>
             </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => <div key={i} className="h-80 bg-muted animate-pulse rounded-[3rem]"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {subjects.map((course, index) => (
                <motion.div 
                  key={course.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group h-full"
                >
                  <Card className="h-full border-none shadow-xl glass rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col">
                    <div className={`h-2 w-full ${course.active ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-300 dark:bg-slate-800'}`}></div>
                    
                    <CardContent className="p-8 flex flex-col h-full space-y-6">
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest ${
                          course.active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 animate-pulse' : 'bg-muted text-muted-foreground'
                        }`}>
                          {course.active ? 'SALA ACTIVA' : 'SALA CERRADA'}
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground">{course.code}</span>
                      </div>

                      <div className="flex-grow">
                        <h3 className="text-xl font-black tracking-tight leading-tight mb-2 group-hover:text-indigo-600 transition-colors uppercase">{course.name}</h3>
                        <p className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                           <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] text-primary">{course.teacher[0]}</div>
                           {course.teacher}
                        </p>
                      </div>

                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <span>Progreso</span>
                            <span>{course.progress}%</span>
                         </div>
                         <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                         </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-4 border-t border-border/30">
                        <Button 
                          onClick={() => navigate(`/module/${course.id}`)}
                          className={`h-14 rounded-2xl font-black text-xs uppercase tracking-widest ${
                            course.active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none' : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                          }`}
                          disabled={!course.active}
                        >
                          {course.active ? (
                            <span className="flex items-center gap-2">ENTRAR AL AULA <Play className="w-3.5 h-3.5 fill-current" /></span>
                          ) : 'SALA CERRADA'}
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                           <Button variant="ghost" className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-600 p-0">
                              <Download className="w-3.5 h-3.5 mr-2" /> {course.materials} Rec
                           </Button>
                           <Button variant="ghost" className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-600 p-0">
                              <Video className="w-3.5 h-3.5 mr-2" /> {course.recordings} Grab
                           </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Intelligence Sidebar & Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16">
           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black tracking-tighter uppercase">Recursos Globales</h3>
                 <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { title: 'Biblioteca Nova', desc: 'Acceso a +50,000 libros digitales', icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-600' },
                   { title: 'Centro de Tutorías', desc: 'Resuelve tus dudas 1-a-1', icon: <Users className="w-6 h-6" />, color: 'bg-emerald-600' },
                   { title: 'Labs Virtuales', desc: 'Simuladores de alta precisión', icon: <Bot className="w-6 h-6" />, color: 'bg-purple-600' },
                   { title: 'Comunidad Académica', desc: 'Red de investigación Nova', icon: <Globe className="w-6 h-6" />, color: 'bg-pink-600' },
                 ].map((tool, idx) => (
                   <Card key={idx} className="border-none shadow-lg glass rounded-[2.5rem] hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group">
                      <CardContent className="p-8 flex items-center gap-6">
                         <div className={`p-4 rounded-2xl ${tool.color} text-white shadow-xl group-hover:rotate-12 transition-transform`}>
                            {tool.icon}
                         </div>
                         <div>
                            <h4 className="font-black text-lg tracking-tight leading-none mb-1 uppercase group-hover:text-indigo-600 transition-colors">{tool.title}</h4>
                            <p className="text-xs font-medium text-muted-foreground">{tool.desc}</p>
                         </div>
                      </CardContent>
                   </Card>
                 ))}
              </div>
           </div>

           <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden flex flex-col h-full">
              <CardHeader className="bg-slate-900 text-white p-8">
                 <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-black tracking-tighter flex items-center gap-2 uppercase">
                       <MessageSquare className="w-5 h-5 text-indigo-400" /> Notificaciones
                    </CardTitle>
                    <span className="px-3 py-1 bg-indigo-600 text-[10px] font-black rounded-full uppercase">3 NUEVAS</span>
                 </div>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                 <div className="divide-y divide-border/30">
                    {[
                      { user: 'Dr. Roberto Casas', text: 'Nueva tarea publicada', time: '5 min ago', icon: '📝' },
                      { user: 'SGA Core', text: 'Mantenimiento programado', time: '1h ago', icon: '⚙️' },
                      { user: 'Librería', text: 'Libro reservado listo', time: '3h ago', icon: '📚' },
                    ].map((n, i) => (
                      <div key={i} className="p-6 hover:bg-muted/30 transition-all cursor-pointer group">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-indigo-600/10 transition-colors text-lg">
                               {n.icon}
                            </div>
                            <div className="flex-1">
                               <p className="text-sm font-black leading-tight uppercase group-hover:text-indigo-600 transition-colors">{n.user}</p>
                               <p className="text-xs font-medium text-muted-foreground">{n.text}</p>
                            </div>
                            <span className="text-[9px] font-black text-muted-foreground uppercase">{n.time}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </CardContent>
              <div className="p-6 mt-auto">
                 <Button variant="ghost" className="w-full text-[10px] font-black tracking-widest text-indigo-600 py-4 h-auto rounded-xl hover:bg-indigo-600/5 uppercase border border-indigo-600/10">
                    LIMPIAR NOTIFICACIONES
                 </Button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

const Globe = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
