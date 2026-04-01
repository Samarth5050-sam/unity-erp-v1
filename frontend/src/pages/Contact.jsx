import React from 'react';
import { Mail, Phone, MapPin, Clock, Globe } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

const Contact = () => {
    const shopAddress = "Ishwarpur, Tal.Walwa, Dist.Sangli, Maharashtra, India";
    const shopEmail = "samarthrshinde5050@gmail.com";
    const shopPhone = "+91 9699374346";

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Store <span className="gradient-text">Information</span></h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Locate & Contact Unity Electronics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-slate-900/40 border-white/5">
                        <CardContent className="p-8 space-y-8">
                            <div className="flex gap-5">
                                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Our Location</h4>
                                    <p className="text-sm font-bold text-white leading-relaxed">{shopAddress}</p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Call Us</h4>
                                    <p className="text-sm font-bold text-white">{shopPhone}</p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Email Address</h4>
                                    <p className="text-sm font-bold text-white">{shopEmail}</p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Working Hours</h4>
                                    <p className="text-sm font-bold text-white">Mon - Sat: 9:00 AM - 9:00 PM</p>
                                    <p className="text-xs font-bold text-slate-500">Sunday: Closed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary to-blue-700 border-none">
                        <CardContent className="p-8 text-white">
                            <Globe size={32} className="mb-4 opacity-50" />
                            <h3 className="text-xl font-black mb-2">Global Standards</h3>
                            <p className="text-xs font-bold text-white/70 leading-relaxed">
                                Bringing world-class home appliances to the heart of Maharashtra. Experience premium quality at Ishwarpur.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Google Map */}
                <div className="lg:col-span-2 h-[600px] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl relative group">
                    <iframe
                        title="Shop Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15250.771694246733!2d74.3414578!3d17.1324547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc16de7d58f0001%3A0xe5f86c2e71d37482!2sIshwarpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                        allowFullScreen=""
                        loading="lazy"
                        className="transition-all duration-700 group-hover:filter-none"
                    ></iframe>
                    <div className="absolute inset-0 pointer-events-none border-[16px] border-slate-950 pointer-events-none rounded-[32px]"></div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
