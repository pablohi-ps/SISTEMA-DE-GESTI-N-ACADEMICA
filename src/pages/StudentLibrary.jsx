import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Library, Search, Filter, Download, FileText, 
  Video, Globe, Folder, Star, Info, Home, ExternalLink, Sparkles
} from 'lucide-react';

const CATEGORIES = ['Todos', 'Libros', 'Guías PDF', 'Grabaciones', 'Software'];

export default function StudentLibrary() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('Todos');
  const [search, setSearch] = useState('');
  const [resources, setResources] = useState([]);
  const [_loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/student/library', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setResources(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResources();
  }, []);

  const handleDownload = async (id) => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch(`/api/student/library/download/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setResources(prev => prev.map(r => r.id === id ? { ...r, downloads: r.downloads + 1 } : r));
        alert('Material listo para su descarga académica.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReserve = async (id) => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/student/library/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resource_id: id })
      });
      if (res.ok) {
        alert('Reserva registrada en el sistema. Puedes pasar por ella a la biblioteca física.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = resources.filter(r => 
    (activeCat === 'Todos' || r.category === activeCat) &&
    (r.title.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden font-sans">
      
      {/* Cinematic Navbar */}
      <nav className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none rotate-3">
            <Library className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none uppercase">Biblioteca Digital</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Acervo Académico NovaEdu • v2026</p>
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

      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Cinematic Header Search Section */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col items-center text-center space-y-8">
           <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/80"></div>
           
           <div className="relative z-10 space-y-4">
              <span className="text-[10px] font-black px-4 py-1.5 bg-blue-600 rounded-full uppercase tracking-widest border border-white/10">Centro de Recursos Globales</span>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none uppercase max-w-3xl">Conocimiento Ilimitado <br/> en la Palma de tu Mano</h2>
           </div>
           
           <div className="relative z-10 w-full max-w-2xl group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <Input 
                placeholder="Busca libros, guías, grabaciones..." 
                className="w-full h-20 pl-16 pr-8 rounded-[2rem] bg-white/10 border-white/10 focus:ring-4 ring-blue-500/20 text-xl font-medium backdrop-blur-xl transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
           
           <div className="relative z-10 flex gap-4 overflow-x-auto no-scrollbar max-w-full pb-2">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCat(cat)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                    activeCat === cat ? 'bg-white text-slate-900 border-white shadow-xl' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                   {cat}
                </button>
              ))}
           </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <AnimatePresence mode="popLayout">
              {filtered.map((res, idx) => (
                <motion.div 
                  key={res.id} 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                >
                   <Card className="border-none shadow-2xl glass rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500 h-full flex flex-col">
                      <CardHeader className="p-8 pb-4 relative">
                         <div className="flex justify-between items-start mb-4">
                            <div className={`p-4 bg-muted rounded-2xl ${res.color} group-hover:bg-blue-600 group-hover:text-white transition-all duration-500`}>
                               {res.type === 'PDF' && <FileText className="w-6 h-6" />}
                               {res.type === 'VIDEO' && <Video className="w-6 h-6" />}
                               {res.type === 'BOOK' && <Folder className="w-6 h-6" />}
                               {res.type === 'EXE' && <Globe className="w-6 h-6" />}
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">{res.date}</span>
                         </div>
                         <CardTitle className="text-xl font-black tracking-tight leading-tight uppercase group-hover:text-blue-600 transition-colors">{res.title}</CardTitle>
                         <CardDescription className="font-bold flex items-center gap-2 mt-2">
                            <Sparkles className="w-3.5 h-3.5 text-blue-500" /> {res.subject}
                         </CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 pt-4 flex-1 flex flex-col justify-between">
                         <div className="space-y-4">
                            <div className="flex items-center gap-4 py-3 border-y border-border/50">
                               <div className="flex-1 space-y-1">
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Peso</p>
                                  <p className="text-xs font-bold">{res.size}</p>
                               </div>
                               <div className="flex-1 space-y-1 text-right">
                                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Descargas</p>
                                  <p className="text-xs font-bold">{res.downloads}</p>
                               </div>
                            </div>
                         </div>
                          <div className="flex gap-3 pt-6">
                             <Button onClick={() => handleDownload(res.id)} className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                                <Download className="w-4 h-4 mr-2" /> DESCARGAR
                             </Button>
                             <Button onClick={() => handleReserve(res.id)} variant="outline" className="w-14 h-14 rounded-xl border-border hover:bg-muted group" title="Reservar en físico">
                                <Star className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                             </Button>
                          </div>
                      </CardContent>
                   </Card>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>

        {/* Floating AI Recommendation Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           <div className="relative z-10 space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-black tracking-tighter uppercase flex items-center justify-center md:justify-start gap-2">
                 <Sparkles className="w-6 h-6 animate-pulse" /> Recomendado para ti
              </h3>
              <p className="text-sm font-medium opacity-80">Basado en tus cursos de Ingeniería de Software II y IA Generativa.</p>
           </div>
           <Button className="relative z-10 bg-white text-blue-600 hover:bg-blue-50 h-14 px-10 rounded-2xl font-black uppercase tracking-widest shadow-2xl group-hover:scale-105 transition-transform">
              VER CURACIÓN IA <ExternalLink className="w-4 h-4 ml-2" />
           </Button>
        </div>

        {/* Global Disclaimer */}
        <div className="p-8 bg-muted/30 rounded-[2.5rem] border border-border/50 flex items-center gap-4">
           <Info className="w-6 h-6 text-blue-600" />
           <p className="text-xs font-medium text-muted-foreground italic">
              El material descargado es para fines estrictamente académicos. El uso indebido o redistribución no autorizada está sujeto a las políticas de propiedad intelectual de NovaEdu.
           </p>
        </div>
      </div>
    </div>
  );
}
