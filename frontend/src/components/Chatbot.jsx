import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Zap, ChevronRight } from 'lucide-react';
import api from '../api/axios';

// ── Knowledge Base ─────────────────────────────────────────────────────────────
const KB = [
    // Location & Contact
    { keys: ['location', 'address', 'where', 'shop', 'find us', 'directions', 'kahan'],
      ans: '📍 We are located at:\n*Unity Electronics*\nIshwarpur, Tal. Walwa,\nDist. Sangli, Maharashtra\n\nGoogle Maps: Search "Unity Electronics Ishwarpur"\n📞 +91 96993 74346' },

    { keys: ['phone', 'contact', 'number', 'call', 'reach', 'owner', 'samarth'],
      ans: '📞 You can reach us at:\n*+91 96993 74346*\n\n👤 Owner: *Samarth Rajendra Shinde*\n⏰ Shop Hours: 9 AM – 9 PM (Mon–Sat)\n📲 WhatsApp is also available on the same number!' },

    { keys: ['timing', 'hours', 'open', 'close', 'time', 'sunday'],
      ans: '⏰ Shop Timings:\nMon – Sat: *9:00 AM to 9:00 PM*\nSunday: *10:00 AM to 7:00 PM* (limited hours)\n\nFor urgent service, WhatsApp us anytime!' },

    // Products – AC
    { keys: ['ac', 'air conditioner', 'split ac', 'inverter ac', 'cooling', 'a.c'],
      ans: '❄️ *Air Conditioners at Unity Electronics:*\n\n• Samsung 1.5T Split AC — ₹38,000\n• LG 1.5T Dual Inverter — ₹42,000\n• Voltas 1T Window AC — ₹28,000\n• Daikin 2T Split AC — ₹55,000\n\n✅ Free installation included\n✅ 5-year compressor warranty\n✅ EMI from ₹1,500/month\n\nWant to book an AMC for your AC?' },

    // Products – TV
    { keys: ['tv', 'television', 'smart tv', 'led', '4k', 'oled', 'samsung tv', 'lg tv'],
      ans: '📺 *LED / Smart TVs at Unity Electronics:*\n\n• Samsung 32" Smart TV — ₹22,000\n• LG 43" 4K UHD — ₹35,000\n• Sony Bravia 55" OLED — ₹1,10,000\n• Vizio 50" 4K HDR — ₹45,000\n\n✅ 1-year on-site warranty\n✅ Free wall mounting\n✅ No-cost EMI available\n\nDiwali offers available! Ask me for discounts 🪔' },

    // Products – Refrigerator
    { keys: ['fridge', 'refrigerator', 'double door', 'single door', 'freezer', 'frost free'],
      ans: '🧊 *Refrigerators at Unity Electronics:*\n\n• Samsung 253L Double Door — ₹28,500\n• LG 190L Single Door — ₹15,000\n• Whirlpool 340L French Door — ₹55,000\n• Haier 320L Side-by-Side — ₹48,000\n\n✅ 5-year compressor warranty\n✅ Free delivery & installation\n✅ Exchange your old fridge!' },

    // Products – Washing Machine
    { keys: ['washing machine', 'washer', 'front load', 'top load', 'dryer', 'laundry'],
      ans: '🫧 *Washing Machines at Unity Electronics:*\n\n• Samsung 7kg Top Load — ₹16,000\n• LG 8kg Front Load — ₹28,000\n• Whirlpool 6.5kg Semi Auto — ₹11,000\n• IFB 6kg Front Load — ₹25,500\n\n✅ Free installation\n✅ 2-year warranty included\n✅ AMC available from ₹799/year' },

    // Products – Fan
    { keys: ['fan', 'ceiling fan', 'table fan', 'exhaust fan', 'cooler'],
      ans: '🌀 *Fans & Coolers at Unity Electronics:*\n\n• Havells Ceiling Fan — ₹2,200\n• Orient 48" Premium Fan — ₹3,500\n• Symphony Desert Cooler — ₹8,000\n• Crompton Table Fan — ₹1,200\n\n✅ Best brands, lowest prices in Sangli district!' },

    // Products – Geyser/Water Heater
    { keys: ['geyser', 'water heater', 'instant geyser', 'storage geyser', 'hot water'],
      ans: '🚿 *Geysers & Water Heaters:*\n\n• Venus Instant 3L — ₹3,500\n• Bajaj 15L Storage — ₹6,800\n• AO Smith 25L — ₹12,000\n• Racold 10L Digital — ₹8,500\n\n✅ Certified plumbers for installation\n✅ 2-year warranty' },

    // Pricing
    { keys: ['price', 'cost', 'rate', 'how much', 'kitna', 'budget', 'cheap', 'affordable'],
      ans: '💰 *Our Price Ranges:*\n\n❄️ AC: ₹22,000 – ₹80,000\n📺 TV: ₹12,000 – ₹1,50,000\n🧊 Refrigerator: ₹12,000 – ₹80,000\n🫧 Washing Machine: ₹8,000 – ₹45,000\n🌀 Fans: ₹800 – ₹5,000\n\n📞 Call for latest deals: *+91 96993 74346*\nAll prices include GST. EMI available!' },

    // EMI
    { keys: ['emi', 'installment', 'finance', 'loan', 'monthly', 'no cost emi'],
      ans: '💳 *EMI Options Available:*\n\n✅ No-Cost EMI on items above ₹15,000\n✅ Banks: SBI, HDFC, ICICI, Axis\n✅ Bajaj Finserv accepted\n✅ Tenure: 3, 6, 12, 24 months\n\nBring your Aadhaar + PAN card for instant approval!' },

    // Warranty
    { keys: ['warranty', 'guarantee', 'repair', 'broken', 'damage', 'claim'],
      ans: '🛡️ *Warranty at Unity Electronics:*\n\n• All products: 1–5 year manufacturer warranty\n• AC Compressor: 5-year warranty\n• TVs: 1-year on-site service\n• Refrigerators: 5-year compressor\n\n📲 Track your warranty in our *Warranty* section\n📞 Service call: +91 96993 74346' },

    // AMC
    { keys: ['amc', 'annual maintenance', 'service contract', 'maintenance plan', 'subscription'],
      ans: '🔧 *AMC Plans at Unity Electronics:*\n\n❄️ *AC AMC:*\n  Basic (2 service): ₹1,499/yr\n  Standard (3 service): ₹2,499/yr\n  Premium (5 service): ₹3,999/yr\n\n🧊 *Fridge AMC:*\n  Basic: ₹999/yr | Standard: ₹1,799/yr\n\n🫧 *Washing Machine AMC:*\n  Basic: ₹799/yr | Standard: ₹1,499/yr\n\nIncludes free visits + priority service!' },

    // Invoice / Bill
    { keys: ['invoice', 'bill', 'receipt', 'billing', 'gst invoice', 'payment proof'],
      ans: '🧾 *Billing & Invoices:*\n\n✅ GST-compliant invoices generated instantly\n✅ Sent to your WhatsApp after purchase\n✅ PDF downloadable from our app\n✅ GSTIN: 27XXXXX1234Z5\n\nInvoices include:\n• HSN codes\n• CGST + SGST breakdown\n• Company stamp & signature\n• QR code for payment' },

    // Payment Modes
    { keys: ['payment', 'upi', 'cash', 'card', 'gpay', 'phonepe', 'paytm', 'neft', 'online'],
      ans: '💳 *Payment Methods Accepted:*\n\n💵 Cash\n📱 UPI (GPay, PhonePe, Paytm)\n💳 Debit / Credit Card\n🏦 NEFT / Bank Transfer\n📋 Bajaj Finserv\n\n*UPI ID:* unityelec@upi\n*Account:* Unity Electronics, SBI Walwa' },

    // Offers & Discounts
    { keys: ['offer', 'discount', 'sale', 'festival', 'diwali', 'deal', 'cashback', 'coupon'],
      ans: '🎉 *Current Offers at Unity Electronics:*\n\n🪔 Diwali Sale: 18% OFF on all appliances\n🐘 Ganesh Chaturthi: 10% OFF\n🇮🇳 Republic Day: Flat 26% OFF\n\n✅ Free delivery on orders above ₹20,000\n✅ Exchange old for new — extra ₹2,000 off!\n✅ Bundle offer: AC + Stabilizer combo\n\nVisit us or WhatsApp for today\'s special price!' },

    // Exchange Offer
    { keys: ['exchange', 'old', 'replace', 'trade', 'purana'],
      ans: '🔄 *Exchange Old for New:*\n\n✅ Bring your old appliance, get instant value!\n\nTypical exchange value:\n• Old AC (working): ₹3,000–8,000\n• Old Fridge: ₹2,000–6,000\n• Old TV: ₹1,500–5,000\n• Old Washing Machine: ₹1,500–4,000\n\n📞 Call us for home pickup: *+91 96993 74346*' },

    // Delivery
    { keys: ['delivery', 'home delivery', 'shipping', 'install', 'setup'],
      ans: '🚚 *Delivery & Installation:*\n\n✅ Free home delivery in Sangli district\n✅ Same-day delivery for stock items\n✅ Free AC installation\n✅ Free TV wall mounting\n✅ Certified technicians for all appliances\n\n📞 Schedule delivery: *+91 96993 74346*' },

    // Service / Repair
    { keys: ['service', 'technician', 'repair', 'fix', 'not working', 'problem', 'issue'],
      ans: '🔧 *Service & Repair:*\n\n✅ Trained technicians for all brands\n✅ Home service available\n✅ Same-day emergency service\n✅ All brands serviced: Samsung, LG, Voltas, Whirlpool...\n\n📞 Service call: *+91 96993 74346*\n⏰ Available: 9 AM – 7 PM\n\nFor urgent issues, WhatsApp us!' },

    // WhatsApp
    { keys: ['whatsapp', 'message', 'chat', 'wa'],
      ans: '📱 *WhatsApp Support:*\n\nSend us a message on WhatsApp!\n*+91 96993 74346*\n\nWe help with:\n• Product enquiries\n• Price quotes\n• Service bookings\n• Invoice copies\n\nUsually reply within 30 minutes! ⚡' },

    // Brands
    { keys: ['brand', 'samsung', 'lg', 'sony', 'voltas', 'whirlpool', 'daikin', 'haier', 'ifb'],
      ans: '🏷️ *Brands Available:*\n\n❄️ AC: Daikin, Voltas, LG, Samsung, Hitachi, Blue Star\n📺 TV: Samsung, LG, Sony, TCL, Vizio\n🧊 Fridge: Samsung, LG, Whirlpool, Haier, Godrej\n🫧 Washer: LG, IFB, Samsung, Whirlpool, Bosch\n🌀 Fan: Havells, Orient, Crompton, Usha\n\nAll genuine products with full brand warranty!' },

    // Stabilizer / UPS
    { keys: ['stabilizer', 'ups', 'inverter', 'power', 'voltage'],
      ans: '⚡ *Stabilizers & UPS:*\n\n• V-Guard AC Stabilizer — ₹2,500\n• Microtek UPS 1KVA — ₹4,500\n• Luminous Home UPS — ₹8,000\n\nEssential for AC & refrigerators in Sangli!\nProtects against voltage fluctuations.' },

    // Second-hand / Used
    { keys: ['used', 'second hand', 'old', 'refurbished', 'second-hand'],
      ans: '🔄 We primarily sell *new products* with full manufacturer warranty.\n\nHowever, we do accept old appliances as *exchange/trade-in*.\n\nFor certified refurbished products, call us:\n📞 *+91 96993 74346*' },

    // Kids / Small appliances
    { keys: ['mixer', 'grinder', 'microwave', 'iron', 'toaster', 'small appliance', 'kitchen'],
      ans: '🍳 *Small Appliances & Kitchen:*\n\n• Prestige Mixer Grinder — ₹2,500\n• LG Microwave 28L — ₹10,000\n• Philips Steam Iron — ₹1,800\n• Bajaj Pop-up Toaster — ₹900\n\nAll MRP items with full warranty!\n📞 *+91 96993 74346*' },

    // Hi / Hello greetings
    { keys: ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'good morning', 'good evening', 'hlo'],
      ans: '🙏 *Namaste! Welcome to Unity Electronics!*\n\nI\'m your virtual assistant. I can help you with:\n\n• 🛒 Product prices & availability\n• 🔧 Service & repair bookings\n• 🛡️ Warranty information\n• 💳 EMI & payment options\n• 📍 Location & contact info\n• 🎉 Festival offers & discounts\n\nWhat would you like to know?' },

    // Thanks
    { keys: ['thank', 'thanks', 'dhanyawad', 'shukriya', 'great', 'awesome', 'perfect'],
      ans: '😊 You\'re welcome! Happy to help!\n\nVisit us at Unity Electronics, Ishwarpur.\n📞 *+91 96993 74346*\n\nHave a great day! ✨' },

    // Bye
    { keys: ['bye', 'goodbye', 'see you', 'later', 'ok thanks', 'alvida'],
      ans: '👋 Goodbye! Have a wonderful day!\n\nRemember, for any electronics needs — *Unity Electronics is your trusted partner!*\n📞 +91 96993 74346 | Ishwarpur, Sangli' },
];

const QUICK_CHIPS = ['🛒 Product Prices', '❄️ AC Info', '📺 TV Models', '🔧 Service', '💳 EMI', '📍 Location', '🎉 Offers', '🛡️ Warranty'];

const getBotResponse = async (input) => {
    const low = input.toLowerCase().trim();

    // 1. Real-time Backend Query Logic
    if (low.includes('price') || low.includes('cost') || low.includes('do you have') || low.includes('search') || low.includes('show me')) {
        try {
            const res = await api.get('/products');
            const products = res.data;
            const keywords = low.replace(/price|cost|do you have|in stock|show me|search|of|for|what|is|the/g, '').trim().split(' ').filter(k => k.length > 2);
            
            if (keywords.length > 0) {
                const matches = products.filter(p => keywords.every(k => p.product_name.toLowerCase().includes(k) || p.category.toLowerCase().includes(k)));
                if (matches.length > 0) {
                    const topMatches = matches.slice(0, 3);
                    let resp = `🔍 *I found these items in our live inventory:*\n\n`;
                    topMatches.forEach(m => {
                        resp += `• *${m.product_name}*\n  Price: ₹${m.selling_price.toLocaleString()} | Stock: ${m.stock_quantity}\n\n`;
                    });
                    if (matches.length > 3) resp += `\n...and ${matches.length - 3} more! Please check the Inventory page for everything.`;
                    return resp;
                }
            }
        } catch (err) {
            console.error('Chatbot API Error:', err);
        }
    }

    // 2. Static Knowledge Base
    for (const item of KB) {
        if (item.keys.some(k => low.includes(k))) return item.ans;
    }
    
    // 3. Fallbacks
    if (low.length < 3) return "Please type a full question. I'm here to help! 😊";
    return `🤔 I didn't quite understand that. Let me connect you!\n\n📞 *Call:* +91 96993 74346\n📱 *WhatsApp:* +91 96993 74346\n📍 *Visit:* Ishwarpur, Walwa, Sangli\n\n*Or try asking:*\n• "Search Daikin AC"\n• "What is the price of Samsung?"\n• "What offers do you have?"`;
};

const Chatbot = () => {
    const [isOpen, setIsOpen]   = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: '🙏 *Namaste! I\'m the Unity Electronics Assistant!*\n\nAsk me anything about:\n• Real-time stock & prices\n• EMI, offers & discounts\n• Service & AMC bookings\n• Location & contact\n\nHow can I help you today? 😊' }
    ]);
    const [input, setInput]     = useState('');
    const [typing, setTyping]   = useState(false);
    const [unread, setUnread]   = useState(0);
    const bottomRef             = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    useEffect(() => {
        if (!isOpen) return;
        setUnread(0);
    }, [isOpen]);

    const sendMessage = async (text) => {
        const msg = text || input.trim();
        if (!msg) return;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setTyping(true);
        
        const delay = 600 + Math.random() * 600;
        
        // Wait for bot delay to simulate typing
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const response = await getBotResponse(msg);
        setMessages(prev => [...prev, { role: 'bot', text: response }]);
        setTyping(false);
        if (!isOpen) setUnread(n => n + 1);
    };

    // Render message with bold (*text*) and line breaks
    const renderText = (text) => {
        return text.split('\n').map((line, i) => {
            const parts = line.split(/(\*[^*]+\*)/g);
            return (
                <span key={i}>
                    {parts.map((part, j) =>
                        part.startsWith('*') && part.endsWith('*')
                            ? <strong key={j}>{part.slice(1, -1)}</strong>
                            : <span key={j}>{part}</span>
                    )}
                    {i < text.split('\n').length - 1 && <br />}
                </span>
            );
        });
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[360px] md:w-[420px] bg-slate-950 border border-white/10 rounded-3xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden"
                     style={{ height: '540px' }}>

                    {/* Header */}
                    <div className="flex-shrink-0 px-5 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm">Unity Assistant</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <p className="text-[9px] text-white/70 font-bold uppercase tracking-widest">Online — Electronics Expert</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-all p-1.5 hover:bg-white/10 rounded-xl">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
                        {messages.map((m, idx) => (
                            <div key={idx} className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {m.role === 'bot' && (
                                    <div className="h-7 w-7 rounded-xl bg-blue-700/30 flex items-center justify-center flex-shrink-0 mb-0.5">
                                        <Bot size={14} className="text-blue-400" />
                                    </div>
                                )}
                                <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                    m.role === 'user'
                                        ? 'bg-primary text-white rounded-br-sm'
                                        : 'bg-slate-800 border border-white/5 text-slate-200 rounded-bl-sm'
                                }`}>
                                    {renderText(m.text)}
                                </div>
                                {m.role === 'user' && (
                                    <div className="h-7 w-7 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 mb-0.5">
                                        <User size={14} className="text-primary" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {typing && (
                            <div className="flex items-end gap-2">
                                <div className="h-7 w-7 rounded-xl bg-blue-700/30 flex items-center justify-center flex-shrink-0">
                                    <Bot size={14} className="text-blue-400" />
                                </div>
                                <div className="bg-slate-800 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                                    {[0, 1, 2].map(i => (
                                        <span key={i} className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"
                                              style={{ animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick Chips */}
                    <div className="flex-shrink-0 px-4 py-2 border-t border-white/5 overflow-x-auto flex gap-2" style={{ scrollbarWidth: 'none' }}>
                        {QUICK_CHIPS.map(chip => (
                            <button key={chip} onClick={() => sendMessage(chip)}
                                className="flex-shrink-0 text-[9px] font-black px-3 py-1.5 bg-white/5 hover:bg-primary/10 hover:text-primary text-slate-400 rounded-full border border-white/5 hover:border-primary/20 transition-all">
                                {chip}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="flex-shrink-0 p-4 bg-slate-900 border-t border-white/5 flex gap-2">
                        <input
                            type="text"
                            placeholder="Ask about ACs, TVs, prices, service..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white placeholder-slate-600 outline-none focus:border-primary transition-all"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button onClick={() => sendMessage()}
                            className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex-shrink-0">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* FAB Toggle Button */}
            <button onClick={() => setIsOpen(o => !o)}
                className="relative h-16 w-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95">
                {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
                {!isOpen && unread > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce">
                        {unread}
                    </span>
                )}
                {!isOpen && (
                    <span className="absolute -top-10 right-0 whitespace-nowrap bg-slate-900 border border-white/10 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg opacity-0 hover:opacity-100 pointer-events-none">
                        Chat with us!
                    </span>
                )}
            </button>
        </div>
    );
};

export default Chatbot;
