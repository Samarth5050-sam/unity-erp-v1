import React from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from './ui/Input';
import Button from './ui/Button';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-40 glass border-b border-white/10 backdrop-blur-2xl">
            <div className="flex items-center w-[450px]">
                <Input
                    type="text"
                    placeholder="Search sales, products, or customers..."
                    icon={Search}
                    className="bg-white/5 border-white/10 focus:bg-white/10 transition-all duration-300 rounded-xl"
                />
            </div>

            <div className="flex items-center gap-6">
                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                    <Bell size={22} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
                </Button>

                <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-black tracking-tight text-foreground">{user?.name || 'Samarth Shinde'}</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-primary mt-0.5">{user?.role || 'OWNER'}</p>
                    </div>

                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                        <User size={22} className="drop-shadow-sm" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
