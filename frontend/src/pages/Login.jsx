import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, User as UserIcon, Plus } from 'lucide-react';

const Login = () => {
    // simulated google login state
    const [savedAccounts, setSavedAccounts] = useState([]);
    const [showNewAccountForm, setShowNewAccountForm] = useState(false);
    
    // form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');
    
    const { login, register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const accounts = JSON.parse(localStorage.getItem('savedGoogleAccounts') || '[]');
        setSavedAccounts(accounts);
        if (accounts.length === 0) {
            setShowNewAccountForm(true);
        }
    }, []);

    const saveAccountLocal = (accountInfo) => {
        const accounts = JSON.parse(localStorage.getItem('savedGoogleAccounts') || '[]');
        const existing = accounts.find(a => a.email === accountInfo.email);
        if (!existing) {
            const newAccounts = [...accounts, accountInfo];
            localStorage.setItem('savedGoogleAccounts', JSON.stringify(newAccounts));
            setSavedAccounts(newAccounts);
        }
    };

    const handleGoogleAuth = async (authName, authEmail) => {
        setError('');
        setLoading(authEmail);
        try {
            // Simulated secure password for OAuth accounts
            const dummyPassword = `g_oauth_${authEmail}_secret`;
            
            try {
                // Try logging in existing user first
                const loggedInUser = await login(authEmail, dummyPassword);
                if (loggedInUser.role === 'admin') navigate('/admin');
                else {
                    saveAccountLocal({ name: loggedInUser.name, email: authEmail });
                    navigate('/user/shop');
                }
            } catch (err) {
                // If login fails, register them automatically (like OAuth onboarding)
                const loggedInUser = await register(authName, authEmail, dummyPassword, 'user');
                saveAccountLocal({ name: authName, email: authEmail });
                if (loggedInUser.role === 'admin') navigate('/admin');
                else navigate('/user/shop');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Google Authentication failed');
            setLoading('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050B14] font-sans selection:bg-primary/30 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-[500px] p-1 shadow-2xl rounded-[32px] bg-gradient-to-b from-white/10 to-white/5">
                <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[31px] p-8 md:p-10">
                    
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="h-20 w-20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl group border border-white/10 bg-white shadow-white/10">
                            {/* Google G Logo SVG */}
                            <svg className="w-10 h-10" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter text-white mb-2">
                            Sign in
                        </h2>
                        <p className="text-sm font-medium text-slate-400">
                            to continue to Unity Storefront
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl mb-8 text-xs font-bold animate-slide-up flex items-center justify-center gap-2">
                             {error}
                        </div>
                    )}

                    {!showNewAccountForm && savedAccounts.length > 0 && (
                        <div className="space-y-3 animate-fade-in mb-6">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-4">Choose an account</p>
                            {savedAccounts.map((account, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleGoogleAuth(account.name, account.email)}
                                    disabled={loading === account.email}
                                    className="w-full relative group bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 text-left"
                                >
                                    <div className="h-10 w-10 shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                        {account.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-white font-bold truncate">{account.name}</p>
                                        <p className="text-slate-400 text-xs truncate">{account.email}</p>
                                    </div>
                                    {loading === account.email ? (
                                        <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <CheckCircle2 className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                                    )}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => setShowNewAccountForm(true)}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:bg-white/5 text-slate-300 hover:text-white transition-colors group mt-2"
                            >
                                <div className="h-10 w-10 shrink-0 bg-white/5 group-hover:bg-white/10 rounded-full flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                                    <Plus size={18} />
                                </div>
                                <span className="font-bold text-sm">Use another account</span>
                            </button>
                        </div>
                    )}

                    {showNewAccountForm && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-black/40 border border-white/5 focus:ring-blue-500 rounded-2xl focus:ring-2 focus:border-transparent text-white placeholder-slate-600 transition-all outline-none font-bold text-sm shadow-inner"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Google Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-black/40 border border-white/5 focus:ring-blue-500 rounded-2xl focus:ring-2 focus:border-transparent text-white placeholder-slate-600 transition-all outline-none font-bold text-sm shadow-inner"
                                    placeholder="name@gmail.com"
                                />
                            </div>
                            <div className="pt-4">
                                <button
                                    onClick={() => {
                                        if (name && email) handleGoogleAuth(name, email);
                                        else setError('Please enter both name and email to proceed.');
                                    }}
                                    disabled={loading === email && email !== ''}
                                    className="w-full py-4 px-6 text-white font-black rounded-2xl shadow-xl interactive flex items-center justify-center gap-3 tracking-tight transition-all bg-white hover:bg-slate-200 text-slate-900 shadow-white/20"
                                >
                                    {loading === email && email !== '' ? (
                                        <div className="h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                            Continue with Google
                                        </>
                                    )}
                                </button>
                            </div>
                            
                            {savedAccounts.length > 0 && (
                                <button 
                                    onClick={() => setShowNewAccountForm(false)}
                                    className="w-full text-center mt-4 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    )}
                    
                    <div className="mt-8 pt-6 border-t border-white/5 text-center px-4">
                        <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                            By continuing, you agree to Unity ERP's Terms of Service and Privacy Policy. This is an exclusive Google-only authentication portal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
