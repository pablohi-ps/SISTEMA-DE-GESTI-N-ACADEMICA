import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ArrowLeft, Wallet, Receipt, CreditCard, AlertCircle, CheckCircle, 
  Download, ShieldCheck, Globe, TrendingUp, DollarSign, Home, Clock
} from 'lucide-react';

export default function FinancialStatus() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null); 
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/student/finance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setInvoices(data);
    } catch (error) { console.error("Error fetching invoices:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInvoices(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const handlePay = async (invoiceId) => {
    setPaying(invoiceId);
    try {
      const token = localStorage.getItem('novaedu_token');
      const res = await fetch('/api/student/pay-invoice', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: invoiceId })
      });
      if (res.ok) { await fetchInvoices(); }
    } catch (error) { console.error(error); }
    finally { setPaying(null); }
  };

  const totalDebt = invoices.filter(i => i.status !== 'Pagado').reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const paidCount = invoices.filter(i => i.status === 'Pagado').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground transition-all duration-500 overflow-x-hidden font-sans">
      
      {/* Cinematic Navbar */}
      <nav className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none rotate-3">
            <Wallet className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gradient leading-none uppercase">Estado Financiero</h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Transacciones Certificadas • NovaEdu Pay</p>
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
        
        {/* Cinematic Balance Header */}
        <div className={`rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12 transition-all duration-700 ${totalDebt > 0 ? 'bg-slate-900' : 'bg-emerald-900'}`}>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[100px] ${totalDebt > 0 ? 'bg-rose-600/20' : 'bg-emerald-400/20'}`}></div>
          
          <div className="relative z-10 flex-1 space-y-8">
             <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 ${totalDebt > 0 ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                   {totalDebt > 0 ? '⚠️ Acción Requerida' : '✅ Estatus: Al día'}
                </span>
                <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2 backdrop-blur-md">
                   <ShieldCheck className="w-3.5 h-3.5" /> Seguridad Bancaria 256-bit
                </span>
             </div>
             <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none uppercase">Centro de <br/><span className={totalDebt > 0 ? 'text-rose-400' : 'text-emerald-400'}>Pagos & Cobros</span></h2>
             
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Balance Total</p>
                   <p className="text-4xl font-black tracking-tighter">${totalDebt.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Pagos Realizados</p>
                   <p className="text-4xl font-black tracking-tighter">{paidCount}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Próximo Venc.</p>
                   <p className="text-xl font-black tracking-tighter uppercase">{invoices.find(i => i.status !== 'Pagado')?.due_date || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Límite Crédito</p>
                   <p className="text-4xl font-black tracking-tighter">$2k</p>
                </div>
             </div>
          </div>

          <div className="relative z-10 w-full lg:w-[400px] space-y-6">
             {totalDebt > 0 ? (
               <Card className="bg-white/10 border-white/20 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-600/20"><AlertCircle className="w-6 h-6 text-white" /></div>
                     <h4 className="font-black text-sm uppercase tracking-tighter text-white">Pago Pendiente</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-8 font-medium">Regulariza tu situación para mantener el acceso a todos los módulos académicos sin interrupciones.</p>
                  <Button className="w-full h-16 bg-white text-slate-900 hover:bg-slate-200 font-black rounded-2xl text-xs uppercase tracking-widest shadow-2xl shadow-black/20 transition-all active:scale-95">
                     PAGAR BALANCE TOTAL
                  </Button>
               </Card>
             ) : (
               <div className="text-center p-12 bg-emerald-500/10 border-2 border-dashed border-emerald-500/20 rounded-[3rem] backdrop-blur-md">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                     <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-black text-white tracking-tighter mb-2">¡SISTEMA LIMPIO!</h4>
                  <p className="text-xs text-emerald-400 font-black uppercase tracking-widest">No tienes deudas pendientes</p>
               </div>
             )}
          </div>
        </div>

        {/* Payment History Table */}
        <div className="space-y-8">
           <div className="flex items-center justify-between ml-2">
              <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3 uppercase">
                <div className="w-2 h-8 bg-emerald-600 rounded-full"></div>
                Historial de Transacciones
              </h3>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 bg-muted px-4 py-1.5 rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +$1.2k este semestre
                 </div>
                 <Button variant="ghost" className="h-10 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    <Download className="w-4 h-4 mr-2" /> Descargar Extracto
                 </Button>
              </div>
           </div>

           <Card className="border-none shadow-2xl glass rounded-[3rem] overflow-hidden">
             <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-muted/50 border-b border-border">
                     <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                       <th className="px-10 py-6">Concepto / Referencia</th>
                       <th className="px-10 py-6 text-center">Monto Bruto</th>
                       <th className="px-10 py-6 text-center">Vencimiento</th>
                       <th className="px-10 py-6 text-right">Estatus de Pago</th>
                     </tr>
                   </thead>
                   <tbody>
                     {loading ? (
                       <tr><td colSpan="4" className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></td></tr>
                     ) : (
                       <AnimatePresence mode="popLayout">
                         {(invoices || []).map((inv, i) => (
                           <motion.tr 
                             key={inv.id || i}
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.05 }}
                             className="border-b border-border/30 hover:bg-emerald-500/5 transition-all group cursor-default"
                           >
                             <td className="px-10 py-6">
                                <div className="flex items-center gap-4">
                                   <div className={`p-3 rounded-xl ${inv.status === 'Pagado' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                      <Receipt className="w-5 h-5" />
                                   </div>
                                   <div>
                                      <p className="font-black tracking-tight group-hover:text-emerald-600 transition-colors uppercase">{inv.concept}</p>
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">REF: {inv.id.toString().padStart(6, '0')}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-6 text-center">
                                <span className="text-2xl font-black tracking-tighter">${inv.amount.toFixed(2)}</span>
                             </td>
                             <td className="px-10 py-6 text-center">
                                <div className="flex flex-col items-center">
                                   <span className="font-bold text-xs">{inv.due_date}</span>
                                   <span className="text-[9px] font-black text-muted-foreground uppercase mt-1 flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> Corte 23:59h
                                   </span>
                                </div>
                             </td>
                             <td className="px-10 py-6 text-right">
                                {inv.status === 'Pagado' ? (
                                   <div className="flex items-center justify-end gap-3">
                                      <span className="px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                         COMPLETADO
                                      </span>
                                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-950/30 text-emerald-600">
                                         <Download className="w-4 h-4" />
                                      </Button>
                                   </div>
                                ) : (
                                   <Button 
                                     onClick={() => handlePay(inv.id)}
                                     disabled={paying === inv.id}
                                     className={`h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                                       inv.status === 'Atrasado' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                                     }`}
                                   >
                                      {paying === inv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                         <span className="flex items-center gap-2">PAGAR AHORA <CreditCard className="w-4 h-4" /></span>
                                      )}
                                   </Button>
                                )}
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

        {/* Global Finance Help */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="border-none shadow-xl glass rounded-[3rem] p-10 flex items-center gap-8 group">
              <div className="p-5 bg-indigo-600 rounded-[2rem] text-white shadow-xl group-hover:rotate-12 transition-transform">
                 <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-xl font-black uppercase tracking-tighter">Pasarela Segura</h4>
                 <p className="text-xs text-muted-foreground font-medium leading-relaxed">Tus pagos están protegidos por encriptación de grado militar y certificación PCI DSS.</p>
              </div>
           </Card>
           <Card className="border-none shadow-xl glass rounded-[3rem] p-10 flex items-center gap-8 group">
              <div className="p-5 bg-emerald-600 rounded-[2rem] text-white shadow-xl group-hover:rotate-12 transition-transform">
                 <Globe className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-xl font-black uppercase tracking-tighter">NovaEdu Pay Global</h4>
                 <p className="text-xs text-muted-foreground font-medium leading-relaxed">Paga desde cualquier lugar del mundo con tarjeta de crédito, débito o transferencias bancarias.</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

const Loader2 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
