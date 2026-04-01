import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Package, Users, FileText, Settings,
    LogOut, Shield, Truck, MapPin, TrendingUp, Calculator, UserCog,
    Brain, ChevronDown, ChevronRight, Wrench, Wind, Sparkles,
    MessageCircle, Star, BarChart3, FolderOpen, Folder
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_GROUPS = [
    {
        label: 'Core Operations',
        items: [
            { path: '/',           label: 'Dashboard',       icon: LayoutDashboard },
            { path: '/billing',    label: 'POS / Billing',   icon: ShoppingCart    },
            { path: '/products',   label: 'Inventory',       icon: Package         },
            { path: '/customers',  label: 'Customers',       icon: Users           },
            { path: '/suppliers',  label: 'Suppliers',       icon: Truck           },
        ],
    },
    {
        label: 'Service & Warranty',
        items: [
            { path: '/warranty',   label: 'Warranty',        icon: Shield          },
            { path: '/amc',        label: 'AMC Contracts',   icon: Wind            },
        ],
    },
    {
        label: 'Intelligence',
        items: [
            { path: '/ai-insights', label: 'AI Insights',   icon: Brain           },
            { path: '/accounting',  label: 'Accounting',     icon: Calculator      },
            { path: '/reports',     label: 'Analytics',      icon: BarChart3       },
        ],
    },
    {
        label: 'Marketing',
        items: [
            { path: '/festivals',  label: 'Festival Planner', icon: Sparkles       },
            { path: '/whatsapp',   label: 'WhatsApp Hub',     icon: MessageCircle  },
        ],
    },
    {
        label: 'System',
        items: [
            { path: '/users',    label: 'User & Security',  icon: UserCog         },
            { path: '/admin',    label: 'Admin Settings',   icon: Settings        },
            { path: '/contact',  label: 'Store Location',   icon: MapPin          },
        ],
    },
];

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState({});

    const toggleGroup = (label) => setCollapsed(p => ({ ...p, [label]: !p[label] }));
    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <aside
            className="fixed left-0 top-0 h-screen w-52 flex flex-col z-40 overflow-hidden"
            style={{
                backgroundColor: '#d4d0c8',
                borderRight: '2px solid',
                borderRightColor: '#808080',
                fontFamily: 'Tahoma, MS Sans Serif, Arial, sans-serif',
            }}
        >
            {/* Title bar / logo */}
            <div className="win-titlebar flex-shrink-0" style={{ fontSize: '11px', padding: '4px 6px' }}>
                <div
                    style={{
                        width: 14, height: 14, backgroundColor: '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '9px', fontWeight: 900, color: '#000080',
                        border: '1px solid #000080', flexShrink: 0
                    }}
                >U</div>
                <span style={{ fontWeight: 700, fontSize: '11px' }}>Unity ERP</span>
            </div>

            {/* Navigation tree */}
            <nav className="flex-1 overflow-y-auto" style={{ padding: '4px 0' }}>
                {NAV_GROUPS.map(group => (
                    <div key={group.label}>
                        {/* Group header */}
                        <button
                            onClick={() => toggleGroup(group.label)}
                            className="w-full text-left win-group-label flex items-center gap-1"
                            style={{ cursor: 'pointer', border: 'none', background: 'none', padding: '3px 8px' }}
                        >
                            {collapsed[group.label]
                                ? <Folder size={11} style={{ color: '#404040', flexShrink: 0 }} />
                                : <FolderOpen size={11} style={{ color: '#404040', flexShrink: 0 }} />
                            }
                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#404040', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {group.label}
                            </span>
                            <span style={{ marginLeft: 'auto' }}>
                                {collapsed[group.label]
                                    ? <ChevronRight size={9} style={{ color: '#404040' }} />
                                    : <ChevronDown size={9} style={{ color: '#404040' }} />
                                }
                            </span>
                        </button>

                        {/* Nav items */}
                        {!collapsed[group.label] && (
                            <div>
                                {group.items.map(item => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === '/'}
                                        style={({ isActive }) => ({
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '3px 8px 3px 20px',
                                            fontSize: '11px',
                                            color: isActive ? '#ffffff' : '#000000',
                                            backgroundColor: isActive ? '#000080' : 'transparent',
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                        })}
                                        onMouseEnter={e => {
                                            if (!e.currentTarget.classList.contains('active-link')) {
                                                e.currentTarget.style.backgroundColor = '#000080';
                                                e.currentTarget.style.color = '#ffffff';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            // restore if not active
                                            const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                                            if (!isActive) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = '#000000';
                                            }
                                        }}
                                    >
                                        <item.icon size={12} style={{ flexShrink: 0 }} />
                                        <span style={{ fontSize: '11px' }}>{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div style={{
                borderTop: '2px solid',
                borderTopColor: '#808080',
                padding: '6px 8px',
                backgroundColor: '#d4d0c8',
                flexShrink: 0
            }}>
                {/* User info */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '3px 4px',
                    border: '2px solid', borderColor: '#808080 #ffffff #ffffff #808080',
                    marginBottom: '4px', backgroundColor: '#ffffff',
                }}>
                    <div style={{
                        width: 20, height: 20, backgroundColor: '#000080',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '9px', fontWeight: 900, color: '#ffffff', flexShrink: 0
                    }}>SR</div>
                    <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#000000' }}>Samarth R. Shinde</div>
                        <div style={{ fontSize: '9px', color: '#000080' }}>Proprietor</div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="win-btn w-full"
                    style={{ justifyContent: 'center', width: '100%' }}
                >
                    <LogOut size={11} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
