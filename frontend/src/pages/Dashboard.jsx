import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
    DollarSign, ShoppingBag, AlertTriangle, TrendingUp,
    ArrowUpRight, ArrowDownRight, Package, Shield, Truck,
    Plus, ShoppingCart, Brain, Calculator, UserCog, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="premium-card group shadow-sm hover:neon-glow transition-all duration-500 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="flex items-start justify-between relative z-10">
            <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-cyan-500/70 mb-1">{title}</p>
                <h3 className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">{value}</h3>
                {(trend || trendValue) && (
                    <div className="mt-3 flex items-center text-xs font-bold">
                        {trend === 'up' ? (
                            <span className="text-cyan-400 flex items-center bg-cyan-900/40 px-2 py-0.5 rounded-full border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                                <ArrowUpRight size={14} className="mr-1" /> {trendValue}
                            </span>
                        ) : (
                            <span className="text-rose-400 flex items-center bg-rose-900/40 px-2 py-0.5 rounded-full border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                                <ArrowDownRight size={14} className="mr-1" /> {trendValue}
                            </span>
                        )}
                        <span className="text-cyan-500/50 ml-2 font-medium tracking-wide">vs last month</span>
                    </div>
                )}
            </div>
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 lg:group-hover:bg-opacity-20 transition-all duration-500 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] border border-white/5 group-hover:border-white/20`}>
                <Icon size={24} className={`${color.replace('bg-', 'text-')} group-hover:drop-shadow-[0_0_10px_currentColor] transition-all duration-500`} />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        lowStock: 0,
        totalProducts: 0,
        activeWarranties: 0,
        totalSuppliers: 0,
        recentSales: []
    });
    const [salesData, setSalesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesRes, productsRes, warrantyRes, supplierRes] = await Promise.all([
                    api.get('/sales'),
                    api.get('/products'),
                    api.get('/warranties'),
                    api.get('/suppliers')
                ]);

                const sales = salesRes.data;
                const products = productsRes.data;

                // Profit Calculation
                let totalProfit = 0;
                sales.forEach(sale => {
                    sale.SaleItems?.forEach(item => {
                        const product = products.find(p => p.id === item.product_id);
                        if (product) {
                            const profitPerItem = Number(item.price) - Number(product.purchase_price);
                            totalProfit += (profitPerItem * item.quantity);
                        }
                    });
                });

                const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
                const lowStockProducts = products.filter(p => p.stock_quantity < 10);
                const criticalStock = products.filter(p => p.stock_quantity < 5);

                const catMap = {};
                products.forEach(p => catMap[p.category] = (catMap[p.category] || 0) + 1);
                const categoryData = Object.keys(catMap).map(name => ({ name, value: catMap[name] }));

                const chartMap = {};
                sales.forEach(sale => {
                    const date = new Date(sale.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    chartMap[date] = (chartMap[date] || 0) + Number(sale.total_amount);
                });

                const chartData = Object.keys(chartMap).map(date => ({
                    date,
                    amount: chartMap[date]
                })).slice(-7);

                setStats({
                    totalSales,
                    totalProfit,
                    totalOrders: sales.length,
                    lowStock: lowStockProducts.length,
                    criticalStock,
                    totalProducts: products.length,
                    activeWarranties: warrantyRes.data.filter(w => w.status === 'ACTIVE').length,
                    totalSuppliers: supplierRes.data.length,
                    recentSales: sales.slice(0, 5)
                });
                setSalesData(chartData);
                setCategoryData(categoryData);
                setLoading(false);

            } catch (error) {
                console.error("Error loading dashboard", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="relative h-24 w-24">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 pb-10">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl tracking-tighter font-black">
                        Welcome back, <span className="gradient-text">Samarth</span>
                    </h1>
                    <p className="text-slate-500 font-bold mt-2 flex items-center uppercase tracking-widest text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        System Online • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex gap-3 relative z-10">
                    <Button onClick={() => navigate('/billing')} className="rounded-2xl px-8 h-12 bg-cyan-500 hover:bg-cyan-400 text-slate-950 neon-glow flex gap-2 font-black tracking-widest uppercase text-sm cursor-pointer border border-transparent hover:scale-105 transition-all duration-300">
                        <Plus size={20} className="text-slate-950 drop-shadow-md" /> New POS Sale
                    </Button>
                </div>
            </div>

            {/* Quick Access Modules */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'AI Intelligence', icon: Brain, path: '/ai-insights', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', desc: 'Forecasts & Insights' },
                    { label: 'Accounting', icon: Calculator, path: '/accounting', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', desc: 'P&L · GST · Expenses' },
                    { label: 'User & Security', icon: UserCog, path: '/users', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', desc: 'Roles · Audit Logs' },
                    { label: 'Deep Analytics', icon: BarChart3, path: '/reports', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', desc: 'Charts · Trends · KPIs' },
                ].map(item => (
                    <button key={item.path} onClick={() => navigate(item.path)}
                        className={`premium-card text-left hover:scale-[1.02] hover:neon-glow hover:-translate-y-1 transition-all duration-500 cursor-pointer p-5 border ${item.border} group relative overflow-hidden`}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className={`h-11 w-11 rounded-2xl ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] border border-white/5`}>
                                <item.icon size={22} className={`${item.color} group-hover:drop-shadow-[0_0_8px_currentColor]`} />
                            </div>
                            <p className="font-black text-sm text-cyan-50 group-hover:text-cyan-300 transition-colors title-font">{item.label}</p>
                            <p className="text-[10px] font-bold text-cyan-500/60 mt-1 uppercase tracking-wider">{item.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalSales.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                    trend="up"
                    trendValue="+12.5%"
                />
                <StatCard
                    title="Net Profit"
                    value={`₹${stats.totalProfit.toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-primary"
                    trend="up"
                    trendValue="Direct Margin"
                />
                <StatCard
                    title="Low Stock"
                    value={`${stats.lowStock} Items`}
                    icon={AlertTriangle}
                    color="bg-rose-500"
                    trend="down"
                    trendValue="Needs Attention"
                />
                <StatCard
                    title="Inventory"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-indigo-500"
                    trend="up"
                    trendValue="Healthy"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Sales Chart */}
                <div className="xl:col-span-2 premium-card shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Revenue Analytics</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Growth Forecast Over Time</p>
                        </div>
                    </div>
                    <div className="h-[380px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                    <filter id="neonShadow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#0ea5e9" floodOpacity="0.8"/>
                                    </filter>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.6} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#38bdf8', fontSize: 11, fontWeight: 800, fontFamily: 'Space Grotesk' }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#38bdf8', fontSize: 11, fontWeight: 800, fontFamily: 'Space Grotesk' }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid rgba(34,211,238,0.2)', background: 'rgba(15,23,42,0.9)', boxShadow: '0 0 20px rgba(14,165,233,0.3)', fontWeight: 800, color: '#f8fafc' }} itemStyle={{ color: '#0ea5e9' }} />
                                <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorPremium)" style={{ filter: 'url(#neonShadow)' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Inventory & Status */}
                <div className="space-y-8">
                    <div className="premium-card shadow-sm border-emerald-500/20">
                        <h2 className="text-xl font-black tracking-tight mb-6">Inventory Pulse</h2>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="premium-card shadow-sm border-rose-500/20 bg-rose-500/5">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="text-rose-500" size={24} />
                            <h2 className="text-xl font-black tracking-tight">Critical Stock</h2>
                        </div>
                        <div className="space-y-4">
                            {(stats.criticalStock || []).slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{item.product_name}</p>
                                        <p className="text-[10px] uppercase font-black text-rose-400">{item.stock_quantity} left</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="text-primary hover:bg-primary/10">Order</Button>
                                </div>
                            ))}
                            {stats.criticalStock?.length === 0 && <p className="text-xs font-bold text-slate-500">All stock levels healthy.</p>}
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="xl:col-span-3 premium-card shadow-sm overflow-hidden p-0">
                    <div className="p-8 pb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Recent Transactions</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Order Stream</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-white/5 border-y border-white/5">
                                <tr>
                                    <th className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Invoice</th>
                                    <th className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Customer</th>
                                    <th className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Amount</th>
                                    <th className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Date</th>
                                    <th className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {(stats.recentSales || []).map((sale) => (
                                    <tr key={sale.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="font-black text-sm text-primary group-hover:underline cursor-pointer">#{sale.invoice_number}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-black">
                                                    {(sale.Customer?.name || 'C').charAt(0)}
                                                </div>
                                                <span className="font-bold text-sm tracking-tight">{sale.Customer?.name || 'Guest Customer'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-black text-sm">₹{Number(sale.total_amount).toLocaleString()}</td>
                                        <td className="px-8 py-5 text-sm text-slate-500 font-bold">{new Date(sale.createdAt).toLocaleDateString()}</td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
                                                VERIFIED
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
