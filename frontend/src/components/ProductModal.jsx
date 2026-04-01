import React, { useState, useEffect } from 'react';
import { X, Image, Search, RefreshCw, CheckCircle } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';

// ── Real Unsplash photo library for electronics appliances ────────────────────
const PRODUCT_IMAGES = {
    'AC': [
        'https://images.unsplash.com/photo-1631680882998-41be225ad5b4?w=400&q=80',
        'https://images.unsplash.com/photo-1721479684861-bbffa8ff4aff?w=400&q=80',
        'https://images.unsplash.com/photo-1583675587553-90e9edd6df18?w=400&q=80',
    ],
    'Television': [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80',
        'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=400&q=80',
        'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&q=80',
    ],
    'Refrigerator': [
        'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80',
        'https://images.unsplash.com/photo-1571175330038-a6571b09f4bc?w=400&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    ],
    'Washing Machine': [
        'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=80',
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
        'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&q=80',
    ],
    'Fan': [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
        'https://images.unsplash.com/photo-1600077106724-946750eeaf3c?w=400&q=80',
        'https://images.unsplash.com/photo-1646753522408-077ef9839300?w=400&q=80',
    ],
    'Geyser': [
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80',
        'https://images.unsplash.com/photo-1605493725784-0a76d428f4e7?w=400&q=80',
    ],
    'Microwave': [
        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80',
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
        'https://images.unsplash.com/photo-1607269862764-72d3c48e1a4d?w=400&q=80',
    ],
    'Stabilizer': [
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80',
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
        'https://images.unsplash.com/photo-1620714223084-8fcacc2523c5?w=400&q=80',
    ],
    'Default': [
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80',
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
        'https://images.unsplash.com/photo-1605493725784-0a76d428f4e7?w=400&q=80',
    ],
};

const CATEGORIES = [
    'AC',
    'Television',
    'Refrigerator',
    'Washing Machine',
    'Fan',
    'Geyser',
    'Microwave',
    'Stabilizer',
    'Speaker / Sound System',
    'Mixer Grinder',
    'Inverter / UPS',
    'Iron',
    'Other Appliance',
];

const GST_RATES = ['5', '12', '18', '28'];

const getImagesForCategory = (category) => {
    const key = Object.keys(PRODUCT_IMAGES).find(k =>
        category && category.toLowerCase().includes(k.toLowerCase())
    );
    return PRODUCT_IMAGES[key || 'Default'];
};

const ProductModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        product_name: '', category: '', barcode: '',
        purchase_price: '', selling_price: '', stock_quantity: '',
        gst_percentage: '18', image_url: '', has_serial_number: false,
    });
    const [showPhotoChooser, setShowPhotoChooser] = useState(false);
    const [imgError, setImgError]                 = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData, gst_percentage: initialData.gst_percentage || '18' });
        } else {
            setFormData({
                product_name: '', category: '', barcode: '',
                purchase_price: '', selling_price: '', stock_quantity: '',
                gst_percentage: '18', image_url: '', has_serial_number: false,
            });
        }
        setShowPhotoChooser(false);
        setImgError(false);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (name === 'category') setShowPhotoChooser(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const selectPhoto = (url) => {
        setFormData(prev => ({ ...prev, image_url: url }));
        setShowPhotoChooser(false);
        setImgError(false);
    };

    const suggestedImages = getImagesForCategory(formData.category);

    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-100 placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all";
    const labelClass = "block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5";

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/10 max-h-[92vh] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center px-7 py-5 border-b border-white/5 flex-shrink-0 bg-gradient-to-r from-primary/10 to-transparent">
                    <div>
                        <h3 className="text-lg font-black text-white">
                            {initialData ? '✏️ Edit Product' : '➕ Add New Product'}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                            Real product images · GST compliant · Inventory tracking
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-7 space-y-6">

                        {/* ── Photo Gallery Section ─────────────────────────── */}
                        <div>
                            <label className={labelClass}>📸 Product Photo</label>

                            {/* Preview area */}
                            <div className="flex gap-4 items-start">
                                <div className="h-28 w-28 rounded-2xl border-2 border-dashed border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center bg-slate-800 relative">
                                    {formData.image_url && !imgError ? (
                                        <img
                                            src={formData.image_url}
                                            alt="Product"
                                            className="h-full w-full object-cover"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <Image size={28} className="text-slate-600 mx-auto mb-1" />
                                            <p className="text-[9px] text-slate-600 font-bold">No Image</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-3">
                                    {/* Suggested images by category */}
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold mb-2">
                                            📷 Real appliance photos — click to select:
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {suggestedImages.map((url, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => selectPhoto(url)}
                                                    className={`relative h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${formData.image_url === url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-700 hover:border-slate-500'}`}
                                                >
                                                    <img src={url} alt={`Option ${i + 1}`} className="h-full w-full object-cover" />
                                                    {formData.image_url === url && (
                                                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                                            <CheckCircle size={16} className="text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Manual URL */}
                                    <div>
                                        <p className="text-[10px] text-slate-600 font-bold mb-1">Or paste a custom image URL:</p>
                                        <input
                                            name="image_url"
                                            value={formData.image_url}
                                            onChange={e => { handleChange(e); setImgError(false); }}
                                            placeholder="https://images.unsplash.com/..."
                                            className={inputClass + " text-xs"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Basic Info ────────────────────────────────────── */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Product Name *</label>
                                <input name="product_name" value={formData.product_name} onChange={handleChange} required
                                    placeholder="e.g. Samsung 1.5T Inverter AC"
                                    className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Category *</label>
                                <select name="category" value={formData.category} onChange={handleChange} required
                                    className={inputClass + " cursor-pointer"}>
                                    <option value="">— Choose Category —</option>
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Barcode / SKU</label>
                                <input name="barcode" value={formData.barcode || ''} onChange={handleChange}
                                    placeholder="Scan or type barcode..."
                                    className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>GST Rate %</label>
                                <select name="gst_percentage" value={formData.gst_percentage} onChange={handleChange}
                                    className={inputClass + " cursor-pointer"}>
                                    {GST_RATES.map(r => (
                                        <option key={r} value={r}>{r}% GST</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* ── Pricing ───────────────────────────────────────── */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Purchase Price ₹ *</label>
                                <input type="number" name="purchase_price" value={formData.purchase_price} onChange={handleChange} required
                                    placeholder="0.00" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Selling Price ₹ *</label>
                                <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} required
                                    placeholder="0.00" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Stock Quantity *</label>
                                <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required
                                    placeholder="0" className={inputClass} />
                            </div>
                        </div>

                        {/* Margin display */}
                        {formData.purchase_price && formData.selling_price && (
                            <div className="flex gap-4">
                                {[
                                    { label: 'Profit/Unit', val: `₹${(Number(formData.selling_price) - Number(formData.purchase_price)).toLocaleString()}`, color: 'text-emerald-400' },
                                    { label: 'Margin', val: `${((Number(formData.selling_price) - Number(formData.purchase_price)) / Number(formData.selling_price) * 100).toFixed(1)}%`, color: 'text-blue-400' },
                                    { label: 'MRP (incl. GST)', val: `₹${(Number(formData.selling_price) * (1 + Number(formData.gst_percentage) / 100)).toFixed(0)}`, color: 'text-yellow-400' },
                                ].map(s => (
                                    <div key={s.label} className="flex-1 p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{s.label}</p>
                                        <p className={`font-black text-sm mt-0.5 ${s.color}`}>{s.val}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Serial number tracking */}
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <input
                                type="checkbox"
                                id="has_serial_number"
                                name="has_serial_number"
                                checked={!!formData.has_serial_number}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-slate-700 text-blue-600 accent-blue-600 cursor-pointer"
                            />
                            <div>
                                <label htmlFor="has_serial_number" className="text-sm font-black text-slate-200 cursor-pointer">
                                    Requires Serial Number Tracking
                                </label>
                                <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                                    Enable for high-value items (AC, TV, Refrigerator). Tracks individual units sold.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-7 py-5 border-t border-white/5 flex justify-end gap-3 flex-shrink-0">
                    <button type="button" onClick={onClose}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-black text-sm rounded-2xl transition-all">
                        Cancel
                    </button>
                    <button type="submit" onClick={handleSubmit}
                        className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-primary/20">
                        {initialData ? '✅ Update Product' : '✅ Save Product'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
