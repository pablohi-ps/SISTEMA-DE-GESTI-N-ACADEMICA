import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinancialReports() {
  const navigate = useNavigate();
  const [data, setData] = useState({ total: 0, pending: 0, overdue: 0, history: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('novaedu_token');
        const res = await fetch('/api/admin/financial-reports', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (res.ok) setData(json);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-foreground">
      <nav className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-emerald-500" />
          <div>
            <h1 className="font-bold text-xl tracking-tight leading-tight">Reportes Financieros</h1>
            <p className="text-sm text-muted-foreground">Analítica de Ingresos (Admin)</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Admin Panel
        </Button>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ingresos Totales (Pagado)</p>
                  <p className="text-3xl font-bold mt-2 text-foreground">${data.total.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign className="w-6 h-6" /></div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
                <ArrowUpRight className="w-4 h-4 mr-1" /> +12.5% este mes
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cuentas por Cobrar</p>
                  <p className="text-3xl font-bold mt-2 text-foreground">${data.pending.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><PieChart className="w-6 h-6" /></div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                Vencimientos próximos
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cartera Vencida</p>
                  <p className="text-3xl font-bold mt-2 text-red-600">${data.overdue.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-red-100 text-red-600 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
              </div>
              <div className="mt-4 flex items-center text-sm text-red-600 font-medium">
                <ArrowDownRight className="w-4 h-4 mr-1" /> Requiere atención
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Flujo de Caja Proyectado</CardTitle>
            <CardDescription>Comparativa de pagos recibidos vs pendientes por mes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="pagado" name="Ingresos Reales" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pendiente" name="Por Cobrar" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
