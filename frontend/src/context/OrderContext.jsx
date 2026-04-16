import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

// Helper to generate invoice numbers (now mostly handled by backend, but keep for fallback)
const genInvoiceNo = () => `UE-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2,5).toUpperCase()}`;

export const OrderProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ue_cart') || '[]'); }
        catch { return []; }
    });

    const [orders, setOrders] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ue_orders') || '[]'); }
        catch { return []; }
    });

    const [adminNotifications, setAdminNotifications] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ue_admin_notifs') || '[]'); }
        catch { return []; }
    });

    // Socket Initialization
    useEffect(() => {
        const socket = io(api.defaults.baseURL.replace('/api', ''), { transports: ['websocket'] }); // assuming api.defaults.baseURL is like http://localhost:5000/api
        
        socket.on('new_order', (newOrder) => {
            // Update orders list if current user is admin, or if we just want it in memory
            setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id && o.tracking_id !== newOrder.tracking_id)]);
            
            // Format notification
            const notif = {
                id: Date.now(),
                type: 'new_order',
                title: 'New Customer Order',
                message: `${newOrder.user_name || 'Guest'} placed an order for ₹${Number(newOrder.total_amount).toLocaleString()}`,
                invoiceId: newOrder.tracking_id,
                time: new Date().toISOString(),
                read: false,
            };
            setAdminNotifications(prev => [notif, ...prev.slice(0, 49)]);

            // Optional sound alert
            if (user?.role === 'admin') {
                try {
                    const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
                    audio.play();
                } catch(e) {}
            }
        });

        socket.on('order_updated', (updatedOrder) => {
             setOrders(prev => prev.map(o => (o.id === updatedOrder.id || o.tracking_id === updatedOrder.tracking_id) ? updatedOrder : o));
        });

        return () => socket.disconnect();
    }, [user]);

    // Initial fetch of orders if logged in
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                if (user.role === 'admin') {
                    const res = await api.get('/orders');
                    setOrders(res.data);
                } else {
                    const res = await api.get(`/orders/user/${user.id}`);
                    setOrders(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };
        fetchOrders();
    }, [user]);

    // Persist to localStorage
    useEffect(() => { localStorage.setItem('ue_cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('ue_orders', JSON.stringify(orders)); }, [orders]);
    useEffect(() => { localStorage.setItem('ue_admin_notifs', JSON.stringify(adminNotifications)); }, [adminNotifications]);

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(i => i.id !== productId));
    };

    const updateCartQty = (productId, qty) => {
        if (qty <= 0) { removeFromCart(productId); return; }
        setCart(prev => prev.map(i => i.id === productId ? { ...i, quantity: qty } : i));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, i) => sum + (Number(i.selling_price) * i.quantity), 0);
    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    const placeOrder = async (orderUser, shippingAddress, paymentId = null, paymentMethod = 'Razorpay') => {
        try {
            const orderPayload = {
                user_id: user?.id,
                user_name: user?.name || orderUser?.name || 'Guest',
                user_email: user?.email || orderUser?.email || '',
                items: cart,
                total_amount: Math.round(cartTotal * 1.18), // Grand Total
                payment_mode: paymentMethod.toUpperCase(),
                payment_id: paymentId || 'DEMO-' + Date.now(),
                shipping_address: shippingAddress
            };
            
            const res = await api.post('/orders', orderPayload);
            clearCart();
            return res.data;
        } catch (error) {
            console.error("Place order failed:", error);
            // Fallback
            const fallbackOrder = { tracking_id: 'err-fallback', total_amount: cartTotal };
            clearCart();
            return fallbackOrder;
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const res = await api.put(`/orders/${orderId}/status`, { status });
            return res.data;
        } catch (error) {
            console.error("Update order status failed:", error);
        }
    };

    const getUserOrders = () => orders; // Now handled by state populated from API

    const markAdminNotifRead = (id) => {
        setAdminNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAdminNotifs = () => {
        setAdminNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadNotifCount = adminNotifications.filter(n => !n.read).length;

    return (
        <OrderContext.Provider value={{
            cart, addToCart, removeFromCart, updateCartQty, clearCart,
            cartTotal, cartCount,
            orders, placeOrder, updateOrderStatus, getUserOrders,
            adminNotifications, markAdminNotifRead, clearAdminNotifs, unreadNotifCount
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => useContext(OrderContext);
