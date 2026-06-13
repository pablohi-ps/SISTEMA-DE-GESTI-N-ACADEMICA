import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, LibraryBig, MessageSquare, ClipboardList, FolderOpen, 
  Send, Plus, Upload, FileText, MoreVertical, ThumbsUp, MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TeacherClassroom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('muro');
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [subject, setSubject] = useState(null);

  const query = new URLSearchParams(location.search);
  const subjectId = query.get('subject_id') || '1';

  const fetchSubject = async () => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch(`/api/teacher/subjects/${subjectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setSubject(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch(`/api/student/classroom/posts/${subjectId}`, {
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSubject();
    fetchPosts();
  }, [subjectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePost = async () => {
    if(!postText.trim()) return;
    setPosting(true);
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/student/classroom/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject_id: parseInt(subjectId, 10),
          content: postText
        })
      });
      if (res.ok) {
        setPostText('');
        await fetchPosts();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500">
      <nav className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none">
            <LibraryBig className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none">Gestión Académica</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">LMS / {subject ? subject.name : "Cargando..."}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate('/teacher/dashboard')} className="rounded-2xl h-12 px-6 font-bold border-border">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Panel
        </Button>
      </nav>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Cinematic Header */}
        <div className="bg-slate-900 rounded-[3rem] h-64 mb-8 relative overflow-hidden shadow-2xl flex items-end p-12 text-white">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
          <div className="relative z-10 w-full flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black px-3 py-1 bg-indigo-600 rounded-full uppercase tracking-widest mb-3 inline-block">{subject ? subject.code : "Ciclo 2026-1"}</span>
              <h2 className="text-5xl font-black tracking-tighter leading-none">{subject ? subject.name : "Cargando Aula..."}</h2>
              <p className="text-slate-400 mt-3 font-bold text-lg">Grupo A | 32 Estudiantes Inscritos</p>
            </div>
            <div className="hidden lg:flex gap-4">
               <div className="text-center">
                 <p className="text-3xl font-black">98%</p>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Asistencia</p>
               </div>
               <div className="w-px h-10 bg-slate-800"></div>
               <div className="text-center">
                 <p className="text-3xl font-black">8.5</p>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Promedio</p>
               </div>
            </div>
          </div>
        </div>

        {/* Premium Tabs */}
        <div className="flex gap-2 p-1.5 bg-muted/50 backdrop-blur-md rounded-[2rem] w-fit mx-auto border border-border/50">
           {[
             { id: 'muro', label: 'MURO DE CLASE', icon: <MessageSquare className="w-4 h-4" /> },
             { id: 'tareas', label: 'TRABAJO EN CLASE', icon: <ClipboardList className="w-4 h-4" /> },
             { id: 'recursos', label: 'RECURSOS', icon: <FolderOpen className="w-4 h-4" /> }
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)} 
               className={`px-8 py-4 rounded-[1.5rem] font-black text-[10px] tracking-widest transition-all flex items-center gap-2 ${
                 activeTab === tab.id ? 'bg-white dark:bg-slate-800 shadow-xl text-indigo-600 scale-105' : 'text-muted-foreground hover:text-foreground'
               }`}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        {/* Tab Content */}
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
                {/* Post Box */}
                <Card className="border-none shadow-2xl glass rounded-[2.5rem] overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                        {user?.name[0]}
                      </div>
                      <div className="flex-1 space-y-4">
                        <textarea 
                          value={postText}
                          onChange={(e) => setPostText(e.target.value)}
                          placeholder="Comparte algo con tu clase..." 
                          className="w-full bg-muted/30 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 ring-indigo-600 outline-none resize-none min-h-[120px] transition-all"
                        ></textarea>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                             <Button variant="ghost" size="icon" className="rounded-xl hover:bg-indigo-50 hover:text-indigo-600"><Upload className="w-5 h-5"/></Button>
                             <Button variant="ghost" size="icon" className="rounded-xl hover:bg-indigo-50 hover:text-indigo-600"><FileText className="w-5 h-5"/></Button>
                          </div>
                          <Button 
                            onClick={handlePost} 
                            disabled={!postText.trim() || posting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-6 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none"
                          >
                            {posting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2"/> PUBLICAR</>}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Feed */}
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center p-20 text-muted-foreground font-black uppercase tracking-widest">Sincronizando muro...</div>
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
                              <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-600 shrink-0">
                                {post.author_name[0]}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h4 className="font-black text-sm tracking-tight">{post.author_name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-500/10 text-indigo-600 rounded-full uppercase tracking-tighter">{post.author_role}</span>
                                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{new Date(post.created_at).toLocaleString()}</span>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-foreground/90 whitespace-pre-line mb-6">{post.content}</p>
                                
                                <div className="flex gap-4 pt-4 border-t border-border/30">
                                   <button className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground hover:text-indigo-600 transition-colors uppercase"><ThumbsUp className="w-3.5 h-3.5" /> Útil</button>
                                   <button className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground hover:text-indigo-600 transition-colors uppercase"><MessageCircle className="w-3.5 h-3.5" /> Comentar</button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tareas' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black tracking-tighter">Actividades de Aprendizaje</h3>
                   <Button className="bg-indigo-600 text-white font-black h-12 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none px-8">
                    <Plus className="w-4 h-4 mr-2" /> CREAR TAREA
                  </Button>
                </div>
                
                <Card className="border-none shadow-xl glass rounded-[2.5rem] overflow-hidden p-4 group cursor-pointer hover:bg-white dark:hover:bg-slate-900 transition-all">
                  <CardContent className="p-4 flex items-center gap-6">
                    <div className="p-5 bg-indigo-100 dark:bg-indigo-900/30 rounded-[1.5rem] text-indigo-600 group-hover:scale-110 transition-transform shadow-inner">
                      <ClipboardList className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-lg tracking-tight leading-none mb-2">Proyecto Final: Arquitectura de Microservicios</h4>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Publicado hace 3 días • 28/32 Entregados</p>
                    </div>
                    <div className="text-right px-6">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Fecha Límite</p>
                      <p className="text-lg font-black text-indigo-600">30 ABR, 23:59</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'recursos' && (
              <div className="space-y-10">
                <Card className="border-2 border-dashed border-border shadow-none bg-muted/10 rounded-[3rem] group hover:border-indigo-500/50 transition-all">
                  <CardContent className="p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter mb-2">Repositorio de Materiales</h3>
                    <p className="text-sm font-medium text-muted-foreground max-w-sm mb-8 leading-relaxed">Publica lecturas, presentaciones y guías de estudio directamente para tus estudiantes.</p>
                    <Button variant="outline" className="h-14 px-10 rounded-2xl font-black border-border hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-xl">
                      <Plus className="w-4 h-4 mr-2" /> SELECCIONAR ARCHIVOS
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   <Card className="border-none shadow-xl glass rounded-[2rem] hover:scale-105 transition-transform cursor-pointer">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-600">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="font-bold text-sm leading-tight">Sílabo_2026.pdf</p>
                           <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">PDF • 1.2 MB</p>
                        </div>
                      </CardContent>
                   </Card>
                </div>
              </div>
            )}
          </motion.div>
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
