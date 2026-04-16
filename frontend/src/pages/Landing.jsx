import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShoppingBag, Sparkles, ChevronRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050B14] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-white">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 w-full max-w-4xl">
                {/* Header Text */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-6">
                        <Sparkles size={14} /> Full-Stack E-Commerce System
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-4 text-white">
                        UNITY <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ELECTRONICS</span>
                    </h1>
                    <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto">
                        Please select your portal to continue. Experience our advanced E-Commerce storefront or access the unified Admin ERP system.
                    </p>
                </div>

                {/* Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    
                    {/* Customer Portal */}
                    <div 
                        onClick={() => navigate('/store')}
                        className="group relative bg-[#0a0f1e] border border-white/5 hover:border-cyan-500/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-150" />
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/20">
                            <ShoppingBag size={36} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-3">Customer Shopping Interface</h2>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            Browse the storefront, manage cart, checkout securely with Razorpay, track orders, and view advanced AI product recommendations.
                        </p>
                        <div className="mt-auto inline-flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-widest text-xs group-hover:gap-3 transition-all">
                            Enter Storefront <ChevronRight size={16} />
                        </div>
                    </div>

                    {/* Admin Portal */}
                    <div 
                        onClick={() => navigate('/admin-login')}
                        className="group relative bg-[#0a0f1e] border border-white/5 hover:border-blue-500/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-150" />
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                            <ShieldAlert size={36} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-3">Admin Login</h2>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            Access the ERP dashboard to manage inventory, view real-time sales analytics, process orders, and configure AI & Twilio settings.
                        </p>
                        <div className="mt-auto inline-flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs group-hover:gap-3 transition-all">
                            Access ERP System <ChevronRight size={16} />
                        </div>
                    </div>

                </div>
                
                {/* Footer Note */}
                <div className="text-center mt-16 text-slate-500 text-xs font-bold tracking-widest uppercase">
                    Built with React, Node.js, SQLite & Advanced APIs
                </div>
            </div>
        </div>
    );
};

export default Landing;
