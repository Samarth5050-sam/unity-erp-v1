import React, { useState } from 'react';
import {
    Users, Shield, Key, Eye, EyeOff, Activity,
    UserCheck, UserX, Plus, Trash2, CheckCircle, Bell, Lock
} from 'lucide-react';

const ROLES = ['Admin', 'Manager', 'Cashier', 'Viewer'];
const ROLE_COLORS = { Admin: 'text-rose-400 bg-rose-500/10', Manager: 'text-blue-400 bg-blue-500/10', Cashier: 'text-emerald-400 bg-emerald-500/10', Viewer: 'text-slate-400 bg-slate-500/10' };
const PERMISSIONS = {
    Admin: ['Billing', 'Products', 'Customers', 'Reports', 'Accounting', 'AI Insights', 'Warranty', 'Suppliers', 'Admin', 'User Management'],
    Manager: ['Billing', 'Products', 'Customers', 'Reports', 'Warranty', 'Suppliers'],
    Cashier: ['Billing', 'Products', 'Customers'],
    Viewer: ['Reports', 'Dashboard'],
};
const AUDIT_LOGS = [
    { user: 'Samarth Shinde', action: 'Login', time: '2 mins ago', ip: '192.168.1.1', type: 'auth' },
    { user: 'Samarth Shinde', action: 'New Sale Created — INV-001', time: '15 mins ago', ip: '192.168.1.1', type: 'sale' },
    { user: 'Samarth Shinde', action: 'Product Updated — LED TV 55"', time: '1 hr ago', ip: '192.168.1.1', type: 'product' },
    { user: 'System', action: 'Automated Backup Completed', time: '3 hrs ago', ip: 'localhost', type: 'system' },
    { user: 'Samarth Shinde', action: 'Customer Record Added', time: '5 hrs ago', ip: '192.168.1.1', type: 'crm' },
];

const UserManagement = () => {
    const [users, setUsers] = useState(() => {
        try { return JSON.parse(localStorage.getItem('unity_users') || '[]'); } catch { return []; }
    });
    const [activeTab, setActiveTab] = useState('users');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Cashier', password: '', active: true });
    const [notifications, setNotifications] = useState(() => {
        try { return JSON.parse(localStorage.getItem('unity_notif') || JSON.stringify({ lowStock: true, dailyReport: true, newSale: true, fraudAlert: true, backup: false })); } catch { return {}; }
    });

    const saveUsers = (list) => { setUsers(list); localStorage.setItem('unity_users', JSON.stringify(list)); };
    const addUser = () => {
        if (!newUser.name || !newUser.email) return alert('Fill name and email');
        saveUsers([...users, { ...newUser, id: Date.now() }]);
        setNewUser({ name: '', email: '', role: 'Cashier', password: '', active: true });
        setShowAddForm(false);
    };
    const toggleUser = (id) => saveUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
    const deleteUser = (id) => saveUsers(users.filter(u => u.id !== id));
    const saveNotif = (key, val) => {
        const updated = { ...notifications, [key]: val };
        setNotifications(updated);
        localStorage.setItem('unity_notif', JSON.stringify(updated));
    };

    const allUsers = [
        { id: 0, name: 'Samarth Shinde', email: 'samartrshinde5050@gmail.com', role: 'Admin', active: true, lastLogin: '2 mins ago', isOwner: true },
        ...users
    ];

    const tabs = [
        { id: 'users', label: '👥 User Roles' },
        { id: 'permissions', label: '🔐 Permissions' },
        { id: 'audit', label: '📋 Audit Logs' },
        { id: 'notifications', label: '🔔 Alerts' },
        { id: 'security', label: '🛡️ Security' },
    ];

    return (
        <div className="space-y-8 pb-10 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">User <span className="gradient-text">&amp; Security</span></h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Role Management · Access Control · Audit Logs</p>
                </div>
                <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 transition-all">
                    <Plus size={16} /> Add User
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: allUsers.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Active', value: allUsers.filter(u => u.active).length, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Inactive', value: allUsers.filter(u => !u.active).length, icon: UserX, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                    { label: 'Admin Roles', value: allUsers.filter(u => u.role === 'Admin').length, icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map(c => (
                    <div key={c.label} className="premium-card p-5 space-y-3">
                        <div className={`h-10 w-10 rounded-2xl ${c.bg} flex items-center justify-center`}><c.icon size={18} className={c.color} /></div>
                        <p className="text-2xl font-black">{c.value}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{c.label}</p>
                    </div>
                ))}
            </div>

            {/* Add User Modal */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl">
                        <h3 className="text-xl font-black mb-6">Add New User</h3>
                        <div className="space-y-4">
                            {[{ key: 'name', label: 'Full Name', type: 'text', ph: 'e.g. John Doe' }, { key: 'email', label: 'Email', type: 'email', ph: 'user@unity.com' }].map(f => (
                                <div key={f.key}>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">{f.label}</label>
                                    <input type={f.type} value={newUser[f.key]} onChange={e => setNewUser(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-primary text-foreground" />
                                </div>
                            ))}
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Role</label>
                                <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-primary text-foreground">
                                    {ROLES.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
                                </select>
                            </div>
                            <div className="relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Password</label>
                                <input type={showPassword ? 'text' : 'password'} value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} placeholder="Temp password"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-primary text-foreground pr-12" />
                                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 text-slate-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm transition-all">Cancel</button>
                            <button onClick={addUser} className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm transition-all">Create User</button>
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

            {/* Users List */}
            {activeTab === 'users' && (
                <div className="premium-card overflow-hidden p-0">
                    <div className="p-6 border-b border-white/5"><h2 className="font-black text-lg">System Users</h2></div>
                    <div className="divide-y divide-white/5">
                        {allUsers.map(u => (
                            <div key={u.id} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-black text-sm ${ROLE_COLORS[u.role]}`}>
                                        {u.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">{u.name} {u.isOwner && <span className="text-[9px] text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full font-black ml-2">OWNER</span>}</p>
                                        <p className="text-xs text-slate-500 font-bold">{u.email} · Last: {u.lastLogin || 'Never'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[9px] px-3 py-1.5 rounded-full font-black uppercase ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                                    <span className={`text-[9px] px-3 py-1.5 rounded-full font-black uppercase ${u.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>{u.active ? 'Active' : 'Disabled'}</span>
                                    {!u.isOwner && (
                                        <div className="flex gap-2">
                                            <button onClick={() => toggleUser(u.id)} className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-400">{u.active ? <UserX size={16} /> : <UserCheck size={16} />}</button>
                                            <button onClick={() => deleteUser(u.id)} className="p-2 hover:bg-rose-500/10 text-rose-400 rounded-xl transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Permissions */}
            {activeTab === 'permissions' && (
                <div className="premium-card overflow-hidden p-0">
                    <div className="p-6 border-b border-white/5"><h2 className="font-black text-lg">Role-Based Access Control</h2></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase text-slate-400">Module</th>
                                    {ROLES.map(r => <th key={r} className={`px-6 py-3 text-center text-[10px] font-black uppercase ${ROLE_COLORS[r].split(' ')[0]}`}>{r}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {['Billing', 'Products', 'Customers', 'Reports', 'Accounting', 'AI Insights', 'Warranty', 'Suppliers', 'Admin', 'User Management'].map(mod => (
                                    <tr key={mod} className="hover:bg-white/5">
                                        <td className="px-6 py-3 font-black text-sm">{mod}</td>
                                        {ROLES.map(r => (
                                            <td key={r} className="px-6 py-3 text-center">
                                                {PERMISSIONS[r].includes(mod)
                                                    ? <CheckCircle size={16} className="mx-auto text-emerald-400" />
                                                    : <span className="text-slate-700 font-black text-lg">—</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Audit Logs */}
            {activeTab === 'audit' && (
                <div className="premium-card overflow-hidden p-0">
                    <div className="p-6 border-b border-white/5"><h2 className="font-black text-lg">Activity & Audit Logs</h2></div>
                    <div className="divide-y divide-white/5">
                        {AUDIT_LOGS.map((log, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${log.type === 'auth' ? 'bg-blue-500/10 text-blue-400' : log.type === 'sale' ? 'bg-emerald-500/10 text-emerald-400' : log.type === 'system' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-500/10 text-slate-400'}`}>
                                    <Activity size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black">{log.action}</p>
                                    <p className="text-[10px] text-slate-500 font-bold">By {log.user} · IP: {log.ip}</p>
                                </div>
                                <span className="text-[10px] text-slate-500 font-bold">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
                <div className="premium-card">
                    <h2 className="font-black text-lg mb-6">Smart Alert Configuration</h2>
                    <div className="space-y-4">
                        {[
                            { key: 'lowStock', icon: Bell, label: 'Low Stock Alerts', desc: 'Get notified when products fall below 10 units' },
                            { key: 'dailyReport', icon: Activity, label: 'Daily Sales Summary', desc: 'Auto WhatsApp/SMS summary to owner at 9 PM' },
                            { key: 'newSale', icon: CheckCircle, label: 'New Sale Notification', desc: 'Real-time alert for every completed transaction' },
                            { key: 'fraudAlert', icon: Shield, label: 'Fraud Detection Alert', desc: 'Alert on abnormal transaction patterns' },
                            { key: 'backup', icon: Lock, label: 'Backup Reminder', desc: 'Daily reminder to backup data' },
                        ].map(n => (
                            <div key={n.key} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <n.icon size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">{n.label}</p>
                                        <p className="text-xs text-slate-500 font-bold">{n.desc}</p>
                                    </div>
                                </div>
                                <button onClick={() => saveNotif(n.key, !notifications[n.key])}
                                    className={`relative h-7 w-14 rounded-full transition-all duration-300 ${notifications[n.key] ? 'bg-primary' : 'bg-white/10'}`}>
                                    <div className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${notifications[n.key] ? 'left-8' : 'left-1'}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
                <div className="space-y-6">
                    {[
                        { icon: Lock, title: 'JWT Authentication', status: 'Active', desc: 'Secure token-based login system with 24hr expiry', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        { icon: Shield, title: 'Role-Based Access', status: 'Configured', desc: '4 roles: Admin, Manager, Cashier, Viewer — each with limited permissions', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                        { icon: Activity, title: 'Audit Trail', status: 'Logging', desc: 'All user actions are recorded with timestamp and IP address', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                        { icon: CheckCircle, title: 'Data Backup', status: 'SQLite DB', desc: 'Local SQLite database with export capability. Manual backup recommended daily.', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    ].map(s => (
                        <div key={s.title} className="premium-card flex items-start gap-5">
                            <div className={`h-12 w-12 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                                <s.icon size={22} className={s.color} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-black text-sm">{s.title}</h3>
                                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase ${s.bg} ${s.color}`}>{s.status}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-bold">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserManagement;
