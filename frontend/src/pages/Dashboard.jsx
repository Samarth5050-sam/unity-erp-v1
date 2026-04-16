import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
    DollarSign, ShoppingBag, AlertTriangle, TrendingUp,
    ArrowUpRight, ArrowDownRight, Package, Shield, Truck,
    Plus, Brain, Calculator, UserCog, BarChart3, RefreshCw,
    Bell, X, ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const MOCK_CHART = [
    { date: '30 Mar', amount: 32000 }, { date: '31 Mar', amount: 47500 },
    { date: '1 Apr', amount: 28000 },  { date: '2 Apr', amount: 61000 },
    { date: '3 Apr', amount: 39500 },  { date: '4 Apr', amount: 55000 },
    { date: '5 Apr', amount: 72000 },
];
const MOCK_CAT = [
    { name: 'AC', value: 28 }, { name: 'TV', value: 22 },
    { name: 'Fridge', value: 18 }, { name: 'Laptop', value: 15 }, { name: 'Other', value: 17 }
];
const MOCK_SALES = [
    { id: 1, invoice_number: 'INV-001', Customer: { name: 'Samarth Shinde' }, total_amount: 45000, createdAt: new Date().toISOString() },
    { id: 2, invoice_number: 'INV-002', Customer: { name: 'Raj Patil' }, total_amount: 28500, createdAt: new Date().toISOString() },
    { id: 3, invoice_number: 'INV-003', Customer: { name: 'Amit Kumar' }, total_amount: 61200, createdAt: new Date().toISOString() },
];

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
                            <span className="text-cyan-400 flex items-center bg-cyan-900/40 px-2 py-0.5 rounded-full border border-cyan-500/30">
                                <ArrowUpRight size={14} className="mr-1" /> {trendValue}
                            </span>
                        ) : (
                            <span className="text-rose-400 flex items-center bg-rose-900/40 px-2 py-0.5 rounded-full border border-rose-500/30">
                                <ArrowDownRight size={14} className="mr-1" /> {trendValue}
                            </span>
                        )}
                        <span className="text-cyan-500/50 ml-2 font-medium tracking-wide">vs last month</span>
                    </div>
                )}
            </div>
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 lg:group-hover:bg-opacity-20 transition-all duration-500 border border-white/5`}>
                <Icon size={24} className={`${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    </div>
);

// Notification Bell Component
const NotificationBell = () => {
    const { adminNotifications, markAdminNotifRead, clearAdminNotifs, unreadNotifCount } = useOrders();
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button onClick={() => setOpen(o => !o)} className="relative h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all">
                <Bell size={18} />
                {unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifCount}
                    </span>
                )}
            </button>
            {open && (
                <div className="absolute right-0 top-12 w-[340px] bg-[#0a0f1e] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h3 className="font-black text-white text-sm">Order Notifications</h3>
                        <div className="flex gap-2">
                            {unreadNotifCount > 0 && <button onClick={clearAdminNotifs} className="text-xs font-bold text-slate-400 hover:text-white">Mark all read</button>}
                            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
                        </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {adminNotifications.length === 0 && (
                            <div className="py-8 text-center text-slate-500 text-sm font-bold">No notifications yet</div>
                        )}
                        {adminNotifications.map(n => (
                            <div key={n.id} onClick={() => markAdminNotifRead(n.id)}
                                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!n.read ? 'bg-cyan-500/5' : ''}`}>
                                <div className="flex gap-3">
                                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'bg-cyan-500/20' : 'bg-white/5'}`}>
                                        <ShoppingCart size={16} className={!n.read ? 'text-cyan-400' : 'text-slate-500'} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-black ${!n.read ? 'text-white' : 'text-slate-400'}`}>{n.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                                        <p className="text-[10px] text-slate-600 mt-1">{new Date(n.time).toLocaleString('en-IN')}</p>
                                    </div>
                                    {!n.read && <div className="h-2 w-2 rounded-full bg-cyan-500 shrink-0 mt-1" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { adminNotifications, unreadNotifCount } = useOrders();
    const [stats, setStats] = useState({
        totalSales: 0, totalProfit: 0, totalOrders: 0,
        lowStock: 0, criticalStock: [], totalProducts: 0,
        activeWarranties: 0, totalSuppliers: 0, recentSales: []
    });
    const [salesData, setSalesData] = useState(MOCK_CHART);
    const [categoryData, setCategoryData] = useState(MOCK_CAT);
    const [loading, setLoading] = useState(true);
    const [offline, setOffline] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesRes, productsRes, warrantyRes, supplierRes] = await Promise.all([
                    api.get('/sales'),
                    api.get('/products'),
                    api.get('/warranties'),
                    api.get('/suppliers')
                ]);

                const sales = Array.isArray(salesRes.data) ? salesRes.data : [];
                const products = Array.isArray(productsRes.data) ? productsRes.data : [];

                let totalProfit = 0;
                sales.forEach(sale => {
                    sale.SaleItems?.forEach(item => {
                        const product = products.find(p => p.id === item.product_id);
                        if (product) {
                            totalProfit += (Number(item.price) - Number(product.purchase_price)) * item.quantity;
                        }
                    });
                });

                const totalSales = sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
                const lowStockProducts = products.filter(p => p.stock_quantity < 10);
                const criticalStock = products.filter(p => p.stock_quantity < 5);

                const catMap = {};
                products.forEach(p => catMap[p.category] = (catMap[p.category] || 0) + 1);
                const catData = Object.keys(catMap).map(name => ({ name, value: catMap[name] }));

                const chartMap = {};
                sales.forEach(sale => {
                    const date = new Date(sale.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    chartMap[date] = (chartMap[date] || 0) + Number(sale.total_amount || 0);
                });
                const chartData = Object.keys(chartMap).map(date => ({ date, amount: chartMap[date] })).slice(-7);

                setStats({
                    totalSales, totalProfit,
                    totalOrders: sales.length,
                    lowStock: lowStockProducts.length,
                    criticalStock,
                    totalProducts: products.length,
                    activeWarranties: (Array.isArray(warrantyRes.data) ? warrantyRes.data : []).filter(w => w.status === 'ACTIVE').length,
                    totalSuppliers: Array.isArray(supplierRes.data) ? supplierRes.data.length : 0,
                    recentSales: sales.slice(0, 5)
                });
                if (chartData.length > 0) setSalesData(chartData);
                if (catData.length > 0) setCategoryData(catData);
                setOffline(false);
            } catch (error) {
                console.warn('Backend offline — running with demo data');
                setOffline(true);
                setStats({
                    totalSales: 3350000, totalProfit: 820000, totalOrders: 47,
                    lowStock: 8, criticalStock: [
                        { product_name: 'Samsung 55" OLED TV', stock_quantity: 2 },
                        { product_name: 'Daikin 2T Inverter AC', stock_quantity: 3 },
                        { product_name: 'iPhone 15 Pro', stock_quantity: 1 },
                    ],
                    totalProducts: 100, activeWarranties: 23,
                    totalSuppliers: 5, recentSales: MOCK_SALES
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
            <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-400 font-bold text-sm animate-pulse">Connecting to backend...</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-10">
            {offline && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                    <RefreshCw size={14} className="animate-spin" />
                    Backend offline — displaying demo data. Start the backend with <code className="bg-black/20 px-2 py-0.5 rounded mx-1">npm start</code> in the backend folder.
                </div>
            )}

            {/* New Order Alert Banner */}
            {unreadNotifCount > 0 && (
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold animate-pulse">
                    <Bell size={16} />
                    You have <span className="font-black text-white mx-1">{unreadNotifCount}</span> new customer order{unreadNotifCount > 1 ? 's' : ''}!
                </div>
            )}

            {/* Hero */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl tracking-tighter font-black">
                        Welcome back, <span className="gradient-text">{user?.name || 'Admin'}</span>
                    </h1>
                    <p className="text-slate-500 font-bold mt-2 flex items-center uppercase tracking-widest text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        System Online • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationBell />
                    <button
                        onClick={() => navigate('/admin/billing')}
                        className="rounded-2xl px-8 h-12 bg-cyan-500 hover:bg-cyan-400 text-slate-950 neon-glow flex gap-2 items-center font-black tracking-widest uppercase text-sm cursor-pointer border border-transparent hover:scale-105 transition-all duration-300"
                    >
                        <Plus size={20} /> New POS Sale
                    </button>
                </div>
            </div>

            {/* Quick Access */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'AI Intelligence', icon: Brain, path: '/admin/ai-insights', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', desc: 'Forecasts & Insights' },
                    { label: 'Accounting',      icon: Calculator, path: '/admin/accounting', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', desc: 'P&L · GST · Expenses' },
                    { label: 'User & Security', icon: UserCog, path: '/admin/users', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', desc: 'Roles · Audit Logs' },
                    { label: 'Deep Analytics', icon: BarChart3, path: '/admin/reports', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', desc: 'Charts · Trends · KPIs' },
                ].map(item => (
                    <button key={item.path} onClick={() => navigate(item.path)}
                        className={`premium-card text-left hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 cursor-pointer p-5 border ${item.border} group relative overflow-hidden`}
                    >
                        <div className={`h-11 w-11 rounded-2xl ${item.bg} flex items-center justify-center mb-3`}>
                            <item.icon size={22} className={item.color} />
                        </div>
                        <p className="font-black text-sm text-cyan-50 group-hover:text-cyan-300 transition-colors">{item.label}</p>
                        <p className="text-[10px] font-bold text-cyan-500/60 mt-1 uppercase tracking-wider">{item.desc}</p>
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${Number(stats.totalSales || 0).toLocaleString()}`} icon={DollarSign} color="bg-emerald-500" trend="up" trendValue="+12.5%" />
                <StatCard title="Net Profit"    value={`₹${Number(stats.totalProfit || 0).toLocaleString()}`} icon={TrendingUp} color="bg-primary" trend="up" trendValue="Direct Margin" />
                <StatCard title="Low Stock"     value={`${stats.lowStock || 0} Items`} icon={AlertTriangle} color="bg-rose-500" trend="down" trendValue="Needs Attention" />
                <StatCard title="Inventory"     value={stats.totalProducts || 0} icon={Package} color="bg-indigo-500" trend="up" trendValue="Healthy" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="xl:col-span-2 premium-card shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Revenue Analytics</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">7-Day Sales Trend</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#38bdf8', fontSize: 11, fontWeight: 800 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#38bdf8', fontSize: 11, fontWeight: 800 }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid rgba(34,211,238,0.2)', background: 'rgba(15,23,42,0.95)', fontWeight: 800, color: '#f8fafc' }} />
                                <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorPremium)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Inventory + Critical Stock */}
                <div className="space-y-6">
                    <div className="premium-card shadow-sm">
                        <h2 className="text-xl font-black tracking-tight mb-4">Inventory Pulse</h2>
                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                                        {categoryData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="premium-card shadow-sm border-rose-500/20 bg-rose-500/5">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="text-rose-500" size={20} />
                            <h2 className="text-lg font-black tracking-tight">Critical Stock</h2>
                        </div>
                        <div className="space-y-3">
                            {(stats.criticalStock || []).slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{item.product_name}</p>
                                        <p className="text-[10px] uppercase font-black text-rose-400">{item.stock_quantity} left</p>
                                    </div>
                                    <button onClick={() => navigate('/admin/products')} className="text-xs font-black text-primary hover:underline">Reorder</button>
                                </div>
                            ))}
                            {(stats.criticalStock || []).length === 0 && (
                                <p className="text-xs font-bold text-slate-500">All stock levels healthy ✅</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="xl:col-span-3 premium-card shadow-sm overflow-hidden p-0">
                    <div className="p-8 pb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Recent Transactions</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Order Stream</p>
                        </div>
                        <button onClick={() => navigate('/admin/billing')} className="text-xs font-black text-primary hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-y border-white/5">
                                <tr>
                                    {['Invoice', 'Customer', 'Amount', 'Date', 'Status'].map(h => (
                                        <th key={h} className="px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {(stats.recentSales || []).map((sale, i) => (
                                    <tr key={sale.id || i} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-8 py-5 font-black text-sm text-primary">#{sale.invoice_number}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">
                                                    {(sale.Customer?.name || 'C').charAt(0)}
                                                </div>
                                                <span className="font-bold text-sm">{sale.Customer?.name || 'Guest'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-black text-sm">₹{Number(sale.total_amount || 0).toLocaleString()}</td>
                                        <td className="px-8 py-5 text-sm text-slate-500 font-bold">{new Date(sale.createdAt).toLocaleDateString()}</td>
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-500 ring-1 ring-inset ring-emerald-500/20">VERIFIED</span>
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
