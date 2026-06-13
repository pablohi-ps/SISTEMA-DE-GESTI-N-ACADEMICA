import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AdminCompliance from '../components/AdminCompliance';
import { 
  Building2, User, Key, Mail, Power, Moon, Sun, Users, GraduationCap, 
  DollarSign, Activity, Settings, TrendingUp, Download, ShieldCheck,
  Search, Plus, Filter, LayoutDashboard, Database, HardDrive, BarChart3, AlertTriangle, LogOut, Home
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
    return isDark;
  });
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [_auditLogs, setAuditLogs] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [activeView, setActiveView] = useState('summary');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const [resStats, resUsers, resAudit] = await Promise.all([
          fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/audit', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        setStats(await resStats.json());
        setUsers(await resUsers.json());
        setAuditLogs(await resAudit.json());
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    try {
      const token = localStorage.getItem('novaedu_token');
      const username = newUserName.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000);
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ username, password: username, name: newUserName, role: newUserRole, campus: 'Campus Principal' })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewUserName('');
        setNewUserRole('student');
        // Refresh user list
        const resUsers = await fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
        if (resUsers.ok) setUsers(await resUsers.json());
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground flex flex-col font-sans transition-all duration-500">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Top Navbar */}
      <nav className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-border/50 text-foreground flex justify-between items-center px-8 fixed top-0 w-full z-50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter leading-none">NOVAEDU <span className="text-indigo-600">ADMIN</span></h1>
            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Central Command</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-border/50 mr-4">
             <Button variant="ghost" size="sm" className="rounded-full h-8 text-xs font-bold hover:bg-background"><Database className="w-3.5 h-3.5 mr-1.5" /> DB Health: 100%</Button>
             <Button variant="ghost" size="sm" onClick={() => setActiveView('compliance')} className={`rounded-full h-8 text-xs font-bold hover:bg-background ${activeView === 'compliance' ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400' : 'text-emerald-600'}`}><ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> ISO 27001</Button>
          </div>
          
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-2xl hover:bg-muted ml-1 transition-all">
            {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
          </Button>

          <div className="h-8 w-px bg-border mx-2"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold leading-none">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-medium">Root Admin</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-200 cursor-pointer hover:scale-105 transition-transform" onClick={handleLogout}>
              {user?.name?.[0] || 'A'}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 mt-20 relative z-10">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm hidden xl:block p-8 fixed h-[calc(100vh-5rem)]">
          <div className="space-y-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 ml-2">Menú Principal</p>
               <Button variant="ghost" onClick={() => setActiveView('summary')} className={`w-full justify-start gap-3 h-12 rounded-2xl font-bold transition-all ${activeView === 'summary' ? 'bg-indigo-600/5 text-indigo-600 border-r-4 border-indigo-600 shadow-sm' : 'hover:bg-muted text-muted-foreground'}`}><LayoutDashboard className="w-5 h-5" /> Resumen</Button>
               <Button variant="ghost" onClick={() => setActiveView('users')} className={`w-full justify-start gap-3 h-12 rounded-2xl font-bold transition-all ${activeView === 'users' ? 'bg-indigo-600/5 text-indigo-600 border-r-4 border-indigo-600 shadow-sm' : 'hover:bg-muted text-muted-foreground'}`}><Users className="w-5 h-5" /> Usuarios</Button>
               <Button variant="ghost" onClick={() => navigate('/admin/finance')} className="w-full justify-start gap-3 h-12 rounded-2xl hover:bg-muted text-muted-foreground font-bold transition-all"><BarChart3 className="w-5 h-5" /> Finanzas</Button>
               <Button variant="ghost" onClick={() => setActiveView('compliance')} className={`w-full justify-start gap-3 h-12 rounded-2xl font-bold transition-all ${activeView === 'compliance' ? 'bg-indigo-600/5 text-indigo-600 border-r-4 border-indigo-600 shadow-sm' : 'hover:bg-muted text-muted-foreground'}`}><ShieldCheck className="w-5 h-5" /> Cumplimiento ISO</Button>
               <Button variant="ghost" onClick={() => navigate('/messages')} className="w-full justify-start gap-3 h-12 rounded-2xl hover:bg-muted text-muted-foreground font-bold transition-all"><Mail className="w-5 h-5" /> Mensajería</Button>
               <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-2xl hover:bg-muted text-muted-foreground"><Settings className="w-5 h-5" /> Configuración</Button>
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
               <h4 className="font-bold text-sm">Estado de Red</h4>
               <div className="mt-4 flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-xs text-slate-400 font-medium">Servidores Activos</span>
               </div>
               <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 w-[95%]"></div>
               </div>
               <p className="text-[10px] text-slate-500 mt-2">Carga actual: 12%</p>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 xl:ml-72 p-6 lg:p-12 pb-32">
          {activeView === 'compliance' ? (
            <AdminCompliance />
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2">Command <span className="text-indigo-600">Center</span></h1>
                  <p className="text-muted-foreground font-medium text-lg">Visión global y control absoluto de NovaEdu.</p>
                </motion.div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')} 
                    className="rounded-2xl h-12 px-6 border-border font-bold hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" /> Hub Central
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    className="rounded-2xl h-12 px-6 border-border font-bold hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                  </Button>
                  <Button variant="outline" className="rounded-2xl h-12 px-6 border-border font-bold"><Download className="w-4 h-4 mr-2" /> Reporte PDF</Button>
                </div>
              </div>

              {activeView === 'summary' && (
                <>
                  {/* Metrics Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                     {[
                       { label: 'Estudiantes', value: stats?.activeStudents || 0, icon: <Users />, color: 'text-blue-600', bg: 'bg-blue-100/50', trend: '+12%' },
                       { label: 'Docentes', value: stats?.professors || 0, icon: <GraduationCap />, color: 'text-purple-600', bg: 'bg-purple-100/50', trend: 'Estable' },
                       { label: 'Ingresos', value: `$${stats?.monthlyRevenue || 0}`, icon: <DollarSign />, color: 'text-emerald-600', bg: 'bg-emerald-100/50', trend: '+4.2%' },
                       { label: 'Alertas', value: '0', icon: <AlertTriangle />, color: 'text-amber-600', bg: 'bg-amber-100/50', trend: 'Sin riesgo' },
                     ].map((m, idx) => (
                       <Card key={idx} className="border-none shadow-lg glass group hover:scale-105 transition-all">
                         <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                              <div className={`p-3 rounded-2xl ${m.bg} ${m.color}`}>{m.icon}</div>
                              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${m.trend.includes('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>{m.trend}</span>
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{m.label}</p>
                            <h3 className="text-3xl font-black mt-1 tracking-tight">{m.value}</h3>
                         </CardContent>
                       </Card>
                     ))}
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <Card className="lg:col-span-2 border-none shadow-xl glass overflow-hidden">
                       <CardHeader className="pb-0">
                          <CardTitle className="text-lg font-bold">Crecimiento Financiero</CardTitle>
                          <CardDescription>Resumen de ingresos de los últimos 6 meses</CardDescription>
                       </CardHeader>
                       <CardContent className="p-0">
                          <div className="h-80 w-full pt-8">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={stats?.revenue || []}>
                                <defs>
                                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="ingresos" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorIngresos)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                       </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl glass">
                       <CardHeader>
                          <CardTitle className="text-lg font-bold">Matrículas</CardTitle>
                          <CardDescription>Por facultad</CardDescription>
                       </CardHeader>
                       <CardContent>
                          <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={stats?.enrollments || []}>
                                <XAxis dataKey="name" hide />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                <Bar dataKey="matriculados" fill="#4f46e5" radius={[10, 10, 10, 10]} barSize={20} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="space-y-3 mt-4">
                             {stats?.enrollments?.map((e, idx) => (
                               <div key={idx} className="flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground font-medium">{e.name}</span>
                                  <span className="font-bold">{e.matriculados}</span>
                               </div>
                             ))}
                          </div>
                       </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* User Management */}
              {(activeView === 'summary' || activeView === 'users') && (
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                     <h2 className="text-2xl font-black tracking-tighter">Gestión de <span className="text-indigo-600">Usuarios</span></h2>
                     <div className="flex gap-2">
                       <div className="relative group">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                          <Input placeholder="Buscar..." className="pl-10 rounded-2xl h-10 w-64 bg-white/50 dark:bg-slate-900/50" />
                       </div>
                       <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl h-10 bg-indigo-600 text-white font-bold"><Plus className="w-4 h-4 mr-2" /> Añadir</Button>
                     </div>
                   </div>

                   <Card className="border-none shadow-xl glass overflow-hidden rounded-[2.5rem]">
                     <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 border-b border-border">
                              <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <th className="px-8 py-5">Identidad</th>
                                <th className="px-8 py-5">Rol Institucional</th>
                                <th className="px-8 py-5">Estado</th>
                                <th className="px-8 py-5 text-right">Control</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.map((u) => (
                                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                  <td className="px-8 py-4">
                                     <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">{u.name?.[0] || '?'}</div>
                                       <div>
                                         <p className="font-bold leading-none">{u.name}</p>
                                         <p className="text-[10px] text-muted-foreground mt-1">{u.username}</p>
                                       </div>
                                     </div>
                                  </td>
                                  <td className="px-8 py-4 capitalize font-medium text-muted-foreground">{u.role}</td>
                                  <td className="px-8 py-4">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase">Activo</span>
                                  </td>
                                  <td className="px-8 py-4 text-right">
                                     <Button variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-500/10 font-bold">Suspender</Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                     </CardContent>
                   </Card>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* New User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-card w-full max-w-md p-8 rounded-[3rem] shadow-2xl border border-border">
                <h3 className="text-2xl font-black tracking-tighter mb-6">Añadir Nuevo Usuario</h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">Nombre Completo</label>
                     <Input
                       className="rounded-2xl h-12 bg-muted/50 border-none"
                       placeholder="Ej. Roberto Casas"
                       value={newUserName}
                       onChange={(e) => setNewUserName(e.target.value)}
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">Rol Asignado</label>
                     <select
                       className="w-full h-12 rounded-2xl bg-muted/50 border-none px-4 text-sm font-medium focus:ring-2 ring-indigo-600 outline-none"
                       value={newUserRole}
                       onChange={(e) => setNewUserRole(e.target.value)}
                     >
                        <option value="student">Estudiante</option>
                        <option value="teacher">Profesor</option>
                        <option value="admin">Administrador</option>
                     </select>
                   </div>
                   <div className="flex gap-3 pt-6">
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-2xl font-bold">Cancelar</Button>
                      <Button type="submit" className="flex-1 h-12 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-200">Guardar</Button>
                   </div>
                </form>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
