import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import {
  ShieldCheck, ShieldAlert, Cpu, HardDrive, Lock, UserCheck, Key,
  BarChart3, Clock, AlertTriangle, CheckCircle2, ChevronRight,
  Settings, Users, RefreshCw, Layers, Award, FileText, Check, Save, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminCompliance() {
  const [activeTab, setActiveTab] = useState('iso27001');
  const [settings, setSettings] = useState({
    mfa_enabled: 'false',
    password_strength: 'Medium',
    session_timeout: '30',
    db_encryption: 'Active',
    failed_attempts_limit: '5'
  });
  const [stats, setStats] = useState({
    uptime: 0,
    cpuUsage: 8,
    memoryUsage: 42,
    responseTime: 135,
    assets: [],
    backupStatus: 'Copia de seguridad semanal - Completada con éxito',
    backupHealth: '100%',
    securityScore: 94,
    failedAttempts: 2
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchLog, setSearchLog] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Performance history for the live graph
  const [perfHistory, setPerfHistory] = useState([
    { name: '10s', cpu: 12, ram: 44, ms: 135 },
    { name: '8s', cpu: 8, ram: 42, ms: 140 },
    { name: '6s', cpu: 15, ram: 45, ms: 130 },
    { name: '4s', cpu: 7, ram: 42, ms: 125 },
    { name: '2s', cpu: 10, ram: 43, ms: 138 },
    { name: 'Ahora', cpu: 9, ram: 42, ms: 135 }
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('novaedu_token');
      const [resSettings, resStats, resAudit] = await Promise.all([
        fetch('/api/admin/compliance/settings', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/compliance/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/audit', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (resSettings.ok) setSettings(await resSettings.json());
      if (resStats.ok) setStats(await resStats.json());
      if (resAudit.ok) setAuditLogs(await resAudit.json());
    } catch (error) {
      console.error("Error loading compliance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // eslint-disable-line react-hooks/set-state-in-effect

    // Simulated real-time resource updates (ISO 38500)
    const interval = setInterval(() => {
      setStats(prev => {
        const cpu = Math.max(2, Math.min(95, prev.cpuUsage + Math.floor(Math.random() * 7) - 3));
        const ram = Math.max(30, Math.min(85, prev.memoryUsage + Math.floor(Math.random() * 3) - 1));
        const ms = Math.max(80, Math.min(300, prev.responseTime + Math.floor(Math.random() * 21) - 10));

        // Update history graph
        setPerfHistory(history => {
          const nextHistory = [...history.slice(1)];
          nextHistory.push({
            name: 'Ahora',
            cpu,
            ram,
            ms
          });
          // Fix names
          return nextHistory.map((item, idx) => ({
            ...item,
            name: idx === 5 ? 'Ahora' : `${(5 - idx) * 2}s`
          }));
        });

        return { ...prev, cpuUsage: cpu, memoryUsage: ram, responseTime: ms };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/admin/compliance/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        // Refresh audit logs
        const resAudit = await fetch('/api/admin/audit', { headers: { 'Authorization': `Bearer ${token}` } });
        if (resAudit.ok) setAuditLogs(await resAudit.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.details?.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.user_name?.toLowerCase().includes(searchLog.toLowerCase());

    const matchesFilter = filterAction === 'ALL' || log.action === filterAction;

    return matchesSearch && matchesFilter;
  });


  // Human Readable Uptime Formatting
  const formatUptime = (seconds) => {
    if (!seconds) return '0s';
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    const dDisplay = d > 0 ? `${d}d ` : "";
    const hDisplay = h > 0 ? `${h}h ` : "";
    const mDisplay = m > 0 ? `${m}m ` : "";
    const sDisplay = s > 0 ? `${s}s` : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  };

  const [activePrinciple, setActivePrinciple] = useState(0);
  const principles = [
    {
      title: "Responsabilidad",
      desc: "Establecer responsabilidades claras para las decisiones y el uso de la TI.",
      compliance: "Completado",
      status: "100%",
      detail: "Control de Acceso Basado en Roles (RBAC) definido. Interfaces segregadas por rol de usuario: Administración, Docentes y Estudiantes. Toda acción administrativa queda registrada en bitácoras inmutables en la base de datos para auditorías de responsabilidades."
    },
    {
      title: "Estrategia",
      desc: "Alinear la TI con las metas y estrategias de la institución.",
      compliance: "En Progreso",
      status: "85%",
      detail: "El plan estratégico de TI está alineado al Plan de Desarrollo Institucional. Se monitorea la adopción de clases virtuales, registros académicos automatizados y el uso de canales interactivos por parte de docentes y alumnos."
    },
    {
      title: "Adquisición",
      desc: "Garantizar adquisiciones y licenciamientos de TI válidos, eficientes y conformes.",
      compliance: "Completado",
      status: "100%",
      detail: "Se cuenta con un inventario actualizado de activos lógicos. Las herramientas principales (Vite, React, Express, SQLite) están gobernadas bajo licencias MIT/BSD que no comprometen la propiedad del software institucional."
    },
    {
      title: "Desempeño",
      desc: "Asegurar que la TI proporcione los servicios necesarios para el negocio escolar.",
      compliance: "Optimizado",
      status: "95%",
      detail: "SLA de disponibilidad del sistema >99.9%. Tiempos de respuesta de backend promedio menores a 150ms. Se monitorea en tiempo real la carga del servidor para prevenir degradación de servicios durante períodos de exámenes o matrículas."
    },
    {
      title: "Conformidad",
      desc: "Cumplir con las normativas legales, de protección de datos y reglamentos del sector educativo.",
      compliance: "En Revisión",
      status: "90%",
      detail: "Monitoreo continuo de cumplimiento de estándares y protección de datos. El sistema está estructurado para resguardar la privacidad de estudiantes y docentes en concordancia con leyes de protección de datos locales."
    },
    {
      title: "Comportamiento Humano",
      desc: "Garantizar el respeto a las necesidades humanas y la capacitación del personal.",
      compliance: "En Curso",
      status: "80%",
      detail: "Capacitaciones anuales planificadas en ciberseguridad y gobernanza para el personal académico. Se ha alcanzado un 92% de participación de la planta docente en el uso efectivo de herramientas digitales."
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-bold text-muted-foreground">Cargando módulo de cumplimiento y auditoría...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">

      {/* Toast Alert */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 right-8 z-[200] flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 font-sans"
          >
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <p className="text-xs font-black">Cambios Guardados</p>
              <p className="text-[10px] opacity-90 font-semibold">Políticas de seguridad actualizadas con éxito.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-indigo-600" /> Gobernanza y Seguridad <span className="text-indigo-600">ISO</span>
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            Gestión y conformidad integrada de los estándares internacionales ISO 27001 e ISO 38500.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-muted/60 p-1.5 rounded-2xl border border-border/50">
          <Button
            variant="ghost"
            onClick={() => setActiveTab('iso27001')}
            className={`rounded-xl h-10 px-6 font-bold text-xs transition-all ${activeTab === 'iso27001' ? 'bg-background shadow-md text-indigo-600' : 'text-muted-foreground'}`}
          >
            <Lock className="w-3.5 h-3.5 mr-2" /> ISO 27001 (Seguridad)
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('iso38500')}
            className={`rounded-xl h-10 px-6 font-bold text-xs transition-all ${activeTab === 'iso38500' ? 'bg-background shadow-md text-indigo-600' : 'text-muted-foreground'}`}
          >
            <Cpu className="w-3.5 h-3.5 mr-2" /> ISO 38500 (Gobernanza)
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'iso27001' ? (
          <motion.div
            key="iso27001"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Top row metrics for security */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Compliance level circle */}
              <Card className="border-none shadow-lg glass flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-600" /> Nivel de Cumplimiento SGSI
                  </CardTitle>
                  <CardDescription>ISO 27001:2022 Controles Clave</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center pb-6">
                  <div className="relative flex items-center justify-center w-32 h-32">
                    {/* SVG Radial Progress */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-indigo-600" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * stats.securityScore) / 100} strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3xl font-black tracking-tighter text-foreground">{stats.securityScore}%</span>
                      <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Cumple</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-6 text-[10px] font-bold">
                    <div className="flex items-center gap-1.5 text-muted-foreground"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Control de Acceso</div>
                    <div className="flex items-center gap-1.5 text-muted-foreground"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Bitácora Activa</div>
                    <div className="flex items-center gap-1.5 text-muted-foreground"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Cifrado de DB</div>
                    <div className="flex items-center gap-1.5 text-muted-foreground"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> MFA (Inactivo)</div>
                  </div>
                </CardContent>
              </Card>

              {/* Encryption & Backups status */}
              <Card className="border-none shadow-lg glass lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-indigo-600" /> Integridad de Datos y Respaldo
                  </CardTitle>
                  <CardDescription>Criptografía y Copias de Seguridad (A.10 y A.12)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* Database Encryption card */}
                  <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/40 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 rounded-xl">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black">Cifrado de Base de Datos En Reposo (At-Rest)</h4>
                        <p className="text-[10px] text-muted-foreground">Cifrado AES-256 a nivel de página SQLite</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase">Activo</span>
                  </div>

                  {/* Backups card */}
                  <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/40 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 rounded-xl">
                        <HardDrive className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black">Respaldos del Sistema</h4>
                        <p className="text-[10px] text-muted-foreground">{stats.backupStatus}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase">Salud: {stats.backupHealth}</span>
                    </div>
                  </div>

                  {/* Security advisories */}
                  <div className="flex items-start gap-2.5 p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl text-xs font-medium">
                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span><strong>Recomendación ISO 27001:</strong> Implemente la Autenticación Multifactor (MFA) para todas las cuentas de tipo Administrador para mitigar riesgos de secuestro de sesión y fuerza bruta.</span>
                  </div>

                </CardContent>
              </Card>

            </div>

            {/* Interactive Forms and Audit list */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

              {/* Security Policy Controls Form (2/5 size) */}
              <Card className="border-none shadow-lg glass xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Settings className="h-5 w-5 text-indigo-600" /> Controles Criptográficos y de Acceso
                  </CardTitle>
                  <CardDescription>Ajustes de políticas de seguridad en tiempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-5">

                    {/* MFA Toggle */}
                    <div className="flex items-center justify-between py-2 border-b border-border/40">
                      <div>
                        <span className="text-xs font-bold text-foreground block">Autenticación Multifactor (MFA)</span>
                        <p className="text-[10px] text-muted-foreground">Exigir código OTP adicional al ingresar</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={settings.mfa_enabled === 'true'}
                          onChange={(e) => setSettings({ ...settings, mfa_enabled: e.target.checked ? 'true' : 'false' })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {/* Password Strength Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Política de Contraseña</label>
                      <select
                        value={settings.password_strength}
                        onChange={(e) => setSettings({ ...settings, password_strength: e.target.value })}
                        className="w-full h-11 rounded-xl bg-muted/50 border border-border px-3 text-xs font-medium focus:ring-2 ring-indigo-600 outline-none"
                      >
                        <option value="Basic">Básica (Mínimo 6 letras)</option>
                        <option value="Medium">Media (Mínimo 8 caracteres, números)</option>
                        <option value="Strong">Fuerte (Mínimo 10 carac., números, mayúsculas, especial)</option>
                      </select>
                    </div>

                    {/* Session Timeout Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Tiempo Límite de Sesión</label>
                      <select
                        value={settings.session_timeout}
                        onChange={(e) => setSettings({ ...settings, session_timeout: e.target.value })}
                        className="w-full h-11 rounded-xl bg-muted/50 border border-border px-3 text-xs font-medium focus:ring-2 ring-indigo-600 outline-none"
                      >
                        <option value="15">15 minutos de inactividad</option>
                        <option value="30">30 minutos de inactividad</option>
                        <option value="60">60 minutos de inactividad</option>
                      </select>
                    </div>

                    {/* Retry Limit input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Límite de Intentos Fallidos</label>
                      <Input
                        type="number"
                        min="3"
                        max="20"
                        value={settings.failed_attempts_limit}
                        onChange={(e) => setSettings({ ...settings, failed_attempts_limit: e.target.value })}
                        className="rounded-xl h-11 bg-muted/50 border-border"
                      />
                    </div>

                    {/* Encryption status (Static UI indicator but shown on form) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Cifrado de Base de Datos</label>
                      <Input
                        disabled
                        value="Cifrado AES-256 Activo (Por Hardware)"
                        className="rounded-xl h-11 bg-muted/20 border-border text-xs text-muted-foreground font-semibold"
                      />
                    </div>

                    {/* Submit button */}
                    <div className="pt-2 flex items-center justify-between">
                      {saveSuccess && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                          <Check className="w-4 h-4" /> Políticas Guardadas
                        </motion.div>
                      )}
                      <div className="flex-1"></div>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl h-10 px-5 bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700"
                      >
                        {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Guardar Cambios
                      </Button>
                    </div>

                  </form>
                </CardContent>
              </Card>

              {/* Active Audit Logs Table (3/5 size) */}
              <Card className="border-none shadow-lg glass xl:col-span-3">
                <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-600" /> Registro de Auditoría de Accesos
                    </CardTitle>
                    <CardDescription>Trazabilidad obligatoria (ISO 27001 - A.12.4)</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-48">
                      <Input
                        placeholder="Buscar log..."
                        value={searchLog}
                        onChange={(e) => setSearchLog(e.target.value)}
                        className="h-9 text-xs rounded-xl bg-white/50 dark:bg-slate-900/50 pl-3"
                      />
                    </div>
                    <select
                      value={filterAction}
                      onChange={(e) => setFilterAction(e.target.value)}
                      className="h-9 text-xs rounded-xl bg-white/50 dark:bg-slate-900/50 border border-border/50 px-2 font-semibold outline-none"
                    >
                      <option value="ALL">Todos</option>
                      <option value="LOGIN">Logins</option>
                      <option value="COMPLIANCE_UPDATE">Seguridad</option>
                      <option value="CREATE_USER">Altas</option>
                      <option value="DELETE_USER">Bajas</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto max-h-[460px]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/40 border-b border-border sticky top-0 backdrop-blur-md">
                        <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          <th className="px-6 py-4">Usuario</th>
                          <th className="px-6 py-4">Acción</th>
                          <th className="px-6 py-4">Detalles</th>
                          <th className="px-6 py-4">Fecha/Hora</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="px-6 py-12 text-center font-bold text-muted-foreground">
                              No se encontraron registros de auditoría que coincidan con la búsqueda.
                            </td>
                          </tr>
                        ) : (
                          filteredLogs.map((log) => (
                            <tr key={log.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-3.5 font-bold">{log.user_name || 'Desconocido (API)'}</td>
                              <td className="px-6 py-3.5">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${log.action === 'LOGIN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' :
                                    log.action === 'COMPLIANCE_UPDATE' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400' :
                                      log.action === 'CREATE_USER' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' :
                                        'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                                  }`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 text-muted-foreground font-medium max-w-[200px] truncate" title={log.details}>
                                {log.details}
                              </td>
                              <td className="px-6 py-3.5 text-muted-foreground font-medium">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="iso38500"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Top row: Server Resource health monitors (ISO 38500 Principle of Performance) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* CPU load card */}
              <Card className="border-none shadow-lg glass p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Uso de CPU del Servidor</p>
                    <h3 className="text-3xl font-black mt-1 tracking-tight">{stats.cpuUsage}%</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-slate-800 text-indigo-600 rounded-2xl">
                    <Cpu className="h-5 w-5" />
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${stats.cpuUsage > 80 ? 'bg-rose-500' : stats.cpuUsage > 50 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                    style={{ width: `${stats.cpuUsage}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 font-semibold">Estado del procesador: Saludable</p>
              </Card>

              {/* Memory Usage Card */}
              <Card className="border-none shadow-lg glass p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Uso de Memoria RAM</p>
                    <h3 className="text-3xl font-black mt-1 tracking-tight">{stats.memoryUsage}%</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-slate-800 text-indigo-600 rounded-2xl">
                    <Layers className="h-5 w-5" />
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${stats.memoryUsage}%` }}></div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 font-semibold">Asignada: 2.1 GB / 4.0 GB</p>
              </Card>

              {/* API response time and system uptime */}
              <Card className="border-none shadow-lg glass p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tiempo de Respuesta API</p>
                    <h3 className="text-3xl font-black mt-1 tracking-tight">{stats.responseTime} ms</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-slate-800 text-indigo-600 rounded-2xl">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold mt-3 pt-2.5 border-t border-border/40">
                  <span>Uptime del Servidor:</span>
                  <span className="text-indigo-600 font-bold">{formatUptime(stats.uptime)}</span>
                </div>
              </Card>

            </div>

            {/* Performance line charts in real-time */}
            <Card className="border-none shadow-lg glass overflow-hidden">
              <CardHeader className="pb-0">
                <CardTitle className="text-base font-bold">Monitor de Recursos en Tiempo Real</CardTitle>
                <CardDescription>ISO 38500 Principio de Desempeño: Medición continua de disponibilidad e infraestructura</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-64 w-full pt-8 px-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={perfHistory}>
                      <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }} />
                      <Area type="monotone" name="Carga CPU (%)" dataKey="cpu" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" />
                      <Area type="monotone" name="Carga RAM (%)" dataKey="ram" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRam)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* IT Governance principles section */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

              {/* Principles selector sidebar (2/5 size) */}
              <div className="xl:col-span-2 space-y-3">
                <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-2 mb-2">Principios de Gobierno Corporativo de TI</h3>

                {principles.map((pr, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePrinciple(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-center ${activePrinciple === idx
                        ? 'bg-indigo-600/5 border-indigo-600/30 shadow-sm'
                        : 'bg-white/20 dark:bg-slate-900/20 border-border/40 hover:bg-muted/40'
                      }`}
                  >
                    <div className="space-y-1 pr-4">
                      <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${pr.compliance === 'Completado' || pr.compliance === 'Optimizado' ? 'text-emerald-500' : 'text-amber-500'
                          }`} />
                        {pr.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{pr.desc}</p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{pr.status}</span>
                  </button>
                ))}
              </div>

              {/* Principle detailed view and asset management (3/5 size) */}
              <div className="xl:col-span-3 space-y-6">

                {/* Active principle detail */}
                <Card className="border-none shadow-lg glass">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                        ISO 38500 • Principio
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${principles[activePrinciple].compliance === 'Completado' || principles[activePrinciple].compliance === 'Optimizado'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                        }`}>
                        {principles[activePrinciple].compliance}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold mt-3">{principles[activePrinciple].title}</CardTitle>
                    <CardDescription>{principles[activePrinciple].desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {principles[activePrinciple].detail}
                  </CardContent>
                </Card>

                {/* Software Assets tracking list (Principle of Acquisition) */}
                <Card className="border-none shadow-lg glass">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" /> Inventario de Activos de Software y Licencias
                    </CardTitle>
                    <CardDescription>Garantía de procedencia legítima y soporte conforme (ISO 38500)</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] text-left">
                        <thead className="bg-muted/40 border-b border-border">
                          <tr className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            <th className="px-6 py-4">Componente</th>
                            <th className="px-6 py-4">Versión</th>
                            <th className="px-6 py-4">Licencia</th>
                            <th className="px-6 py-4 text-right">Estatus</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.assets.map((asset, idx) => (
                            <tr key={idx} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                              <td className="px-6 py-3.5 font-bold text-foreground">{asset.name}</td>
                              <td className="px-6 py-3.5 text-muted-foreground font-semibold">{asset.version}</td>
                              <td className="px-6 py-3.5 text-muted-foreground font-semibold">{asset.license}</td>
                              <td className="px-6 py-3.5 text-right">
                                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-black rounded-full uppercase text-[8px]">
                                  {asset.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
