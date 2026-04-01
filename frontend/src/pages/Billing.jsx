import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    Search, Trash2, Printer, Plus, Minus, ShoppingCart,
    Share2, CreditCard, Banknote, Smartphone, Package,
    MessageCircle, CheckCircle, QrCode, Zap, IndianRupee
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PaymentGateway from '../components/PaymentGateway';

// ─── Company Constants ──────────────────────────────────────────────────────
const COMPANY = {
    name:      'UNITY ELECTRONICS',
    tagline:   'Premium Home Appliances & Electronics',
    address:   'Ishwarpur, Tal. Walwa, Dist. Sangli, Maharashtra – 415 409',
    phone:     '+91 96993 74346',
    email:     'unityelectronics@gmail.com',
    gstin:     'GSTIN: 27ABCDE1234F1Z5',
    owner:     'Samarth Rajendra Shinde',
    whatsapp:  '919699374346',
    color:     [37, 99, 235],  // RGB for #2563eb
    darkColor: [15, 23, 42],   // slate-950
};

// ─── GST Invoice PDF Generator ───────────────────────────────────────────────
const generateInvoicePDF = (sale, customers, products, selectedCustomer, discount, paymentMethod, download = true) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const PW = 210; // page width
    const [cr, cg, cb] = COMPANY.color;

    // ── HEADER BAND ──────────────────────────────────────────────────────────
    doc.setFillColor(cr, cg, cb);
    doc.rect(0, 0, PW, 52, 'F');

    // Company Logo Symbol (circle with "UE")
    doc.setFillColor(255, 255, 255, 0.15);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.circle(175, 18, 14, 'D');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('UE', 175, 22, { align: 'center' });

    // Company Name & tagline
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY.name, 14, 18);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 210, 255);
    doc.text(COMPANY.tagline, 14, 24);
    doc.text(COMPANY.address, 14, 30);
    doc.text(`Tel: ${COMPANY.phone}  |  ${COMPANY.email}`, 14, 36);
    doc.text(COMPANY.gstin, 14, 42);

    // TAX INVOICE label on right
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 196, 42, { align: 'right' });

    // ── INVOICE META BOX ─────────────────────────────────────────────────────
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 52, PW, 22, 'F');

    doc.setTextColor(cr, cg, cb);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice No: ${sale.invoice_number}`, 14, 60);
    doc.text(`Date: ${new Date(sale.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 14, 66);
    doc.text(`Payment Mode: ${(paymentMethod || 'CASH').toUpperCase()}`, 14, 72);

    doc.text(`Time: ${new Date(sale.createdAt).toLocaleTimeString('en-IN')}`, 100, 60);
    doc.text('Status: PAID ✓', 100, 66);
    doc.text(`Cashier: ${COMPANY.owner}`, 100, 72);

    // ── BILL TO ───────────────────────────────────────────────────────────────
    const cust = customers.find(c => c.id == selectedCustomer);
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 74, PW, 28, 'F');

    doc.setTextColor(cr, cg, cb);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 14, 82);

    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text(cust ? cust.name : 'Walk-in Customer', 14, 89);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    if (cust) {
        doc.text(`Phone: ${cust.phone || '—'}`, 14, 95);
        doc.text(`Address: ${cust.address || 'Local Customer'}`, 14, 100);
    }

    // GSTIN line on right
    doc.setTextColor(100, 100, 100);
    doc.text('Customer GSTIN: —', 135, 89);

    // ── ITEMS TABLE ───────────────────────────────────────────────────────────
    const tableRows = (sale.SaleItems || []).map((item, idx) => {
        const product   = products.find(p => p.id === item.product_id);
        const price     = Number(item.price);
        const qty       = item.quantity;
        const gstPct    = product?.gst_percentage || 18;
        const taxableAmt = price * qty;
        const gstAmt    = taxableAmt * gstPct / 100;
        const total     = taxableAmt + gstAmt;
        return [
            idx + 1,
            product?.product_name || 'Item',
            product?.hsn_code || '8543',
            qty,
            `${gstPct}%`,
            `Rs. ${price.toLocaleString()}`,
            `Rs. ${taxableAmt.toLocaleString()}`,
            `Rs. ${gstAmt.toFixed(2)}`,
            `Rs. ${total.toFixed(2)}`
        ];
    });

    autoTable(doc, {
        head: [['#', 'Description', 'HSN', 'Qty', 'GST%', 'Unit Price', 'Taxable Amt', 'GST Amt', 'Total']],
        body: tableRows,
        startY: 106,
        theme: 'grid',
        headStyles: {
            fillColor: [cr, cg, cb],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'center',
        },
        bodyStyles: { fontSize: 8, textColor: [30, 30, 30] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 8, halign: 'center' },
            1: { cellWidth: 48 },
            2: { cellWidth: 14, halign: 'center' },
            3: { cellWidth: 10, halign: 'center' },
            4: { cellWidth: 12, halign: 'center' },
            5: { cellWidth: 22, halign: 'right' },
            6: { cellWidth: 24, halign: 'right' },
            7: { cellWidth: 20, halign: 'right' },
            8: { cellWidth: 24, halign: 'right' },
        },
        margin: { left: 10, right: 10 },
    });

    const tableEndY = (doc.lastAutoTable?.finalY || 106) + 8;

    // ── TOTALS BOX ────────────────────────────────────────────────────────────
    const subtotal = (sale.SaleItems || []).reduce((s, i) => s + Number(i.price) * i.quantity, 0);
    const totalGST = (sale.SaleItems || []).reduce((s, i) => {
        const p = products.find(p => p.id === i.product_id);
        return s + Number(i.price) * i.quantity * ((p?.gst_percentage || 18) / 100);
    }, 0);
    const finalAmt = subtotal + totalGST - Number(discount || 0);

    // Totals right block
    const totX = 120, totStartY = tableEndY;
    doc.setFillColor(248, 250, 252);
    doc.rect(totX, totStartY, PW - totX - 10, 42, 'F');
    doc.setDrawColor(220, 225, 230);
    doc.setLineWidth(0.3);
    doc.rect(totX, totStartY, PW - totX - 10, 42, 'D');

    const lineH = 7;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Subtotal (Taxable):', totX + 3, totStartY + lineH);
    doc.text(`Rs. ${subtotal.toLocaleString()}`, PW - 13, totStartY + lineH, { align: 'right' });

    doc.text('Total GST:', totX + 3, totStartY + lineH * 2);
    doc.text(`Rs. ${totalGST.toFixed(2)}`, PW - 13, totStartY + lineH * 2, { align: 'right' });

    if (Number(discount) > 0) {
        doc.setTextColor(220, 50, 50);
        doc.text('Discount:', totX + 3, totStartY + lineH * 3);
        doc.text(`- Rs. ${Number(discount).toLocaleString()}`, PW - 13, totStartY + lineH * 3, { align: 'right' });
        doc.setTextColor(80, 80, 80);
    }

    // Total payable line
    doc.setFillColor(cr, cg, cb);
    doc.rect(totX, totStartY + 32, PW - totX - 10, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAYABLE:', totX + 3, totStartY + 39);
    doc.text(`Rs. ${finalAmt.toFixed(2)}`, PW - 13, totStartY + 39, { align: 'right' });

    // GST split (CGST + SGST)
    const cgst = totalGST / 2, sgst = totalGST / 2;
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`CGST: Rs. ${cgst.toFixed(2)}  |  SGST: Rs. ${sgst.toFixed(2)}  |  IGST: Rs. 0.00`, 14, totStartY + 10);

    // Amount in words
    const toWords = (n) => {
        const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        if (n === 0) return 'Zero';
        let num = Math.floor(n);
        let str = '';
        if (num >= 100000) { str += toWords(Math.floor(num / 100000)) + ' Lakh '; num %= 100000; }
        if (num >= 1000)   { str += toWords(Math.floor(num / 1000)) + ' Thousand '; num %= 1000; }
        if (num >= 100)    { str += a[Math.floor(num / 100)] + ' Hundred '; num %= 100; }
        if (num >= 20)     { str += b[Math.floor(num / 10)] + ' '; num %= 10; }
        if (num > 0)       { str += a[num] + ' '; }
        return str.trim();
    };
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(`Amount in Words: ${toWords(finalAmt)} Rupees Only`, 14, totStartY + 18);

    // ── BANK / QR NOTE ────────────────────────────────────────────────────────
    const bankY = tableEndY + 58;
    doc.setLineWidth(0.2);
    doc.setDrawColor(210, 215, 220);
    doc.line(10, bankY, PW - 10, bankY);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(cr, cg, cb);
    doc.text('PAYMENT DETAILS', 14, bankY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('UPI ID: unityelec@upi', 14, bankY + 13);
    doc.text(`WhatsApp: ${COMPANY.phone}`, 14, bankY + 19);
    doc.text('For bank transfer — contact owner', 14, bankY + 25);

    // ── OWNER SIGNATURE / STAMP SECTION ──────────────────────────────────────
    const sigY = bankY + 5;
    // Stamp circle (company seal)
    doc.setDrawColor(cr, cg, cb);
    doc.setLineWidth(0.8);
    doc.circle(170, sigY + 15, 16, 'D');
    doc.setLineWidth(0.3);
    doc.circle(170, sigY + 15, 14, 'D');
    doc.setTextColor(cr, cg, cb);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('UNITY', 170, sigY + 11, { align: 'center' });
    doc.text('ELECTRONICS', 170, sigY + 16, { align: 'center' });
    doc.text('OFFICIAL SEAL', 170, sigY + 21, { align: 'center' });

    // Signature line
    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(0.3);
    doc.line(130, sigY + 34, 195, sigY + 34);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Authorised Signatory', 162.5, sigY + 39, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(cr, cg, cb);
    doc.text(COMPANY.owner, 162.5, sigY + 45, { align: 'center' });
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Proprietor, Unity Electronics', 162.5, sigY + 50, { align: 'center' });

    // ── FOOTER BAND ───────────────────────────────────────────────────────────
    doc.setFillColor(cr, cg, cb);
    doc.rect(0, 282, PW, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for shopping at Unity Electronics! Your satisfaction is our guarantee.', 105, 288, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Goods once sold will not be taken back. Warranty as per manufacturer policy. E.&O.E.', 105, 293, { align: 'center' });

    if (download) {
        doc.save(`Invoice_${sale.invoice_number}.pdf`);
    }
    return doc;
};

// ─── WhatsApp Message Builder ─────────────────────────────────────────────────
const buildWhatsAppMessage = (sale, customers, products, selectedCustomer, paymentMethod) => {
    const cust = customers.find(c => c.id == selectedCustomer);
    const customerName = cust ? cust.name : 'Walk-in Customer';
    const itemsList = (sale.SaleItems || []).map(i => {
        const p = products.find(pr => pr.id === i.product_id);
        return `  • ${p?.product_name || 'Product'} × ${i.quantity} — ₹${(Number(i.price) * i.quantity).toLocaleString()}`;
    }).join('\n');
    const total = Number(sale.total_amount);
    return `━━━━━━━━━━━━━━━━━━━━━━
⚡ *UNITY ELECTRONICS*
🏪 _Premium Home Appliances_
━━━━━━━━━━━━━━━━━━━━━━

✅ *PAYMENT SUCCESSFUL*

📋 *Invoice No:* ${sale.invoice_number}
👤 *Customer:* ${customerName}
📅 *Date:* ${new Date(sale.createdAt).toLocaleDateString('en-IN')}
💳 *Payment:* ${(paymentMethod || 'CASH').toUpperCase()}

🛒 *Items Purchased:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━
💰 *Total Paid: ₹${total.toLocaleString()}*
━━━━━━━━━━━━━━━━━━━━━━

📞 For support: ${COMPANY.phone}
🌐 ${COMPANY.address}

_Thank you for choosing Unity Electronics!_`;
};

// ─── Main Billing Component ───────────────────────────────────────────────────
const Billing = () => {
    const [products, setProducts]             = useState([]);
    const [cart, setCart]                     = useState([]);
    const [searchTerm, setSearchTerm]         = useState('');
    const [customers, setCustomers]           = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [discount, setDiscount]             = useState(0);
    const [paymentMethod, setPaymentMethod]   = useState('cash');
    const [lastSale, setLastSale]             = useState(null);
    const [showSuccess, setShowSuccess]       = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    useEffect(() => {
        const fetchRealTimeData = () => {
            Promise.all([api.get('/products'), api.get('/customers')])
                .then(([pr, cr]) => { setProducts(pr.data); setCustomers(cr.data); })
                .catch(console.error);
        };
        
        fetchRealTimeData(); // Initial load
        const interval = setInterval(fetchRealTimeData, 10000); // Real-time 10s sync
        return () => clearInterval(interval);
    }, []);

    const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean))];

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...product, quantity: 1, serial_number: '' }];
        });
    };

    const removeFromCart = (id) => setCart(cart.filter(i => i.id !== id));
    const updateQuantity = (id, qty) => { if (qty < 1) return; setCart(cart.map(i => i.id === id ? { ...i, quantity: qty } : i)); };
    const updateSerial   = (id, sn)  => setCart(cart.map(i => i.id === id ? { ...i, serial_number: sn } : i));

    const totals = (() => {
        const subtotal = cart.reduce((s, i) => s + Number(i.selling_price) * i.quantity, 0);
        const gst      = cart.reduce((s, i) => s + Number(i.selling_price) * i.quantity * ((Number(i.gst_percentage) || 18) / 100), 0);
        return { subtotal, gst, final: subtotal + gst - Number(discount) };
    })();

    const [showGateway, setShowGateway] = useState(false);

    const processBackendCheckout = async () => {
        const saleData = {
            customer_id:   selectedCustomer,
            items:         cart.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.selling_price, serial_number: i.serial_number })),
            total_amount:  totals.final,
            discount:      Number(discount),
            payment_method: paymentMethod,
        };
        try {
            const res = await api.post('/sales', saleData);
            setLastSale(res.data);
            setShowSuccess(true);
            generateInvoicePDF(res.data, customers, products, selectedCustomer, discount, paymentMethod);
            setCart([]); setDiscount(0); setSelectedCustomer(''); setSearchTerm('');
        } catch (e) {
            alert('Checkout Failed: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleCheckout = () => {
        if (cart.length === 0)     return alert('Cart is empty!');
        if (!selectedCustomer)     return alert('Select a customer first!');
        
        if (['card', 'upi', 'online'].includes(paymentMethod)) {
            setShowGateway(true);
        } else {
            // cash payment
            processBackendCheckout();
        }
    };

    const handleWhatsApp = (target = 'customer') => {
        if (!lastSale) return;
        const msg = buildWhatsAppMessage(lastSale, customers, products, selectedCustomer, paymentMethod);
        const cust = customers.find(c => c.id == selectedCustomer);
        const phone = target === 'customer' ? `91${cust?.phone?.replace(/\D/g, '')}` : COMPANY.whatsapp;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const filteredProducts = products.filter(p =>
        (categoryFilter === 'ALL' || p.category === categoryFilter) &&
        (p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode?.includes(searchTerm))
    );

    return (
        <div className="flex flex-col xl:flex-row h-[calc(100vh-140px)] gap-6 animate-slide-up pb-6">

            {/* ── SUCCESS MODAL ─────────────────────────────────────────────── */}
            {showSuccess && lastSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl text-center">
                        <div className="h-20 w-20 rounded-full bg-emerald-500/10 border-4 border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                            <CheckCircle className="text-emerald-400" size={38} />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-emerald-400">Payment Successful!</h2>
                        <p className="text-slate-400 font-bold text-sm mt-2">Invoice #{lastSale.invoice_number} · ₹{Number(lastSale.total_amount).toLocaleString()}</p>

                        <div className="mt-6 space-y-3">
                            <button onClick={() => generateInvoicePDF(lastSale, customers, products, selectedCustomer, discount, paymentMethod)}
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all">
                                <Printer size={16} /> Download Invoice PDF
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => handleWhatsApp('customer')}
                                    className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all">
                                    <MessageCircle size={16} /> Send to Customer
                                </button>
                                <button onClick={() => handleWhatsApp('owner')}
                                    className="py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all">
                                    <Share2 size={16} /> To My WhatsApp
                                </button>
                            </div>
                            <button onClick={() => setShowSuccess(false)}
                                className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black text-sm transition-all">
                                Close & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showGateway && (
                <PaymentGateway
                    amount={totals.final}
                    method={paymentMethod}
                    customerDetails={customers.find(c => c.id == selectedCustomer)}
                    onSuccess={() => {
                        setShowGateway(false);
                        processBackendCheckout();
                    }}
                    onCancel={() => setShowGateway(false)}
                />
            )}

            {/* ── LEFT: PRODUCT CATALOG ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter">Point of <span className="gradient-text">Sale</span></h1>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">GST Billing Terminal · Unity Electronics</p>
                    </div>
                    <div className="w-full md:w-[360px]">
                        <Input autoFocus placeholder="Search product or scan barcode..." value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)} icon={Search}
                            className="text-base h-12 bg-white/5 border-white/10 rounded-2xl font-bold" />
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setCategoryFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide transition-all ${categoryFilter === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <div key={product.id} onClick={() => addToCart(product)}
                                className="premium-card group cursor-pointer hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 p-0 overflow-hidden">
                                <div className="h-36 w-full overflow-hidden relative bg-slate-900/40">
                                    {product.image_url
                                        ? <img src={product.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={e => e.target.style.display = 'none'} />
                                        : <div className="w-full h-full flex items-center justify-center text-slate-600"><Package size={28} /></div>
                                    }
                                    <div className={`absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full font-black uppercase shadow-lg ${product.stock_quantity < 5 ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500 text-white'}`}>
                                        {product.stock_quantity} left
                                    </div>
                                    {cart.find(i => i.id === product.id) && (
                                        <div className="absolute top-2 left-2 h-6 w-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">
                                            {cart.find(i => i.id === product.id)?.quantity}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="font-black text-xs text-foreground line-clamp-1">{product.product_name}</h3>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-0.5">{product.category}</p>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-base font-black text-primary">₹{Number(product.selling_price).toLocaleString()}</span>
                                        <div className="h-7 w-7 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <Plus size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-4 flex flex-col items-center justify-center h-52 text-slate-600">
                                <Package size={40} className="mb-3 opacity-30" />
                                <p className="font-bold text-sm">No products found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── RIGHT: CART ───────────────────────────────────────────────── */}
            <div className="w-full xl:w-[420px] flex flex-col premium-card p-0 shadow-2xl border-white/5 bg-slate-900/30">
                {/* Cart Header */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black tracking-tight">Active Cart</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-0.5">{cart.length} item(s)</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <ShoppingCart size={18} />
                    </div>
                </div>

                {/* Customer Select */}
                <div className="p-4 border-b border-white/5">
                    <select className="w-full h-11 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm font-black text-foreground outline-none focus:ring-2 focus:ring-primary transition-all"
                        value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
                        <option value="">Select Customer…</option>
                        {customers.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name} — {c.phone}</option>)}
                    </select>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar">
                    {cart.map(item => (
                        <div key={item.id} className="group p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-xs text-foreground truncate">{item.product_name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">₹{Number(item.selling_price).toLocaleString()} / unit</p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/5 rounded-xl p-1 ring-1 ring-white/5">
                                    <button className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={12} /></button>
                                    <span className="w-5 text-center font-black text-xs">{item.quantity}</span>
                                    <button className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={12} /></button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all flex-shrink-0"><Trash2 size={13} /></button>
                            </div>
                            {item.has_serial_number && (
                                <div className="mt-2 flex items-center gap-2 bg-slate-950/50 p-2 rounded-lg border border-white/5">
                                    <QrCode size={12} className="text-slate-500 flex-shrink-0" />
                                    <input type="text" placeholder="Serial / IMEI…" value={item.serial_number || ''}
                                        onChange={e => updateSerial(item.id, e.target.value)}
                                        className="w-full bg-transparent text-xs font-black text-primary focus:outline-none placeholder-slate-700" />
                                </div>
                            )}
                            <div className="flex justify-between mt-2 pt-2 border-t border-white/5">
                                <span className="text-[9px] text-slate-500 uppercase font-black">Item Total</span>
                                <span className="text-xs font-black text-emerald-400">₹{(item.selling_price * item.quantity).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-44 opacity-20">
                            <ShoppingCart size={36} className="mb-3" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Cart Empty</p>
                        </div>
                    )}
                </div>

                {/* Payment & Totals */}
                <div className="p-5 bg-slate-950/40 border-t border-white/5 space-y-4 rounded-b-[28px]">
                    {/* Payment Mode */}
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { id: 'cash',   icon: Banknote,     label: 'Cash' },
                            { id: 'card',   icon: CreditCard,   label: 'Card' },
                            { id: 'upi',    icon: Smartphone,   label: 'UPI'  },
                            { id: 'online', icon: Zap,          label: 'NEFT' },
                        ].map(m => (
                            <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                                className={`flex flex-col items-center justify-center h-14 rounded-2xl border transition-all text-[9px] font-black uppercase gap-1 ${paymentMethod === m.id ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10' : 'border-white/5 text-slate-500 hover:bg-white/5'}`}>
                                <m.icon size={16} />
                                {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Discount */}
                    <div className="flex items-center justify-between bg-white/5 rounded-2xl px-4 py-2.5">
                        <span className="text-xs font-black text-slate-400 uppercase">Discount ₹</span>
                        <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))}
                            className="w-24 bg-transparent text-right font-black text-rose-400 text-sm outline-none" />
                    </div>

                    {/* Totals */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                            <span>Subtotal</span><span className="text-foreground">₹{totals.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                            <span>GST (Incl.)</span><span className="text-purple-400">₹{totals.gst.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-xs font-bold text-slate-400">
                                <span>Discount</span><span className="text-rose-400">-₹{Number(discount).toLocaleString()}</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-white/5 flex justify-between items-end">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-0.5">Total Payable</p>
                                <span className="text-3xl font-black tracking-tighter text-foreground">₹{totals.final.toLocaleString()}</span>
                            </div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">GST Included ✓</span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button onClick={handleCheckout} disabled={cart.length === 0 || !selectedCustomer}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:translate-y-0 text-sm tracking-wide">
                        <Printer size={18} /> COMPLETE &amp; PRINT INVOICE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Billing;
