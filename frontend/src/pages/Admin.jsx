import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Lock, Mail, Phone, Save, MapPin } from 'lucide-react';
import api from '../api/axios';

const Admin = () => {
    const [settings, setSettings] = useState({
        ownerName: 'Samarth Rajendra Shinde',
        phone: '9699374346',
        email: 'samarthrshinde5050@gmail.com',
        address: 'a/p Ishwarpur Tal.Walwa Dist.Sangli, Maharashtra, India'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (section) => {
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setIsLoading(false);
            alert(`${section} updated successfully!`);
        }, 800);
    };

    return (
        <div className="space-y-10 pb-10 animate-slide-up">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">System <span className="gradient-text">Configuration</span></h1>
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Manage store identity & security</p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="premium-card shadow-sm border-white/5 p-0 overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                        <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                <User size={20} />
                            </div>
                            Store Owner Identity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Owner Full Name</label>
                            <Input
                                value={settings.ownerName}
                                onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                                className="bg-white/5 border-white/10 rounded-xl font-bold"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Contact Phone</label>
                                <Input
                                    value={settings.phone}
                                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                    icon={Phone}
                                    className="bg-white/5 border-white/10 rounded-xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Work Email</label>
                                <Input
                                    value={settings.email}
                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    icon={Mail}
                                    className="bg-white/5 border-white/10 rounded-xl font-bold"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={() => handleSave('Store profile')}
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 font-bold tracking-tight mt-4"
                        >
                            {isLoading ? 'Processing...' : 'Save Configuration'}
                            <Save className="ml-2" size={18} />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="premium-card shadow-sm border-white/5 p-0 overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5 bg-white/5">
                        <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                            <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-500">
                                <Lock size={20} />
                            </div>
                            Access & Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Master Password</label>
                            <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 rounded-xl font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Terminal Password</label>
                            <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 rounded-xl font-bold" />
                        </div>
                        <Button variant="destructive" className="w-full h-12 rounded-xl font-bold tracking-tight mt-4">
                            Regenerate Access Key
                        </Button>
                    </CardContent>
                </Card>

                <Card className="premium-card shadow-sm border-white/5 p-0 overflow-hidden md:col-span-2">
                    <CardHeader className="p-8 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500">
                                <MapPin size={20} />
                            </div>
                            Terminal Location
                        </CardTitle>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Geolocation API</p>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="w-full h-80 rounded-2xl overflow-hidden border border-white/10 shadow-inner group">
                            <iframe
                                title="Store Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15273.818239327538!2d74.2562624!3d17.0374668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc17537e2217643%3A0x7d6c6e7568265084!2sIslampur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1708456000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                className="grayscale contrast-125 opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                        <div className="mt-6 flex items-start gap-4">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                <MapPin className="text-primary" size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-1">Registered HQ Address</h4>
                                <p className="text-lg font-bold text-foreground">
                                    {settings.address}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Admin;
