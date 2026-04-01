import React, { useState, useEffect } from 'react';
import {
    Wind, Thermometer, WashingMachine, CheckCircle, Plus,
    Bell, Calendar, RefreshCw, Trash2, Edit2, Clock, Star,
    AlertTriangle, IndianRupee, FileText, MessageCircle, X
} from 'lucide-react';

// ── Plan Templates ────────────────────────────────────────────────────────────
const APPLIANCE_PLANS = {
    'AC': {
        icon: Wind,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        plans: [
            { name: 'Basic AMC', price: 1499, services: 2, includes: ['2 Services/Year', 'Gas Refill Check', 'Filter Cleaning', 'Priority Support'], popular: false },
            { name: 'Standard AMC', price: 2499, services: 3, includes: ['3 Services/Year', 'Gas Refill Included', 'PCB Check', 'Free Labour', 'Priority Support'], popular: true },
            { name: 'Premium AMC', price: 3999, services: 4, includes: ['4 Services/Year', 'Gas Refill Included', 'All Parts Discount 20%', 'Emergency Call', '24/7 Support', 'Free Installation'], popular: false },
        ]
    },
    'Refrigerator': {
        icon: Thermometer,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        plans: [
            { name: 'Basic AMC', price: 999, services: 1, includes: ['1 Service/Year', 'Compressor Check', 'Gas Pressure Check', 'Cleaning'], popular: false },
            { name: 'Standard AMC', price: 1799, services: 2, includes: ['2 Services/Year', 'Compressor Warranty', 'Condenser Clean', 'Free Labour', 'Priority Repair'], popular: true },
            { name: 'Premium AMC', price: 2999, services: 3, includes: ['3 Services/Year', 'All Parts Covered', '48-Hr Replacement', 'Emergency Visit', '24/7 Helpline'], popular: false },
        ]
    },
    'Washing Machine': {
        icon: () => (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <rect x="2" y="2" width="20" height="20" rx="3" />
                <circle cx="12" cy="13" r="4" />
                <circle cx="7" cy="6" r="1" fill="currentColor" />
                <circle cx="10" cy="6" r="1" fill="currentColor" />
            </svg>
        ),
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        plans: [
            { name: 'Basic AMC', price: 799, services: 1, includes: ['1 Service/Year', 'Drum Cleaning', 'Filter Service', 'Motor Check'], popular: false },
            { name: 'Standard AMC', price: 1499, services: 2, includes: ['2 Services/Year', 'Belt Replacement', 'PCB Inspection', 'Free Labour', 'Water Inlet Check'], popular: true },
            { name: 'Premium AMC', price: 2499, services: 3, includes: ['3 Services/Year', 'All Parts Covered', 'Motor Warranty', 'Emergency Visit', '24/7 Support'], popular: false },
        ]
    },
};

const AMCModule = () => {
    const [contracts, setContracts] = useState(() => {
        try { return JSON.parse(localStorage.getItem('unity_amc_v2') || '[]'); } catch { return []; }
    });
    const [selectedAppliance, setSelectedAppliance] = useState('AC');
    const [showForm, setShowForm]   = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [form, setForm] = useState({ customer: '', phone: '', model: '', startDate: new Date().toISOString().split('T')[0], notes: '' });
    const [activeTab, setActiveTab] = useState('plans');

    const saveContracts = (list) => { setContracts(list); localStorage.setItem('unity_amc_v2', JSON.stringify(list)); };

    const createContract = () => {
        if (!form.customer || !form.phone || !selectedPlan) return alert('Fill customer, phone and select a plan');
        const start = new Date(form.startDate);
        const end   = new Date(start); end.setFullYear(end.getFullYear() + 1);
        const contract = {
            id: Date.now(),
            contractNo: `AMC-${Date.now().toString().slice(-6)}`,
            appliance: selectedAppliance,
            plan: selectedPlan,
            customer: form.customer,
            phone: form.phone,
            model: form.model,
            notes: form.notes,
            startDate: form.startDate,
            endDate: end.toISOString().split('T')[0],
            servicesUsed: 0,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            autoRenew: true,
        };
        saveContracts([...contracts, contract]);
        setShowForm(false);
        setSelectedPlan(null);
        setForm({ customer: '', phone: '', model: '', startDate: new Date().toISOString().split('T')[0], notes: '' });
    };

    const deleteContract = (id) => saveContracts(contracts.filter(c => c.id !== id));
    const recordService  = (id) => saveContracts(contracts.map(c => c.id === id ? { ...c, servicesUsed: Math.min(c.servicesUsed + 1, c.plan.services) } : c));

    const daysLeft = (endDate) => Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    const expiringSoon = contracts.filter(c => daysLeft(c.endDate) <= 60 && daysLeft(c.endDate) > 0);
    const totalRevenue  = contracts.reduce((s, c) => s + c.plan.price, 0);

    const sendWhatsAppReminder = (contract) => {
        const days = daysLeft(contract.endDate);
        const msg = `*🔧 UNITY ELECTRONICS — AMC Reminder*\n\nDear *${contract.customer}*,\n\nYour *${contract.appliance} AMC (${contract.plan.name})* is expiring in *${days} days* on ${contract.endDate}.\n\n📋 Contract No: ${contract.contractNo}\n🛠 Services Used: ${contract.servicesUsed}/${contract.plan.services}\n\n✅ Renew now to continue enjoying hassle-free service!\n\nCall us: +91 96993 74346\n\n_Unity Electronics, Ishwarpur, Sangli_`;
        window.open(`https://wa.me/91${contract.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const tabs = [
        { id: 'plans',     label: '📦 Subscription Plans' },
        { id: 'contracts', label: '📋 Active Contracts' },
        { id: 'renewals',  label: `🔔 Renewal Due (${expiringSoon.length})` },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">AMC <span className="gradient-text">Management</span></h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Annual Maintenance Contracts · Auto Renewal · Subscriptions</p>
                </div>
                <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 transition-all">
                    <Plus size={16} /> New AMC Contract
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Contracts', value: contracts.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Active', value: contracts.filter(c => c.status === 'ACTIVE').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Renewing Soon', value: expiringSoon.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { label: 'AMC Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map(s => (
                    <div key={s.label} className="premium-card p-5 space-y-3">
                        <p className={`text-2xl font-black tracking-tight ${s.color}`}>{s.value}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${s.color}`}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-2xl mx-4 my-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black">Create AMC Contract</h3>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={18} /></button>
                        </div>

                        {/* Appliance Select */}
                        <div className="mb-5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Select Appliance</label>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.entries(APPLIANCE_PLANS).map(([app, data]) => (
                                    <button key={app} onClick={() => { setSelectedAppliance(app); setSelectedPlan(null); }}
                                        className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${selectedAppliance === app ? `${data.bg} ${data.border} ring-1 ring-inset ${data.color}` : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                                        <span className={selectedAppliance === app ? data.color : ''}>{React.createElement(data.icon, { size: 20 })}</span>
                                        <span className="font-black text-sm">{app}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Plan Select */}
                        <div className="mb-5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Select Plan</label>
                            <div className="grid grid-cols-3 gap-3">
                                {APPLIANCE_PLANS[selectedAppliance].plans.map(plan => (
                                    <button key={plan.name} onClick={() => setSelectedPlan(plan)}
                                        className={`p-4 rounded-2xl border text-left transition-all relative ${selectedPlan?.name === plan.name ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                        {plan.popular && <span className="absolute -top-2 left-3 text-[8px] bg-primary text-white px-2 py-0.5 rounded-full font-black uppercase">Popular</span>}
                                        <p className="font-black text-sm">{plan.name}</p>
                                        <p className="text-xl font-black text-primary mt-1">₹{plan.price.toLocaleString()}<span className="text-[10px] text-slate-500 font-bold">/yr</span></p>
                                        <p className="text-[10px] text-slate-500 mt-1">{plan.services} visits included</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            {[
                                { key: 'customer', label: 'Customer Name', ph: 'e.g. Rahul Patil', span: 1 },
                                { key: 'phone', label: 'Phone (WhatsApp)', ph: '9XXXXXXXXX', span: 1 },
                                { key: 'model', label: 'Product Model', ph: 'e.g. Voltas 1.5T 3Star', span: 1 },
                                { key: 'startDate', label: 'Start Date', type: 'date', span: 1 },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">{f.label}</label>
                                    <input type={f.type || 'text'} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-primary text-foreground" />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm">Cancel</button>
                            <button onClick={createContract} className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm transition-all">
                                Create Contract
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Plans Tab */}
            {activeTab === 'plans' && (
                <div className="space-y-8">
                    {Object.entries(APPLIANCE_PLANS).map(([appliance, data]) => (
                        <div key={appliance}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`h-10 w-10 rounded-2xl ${data.bg} flex items-center justify-center`}>
                                    <span className={data.color}>{React.createElement(data.icon, { size: 20 })}</span>
                                </div>
                                <div>
                                    <h2 className="font-black text-lg">{appliance} AMC Plans</h2>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Annual Subscription</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {data.plans.map(plan => (
                                    <div key={plan.name} className={`premium-card relative transition-all ${plan.popular ? `border ${data.border} shadow-lg` : ''}`}>
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                <span className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest ${data.bg} ${data.color} border ${data.border}`}>⭐ Most Popular</span>
                                            </div>
                                        )}
                                        <h3 className="font-black text-base mt-2">{appliance} – {plan.name}</h3>
                                        <div className="flex items-end gap-1 mt-3 mb-4">
                                            <span className="text-3xl font-black tracking-tight">₹{plan.price.toLocaleString()}</span>
                                            <span className="text-sm text-slate-500 font-bold pb-1">/year</span>
                                        </div>
                                        <div className="space-y-2 mb-5">
                                            {plan.includes.map(feature => (
                                                <div key={feature} className="flex items-center gap-2">
                                                    <CheckCircle size={13} className={data.color} />
                                                    <span className="text-xs font-bold text-slate-300">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => { setSelectedAppliance(appliance); setSelectedPlan(plan); setShowForm(true); }}
                                            className={`w-full py-2.5 rounded-xl font-black text-sm transition-all ${plan.popular ? `${data.bg} ${data.color} hover:opacity-90` : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                                            Subscribe Now →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Contracts Tab */}
            {activeTab === 'contracts' && (
                <div className="premium-card overflow-hidden p-0">
                    <div className="p-6 border-b border-white/5"><h2 className="font-black text-lg">All AMC Contracts</h2></div>
                    <div className="divide-y divide-white/5">
                        {contracts.map(c => {
                            const data = APPLIANCE_PLANS[c.appliance];
                            const days = daysLeft(c.endDate);
                            return (
                                <div key={c.id} className="p-5 hover:bg-white/5 transition-colors">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex items-start gap-4">
                                            <div className={`h-12 w-12 rounded-2xl ${data?.bg} flex items-center justify-center flex-shrink-0`}>
                                                <span className={data?.color}>{React.createElement(data?.icon || Wind, { size: 20 })}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded-full font-black">{c.contractNo}</span>
                                                    <span className={`text-[9px] px-2 py-1 rounded-full font-black uppercase ${days > 60 ? 'bg-emerald-500/10 text-emerald-400' : days > 0 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                        {days > 0 ? `${days} days left` : 'EXPIRED'}
                                                    </span>
                                                    {c.autoRenew && <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full font-black">Auto-Renew ON</span>}
                                                </div>
                                                <p className="font-black text-sm">{c.customer} — {c.appliance}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{c.plan.name} · ₹{c.plan.price.toLocaleString()}/yr · Model: {c.model || '—'}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{c.startDate} → {c.endDate}</p>
                                                {/* Service progress bar */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[9px] text-slate-500 font-black">{c.servicesUsed}/{c.plan.services} Services Used</span>
                                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[100px]">
                                                        <div className="h-full bg-primary rounded-full" style={{ width: `${(c.servicesUsed / c.plan.services) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <button onClick={() => recordService(c.id)} disabled={c.servicesUsed >= c.plan.services}
                                                className="text-[10px] px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl font-black transition-all hover:bg-emerald-500/20 disabled:opacity-40">
                                                ✓ Record Service
                                            </button>
                                            <button onClick={() => sendWhatsAppReminder(c)}
                                                className="text-[10px] px-3 py-1.5 bg-emerald-600/10 text-emerald-400 rounded-xl font-black transition-all hover:bg-emerald-600/20 flex items-center gap-1">
                                                <MessageCircle size={11} /> Remind
                                            </button>
                                            <button onClick={() => deleteContract(c.id)} className="text-[10px] px-3 py-1.5 bg-rose-500/10 text-rose-400 rounded-xl font-black transition-all hover:bg-rose-500/20">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {contracts.length === 0 && (
                            <div className="text-center py-16 text-slate-500">
                                <FileText className="mx-auto mb-3 opacity-20" size={40} />
                                <p className="font-bold">No AMC contracts yet. Click "New AMC Contract" to add one.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Renewals Tab */}
            {activeTab === 'renewals' && (
                <div className="space-y-4">
                    {expiringSoon.length === 0 ? (
                        <div className="premium-card text-center py-16">
                            <CheckCircle className="mx-auto mb-4 text-emerald-400" size={48} />
                            <p className="font-black text-emerald-400">No renewals due in the next 60 days!</p>
                        </div>
                    ) : (
                        <>
                            <div className="premium-card bg-yellow-500/5 border border-yellow-500/20 flex items-center gap-4 p-5">
                                <Bell className="text-yellow-400 flex-shrink-0" size={24} />
                                <div>
                                    <p className="font-black text-yellow-400">{expiringSoon.length} contract(s) expiring within 60 days</p>
                                    <p className="text-xs text-slate-500 font-bold">Send WhatsApp reminders to prevent churn</p>
                                </div>
                            </div>
                            {expiringSoon.map(c => {
                                const days = daysLeft(c.endDate);
                                const data = APPLIANCE_PLANS[c.appliance];
                                return (
                                    <div key={c.id} className="premium-card flex items-center justify-between gap-4 flex-wrap">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl ${data?.bg} flex items-center justify-center`}>
                                                <span className={data?.color}>{React.createElement(data?.icon || Wind, { size: 20 })}</span>
                                            </div>
                                            <div>
                                                <p className="font-black text-sm">{c.customer} — {c.appliance}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{c.contractNo} · {c.plan.name} · ₹{c.plan.price.toLocaleString()}</p>
                                                <p className={`text-[10px] font-black mt-1 ${days <= 30 ? 'text-rose-400' : 'text-yellow-400'}`}>⏰ Expires in {days} days — {c.endDate}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => sendWhatsAppReminder(c)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm transition-all">
                                            <MessageCircle size={16} /> Send Reminder
                                        </button>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AMCModule;
