import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const loggedInUser = await login(email, password);
            if (loggedInUser.role !== 'admin') {
                 setError('You do not have Admin privileges.');
                 return;
            }
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050B14] font-sans selection:bg-rose-500/30 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-rose-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-[500px] p-1 shadow-2xl rounded-[32px] bg-gradient-to-b from-rose-500/10 to-white/5">
                <div className="bg-slate-900/60 backdrop-blur-3xl border border-rose-500/5 rounded-[31px] p-8 md:p-12">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="h-20 w-20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl group interactive bg-gradient-to-br from-rose-500 to-red-700 shadow-rose-500/40">
                            <ShieldAlert className="text-white drop-shadow-md" size={36} />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter text-white mb-2">
                            UNITY <span className="text-rose-500">ERP</span>
                        </h2>
                        <p className="text-[11px] uppercase tracking-[0.3em] font-black text-slate-400">
                            Secure Admin Portal
                        </p>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl mb-8 text-xs font-bold animate-slide-up flex items-center gap-2">
                             <ShieldAlert size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2 animate-fade-in">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 bg-black/40 border border-rose-500/20 focus:ring-rose-500 rounded-2xl focus:ring-2 focus:border-transparent text-white placeholder-slate-600 transition-all outline-none font-bold text-sm shadow-inner"
                                placeholder="name@unity.com"
                            />
                        </div>

                        <div className="space-y-2 animate-fade-in">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 bg-black/40 border border-rose-500/20 focus:ring-rose-500 rounded-2xl focus:ring-2 focus:border-transparent text-white placeholder-slate-600 transition-all outline-none font-bold text-sm shadow-inner"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-4 px-6 text-white font-black rounded-2xl shadow-xl interactive flex items-center justify-center gap-3 tracking-tight transition-all bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
                            >
                                <LogIn size={18} /> Enter Portal
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <button
                            type="button"
                            onClick={async () => {
                                setEmail('admin@unity.com');
                                setPassword('admin123');
                            }}
                            className="text-xs font-bold text-slate-500 hover:text-rose-400 transition-colors"
                        >
                            Quick Fill: Demo Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
