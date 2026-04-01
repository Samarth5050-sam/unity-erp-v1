import React, { useState, useEffect } from 'react';
import { Building2, CreditCard, Smartphone, CheckCircle, ShieldCheck, Fingerprint, LucideLoader2 } from 'lucide-react';

const PaymentGateway = ({ amount, method, customerDetails, onSuccess, onCancel }) => {
    const [step, setStep] = useState('init'); // init, processing, verify, success
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timer;
        if (step === 'init') {
            timer = setTimeout(() => { setStep('processing'); }, 1500);
        } else if (step === 'processing') {
            const interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) { clearInterval(interval); setStep('verify'); return 100; }
                    return p + 25;
                });
            }, 500);
        } else if (step === 'verify') {
            timer = setTimeout(() => { setStep('success'); }, 1500);
        } else if (step === 'success') {
            timer = setTimeout(() => { onSuccess(); }, 1500);
        }
        return () => { clearTimeout(timer); };
    }, [step, onSuccess]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fadeIn">
            <div className="w-full max-w-[420px] bg-white rounded-[32px] overflow-hidden shadow-2xl relative block">
                {/* Header Strip */}
                <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-white/60 text-xs font-bold tracking-widest uppercase">Secure Checkout</span>
                        <span className="text-white font-black text-lg">Unity Electronics</span>
                    </div>
                    <div className="flex gap-2">
                        <ShieldCheck className="text-emerald-400" size={24} />
                    </div>
                </div>

                <div className="p-8">
                    {/* Amount & User */}
                    <div className="text-center mb-8">
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Payable</p>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">₹{amount.toLocaleString('en-IN')}</h2>
                        <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-600">
                            {method === 'upi' ? <Smartphone size={14}/> : method === 'card' ? <CreditCard size={14}/> : <Building2 size={14}/>}
                            Paying via {method.toUpperCase()}
                        </div>
                    </div>

                    {/* Progress States */}
                    <div className="h-44 flex flex-col items-center justify-center">
                        {step === 'init' && (
                            <div className="text-center animate-pulse">
                                <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck size={32} />
                                </div>
                                <p className="text-slate-500 font-bold text-sm">Initializing encrypted connection...</p>
                            </div>
                        )}

                        {step === 'processing' && (
                            <div className="w-full">
                                <p className="text-center text-slate-600 font-bold text-sm mb-4">Connecting to bank portal...</p>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        )}

                        {step === 'verify' && (
                            <div className="text-center">
                                <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <Fingerprint size={32} />
                                </div>
                                <p className="text-indigo-600 font-bold text-sm">Verifying transaction signature...</p>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="text-center animate-slide-up">
                                <div className="h-20 w-20 bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={40} />
                                </div>
                                <p className="text-emerald-600 font-black text-lg">Payment Successful</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center border-t border-slate-100 pt-6">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
                            256-bit SSL Encrypted • Powered by Razorpay
                        </p>
                        {step !== 'success' && (
                            <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-xs font-bold underline underline-offset-4">
                                Cancel Transaction
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;
