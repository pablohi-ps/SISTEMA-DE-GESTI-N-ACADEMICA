import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Building2, Lock, User, AlertCircle, ChevronRight, ShieldCheck, Sparkles, GraduationCap, Shield, BookOpen } from 'lucide-react';

// Particle data generated once at module load (avoids impure calls during render)
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 20 + 10,
  delay: Math.random() * 5,
  xOffset: Math.random() * 20 - 10,
}));

// Floating particles component
function FloatingParticles() {
  const particles = PARTICLES;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.xOffset, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    if (result.success) {
      // FIX: The role in DB is 'teacher' not 'profesor'
      if (result.role === 'admin') navigate('/admin');
      else if (result.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/dashboard');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const setQuickCredentials = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  const stagger = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  return (
    <div className="min-h-screen flex bg-[#020617] overflow-hidden selection:bg-primary/30">
      {/* Animated Background Layers */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-30%] left-[-20%] w-[70%] h-[70%] bg-primary/15 rounded-full blur-[200px] animate-pulse"></div>
        <div className="absolute bottom-[-30%] right-[-20%] w-[70%] h-[70%] bg-indigo-600/15 rounded-full blur-[200px] animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-violet-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '6s' }}></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        <FloatingParticles />
      </div>

      {/* Left side - Cinematic Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="hidden lg:flex lg:w-[58%] relative flex-col justify-center p-20 z-10"
      >
        <div className="space-y-8 max-w-2xl">
          <motion.div custom={0} initial="hidden" animate="visible" variants={stagger} className="flex items-center gap-5 mb-14">
            <div className="relative">
              <div className="p-5 bg-gradient-to-br from-primary to-violet-600 rounded-[2rem] shadow-2xl shadow-primary/40 rotate-12 hover:rotate-0 transition-transform duration-500">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#020617] animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-5xl font-black tracking-tighter text-white">NOVAEDU <span className="text-gradient">ERP</span></h2>
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mt-1">Institutional Intelligence Platform</p>
            </div>
          </motion.div>
          
          <motion.h1 custom={1} initial="hidden" animate="visible" variants={stagger} className="text-7xl font-black text-white tracking-tighter leading-[0.9]">
            La Próxima <br/> <span className="text-gradient">Generación</span> <br/>Académica
          </motion.h1>

          <motion.p custom={2} initial="hidden" animate="visible" variants={stagger} className="text-xl text-slate-400 font-medium leading-relaxed max-w-lg">
            Un ecosistema inteligente diseñado para centralizar, automatizar y potenciar cada detalle de tu institución educativa.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="visible" variants={stagger} className="flex gap-10 pt-10">
            <div className="space-y-1 group cursor-default">
              <p className="text-4xl font-black text-white group-hover:text-primary transition-colors">+50k</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Usuarios Activos</p>
            </div>
            <div className="w-px h-14 bg-gradient-to-b from-transparent via-slate-700 to-transparent"></div>
            <div className="space-y-1 group cursor-default">
              <p className="text-4xl font-black text-white group-hover:text-emerald-400 transition-colors">99.9%</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Uptime SLA</p>
            </div>
            <div className="w-px h-14 bg-gradient-to-b from-transparent via-slate-700 to-transparent"></div>
            <div className="space-y-1 group cursor-default">
              <p className="text-4xl font-black text-white group-hover:text-amber-400 transition-colors">AES-256</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Encriptación</p>
            </div>
          </motion.div>

          <motion.div custom={4} initial="hidden" animate="visible" variants={stagger} className="pt-6">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="flex -space-x-2">
                {['bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-pink-500'].map((bg, i) => (
                  <div key={i} className={`w-8 h-8 ${bg} rounded-full border-2 border-[#020617] flex items-center justify-center text-white text-[10px] font-bold`}>
                    {['A', 'M', 'R', 'S'][i]}
                  </div>
                ))}
              </div>
              <p className="text-xs font-medium text-slate-500">+200 instituciones confían en nosotros</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Premium Login Form */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full lg:w-[42%] flex items-center justify-center p-6 z-10"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}>
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-violet-600 rounded-3xl mx-auto flex items-center justify-center mb-5 shadow-2xl shadow-primary/30">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl font-black text-white tracking-tighter">NOVAEDU</h2>
            <p className="text-[10px] text-primary font-black tracking-[0.3em] uppercase mt-1">Enterprise ERP</p>
          </div>

          <Card className="glass border-white/10 shadow-2xl rounded-[3rem] overflow-hidden p-2 relative">
            {/* Decorative glow at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
            
            <CardHeader className="space-y-3 pb-8 pt-10 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-3xl font-black tracking-tighter text-foreground">Acceso Seguro</CardTitle>
                <CardDescription className="text-muted-foreground font-medium mt-2">
                  Gestiona tu mundo académico con un solo clic.
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                    <Input 
                      id="login-username"
                      type="text" 
                      placeholder="Usuario Institucional" 
                      className="pl-12 py-7 rounded-2xl bg-muted/30 border-border/50 focus:ring-primary focus:border-primary h-14 transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                    <Input 
                      id="login-password"
                      type="password" 
                      placeholder="Contraseña" 
                      className="pl-12 py-7 rounded-2xl bg-muted/30 border-border/50 focus:ring-primary focus:border-primary h-14 transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                {/* Quick Access Demo - Now fills BOTH username AND password */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-primary/5 via-violet-500/5 to-primary/5 p-5 rounded-2xl border border-primary/10 space-y-3"
                >
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.15em] text-center flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3" /> Acceso Rápido Demo <Sparkles className="w-3 h-3" />
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      type="button" 
                      onClick={() => setQuickCredentials('admin', 'admin')}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all duration-300 group"
                    >
                      <Shield className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black">Admin</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setQuickCredentials('estudiante', 'estudiante')}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all duration-300 group"
                    >
                      <GraduationCap className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black">Estudiante</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setQuickCredentials('profesor', 'profesor')}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all duration-300 group"
                    >
                      <BookOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black">Profesor</span>
                    </button>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, height: 0 }} 
                      animate={{ opacity: 1, y: 0, height: 'auto' }} 
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-400 text-xs font-bold overflow-hidden"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  id="login-submit"
                  type="submit" 
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary to-violet-600 text-white hover:from-primary/90 hover:to-violet-600/90 font-black text-lg shadow-2xl shadow-primary/25 group transition-all duration-300 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                      VERIFICANDO...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      INGRESAR AL PORTAL <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pb-10">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Conexión Encriptada AES-256</span>
              </div>
              <div className="text-[10px] text-muted-foreground/50 font-medium">
                {currentTime.toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — {currentTime.toLocaleTimeString('es-EC')}
              </div>
            </CardFooter>
          </Card>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-center text-[10px] text-slate-600 font-medium">
            © 2026 NovaEdu Systems — Todos los derechos reservados
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
