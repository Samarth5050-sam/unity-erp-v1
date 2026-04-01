import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, User, X, Mail, Phone, MapPin, ShoppingBag, ChevronRight, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSales, setCustomerSales] = useState([]);
    const [salesLoading, setSalesLoading] = useState(false);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch { console.error('Error fetching customers'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const fetchCustomerSales = async (customerId) => {
        setSalesLoading(true);
        try {
            const res = await api.get(`/sales?customer_id=${customerId}`);
            // Filter by this customer from all sales
            setCustomerSales(res.data.filter(s => s.customer_id == customerId));
        } catch { setCustomerSales([]); }
        finally { setSalesLoading(false); }
    };

    const handleSelectCustomer = (customer) => {
        if (selectedCustomer?.id === customer.id) {
            setSelectedCustomer(null);
            setCustomerSales([]);
        } else {
            setSelectedCustomer(customer);
            fetchCustomerSales(customer.id);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/customers', newCustomer);
            setShowModal(false);
            setNewCustomer({ name: '', phone: '', email: '', address: '' });
            fetchCustomers();
        } catch { alert('Error adding customer'); }
    };

    const filtered = customers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    const totalSpend = customerSales.reduce((sum, s) => sum + parseFloat(s.total_amount || 0), 0);

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Customers</h1>
                    <p className="text-muted-foreground mt-1">Manage your customer relationships — {customers.length} total</p>
                </div>
                <Button onClick={() => setShowModal(true)} className="gap-2">
                    <Plus size={18} /> Add Customer
                </Button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Customers', value: customers.length, icon: User, color: 'blue' },
                    { label: 'Active (Bought 1+)', value: customers.filter(c => c.Sales?.length > 0).length, icon: ShoppingBag, color: 'green' },
                    { label: 'Top Loyalty Pts', value: Math.max(...customers.map(c => c.loyalty_points || 0), 0), icon: TrendingUp, color: 'yellow' },
                ].map(s => {
                    const colorMap = { blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30', green: 'bg-green-100 text-green-600 dark:bg-green-900/30', yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' };
                    return (
                        <Card key={s.label} className="border-border">
                            <CardContent className="pt-5 flex items-center gap-4">
                                <div className={`p-3 rounded-full ${colorMap[s.color]}`}><s.icon size={20} /></div>
                                <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Search */}
            <div className="max-w-md">
                <Input placeholder="Search by name or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} icon={Search} />
            </div>

            <div className={`grid gap-6 ${selectedCustomer ? 'lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {/* Customer List */}
                <div className={`${selectedCustomer ? 'lg:col-span-2' : 'col-span-full'} grid grid-cols-1 md:grid-cols-2 ${selectedCustomer ? '' : 'lg:grid-cols-3'} gap-4 content-start`}>
                    {loading ? (
                        [1, 2, 3].map(i => <Card key={i} className="h-40 animate-pulse bg-muted/50" />)
                    ) : (
                        filtered.map(customer => (
                            <Card
                                key={customer.id}
                                onClick={() => handleSelectCustomer(customer)}
                                className={`cursor-pointer transition-all duration-200 border-border hover:shadow-lg ${selectedCustomer?.id === customer.id ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/30'}`}
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-full shrink-0">
                                            <User className="text-blue-600" size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-foreground truncate">{customer.name}</h3>
                                                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1"><Phone size={12} /> {customer.phone}</div>
                                            {customer.email && <div className="flex items-center text-sm text-muted-foreground gap-1"><Mail size={12} /> <span className="truncate">{customer.email}</span></div>}
                                            {customer.address && <div className="flex items-center text-sm text-muted-foreground gap-1"><MapPin size={12} /> <span className="truncate">{customer.address}</span></div>}
                                            <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                🏆 {customer.loyalty_points || 0} pts
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                    {!loading && filtered.length === 0 && (
                        <div className="col-span-full text-center py-16 text-muted-foreground">
                            <User className="mx-auto mb-3 opacity-30" size={48} />
                            <p>No customers found.</p>
                        </div>
                    )}
                </div>

                {/* CRM Side Panel */}
                {selectedCustomer && (
                    <div className="lg:col-span-1 space-y-4">
                        <Card className="border-primary/40 border shadow-lg">
                            <div className="p-4 border-b border-border bg-primary/5 flex items-center justify-between">
                                <h3 className="font-bold text-foreground">{selectedCustomer.name}</h3>
                                <button onClick={() => setSelectedCustomer(null)} className="text-muted-foreground hover:text-foreground">
                                    <X size={18} />
                                </button>
                            </div>
                            <CardContent className="p-4 space-y-3 text-sm">
                                <div className="flex gap-2 items-center text-muted-foreground"><Phone size={14} />{selectedCustomer.phone}</div>
                                {selectedCustomer.email && <div className="flex gap-2 items-center text-muted-foreground"><Mail size={14} />{selectedCustomer.email}</div>}
                                {selectedCustomer.address && <div className="flex gap-2 items-center text-muted-foreground"><MapPin size={14} />{selectedCustomer.address}</div>}

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-muted-foreground">Total Orders</p>
                                        <p className="text-xl font-bold text-foreground">{customerSales.length}</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-muted-foreground">Total Spent</p>
                                        <p className="text-xl font-bold text-primary">₹{totalSpend.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>

                                {/* Dynamic Google Map for Customer Address */}
                                {selectedCustomer.address && (
                                    <div className="mt-4 border border-white/5 rounded-xl overflow-hidden h-36">
                                        <iframe
                                            title="Customer Location"
                                            src={`https://www.google.com/maps?q=${encodeURIComponent(selectedCustomer.address || 'Maharashtra')}&output=embed`}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(90%)' }}
                                            allowFullScreen=""
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Purchase History */}
                        <Card className="border-border">
                            <div className="p-4 border-b border-border">
                                <h4 className="font-semibold text-foreground flex items-center gap-2"><ShoppingBag size={16} />Purchase History</h4>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {salesLoading ? (
                                    <p className="text-center p-6 text-muted-foreground text-sm">Loading...</p>
                                ) : customerSales.length === 0 ? (
                                    <p className="text-center p-6 text-muted-foreground text-sm">No purchases yet.</p>
                                ) : (
                                    customerSales.map(sale => (
                                        <div key={sale.id} className="flex justify-between items-center p-3 border-b border-border/50 hover:bg-muted/20 transition-colors">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{sale.invoice_number}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(sale.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className="font-bold text-sm text-primary">₹{parseFloat(sale.total_amount).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-background rounded-xl shadow-2xl w-full max-w-md border border-border animate-slideUp">
                        <div className="flex justify-between items-center p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground">Add New Customer</h2>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            <Input label="Full Name" placeholder="Customer name" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} required />
                            <Input label="Phone" placeholder="9876543210" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} required />
                            <Input label="Email" placeholder="email@example.com" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                            <div>
                                <label className="text-sm font-medium leading-none mb-2 block">Address</label>
                                <textarea
                                    placeholder="Enter address..."
                                    value={newCustomer.address}
                                    onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[70px]"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">Save Customer</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
