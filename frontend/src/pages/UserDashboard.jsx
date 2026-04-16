import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Settings, LogOut, ChevronRight, Package, Heart, RefreshCw, MessageSquare } from 'lucide-react';
import Chatbot from '../components/Chatbot';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { orders } = useOrders();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Filter backend orders for this user instead of fake sales data
    const userOrders = orders.map(o => ({
        id: o.tracking_id || o.id,
        date: new Date(o.createdAt || o.placedAt).toLocaleDateString('en-IN'),
        total: `₹${Number(o.total_amount || 0).toLocaleString()}`,
        status: o.status || 'Processing',
        items: `${(o.OrderItems || o.items || []).length} Item(s)`,
        rawOrder: o
    }));

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 interactive cursor-pointer" onClick={() => navigate('/')}>
                    <div className="h-10 w-10 rounded-2xl bg-cyan-500 flex items-center justify-center neon-glow">
                        <span className="text-slate-950 font-black text-sm">UE</span>
                    </div>
                    <div>
                        <h1 className="font-black text-lg text-white leading-tight tracking-tight">Unity Store</h1>
                        <p className="text-[9px] font-black uppercase tracking-widest text-cyan-500/70">Return to Store</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline font-bold text-sm text-slate-300">Welcome, {user?.name || 'User'}</span>
                    {user?.role === 'admin' && (
                        <button onClick={() => navigate('/admin')} className="interactive h-10 px-4 rounded-full bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-slate-950 font-black tracking-widest uppercase text-[10px] transition-all">
                            Admin Panel
                        </button>
                    )}
                    <button onClick={handleLogout} className="interactive h-10 px-4 rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 font-bold text-sm flex items-center gap-2 transition-all">
                        <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 md:p-12 animate-slide-up">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="premium-card p-4 space-y-2">
                            <button 
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Package size={18} /> My Orders
                            </button>
                            <button 
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <User size={18} /> Profile Details
                            </button>
                            <button 
                                onClick={() => setActiveTab('wishlist')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'wishlist' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Heart size={18} /> Wishlist
                            </button>
                            <button 
                                onClick={() => setActiveTab('support')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'support' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <MessageSquare size={18} /> Customer Support
                            </button>
                            <button 
                                onClick={() => setActiveTab('settings')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Settings size={18} /> Account Settings
                            </button>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1">
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black mb-1">My Orders</h2>
                                    <p className="text-slate-400 text-sm">Track, return, or buy things again.</p>
                                </div>
                                <div className="space-y-4">
                                    {userOrders.map((order, idx) => (
                                        <div key={order.id || idx} className="premium-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm font-black text-cyan-400">{order.id}</span>
                                                    <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-full bg-amber-500/20 text-amber-400`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="font-bold text-white mb-1">{order.items}</p>
                                                <p className="text-xs text-slate-400">Placed on {order.date}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                                                <span className="text-xl font-black">{order.total}</span>
                                                <button className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {userOrders.length === 0 && (
                                        <div className="py-10 text-center text-slate-500 font-bold text-sm">
                                            No active orders found in real-time.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-slide-up">
                                <div>
                                    <h2 className="text-2xl font-black mb-1">Profile Details</h2>
                                    <p className="text-slate-400 text-sm">Manage your personal information.</p>
                                </div>
                                <div className="premium-card p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Full Name</label>
                                            <input type="text" defaultValue={user?.name || ''} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Email Address</label>
                                            <input type="email" defaultValue={user?.email || ''} readOnly className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-slate-400 font-bold text-sm outline-none cursor-not-allowed" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Shipping Address</label>
                                            <textarea rows="3" defaultValue="123 Tech Park, Unity City, India" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-sm focus:ring-2 focus:ring-cyan-500 outline-none"></textarea>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                        Update Details
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="space-y-6 animate-slide-up">
                                <div>
                                    <h2 className="text-2xl font-black mb-1">My Wishlist</h2>
                                    <p className="text-slate-400 text-sm">Products you have saved for later.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Sony Bravia 55" OLED TV', price: '₹1,10,000', label: 'In Stock' },
                                        { name: 'Samsung 1.5T Split AC', price: '₹38,000', label: 'Offers Available' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="premium-card p-5 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-white mb-1">{item.name}</h3>
                                                <span className="text-lg font-black text-cyan-400">{item.price}</span>
                                                <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-black uppercase rounded-lg tracking-widest">{item.label}</div>
                                            </div>
                                            <button className="h-10 w-10 bg-white/10 hover:bg-rose-500 hover:text-white text-slate-300 rounded-xl flex items-center justify-center transition-all">
                                                <Heart size={16} className="fill-current" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'support' && (
                            <div className="space-y-6 animate-slide-up">
                                <div>
                                    <h2 className="text-2xl font-black mb-1">Customer Support</h2>
                                    <p className="text-slate-400 text-sm">Need help? Send us a message.</p>
                                </div>
                                <div className="premium-card p-6">
                                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Subject</label>
                                            <input type="text" placeholder="e.g. Defective Product / AMC Inquiry" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Your Message</label>
                                            <textarea rows="5" placeholder="Describe your issue..." className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-sm focus:ring-2 focus:ring-cyan-500 outline-none"></textarea>
                                        </div>
                                        <button className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-all">
                                            Send Ticket
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6 animate-slide-up">
                                <div>
                                    <h2 className="text-2xl font-black mb-1">Account Settings</h2>
                                    <p className="text-slate-400 text-sm">Security and notification preferences.</p>
                                </div>
                                <div className="premium-card p-6 space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                                        <div>
                                            <h3 className="font-bold text-white mb-1">Email Notifications</h3>
                                            <p className="text-xs text-slate-400">Receive order updates directly to email.</p>
                                        </div>
                                        <div className="w-12 h-6 bg-cyan-500 rounded-full relative cursor-pointer">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-slate-950 rounded-full shadow-md"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                                        <div>
                                            <h3 className="font-bold text-white mb-1">SMS Alerts</h3>
                                            <p className="text-xs text-slate-400">Get text messages for delivery tracking.</p>
                                        </div>
                                        <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-rose-400 mb-2">Danger Zone</h3>
                                        <button className="px-4 py-2 border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-bold transition-all">
                                            Deactivate Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <Chatbot />
        </div>
    );
};

export default UserDashboard;
