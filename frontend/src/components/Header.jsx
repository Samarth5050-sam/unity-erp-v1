import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user } = useAuth();

    return (
        <header
            style={{
                height: '44px',
                backgroundColor: '#d4d0c8',
                borderBottom: '2px solid',
                borderBottomColor: '#808080',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                gap: '8px',
                fontFamily: 'Tahoma, MS Sans Serif, Arial, sans-serif',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                zIndex: 40,
            }}
        >
            {/* Menubar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                {/* Search box */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <label style={{ fontSize: '11px', color: '#000000', whiteSpace: 'nowrap' }}>Search:</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Search size={11} style={{ position: 'absolute', left: '4px', color: '#808080', pointerEvents: 'none' }} />
                        <input
                            type="text"
                            placeholder="Search sales, products, customers..."
                            className="win-input"
                            style={{ paddingLeft: '20px', width: '280px', height: '22px' }}
                        />
                    </div>
                    <button className="win-btn" style={{ height: '22px', padding: '0 8px', fontSize: '11px' }}>
                        Go
                    </button>
                </div>

                {/* Separator */}
                <div style={{ width: '2px', height: '24px', borderLeft: '1px solid #808080', borderRight: '1px solid #ffffff', margin: '0 4px' }} />

                {/* Bell */}
                <button className="win-btn" style={{ height: '22px', padding: '0 6px', position: 'relative' }}>
                    <Bell size={13} />
                    <span
                        style={{
                            position: 'absolute', top: '2px', right: '2px',
                            width: '6px', height: '6px',
                            backgroundColor: '#ff0000',
                            borderRadius: '0',
                        }}
                    />
                </button>
            </div>

            {/* Right side: user info */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                borderLeft: '2px solid', borderLeftColor: '#808080',
                paddingLeft: '8px',
            }}>
                <div
                    style={{
                        width: 22, height: 22, backgroundColor: '#000080',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid', borderColor: '#ffffff #808080 #808080 #ffffff',
                        flexShrink: 0,
                    }}
                >
                    <User size={12} style={{ color: '#ffffff' }} />
                </div>
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#000000', lineHeight: 1.2 }}>
                        {user?.name || 'Samarth Shinde'}
                    </div>
                    <div style={{ fontSize: '9px', color: '#000080', lineHeight: 1.2 }}>
                        {user?.role || 'OWNER'}
                    </div>
                </div>
            </div>

            {/* Clock / status */}
            <div style={{
                borderLeft: '2px solid', borderLeftColor: '#808080',
                paddingLeft: '8px', fontSize: '11px', color: '#000000', whiteSpace: 'nowrap'
            }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </header>
    );
};

export default Header;
