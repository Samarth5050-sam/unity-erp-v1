import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from './Chatbot';

const Layout = () => {
    return (
        <div className="flex bg-background min-h-screen font-sans text-foreground selection:bg-primary/20">
            <Sidebar />
            <div className="flex-1 ml-72 flex flex-col h-screen relative">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto animate-slide-up">
                        <Outlet />
                    </div>
                </main>
                <Chatbot />
            </div>
        </div>
    );
};

export default Layout;
