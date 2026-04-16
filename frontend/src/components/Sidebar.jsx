import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Package, Users, FileText, Settings,
    LogOut, Shield, Truck, MapPin, TrendingUp, Calculator, UserCog,
    Brain, ChevronDown, ChevronRight, Wrench, Wind, Sparkles,
    MessageCircle, Star, BarChart3, ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BASE_NAV_GROUPS = [
    {
        label: '⚡ Core Operations',
        items: [
            { path: '/admin',           label: 'Dashboard',   icon: LayoutDashboard, color: 'text-blue-400', roles: ['admin', 'user'] },
            { path: '/admin/billing',    label: 'POS / Billing', icon: ShoppingCart,  color: 'text-emerald-400', roles: ['admin', 'user'] },
            { path: '/admin/products',   label: 'Inventory',   icon: Package,         color: 'text-violet-400', roles: ['admin', 'user'] },
            { path: '/admin/orders',     label: 'Orders',      icon: ClipboardList,   color: 'text-orange-400', roles: ['admin', 'user'] },
            { path: '/admin/customers',  label: 'Customers',   icon: Users,           color: 'text-pink-400', roles: ['admin', 'user'] },
            { path: '/admin/suppliers',  label: 'Suppliers',   icon: Truck,           color: 'text-cyan-400', roles: ['admin'] },
        ],
    },
    {
        label: '🔧 Service & Warranty',
        items: [
            { path: '/admin/warranty',   label: 'Warranty',    icon: Shield,          color: 'text-rose-400', roles: ['admin', 'user'] },
            { path: '/admin/amc',        label: 'AMC Contracts', icon: Wind,          color: 'text-sky-400', roles: ['admin', 'user'] },
        ],
    },
    {
        label: '🧠 Intelligence',
        items: [
            { path: '/admin/ai-insights', label: 'AI Insights',   icon: Brain,         color: 'text-violet-400', roles: ['admin'] },
            { path: '/admin/accounting',  label: 'Accounting',     icon: Calculator,    color: 'text-cyan-400', roles: ['admin'] },
            { path: '/admin/reports',     label: 'Analytics',      icon: BarChart3,     color: 'text-pink-400', roles: ['admin'] },
        ],
    },
    {
        label: '🎉 Marketing',
        items: [
            { path: '/admin/festivals',  label: 'Festival Planner', icon: Sparkles,    color: 'text-yellow-400', roles: ['admin'] },
            { path: '/admin/whatsapp',   label: 'WhatsApp Hub',     icon: MessageCircle, color: 'text-emerald-400', roles: ['admin', 'user'] },
        ],
    },
    {
        label: '⚙ System',
        items: [
            { path: '/admin/users',    label: 'User & Security', icon: UserCog,  color: 'text-yellow-400', roles: ['admin'] },
            { path: '/admin/settings',    label: 'Admin Settings',  icon: Settings, color: 'text-slate-400', roles: ['admin'] },
            { path: '/admin/contact',  label: 'Store Location',  icon: MapPin,   color: 'text-rose-400', roles: ['admin'] },
        ],
    },
];

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState({});

    // Filter nav groups based on user role
    const NAV_GROUPS = BASE_NAV_GROUPS.map(group => ({
        ...group,
        items: group.items.filter(item => !item.roles || item.roles.includes(user?.role || 'user'))
    })).filter(group => group.items.length > 0);

    const toggleGroup = (label) => setCollapsed(p => ({ ...p, [label]: !p[label] }));

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <aside className="fixed left-0 top-0 h-screen w-72 bg-black/80 backdrop-blur-2xl border-r border-cyan-500/20 flex flex-col z-40 overflow-hidden shadow-[4px_0_24px_rgba(14,165,233,0.1)]">

            {/* Logo */}
            <div className="px-6 py-6 border-b border-cyan-500/10 flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-3 relative z-10">
                    <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center neon-glow flex-shrink-0">
                        <span className="text-black font-black text-sm">UE</span>
                    </div>
                    <div>
                        <h1 className="font-black text-sm text-white leading-tight tracking-tight title-font gradient-text">Unity Electronics</h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 pulse-glow flex-shrink-0"></span>
                            <p className="text-[9px] font-black uppercase tracking-widest text-cyan-500/70">ERP System • Live</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar space-y-1">
                {NAV_GROUPS.map(group => (
                    <div key={group.label} className="mb-1">
                        {/* Group Header */}
                        <button
                            onClick={() => toggleGroup(group.label)}
                            className="w-full flex items-center justify-between px-3 py-1.5 mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-cyan-500/50 hover:text-cyan-400 transition-colors"
                        >
                            <span>{group.label}</span>
                            {collapsed[group.label]
                                ? <ChevronRight size={10} />
                                : <ChevronDown size={10} />
                            }
                        </button>

                        {/* Items */}
                        {!collapsed[group.label] && (
                            <div className="space-y-0.5">
                                {group.items.map(item => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === '/admin'}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${
                                                isActive
                                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                                                    : 'text-slate-400 hover:bg-cyan-500/5 hover:text-cyan-300'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && (
                                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-cyan-400 rounded-r-full neon-glow"></span>
                                                )}
                                                <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive ? 'bg-cyan-500/20' : 'bg-white/5 group-hover:bg-cyan-500/10'}`}>
                                                    <item.icon size={14} className={isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : item.color} />
                                                </div>
                                                <span className={`text-xs font-black tracking-wide ${isActive ? 'text-cyan-400 text-shadow-glow' : ''}`}>{item.label}</span>
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer: Owner info + Logout */}
            <div className="p-4 border-t border-cyan-500/10 flex-shrink-0">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 neon-glow">
                        <span className="text-sm font-black text-cyan-400 uppercase">
                            {user?.name?.substring(0, 2) || 'UN'}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-black text-white truncate drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{user?.name || 'Unknown User'}</p>
                        <p className="text-[9px] text-cyan-500/70 font-black uppercase tracking-widest">{user?.role === 'admin' ? 'Administrator' : 'Staff Member'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-all font-black text-xs group"
                >
                    <LogOut size={14} className="group-hover:rotate-12 transition-transform" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
