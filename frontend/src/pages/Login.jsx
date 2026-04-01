import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('admin@unity.com');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans selection:bg-primary/30">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-[480px] p-1 shadow-2xl rounded-[32px] bg-gradient-to-b from-white/10 to-transparent">
                <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[31px] p-10 md:p-14">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center mb-8 shadow-2xl shadow-primary/40 group interactive">
                            <LogIn className="text-white drop-shadow-md" size={36} />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter text-white mb-2">
                            UNITY <span className="gradient-text">ELECTRONICS</span>
                        </h2>
                        <p className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-500">Premium ERP Workstation</p>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 text-xs font-bold animate-slide-up">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-slate-600 transition-all outline-none font-bold text-sm shadow-inner"
                                placeholder="name@unity.com"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-slate-600 transition-all outline-none font-bold text-sm shadow-inner"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-5 px-6 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 interactive flex items-center justify-center gap-3 tracking-tight"
                            >
                                Enter Workstation <LogIn size={20} />
                            </button>
                        </div>

                        <div className="text-center pt-2">
                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                Master Login: <span className="text-slate-400">admin@unity.com</span> / <span className="text-slate-400">admin123</span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
