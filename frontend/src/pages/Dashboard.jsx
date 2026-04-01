import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
    DollarSign, ShoppingBag, AlertTriangle, TrendingUp,
    ArrowUpRight, ArrowDownRight, Package, Shield, Truck,
    Plus, ShoppingCart, Brain, Calculator, UserCog, BarChart3,
    Monitor, HardDrive, Cpu, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

/* ── Windows 2000 style stat card (a "window panel") ── */
const StatCard = ({ title, value, icon: Icon, trend, trendValue, accentColor = '#000080' }) => (
    <div
        style={{
            backgroundColor: '#d4d0c8',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            boxShadow: '1px 1px 0 #000000, inset 1px 1px 0 #dfdfdf',
        }}
    >
        {/* Title bar */}
        <div
            style={{
                background: 'linear-gradient(to right, #000080, #1084d0)',
                color: '#ffffff',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
            }}
        >
            <Icon size={11} />
            {title}
        </div>
        {/* Content */}
        <div style={{ padding: '6px 8px' }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: accentColor, fontFamily: 'Tahoma', lineHeight: 1 }}>
                {value}
            </div>
            {(trend || trendValue) && (
                <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                    {trend === 'up' ? (
                        <span style={{ color: '#008000', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <ArrowUpRight size={11} /> {trendValue}
                        </span>
                    ) : (
                        <span style={{ color: '#cc0000', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <ArrowDownRight size={11} /> {trendValue}
                        </span>
                    )}
                </div>
            )}
        </div>
    </div>
);

/* ── Windows 2000 style module quick-access button ── */
const QuickButton = ({ label, icon: Icon, desc, onClick }) => (
    <button
        onClick={onClick}
        style={{
            backgroundColor: '#d4d0c8',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            boxShadow: 'inset 1px 1px 0 #dfdfdf',
            padding: '6px 8px',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'Tahoma, sans-serif',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e8e4dc'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#d4d0c8'; }}
        onMouseDown={e => {
            e.currentTarget.style.borderColor = '#808080 #ffffff #ffffff #808080';
            e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #404040';
        }}
        onMouseUp={e => {
            e.currentTarget.style.borderColor = '#ffffff #808080 #808080 #ffffff';
            e.currentTarget.style.boxShadow = 'inset 1px 1px 0 #dfdfdf';
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
                width: 20, height: 20, backgroundColor: '#000080',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                <Icon size={12} style={{ color: '#ffffff' }} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#000000' }}>{label}</span>
        </div>
        <span style={{ fontSize: '9px', color: '#404040', paddingLeft: '26px' }}>{desc}</span>
    </button>
);

/* ── Win2000 Window Wrapper ── */
const WinWindow = ({ title, children, icon: Icon, style = {} }) => (
    <div
        style={{
            backgroundColor: '#d4d0c8',
            border: '2px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            boxShadow: '1px 1px 0 #000000, inset 1px 1px 0 #dfdfdf',
            ...style,
        }}
    >
        {/* Title bar */}
        <div
            style={{
                background: 'linear-gradient(to right, #000080, #1084d0)',
                color: '#ffffff',
                padding: '3px 6px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {Icon && <Icon size={11} />}
                {title}
            </div>
            {/* Classic window control buttons */}
            <div style={{ display: 'flex', gap: '2px' }}>
                {['_', '□', '✕'].map((ctrl, i) => (
                    <div key={i} style={{
                        width: 14, height: 13, backgroundColor: '#d4d0c8',
                        border: '1px solid', borderColor: '#ffffff #404040 #404040 #ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '9px', fontWeight: 900, color: '#000000', cursor: 'pointer',
                        lineHeight: 1,
                    }}>{ctrl}</div>
                ))}
            </div>
        </div>
        {/* Content */}
        <div style={{ padding: '8px' }}>
            {children}
        </div>
    </div>
);

const CHART_COLORS = ['#000080', '#008080', '#800080', '#808000', '#008000'];

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalSales: 0, totalOrders: 0, lowStock: 0,
        totalProducts: 0, activeWarranties: 0, totalSuppliers: 0,
        recentSales: [], totalProfit: 0, criticalStock: []
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
                const chartData = Object.keys(chartMap).map(date => ({ date, amount: chartMap[date] })).slice(-7);

                setStats({
                    totalSales, totalProfit, totalOrders: sales.length,
                    lowStock: lowStockProducts.length, criticalStock,
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{
                backgroundColor: '#d4d0c8',
                border: '2px solid', borderColor: '#ffffff #808080 #808080 #ffffff',
                boxShadow: '1px 1px 0 #000000',
                padding: '20px 32px', textAlign: 'center'
            }}>
                <div className="win-titlebar" style={{ marginBottom: '12px' }}>
                    <Monitor size={11} /> Loading Unity ERP...
                </div>
                <div style={{ fontSize: '11px', marginBottom: '10px', color: '#000000' }}>
                    Please wait while the system loads your data...
                </div>
                <div className="win-progress-track" style={{ width: '200px', margin: '0 auto' }}>
                    <div className="win-progress-fill" style={{ width: '60%' }} />
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px', fontFamily: 'Tahoma, sans-serif' }}>

            {/* ── Top Bar: Welcome + New Sale ── */}
            <div style={{
                backgroundColor: '#d4d0c8',
                border: '2px solid', borderColor: '#ffffff #808080 #808080 #ffffff',
                boxShadow: '1px 1px 0 #000000, inset 1px 1px 0 #dfdfdf',
                padding: '6px 10px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#000000' }}>
                        Welcome back, <span style={{ color: '#000080' }}>Samarth</span> — Unity Electronics ERP
                    </div>
                    <div style={{ fontSize: '10px', color: '#404040', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-block', width: 6, height: 6, backgroundColor: '#008000', border: '1px solid #004000' }} />
                        System Online
                        <span style={{ color: '#808080' }}>|</span>
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        className="win-btn-primary"
                        onClick={() => navigate('/billing')}
                        style={{ height: '25px', fontSize: '11px' }}
                    >
                        <Plus size={12} />
                        New POS Sale
                    </button>
                    <button
                        className="win-btn"
                        onClick={() => navigate('/products')}
                        style={{ height: '25px', fontSize: '11px' }}
                    >
                        <Package size={12} />
                        Inventory
                    </button>
                </div>
            </div>

            {/* ── Quick Access Modules ── */}
            <WinWindow title="Quick Access" icon={Monitor}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {[
                        { label: 'AI Intelligence', icon: Brain, path: '/ai-insights', desc: 'Forecasts & Insights' },
                        { label: 'Accounting', icon: Calculator, path: '/accounting', desc: 'P&L · GST · Expenses' },
                        { label: 'User & Security', icon: UserCog, path: '/users', desc: 'Roles · Audit Logs' },
                        { label: 'Deep Analytics', icon: BarChart3, path: '/reports', desc: 'Charts · Trends · KPIs' },
                    ].map(item => (
                        <QuickButton
                            key={item.path}
                            label={item.label}
                            icon={item.icon}
                            desc={item.desc}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </div>
            </WinWindow>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                <StatCard title="Total Revenue" value={`₹${stats.totalSales.toLocaleString()}`} icon={DollarSign} trend="up" trendValue="+12.5% vs last month" accentColor="#000080" />
                <StatCard title="Net Profit" value={`₹${stats.totalProfit?.toLocaleString()}`} icon={TrendingUp} trend="up" trendValue="Direct Margin" accentColor="#008000" />
                <StatCard title="Low Stock" value={`${stats.lowStock} Items`} icon={AlertTriangle} trend="down" trendValue="Needs Attention" accentColor="#cc0000" />
                <StatCard title="Inventory" value={stats.totalProducts} icon={Package} trend="up" trendValue="Healthy" accentColor="#000080" />
            </div>

            {/* ── Charts Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>

                {/* Revenue Chart */}
                <WinWindow title="Revenue Analytics - Growth Forecast" icon={Activity}>
                    <div style={{ height: '280px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <defs>
                                    <pattern id="win2kPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                                        <rect width="4" height="4" fill="#c8e4f8" />
                                        <rect x="0" y="0" width="1" height="1" fill="#a0c8e8" />
                                    </pattern>
                                </defs>
                                <CartesianGrid strokeDasharray="2 2" stroke="#c0c0c0" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={{ stroke: '#808080' }}
                                    tickLine={{ stroke: '#808080' }}
                                    tick={{ fill: '#000000', fontSize: 10, fontFamily: 'Tahoma' }}
                                    dy={4}
                                />
                                <YAxis
                                    axisLine={{ stroke: '#808080' }}
                                    tickLine={{ stroke: '#808080' }}
                                    tick={{ fill: '#000000', fontSize: 10, fontFamily: 'Tahoma' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffe1',
                                        border: '1px solid #000000',
                                        borderRadius: 0,
                                        fontFamily: 'Tahoma',
                                        fontSize: '11px',
                                        padding: '4px 8px',
                                        boxShadow: '1px 1px 0 #808080',
                                        color: '#000000',
                                    }}
                                    itemStyle={{ color: '#000080' }}
                                    labelStyle={{ fontWeight: 700, color: '#000000' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#000080"
                                    strokeWidth={2}
                                    fill="url(#win2kPattern)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </WinWindow>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Inventory Pie */}
                    <WinWindow title="Inventory Pulse" icon={HardDrive}>
                        <div style={{ height: '160px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%" cy="50%"
                                        innerRadius={40} outerRadius={65}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="#808080"
                                        strokeWidth={1}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#ffffe1',
                                            border: '1px solid #000000',
                                            borderRadius: 0,
                                            fontFamily: 'Tahoma',
                                            fontSize: '11px',
                                            boxShadow: '1px 1px 0 #808080',
                                        }}
                                    />
                                    <Legend
                                        iconType="square"
                                        iconSize={8}
                                        wrapperStyle={{ fontSize: '10px', fontFamily: 'Tahoma', color: '#000000' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </WinWindow>

                    {/* Critical Stock */}
                    <WinWindow title="Critical Stock Alert" icon={AlertTriangle}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {(stats.criticalStock || []).slice(0, 3).map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '3px 6px',
                                        border: '1px solid', borderColor: '#808080 #ffffff #ffffff #808080',
                                        backgroundColor: '#ffffff',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#000000' }}>{item.product_name}</div>
                                        <div style={{ fontSize: '10px', color: '#cc0000', fontWeight: 700 }}>{item.stock_quantity} left</div>
                                    </div>
                                    <button
                                        className="win-btn"
                                        onClick={() => navigate('/products')}
                                        style={{ height: '20px', padding: '0 8px', fontSize: '10px' }}
                                    >
                                        Order
                                    </button>
                                </div>
                            ))}
                            {stats.criticalStock?.length === 0 && (
                                <div style={{ fontSize: '11px', color: '#008000', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ color: '#008000' }}>✓</span> All stock levels healthy.
                                </div>
                            )}
                        </div>
                    </WinWindow>
                </div>
            </div>

            {/* ── Recent Transactions ── */}
            <WinWindow title="Recent Transactions — Live Order Stream" icon={ShoppingCart}>
                <div style={{
                    border: '2px solid', borderColor: '#808080 #ffffff #ffffff #808080',
                    backgroundColor: '#ffffff', overflow: 'hidden'
                }}>
                    <table className="win-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                        <colgroup>
                            <col style={{ width: '120px' }} />
                            <col style={{ width: '180px' }} />
                            <col style={{ width: '120px' }} />
                            <col style={{ width: '120px' }} />
                            <col style={{ width: '100px' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Invoice #</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(stats.recentSales || []).map((sale) => (
                                <tr key={sale.id}>
                                    <td style={{ fontWeight: 700, color: '#000080', cursor: 'pointer' }}>
                                        #{sale.invoice_number}
                                    </td>
                                    <td>{sale.Customer?.name || 'Guest Customer'}</td>
                                    <td style={{ fontWeight: 700 }}>₹{Number(sale.total_amount).toLocaleString()}</td>
                                    <td style={{ color: '#404040' }}>{new Date(sale.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span style={{
                                            display: 'inline-block',
                                            backgroundColor: '#008000',
                                            color: '#ffffff',
                                            padding: '1px 6px',
                                            fontSize: '10px',
                                            fontWeight: 700,
                                        }}>
                                            VERIFIED
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {stats.recentSales?.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', color: '#808080', padding: '12px' }}>
                                        No recent transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Status bar */}
                <div className="win-statusbar" style={{ marginTop: '4px' }}>
                    <div className="win-statusbar-pane">
                        {stats.recentSales?.length || 0} object(s)
                    </div>
                    <div className="win-statusbar-pane">
                        Total Revenue: ₹{stats.totalSales.toLocaleString()}
                    </div>
                    <div className="win-statusbar-pane" style={{ marginLeft: 'auto' }}>
                        {new Date().toLocaleDateString()}
                    </div>
                </div>
            </WinWindow>

        </div>
    );
};

export default Dashboard;
