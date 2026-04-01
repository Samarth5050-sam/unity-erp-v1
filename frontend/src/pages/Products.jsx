import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import ProductModal from '../components/ProductModal';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAdd = async (productData) => {
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, productData);
            } else {
                await api.post('/products', productData);
            }
            fetchProducts();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving product', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product', error);
            }
        }
    };

    const openModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode?.includes(searchTerm)
    );

    return (
        <div className="space-y-10 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Inventory <span className="gradient-text">Master</span></h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Manage appliance stock & categories</p>
                </div>
                <Button onClick={() => openModal()} className="rounded-2xl px-6 bg-primary shadow-lg shadow-primary/20 flex gap-2 font-bold tracking-tight h-12">
                    <Plus size={18} />
                    Add New Product
                </Button>
            </div>

            <div className="premium-card p-0 shadow-sm overflow-hidden border-white/5">
                <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Active Stock</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Inventory Stream</p>
                    </div>
                    <div className="w-full md:w-96">
                        <Input
                            placeholder="Search code or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={Search}
                            className="bg-white/5 border-white/10 focus:bg-white/10 transition-all duration-300 rounded-xl font-bold"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-t border-white/5">
                        <thead className="bg-slate-50/50 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <tr>
                                <th className="px-8 py-5">Visual</th>
                                <th className="px-8 py-5">Product Identity</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Pricing</th>
                                <th className="px-8 py-5">Stock Level</th>
                                <th className="px-8 py-5 text-right font-black">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="6" className="px-8 py-12 text-center text-slate-500 font-bold">Refreshing inventory stream...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-30">
                                            <Package size={48} className="mb-4" />
                                            <p className="text-sm font-black uppercase tracking-widest">No matching records</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt=""
                                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                ) : (
                                                    <Package size={20} className="text-slate-600" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="font-black text-sm tracking-tight text-foreground">{product.product_name}</div>
                                            <div className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-widest">Ref: {product.barcode || 'N/A'}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center rounded-lg bg-indigo-500/10 px-3 py-1 text-[10px] font-black text-indigo-500 ring-1 ring-inset ring-indigo-500/20 uppercase tracking-widest">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm font-black text-foreground">₹{Number(product.selling_price).toLocaleString()}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-2.5 w-2.5 rounded-full ${product.stock_quantity < 10 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                                                <span className={`text-sm font-black tracking-tight ${product.stock_quantity < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                    {product.stock_quantity} <span className="text-[10px] text-slate-500 font-bold ml-1 uppercase">Units</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => openModal(product)} className="h-10 w-10 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/20">
                                                <Edit size={18} />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="h-10 w-10 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl border border-transparent hover:border-rose-500/20">
                                                <Trash2 size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAdd}
                initialData={editingProduct}
            />
        </div>
    );
};

export default Products;
