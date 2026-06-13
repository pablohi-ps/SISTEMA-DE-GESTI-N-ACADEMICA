import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useAuth } from '../context/AuthContext';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Building2, User, Key, Mail, Power, Moon, Sun, Search, 
  Camera, IdCard, QrCode, GraduationCap, MapPin, 
  Library, Cake, ChevronDown, CheckCircle2, FileText,
  Target, FlaskConical, BookUser, HeartPulse, Briefcase,
  Calendar, Award, Scale, BadgeCheck, CalendarCheck,
  CircleDollarSign, Clock, BookOpen, FileSignature, TrendingUp, Settings, Megaphone,
  Bell, Bot, MessageSquare, X, Send, LayoutDashboard, Globe, ArrowRight, LogOut,
  Info
} from 'lucide-react';
import NovaBot from '../components/NovaBot';
import NotificationCenter from '../components/NotificationCenter';

const iconMap = {
  GraduationCap, Target, FlaskConical, BookUser, HeartPulse, Briefcase,
  Calendar, Award, Scale, Mail, BadgeCheck, CalendarCheck,
  CircleDollarSign, Clock, BookOpen, FileText, FileSignature, Library, TrendingUp, Settings, Megaphone
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
    return isDark;
  });
  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [observations, setObservations] = useState([]);
  const [loadingObservations, setLoadingObservations] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const response = await fetch('/api/modules', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) setModules(data);
      } catch (error) { console.error(error); }
      finally { setLoadingModules(false); }
    };

    const fetchObservations = async () => {
      if (!user || user.role !== 'student') {
        setLoadingObservations(false);
        return;
      }
      try {
        const token = localStorage.getItem('novaedu_token');
        const response = await fetch('/api/student/observations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) setObservations(data);
      } catch (error) { console.error(error); }
      finally { setLoadingObservations(false); }
    };

    fetchModules();
    fetchObservations();
  }, [user]);

  const toggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const filteredModules = (modules || []).filter(m => 
    m?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModalAction = () => {
    setModalLoading(true);
    setTimeout(() => {
      setModalLoading(false);
      setActiveModal(null);
      alert('Solicitud procesada con éxito.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground flex flex-col font-sans transition-all duration-500 overflow-x-hidden">
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Top Navbar */}
      <nav className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-border/50 text-foreground flex justify-between items-center px-8 fixed top-0 w-full z-50 transition-all duration-300">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="p-2 bg-primary rounded-2xl shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter text-gradient leading-none">NOVAEDU</span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">Enterprise SGA</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-border/50 mr-4">
             <Button variant="ghost" size="sm" onClick={() => navigate('/classrooms')} className="rounded-full h-8 text-xs font-bold hover:bg-background"><Globe className="w-3.5 h-3.5 mr-1.5" /> Campus Virtual</Button>
             <Button variant="ghost" size="sm" onClick={() => navigate('/messages')} className="rounded-full h-8 text-xs font-bold hover:bg-background"><Mail className="w-3.5 h-3.5 mr-1.5" /> Webmail</Button>
          </div>
          
          <NotificationCenter />
          
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-2xl hover:bg-muted ml-1 transition-all">
            {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
          </Button>

          <div className="h-8 w-px bg-border mx-2"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold leading-none">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-medium">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform" onClick={handleLogout}>
              {user?.name?.[0] || 'U'}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 mt-20 relative z-10">
        {/* Modern Sidebar */}
        <aside className="w-72 border-r border-border/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm hidden xl:block p-8 fixed h-[calc(100vh-5rem)]">
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 ml-2">Mi Perfil</p>
              <Card className="border-none shadow-xl bg-card/80 backdrop-blur-xl overflow-hidden group">
                 <div className="h-16 bg-gradient-to-r from-primary/80 to-indigo-500/80 w-full relative">
                   <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                 </div>
                 <CardContent className="p-0 text-center relative -mt-8">
                     <div className="w-16 h-16 mx-auto rounded-2xl border-4 border-card bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg relative z-10">
                       {user?.name?.[0] || 'U'}
                     </div>
                    <div className="p-4 pt-2">
                      <h3 className="font-bold text-sm truncate">{user?.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{user?.id}</p>
                      <div className="mt-3 flex justify-center gap-2">
                         <div className="p-1.5 bg-muted rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"><Settings className="w-3.5 h-3.5" /></div>
                         <div className="p-1.5 bg-muted rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"><Bell className="w-3.5 h-3.5" /></div>
                      </div>
                    </div>
                 </CardContent>
              </Card>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 ml-2">Explorar</p>
              <Button onClick={() => navigate('/schedule')} variant="ghost" className="w-full justify-start gap-3 h-12 rounded-2xl hover:bg-muted text-muted-foreground"><Calendar className="w-5 h-5" /> Horario</Button>
              <Button onClick={() => navigate('/library')} variant="ghost" className="w-full justify-start gap-3 h-12 rounded-2xl hover:bg-muted text-muted-foreground"><Library className="w-5 h-5" /> Biblioteca</Button>
              <Button onClick={() => navigate('/tutoring')} variant="ghost" className="w-full justify-start gap-3 h-12 rounded-2xl hover:bg-muted text-muted-foreground"><Target className="w-5 h-5" /> Tutorías</Button>
              <Button onClick={() => navigate('/messages')} variant="ghost" className="w-full justify-start gap-3 h-12 rounded-2xl hover:bg-muted text-muted-foreground"><Mail className="w-5 h-5" /> Mensajería</Button>
              <Button onClick={() => setActiveModal('practice')} variant="ghost" className="w-full justify-start gap-3 h-12 rounded-2xl hover:bg-muted text-muted-foreground"><Briefcase className="w-5 h-5" /> Prácticas</Button>
            </div>

            <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               <h4 className="font-bold text-sm relative z-10">¿Necesitas ayuda?</h4>
               <p className="text-[10px] opacity-80 mt-1 mb-4 relative z-10">Nuestro soporte técnico está disponible 24/7 para ti.</p>
               <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 text-[10px] font-black h-8 rounded-xl shadow-lg">CONTACTAR</Button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 xl:ml-72 p-6 lg:p-12 pb-32">
          
          {/* Welcome Section */}
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2">
                Hola, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Usuario'}</span> 👋
              </h1>
              <p className="text-muted-foreground font-medium text-lg">Bienvenido de vuelta a tu ecosistema académico centralizado.</p>
            </motion.div>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Salir al Inicio
            </Button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
             <Card className="glass border-none group hover:scale-[1.02] transition-all">
               <CardContent className="p-6 flex items-center gap-6">
                 <div className="p-4 bg-primary/10 text-primary rounded-3xl group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                   <Clock className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Próxima Clase</p>
                    <p className="font-bold text-lg">Ing. de Software II</p>
                    <p className="text-xs text-primary font-bold">14:00 - Salón 402</p>
                 </div>
               </CardContent>
             </Card>
             <Card className="glass border-none group hover:scale-[1.02] transition-all">
               <CardContent className="p-6 flex items-center gap-6">
                 <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-3xl group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                   <Target className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tareas Pendientes</p>
                    <p className="font-bold text-lg">3 Actividades</p>
                    <p className="text-xs text-emerald-600 font-bold">Vencen pronto</p>
                 </div>
               </CardContent>
             </Card>
             <Card className="glass border-none group hover:scale-[1.02] transition-all md:col-span-2 lg:col-span-1">
               <CardContent className="p-6 flex items-center gap-6">
                 <div className="p-4 bg-amber-500/10 text-amber-600 rounded-3xl group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
                   <Megaphone className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Avisos SGA</p>
                    <p className="font-bold text-lg">Exámenes Finales</p>
                    <p className="text-xs text-amber-600 font-bold">Ver calendario</p>
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* Academic Intelligence Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
             <Card className="lg:col-span-2 border-none shadow-2xl glass rounded-[3rem] overflow-hidden group">
                <CardHeader className="p-10 pb-0">
                   <div className="flex justify-between items-center">
                      <div>
                         <CardTitle className="text-2xl font-black tracking-tighter uppercase">Progreso Académico</CardTitle>
                         <CardDescription className="font-medium italic">Semestre 2026-A • Ingeniería de Software</CardDescription>
                      </div>
                      <div className="p-4 bg-primary/10 rounded-[2rem] text-primary"><TrendingUp className="w-6 h-6" /></div>
                   </div>
                </CardHeader>
                <CardContent className="p-10">
                   <div className="space-y-8">
                      <div className="space-y-3">
                         <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                            <span>Créditos Totales</span>
                            <span className="text-primary">82% Completado</span>
                         </div>
                         <div className="h-4 w-full bg-muted rounded-full overflow-hidden p-1 border border-border/50">
                            <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-primary to-indigo-600 rounded-full shadow-lg shadow-primary/30"></motion.div>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 pt-4">
                         <div className="p-6 bg-muted/30 rounded-[2rem] text-center border border-border/20">
                            <p className="text-2xl font-black tracking-tighter text-indigo-600">8.9</p>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">GPA Promedio</p>
                         </div>
                         <div className="p-6 bg-muted/30 rounded-[2rem] text-center border border-border/20">
                            <p className="text-2xl font-black tracking-tighter text-emerald-600">24</p>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Materias Aprobadas</p>
                         </div>
                         <div className="p-6 bg-muted/30 rounded-[2rem] text-center border border-border/20">
                            <p className="text-2xl font-black tracking-tighter text-amber-600">3</p>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Becas Activas</p>
                         </div>
                      </div>
                   </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
                <CardHeader className="bg-indigo-600 text-white p-8">
                   <CardTitle className="text-lg font-black tracking-tighter flex items-center gap-2 uppercase">
                      <Calendar className="w-5 h-5" /> Agenda del Día
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="divide-y divide-border/50">
                      {[
                        { time: '08:00', subject: 'IA Generativa', room: 'Lab 2', active: true },
                        { time: '10:00', subject: 'Seguridad Informática', room: 'Virtual', active: false },
                        { time: '14:00', subject: 'Ing. Software II', room: 'Salón 402', active: false },
                      ].map((item, idx) => (
                        <div key={idx} className={`p-6 flex items-center gap-4 transition-all hover:bg-muted/30 cursor-pointer ${item.active ? 'bg-primary/5' : ''}`}>
                           <div className={`text-xs font-black uppercase tracking-widest ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>
                              {item.time}
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-black tracking-tight leading-none uppercase">{item.subject}</p>
                              <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                 <MapPin className="w-3 h-3" /> {item.room}
                              </p>
                           </div>
                           {item.active && <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>}
                        </div>
                      ))}
                   </div>
                   <Button variant="ghost" className="w-full text-[10px] font-black tracking-widest text-primary py-6 h-auto rounded-none hover:bg-primary/5 uppercase">
                      Ver Horario Completo
                   </Button>
                </CardContent>
              </Card>
           </div>

           {/* Observations and Conduct section */}
           {user?.role === 'student' && (
             <div className="grid grid-cols-1 gap-8 mb-12">
                <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
                   <CardHeader className="p-10 pb-0">
                      <div className="flex justify-between items-center">
                         <div>
                            <CardTitle className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
                              <Award className="w-6 h-6 text-primary" /> Expediente de Observaciones y Conducta
                            </CardTitle>
                            <CardDescription className="font-medium italic">Historial de anotaciones registradas por docentes e inspectores</CardDescription>
                         </div>
                      </div>
                   </CardHeader>
                   <CardContent className="p-10">
                      {loadingObservations ? (
                        <div className="flex justify-center items-center py-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                        </div>
                      ) : observations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="font-bold">Sin observaciones registradas</p>
                          <p className="text-xs">¡Buen trabajo! No registras anotaciones de demérito ni advertencias conductuales.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {observations.map((obs) => (
                            <div key={obs.id} className="p-5 rounded-2xl bg-muted/40 border border-border/50 flex flex-col md:flex-row justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                                    obs.type === 'Académica' ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                  }`}>
                                    Anotación {obs.type}
                                  </span>
                                  <span className="text-[10px] font-bold text-muted-foreground">{new Date(obs.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{obs.details}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 text-right md:self-center">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                                  {obs.teacher_name?.[0]}
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-wider">{obs.teacher_name}</p>
                                  <p className="text-[9px] text-muted-foreground">Docente / Evaluador</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                   </CardContent>
                </Card>
             </div>
           )}

           <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
               <h2 className="text-2xl font-black flex items-center gap-3 text-foreground">
                 <div className="w-2 h-8 bg-primary rounded-full"></div>
                 Módulos de Gestión
               </h2>
               <div className="relative w-full md:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Filtrar servicios..." 
                    className="pl-11 pr-4 py-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-border/50 focus:ring-primary shadow-xl backdrop-blur-md"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>

            {loadingModules ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-40 rounded-3xl bg-muted animate-pulse"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredModules.map((module, index) => {
                  const IconComponent = (iconMap && module.icon && iconMap[module.icon]) ? iconMap[module.icon] : FileText;
                  
                  let targetRoute = `/module/${module.id}`;
                  let onClickAction = null;

                  if (module.title === "SGA ESTUDIANTES") targetRoute = "/academic";
                  else if (module.title === "SISTEMA FINANCIERO") targetRoute = "/finance";
                  else if (module.title === "AULAS VIRTUALES") targetRoute = "/classrooms";
                  else if (module.title === "WEBMAIL") targetRoute = "/messages";
                  else if (module.title === "EVALUACION DOCENTE") targetRoute = "/evaluation";
                  else if (module.title === "Reportes Financieros") targetRoute = "/admin/finance";
                  else if (module.title === "Registro de Calificaciones") targetRoute = "/teacher/grades";
                  else if (module.title === "Control de Asistencia") targetRoute = "/teacher/attendance";
                  else if (module.title === "Gestión de Aula Virtual") targetRoute = "/teacher/classroom";
                  else if (module.title === "Panel Docente") targetRoute = "/teacher/dashboard";
                  else if (module.title === "TUTORIAS ACADEMICAS") targetRoute = "/tutoring";
                  else if (module.title === "BIBLIOTECA DIGITAL") targetRoute = "/library";
                  else if (module.title === "PRACTICAS ESTUDIANTILES") { targetRoute = "#"; onClickAction = () => setActiveModal('practice'); }
                  else if (module.title === "Configuración Global") { targetRoute = "#"; onClickAction = () => setActiveModal('config'); }

                  return (
                    <motion.div 
                      key={module.id} 
                      initial={{ y: 20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                    >
                      <Link to={onClickAction ? '#' : targetRoute} onClick={onClickAction}>
                        <Card className="h-full border-none shadow-lg bg-card/60 backdrop-blur-xl hover:bg-card hover:shadow-2xl transition-all duration-300 group overflow-hidden rounded-[2.5rem]">
                          <CardContent className="p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/5 to-primary/20 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-inner group-hover:shadow-primary/30 group-hover:shadow-2xl">
                              <IconComponent className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="font-black text-xs leading-tight mb-2 tracking-tight uppercase">{module.title}</h3>
                            <p className="text-[10px] text-muted-foreground line-clamp-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">{module.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <NovaBot />
      
      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-t border-border/50 py-3 px-8 text-[10px] font-bold text-muted-foreground flex justify-between items-center z-40">
         <div className="flex gap-4">
           <span>&copy; 2026 NOVAEDU SYSTEMS</span>
           <span className="hidden sm:inline">VERSION 4.2.0-STABLE</span>
         </div>
         <div className="flex gap-4">
           <a href="#" className="hover:text-primary transition-colors">TÉRMINOS</a>
           <a href="#" className="hover:text-primary transition-colors">PRIVACIDAD</a>
         </div>
      </footer>

      {/* Global Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-card w-full max-w-md p-8 rounded-[3rem] shadow-2xl border border-border relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
               <div className="relative z-10 space-y-6">
                  
                  {activeModal === 'tutoring' && (
                    <div className="space-y-6">
                       <div className="p-4 bg-primary/10 rounded-2xl w-fit text-primary"><Target className="w-8 h-8" /></div>
                       <h3 className="text-2xl font-black tracking-tighter">Solicitar Tutoría</h3>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Materia</label>
                             <select className="w-full h-12 rounded-2xl bg-muted/50 border-none px-4 text-sm font-medium">
                                <option>Ingeniería de Software II</option>
                                <option>Inteligencia Artificial</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Motivo de la sesión</label>
                             <textarea className="w-full min-h-[100px] rounded-2xl bg-muted/50 border-none p-4 text-sm font-medium focus:ring-2 ring-primary outline-none" placeholder="Describe tu duda..."></textarea>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeModal === 'library' && (
                    <div className="space-y-6">
                       <div className="p-4 bg-primary/10 rounded-2xl w-fit text-primary"><Library className="w-8 h-8" /></div>
                       <h3 className="text-2xl font-black tracking-tighter">Biblioteca Digital</h3>
                       <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="Buscar libros, artículos, tesis..." className="pl-12 h-14 rounded-2xl bg-muted/50 border-none" />
                       </div>
                       <div className="space-y-3">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Tendencias</p>
                          <div className="flex gap-2 flex-wrap">
                             {['Clean Code', 'React 19', 'AI Agents', 'Microservices'].map(t => (
                               <span key={t} className="px-3 py-1 bg-muted rounded-full text-xs font-bold border border-border/50">{t}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                  )}

                  {activeModal === 'birthday' && (
                    <div className="text-center space-y-4">
                       <div className="p-5 bg-indigo-500/10 rounded-[2rem] w-fit mx-auto text-indigo-600"><Cake className="w-10 h-10" /></div>
                       <h3 className="text-2xl font-black tracking-tighter">Cumpleaños</h3>
                       <p className="text-muted-foreground text-sm font-medium">Hoy celebramos a:</p>
                       <div className="bg-muted/50 p-4 rounded-2xl border border-border/50 font-bold">Dr. Roberto Casas 🎂</div>
                    </div>
                  )}

                  {(activeModal === 'practice' || activeModal === 'config') && (
                    <div className="text-center space-y-4">
                       <div className="p-5 bg-primary/10 rounded-[2rem] w-fit mx-auto text-primary">
                         {activeModal === 'practice' ? <Briefcase className="w-10 h-10" /> : <Settings className="w-10 h-10" />}
                       </div>
                       <h3 className="text-2xl font-black tracking-tighter">{activeModal === 'practice' ? 'Bolsa de Prácticas' : 'Configuración'}</h3>
                       <p className="text-muted-foreground text-sm leading-relaxed">Módulo en proceso de sincronización con la base de datos central.</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button onClick={() => setActiveModal(null)} variant="outline" className="flex-1 h-14 rounded-2xl font-black border-border">CANCELAR</Button>
                    <Button onClick={handleModalAction} className="flex-1 h-14 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20" disabled={modalLoading}>
                      {modalLoading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
                        <span className="flex items-center gap-2">CONFIRMAR <ArrowRight className="w-4 h-4" /></span>
                      )}
                    </Button>
                  </div>
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
