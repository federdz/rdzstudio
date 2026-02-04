"use client";
import React, { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import Dashboard from '@/components/admin/Dashboard';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = localStorage.getItem('rdz_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    if (loading) return null;

    return (
        <div style={{ position: 'relative', zIndex: 100, minHeight: '100vh', background: '#0b0f19' }}>
            {isAuthenticated ? (
                <Dashboard onLogout={() => {
                    localStorage.removeItem('rdz_auth');
                    setIsAuthenticated(false);
                }} />
            ) : (
                <AdminLogin onLogin={() => {
                    localStorage.setItem('rdz_auth', 'true');
                    setIsAuthenticated(true);
                }} />
            )}
        </div>
    );
}
