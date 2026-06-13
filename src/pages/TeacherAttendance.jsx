import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, CalendarCheck, Check, X, Clock, Save, 
  Users, Search, Filter, CheckCircle2, 
  AlertCircle, RotateCcw, UserPlus, MoreHorizontal, Download, 
  Calendar as CalendarIcon, ShieldCheck, ArrowRight, Home
} from 'lucide-react';

export default function TeacherAttendance() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const res = await fetch('/api/teacher/students', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStudents(data);
          const initial = {};
          data.forEach(s => initial[s.id] = 'Presente');
          setAttendanceState(initial);
        }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchStudents();
  }, []);

  const markStatus = (id, status) => {
    setAttendanceState(prev => ({ ...prev, [id]: status }));
  };

  const markAll = (status) => {
    const newState = { ...attendanceState };
    students.forEach(s => newState[s.id] = status);
    setAttendanceState(newState);
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('novaedu_token');
      const records = Object.keys(attendanceState).map(key => ({
        user_id: key,
        status: attendanceState[key]
      }));

      const res = await fetch('/api/teacher/attendance', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records, date: today })
      });
      if (res.ok) {
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    const total = Object.values(attendanceState).length || 1;
    const present = Object.values(attendanceState).filter(s => s === 'Presente').length;
    const late = Object.values(attendanceState).filter(s => s === 'Atraso').length;
    const absent = Object.values(attendanceState).filter(s => s === 'Ausente').length;
    return {
      present: ((present / total) * 100).toFixed(0),
      late,
      absent,
      totalCount: total
    };
  }, [attendanceState]);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || attendanceState[s.id] === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <nav className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-600 rounded-[1.5rem] shadow-2xl shadow-emerald-200 dark:shadow-none rotate-3 hover:rotate-0 transition-transform">
            <CalendarCheck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="font-black text-3xl tracking-tighter text-gradient leading-none">Smart Attendance</h1>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1 rounded-full flex items-center gap-1.5">
                <CalendarIcon className="w-3 h-3" /> {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
               </span>
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Sincronizado</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-14 px-6 font-black border-border hover:bg-primary/5 hover:text-primary transition-all">
            <Home className="w-4 h-4 mr-2" /> HUB
          </Button>
          <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-border hover:bg-muted transition-all">
            <Download className="w-4 h-4 mr-2" /> REPORTE
          </Button>
          <Button variant="outline" onClick={() => navigate('/teacher/dashboard')} className="rounded-2xl h-14 px-6 font-black border-border hover:bg-muted transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10 relative z-10">
        
        {/* Sidebar Analytics */}
        <div className="lg:col-span-1 space-y-8">
           <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Presencia Grupal</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                 <div className="relative h-40 w-40 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="80" cy="80" r="70" className="stroke-muted fill-none" strokeWidth="12" />
                       <circle 
                         cx="80" cy="80" r="70" 
                         className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out" 
                         strokeWidth="12" 
                         strokeDasharray={440} 
                         strokeDashoffset={440 - (440 * stats.present) / 100}
                         strokeLinecap="round"
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-4xl font-black tracking-tighter">{stats.present}%</span>
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Asistencia</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-500/5 rounded-[1.5rem] border border-emerald-500/10">
                       <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Presentes</p>
                       <p className="text-2xl font-black">{stats.totalCount - stats.absent - stats.late}</p>
                    </div>
                    <div className="p-4 bg-rose-500/5 rounded-[1.5rem] border border-rose-500/10">
                       <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Ausentes</p>
                       <p className="text-2xl font-black">{stats.absent}</p>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-border/50">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Acciones Masivas</p>
                    <div className="space-y-2">
                       <Button onClick={() => markAll('Presente')} variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-600 font-bold transition-all"><CheckCircle2 className="w-4 h-4" /> Marcar todos presentes</Button>
                       <Button onClick={() => markAll('Ausente')} variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl hover:bg-rose-500/10 hover:text-rose-600 font-bold transition-all"><AlertCircle className="w-4 h-4" /> Marcar todos ausentes</Button>
                       <Button onClick={() => setAttendanceState(Object.fromEntries(students.map(s => [s.id, 'Presente'])))} variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl hover:bg-muted text-muted-foreground font-bold transition-all"><RotateCcw className="w-4 h-4" /> Resetear listado</Button>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[3rem] overflow-hidden group">
              <CardContent className="p-8 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-2xl"><Users className="w-6 h-6 text-emerald-400" /></div>
                    <h3 className="font-black text-xl tracking-tighter">Resumen de Clase</h3>
                 </div>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Ingeniería de Software II<br/>Sección A • Aula 402<br/>Inscritos: {students.length}
                 </p>
                 <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 h-12 rounded-2xl font-black text-xs uppercase tracking-widest">VER HISTÓRICO</Button>
              </CardContent>
           </Card>
        </div>

        {/* Main List Management */}
        <div className="lg:col-span-3 space-y-8">
           {/* Filters & Search */}
           <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                 <Input 
                   placeholder="Buscar estudiante por nombre o ID..." 
                   className="pl-12 h-14 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-border/50 shadow-xl focus:ring-emerald-500 font-medium"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="flex gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border/50">
                 {['all', 'Presente', 'Atraso', 'Ausente'].map(status => (
                   <button 
                     key={status}
                     onClick={() => setFilterStatus(status)}
                     className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       filterStatus === status ? 'bg-white dark:bg-slate-800 shadow-xl text-emerald-600' : 'text-muted-foreground hover:text-foreground'
                     }`}
                   >
                     {status === 'all' ? 'TODOS' : status}
                   </button>
                 ))}
              </div>
           </div>

           {/* Student Grid */}
           <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
              <CardContent className="p-8">
                {loading ? (
                   <div className="text-center py-24">
                     <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
                     <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Sincronizando base de datos...</p>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                      {filteredStudents.length > 0 ? filteredStudents.map((student, i) => (
                        <motion.div 
                          key={student.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2, delay: i * 0.02 }}
                          className="flex flex-col sm:flex-row justify-between items-center p-6 bg-muted/20 border border-border/30 rounded-[2.5rem] hover:bg-white dark:hover:bg-slate-900 transition-all group relative overflow-hidden"
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                            attendanceState[student.id] === 'Presente' ? 'bg-emerald-500' :
                            attendanceState[student.id] === 'Atraso' ? 'bg-amber-500' : 'bg-rose-500'
                          } opacity-50`}></div>
                          
                          <div className="mb-4 sm:mb-0 flex items-center gap-6">
                            <div className="relative">
                               <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-black text-lg text-slate-500 group-hover:scale-110 transition-transform">
                                 {student.name[0]}
                               </div>
                               <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${
                                 attendanceState[student.id] === 'Presente' ? 'bg-emerald-500' :
                                 attendanceState[student.id] === 'Atraso' ? 'bg-amber-500' : 'bg-rose-500'
                               }`}></div>
                            </div>
                            <div>
                              <p className="font-black text-lg tracking-tight leading-none group-hover:text-emerald-600 transition-colors">{student.name}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{student.id}</span>
                                <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sección A</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 p-1.5 bg-muted/50 rounded-2xl">
                            {[
                              { status: 'Presente', icon: <Check className="w-4 h-4" />, color: 'bg-emerald-600', text: 'text-emerald-600' },
                              { status: 'Atraso', icon: <Clock className="w-4 h-4" />, color: 'bg-amber-500', text: 'text-amber-500' },
                              { status: 'Ausente', icon: <X className="w-4 h-4" />, color: 'bg-rose-600', text: 'text-rose-600' },
                            ].map((btn) => (
                              <button 
                                key={btn.status}
                                onClick={() => markStatus(student.id, btn.status)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                  attendanceState[student.id] === btn.status 
                                  ? `${btn.color} text-white shadow-xl scale-105` 
                                  : `hover:${btn.text} text-muted-foreground`
                                }`}
                              >
                                {btn.icon} <span className="hidden xl:inline">{btn.status}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )) : (
                        <div className="text-center py-20 bg-muted/10 rounded-[3rem] border border-dashed border-border">
                           <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                           <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No se encontraron estudiantes</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="mt-12 flex flex-col md:flex-row gap-4 items-center">
                   <div className="flex-1 flex items-center gap-4 p-6 bg-muted/20 rounded-[2rem] border border-border/30 w-full md:w-auto">
                      <div className="p-3 bg-emerald-500/10 rounded-xl"><ShieldCheck className="w-6 h-6 text-emerald-600" /></div>
                      <p className="text-xs font-bold text-muted-foreground">Al guardar este registro, se notificará automáticamente a los padres de familia sobre las inasistencias y atrasos detectados.</p>
                   </div>
                   <Button 
                    onClick={handleSaveAttendance} 
                    disabled={saving || students.length === 0} 
                    className="w-full md:w-80 h-20 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-emerald-200 dark:shadow-none transition-all active:scale-95 shrink-0"
                  >
                    {saving ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : (
                      <span className="flex items-center gap-3">
                        <Save className="w-6 h-6" /> FINALIZAR <ArrowRight className="w-6 h-6" />
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

const Loader2 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
