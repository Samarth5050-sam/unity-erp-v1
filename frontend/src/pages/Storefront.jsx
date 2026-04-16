import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { ShoppingBag, Search, Shield, Sparkles, ChevronRight, LogIn, User, ShoppingCart, X, Plus, Minus, Star, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Mic, QrCode, BrainCircuit, Scale } from 'lucide-react';
import Chatbot from '../components/Chatbot';
import { PRODUCT_CATALOG } from '../data/products';

// Static product fallback (shows when backend is offline)
const FALLBACK_PRODUCTS = [
    { id: 'f1', product_name: 'Samsung Neo QLED 55" 4K TV', category: 'Television', selling_price: 89990, stock_quantity: 8, image_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400' },
    { id: 'f2', product_name: 'LG Inverter Double Door Refrigerator 343L', category: 'Refrigerator', selling_price: 42990, stock_quantity: 12, image_url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400' },
    { id: 'f3', product_name: 'Daikin 1.5T 5-Star Inverter Split AC', category: 'Air Conditioner', selling_price: 38999, stock_quantity: 6, image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400' },
    { id: 'f4', product_name: 'Apple MacBook Pro M3 14-inch', category: 'Laptop', selling_price: 199900, stock_quantity: 4, image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { id: 'f5', product_name: 'Samsung Galaxy S24 Ultra 256GB', category: 'Mobile Phone', selling_price: 129999, stock_quantity: 15, image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400' },
    { id: 'f6', product_name: 'Sony WH-1000XM5 Wireless Headphones', category: 'Audio', selling_price: 29990, stock_quantity: 20, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { id: 'f7', product_name: 'Whirlpool 7kg Front Load Washing Machine', category: 'Washing Machine', selling_price: 34990, stock_quantity: 9, image_url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400' },
    { id: 'f8', product_name: 'Samsung Galaxy Tab S9 Ultra', category: 'Tablet', selling_price: 99999, stock_quantity: 7, image_url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400' },
    { id: 'f9', product_name: 'LG 32L All-in-One Microwave Oven', category: 'Microwave', selling_price: 18990, stock_quantity: 11, image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400' },
    { id: 'f10', product_name: 'Apple Watch Series 9 GPS 41mm', category: 'Smartwatch', selling_price: 41900, stock_quantity: 18, image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400' },
    { id: 'f11', product_name: 'Bosch 8kg Series 6 Washing Machine', category: 'Washing Machine', selling_price: 52990, stock_quantity: 5, image_url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400' },
    { id: 'f12', product_name: 'Dell XPS 15 i9 32GB OLED Laptop', category: 'Laptop', selling_price: 189990, stock_quantity: 3, image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400' },
];

const CartDrawer = ({ isOpen, onClose }) => {
    const { cart, cartTotal, removeFromCart, updateCartQty, cartCount } = useOrders();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) { navigate('/login'); return; }
        onClose();
        navigate('/user/shop?checkout=1');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200]" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
                className="absolute right-0 top-0 h-full w-full max-w-[420px] bg-[#0a0f1e] border-l border-white/10 flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-black text-white">Your Cart</h2>
                        <p className="text-xs text-slate-400 font-bold">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 && (
                        <div className="py-20 text-center">
                            <ShoppingCart size={48} className="text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">Your cart is empty</p>
                            <p className="text-slate-500 text-sm mt-1">Add products to get started</p>
                        </div>
                    )}
                    {cart.map(item => (
                        <div key={item.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4">
                            <img
                                src={item.image_url || 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=80'}
                                alt={item.product_name}
                                className="w-16 h-16 object-cover rounded-xl bg-slate-800 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm line-clamp-2 mb-1">{item.product_name}</p>
                                <p className="text-cyan-400 font-black">₹{Number(item.selling_price).toLocaleString()}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <button onClick={() => updateCartQty(item.id, item.quantity - 1)} className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                                        <Minus size={12} />
                                    </button>
                                    <span className="text-white font-black text-sm w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateCartQty(item.id, item.quantity + 1)} className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                                        <Plus size={12} />
                                    </button>
                                    <button onClick={() => removeFromCart(item.id)} className="ml-auto text-rose-400 hover:text-rose-300 text-xs font-bold transition-colors">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-white/10 space-y-4">
                        <div className="flex justify-between text-sm font-bold text-slate-400">
                            <span>Subtotal</span>
                            <span className="text-white">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-slate-400">
                            <span>GST (18%)</span>
                            <span className="text-white">₹{Math.round(cartTotal * 0.18).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xl font-black text-white border-t border-white/10 pt-4">
                            <span>Total</span>
                            <span className="text-cyan-400">₹{Math.round(cartTotal * 1.18).toLocaleString()}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                        >
                            Proceed to Checkout <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const Storefront = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart, cartCount } = useOrders();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [cartOpen, setCartOpen] = useState(false);
    const [addedId, setAddedId] = useState(null);

    // Advanced UI Features State
    const [compareList, setCompareList] = useState([]);
    const [showCompare, setShowCompare] = useState(false);
    const [aiVerdict, setAiVerdict] = useState(null);
    const [isListening, setIsListening] = useState(false);

    const handleVoiceSearch = () => {
        setIsListening(true);
        setTimeout(() => {
            setIsListening(false);
            setSearchTerm('OLED');
        }, 2000); // Mocks translating voice to 'OLED'
    };

    const toggleCompare = (product) => {
        setCompareList(prev => {
            if (prev.find(p => p.id === product.id)) return prev.filter(p => p.id !== product.id);
            if (prev.length >= 3) return prev; // max 3 to compare
            return [...prev, product];
        });
    };

    const handleAiVerdict = (product) => {
        // Simple heuristic for mock AI
        const discount = product.original_price ? Math.round((1 - product.selling_price / product.original_price) * 100) : 15;
        const score = product.rating * 20;
        let verdict = '';
        if (score > 90 && discount > 15) verdict = `Strong Buy. Excellent rating (${product.rating}⭐) combined with a high discount (${discount}% OFF). Highly recommended by AI.`;
        else if (score > 85) verdict = `Good Buy. Solid ${product.rating}⭐ rating ensures quality, though discount is standard.`;
        else verdict = `Neutral. Might want to wait for a larger price drop or explore other ${product.category}.`;
        
        setAiVerdict({ product, text: verdict });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                const data = Array.isArray(res.data) ? res.data : (res.data?.rows || []);
                const merged = PRODUCT_CATALOG.map(p => ({ ...p }));
                const extra = data.filter(bp => !PRODUCT_CATALOG.find(cp => cp.product_name === bp.product_name));
                setProducts([...merged, ...extra.map(bp => ({ ...bp, id: bp.id || bp.product_name, rating: 4.2, reviews: 100 }))]);
            } catch {
                setProducts(PRODUCT_CATALOG);
            }
        };
        fetchProducts();
    }, []);

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        return matchesSearch && matchesCategory;
    }).slice(0, 60);

    const handleAddToCart = (product) => {
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    return (
        <div className="min-h-screen bg-[#050B14] text-white font-sans overflow-x-hidden selection:bg-cyan-500/20">
            {/* Animated BG */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[180px]" />
                <div className="absolute top-[50%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[180px]" />
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full z-[100] backdrop-blur-xl bg-[#050B14]/80 border-b border-white/5 px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo(0,0)}>
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                        <span className="text-white font-black text-sm">UE</span>
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="font-black text-lg text-white leading-tight tracking-tight">Unity Store</h1>
                        <p className="text-[9px] font-black uppercase tracking-widest text-cyan-500/70">Premium Electronics</p>
                    </div>
                </div>

                <div className="flex flex-1 max-w-xl mx-4 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search laptops, TVs, mobiles..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-full text-white placeholder-slate-500 transition-all outline-none font-medium text-sm focus:border-cyan-500/50 focus:bg-white/8"
                    />
                    <button 
                        onClick={handleVoiceSearch}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-transparent text-slate-400 hover:text-cyan-400 hover:bg-white/5'}`}
                        title="Voice Search"
                    >
                        <Mic size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {/* QR Code Shopping / Scanner */}
                    <button
                        onClick={() => alert('Camera scanning initialized for QR / AR Shopping.')}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hidden md:flex"
                        title="Scan QR Code"
                    >
                        <QrCode size={18} />
                    </button>
                    {/* Cart Button */}
                    <button
                        onClick={() => setCartOpen(true)}
                        className="relative h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
                    >
                        <ShoppingCart size={18} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-cyan-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {user?.role === 'admin' ? (
                        <button onClick={() => navigate('/admin')} className="h-10 px-5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                            Admin
                        </button>
                    ) : user ? (
                        <button onClick={() => navigate('/user/dashboard')} className="h-10 px-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-black text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-2">
                            <User size={14} /> Dashboard
                        </button>
                    ) : (
                        <button onClick={() => navigate('/login')} className="h-10 px-5 rounded-full bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                            <LogIn size={14} /> Login
                        </button>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-36 pb-16 px-6 sm:px-12 lg:px-24">
                <div className="max-w-4xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-6">
                        <Sparkles size={12} /> Summer Electronics Fest 2026
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] mb-6">
                        Experience the Future of{' '}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Home Technology.</span>
                    </h1>
                    <p className="text-lg text-slate-400 font-medium max-w-2xl mb-8">
                        Browse our exclusive collection of the world's most advanced OLEDs, ultra-fast laptops, and smart home appliances.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
                            className="h-12 px-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2"
                        >
                            <ShoppingBag size={16} /> Shop Now
                        </button>
                        {!user && (
                            <button
                                onClick={() => navigate('/login')}
                                className="h-12 px-8 rounded-full bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest transition-all hover:bg-white/10"
                            >
                                Sign In / Register
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <div className="px-6 md:px-12 lg:px-24 mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Shield, label: 'Genuine Products', sub: '100% Authentic' },
                        { icon: ShoppingBag, label: 'Easy Returns', sub: '7-day return policy' },
                        { icon: Sparkles, label: 'Best Prices', sub: 'Price match guarantee' },
                        { icon: ChevronRight, label: 'Fast Delivery', sub: 'Pan India delivery' },
                    ].map(({ icon: Icon, label, sub }) => (
                        <div key={label} className="bg-white/3 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                                <Icon size={18} className="text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">{label}</p>
                                <p className="text-slate-500 text-xs">{sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="px-6 md:px-12 lg:px-24 mb-8 overflow-x-auto pb-2 flex gap-3" id="products-section">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                            activeCategory === cat
                                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Count */}
            <div className="px-6 md:px-12 lg:px-24 mb-6">
                <p className="text-slate-400 text-sm font-bold">
                    Showing <span className="text-white">{filteredProducts.length}</span> products
                    {activeCategory !== 'All' && <span> in <span className="text-cyan-400">{activeCategory}</span></span>}
                </p>
            </div>

            {/* Product Grid */}
            <section className="px-6 md:px-12 lg:px-24 pb-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, idx) => {
                        const isAdded = addedId === product.id;
                        return (
                            <div
                                key={product.id || idx}
                                className="group relative bg-white/3 hover:bg-white/6 border border-white/5 hover:border-cyan-500/30 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:-translate-y-1"
                            >
                                {/* Badge */}
                                {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                                    <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wide">
                                        Only {product.stock_quantity} left!
                                    </div>
                                )}
                                {product.stock_quantity === 0 && (
                                    <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-wide">
                                        Out of Stock
                                    </div>
                                )}

                                {/* Image */}
                                <div className="h-56 bg-slate-800/40 overflow-hidden flex items-center justify-center p-6">
                                    <img
                                        src={product.image_url || 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400'}
                                        alt={product.product_name}
                                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400'; }}
                                    />
                                </div>

                                {/* Details */}
                                <div className="p-5 flex flex-col flex-1">
                                    <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-1.5">{product.category}</p>
                                    <h3 className="font-bold text-sm text-white leading-snug mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                                        {product.product_name}
                                    </h3>
                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-xl font-black text-white">₹{Number(product.selling_price).toLocaleString()}</span>
                                            <span className="text-xs font-bold text-slate-500 line-through">
                                                ₹{Math.round(Number(product.selling_price) * 1.15).toLocaleString()}
                                            </span>
                                            <span className="text-xs font-black text-green-400">15% OFF</span>
                                        </div>
                                        <div className="grid grid-cols-[1fr_auto] gap-2 mb-2">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.stock_quantity === 0}
                                                className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center justify-center gap-2 ${
                                                    isAdded
                                                        ? 'bg-green-500 text-white scale-95'
                                                        : product.stock_quantity === 0
                                                            ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                                                            : 'bg-cyan-500 border border-cyan-400 text-slate-950 hover:bg-cyan-400'
                                                }`}
                                            >
                                                {isAdded ? '✓ Added!' : product.stock_quantity === 0 ? 'Out of Stock' : <><ShoppingCart size={14} /> Add to Cart</>}
                                            </button>
                                            <button 
                                                onClick={() => toggleCompare(product)}
                                                className={`h-[40px] w-[40px] rounded-2xl flex items-center justify-center transition-all ${compareList.find(p => p.id === product.id) ? 'bg-purple-500 text-white' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-purple-400'}`}
                                                title="Compare"
                                            >
                                                <Scale size={16} />
                                            </button>
                                        </div>
                                        {/* Should I Buy Button */}
                                        <button 
                                            onClick={() => handleAiVerdict(product)}
                                            className="w-full py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                        >
                                            <BrainCircuit size={12} /> Ask AI: Should I Buy?
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <Search size={32} className="text-slate-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white">No products found</h2>
                        <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
                        <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="mt-4 px-6 py-2 rounded-full bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-colors">
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Sticky Compare Bottom Bar */}
                {compareList.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] bg-[#0a0f1e] border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 px-6 py-3 rounded-full flex items-center gap-6 animate-in slide-in-from-bottom-10">
                        <div className="flex items-center gap-2">
                            <Scale size={18} className="text-cyan-400" />
                            <span className="text-white font-black text-sm">{compareList.length} Items</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowCompare(true)} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-full uppercase tracking-widest transition-colors">Compare</button>
                            <button onClick={() => setCompareList([])} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><X size={14} /></button>
                        </div>
                    </div>
                )}
            </section>

            {/* Footer / Customer Support */}
            <footer className="w-full bg-[#03060c] border-t border-white/5 py-12 px-6 px-12 lg:px-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
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

                    {/* Contact & Owner Details */}
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

                    {/* Quick Links */}
                    <div className="space-y-4 text-sm font-medium text-slate-400">
                        <h3 className="font-black text-white text-sm uppercase tracking-widest mb-4">Quick Links</h3>
                        <p className="hover:text-cyan-400 cursor-pointer transition-colors">Privacy Policy</p>
                        <p className="hover:text-cyan-400 cursor-pointer transition-colors">Return & Refund Info</p>
                        <p className="hover:text-cyan-400 cursor-pointer transition-colors">Track Orders</p>
                        <p className="hover:text-cyan-400 cursor-pointer transition-colors">Store Locator & Timings</p>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4 text-sm">
                        <h3 className="font-black text-white text-sm uppercase tracking-widest mb-4">Stay Updates</h3>
                        <p className="text-slate-400">Join our mailing list to receive the latest deals and exclusive offers on premium tech!</p>
                        <div className="flex">
                            <input type="text" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-l-xl px-4 py-2 outline-none focus:border-cyan-500/50 text-white" />
                            <button className="bg-cyan-500 text-slate-950 font-black px-4 rounded-r-xl tracking-widest uppercase text-xs hover:bg-cyan-400">Join</button>
                        </div>
                    </div>
                </div>
            </footer>

            {/* AI Verdict Modal */}
            {aiVerdict && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4" onClick={() => setAiVerdict(null)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative bg-[#0a0f1e] border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)] rounded-3xl w-full max-w-sm p-6 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-bl-full -z-10 blur-xl" />
                        <div className="flex items-center justify-between mb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-full"><BrainCircuit size={12} /> AI Verdict</div>
                            <button onClick={() => setAiVerdict(null)} className="text-slate-500 hover:text-white transition-colors"><X size={16} /></button>
                        </div>
                        <h3 className="text-lg font-black text-white mb-2">{aiVerdict.product.product_name}</h3>
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-slate-300 leading-relaxed font-medium">
                            {aiVerdict.text}
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => { handleAddToCart(aiVerdict.product); setAiVerdict(null); }} className="flex-1 py-3 bg-purple-500 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-purple-400 shadow-lg shadow-purple-500/20">Add to Cart</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Compare Modal */}
            {showCompare && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4" onClick={() => setShowCompare(false)}>
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                    <div className="relative bg-[#0a0f1e] border border-white/10 rounded-3xl w-full max-w-4xl p-6 overflow-x-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <h2 className="text-2xl font-black flex items-center gap-2"><Scale className="text-cyan-400" /> Comparison Arena</h2>
                            <button onClick={() => setShowCompare(false)} className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10"><X size={18} /></button>
                        </div>
                        <div className="grid grid-cols-4 min-w-[700px] gap-4">
                            <div className="text-slate-500 font-black text-xs uppercase tracking-widest space-y-12 pt-[140px]">
                                <div>Price</div>
                                <div>Rating</div>
                                <div>Category</div>
                                <div>Warranty</div>
                            </div>
                            {compareList.map(prod => (
                                <div key={prod.id} className="bg-white/5 rounded-2xl p-4 flex flex-col items-center text-center">
                                    <div className="relative w-full h-24 bg-white/5 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                                        <button onClick={() => toggleCompare(prod)} className="absolute top-1 right-1 h-6 w-6 bg-black/50 rounded-full flex items-center justify-center text-white"><X size={12} /></button>
                                        <img src={prod.image_url} alt="" className="h-20 object-contain" onError={e => e.target.style.display='none'} />
                                    </div>
                                    <h4 className="font-bold text-sm h-10 line-clamp-2 mb-2">{prod.product_name}</h4>
                                    
                                    <div className="space-y-7 w-full text-sm font-bold text-white mt-4">
                                        <div className="text-cyan-400 text-lg">₹{Number(prod.selling_price).toLocaleString()}</div>
                                        <div className="flex justify-center items-center gap-1 text-amber-400">{prod.rating || 4.5} <Star size={14} className="fill-amber-400" /></div>
                                        <div className="text-slate-300 bg-white/5 px-2 py-1 rounded-md">{prod.category}</div>
                                        <div className="text-green-400">{prod.warranty_months || 12} Months</div>
                                    </div>
                                    
                                    <button onClick={() => handleAddToCart(prod)} className="w-full mt-6 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-black uppercase hover:bg-cyan-500 hover:text-slate-900 transition-colors">Add to Cart</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Drawer */}
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
            <Chatbot />
        </div>
    );
};

export default Storefront;
