import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, UserIcon, ShieldAlert } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Chatbot = () => {
    const { user } = useAuth() || {};
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm Unity Assistant. ${user?.role === 'admin' ? 'Ready for ERP management?' : 'How can I help you today?'}`, isBot: true }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false }]);
        setInput('');
        setIsTyping(true);

        try {
            const query = userText.toLowerCase();
            
            // Advanced Admin Queries
            if (user?.role === 'admin') {
                if (query.includes('sales') || query.includes('revenue')) {
                    setTimeout(() => {
                        setIsTyping(false);
                        setMessages(prev => [...prev, { id: Date.now(), text: "Based on recent data, overall revenue is steadily tracking. You can view full analytics in the Reports tab.", isBot: true }]);
                    }, 800);
                    return;
                }
                if (query.includes('order') || query.includes('pending')) {
                    const res = await api.get('/orders');
                    const orders = res.data || [];
                    const pending = orders.filter(o => o.status === 'Pending').length;
                    setTimeout(() => {
                        setIsTyping(false);
                        setMessages(prev => [...prev, { id: Date.now(), text: `You currently have ${pending} pending orders waiting for processing. Head to the Orders tab to manage them.`, isBot: true }]);
                    }, 800);
                    return;
                }
            } else {
                // Advanced User Queries
                if (query.includes('where is my order') || query.includes('order status') || query.includes('track')) {
                    if (!user) throw new Error("Not logged in");
                    const res = await api.get(`/orders/user/${user.id}`);
                    const orders = res.data || [];
                    setTimeout(() => {
                        setIsTyping(false);
                        if (orders.length > 0) {
                            setMessages(prev => [...prev, { id: Date.now(), text: `Your latest order (${orders[0].id}) is currently: ${orders[0].status}. You can view detailed tracking in the My Orders tab!`, isBot: true }]);
                        } else {
                            setMessages(prev => [...prev, { id: Date.now(), text: "You don't have any active orders yet. Feel free to browse our electronics!", isBot: true }]);
                        }
                    }, 800);
                    return;
                }
            }

            // Products Search
            const res = await api.get(`/products?search=${encodeURIComponent(userText)}`);
            const products = res.data;

            setTimeout(() => {
                setIsTyping(false);
                const items = products.rows || products;
                
                if (items && items.length > 0) {
                    const topProducts = items.slice(0, 3);
                    let botReply = `I found some excellent matches for "${userText}":\n`;
                    topProducts.forEach(p => {
                        botReply += `🔹 ${p.product_name} - ₹${p.selling_price}\n`;
                    });
                    setMessages(prev => [...prev, { id: Date.now(), text: botReply, isBot: true }]);
                } else if (query.includes('hello') || query.includes('hi')) {
                    setMessages(prev => [...prev, { id: Date.now(), text: `Hello ${user?.name || ''}! Looking for any specific electronics or home appliances?`, isBot: true }]);
                } else if (query.includes('support') || query.includes('help') || query.includes('repair') || query.includes('amc')) {
                    setMessages(prev => [...prev, { id: Date.now(), text: "Our engineering support is available 24/7. You can request a repair or check your AMC directly from the new 'Support & Repair' tab!", isBot: true }]);
                } else {
                    setMessages(prev => [...prev, { id: Date.now(), text: "I am actively monitoring the Unity database. What specific product or category would you like me to fetch for you?", isBot: true }]);
                }
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, { id: Date.now(), text: "I'm having trouble retrieving live data right now. Please try again later.", isBot: true }]);
            }, 1000);
        }
    };

    return (
        <div style={{ position: 'relative', zIndex: 99999 }}>
            {/* Chatbot Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center interactive z-50 transition-all hover:scale-110"
                >
                    <MessageSquare size={24} />
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl flex flex-col z-50 overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Bot className="text-white" size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm">Unity Assistant</h3>
                                <p className="text-cyan-100 text-[10px] font-bold uppercase tracking-widest">Online Now</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-2 interactive flex items-center justify-center h-8 w-8 rounded-full bg-black/20">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`flex gap-2 max-w-[85%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.isBot ? (user?.role === 'admin' ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/20 text-cyan-400') : 'bg-blue-500/20 text-blue-400'}`}>
                                        {msg.isBot ? (user?.role === 'admin' ? <ShieldAlert size={14} /> : <Bot size={14} />) : <UserIcon size={14} />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm ${msg.isBot ? 'bg-white/5 text-white rounded-tl-none' : 'bg-cyan-600 text-white rounded-tr-none'}`}>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 flex gap-1">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-100" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900 border-t border-white/5">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..." 
                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="h-10 w-10 shrink-0 bg-cyan-500 text-slate-950 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed interactive hover:bg-cyan-400"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
