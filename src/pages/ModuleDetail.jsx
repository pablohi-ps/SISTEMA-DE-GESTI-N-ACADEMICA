import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ArrowLeft, MessageSquare, ClipboardList, FolderOpen, 
  ThumbsUp, MessageCircle, FileText, Download, Clock, Star,
  LibraryBig
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: _user } = useAuth();
  const [activeTab, setActiveTab] = useState('muro');
  const [posts, setPosts] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  const fetchSubject = async () => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch(`/api/student/subjects/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setSubject(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch(`/api/student/classroom/posts/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch(`/api/student/classroom/assignments/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/student/library', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setResources(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSubject();
    fetchPosts();
    fetchTasks();
    fetchResources();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500">
      <nav className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20">
            <LibraryBig className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none">Aula Virtual</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">EVA / Entorno Virtual de Aprendizaje</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate('/classrooms')} className="rounded-2xl h-12 px-6 font-bold border-border">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a Mis Clases
        </Button>
      </nav>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Course Header */}
        <div className="bg-slate-900 rounded-[3rem] h-56 mb-8 relative overflow-hidden shadow-2xl flex items-end p-10 text-white">
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
          <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <span className="text-[10px] font-black px-3 py-1 bg-primary rounded-full uppercase tracking-widest mb-3 inline-block">Materia Activa</span>
              <h2 className="text-4xl font-black tracking-tighter leading-none">{subject ? subject.name : "Cargando Aula..."}</h2>
              <p className="text-slate-400 mt-2 font-bold text-lg">{subject ? `${subject.teacher} | ${subject.code}` : "..."}</p>
            </div>
            <div className="flex gap-6">
               <div className="text-center">
                 <p className="text-2xl font-black">{subject ? subject.materials : 12}</p>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Recursos</p>
               </div>
               <div className="text-center">
                 <p className="text-2xl font-black">{subject ? subject.recordings : 8}</p>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Grabaciones</p>
               </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1.5 bg-muted/50 backdrop-blur-md rounded-[2rem] w-fit mx-auto border border-border/50">
           {[
             { id: 'muro', label: 'MURO', icon: <MessageSquare className="w-4 h-4" /> },
             { id: 'tareas', label: 'ACTIVIDADES', icon: <ClipboardList className="w-4 h-4" /> },
             { id: 'recursos', label: 'RECURSOS', icon: <FolderOpen className="w-4 h-4" /> }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)} 
               className={`px-8 py-4 rounded-[1.5rem] font-black text-[10px] tracking-widest transition-all flex items-center gap-2 ${
                 activeTab === tab.id ? 'bg-white dark:bg-slate-800 shadow-xl text-primary scale-105' : 'text-muted-foreground hover:text-foreground'
               }`}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="pb-20"
          >
            {activeTab === 'muro' && (
              <div className="max-w-3xl mx-auto space-y-8">
                {loading ? (
                   <div className="text-center p-20 text-muted-foreground font-black uppercase tracking-widest">Sincronizando feed...</div>
                ) : (
                  posts.map((post, idx) => (
                    <motion.div 
                      key={post.id} 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="border-none shadow-xl glass rounded-[2.5rem] overflow-hidden hover:scale-[1.01] transition-transform">
                        <CardContent className="p-8">
                          <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-primary/20">
                              {post.author_name[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-black text-sm tracking-tight">{post.author_name}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                                      post.author_role === 'teacher' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-emerald-500/10 text-emerald-600'
                                    }`}>{post.author_role}</span>
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{new Date(post.created_at).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm font-medium leading-relaxed text-foreground/90 whitespace-pre-line mb-6">{post.content}</p>
                              
                              <div className="flex gap-4 pt-4 border-t border-border/30">
                                 <button className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase"><ThumbsUp className="w-3.5 h-3.5" /> Útil</button>
                                 <button className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase"><MessageCircle className="w-3.5 h-3.5" /> Responder</button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'tareas' && (
              <div className="max-w-4xl mx-auto space-y-6">
                 {loadingTasks ? (
                   <div className="text-center p-20 text-muted-foreground font-black uppercase tracking-widest">Sincronizando tareas...</div>
                 ) : tasks.length === 0 ? (
                   <div className="text-center p-20 text-muted-foreground font-black uppercase tracking-widest bg-muted/10 rounded-[3rem]">No hay actividades registradas</div>
                 ) : (
                   tasks.map(t => (
                     <Card key={t.id} className="border-none shadow-xl glass rounded-[2.5rem] overflow-hidden p-2 group hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer">
                        <CardContent className="p-6 flex items-center gap-6">
                           <div className="p-5 bg-emerald-500/10 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                              <ClipboardList className="w-8 h-8" />
                           </div>
                           <div className="flex-1">
                              <h4 className="font-black text-xl tracking-tight leading-none mb-2">{t.title}</h4>
                              <p className="text-sm text-muted-foreground font-medium mb-2">{t.description}</p>
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fecha Límite: {t.due_date} • Estatus: PENDIENTE</p>
                           </div>
                           <Button className="rounded-2xl h-12 px-8 bg-primary text-white font-black shadow-lg">ENTREGAR</Button>
                        </CardContent>
                     </Card>
                   ))
                 )}
              </div>
            )}

            {activeTab === 'recursos' && (
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                 {loadingResources ? (
                   <div className="text-center p-20 text-muted-foreground font-black uppercase tracking-widest col-span-2">Sincronizando recursos...</div>
                 ) : (
                   resources
                     .filter(r => {
                       if (!subject) return true;
                       const namePart = subject.name.split(' ')[0].toLowerCase();
                       return r.subject.toLowerCase().includes(namePart) || r.title.toLowerCase().includes(namePart);
                     })
                     .map(r => (
                       <Card key={r.id} className="border-none shadow-xl glass rounded-[2.5rem] hover:scale-105 transition-transform cursor-pointer">
                          <CardContent className="p-8 flex items-center gap-6">
                             <div className="p-4 bg-rose-500/10 text-rose-600 rounded-2xl">
                                <FileText className="w-8 h-8" />
                             </div>
                             <div>
                                <p className="font-black text-lg leading-tight mb-1">{r.title}</p>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{r.type} • {r.size} • {r.downloads} Descargas</p>
                             </div>
                          </CardContent>
                       </Card>
                     ))
                 )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
