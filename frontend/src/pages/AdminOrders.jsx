import React, { useState, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import { Search, PackageOpen, Check, X, Bell, Package, Clock, Truck } from 'lucide-react';

const AdminOrders = () => {
    const { orders, updateOrderStatus, adminNotifications, clearAdminNotifs, markAdminNotifRead } = useOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const handleUpdateStatus = async (id, status) => {
        await updateOrderStatus(id, status);
    };

    const STATUS_COLORS = {
        'Pending': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
        'Processing': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        'Shipped': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        'Out for Delivery': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
        'Delivered': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        'Cancelled': 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    };

    const filteredOrders = orders.filter(o => 
        (filterStatus === 'All' || o.status === filterStatus) &&
        (o.tracking_id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         o.user_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 border border-white/5 p-6 rounded-3xl">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <PackageOpen className="text-orange-400" size={32} />
                        Order Management
                    </h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">
                        Track and manage incoming user storefront orders.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {adminNotifications.filter(n => !n.read).length > 0 && (
                        <button onClick={clearAdminNotifs} className="relative h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} className="animate-pulse text-cyan-400" />
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                                {adminNotifications.filter(n => !n.read).length}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {['Pending', 'Processing', 'Delivered', 'Cancelled'].map(stat => (
                    <div key={stat} onClick={() => setFilterStatus(stat === filterStatus ? 'All' : stat)} className={`bg-white/5 border border-white/5 p-6 rounded-3xl cursor-pointer transition-all ${filterStatus === stat ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'hover:border-white/10'}`}>
                        <p className="text-sm text-slate-400 font-bold mb-2">{stat} Orders</p>
                        <p className="text-3xl font-black text-white">{orders.filter(o => o.status === stat).length}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-6">
                <div className="flex justify-between items-center">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-cyan-500/50 placeholder-slate-600 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/40 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-xl border-b border-white/5">Order ID</th>
                                <th className="px-6 py-4 border-b border-white/5">Customer Info</th>
                                <th className="px-6 py-4 border-b border-white/5">Items</th>
                                <th className="px-6 py-4 border-b border-white/5">Total Price</th>
                                <th className="px-6 py-4 border-b border-white/5">Status</th>
                                <th className="px-6 py-4 rounded-tr-xl border-b border-white/5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-white font-medium">
                            {filteredOrders.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-500">No orders found.</td></tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-cyan-400">{order.tracking_id}</div>
                                        <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold">{order.user_name}</div>
                                        <div className="text-xs text-slate-500">{order.payment_mode}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.OrderItems?.map(item => (
                                            <div key={item.id} className="text-xs text-slate-300">
                                                {item.quantity}x {item.product_name}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-black">₹{Number(order.total_amount).toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[order.status] || STATUS_COLORS['Pending']}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                            className="bg-black/50 border border-white/10 text-slate-300 text-xs rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-500/50"
                                        >
                                            {['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
