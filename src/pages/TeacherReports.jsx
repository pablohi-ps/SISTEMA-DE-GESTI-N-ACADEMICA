import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, BookOpen, Star, ArrowLeft, Download, ShieldCheck, Globe, Clock, Filter } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function TeacherReports() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const res = await fetch('/api/teacher/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (res.ok) setData(json);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
       <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
       <p className="text-sm font-black text-muted-foreground uppercase tracking-widest animate-pulse">Generando Reportes de Inteligencia...</p>
    </div>
  );

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden">
      <nav className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none">Analíticas Avanzadas</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Inteligencia Académica NovaEdu</p>
          </div>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-muted transition-all">
             <Download className="w-4 h-4 mr-2" /> EXPORTAR DATOS
           </Button>
           <Button variant="outline" onClick={() => navigate('/teacher/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-muted transition-all">
             <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
           </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Cinematic Header */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1551288049-bbda38a5f97f?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
          
          <div className="relative z-10 text-center lg:text-left space-y-4">
             <span className="text-[10px] font-black px-4 py-1.5 bg-indigo-600 rounded-full uppercase tracking-widest border border-white/10 backdrop-blur-md">Monitoreo de Rendimiento 2026</span>
             <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none uppercase">Reporte de Inteligencia</h2>
             <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed">Visualiza el progreso académico en tiempo real. Identifica tendencias, detecta alumnos en riesgo y optimiza tus métodos de enseñanza.</p>
          </div>
          
          <div className="relative z-10 flex gap-6 text-center">
             <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                <p className="text-5xl font-black tracking-tighter">8.7</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Promedio Gral</p>
             </div>
             <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                <p className="text-5xl font-black tracking-tighter">94%</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Aprobación</p>
             </div>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Estudiantes', value: '42', icon: <Users />, color: 'text-blue-600', bg: 'bg-blue-100/50' },
            { label: 'Entregas Totales', value: '128', icon: <BookOpen />, color: 'text-emerald-600', bg: 'bg-emerald-100/50' },
            { label: 'Promedio Académico', value: '8.7 / 10', icon: <Star />, color: 'text-amber-600', bg: 'bg-amber-100/50' },
          ].map((kpi, idx) => (
            <Card key={idx} className="border-none shadow-2xl glass rounded-[2.5rem] group hover:scale-105 transition-all overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                 <div className={`p-5 rounded-[1.5rem] ${kpi.bg} ${kpi.color} shadow-inner group-hover:rotate-12 transition-transform`}>
                    {kpi.icon}
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
                    <h4 className="text-3xl font-black tracking-tighter leading-none">{kpi.value}</h4>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Performance Trend Chart */}
          <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
              <div>
                 <CardTitle className="text-2xl font-black tracking-tighter uppercase">Tendencia de Rendimiento</CardTitle>
                 <CardDescription className="font-medium">Promedio de notas en las últimas 5 semanas</CardDescription>
              </div>
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-600"><Clock className="w-6 h-6" /></div>
            </CardHeader>
            <CardContent className="p-10 pt-0">
              <div className="h-80 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trend}>
                    <defs>
                      <linearGradient id="colorPromedio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="currentColor" opacity={0.5} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="currentColor" opacity={0.5} domain={[0, 10]} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '1.5rem', border: '1px solid hsl(var(--border))', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                      itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="promedio" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorPromedio)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Subject Comparison */}
          <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
              <div>
                 <CardTitle className="text-2xl font-black tracking-tighter uppercase">Rendimiento por Materia</CardTitle>
                 <CardDescription className="font-medium">Comparativa académica inter-disciplinaria</CardDescription>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600"><Filter className="w-6 h-6" /></div>
            </CardHeader>
            <CardContent className="p-10 pt-0">
              <div className="h-80 w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.subjects}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="currentColor" opacity={0.5} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="currentColor" opacity={0.5} domain={[0, 10]} dx={-10} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '1.5rem', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="avg_grade" radius={[12, 12, 0, 0]} barSize={40}>
                      {data.subjects.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between ml-2">
             <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3 uppercase">
               <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
               Desglose Detallado
             </h3>
             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-4 py-1.5 rounded-full flex items-center gap-2">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Datos Auditados
             </span>
          </div>

          <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <th className="px-10 py-6">Materia / Asignatura</th>
                      <th className="px-10 py-6 text-center">Nota Promedio</th>
                      <th className="px-10 py-6 text-center">Actividades Entregadas</th>
                      <th className="px-10 py-6 text-right">Estatus de Rendimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subjects.map((s, idx) => (
                      <motion.tr 
                        key={idx} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/30 transition-all group"
                      >
                        <td className="px-10 py-6 font-black tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{s.subject}</td>
                        <td className="px-10 py-6 text-center">
                           <span className="text-xl font-black tracking-tighter">{(s.avg_grade || 0).toFixed(2)}</span>
                        </td>
                        <td className="px-10 py-6 text-center font-bold opacity-60">{s.total_submissions} Unidades</td>
                        <td className="px-10 py-6 text-right">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            s.avg_grade > 8 
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }`}>
                            {s.avg_grade > 8 ? 'SOBRESALIENTE' : 'ESTÁNDAR'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
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
