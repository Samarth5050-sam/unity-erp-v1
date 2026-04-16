import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import {
    ShoppingCart, Package, FileText, User, LogOut, ChevronRight, X, Plus, Minus,
    CheckCircle, Truck, MapPin, ArrowLeft, Download, Search,
    ShoppingBag, Shield, Star, Heart, Tag, Zap, CreditCard,
    Phone, Mail, Facebook, Instagram, Twitter, Home, Wrench, LifeBuoy, WrenchIcon, PenTool, AlertTriangle
} from 'lucide-react';
import api from '../api/axios';
import Chatbot from '../components/Chatbot';
import { PRODUCT_CATALOG } from '../data/products';

// Star Rating Component
const Stars = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
            <Star key={i} size={11} className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} />
        ))}
        <span className="text-[10px] text-slate-400 font-bold ml-1">{rating}</span>
    </div>
);

// Razorpay payment helper (Test Mode)
const openRazorpay = ({ amount, user, onSuccess, onFailure }) => {
    const loadScript = () => new Promise(resolve => {
        if (window.Razorpay) { resolve(true); return; }
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });

    loadScript().then(loaded => {
        if (!loaded) { onFailure('Razorpay failed to load'); return; }
        const options = {
            key: 'rzp_test_1DP5mmOlF5G5ag', // Razorpay Test Key
            amount: Math.round(amount * 100), // in paise
            currency: 'INR',
            name: 'Unity Electronics',
            description: 'Secure Payment',
            image: 'https://i.imgur.com/n5tjHFD.png',
            handler: response => onSuccess(response),
            prefill: { name: user?.name || '', email: user?.email || '', contact: '' },
            notes: { address: 'Unity Electronics Pvt. Ltd.' },
            theme: { color: '#06b6d4' },
            modal: { ondismiss: () => onFailure('Payment cancelled') }
        };
        new window.Razorpay(options).open();
    });
};

// ------ INVOICE COMPONENT ------
const Invoice = ({ order, onClose }) => {
    const printRef = useRef();
    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const win = window.open('', '_blank');
        win.document.write(`<html><head><title>Invoice ${order.id}</title>
            <style>
                body { font-family: Arial, sans-serif; background: white; color: #111; padding: 40px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th { background: #0ea5e9; color: white; padding: 10px; text-align: left; font-size: 12px; }
                td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
                .total-row { font-weight: bold; font-size: 15px; }
                .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; }
                .logo { font-size: 24px; font-weight: 900; color: #0ea5e9; }
                .badge { background: #dcfce7; color: #16a34a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            </style>
        </head><body>${content}</body></html>`);
        win.document.close();
        win.print();
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-black text-gray-900">Invoice / Bill</h2>
                    <div className="flex gap-3">
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-xl font-bold text-sm hover:bg-cyan-600 transition-colors">
                            <Download size={16} /> Print / Save PDF
                        </button>
                        <button onClick={onClose} className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <X size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                <div ref={printRef} className="p-8 text-gray-900">
                    <div className="header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <div className="logo" style={{ fontSize: '28px', fontWeight: '900', color: '#0ea5e9', marginBottom: '4px' }}>UNITY ERP</div>
                            <p style={{ color: '#666', fontSize: '13px' }}>Unity Electronics Pvt. Ltd.</p>
                            <p style={{ color: '#666', fontSize: '13px' }}>GSTIN: 27UNITYELI001K1Z5</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#0ea5e9' }}>TAX INVOICE</p>
                            <p style={{ fontSize: '13px', color: '#444', marginTop: '4px' }}>Invoice #: <strong>{order.id}</strong></p>
                            <p style={{ fontSize: '13px', color: '#444' }}>Date: {new Date(order.placedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            <span className="badge" style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginTop: '4px' }}>PAID</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                            <p style={{ fontWeight: 'bold', color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Bill To</p>
                            <p style={{ fontWeight: 'bold', fontSize: '15px' }}>{order.userName}</p>
                            <p style={{ color: '#555', fontSize: '13px' }}>{order.userEmail}</p>
                            <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>{order.shippingAddress}</p>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                            <p style={{ fontWeight: 'bold', color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Order Details</p>
                            <p style={{ fontSize: '13px' }}><strong>Status:</strong> {order.status}</p>
                            <p style={{ fontSize: '13px', marginTop: '4px' }}><strong>Payment:</strong> {order.paymentMode || 'Prepaid'}</p>
                            <p style={{ fontSize: '13px', marginTop: '4px' }}><strong>Payment ID:</strong> <span style={{color:'#0ea5e9', fontWeight:'bold'}}>{order.paymentId || 'N/A'}</span></p>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.OrderItems || order.items || []).map((item, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{item.product_name}</td>
                                    <td style={{ color: '#666' }}>{item.category || '-'}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{Number(item.price || item.selling_price || 0).toLocaleString()}</td>
                                    <td style={{ fontWeight: 'bold' }}>₹{(Number(item.price || item.selling_price || 0) * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'right', paddingTop: '16px', color: '#555' }}>Subtotal</td>
                                <td style={{ paddingTop: '16px' }}>₹{Number(order.total_amount || order.grandTotal || 0).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'right', color: '#555' }}>GST (18%)</td>
                                <td>₹{Math.round(Number(order.total_amount || order.grandTotal || 0) * 0.18).toLocaleString()}</td>
                            </tr>
                            <tr className="total-row" style={{ background: '#f0f9ff' }}>
                                <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>Grand Total</td>
                                <td style={{ fontWeight: '900', fontSize: '16px', color: '#0ea5e9' }}>₹{Number(order.total_amount || order.grandTotal || 0).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p style={{ fontSize: '12px', color: '#999', marginTop: '24px', textAlign: 'center' }}>
                        Thank you for shopping with Unity Electronics! For support, contact us at support@unityerp.com
                    </p>
                </div>
            </div>
        </div>
    );
};

// ------ TRACKING STEPPER ------
const OrderTracker = ({ order }) => {
    const steps = order.tracking;
    const doneCount = steps.filter(s => s.done).length;
    return (
        <div className="mt-4">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-4 h-0.5 bg-white/10" />
                <div className="absolute left-0 top-4 h-0.5 bg-cyan-500 transition-all duration-700" style={{ width: `${((doneCount - 1) / (steps.length - 1)) * 100}%` }} />
                {steps.map((step, i) => (
                    <div key={i} className="relative flex flex-col items-center gap-2 z-10">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step.done ? 'bg-cyan-500 border-cyan-500' : 'bg-slate-800 border-white/20'}`}>
                            {step.done ? <CheckCircle size={16} className="text-white" /> : <div className="h-2 w-2 rounded-full bg-white/20" />}
                        </div>
                        <span className={`text-[10px] font-bold text-center max-w-[60px] ${step.done ? 'text-cyan-400' : 'text-slate-500'}`}>{step.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ------ CHECKOUT MODAL ------
const CheckoutModal = ({ onClose, onSuccess }) => {
    const { user } = useAuth();
    const { cart, cartTotal, placeOrder } = useOrders();
    const [step, setStep] = useState(1);
    const [paying, setPaying] = useState(false);
    const [payErr, setPayErr] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const paymentOptions = ['cash', 'card', 'upi', 'bank transfer', 'other'];
    const [address, setAddress] = useState({
        name: user?.name || '',
        phone: '',
        street: '',
        city: '',
        state: 'Maharashtra',
        pincode: '',
    });

    const handlePayment = () => {
        setPayErr('');
        setPaying(true);
        const grandTotal = Math.round(cartTotal * 1.18);
        const addrStr = `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`;
        
        if (['card'].includes(paymentMethod)) {
            openRazorpay({
                amount: grandTotal,
                user,
                onSuccess: async (response) => {
                    setPaying(false);
                    const order = await placeOrder(user, addrStr, response.razorpay_payment_id, paymentMethod);
                    onSuccess(order);
                },
                onFailure: (msg) => { setPaying(false); setPayErr(msg); }
            });
        } else {
            // Direct placement for Cash, Bank Transfer, UPI, Other
            setTimeout(async () => {
                setPaying(false);
                try {
                    const order = await placeOrder(user, addrStr, paymentMethod === 'upi' ? `UPI-${Date.now()}` : `OFFLINE-${Date.now()}`, paymentMethod);
                    onSuccess(order);
                } catch (e) {
                    setPayErr('Failed to place order');
                }
            }, 800);
        }
    };

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative bg-[#0a0f1e] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-black text-white">Checkout</h2>
                        <p className="text-slate-400 text-xs font-bold">Step {step} of 2</p>
                    </div>
                    <button onClick={onClose} className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10">
                        <X size={16} />
                    </button>
                </div>

                {step === 1 && (
                    <div className="p-6 space-y-4">
                        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2"><MapPin size={18} className="text-cyan-400" /> Shipping Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { key: 'name', label: 'Full Name', placeholder: 'John Doe', col: 2 },
                                { key: 'phone', label: 'Phone Number', placeholder: '+91 9876543210', col: 2 },
                                { key: 'street', label: 'Street Address', placeholder: '123 MG Road, Apt 4B', col: 2 },
                                { key: 'city', label: 'City', placeholder: 'Pune', col: 1 },
                                { key: 'pincode', label: 'PIN Code', placeholder: '411001', col: 1 },
                            ].map(f => (
                                <div key={f.key} className={`space-y-1.5 ${f.col === 2 ? 'col-span-2' : ''}`}>
                                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{f.label}</label>
                                    <input
                                        type="text"
                                        value={address[f.key]}
                                        onChange={e => setAddress(prev => ({ ...prev, [f.key]: e.target.value }))}
                                        placeholder={f.placeholder}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 font-medium text-sm outline-none focus:border-cyan-500/50 transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            disabled={!address.name || !address.phone || !address.street || !address.city || !address.pincode}
                            className="w-full mt-4 py-4 bg-cyan-500 disabled:bg-white/10 disabled:text-slate-500 hover:bg-cyan-400 text-slate-950 font-black rounded-2xl transition-all uppercase tracking-widest text-sm"
                        >
                            Continue to Payment
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-6 space-y-4">
                        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2"><FileText size={18} className="text-cyan-400" /> Order Summary</h3>
                        <div className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-3 max-h-48 overflow-y-auto">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-300 font-medium line-clamp-1 flex-1">{item.product_name} <span className="text-slate-500">x{item.quantity}</span></span>
                                    <span className="text-white font-black ml-4">₹{(Number(item.selling_price) * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-2 text-sm">
                            <div className="flex justify-between text-slate-400"><span>Subtotal</span><span className="text-white">₹{cartTotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-slate-400"><span>GST (18%)</span><span className="text-white">₹{Math.round(cartTotal * 0.18).toLocaleString()}</span></div>
                            <div className="flex justify-between text-lg font-black text-white border-t border-white/10 pt-2 mt-2">
                                <span>Total</span><span className="text-cyan-400">₹{Math.round(cartTotal * 1.18).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-sm space-y-1">
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Shipping to</p>
                            <p className="text-white font-bold">{address.name}</p>
                            <p className="text-slate-300">{address.street}, {address.city} - {address.pincode}</p>
                            <p className="text-slate-300">{address.phone}</p>
                        </div>
                        <div className="space-y-2 pb-2">
                            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest block">Payment Method</label>
                            <div className="flex flex-wrap gap-2">
                                {paymentOptions.map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${paymentMethod === method ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {payErr && <p className="text-rose-400 text-xs font-bold text-center bg-rose-500/10 rounded-xl p-3">{payErr}</p>}
                        
                        {paymentMethod === 'card' && (
                            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-3 text-xs text-center text-cyan-400 font-bold">
                                🔒 Secured by Razorpay · Test Mode · No real money charged
                            </div>
                        )}

                        {paymentMethod === 'upi' && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3">
                                <p className="text-white font-black text-sm uppercase tracking-widest">Pay via UPI</p>
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=9309109003@upi&pn=Unity%20Electronics&am=${Math.round(cartTotal * 1.18)}&cu=INR`} alt="UPI QR Code" className="h-32 w-32 rounded-xl bg-white p-2" />
                                <div>
                                    <p className="text-slate-400 text-xs font-bold mb-1">PhonePe / GPay Number:</p>
                                    <p className="text-2xl font-black text-cyan-400 tracking-wider">9309109003</p>
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-4">Scan the QR code or use the number directly to pay. Then click Place Order below.</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-white/5 text-white font-black rounded-2xl text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                <ArrowLeft size={16} /> Back
                            </button>
                            <button onClick={handlePayment} disabled={paying}
                                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-black rounded-2xl text-sm transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                                {paying ? <><div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> Processing...</> : <><CheckCircle size={16} /> Place Order</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ------ ORDER SUCCESS ------
const OrderSuccess = ({ order, onViewOrders, onContinue }) => (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative bg-[#0a0f1e] border border-cyan-500/20 rounded-3xl w-full max-w-md p-8 text-center shadow-2xl shadow-cyan-500/10">
            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Order Placed! 🎉</h2>
            <p className="text-slate-400 text-sm mb-4">Your order has been confirmed and will be processed shortly.</p>
            <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tracking ID</span>
                    <span className="text-cyan-400 font-black">{order.tracking_id || order.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Paid</span>
                    <span className="text-white font-black">₹{Number(order.total_amount || order.grandTotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className="text-green-400 font-black">Confirmed</span>
                </div>
            </div>
            <div className="flex gap-3">
                <button onClick={onContinue} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl text-sm transition-colors">
                    Continue Shopping
                </button>
                <button onClick={onViewOrders} className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-2xl text-sm transition-all">
                    View My Orders
                </button>
            </div>
        </div>
    </div>
);

// ====== MAIN USER SHOP PAGE ======
const UserShop = () => {
    const { user, logout } = useAuth();
    const { cart, cartTotal, cartCount, removeFromCart, updateCartQty, getUserOrders, addToCart } = useOrders();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('shop');
    const [showCheckout, setShowCheckout] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const [invoiceOrder, setInvoiceOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [addedId, setAddedId] = useState(null);

    const userOrders = user ? getUserOrders(user.id) : [];

    useEffect(() => {
        if (searchParams.get('checkout') === '1') {
            setActiveTab('cart');
            setShowCheckout(true);
        }
    }, [searchParams]);

    const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('ue_wishlist') || '[]'));
    const toggleWishlist = (id) => {
        setWishlist(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            localStorage.setItem('ue_wishlist', JSON.stringify(next));
            return next;
        });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                const data = Array.isArray(res.data) ? res.data : (res.data?.rows || []);
                // Merge backend products with catalog; prefer catalog for rich metadata
                const merged = PRODUCT_CATALOG.map(p => ({
                    ...p,
                    selling_price: p.selling_price,
                }));
                // Add any backend-only products not in catalog
                const backendExtra = data.filter(bp => !PRODUCT_CATALOG.find(cp => cp.product_name === bp.product_name));
                setProducts([...merged, ...backendExtra.map(bp => ({ ...bp, id: bp.id || bp.product_name, rating: 4.2, reviews: 100 }))]);
            } catch {
                setProducts(PRODUCT_CATALOG);
            }
        };
        fetchProducts();
    }, []);

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
    const filteredProducts = products.filter(p => {
        const matchSearch = p.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = activeCategory === 'All' || p.category === activeCategory;
        return matchSearch && matchCat;
    }).slice(0, 60);

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    const handleOrderSuccess = (order) => {
        setShowCheckout(false);
        setLastOrder(order);
        setShowSuccess(true);
    };

    const statusColors = {
        'Confirmed': 'bg-green-500/20 text-green-400',
        'Processing': 'bg-blue-500/20 text-blue-400',
        'Shipped': 'bg-purple-500/20 text-purple-400',
        'Out for Delivery': 'bg-orange-500/20 text-orange-400',
        'Delivered': 'bg-emerald-500/20 text-emerald-400',
        'Cancelled': 'bg-rose-500/20 text-rose-400',
    };

    const navItems = [
        { id: 'shop', icon: ShoppingBag, label: 'Browse Products' },
        { id: 'cart', icon: ShoppingCart, label: 'Cart', badge: cartCount },
        { id: 'orders', icon: Package, label: 'My Orders', badge: userOrders.length },
        { id: 'maintenance', icon: Wrench, label: 'Support & Repair' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="min-h-screen bg-[#050B14] text-white font-sans">
            {/* Header */}
            <header className="sticky top-0 z-[90] backdrop-blur-xl bg-[#050B14]/90 border-b border-white/5 px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-black text-sm">UE</span>
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="font-black text-base text-white tracking-tight">Unity Store</h1>
                        <p className="text-[9px] font-black uppercase tracking-widest text-cyan-500/70">My Account</p>
                    </div>
                </div>

                {/* Nav Tabs */}
                <div className="flex items-center gap-1 bg-white/5 rounded-2xl p-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                        >
                            <item.icon size={14} />
                            <span className="hidden sm:inline">{item.label}</span>
                            {item.badge > 0 && (
                                <span className={`absolute -top-1 -right-1 h-4.5 w-4.5 text-[9px] font-black rounded-full flex items-center justify-center ${activeTab === item.id ? 'bg-slate-950 text-cyan-400' : 'bg-cyan-500 text-slate-950'}`} style={{ height: '18px', width: '18px', fontSize: '9px' }}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <span className="hidden sm:block text-slate-400 text-sm font-bold">Hi, {user?.name?.split(' ')[0]}</span>
                    <button onClick={() => { logout(); navigate('/'); }} className="h-9 px-3 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 font-bold text-xs flex items-center gap-2 transition-all">
                        <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-8">

                {/* ===== SHOP TAB ===== */}
                {activeTab === 'shop' && (
                    <div>
                        {/* Search + Filter */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 font-medium text-sm outline-none focus:border-cyan-500/50"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {categories.map(cat => (
                                    <button key={cat} onClick={() => setActiveCategory(cat)}
                                        className={`whitespace-nowrap px-4 py-2.5 rounded-full font-bold text-xs transition-all ${activeCategory === cat ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'}`}
                                    >{cat}</button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredProducts.map((product, idx) => {
                                const isAdded = addedId === product.id;
                                const inWishlist = wishlist.includes(product.id);
                                const discount = product.original_price ? Math.round((1 - product.selling_price / product.original_price) * 100) : 15;
                                return (
                                    <div key={product.id || idx} className="group relative bg-white/3 hover:bg-white/6 border border-white/5 hover:border-cyan-500/30 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:-translate-y-1">
                                        {/* Badge */}
                                        {product.badge && <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase">{product.badge}</div>}
                                        {/* Wishlist */}
                                        <button onClick={() => toggleWishlist(product.id)} className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110">
                                            <Heart size={14} className={inWishlist ? 'text-rose-400 fill-rose-400' : 'text-white'} />
                                        </button>
                                        {product.stock_quantity === 0 && <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[9px] font-black uppercase">Out of Stock</div>}
                                        <div className="h-48 bg-slate-800/40 overflow-hidden flex items-center justify-center p-4">
                                            <img src={product.image_url || 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=300'} alt={product.product_name}
                                                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=300'; }}
                                            />
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-1">{product.category}</p>
                                            <h3 className="font-bold text-sm text-white leading-snug mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">{product.product_name}</h3>
                                            {product.rating && <div className="mb-3"><Stars rating={product.rating} /><span className="text-[10px] text-slate-500 ml-1">({(product.reviews || 0).toLocaleString()} reviews)</span></div>}
                                            <div className="mt-auto">
                                                <div className="flex items-baseline gap-2 mb-3">
                                                    <span className="text-lg font-black text-white">₹{Number(product.selling_price).toLocaleString()}</span>
                                                    <span className="text-xs font-bold text-slate-500 line-through">₹{(product.original_price || Math.round(product.selling_price * 1.15)).toLocaleString()}</span>
                                                    <span className="text-xs font-black text-green-400">{discount}% OFF</span>
                                                </div>
                                                <button onClick={() => handleAddToCart(product)} disabled={product.stock_quantity === 0}
                                                    className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isAdded ? 'bg-green-500 text-white scale-95' : product.stock_quantity === 0 ? 'bg-white/5 text-slate-500 cursor-not-allowed' : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950'}`}
                                                >
                                                    {isAdded ? '✓ Added to Cart!' : product.stock_quantity === 0 ? 'Out of Stock' : <><ShoppingCart size={13} /> Add to Cart</>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ===== CART TAB ===== */}
                {activeTab === 'cart' && (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <ShoppingCart size={24} className="text-cyan-400" /> Shopping Cart
                            <span className="text-slate-500 text-base font-bold">({cartCount} items)</span>
                        </h2>
                        {cart.length === 0 ? (
                            <div className="py-20 text-center bg-white/3 border border-white/5 rounded-3xl">
                                <ShoppingCart size={56} className="text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-300 font-bold text-lg">Your cart is empty</p>
                                <p className="text-slate-500 text-sm mt-2 mb-6">Browse products and add items to your cart</p>
                                <button onClick={() => setActiveTab('shop')} className="px-6 py-3 bg-cyan-500 text-slate-950 font-black rounded-2xl text-sm hover:bg-cyan-400 transition-all">
                                    Browse Products
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="bg-white/3 border border-white/5 rounded-2xl p-5 flex gap-4 items-center">
                                        <img src={item.image_url || 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=100'} alt={item.product_name}
                                            className="h-20 w-20 object-cover rounded-xl bg-slate-800 flex-shrink-0"
                                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=100'; }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-cyan-400 font-black uppercase tracking-widest">{item.category}</p>
                                            <h3 className="text-white font-bold text-sm line-clamp-1 mt-0.5">{item.product_name}</h3>
                                            <p className="text-slate-500 text-xs mt-0.5">Unit: ₹{Number(item.selling_price).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updateCartQty(item.id, item.quantity - 1)} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"><Minus size={14} /></button>
                                            <span className="text-white font-black w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateCartQty(item.id, item.quantity + 1)} className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"><Plus size={14} /></button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-black text-lg">₹{(Number(item.selling_price) * item.quantity).toLocaleString()}</p>
                                            <button onClick={() => removeFromCart(item.id)} className="text-rose-400 hover:text-rose-300 text-xs font-bold mt-1 transition-colors flex items-center gap-1">
                                                <X size={12} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Order Summary */}
                                <div className="bg-white/3 border border-white/5 rounded-2xl p-6 space-y-4">
                                    <h3 className="text-lg font-black text-white">Order Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-slate-400"><span>Subtotal ({cartCount} items)</span><span className="text-white font-bold">₹{cartTotal.toLocaleString()}</span></div>
                                        <div className="flex justify-between text-slate-400"><span>GST (18%)</span><span className="text-white font-bold">₹{Math.round(cartTotal * 0.18).toLocaleString()}</span></div>
                                        <div className="flex justify-between text-slate-400"><span>Delivery</span><span className="text-green-400 font-bold">FREE</span></div>
                                        <div className="flex justify-between text-xl font-black text-white border-t border-white/10 pt-3 mt-3">
                                            <span>Grand Total</span>
                                            <span className="text-cyan-400">₹{Math.round(cartTotal * 1.18).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowCheckout(true)} className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-2xl uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2">
                                        <Shield size={16} /> Proceed to Secure Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== MY ORDERS TAB ===== */}
                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <Package size={24} className="text-cyan-400" /> My Orders
                        </h2>
                        {userOrders.length === 0 ? (
                            <div className="py-20 text-center bg-white/3 border border-white/5 rounded-3xl">
                                <Package size={56} className="text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-300 font-bold text-lg">No orders placed yet</p>
                                <p className="text-slate-500 text-sm mt-2 mb-6">Browse products and place your first order</p>
                                <button onClick={() => setActiveTab('shop')} className="px-6 py-3 bg-cyan-500 text-slate-950 font-black rounded-2xl text-sm hover:bg-cyan-400 transition-all">
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {userOrders.map(order => (
                                    <div key={order.id} className="bg-white/3 border border-white/5 rounded-3xl p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span className="text-cyan-400 font-black text-sm">{order.id}</span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status] || 'bg-white/10 text-white'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-xs mt-1">Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-slate-400 text-xs">{(order.OrderItems || order.items || []).length} item{(order.OrderItems || order.items || []).length !== 1 ? 's' : ''}</p>
                                                    <p className="text-white font-black text-lg">₹{Number(order.total_amount || order.grandTotal || 0).toLocaleString()}</p>
                                                </div>
                                                <button onClick={() => setInvoiceOrder(order)} className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-black text-xs hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-2">
                                                    <FileText size={14} /> Invoice
                                                </button>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="space-y-2 mb-5">
                                            {(order.OrderItems || order.items || []).slice(0, 2).map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm">
                                                    <img src={item.image_url || 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=50'} alt={item.product_name}
                                                        className="h-10 w-10 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                                                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=50'; }}
                                                    />
                                                    <span className="text-slate-300 flex-1 line-clamp-1">{item.product_name}</span>
                                                    <span className="text-slate-500">x{item.quantity}</span>
                                                    <span className="text-white font-bold">₹{(Number(item.price || item.selling_price) * item.quantity).toLocaleString()}</span>
                                                </div>
                                            ))}
                                            {(order.OrderItems || order.items || []).length > 2 && <p className="text-slate-500 text-xs">+{(order.OrderItems || order.items || []).length - 2} more item(s)</p>}
                                        </div>

                                        {/* Tracking */}
                                        <div className="bg-white/3 border border-white/5 rounded-2xl p-4">
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><Truck size={14} /> Order Tracking</p>
                                            <OrderTracker order={{ tracking: [{ status: 'Order Placed', done: true }, { status: 'Processing', done: order.status !== 'Pending' }, { status: 'Shipped', done: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) }, { status: 'Out for Delivery', done: ['Out for Delivery', 'Delivered'].includes(order.status) }, { status: 'Delivered', done: order.status === 'Delivered' }] }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ===== PROFILE TAB ===== */}
                {activeTab === 'profile' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-black mb-6">Profile & Settings</h2>
                        <div className="bg-white/3 border border-white/5 rounded-3xl p-8 space-y-6">
                            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">{user?.name}</h3>
                                    <p className="text-slate-400 text-sm">{user?.email}</p>
                                    <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest">Customer</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Full Name</label>
                                    <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Email</label>
                                    <input type="email" defaultValue={user?.email} readOnly className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/10 text-slate-400 font-bold text-sm outline-none cursor-not-allowed" />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Default Shipping Address</label>
                                    <textarea rows="3" defaultValue="123 Tech Park, Unity City, Maharashtra - 411001" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-bold text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-widest transition-all">Save Changes</button>
                                <button onClick={() => navigate('/')} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                                    <Home size={14} /> Go to Store
                                </button>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-white/3 rounded-2xl p-4">
                                        <p className="text-2xl font-black text-white">{userOrders.length}</p>
                                        <p className="text-slate-400 text-xs font-bold mt-1">Total Orders</p>
                                    </div>
                                    <div className="bg-white/3 rounded-2xl p-4">
                                        <p className="text-2xl font-black text-cyan-400">₹{userOrders.reduce((s, o) => s + o.grandTotal, 0).toLocaleString()}</p>
                                        <p className="text-slate-400 text-xs font-bold mt-1">Total Spent</p>
                                    </div>
                                    <div className="bg-white/3 rounded-2xl p-4">
                                        <p className="text-2xl font-black text-green-400">{userOrders.filter(o => o.status === 'Confirmed').length}</p>
                                        <p className="text-slate-400 text-xs font-bold mt-1">Active Orders</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== MAINTENANCE / SUPPORT TAB ===== */}
                {activeTab === 'maintenance' && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black mb-3 flex items-center justify-center gap-3">
                                <Wrench size={32} className="text-cyan-400" /> Maintenance & Support
                            </h2>
                            <p className="text-slate-400 text-sm">Need help with your appliances? Request a repair, track AMC contracts, or claim warranty.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Request Repair */}
                            <div className="bg-white/3 border border-white/5 hover:border-cyan-500/30 rounded-3xl p-8 space-y-4 transition-all">
                                <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4">
                                    <PenTool size={28} className="text-cyan-400" />
                                </div>
                                <h3 className="text-xl font-black text-white">Book a Repair Service</h3>
                                <p className="text-slate-400 text-sm pb-4 border-b border-white/5">Our certified engineers provide quick solutions for TV, Fridge, AC, and complex electronics. Home visits available within 24 hours.</p>
                                <button className="w-full py-4 bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-black rounded-2xl text-sm transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Plus size={16} /> New Service Request
                                </button>
                            </div>

                            {/* Active AMC and Warranty */}
                            <div className="bg-white/3 border border-white/5 hover:border-cyan-500/30 rounded-3xl p-8 space-y-4 transition-all">
                                <div className="h-14 w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
                                    <Shield size={28} className="text-rose-400" />
                                </div>
                                <h3 className="text-xl font-black text-white">Active Warranty & AMC</h3>
                                <p className="text-slate-400 text-sm pb-4 border-b border-white/5">You have <span className="text-white font-bold opacity-100">1 Appliance</span> currently covered under Unity Annual Maintenance Contract (AMC).</p>
                                <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/10">
                                    <div>
                                        <p className="text-white font-bold text-sm">Samsung 43" Smart TV</p>
                                        <p className="text-slate-400 text-xs">Warranty valid till Oct 2027</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Service Tickets */}
                        <div className="bg-white/3 border border-white/5 rounded-3xl p-8">
                            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2"><LifeBuoy size={20} className="text-cyan-400" /> Recent Service Tickets</h3>
                            
                            <div className="space-y-4">
                                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="text-cyan-400 font-black text-sm">SRV-89410</span>
                                            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full">In Progress</span>
                                        </div>
                                        <h4 className="text-white font-bold text-sm mt-2">LG Double Door Refrigerator - Cooling Issue</h4>
                                        <p className="text-slate-400 text-xs mt-1">Reported on 14 Apr 2026</p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-slate-300 text-xs font-bold mb-1"><AlertTriangle size={12} className="inline mr-1 text-slate-500" /> Assigned to: Technician Rohan</p>
                                        <p className="text-cyan-400 text-xs font-black">Estimated Visit: Today, 3PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8 p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
                            <p className="text-slate-300 text-sm mb-2 font-bold">Having an emergency? Call our 24/7 dedicated support helpline.</p>
                            <a href="tel:1800123456" className="text-cyan-400 font-black text-2xl tracking-widest">1800-UNITY-CARE</a>
                        </div>
                    </div>
                )}
            </main>

            {/* Modals */}
            {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} onSuccess={handleOrderSuccess} />}
            {showSuccess && lastOrder && (
                <OrderSuccess
                    order={lastOrder}
                    onViewOrders={() => { setShowSuccess(false); setActiveTab('orders'); }}
                    onContinue={() => { setShowSuccess(false); setActiveTab('shop'); }}
                />
            )}
            {invoiceOrder && <Invoice order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
            
            {/* Footer / Customer Support */}
            <footer className="w-full bg-[#03060c] border-t border-white/5 py-12 px-6 px-12 lg:px-24 mt-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-black text-sm">UE</span>
                            </div>
                            <div>
                                <h1 className="font-black text-lg text-white">Unity Electronics</h1>
                                <p className="text-[9px] font-black uppercase tracking-widest text-cyan-500/70">Authorised Store</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 font-medium">Your 1-stop premium marketplace for authentic electronics, household appliances, and advanced gadgets.</p>
                        <div className="flex items-center gap-3 pt-2">
                            <a href="#" className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-all"><Facebook size={14} /></a>
                            <a href="#" className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-all"><Instagram size={14} /></a>
                            <a href="#" className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-all"><Twitter size={14} /></a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-black text-white text-sm uppercase tracking-widest mb-4">Customer Support</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-400">123 Horizon Tower, Unity Mall Road, Tech SEZ, Maharashtra 411014</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-cyan-400 shrink-0" />
                                <div>
                                    <p className="text-sm text-slate-400">+91 98765 43210</p>
                                    <p className="text-xs text-slate-500 font-bold">Owner: Samarth R. Shinde</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-cyan-400 shrink-0" />
                                <p className="text-sm text-slate-400">support@unityelectronics.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm font-medium text-slate-400">
                        <h3 className="font-black text-white text-sm uppercase tracking-widest mb-4">Quick Links</h3>
                        <p className="hover:text-cyan-400 cursor-pointer transition-colors">Privacy Policy</p>
                        <p className="hover:text-cyan-400 cursor-pointer transition-colors">Return & Refund Info</p>
                        <p className="hover:text-cyan-400 cursor-pointer transition-colors">Track Orders</p>
                        <p className="hover:text-cyan-400 cursor-pointer transition-colors">Store Locator & Timings</p>
                    </div>

                    <div className="space-y-4 text-sm">
                        <h3 className="font-black text-white text-sm uppercase tracking-widest mb-4">Stay Updates</h3>
                        <p className="text-slate-400">Join our mailing list to receive the latest deals and exclusive offers on premium tech!</p>
                        <div className="flex">
                            <input type="text" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-l-xl px-4 py-2 outline-none focus:border-cyan-500/50 text-white" />
                            <button className="bg-cyan-500 text-slate-950 font-black px-4 rounded-r-xl tracking-widest uppercase text-xs hover:bg-cyan-400">Join</button>
                        </div>
                    </div>
                </div>
            </footer>
            
            <Chatbot />
        </div>
    );
};

export default UserShop;
