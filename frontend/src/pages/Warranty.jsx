import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Shield, CheckCircle, Clock, AlertTriangle, Search, Plus, Wrench, FileText, Star, QrCode } from 'lucide-react';
import Input from '../components/ui/Input';

const statusColors = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    EXPIRED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    CLAIMED: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    VOID: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const Warranty = () => {
    const [warranties, setWarranties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [activeTab, setActiveTab] = useState('warranties');
    const [serviceTickets, setServiceTickets] = useState(() => {
        try { return JSON.parse(localStorage.getItem('unity_service_tickets') || '[]'); } catch { return []; }
    });
    const [amcContracts, setAmcContracts] = useState(() => {
        try { return JSON.parse(localStorage.getItem('unity_amc') || '[]'); } catch { return []; }
    });
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [showAmcForm, setShowAmcForm] = useState(false);
    const [newTicket, setNewTicket] = useState({ customer: '', product: '', issue: '', technician: '', priority: 'Medium', status: 'Open' });
    const [newAmc, setNewAmc] = useState({ customer: '', product: '', startDate: new Date().toISOString().split('T')[0], endDate: '', amount: '', notes: '' });

    useEffect(() => {
        api.get('/warranties').then(r => setWarranties(r.data || [])).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const saveTickets = (list) => { setServiceTickets(list); localStorage.setItem('unity_service_tickets', JSON.stringify(list)); };
    const saveAmc = (list) => { setAmcContracts(list); localStorage.setItem('unity_amc', JSON.stringify(list)); };

    const addTicket = () => {
        if (!newTicket.customer || !newTicket.issue) return alert('Fill customer and issue');
        saveTickets([...serviceTickets, { ...newTicket, id: Date.now(), createdAt: new Date().toISOString(), ticketNo: `SRV-${Date.now().toString().slice(-5)}` }]);
        setNewTicket({ customer: '', product: '', issue: '', technician: '', priority: 'Medium', status: 'Open' });
        setShowTicketForm(false);
    };

    const addAmc = () => {
        if (!newAmc.customer || !newAmc.product) return alert('Fill customer and product');
        saveAmc([...amcContracts, { ...newAmc, id: Date.now(), amcNo: `AMC-${Date.now().toString().slice(-5)}` }]);
        setNewAmc({ customer: '', product: '', startDate: new Date().toISOString().split('T')[0], endDate: '', amount: '', notes: '' });
        setShowAmcForm(false);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/warranties/${id}`, { status: newStatus });
            setWarranties(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
        } catch { alert('Failed to update'); }
    };

    const daysRemaining = (endDate) => Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));

    const filtered = warranties.filter(w => {
        const name = w.Customer?.name?.toLowerCase() || '';
        const serial = w.SerialNumber?.serial_code?.toLowerCase() || '';
        const matchSearch = name.includes(searchTerm.toLowerCase()) || serial.includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'ALL' || w.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const stats = {
        active: warranties.filter(w => w.status === 'ACTIVE').length,
        expired: warranties.filter(w => w.status === 'EXPIRED').length,
        expiringSoon: warranties.filter(w => w.status === 'ACTIVE' && daysRemaining(w.end_date) <= 30).length,
        total: warranties.length,
        openTickets: serviceTickets.filter(t => t.status === 'Open').length,
        activeAmc: amcContracts.length,
    };

    const tabs = [
        { id: 'warranties', label: '🛡️ Warranties' },
        { id: 'service', label: '🔧 Service Tickets' },
        { id: 'amc', label: '📋 AMC Contracts' },
    ];

    if (loading) return <div className="flex h-60 items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div></div>;

    return (
        <div className="space-y-8 pb-10 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Warranty <span className="gradient-text">&amp; Service</span></h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Digital Warranty · Service Tickets · AMC</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowTicketForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20">
                        <Plus size={16} /> New Ticket
                    </button>
                    <button onClick={() => setShowAmcForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl font-black text-sm border border-emerald-500/20">
                        <FileText size={16} /> New AMC
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                    { label: 'Total', value: stats.total, icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Active', value: stats.active, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Expiring Soon', value: stats.expiringSoon, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { label: 'Expired', value: stats.expired, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                    { label: 'Open Tickets', value: stats.openTickets, icon: Wrench, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'AMC Active', value: stats.activeAmc, icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                ].map(s => (
                    <div key={s.label} className="premium-card p-4 space-y-2">
                        <div className={`h-8 w-8 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon size={15} className={s.color} /></div>
                        <p className="text-xl font-black">{s.value}</p>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${s.color}`}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {showTicketForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl">
                        <h3 className="text-xl font-black mb-6">New Service Ticket</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[{ key: 'customer', label: 'Customer Name', ph: 'e.g. Rahul Patil' }, { key: 'product', label: 'Product', ph: 'e.g. LG Washing Machine' }, { key: 'technician', label: 'Technician', ph: 'e.g. Vijay' }].map(f => (
                                <div key={f.key}>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">{f.label}</label>
                                    <input value={newTicket[f.key]} onChange={e => setNewTicket(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-primary text-foreground" />
                                </div>
                            ))}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Priority</label>
                                <select value={newTicket.priority} onChange={e => setNewTicket(p => ({ ...p, priority: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-primary text-foreground">
                                    {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Issue Description</label>
                            <textarea value={newTicket.issue} onChange={e => setNewTicket(p => ({ ...p, issue: e.target.value }))} placeholder="Describe the problem..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-primary text-foreground h-20 resize-none" />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowTicketForm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm">Cancel</button>
                            <button onClick={addTicket} className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm">Create Ticket</button>
                        </div>
                    </div>
                </div>
            )}

            {showAmcForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl">
                        <h3 className="text-xl font-black mb-6">New AMC Contract</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[{ key: 'customer', label: 'Customer', ph: 'Customer name' }, { key: 'product', label: 'Product', ph: 'Product/Model' }, { key: 'startDate', label: 'Start Date', type: 'date' }, { key: 'endDate', label: 'End Date', type: 'date' }, { key: 'amount', label: 'AMC Amount (₹)', ph: '5000', type: 'number' }].map(f => (
                                <div key={f.key}>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">{f.label}</label>
                                    <input type={f.type || 'text'} value={newAmc[f.key]} onChange={e => setNewAmc(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-primary text-foreground" />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowAmcForm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm">Cancel</button>
                            <button onClick={addAmc} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm">Create AMC</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Warranties Tab */}
            {activeTab === 'warranties' && (
                <div className="space-y-4">
                    <div className="flex gap-4 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                            <Input placeholder="Search by customer or serial..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} icon={Search} />
                        </div>
                        <div className="flex gap-2">
                            {['ALL', 'ACTIVE', 'EXPIRED', 'CLAIMED'].map(status => (
                                <button key={status} onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${filterStatus === status ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="premium-card overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>{['Customer', 'Product', 'Serial No.', 'Start', 'End', 'Days Left', 'Status', 'Action'].map(h => <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.length === 0 && (
                                        <tr><td colSpan={8} className="text-center py-16 text-slate-500">
                                            <Shield className="mx-auto mb-3 opacity-20" size={40} />
                                            <p className="font-bold">No warranties found.</p>
                                        </td></tr>
                                    )}
                                    {filtered.map(w => {
                                        const days = daysRemaining(w.end_date);
                                        return (
                                            <tr key={w.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-5 py-4 font-black text-sm">{w.Customer?.name || '—'}</td>
                                                <td className="px-5 py-4 text-slate-400 font-bold text-xs">{w.SaleItem?.Product?.product_name || '—'}</td>
                                                <td className="px-5 py-4 font-mono text-xs text-primary">{w.SerialNumber?.serial_code || '—'}</td>
                                                <td className="px-5 py-4 text-slate-400 text-xs font-bold">{new Date(w.start_date).toLocaleDateString()}</td>
                                                <td className="px-5 py-4 text-slate-400 text-xs font-bold">{new Date(w.end_date).toLocaleDateString()}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`font-black text-sm ${days > 30 ? 'text-emerald-400' : days > 0 ? 'text-yellow-400' : 'text-rose-400'}`}>
                                                        {days > 0 ? `${days}d` : 'Expired'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${statusColors[w.status]}`}>
                                                        {w.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <select value={w.status} onChange={e => handleStatusUpdate(w.id, e.target.value)}
                                                        className="text-xs bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-foreground outline-none focus:border-primary">
                                                        {['ACTIVE', 'CLAIMED', 'EXPIRED', 'VOID'].map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Tickets Tab */}
            {activeTab === 'service' && (
                <div className="premium-card overflow-hidden p-0">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-black text-lg">Service Request Tickets</h2>
                        <div className="flex gap-3 text-xs">
                            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-black">Open: {serviceTickets.filter(t => t.status === 'Open').length}</span>
                            <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full font-black">In Progress: {serviceTickets.filter(t => t.status === 'In Progress').length}</span>
                        </div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {serviceTickets.map(t => (
                            <div key={t.id} className="p-5 hover:bg-white/5 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded-full font-black">{t.ticketNo}</span>
                                            <span className={`text-[9px] px-2 py-1 rounded-full font-black uppercase ${t.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400' : t.priority === 'High' ? 'bg-orange-500/10 text-orange-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                {t.priority}
                                            </span>
                                            <span className={`text-[9px] px-2 py-1 rounded-full font-black uppercase ${t.status === 'Open' ? 'bg-blue-500/10 text-blue-400' : t.status === 'Closed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                {t.status}
                                            </span>
                                        </div>
                                        <p className="font-black text-sm">{t.customer} — {t.product}</p>
                                        <p className="text-xs text-slate-500 font-bold mt-1">{t.issue}</p>
                                        <p className="text-[10px] text-primary font-black mt-1">Technician: {t.technician || 'Unassigned'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {['Open', 'In Progress', 'Closed'].map(s => (
                                            <button key={s} onClick={() => saveTickets(serviceTickets.map(x => x.id === t.id ? { ...x, status: s } : x))}
                                                className={`text-[9px] px-2 py-1 rounded-lg font-black transition-all ${t.status === s ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {serviceTickets.length === 0 && <div className="text-center py-16 text-slate-500 font-bold"><Wrench className="mx-auto mb-3 opacity-20" size={40} /><p>No service tickets yet. Click "New Ticket" to create one.</p></div>}
                    </div>
                </div>
            )}

            {/* AMC Tab */}
            {activeTab === 'amc' && (
                <div className="premium-card overflow-hidden p-0">
                    <div className="p-6 border-b border-white/5"><h2 className="font-black text-lg">Annual Maintenance Contracts</h2></div>
                    <div className="divide-y divide-white/5">
                        {amcContracts.map(a => {
                            const days = a.endDate ? daysRemaining(a.endDate) : null;
                            return (
                                <div key={a.id} className="p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full font-black">{a.amcNo}</span>
                                        </div>
                                        <p className="font-black text-sm">{a.customer}</p>
                                        <p className="text-xs text-slate-500 font-bold">{a.product}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-primary">₹{Number(a.amount || 0).toLocaleString()}/yr</p>
                                        <p className="text-[10px] text-slate-500 font-bold">{a.startDate} → {a.endDate || 'Ongoing'}</p>
                                        {days !== null && <p className={`text-[10px] font-black ${days > 90 ? 'text-emerald-400' : days > 0 ? 'text-yellow-400' : 'text-rose-400'}`}>{days > 0 ? `${days} days left` : 'Expired'}</p>}
                                    </div>
                                </div>
                            );
                        })}
                        {amcContracts.length === 0 && <div className="text-center py-16 text-slate-500 font-bold"><FileText className="mx-auto mb-3 opacity-20" size={40} /><p>No AMC contracts yet. Click "New AMC" to add one.</p></div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Warranty;
