import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, Plus, ChevronRight, User, Send, 
  ArrowLeft, ArrowRight, X, MessageCircle, 
  Users, TrendingUp, Search, MoreVertical, Globe
} from 'lucide-react';

export default function TeacherForums() {
  const navigate = useNavigate();
  const [forums, setForums] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeForum, setActiveForum] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [threads, setThreads] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newForum, setNewForum] = useState({ subject_id: '', title: '', description: '' });
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const [resFor, resSub] = await Promise.all([
        fetch('/api/teacher/forums', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/teacher/subjects', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setForums(await resFor.json());
      setSubjects(await resSub.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);

  const fetchThreads = async (forumId) => {
    const token = localStorage.getItem('novaedu_token');
    const res = await fetch(`/api/teacher/forums/${forumId}/threads`, { headers: { 'Authorization': `Bearer ${token}` } });
    setThreads(await res.json());
  };

  const fetchPosts = async (threadId) => {
    const token = localStorage.getItem('novaedu_token');
    const res = await fetch(`/api/teacher/threads/${threadId}/posts`, { headers: { 'Authorization': `Bearer ${token}` } });
    setPosts(await res.json());
  };

  const handleCreateForum = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('novaedu_token');
    const res = await fetch('/api/teacher/forums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newForum)
    });
    if (res.ok) { setIsModalOpen(false); setNewForum({ subject_id: '', title: '', description: '' }); fetchData(); }
  };

  const handleCreateThread = async () => {
    if (!newThreadTitle) return;
    const token = localStorage.getItem('novaedu_token');
    const res = await fetch(`/api/teacher/forums/${activeForum.id}/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ title: newThreadTitle })
    });
    if (res.ok) { setNewThreadTitle(''); fetchThreads(activeForum.id); }
  };

  const handleCreatePost = async () => {
    if (!newPostContent) return;
    const token = localStorage.getItem('novaedu_token');
    const res = await fetch(`/api/teacher/threads/${activeThread.id}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ content: newPostContent })
    });
    if (res.ok) { setNewPostContent(''); fetchPosts(activeThread.id); }
  };

  if (activeThread) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden">
        <nav className="flex justify-between items-center mb-10">
          <Button variant="ghost" onClick={() => setActiveThread(null)} className="rounded-2xl h-12 px-6 font-bold border-border">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Foro
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-4 py-1.5 rounded-full">Hilo de Discusión</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto space-y-8">
           <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase">{activeThread.title}</h2>
              <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                 <Users className="w-4 h-4 text-primary" /> {posts.length} Respuestas • Activo ahora
              </div>
           </div>

           <div className="space-y-6">
             <AnimatePresence mode="popLayout">
               {posts.map((p, idx) => (
                 <motion.div 
                   key={p.id} 
                   initial={{ opacity: 0, y: 20 }} 
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.05 }}
                 >
                   <Card className="border-none shadow-xl glass rounded-[2.5rem] overflow-hidden">
                     <CardContent className="p-8">
                       <div className="flex gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-primary shrink-0">
                           {p.author_name[0]}
                         </div>
                         <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                               <div>
                                  <h4 className="font-black text-sm tracking-tight">{p.author_name}</h4>
                                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{new Date(p.created_at).toLocaleString()}</p>
                               </div>
                               <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-4 h-4" /></Button>
                            </div>
                            <p className="text-sm font-medium leading-relaxed text-foreground/90 whitespace-pre-line">{p.content}</p>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>

           <div className="pt-10 sticky bottom-10">
              <Card className="border-none shadow-2xl glass rounded-[2.5rem] p-4 border-t border-border/50">
                 <div className="flex gap-3">
                    <Input 
                      placeholder="Escribe tu respuesta técnica o académica..." 
                      className="h-14 rounded-2xl bg-white/50 border-none px-6 font-medium"
                      value={newPostContent} 
                      onChange={e => setNewPostContent(e.target.value)} 
                    />
                    <Button onClick={handleCreatePost} className="h-14 w-14 p-0 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95">
                       <Send className="w-5 h-5" />
                    </Button>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    );
  }

  if (activeForum) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden">
        <nav className="flex justify-between items-center mb-10">
          <Button variant="ghost" onClick={() => setActiveForum(null)} className="rounded-2xl h-12 px-6 font-bold border-border">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a Foros
          </Button>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-4 py-1.5 rounded-full">Moderación de Comunidad</span>
        </nav>

        <div className="max-w-5xl mx-auto space-y-10">
           <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tighter uppercase">{activeForum.title}</h2>
              <p className="text-muted-foreground text-lg font-medium max-w-2xl">{activeForum.description}</p>
           </div>

           <Card className="border-none shadow-xl glass rounded-[2.5rem] p-6 border-2 border-dashed border-border/50 hover:border-primary/50 transition-all group">
              <div className="flex gap-4">
                 <Input 
                   placeholder="Propón un nuevo tema de discusión técnica..." 
                   className="h-14 rounded-2xl bg-white/50 border-none px-6 font-medium"
                   value={newThreadTitle} 
                   onChange={e => setNewThreadTitle(e.target.value)} 
                 />
                 <Button onClick={handleCreateThread} className="h-14 px-8 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" /> NUEVO TEMA
                 </Button>
              </div>
           </Card>

           <div className="grid gap-4">
             <AnimatePresence mode="popLayout">
               {threads.map((t, idx) => (
                 <motion.div 
                   key={t.id} 
                   initial={{ opacity: 0, x: -20 }} 
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   onClick={() => { setActiveThread(t); fetchPosts(t.id); }}
                   className="cursor-pointer group"
                 >
                   <Card className="border-none shadow-lg glass rounded-[2.5rem] hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:translate-x-2 transition-all duration-300">
                      <CardContent className="p-8 flex justify-between items-center">
                         <div className="flex items-center gap-6">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                               <MessageCircle className="w-7 h-7" />
                            </div>
                            <div>
                               <h3 className="font-black text-xl tracking-tight leading-none group-hover:text-primary transition-colors uppercase">{t.title}</h3>
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Iniciado por: {t.creator_name} • Activo</p>
                            </div>
                         </div>
                         <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                      </CardContent>
                   </Card>
                 </motion.div>
               ))}
             </AnimatePresence>
             {threads.length === 0 && (
                <div className="text-center py-20 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50">
                   <MessageSquare className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                   <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No hay temas de discusión activos</p>
                </div>
             )}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden">
      <nav className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-600 rounded-2xl shadow-xl shadow-pink-200 dark:shadow-none">
            <MessageSquare className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none">Foros de Discusión</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Comunidad Académica NovaEdu</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate('/teacher/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border hover:bg-muted transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Panel
        </Button>
      </nav>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Cinematic Header Section */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent"></div>
          
          <div className="relative z-10 text-center lg:text-left space-y-4">
             <span className="text-[10px] font-black px-4 py-1.5 bg-pink-600 rounded-full uppercase tracking-widest">Entorno Social de Aprendizaje</span>
             <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">Colaboración & Debate</h2>
             <p className="text-slate-400 font-medium max-w-xl text-lg">Modera espacios de discusión técnica, resuelve dudas grupales y fomenta el pensamiento crítico en tus asignaturas.</p>
          </div>
          
          <div className="relative z-10">
             <Button onClick={() => setIsModalOpen(true)} className="h-20 px-10 bg-pink-600 hover:bg-pink-700 text-white font-black text-lg rounded-[2rem] shadow-2xl shadow-pink-200 dark:shadow-none group transition-all active:scale-95">
                <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform" /> CREAR FORO
             </Button>
          </div>
        </div>

        {/* Forums Grid */}
        <div className="space-y-6">
           <div className="flex items-center justify-between ml-2">
              <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                <div className="w-2 h-8 bg-pink-600 rounded-full"></div>
                Comunidades Activas
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-4 py-1.5 rounded-full">
                <TrendingUp className="w-3 h-3 text-pink-600" /> {forums.length} Espacios
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {loading ? (
               [1, 2, 3].map(i => <div key={i} className="h-64 rounded-[3rem] bg-muted animate-pulse"></div>)
             ) : (
               <AnimatePresence mode="popLayout">
                 {forums.map((f, idx) => (
                   <motion.div 
                     key={f.id} 
                     initial={{ opacity: 0, scale: 0.9 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     transition={{ delay: idx * 0.1 }}
                     onClick={() => { setActiveForum(f); fetchThreads(f.id); }}
                     className="group cursor-pointer h-full"
                   >
                     <Card className="h-full relative overflow-hidden border-none shadow-xl glass rounded-[3rem] hover:bg-white dark:hover:bg-slate-900 hover:shadow-pink-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col">
                       <MessageSquare className="absolute -bottom-10 -right-10 w-48 h-48 text-pink-600 opacity-[0.03] group-hover:opacity-[0.08] group-hover:rotate-12 transition-all duration-700" />
                       
                       <CardContent className="p-8 flex flex-col h-full space-y-6 relative z-10">
                         <div className="flex justify-between items-start">
                           <span className="px-4 py-1.5 bg-pink-600/10 text-pink-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-pink-600/20">
                             {f.subject_name}
                           </span>
                           <div className="p-3 bg-muted rounded-2xl group-hover:bg-pink-600 group-hover:text-white transition-all">
                             <ChevronRight className="w-5 h-5" />
                           </div>
                         </div>
                         
                         <div className="space-y-3 flex-grow">
                           <h3 className="text-2xl font-black text-foreground group-hover:text-pink-600 transition-colors uppercase tracking-tight leading-tight">
                             {f.title}
                           </h3>
                           <p className="text-sm font-medium text-muted-foreground line-clamp-3 leading-relaxed">
                             {f.description}
                           </p>
                         </div>

                         <div className="pt-6 flex items-center justify-between border-t border-border/30">
                            <div className="flex -space-x-3">
                              {[1,2,3,4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-xl border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-[8px] text-muted-foreground">
                                   U{i}
                                </div>
                              ))}
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                               <Globe className="w-3 h-3" /> ONLINE
                            </span>
                         </div>
                       </CardContent>
                     </Card>
                   </motion.div>
                 ))}
               </AnimatePresence>
             )}
           </div>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-card w-full max-w-2xl rounded-[3rem] shadow-2xl border border-border overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="p-10 space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                     <div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase">Crear Espacio de Discusión</h2>
                        <p className="text-muted-foreground font-medium">Inicia un nuevo foro para interactuar con tus estudiantes.</p>
                     </div>
                     <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full h-10 w-10"><X className="w-5 h-5" /></Button>
                  </div>

                  <form onSubmit={handleCreateForum} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Materia Vinculada</label>
                       <select 
                         className="w-full h-14 rounded-2xl bg-muted/50 border-none px-4 text-sm font-bold focus:ring-2 ring-pink-600 outline-none"
                         value={newForum.subject_id}
                         onChange={e => setNewForum({...newForum, subject_id: e.target.value})}
                         required
                       >
                         <option value="">Selecciona materia...</option>
                         {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Nombre del Foro</label>
                       <Input 
                         placeholder="Ej: Dudas sobre Microservicios Avanzados" 
                         className="h-14 rounded-2xl bg-muted/50 border-none px-4 font-bold"
                         value={newForum.title} 
                         onChange={e => setNewForum({...newForum, title: e.target.value})} 
                         required 
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">Descripción y Objetivo</label>
                       <textarea 
                         className="w-full min-h-[120px] rounded-2xl bg-muted/50 border-none p-4 text-sm font-medium focus:ring-2 ring-pink-600 outline-none resize-none"
                         placeholder="De qué trata este foro, reglas de participación..."
                         value={newForum.description}
                         onChange={e => setNewForum({...newForum, description: e.target.value})}
                         required
                       />
                    </div>

                    <div className="flex gap-4 pt-4">
                       <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl font-black border-border">CANCELAR</Button>
                       <Button type="submit" className="flex-1 h-14 rounded-2xl bg-pink-600 text-white font-black shadow-xl shadow-pink-200 dark:shadow-none transition-all active:scale-95">
                          CREAR FORO OFICIAL
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
