import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ArrowLeft, FileSignature, Star, CheckCircle, 
  ShieldCheck, MessageSquare, BookOpen, User, Sparkles, Home, Info
} from 'lucide-react';

export default function TeacherEvaluation() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState({ domain: 0, pedagogy: 0, punctuality: 0 });
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const res = await fetch('/api/student/subjects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setSubjects(data);
          if (data.length > 0) {
            setSelectedSubjectId(data[0].id.toString());
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentSubject = subjects.find(s => s.id.toString() === selectedSubjectId);
    if (!currentSubject) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('novaedu_token');
      const response = await fetch('/api/student/evaluate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_id: currentSubject.teacher_id || 'usr_789',
          subject: currentSubject.name,
          rating: ratings.domain,
          pedagogy: ratings.pedagogy,
          punctuality: ratings.punctuality,
          comments: comments
        })
      });
      if (response.ok) { setSubmitted(true); }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const isFormValid = ratings.domain > 0 && ratings.pedagogy > 0 && ratings.punctuality > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden font-sans">
      
      {/* Cinematic Navbar */}
      <nav className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-600 rounded-2xl shadow-xl shadow-amber-200 dark:shadow-none rotate-3 hover:rotate-0 transition-transform">
            <FileSignature className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none uppercase">Auditoría Docente</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Calidad Académica Certificada</p>
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

      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        
        {/* Cinematic Header Section */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col items-center text-center space-y-6">
           <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/80"></div>
           
           <div className="relative z-10 space-y-4">
              <span className="text-[10px] font-black px-4 py-1.5 bg-amber-600 rounded-full uppercase tracking-widest border border-white/10 shadow-lg shadow-amber-600/20">Protocolo de Evaluación 2026-A</span>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none uppercase max-w-2xl">Tu Opinión Define la Excelencia</h2>
              <p className="text-slate-400 font-medium max-w-xl mx-auto text-lg">Tus comentarios son 100% anónimos. Evalúa de forma objetiva para ayudarnos a mantener el estándar NovaEdu.</p>
           </div>
           
           <div className="relative z-10 flex gap-4 pt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                 <ShieldCheck className="w-4 h-4 text-emerald-400" /> Anonimato Protegido
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                 <Sparkles className="w-4 h-4 text-amber-400" /> Mejora Continua
              </div>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-emerald-500 rounded-[3rem] p-1 shadow-2xl"
            >
              <div className="bg-slate-950 rounded-[2.9rem] p-16 text-center space-y-8">
                 <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 animate-bounce">
                    <CheckCircle className="w-12 h-12 text-slate-950" />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">¡Evaluación Procesada!</h2>
                    <p className="text-slate-400 text-lg font-medium max-w-md mx-auto">Tu feedback ha sido cifrado y enviado al departamento de calidad académica. Gracias por tu honestidad.</p>
                 </div>
                 <Button onClick={() => navigate('/dashboard')} className="h-16 px-12 bg-emerald-500 text-slate-950 hover:bg-emerald-600 font-black rounded-2xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
                    VOLVER AL DASHBOARD
                 </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
                <CardHeader className="p-12 pb-0">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <CardTitle className="text-3xl font-black tracking-tighter uppercase">Formulario de Calidad</CardTitle>
                          <CardDescription className="text-lg font-bold text-primary flex items-center gap-2">
                             <BookOpen className="w-5 h-5" /> Evaluación Docente Multidimensional
                          </CardDescription>
                       </div>
                       <div className="p-4 bg-muted rounded-[2rem] text-muted-foreground"><Info className="w-6 h-6" /></div>
                    </div>
                 </CardHeader>
                 <CardContent className="p-12 space-y-10">
                   <form onSubmit={handleSubmit} className="space-y-12">
                     
                     {/* Select Subject/Teacher */}
                     <div className="space-y-4">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Asignatura y Docente a Evaluar</label>
                        <select 
                          value={selectedSubjectId}
                          onChange={(e) => setSelectedSubjectId(e.target.value)}
                          className="w-full h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-border px-6 text-sm font-bold focus:ring-4 ring-amber-500/10 outline-none transition-all cursor-pointer"
                        >
                          {subjects.map(s => (
                            <option key={s.id} value={s.id} className="text-foreground bg-card">
                              {s.name} - {s.teacher}
                            </option>
                          ))}
                        </select>
                     </div>
                    
                    {/* Categories */}
                    <div className="space-y-10">
                      {[
                        { key: 'domain', label: 'Dominio y Conocimiento del Tema', desc: 'Claridad en la explicación y manejo de conceptos avanzados.' },
                        { key: 'pedagogy', label: 'Metodología y Pedagogía', desc: 'Uso de herramientas, dinamismo y fomento a la participación.' },
                        { key: 'punctuality', label: 'Responsabilidad y Puntualidad', desc: 'Cumplimiento de horarios y entrega de calificaciones.' },
                      ].map((cat, idx) => (
                        <div key={idx} className="space-y-6">
                           <div className="flex justify-between items-end">
                              <div className="space-y-1">
                                 <label className="text-sm font-black text-foreground uppercase tracking-widest">{idx + 1}. {cat.label}</label>
                                 <p className="text-xs text-muted-foreground font-medium">{cat.desc}</p>
                              </div>
                              <span className="text-2xl font-black text-amber-500 tabular-nums">{ratings[cat.key]}/5</span>
                           </div>
                           <div className="flex gap-4">
                             {[1,2,3,4,5].map((star) => (
                               <motion.div 
                                 key={star} 
                                 whileHover={{ scale: 1.2 }}
                                 whileTap={{ scale: 0.9 }}
                                 className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
                                   ratings[cat.key] >= star ? 'bg-amber-500 text-slate-950 shadow-xl shadow-amber-500/20' : 'bg-muted text-muted-foreground'
                                 }`}
                                 onClick={() => handleRatingChange(cat.key, star)}
                               >
                                 <Star className={`w-6 h-6 ${ratings[cat.key] >= star ? 'fill-current' : ''}`} />
                               </motion.div>
                             ))}
                           </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                       <label className="flex items-center gap-2 text-sm font-black text-muted-foreground uppercase tracking-widest">
                          <MessageSquare className="w-4 h-4 text-indigo-500" /> Comentarios Adicionales (Opcional)
                       </label>
                       <textarea 
                         value={comments}
                         onChange={(e) => setComments(e.target.value)}
                         className="w-full min-h-[160px] rounded-[2rem] bg-muted/50 border-none p-6 text-sm font-medium focus:ring-4 ring-amber-500/10 outline-none transition-all" 
                         placeholder="Tus comentarios nos ayudan a mejorar la experiencia académica. Este campo es totalmente confidencial..."
                       ></textarea>
                    </div>

                    <div className="pt-6">
                       <Button 
                         type="submit" 
                         className="w-full h-20 bg-amber-600 hover:bg-amber-700 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-amber-600/20 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale" 
                         disabled={!isFormValid || loading}
                       >
                         {loading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : (
                            <span className="flex items-center justify-center gap-3">
                               ENVIAR AUDITORÍA OFICIAL <Sparkles className="w-6 h-6" />
                            </span>
                         )}
                       </Button>
                       <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-widest mt-6">
                          Al enviar, certificas que tu evaluación es honesta y basada en el desempeño académico.
                       </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const Loader2 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
