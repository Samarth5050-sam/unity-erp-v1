import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';

// Core Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Billing from './pages/Billing';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
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

const PrivateRoute = ({ children }) => {
    // SIMPLIFIED METHOD: Directly return children, bypassing any loading or login checks
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Navigate to="/" replace />} />

                <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="billing"        element={<Billing />} />
                    <Route path="products"       element={<Products />} />
                    <Route path="customers"      element={<Customers />} />
                    <Route path="reports"        element={<Reports />} />
                    <Route path="admin"          element={<Admin />} />
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
        </AuthProvider>
    );
}

export default App;
