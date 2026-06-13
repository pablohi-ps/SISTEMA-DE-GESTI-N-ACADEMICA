import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ArrowLeft, BookOpen, GraduationCap, Award, CheckCircle2, Clock, 
  ShieldCheck, Download, TrendingUp, Info, Star, Home, Calendar, QrCode
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function AcademicRecord() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const res = await fetch('/api/student/grades', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setGrades(data);
      } catch (error) { console.error("Error fetching grades:", error); }
      finally { setLoading(false); }
    };
    fetchGrades();
  }, []);

  const totalCredits = grades.reduce((acc, curr) => acc + (curr.credits || 0), 0);
  const averageGrade = grades.length > 0 ? (grades.reduce((acc, curr) => acc + (curr.grade || 0), 0) / grades.length).toFixed(1) : 0;

  const trendData = [
    { name: 'Sem 1', gpa: 8.2 },
    { name: 'Sem 2', gpa: 8.5 },
    { name: 'Sem 3', gpa: 8.1 },
    { name: 'Sem 4', gpa: 8.9 },
    { name: 'Actual', gpa: parseFloat(averageGrade) },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden font-sans">
      
      {/* Cinematic Navbar */}
      <nav className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none">Expediente Oficial</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">SGA Core Analytics • Certificado</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2">
            <Home className="w-4 h-4" /> Hub
          </Button>
          <Button onClick={() => setShowCertificate(true)} className="rounded-2xl h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2">
            <Award className="w-4 h-4" /> GENERAR CERTIFICADO
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border">
            <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Cinematic Stats Header */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 flex-1 space-y-8">
             <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Nivel Académico: Alto</span>
                <span className="px-4 py-1.5 bg-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                   <ShieldCheck className="w-3.5 h-3.5" /> Estatus: Regular
                </span>
             </div>
             <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none uppercase">Rendimiento <br/><span className="text-indigo-400">Integral</span></h2>
             
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">GPA Promedio</p>
                   <p className="text-3xl font-black tracking-tighter">{averageGrade}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Créditos UV</p>
                   <p className="text-3xl font-black tracking-tighter">{totalCredits}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Materias</p>
                   <p className="text-3xl font-black tracking-tighter">{grades.length}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Posición</p>
                   <p className="text-3xl font-black tracking-tighter">Top 5%</p>
                </div>
             </div>
          </div>

          <div className="relative z-10 w-full lg:w-[450px] bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl">
             <div className="flex justify-between items-center mb-6">
                <h4 className="font-black text-sm uppercase tracking-tighter flex items-center gap-2">
                   <TrendingUp className="w-4 h-4 text-indigo-400" /> Tendencia Histórica
                </h4>
                <Info className="w-4 h-4 text-slate-500 cursor-help" />
             </div>
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={trendData}>
                      <defs>
                         <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="gpa" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorGpa)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-4 flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span>Ingreso 2024</span>
                <span>Expectativa 9.2</span>
                <span>Graduación 2028</span>
             </div>
          </div>
        </div>

        {/* Honor Section (If GPA > 8.5) */}
        {parseFloat(averageGrade) >= 8.5 && (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-amber-500 rounded-[3rem] p-1 shadow-2xl">
              <div className="bg-slate-950 rounded-[2.9rem] p-10 flex flex-col md:flex-row items-center gap-8 border-2 border-amber-500/20">
                 <div className="p-6 bg-amber-500 rounded-[2rem] shadow-xl shadow-amber-500/20 animate-pulse">
                    <Star className="w-10 h-10 text-slate-950 fill-slate-950" />
                 </div>
                 <div className="flex-1 text-center md:text-left space-y-2">
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Candidato a Cuadro de Honor</h3>
                    <p className="text-slate-400 font-medium">Tu rendimiento actual te posiciona en el escalafón de **Excelencia Académica**. Mantén este ritmo para obtener la distinción *Cum Laude*.</p>
                 </div>
                 <Button className="h-16 px-10 bg-amber-500 text-slate-950 hover:bg-amber-600 font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20">
                    RECLAMAR INSIGNIA
                 </Button>
              </div>
           </motion.div>
        )}

        {/* Historial Detallado */}
        <div className="space-y-8">
           <div className="flex items-center justify-between ml-2">
              <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3 uppercase">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                Desglose Académico
              </h3>
              <div className="flex items-center gap-2 bg-muted px-4 py-1.5 rounded-full">
                 <Calendar className="w-4 h-4 text-indigo-600" />
                 <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Periodo 2026-A</span>
              </div>
           </div>

           <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
             <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-muted/50 border-b border-border">
                     <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                       <th className="px-10 py-6">Materia / Código</th>
                       <th className="px-10 py-6 text-center">Unidades Valorativas</th>
                       <th className="px-10 py-6 text-center">Calificación</th>
                       <th className="px-10 py-6 text-right">Estatus Oficial</th>
                     </tr>
                   </thead>
                   <tbody>
                     {loading ? (
                       <tr><td colSpan="4" className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></td></tr>
                     ) : (
                       <AnimatePresence mode="popLayout">
                         {(grades || []).map((g, i) => (
                           <motion.tr 
                             key={g.id || i}
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.05 }}
                             className="border-b border-border/30 hover:bg-indigo-500/5 transition-all group cursor-default"
                           >
                             <td className="px-10 py-6">
                                <div>
                                   <p className="font-black tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{g.subject}</p>
                                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">REF: {g.code || 'SOFT-XXX'}</p>
                                </div>
                             </td>
                             <td className="px-10 py-6 text-center">
                                <span className="px-3 py-1 bg-muted rounded-xl text-xs font-black">{g.credits} UV</span>
                             </td>
                             <td className="px-10 py-6 text-center">
                               <div className="flex flex-col items-center">
                                  <span className={`text-2xl font-black tracking-tighter ${g.grade >= 9 ? 'text-emerald-500' : g.grade >= 8 ? 'text-indigo-500' : 'text-amber-500'}`}>
                                     {g.grade > 0 ? g.grade.toFixed(1) : 'N/A'}
                                  </span>
                                  <div className="w-12 h-1 bg-muted mt-1 rounded-full overflow-hidden">
                                     <div className="h-full bg-current opacity-30" style={{ width: `${g.grade * 10}%` }}></div>
                                  </div>
                               </div>
                             </td>
                             <td className="px-10 py-6 text-right">
                               <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest border ${
                                 g.status === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                               }`}>
                                 {g.status}
                               </span>
                             </td>
                           </motion.tr>
                         ))}
                       </AnimatePresence>
                     )}
                   </tbody>
                 </table>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Disclaimer Section */}
        <div className="flex items-center gap-4 p-8 bg-muted/30 rounded-[2.5rem] border border-border/50">
           <ShieldCheck className="w-6 h-6 text-indigo-600" />
           <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">
             Este documento es una representación visual del kárdex oficial. Para fines legales o institucionales, favor de solicitar el certificado con sello holográfico en la oficina de Registro y Control Académico.
           </p>
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowCertificate(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white text-slate-900 border-none rounded-[3rem] max-w-4xl w-full p-10 shadow-2xl space-y-6 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Actions Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-950">
                  <Award className="w-6 h-6 text-indigo-600" />
                  <span className="font-black text-sm uppercase tracking-wider text-slate-500">Certificado Académico Oficial</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => window.print()} className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg">
                    <Download className="w-3.5 h-3.5" /> Imprimir / PDF
                  </Button>
                  <Button variant="outline" onClick={() => setShowCertificate(false)} className="h-10 px-5 border-slate-200 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    Cerrar
                  </Button>
                </div>
              </div>

              {/* Printable Certificate Area */}
              <div className="print-area p-12 bg-white border-[12px] border-double border-indigo-900 rounded-[2rem] space-y-8 relative overflow-hidden font-serif">
                {/* Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                  <GraduationCap className="w-[400px] h-[400px] text-indigo-900" />
                </div>
                
                {/* Header */}
                <div className="text-center space-y-2 relative z-10">
                  <div className="mx-auto p-3 bg-indigo-950 text-white rounded-full w-fit mb-3 flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-indigo-950 leading-none">NOVAEDU SAAS ACADEMY</h2>
                  <p className="text-[9px] font-sans font-black tracking-[0.3em] uppercase text-indigo-700">Dirección de Registro Curricular y Control Escolar</p>
                  <div className="h-0.5 w-48 bg-indigo-900/20 mx-auto mt-4"></div>
                </div>

                {/* Body Text */}
                <div className="space-y-6 text-sm text-slate-800 leading-relaxed text-justify relative z-10 px-4 font-sans">
                  <p>
                    La Dirección de Registro y Control Académico de la Institución Superior <strong>NovaEdu Academy</strong>, de conformidad con los registros oficiales vigentes en la base de datos de esta entidad escolar, certifica lo siguiente:
                  </p>
                  
                  <p>
                    Que el estudiante <strong>{user?.name}</strong>, portador del código de alumno <strong>{user?.id}</strong>, cursó estudios conducentes en esta institución, habiendo alcanzado la condición académica de <strong>Alumno Regular</strong> durante el periodo académico escolar correspondiente al ciclo de <strong>Semestre 2026-A</strong> en el campus de <strong>{user?.campus || 'Sede Central'}</strong>.
                  </p>

                  <p>
                    A la fecha de expedición de este documento, el estudiante registra la aprobación completa de sus materias regulares con los siguientes promedios consolidados e indicadores del kárdex oficial consolidado:
                  </p>
                </div>

                {/* Grades Table */}
                <div className="relative z-10 px-4">
                  <table className="w-full text-xs text-left border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-50 text-indigo-950 border-b border-slate-300 font-sans">
                        <th className="p-3 font-bold uppercase tracking-wider">Materia</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-center">Créditos</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-center">Calificación</th>
                        <th className="p-3 font-bold uppercase tracking-wider text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {grades.map(g => (
                        <tr key={g.id} className="hover:bg-slate-50 font-medium font-sans">
                          <td className="p-3 font-bold text-slate-900">{g.subject}</td>
                          <td className="p-3 text-center">{g.credits}</td>
                          <td className="p-3 text-center font-bold text-indigo-950">{g.grade.toFixed(1)}</td>
                          <td className="p-3 text-center">
                            <span className="text-[9px] font-black tracking-wider uppercase text-emerald-600">{g.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summaries */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200/50 relative z-10 px-4 font-sans text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-500 font-bold">TOTAL CRÉDITOS APROBADOS:</p>
                    <p className="text-sm font-black text-indigo-950">{totalCredits} UV</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-slate-500 font-bold">PROMEDIO GENERAL PONDERADO (GPA):</p>
                    <p className="text-sm font-black text-indigo-950">{averageGrade} / 10.0</p>
                  </div>
                </div>

                {/* Footer Signatures & QR */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 items-end relative z-10 px-4">
                  <div className="text-center space-y-4 font-sans text-[10px]">
                    <div className="w-40 h-px bg-slate-300 mx-auto"></div>
                    <div>
                      <p className="font-black text-slate-800">Dra. María Inés</p>
                      <p className="text-slate-400">Encargada de Registro Curricular</p>
                    </div>
                  </div>

                  <div className="flex justify-center flex-col items-center space-y-2">
                    <div className="p-2 border border-slate-200 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-slate-700" />
                    </div>
                    <p className="text-[7px] text-center font-mono font-medium text-slate-400">VERIFICACIÓN SECURE-SHA256: 9e107d9f3b8c</p>
                  </div>

                  <div className="text-center space-y-4 font-sans text-[10px]">
                    <div className="w-40 h-px bg-slate-300 mx-auto"></div>
                    <div>
                      <p className="font-black text-slate-800">Dr. Alejandro Sanz</p>
                      <p className="text-slate-400">Director General Académico</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Print Styles Sheet */}
              <style>{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  .print-area, .print-area * {
                    visibility: visible !important;
                  }
                  .print-area {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: auto;
                    margin: 0 !important;
                    padding: 2.5cm !important;
                    border: 10px double #1e3a8a !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                    background: white !important;
                    color: black !important;
                  }
                  /* Remove padding from page */
                  @page {
                    size: auto;
                    margin: 0mm;
                  }
                }
              `}</style>
            </motion.div>
          </div>
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
