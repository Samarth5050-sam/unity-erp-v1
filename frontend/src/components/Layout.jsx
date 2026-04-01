import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from './Chatbot';

const Layout = () => {
    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
                fontFamily: 'Tahoma, MS Sans Serif, Arial, sans-serif',
                backgroundColor: '#008080',
            }}
        >
            <Sidebar />
            <div
                style={{
                    flex: 1,
                    marginLeft: '208px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    position: 'relative',
                }}
            >
                <Header />
                <main
                    style={{
                        flex: 1,
                        padding: '8px',
                        overflowY: 'auto',
                        backgroundColor: '#008080',
                    }}
                >
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <Outlet />
                    </div>
                </main>
                <Chatbot />
            </div>
        </div>
    );
};

export default Layout;
