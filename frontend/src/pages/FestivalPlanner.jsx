import React, { useState, useEffect } from 'react';
import {
    Sparkles, Calendar, Package, Tag, Plus, Edit2, Trash2,
    Star, TrendingUp, MessageCircle, Download, Bell, CheckCircle,
    ChevronRight, IndianRupee, Clock, X, Zap
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../api/axios';

// ── Festival Data ─────────────────────────────────────────────────────────────
const FESTIVALS_2025 = [
    {
        id: 'diwali',
        name: 'Diwali Festival Sale',
        emoji: '🪔',
        date: '2025-10-20',
        endDate: '2025-10-26',
        theme: 'from-yellow-500 to-orange-500',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        color: 'text-yellow-400',
        defaultDiscount: 18,
        description: 'Biggest shopping season in India. Max footfall expected. Heavy discounts on ACs, TVs & refrigerators.',
        tips: ['Stock up 2x inventory by Oct 10', 'Offer EMI schemes on big items', 'WhatsApp broadcast to all customers', 'Bundle deals: TV + soundbar, AC + stabilizer'],
    },
    {
        id: 'ganesh',
        name: 'Ganesh Chaturthi Offer',
        emoji: '🐘',
        date: '2025-08-27',
        endDate: '2025-09-06',
        theme: 'from-orange-500 to-red-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
        color: 'text-orange-400',
        defaultDiscount: 10,
        description: "Maharashtra's biggest festival. High demand for lighting, sound systems and home appliances.",
        tips: ['Focus on LED lighting & music systems', 'Decorate store with festive theme', 'Offer special pooja edition products', '10-day running sale with escalating discounts'],
    },
    {
        id: 'republic',
        name: 'Republic Day Sale',
        emoji: '🇮🇳',
        date: '2026-01-25',
        endDate: '2026-01-27',
        theme: 'from-blue-600 to-green-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        color: 'text-blue-400',
        defaultDiscount: 26,
        description: '26th January special. Patriotic theme sale. Great for clearing post-year inventory.',
        tips: ['26% OFF on selected items (26 Jan theme)', 'Exchange offers on old appliances', 'Free home delivery for 3 days', 'Highlight Made-in-India products'],
    },
    {
        id: 'navratri',
        name: 'Navratri / Durga Puja',
        emoji: '🪷',
        date: '2025-09-29',
        endDate: '2025-10-08',
        theme: 'from-pink-500 to-purple-500',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        color: 'text-pink-400',
        defaultDiscount: 12,
        description: '9 nights of celebration. Good time for garba setups, lighting, and home electronics.',
        tips: ['Special garba lighting packages', 'Combo deals on music systems', 'Create festive in-store atmosphere', 'WhatsApp broadcast daily offers'],
    },
    {
        id: 'eid',
        name: 'Eid / Summer Sale',
        emoji: '🌙',
        date: '2025-06-06',
        endDate: '2025-06-10',
        theme: 'from-emerald-500 to-teal-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        color: 'text-emerald-400',
        defaultDiscount: 14,
        description: 'Pre-monsoon & Eid. Highest demand for ACs and coolers before summer peaks.',
        tips: ['AC & cooler pre-booking offers', 'Free installation for first 50 customers', '0% EMI on ACs', 'Early bird discount for pre-orders'],
    },
    {
        id: 'holi',
        name: 'Holi / Dhuleti Offer',
        emoji: '🎨',
        date: '2026-03-14',
        endDate: '2026-03-16',
        theme: 'from-purple-500 to-pink-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        color: 'text-purple-400',
        defaultDiscount: 15,
        description: 'Colorful spring festival. People redecorate homes — good for TV, washing machines.',
        tips: ['Washing machine demand spikes post-Holi', 'Color-themed product displays', 'Special weekend deals', 'Announce monsoon readiness products'],
    },
];

const FestivalPlanner = () => {
    const [plans, setPlans]           = useState(() => { try { return JSON.parse(localStorage.getItem('unity_festival_plans') || '[]'); } catch { return []; } });
    const [products, setProducts]     = useState([]);
    const [showModal, setShowModal]   = useState(false);
    const [editFestival, setEditFestival] = useState(null);
    const [planForm, setPlanForm]     = useState({ discount: 10, targetItems: '', budget: '', notes: '', whatsappMsg: '' });
    const [activeTab, setActiveTab]   = useState('upcoming');

    useEffect(() => { api.get('/products').then(r => setProducts(r.data || [])).catch(() => {}); }, []);

    const savePlans = (list) => { setPlans(list); localStorage.setItem('unity_festival_plans', JSON.stringify(list)); };

    const today = new Date();
    const daysTo = (date) => Math.ceil((new Date(date) - today) / (1000 * 60 * 60 * 24));
    const isActive = (f) => new Date(f.date) <= today && today <= new Date(f.endDate);
    const isUpcoming = (f) => new Date(f.date) > today;
    const isPast = (f) => new Date(f.endDate) < today;

    const openPlan = (festival) => {
        setEditFestival(festival);
        const existing = plans.find(p => p.id === festival.id);
        if (existing) setPlanForm({ discount: existing.discount, targetItems: existing.targetItems, budget: existing.budget, notes: existing.notes, whatsappMsg: existing.whatsappMsg || '' });
        else setPlanForm({ discount: festival.defaultDiscount, targetItems: '', budget: '', notes: '', whatsappMsg: '' });
        setShowModal(true);
    };

    const savePlan = () => {
        const updated = plans.filter(p => p.id !== editFestival.id);
        savePlans([...updated, { id: editFestival.id, name: editFestival.name, ...planForm, savedAt: new Date().toISOString() }]);
        setShowModal(false);
    };

    const deletePlan = (id) => savePlans(plans.filter(p => p.id !== id));

    const buildWhatsApp = (festival) => {
        const plan = plans.find(p => p.id === festival.id);
        const disc = plan?.discount || festival.defaultDiscount;
        const msg = `${festival.emoji} *${festival.name.toUpperCase()}*\n━━━━━━━━━━━━━━━━━━━━━━\n🏪 *UNITY ELECTRONICS*\n_Ishwarpur, Sangli_\n\n🎉 *SPECIAL FESTIVAL OFFER!*\n💥 *Flat ${disc}% OFF* on all appliances\n📅 ${festival.date} to ${festival.endDate}\n\n✅ AC, TV, Refrigerator & More!\n✅ Free Home Delivery\n✅ Easy EMI Available\n\n📞 Call: +91 96993 74346\n📍 Visit us at Ishwarpur, Walwa\n\n${plan?.notes ? `\n📝 ${plan.notes}` : ''}\n_Hurry — Limited Period Offer!_`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const exportPDF = (festival) => {
        const plan = plans.find(p => p.id === festival.id);
        const doc = new jsPDF();
        const [cr, cg, cb] = [37, 99, 235];
        doc.setFillColor(cr, cg, cb); doc.rect(0, 0, 210, 42, 'F');
        doc.setTextColor(255); doc.setFontSize(22); doc.setFont('helvetica', 'bold');
        doc.text('UNITY ELECTRONICS', 14, 18);
        doc.setFontSize(12); doc.setFont('helvetica', 'normal');
        doc.text(`${festival.emoji} ${festival.name} — Offer Planning Sheet`, 14, 29);
        doc.setFontSize(9); doc.text(`Period: ${festival.date} to ${festival.endDate}`, 14, 37);

        doc.setTextColor(0);
        doc.setFontSize(11); doc.setFont('helvetica', 'bold');
        doc.text('Festival Strategy', 14, 55);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
        doc.text(festival.description, 14, 63);

        const tips = festival.tips.map((t, i) => [i + 1, t]);
        doc.setFontSize(11); doc.setFont('helvetica', 'bold');
        doc.text('Action Plan', 14, 78);
        autoTable(doc, { head: [['#', 'Action Item']], body: tips, startY: 83, headStyles: { fillColor: [cr, cg, cb] } });

        if (plan) {
            const detailsY = (doc.lastAutoTable?.finalY || 83) + 10;
            doc.setFontSize(11); doc.setFont('helvetica', 'bold');
            doc.text('Your Plan Details', 14, detailsY);
            autoTable(doc, {
                head: [['Field', 'Value']],
                body: [
                    ['Discount Offered', `${plan.discount}%`],
                    ['Budget', `Rs. ${plan.budget || '—'}`],
                    ['Target Products', plan.targetItems || '—'],
                    ['Notes', plan.notes || '—'],
                ],
                startY: detailsY + 5,
                headStyles: { fillColor: [cr, cg, cb] },
            });
        }
        doc.save(`FestivalPlan_${festival.id}.pdf`);
    };

    const tabs = [
        { id: 'upcoming', label: '🔜 Upcoming' },
        { id: 'active',   label: `🔴 Active (${FESTIVALS_2025.filter(isActive).length})` },
        { id: 'all',      label: '📅 All Festivals' },
        { id: 'inventory', label: '📦 Pre-Festival Inventory' },
    ];

    const filteredFestivals = FESTIVALS_2025.filter(f =>
        activeTab === 'all'      ? true :
        activeTab === 'active'   ? isActive(f) :
        activeTab === 'upcoming' ? isUpcoming(f) : true
    );

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Festival <span className="gradient-text">Offer Planner</span></h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">🇮🇳 India Festival Calendar · Offer Strategy · WhatsApp Broadcast</p>
                </div>
                <div className="flex gap-3">
                    <div className="premium-card px-5 py-3 flex items-center gap-3 border-yellow-500/20">
                        <Sparkles className="text-yellow-400" size={18} />
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-yellow-400">Next Festival</p>
                            <p className="font-black text-sm">{FESTIVALS_2025.filter(isUpcoming)[0]?.name} in {daysTo(FESTIVALS_2025.filter(isUpcoming)[0]?.date)} days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Festival Banner */}
            {FESTIVALS_2025.filter(isActive).length > 0 && (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border border-yellow-500/30 p-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent"></div>
                    <div className="relative flex items-center gap-4">
                        <span className="text-4xl">{FESTIVALS_2025.filter(isActive)[0].emoji}</span>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-yellow-400 animate-pulse">🔴 LIVE NOW</p>
                            <h2 className="text-xl font-black">{FESTIVALS_2025.filter(isActive)[0].name}</h2>
                            <p className="text-xs text-slate-400 font-bold mt-1">Running until {FESTIVALS_2025.filter(isActive)[0].endDate}</p>
                        </div>
                        <button onClick={() => buildWhatsApp(FESTIVALS_2025.filter(isActive)[0])}
                            className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm transition-all">
                            <MessageCircle size={16} /> Broadcast Now
                        </button>
                    </div>
                </div>
            )}

            {/* Plan Modal */}
            {showModal && editFestival && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{editFestival.emoji}</span>
                                <h3 className="text-lg font-black">{editFestival.name}</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Discount %</label>
                                <input type="number" value={planForm.discount} onChange={e => setPlanForm(p => ({ ...p, discount: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-black text-primary outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Offer Budget (₹)</label>
                                <input type="number" value={planForm.budget} onChange={e => setPlanForm(p => ({ ...p, budget: e.target.value }))} placeholder="e.g. 50000"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary text-foreground" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Target Products / Categories</label>
                                <input value={planForm.targetItems} onChange={e => setPlanForm(p => ({ ...p, targetItems: e.target.value }))} placeholder="e.g. AC, LED TV, Refrigerator"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary text-foreground" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Strategy Notes</label>
                                <textarea value={planForm.notes} onChange={e => setPlanForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any special strategy or notes..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary text-foreground h-20 resize-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm">Cancel</button>
                            <button onClick={savePlan} className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm">Save Plan</button>
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

            {/* Festival Cards */}
            {activeTab !== 'inventory' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredFestivals.map(festival => {
                        const plan    = plans.find(p => p.id === festival.id);
                        const days    = daysTo(festival.date);
                        const active  = isActive(festival);
                        const past    = isPast(festival);
                        return (
                            <div key={festival.id} className={`premium-card overflow-hidden relative border ${festival.border} ${past ? 'opacity-60' : ''}`}>
                                {active && (
                                    <div className="absolute top-3 right-3">
                                        <span className="text-[9px] bg-emerald-500 text-white px-2.5 py-1 rounded-full font-black animate-pulse">LIVE</span>
                                    </div>
                                )}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${festival.theme}`}></div>

                                {/* Festival Header */}
                                <div className="flex items-start gap-4 mb-4 pt-2">
                                    <span className="text-4xl">{festival.emoji}</span>
                                    <div className="flex-1">
                                        <h3 className="font-black text-base leading-tight">{festival.name}</h3>
                                        <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${festival.color}`}>
                                            {active ? '🔴 ONGOING' : past ? '✓ Past' : `📅 In ${days} days`}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">{festival.date} → {festival.endDate}</p>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 font-bold mb-4 leading-relaxed">{festival.description}</p>

                                {/* Tips */}
                                <div className="space-y-1.5 mb-5">
                                    {festival.tips.slice(0, 3).map(tip => (
                                        <div key={tip} className="flex items-start gap-2">
                                            <Zap size={10} className={`${festival.color} flex-shrink-0 mt-0.5`} />
                                            <span className="text-[10px] font-bold text-slate-400">{tip}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* My Plan Badge */}
                                {plan && (
                                    <div className={`mb-4 p-3 rounded-2xl ${festival.bg} border ${festival.border} flex justify-between items-center`}>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Your Plan</p>
                                            <p className={`text-lg font-black ${festival.color}`}>{plan.discount}% OFF</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-slate-500 font-black uppercase">Budget</p>
                                            <p className="font-black text-sm">₹{Number(plan.budget || 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 flex-wrap">
                                    <button onClick={() => openPlan(festival)}
                                        className={`flex-1 py-2 rounded-xl font-black text-xs transition-all ${festival.bg} ${festival.color} hover:opacity-80`}>
                                        {plan ? '✏ Edit Plan' : '+ Plan Offer'}
                                    </button>
                                    <button onClick={() => buildWhatsApp(festival)}
                                        className="py-2 px-3 rounded-xl font-black text-xs bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 transition-all flex items-center gap-1">
                                        <MessageCircle size={12} /> WhatsApp
                                    </button>
                                    <button onClick={() => exportPDF(festival)}
                                        className="py-2 px-3 rounded-xl font-black text-xs bg-white/5 text-slate-400 hover:bg-white/10 transition-all flex items-center gap-1">
                                        <Download size={12} /> PDF
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {filteredFestivals.length === 0 && (
                        <div className="col-span-3 text-center py-16 text-slate-500">
                            <Calendar className="mx-auto mb-3 opacity-20" size={40} />
                            <p className="font-bold">No festivals in this category right now.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Inventory Planning Tab */}
            {activeTab === 'inventory' && (
                <div className="space-y-6">
                    <div className="premium-card">
                        <h2 className="font-black text-lg mb-2">Pre-Festival Inventory Checklist</h2>
                        <p className="text-xs text-slate-500 font-bold mb-6">Based on upcoming festivals, here's what to stock up on:</p>
                        <div className="space-y-4">
                            {[
                                { festival: 'Diwali 🪔', timing: '3 weeks before', items: ['LED TVs (32"-55")', 'Smart Washing Machines', 'Refrigerators 250L+', 'LED Light Strips', 'Stabilizers'], priority: 'HIGH' },
                                { festival: 'Ganesh Chaturthi 🐘', timing: '2 weeks before', items: ['PA Sound Systems', 'LED Lights & Bulbs', 'Extension Boards', 'Fans & Coolers'], priority: 'HIGH' },
                                { festival: 'Republic Day 🇮🇳', timing: '1 week before', items: ['Smart TVs', 'AC Units (1-1.5T)', 'Old stock clearance items'], priority: 'MEDIUM' },
                                { festival: 'Eid / Summer 🌙', timing: '4 weeks before', items: ['ACs (all tons)', 'Desert Coolers', 'Ceiling Fans', 'Refrigerators'], priority: 'HIGH' },
                            ].map(item => (
                                <div key={item.festival} className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-black text-sm">{item.festival}</h3>
                                            <p className="text-[10px] text-slate-500 font-black uppercase">Stock by: {item.timing}</p>
                                        </div>
                                        <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase ${item.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                            {item.priority} PRIORITY
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {item.items.map(i => (
                                            <span key={i} className="text-[9px] bg-white/5 text-slate-300 px-3 py-1 rounded-full font-black border border-white/10">{i}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock Warning */}
                    {products.filter(p => p.stock_quantity < 10).length > 0 && (
                        <div className="premium-card border border-rose-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <Bell className="text-rose-400" size={20} />
                                <h2 className="font-black text-rose-400">Low Stock Alert — Order Before Festival Season</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {products.filter(p => p.stock_quantity < 10).slice(0, 6).map(p => (
                                    <div key={p.id} className="p-3 bg-rose-500/5 rounded-xl border border-rose-500/20">
                                        <p className="font-black text-xs text-foreground">{p.product_name}</p>
                                        <p className="text-rose-400 font-black text-sm mt-1">{p.stock_quantity} left</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FestivalPlanner;
