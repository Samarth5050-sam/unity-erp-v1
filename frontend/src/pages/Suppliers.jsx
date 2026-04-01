import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, X, Truck, Phone, Mail, MapPin, Package, Building2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const emptyForm = { name: '', phone: '', email: '', address: '', gstin: '' };

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null); // for detail panel

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/suppliers');
            setSuppliers(res.data);
        } catch (err) {
            console.error('Error loading suppliers', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSuppliers(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/suppliers', form);
            setShowModal(false);
            setForm(emptyForm);
            fetchSuppliers();
        } catch {
            alert('Error adding supplier');
        }
    };

    const filtered = suppliers.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone?.includes(searchTerm) ||
        s.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
                    <p className="text-muted-foreground mt-1">Manage your vendors and procurement contacts</p>
                </div>
                <Button onClick={() => setShowModal(true)} className="gap-2">
                    <Plus size={18} />
                    Add Supplier
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="border-border">
                    <CardContent className="pt-5 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Building2 className="text-blue-600" size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Suppliers</p>
                            <p className="text-2xl font-bold text-foreground">{suppliers.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border">
                    <CardContent className="pt-5 flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <Package className="text-green-600" size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Suppliers with Products</p>
                            <p className="text-2xl font-bold text-foreground">
                                {suppliers.filter(s => s.Products?.length > 0).length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <Input
                    placeholder="Search by name, phone or GSTIN..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    icon={Search}
                />
            </div>

            {/* Supplier Cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Card key={i} className="h-40 animate-pulse bg-muted/50" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(s => (
                        <Card
                            key={s.id}
                            onClick={() => setSelected(selected?.id === s.id ? null : s)}
                            className={`cursor-pointer transition-all duration-200 border-border hover:shadow-lg hover:border-primary/40 ${selected?.id === s.id ? 'ring-2 ring-primary border-primary' : ''}`}
                        >
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full shrink-0">
                                        <Truck className="text-indigo-600" size={22} />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h3 className="font-bold text-lg text-foreground truncate">{s.name}</h3>
                                        {s.phone && (
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <Phone size={13} /> {s.phone}
                                            </div>
                                        )}
                                        {s.email && (
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <Mail size={13} /> <span className="truncate">{s.email}</span>
                                            </div>
                                        )}
                                        {s.address && (
                                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                <MapPin size={13} /> <span className="truncate">{s.address}</span>
                                            </div>
                                        )}
                                        {s.gstin && (
                                            <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-mono bg-muted text-muted-foreground">
                                                GSTIN: {s.gstin}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-3 text-center py-16 text-muted-foreground">
                            <Truck className="mx-auto mb-3 opacity-30" size={48} />
                            <p>No suppliers found. Add your first supplier!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Supplier Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-background rounded-xl shadow-2xl w-full max-w-md border border-border">
                        <div className="flex justify-between items-center p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground">Add New Supplier</h2>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            <Input label="Company / Supplier Name" placeholder="e.g. Samsung India Pvt Ltd" value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })} required />
                            <Input label="Contact Person" placeholder="e.g. Rajesh Kumar" value={form.contact_person || ''}
                                onChange={e => setForm({ ...form, contact_person: e.target.value })} />
                            <Input label="Phone" placeholder="+91 98765 43210" value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })} />
                            <Input label="Email" placeholder="supplier@example.com" value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })} />
                            <Input label="GSTIN" placeholder="22AAAAA0000A1Z5" value={form.gstin}
                                onChange={e => setForm({ ...form, gstin: e.target.value })} />
                            <div>
                                <label className="text-sm font-medium leading-none mb-2 block">Address</label>
                                <textarea
                                    placeholder="Enter address..."
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[70px]"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Save Supplier</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suppliers;
