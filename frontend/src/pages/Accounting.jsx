import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    DollarSign, TrendingUp, TrendingDown, PiggyBank, Receipt,
    Plus, Trash2, Download, Calendar, Filter, CheckCircle, AlertTriangle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CATEGORIES = ['Rent', 'Electricity', 'Salaries', 'Marketing', 'Transport', 'Maintenance', 'Other'];

const Accounting = () => {
    const [sales, setSales] = useState([]);
    const [expenses, setExpenses] = useState(() => {
        try { return JSON.parse(localStorage.getItem('unity_expenses') || '[]'); } catch { return []; }
    });
    const [activeTab, setActiveTab] = useState('overview');
    const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Rent', date: new Date().toISOString().split('T')[0], notes: '' });
    const [filterMonth, setFilterMonth] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/sales').then(r => { setSales(r.data || []); }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const saveExpenses = (list) => { setExpenses(list); localStorage.setItem('unity_expenses', JSON.stringify(list)); };
    const addExpense = () => {
        if (!newExpense.title || !newExpense.amount) return alert('Fill title and amount');
        const updated = [...expenses, { ...newExpense, id: Date.now(), amount: Number(newExpense.amount) }];
        saveExpenses(updated);
        setNewExpense({ title: '', amount: '', category: 'Rent', date: new Date().toISOString().split('T')[0], notes: '' });
    };
    const deleteExpense = (id) => saveExpenses(expenses.filter(e => e.id !== id));

    const totalRevenue = sales.reduce((s, x) => s + Number(x.total_amount), 0);
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const netProfit = totalRevenue - totalExpenses;
    const gstCollected = sales.reduce((s, x) => s + (Number(x.total_amount) * 0.15), 0);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((m, i) => {
        const rev = sales.filter(s => new Date(s.createdAt).getMonth() === i).reduce((s, x) => s + Number(x.total_amount), 0);
        const exp = expenses.filter(e => new Date(e.date).getMonth() === i).reduce((s, x) => s + Number(x.amount), 0);
        return { month: m, revenue: rev, expenses: exp, profit: rev - exp };
    });

    const expenseByCat = CATEGORIES.map(cat => ({
        cat, total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0)
    })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

    const exportPL = () => {
        const doc = new jsPDF();
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFIT & LOSS REPORT', 15, 22);
        doc.setFontSize(9);
        doc.text(`Unity Electronics | Generated: ${new Date().toLocaleDateString()}`, 15, 33);
        doc.setTextColor(0);
        doc.setFontSize(11);
        doc.text(`Total Revenue: Rs. ${totalRevenue.toLocaleString()}`, 14, 55);
        doc.text(`Total Expenses: Rs. ${totalExpenses.toLocaleString()}`, 14, 62);
        doc.text(`Net Profit: Rs. ${netProfit.toLocaleString()}`, 14, 69);
        doc.text(`GST Collected: Rs. ${gstCollected.toFixed(2)}`, 14, 76);
        autoTable(doc, {
            head: [['Month', 'Revenue', 'Expenses', 'Net Profit']],
            body: monthlyData.filter(m => m.revenue || m.expenses).map(m => [m.month, `Rs.${m.revenue.toLocaleString()}`, `Rs.${m.expenses.toLocaleString()}`, `Rs.${m.profit.toLocaleString()}`]),
            startY: 90, headStyles: { fillColor: [37, 99, 235] }
        });
        doc.save('ProfitLoss_Report.pdf');
    };

    const gstr1Data = sales.map(s => ({ invoice: s.invoice_number, date: new Date(s.createdAt).toLocaleDateString(), amount: Number(s.total_amount), gst: (Number(s.total_amount) * 0.15).toFixed(2) }));
    const exportGSTR1 = () => {
        const doc = new jsPDF();
        doc.text('GSTR-1 Report — Unity Electronics', 14, 20);
        doc.text(`Period: ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`, 14, 28);
        autoTable(doc, {
            head: [['Invoice #', 'Date', 'Taxable Amount', 'GST @15%', 'Total']],
            body: gstr1Data.map(r => [r.invoice, r.date, `Rs.${r.amount.toLocaleString()}`, `Rs.${r.gst}`, `Rs.${(r.amount + Number(r.gst)).toLocaleString()}`]),
            startY: 38, headStyles: { fillColor: [37, 99, 235] }
        });
        doc.save('GSTR1_Report.pdf');
    };

    const tabs = [
        { id: 'overview', label: '📊 P&L Overview' },
        { id: 'expenses', label: '💸 Expense Tracker' },
        { id: 'gst', label: '🧾 GST Reports' },
        { id: 'cashbook', label: '📒 Cash Register' },
    ];

    if (loading) return <div className="flex h-60 items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>;

    return (
        <div className="space-y-8 pb-10 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Accounting <span className="gradient-text">&amp; Finance</span></h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">GST Compliance · P&L · Expense Control</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={exportPL} className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-2xl font-black text-sm border border-primary/20 transition-all">
                        <Download size={16} /> P&L PDF
                    </button>
                    <button onClick={exportGSTR1} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl font-black text-sm border border-emerald-500/20 transition-all">
                        <Download size={16} /> GSTR-1
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Total Expenses', value: `₹${(totalExpenses / 1000).toFixed(1)}K`, icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                    { label: 'Net Profit', value: `₹${(netProfit / 1000).toFixed(1)}K`, icon: PiggyBank, color: netProfit >= 0 ? 'text-blue-400' : 'text-rose-400', bg: 'bg-blue-500/10' },
                    { label: 'GST Collected', value: `₹${(gstCollected / 1000).toFixed(1)}K`, icon: Receipt, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map(card => (
                    <div key={card.label} className="premium-card p-5 space-y-3">
                        <div className={`h-10 w-10 rounded-2xl ${card.bg} flex items-center justify-center`}>
                            <card.icon size={20} className={card.color} />
                        </div>
                        <p className="text-2xl font-black tracking-tight text-foreground">{card.value}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* P&L Overview */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="premium-card overflow-hidden p-0">
                        <div className="p-6 border-b border-white/5"><h2 className="font-black text-lg">Monthly Profit & Loss</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>{['Month', 'Revenue', 'Expenses', 'Net Profit', 'Status'].map(h => <th key={h} className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {monthlyData.filter(m => m.revenue || m.expenses).map(m => (
                                        <tr key={m.month} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-black">{m.month}</td>
                                            <td className="px-6 py-4 font-bold text-emerald-400">₹{m.revenue.toLocaleString()}</td>
                                            <td className="px-6 py-4 font-bold text-rose-400">₹{m.expenses.toLocaleString()}</td>
                                            <td className={`px-6 py-4 font-black ${m.profit >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>₹{m.profit.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[9px] px-2.5 py-1 rounded-full font-black ${m.profit >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                    {m.profit >= 0 ? '✓ Profit' : '✗ Loss'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {monthlyData.every(m => !m.revenue && !m.expenses) && (
                                        <tr><td colSpan={5} className="text-center py-12 text-slate-500 font-bold">No data yet. Add sales and expenses to see reports.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {expenseByCat.length > 0 && (
                        <div className="premium-card">
                            <h2 className="font-black text-lg mb-6">Expense Breakdown by Category</h2>
                            <div className="space-y-3">
                                {expenseByCat.map(c => (
                                    <div key={c.cat} className="flex items-center gap-4">
                                        <span className="w-24 text-xs font-black text-slate-400 uppercase">{c.cat}</span>
                                        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full" style={{ width: `${Math.min(100, (c.total / totalExpenses * 100))}%` }}></div>
                                        </div>
                                        <span className="text-sm font-black text-foreground w-24 text-right">₹{c.total.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Expense Tracker */}
            {activeTab === 'expenses' && (
                <div className="space-y-6">
                    <div className="premium-card">
                        <h2 className="font-black text-lg mb-6">Add New Expense</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <input value={newExpense.title} onChange={e => setNewExpense(p => ({ ...p, title: e.target.value }))} placeholder="Expense Title" className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-primary text-foreground" />
                            <input type="number" value={newExpense.amount} onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))} placeholder="Amount (₹)" className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-primary text-foreground" />
                            <select value={newExpense.category} onChange={e => setNewExpense(p => ({ ...p, category: e.target.value }))} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-primary text-foreground">
                                {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                            </select>
                            <input type="date" value={newExpense.date} onChange={e => setNewExpense(p => ({ ...p, date: e.target.value }))} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-primary text-foreground" />
                            <button onClick={addExpense} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-2xl py-3 font-black text-sm transition-all">
                                <Plus size={16} /> Add
                            </button>
                        </div>
                    </div>
                    <div className="premium-card overflow-hidden p-0">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="font-black text-lg">Expense Log</h2>
                            <span className="text-sm font-black text-rose-400">Total: ₹{totalExpenses.toLocaleString()}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>{['Title', 'Category', 'Amount', 'Date', ''].map(h => <th key={h} className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {expenses.map(e => (
                                        <tr key={e.id} className="hover:bg-white/5">
                                            <td className="px-6 py-4 font-bold">{e.title}</td>
                                            <td className="px-6 py-4"><span className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded-full font-black uppercase">{e.category}</span></td>
                                            <td className="px-6 py-4 font-black text-rose-400">₹{Number(e.amount).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-slate-400 font-bold">{e.date}</td>
                                            <td className="px-6 py-4"><button onClick={() => deleteExpense(e.id)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition-all"><Trash2 size={14} /></button></td>
                                        </tr>
                                    ))}
                                    {expenses.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-slate-500 font-bold">No expenses tracked yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* GST Reports */}
            {activeTab === 'gst' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'GSTR-1 (Sales)', value: `₹${gstCollected.toFixed(0)}`, desc: 'Total GST collected on outward supplies', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                            { label: 'GSTR-3B (Filing)', value: `₹${(gstCollected * 0.9).toFixed(0)}`, desc: 'Estimated net tax liability after ITC', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { label: 'Next Filing Date', value: '20th Month', desc: 'Monthly GSTR-3B due date', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                        ].map(c => (
                            <div key={c.label} className="premium-card space-y-2">
                                <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase ${c.bg} ${c.color}`}>{c.label}</span>
                                <p className="text-2xl font-black tracking-tight">{c.value}</p>
                                <p className="text-xs text-slate-500 font-bold">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="premium-card overflow-hidden p-0">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="font-black text-lg">GSTR-1 Invoice Register</h2>
                            <button onClick={exportGSTR1} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-xs border border-primary/20 transition-all hover:bg-primary/20">
                                <Download size={14} /> Export
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>{['Invoice #', 'Date', 'Taxable Amt', 'CGST', 'SGST', 'Total'].map(h => <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase text-slate-400">{h}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {gstr1Data.slice(0, 10).map((r, i) => (
                                        <tr key={i} className="hover:bg-white/5">
                                            <td className="px-5 py-3 font-black text-primary">#{r.invoice}</td>
                                            <td className="px-5 py-3 text-slate-400">{r.date}</td>
                                            <td className="px-5 py-3 font-bold">₹{r.amount.toLocaleString()}</td>
                                            <td className="px-5 py-3 font-bold text-purple-400">₹{(Number(r.gst) / 2).toFixed(2)}</td>
                                            <td className="px-5 py-3 font-bold text-purple-400">₹{(Number(r.gst) / 2).toFixed(2)}</td>
                                            <td className="px-5 py-3 font-black text-emerald-400">₹{(r.amount + Number(r.gst)).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {gstr1Data.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-slate-500 font-bold">No sales data available.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Cash Register */}
            {activeTab === 'cashbook' && (
                <div className="space-y-6">
                    <div className="premium-card">
                        <h2 className="font-black text-lg mb-2">Daily Cash Register</h2>
                        <p className="text-xs text-slate-500 font-bold mb-6">Today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "Today's Sales", value: `₹${sales.filter(s => new Date(s.createdAt).toDateString() === new Date().toDateString()).reduce((s, x) => s + Number(x.total_amount), 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                { label: "Today's Expenses", value: `₹${expenses.filter(e => e.date === new Date().toISOString().split('T')[0]).reduce((s, e) => s + e.amount, 0).toLocaleString()}`, icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                                { label: "Cash on Hand (Est.)", value: `₹${Math.max(0, sales.filter(s => s.payment_method === 'cash' && new Date(s.createdAt).toDateString() === new Date().toDateString()).reduce((s, x) => s + Number(x.total_amount), 0)).toLocaleString()}`, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            ].map(c => (
                                <div key={c.label} className={`p-5 rounded-2xl ${c.bg} border border-white/5 flex items-center gap-4`}>
                                    <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center`}>
                                        <c.icon size={22} className={c.color} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{c.label}</p>
                                        <p className={`text-xl font-black mt-1 ${c.color}`}>{c.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="premium-card overflow-hidden p-0">
                        <div className="p-6 border-b border-white/5"><h2 className="font-black text-lg">Recent Cash Transactions</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>{['Invoice', 'Date', 'Method', 'Amount'].map(h => <th key={h} className="px-6 py-3 text-left text-[10px] font-black uppercase text-slate-400">{h}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {sales.slice(0, 10).map(s => (
                                        <tr key={s.id} className="hover:bg-white/5">
                                            <td className="px-6 py-4 font-black text-primary">#{s.invoice_number}</td>
                                            <td className="px-6 py-4 text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4"><span className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded-full font-black uppercase">{s.payment_method || 'cash'}</span></td>
                                            <td className="px-6 py-4 font-black text-emerald-400">₹{Number(s.total_amount).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {sales.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-slate-500 font-bold">No transactions yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounting;
