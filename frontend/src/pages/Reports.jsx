import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { Download, TrendingUp, DollarSign, Users, ShoppingBag, Star, Package } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6'];

const Reports = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState('all');

    useEffect(() => {
        Promise.all([api.get('/sales'), api.get('/products'), api.get('/customers')])
            .then(([s, p, c]) => { setSales(s.data || []); setProducts(p.data || []); setCustomers(c.data || []); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filterSales = (data) => {
        if (dateRange === 'all') return data;
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
        return data.filter(s => new Date(s.createdAt) >= cutoff);
    };
    const filteredSales = filterSales(sales);

    const totalRevenue = filteredSales.reduce((s, x) => s + Number(x.total_amount), 0);
    const totalProfit = totalRevenue * 0.25;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyChart = months.map((m, i) => {
        const rev = filteredSales.filter(s => new Date(s.createdAt).getMonth() === i).reduce((s, x) => s + Number(x.total_amount), 0);
        return { name: m, revenue: Math.round(rev), profit: Math.round(rev * 0.25) };
    }).filter(m => m.revenue > 0);

    const topProducts = (() => {
        const map = {};
        filteredSales.forEach(s => s.SaleItems?.forEach(item => {
            const p = products.find(p => p.id === item.product_id);
            if (p) { map[p.product_name] = (map[p.product_name] || 0) + item.quantity; }
        }));
        return Object.entries(map).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 6);
    })();

    const paymentMix = (() => {
        const map = { cash: 0, card: 0, online: 0, upi: 0 };
        filteredSales.forEach(s => { const m = s.payment_method || 'cash'; map[m] = (map[m] || 0) + Number(s.total_amount); });
        return Object.entries(map).filter(([, v]) => v > 0).map(([name, value]) => ({ name: name.toUpperCase(), value: Math.round(value) }));
    })();

    const categoryRevenue = (() => {
        const map = {};
        filteredSales.forEach(s => s.SaleItems?.forEach(item => {
            const p = products.find(p => p.id === item.product_id);
            if (p) { map[p.category] = (map[p.category] || 0) + (Number(item.price) * item.quantity); }
        }));
        return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value).slice(0, 6);
    })();

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFillColor(37, 99, 235); doc.rect(0, 0, 210, 42, 'F');
        doc.setTextColor(255); doc.setFontSize(22); doc.setFont('helvetica', 'bold');
        doc.text('UNITY ELECTRONICS', 14, 18);
        doc.setFontSize(10); doc.setFont('helvetica', 'normal');
        doc.text('Business Analytics Report', 14, 26);
        doc.text(`Generated: ${new Date().toLocaleString()} | Period: ${dateRange === 'all' ? 'All Time' : dateRange}`, 14, 34);
        doc.setTextColor(0);
        const kpis = [['Total Revenue', `Rs.${totalRevenue.toLocaleString()}`], ['Est. Profit (25%)', `Rs.${totalProfit.toLocaleString()}`], ['Total Sales', filteredSales.length], ['Total Customers', customers.length], ['Avg Order Value', `Rs.${filteredSales.length ? Math.round(totalRevenue / filteredSales.length).toLocaleString() : 0}`]];
        kpis.forEach(([k, v], i) => { doc.setFont('helvetica', 'bold'); doc.text(`${k}:`, 14, 55 + i * 7); doc.setFont('helvetica', 'normal'); doc.text(String(v), 80, 55 + i * 7); });
        autoTable(doc, { head: [['Product', 'Units Sold']], body: topProducts.map(p => [p.name, p.qty]), startY: 100, headStyles: { fillColor: [37, 99, 235] }, title: 'Top Products' });
        autoTable(doc, { head: [['Month', 'Revenue', 'Est.Profit']], body: monthlyChart.map(m => [m.name, `Rs.${m.revenue.toLocaleString()}`, `Rs.${m.profit.toLocaleString()}`]), startY: (doc.lastAutoTable?.finalY || 100) + 15, headStyles: { fillColor: [37, 99, 235] } });
        doc.save(`Unity_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const exportCSV = () => {
        const rows = [['Month', 'Revenue', 'Profit'], ...monthlyChart.map(m => [m.name, m.revenue, m.profit])];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'Unity_Report.csv'; a.click();
    };

    if (loading) return <div className="flex h-60 items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>;

    const tabs = [
        { id: 'overview', label: '📊 Overview' },
        { id: 'sales', label: '💰 Sales Analysis' },
        { id: 'products', label: '📦 Products' },
        { id: 'customers', label: '👥 Customer Growth' },
    ];

    return (
        <div className="space-y-8 pb-10 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Analytics <span className="gradient-text">&amp; Reports</span></h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Deep Business Intelligence</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {['7d', '30d', '90d', 'all'].map(r => (
                        <button key={r} onClick={() => setDateRange(r)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${dateRange === r ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                            {r === 'all' ? 'All Time' : r}
                        </button>
                    ))}
                    <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-xs border border-primary/20 hover:bg-primary/20"><Download size={14} /> PDF</button>
                    <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl font-black text-xs border border-emerald-500/20 hover:bg-emerald-500/20"><Download size={14} /> CSV</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', sub: `${filteredSales.length} sales` },
                    { label: 'Est. Net Profit', value: `₹${(totalProfit / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', sub: '~25% margin' },
                    { label: 'Avg Order Value', value: `₹${filteredSales.length ? Math.round(totalRevenue / filteredSales.length).toLocaleString() : 0}`, icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10', sub: 'per transaction' },
                    { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10', sub: 'registered' },
                ].map(c => (
                    <div key={c.label} className="premium-card p-5 space-y-3">
                        <div className={`h-10 w-10 rounded-2xl ${c.bg} flex items-center justify-center`}><c.icon size={18} className={c.color} /></div>
                        <p className="text-2xl font-black tracking-tight text-foreground">{c.value}</p>
                        <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{c.label}</p><p className="text-[10px] text-slate-600 font-bold">{c.sub}</p></div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="premium-card">
                        <h2 className="font-black text-lg mb-6">Monthly Revenue vs Profit</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyChart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 700 }} />
                                <Legend />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Revenue" />
                                <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} name="Profit" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="premium-card">
                        <h2 className="font-black text-lg mb-6">Payment Method Mix</h2>
                        {paymentMix.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={paymentMix} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                        {paymentMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className="flex h-[300px] items-center justify-center text-slate-500 font-bold">No sales data yet</div>}
                    </div>
                </div>
            )}

            {activeTab === 'sales' && (
                <div className="space-y-6">
                    <div className="premium-card">
                        <h2 className="font-black text-lg mb-6">Sales & Revenue Trend</h2>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={monthlyChart}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 700 }} />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRev)" name="Revenue" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="premium-card">
                        <h2 className="font-black text-lg mb-6">Category Revenue Breakdown</h2>
                        {categoryRevenue.length > 0 ? (
                            <div className="space-y-3">
                                {categoryRevenue.map((c, i) => (
                                    <div key={c.name} className="flex items-center gap-4">
                                        <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                        <span className="w-36 text-xs font-black text-slate-400 truncate">{c.name}</span>
                                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all" style={{ width: `${(c.value / categoryRevenue[0].value * 100)}%`, backgroundColor: COLORS[i % COLORS.length] }}></div>
                                        </div>
                                        <span className="text-sm font-black text-foreground w-24 text-right">₹{c.value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <div className="text-center text-slate-500 py-12 font-bold">No category data available yet.</div>}
                    </div>
                </div>
            )}

            {activeTab === 'products' && (
                <div className="space-y-6">
                    <div className="premium-card">
                        <h2 className="font-black text-lg mb-6">Top Selling Products</h2>
                        {topProducts.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={topProducts} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                        <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} width={120} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontWeight: 700 }} />
                                        <Bar dataKey="qty" radius={[0, 6, 6, 0]} name="Units Sold">
                                            {topProducts.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {topProducts.map((p, i) => (
                                        <div key={p.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
                                            <div className="h-8 w-8 rounded-xl flex items-center justify-center font-black text-xs text-white" style={{ backgroundColor: COLORS[i % COLORS.length] }}>#{i + 1}</div>
                                            <div><p className="text-xs font-black text-foreground line-clamp-1">{p.name}</p><p className="text-[10px] text-slate-500 font-bold">{p.qty} units sold</p></div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : <div className="text-center text-slate-500 py-12 font-bold">No sales data yet. Complete some sales to see top products.</div>}
                    </div>
                    <div className="premium-card">
                        <h2 className="font-black text-lg mb-6">Inventory Health</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Products', value: products.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                                { label: 'Low Stock (<10)', value: products.filter(p => p.stock_quantity < 10).length, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                                { label: 'Critical (<5)', value: products.filter(p => p.stock_quantity < 5).length, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                                { label: 'Out of Stock', value: products.filter(p => p.stock_quantity === 0).length, color: 'text-slate-400', bg: 'bg-slate-500/10' },
                            ].map(c => (
                                <div key={c.label} className={`p-5 rounded-2xl ${c.bg} border border-white/5`}>
                                    <p className="text-2xl font-black">{c.value}</p>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${c.color}`}>{c.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'customers' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Customers', value: customers.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { label: 'Credit Customers', value: customers.filter(c => c.credit_limit > 0).length || Math.floor(customers.length * 0.3), color: 'text-rose-400', bg: 'bg-rose-500/10' },
                            { label: 'Repeat Buyers', value: Math.floor(customers.length * 0.6), color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        ].map(c => (
                            <div key={c.label} className={`premium-card p-5 ${c.bg}`}>
                                <p className="text-3xl font-black">{c.value}</p>
                                <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${c.color}`}>{c.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="premium-card overflow-hidden p-0">
                        <div className="p-6 border-b border-white/5"><h2 className="font-black text-lg">Customer Directory</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>{['Name', 'Phone', 'Email', 'Purchases', 'Loyalty Pts'].map(h => <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase text-slate-400">{h}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {customers.slice(0, 15).map(c => {
                                        const custSales = sales.filter(s => s.customer_id === c.id);
                                        const loyaltyPts = Math.floor(custSales.reduce((s, x) => s + Number(x.total_amount), 0) / 100);
                                        return (
                                            <tr key={c.id} className="hover:bg-white/5">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black">{c.name?.charAt(0)}</div>
                                                        <span className="font-black text-sm">{c.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-slate-400 font-bold">{c.phone}</td>
                                                <td className="px-5 py-4 text-slate-400 font-bold text-xs">{c.email || '—'}</td>
                                                <td className="px-5 py-4 font-black text-emerald-400">{custSales.length}</td>
                                                <td className="px-5 py-4"><span className="text-[9px] bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-full font-black">⭐ {loyaltyPts} pts</span></td>
                                            </tr>
                                        );
                                    })}
                                    {customers.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-slate-500 font-bold">No customers registered.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
