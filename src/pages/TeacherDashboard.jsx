import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, CalendarCheck, MessageSquare, BookUser, 
  TrendingUp, Users, Clock, AlertCircle, 
  ChevronRight, Calendar as CalendarIcon, Star, Bell,
  PlusCircle, FileText, CheckCircle2, LayoutDashboard,
  ShieldCheck, ArrowRight, LogOut, Home, Mail
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

export default function TeacherDashboard() {
  const { user, logout: _logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ subjects: 0, assignments: 0, pending: 5, students: 42 });
  const [_loading, setLoading] = useState(true);

  // New features states
  const [tutorings, setTutorings] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [obsType, setObsType] = useState('Académica');
  const [obsDetails, setObsDetails] = useState('');
  const [registeringObs, setRegisteringObs] = useState(false);
  const [obsMessage, setObsMessage] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const [resSub, resAss, resTut, resStud] = await Promise.all([
          fetch('/api/teacher/subjects', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/teacher/assignments', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/teacher/tutoring', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/teacher/students', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        const subs = await resSub.json();
        const asses = await resAss.json();
        const tuts = await resTut.json();
        const studs = await resStud.json();

        setStats(prev => ({ ...prev, subjects: subs.length, assignments: asses.length }));
        setTutorings(tuts);
        setStudents(studs);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    
    fetchDashboardData();
  }, []);

  const menuItems = [
    { title: 'Materias', desc: 'Gestiona tus cursos y sílabos', icon: <BookUser className="w-6 h-6" />, to: '/teacher/subjects', color: 'bg-blue-600' },
    { title: 'Tareas', desc: 'Crea y califica actividades', icon: <BookOpen className="w-6 h-6" />, to: '/teacher/assignments', color: 'bg-indigo-600' },
    { title: 'Exámenes', desc: 'Programa evaluaciones críticas', icon: <CalendarCheck className="w-6 h-6" />, to: '/teacher/exams', color: 'bg-purple-600' },
    { title: 'Foros', desc: 'Modera debates académicos', icon: <MessageSquare className="w-6 h-6" />, to: '/teacher/forums', color: 'bg-pink-600' },
    { title: 'Asistencia', desc: 'Control diario de alumnos', icon: <CalendarIcon className="w-6 h-6" />, to: '/teacher/attendance', color: 'bg-amber-600' },
    { title: 'Calificaciones', desc: 'Registro oficial de notas', icon: <Star className="w-6 h-6" />, to: '/teacher/grades', color: 'bg-emerald-600' },
    { title: 'Mensajería', desc: 'Chat y correspondencia interna', icon: <Mail className="w-6 h-6" />, to: '/messages', color: 'bg-violet-600' },
  ];

  const handleUpdateTutoring = async (id, status) => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch(`/api/teacher/tutoring/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          link: status === 'Aprobado' ? 'https://meet.google.com/abc-defg-hij' : ''
        })
      });
      if (res.ok) {
        setTutorings(prev => prev.map(t => t.id === id ? { ...t, status, link: status === 'Aprobado' ? 'https://meet.google.com/abc-defg-hij' : '' } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmittingObservation = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !obsDetails.trim()) return;
    setRegisteringObs(true);
    setObsMessage('');
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/teacher/observations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_id: selectedStudent,
          type: obsType,
          details: obsDetails
        })
      });
      if (res.ok) {
        setObsDetails('');
        setObsMessage('Observación guardada con éxito.');
      } else {
        setObsMessage('Error al guardar la observación.');
      }
    } catch (err) {
      setObsMessage('Error de conexión.');
      console.error(err);
    } finally {
      setRegisteringObs(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500">
      
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')} 
          className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" /> Hub Central
        </Button>

        <Button 
          variant="ghost" 
          onClick={() => {
            localStorage.removeItem('novaedu_token');
            navigate('/login');
          }} 
          className="rounded-2xl h-12 px-6 font-bold text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </Button>
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 text-white shadow-2xl mb-12">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
               <span className="px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Panel Docente</span>
               <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-2 border border-white/10">
                 <ShieldCheck className="w-3 h-3" /> Certificado
               </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none">¡Bienvenido, Prof. {user?.name.split(' ')[0]}!</h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">Central de mando para la gestión académica, seguimiento de alumnos y evaluación continua.</p>
          </div>
          
          <div className="flex gap-4">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700 font-black px-8 h-16 rounded-2xl shadow-2xl shadow-indigo-200 dark:shadow-none text-sm group">
              <PlusCircle className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" /> NUEVA TAREA
            </Button>
            <Button variant="outline" onClick={() => navigate('/teacher/reports')} className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-black h-16 px-8 rounded-2xl backdrop-blur-md transition-all text-sm">
              <TrendingUp className="w-5 h-5 mr-3" /> ANALÍTICAS
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Materias Activas', value: stats.subjects, icon: <BookUser />, color: 'text-blue-600', bg: 'bg-blue-100/50' },
          { label: 'Total Estudiantes', value: stats.students, icon: <Users />, color: 'text-emerald-600', bg: 'bg-emerald-100/50' },
          { label: 'Tareas Publicadas', value: stats.assignments, icon: <FileText />, color: 'text-indigo-600', bg: 'bg-indigo-100/50' },
          { label: 'Por Calificar', value: stats.pending, icon: <AlertCircle />, color: 'text-rose-600', bg: 'bg-rose-100/50' },
        ].map((s, idx) => (
          <Card key={idx} className="border-none shadow-xl glass rounded-[2.5rem] group hover:scale-105 transition-all">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={`p-5 rounded-2xl ${s.bg} ${s.color} shadow-inner group-hover:rotate-12 transition-transform`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
                <h4 className="text-4xl font-black tracking-tighter leading-none">{s.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Command Center */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
               <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
               Centro de Operaciones
             </h2>
             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-4 py-1.5 rounded-full">Gestión 2026-A</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {menuItems.map((menu, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={menu.to}>
                  <Card className="group relative overflow-hidden h-36 border-none shadow-xl glass rounded-[2.5rem] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${menu.color} opacity-5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700`}></div>
                    <CardContent className="p-8 flex items-center gap-6 h-full relative z-10">
                      <div className={`p-4 rounded-[1.5rem] ${menu.color} text-white shadow-xl shadow-indigo-200 dark:shadow-none group-hover:scale-110 transition-transform`}>
                        {menu.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-xl tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors uppercase">{menu.title}</h3>
                        <p className="text-xs font-medium text-muted-foreground">{menu.desc}</p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-2 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-10">
          {/* Recent Activity Intelligence */}
          <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-black tracking-tighter flex items-center gap-2 uppercase">
                  <Bell className="w-5 h-5 text-amber-500" /> Inteligencia
                </CardTitle>
                <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full uppercase shadow-lg shadow-amber-200 dark:shadow-none animate-pulse">3 NUEVOS</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[
                  { user: 'Juan Pérez', action: 'subió una tarea', time: 'hace 5 min', type: 'task', color: 'bg-blue-500' },
                  { user: 'María López', action: 'comentó en el foro', time: 'hace 12 min', type: 'forum', color: 'bg-pink-500' },
                  { user: 'SGA Core', action: 'Nuevo examen programado', time: 'hace 1 hora', type: 'system', color: 'bg-slate-500' },
                ].map((act, idx) => (
                  <div key={idx} className="p-6 hover:bg-muted/30 transition-all flex items-start gap-4 cursor-pointer group">
                    <div className={`w-12 h-12 rounded-2xl ${act.color} text-white flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-110 transition-transform`}>
                      {act.user[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight group-hover:text-indigo-600 transition-colors">
                        {act.user} <span className="text-muted-foreground font-medium">{act.action}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-2 font-black uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {act.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full text-[10px] font-black tracking-widest text-indigo-600 py-6 h-auto rounded-none hover:bg-indigo-600/5 uppercase">
                Ver Historial Completo
              </Button>
            </CardContent>
          </Card>

          {/* Teacher Inspiration Card */}
          <Card className="bg-slate-900 text-white border-none shadow-2xl rounded-[3rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <CardContent className="p-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                   <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                </div>
                <h3 className="font-black text-xl tracking-tighter">Inspiración Diaria</h3>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed italic">
                "La educación no es llenar un cubo, sino encender un fuego."
              </p>
              <div className="pt-4 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">— William Butler Yeats</span>
                <Button className="h-10 w-10 p-0 bg-white/10 hover:bg-white/20 rounded-xl"><ArrowRight className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dynamic Management Panels (Tutoring and Behavior) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
        {/* Tutoring Requests Panel */}
        <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
            <CardTitle className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Solicitudes de Tutorías
            </CardTitle>
            <CardDescription className="font-medium">Gestión de soporte académico personalizado</CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex-1 max-h-[400px] overflow-y-auto custom-scrollbar">
            {tutorings.length === 0 ? (
              <p className="text-sm text-muted-foreground font-medium text-center py-12">No tienes solicitudes de tutorías asignadas.</p>
            ) : (
              <div className="space-y-4">
                {tutorings.map(t => (
                  <div key={t.id} className="p-5 bg-muted/30 rounded-2xl border border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight">{t.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">Estudiante: <span className="font-bold text-foreground">{t.student_name}</span></p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 flex gap-2">
                        <span>📅 {t.date}</span>
                        <span>⏰ {t.time}</span>
                        <span>{t.type === 'Virtual' ? '💻 Virtual' : '🏫 Presencial'}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {t.status === 'Pendiente' ? (
                        <>
                          <Button 
                            onClick={() => handleUpdateTutoring(t.id, 'Aprobado')} 
                            className="bg-indigo-600 text-white h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                          >
                            Aprobar
                          </Button>
                          <Button 
                            onClick={() => handleUpdateTutoring(t.id, 'Rechazado')} 
                            variant="outline" 
                            className="border-border hover:bg-rose-50 hover:text-rose-600 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest"
                          >
                            Rechazar
                          </Button>
                        </>
                      ) : (
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                          t.status === 'Aprobado' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-slate-500/15 text-slate-600'
                        }`}>
                          {t.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Behavioral & Academic Observations Logger */}
        <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
            <CardTitle className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
              <BookUser className="w-5 h-5 text-indigo-600" /> Registro de Observaciones de Alumnos
            </CardTitle>
            <CardDescription className="font-medium">Ingresar anotaciones y reporte de conducta</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {obsMessage && (
              <div className="p-4 mb-4 bg-indigo-500/15 border border-indigo-500/25 rounded-2xl text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {obsMessage}
              </div>
            )}
            <form onSubmit={handleSubmittingObservation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estudiante</label>
                <select 
                  value={selectedStudent} 
                  onChange={e => setSelectedStudent(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-muted border-none text-xs font-bold focus:ring-2 ring-indigo-500 outline-none"
                  required
                >
                  <option value="">-- Selecciona un Alumno --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tipo de Anotación</label>
                <select 
                  value={obsType} 
                  onChange={e => setObsType(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-muted border-none text-xs font-bold focus:ring-2 ring-indigo-500 outline-none"
                  required
                >
                  <option value="Académica">Académica (Logros o dificultades)</option>
                  <option value="Conductual">Conductual (Comportamiento o disciplina)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detalles de la Observación</label>
                <textarea 
                  placeholder="Detalla la observación o conducta del estudiante..." 
                  value={obsDetails}
                  onChange={e => setObsDetails(e.target.value)}
                  className="w-full min-h-[100px] p-4 rounded-xl bg-muted border-none text-xs font-bold focus:ring-2 ring-indigo-500 outline-none resize-none"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={registeringObs}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
              >
                {registeringObs ? 'Guardando...' : 'Guardar Observación en Hoja de Vida'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const Loader2 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
