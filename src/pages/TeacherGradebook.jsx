import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, BookOpen, CheckCircle, Search, Star, Award, Home } from 'lucide-react';

export default function TeacherGradebook() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(null); // id of student being saved
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const res = await fetch('/api/teacher/students', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setStudents(data);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchStudents();
  }, []);

  const handleSaveGrade = async (userId, grade) => {
    if (!grade) return;
    setSaving(userId);
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/teacher/grades', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          subject: 'Ingeniería de Software II',
          grade: parseFloat(grade),
          credits: 4,
          status: parseFloat(grade) >= 7 ? 'Aprobado' : 'Reprobado'
        })
      });
      if (res.ok) {
        // Just visual confirmation
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(null);
    }
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500">
      <nav className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none">
            <Star className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none">Registro de Notas</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Actas Académicas Oficiales</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2">
            <Home className="w-4 h-4" /> Hub
          </Button>
          <Button variant="outline" onClick={() => navigate('/teacher/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Panel
          </Button>
        </div>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
           <div className="space-y-1">
              <h2 className="text-xl font-black tracking-tighter flex items-center gap-2">
                <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                Ingeniería de Software II
              </h2>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">Periodo de Evaluación 1</p>
           </div>
           <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
              <Input 
                placeholder="Filtrar por nombre..." 
                className="pl-12 h-12 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-border/50 shadow-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <th className="px-10 py-6">Identidad</th>
                    <th className="px-10 py-6 text-center">Calificación Final (0-10)</th>
                    <th className="px-10 py-6 text-right">Acción Certificada</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="3" className="p-20 text-center text-muted-foreground font-black tracking-widest uppercase">Cargando registro de actas...</td></tr>
                  ) : (
                    filtered.map((student, i) => (
                      <motion.tr 
                        key={student.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/30 transition-colors group"
                      >
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               {student.name[0]}
                             </div>
                             <div>
                               <p className="font-bold tracking-tight leading-none group-hover:text-indigo-600 transition-colors">{student.name}</p>
                               <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest">{student.id}</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center justify-center gap-3">
                             <Input 
                                type="number" 
                                min="0" max="10" step="0.1" 
                                className="w-24 h-12 text-center rounded-xl bg-muted/50 border-none font-black text-lg focus:ring-2 ring-indigo-600" 
                                placeholder="0.0"
                                id={`grade-${student.id}`}
                              />
                              <div className="p-2 bg-muted/30 rounded-lg"><Award className="w-4 h-4 text-muted-foreground" /></div>
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <Button 
                            onClick={() => handleSaveGrade(student.id, document.getElementById(`grade-${student.id}`).value)}
                            disabled={saving === student.id}
                            className="rounded-2xl h-12 px-8 bg-indigo-600 text-white font-black shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                          >
                            {saving === student.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-2" /> GUARDAR</>}
                          </Button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

const Loader2 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
