import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Storefront from './pages/Storefront';
import Landing from './pages/Landing';

// Core Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Billing from './pages/Billing';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import AdminOrders from './pages/AdminOrders';
import Admin from './pages/Admin';
import Warranty from './pages/Warranty';
import Suppliers from './pages/Suppliers';
import Contact from './pages/Contact';

// Feature Pages
import AIInsights from './pages/AIInsights';
import Accounting from './pages/Accounting';
import UserManagement from './pages/UserManagement';

// New Pages
import AMCModule from './pages/AMCModule';
import FestivalPlanner from './pages/FestivalPlanner';
import WhatsAppHub from './pages/WhatsAppHub';

import UserDashboard from './pages/UserDashboard';
import UserShop from './pages/UserShop';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent" /></div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent" /></div>;
    if (!user) return <Navigate to="/admin-login" replace />;
    if (user.role !== 'admin') return <Navigate to="/user/shop" replace />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <OrderProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin-login" element={<AdminLogin />} />

                    {/* Entry Selection */}
                    <Route path="/" element={<Landing />} />

                    {/* Public Storefront */}
                    <Route path="/store" element={<Storefront />} />

                    {/* User Portal (Private) */}
                    <Route path="/user/shop" element={<PrivateRoute><UserShop /></PrivateRoute>} />
                    <Route path="/user/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />

                    {/* Admin ERP */}
                    <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
                        <Route index element={<Dashboard />} />
                        <Route path="billing"        element={<Billing />} />
                        <Route path="products"       element={<Products />} />
                        <Route path="orders"         element={<AdminOrders />} />
                        <Route path="customers"      element={<Customers />} />
                        <Route path="reports"        element={<Reports />} />
                        <Route path="settings"       element={<Admin />} />
                        <Route path="warranty"       element={<Warranty />} />
                        <Route path="suppliers"      element={<Suppliers />} />
                        <Route path="contact"        element={<Contact />} />

                        {/* Intelligence & Finance */}
                        <Route path="ai-insights"   element={<AIInsights />} />
                        <Route path="accounting"    element={<Accounting />} />
                        <Route path="users"         element={<UserManagement />} />

                        {/* New Modules */}
                        <Route path="amc"           element={<AMCModule />} />
                        <Route path="festivals"     element={<FestivalPlanner />} />
                        <Route path="whatsapp"      element={<WhatsAppHub />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </OrderProvider>
        </AuthProvider>
    );
}

export default App;

