"use client";
import React, { useState, useEffect } from 'react';
import TabProjects from '@/components/admin/TabProjects';
import TabContent from '@/components/admin/TabContent';
import TabInbox from '@/components/admin/TabInbox';
import { Lock, User } from 'lucide-react';
// IMPORTAMOS EL CONTEXTO
import { useProjectContext } from '@/context/ProjectContext';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('projects');

    // --- LÓGICA DE NOTIFICACIONES ---
    const { messages } = useProjectContext();
    // Contamos los no leídos. Si messages es undefined, ponemos 0.
    const unreadCount = messages ? messages.filter(msg => !msg.read).length : 0;
    // -------------------------------

    useEffect(() => {
        const session = localStorage.getItem('rdz_admin_session');
        if (session === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        const validUser = process.env.NEXT_PUBLIC_ADMIN_USER;
        const validPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

        if (username === validUser && password === validPass) {
            setIsAuthenticated(true);
            localStorage.setItem('rdz_admin_session', 'true');
            setError('');
        } else {
            setError('Credenciales incorrectas');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('rdz_admin_session');
        setUsername('');
        setPassword('');
    };

    // --- PANTALLA DE LOGIN ---
    if (!isAuthenticated) {
        return (
            <div style={{
                height: '100vh',
                width: '100%',
                background: '#050505',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontFamily: 'sans-serif'
            }}>
                <form onSubmit={handleLogin} style={{
                    background: '#111',
                    padding: '40px',
                    borderRadius: '12px',
                    border: '1px solid #333',
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <h2 style={{ margin: 0, textAlign: 'center', color: '#00FFFF' }}>RDZ Admin</h2>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#888', fontSize: '0.9rem' }}>Usuario</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', color: '#666' }} />
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '6px', outline: 'none' }}
                                placeholder="Usuario"
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#888', fontSize: '0.9rem' }}>Contraseña</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', color: '#666' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '6px', outline: 'none' }}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: '#ff4444', fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>{error}</p>}

                    <button type="submit" style={{
                        padding: '12px',
                        background: '#00FFFF',
                        color: 'black',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}>
                        Ingresar
                    </button>
                </form>
            </div>
        );
    }

    // --- PANEL DE ADMIN ---
    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: 'white', fontFamily: 'sans-serif' }}>
            <nav style={{
                borderBottom: '1px solid #333',
                padding: '0 20px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#111'
            }}>
                <div style={{ fontWeight: 'bold', color: '#00FFFF' }}>RDZ / ADMIN</div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <button
                        onClick={() => setActiveTab('projects')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === 'projects' ? 'white' : '#666',
                            borderBottom: activeTab === 'projects' ? '2px solid #00FFFF' : '2px solid transparent',
                            height: '60px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Proyectos
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === 'content' ? 'white' : '#666',
                            borderBottom: activeTab === 'content' ? '2px solid #00FFFF' : '2px solid transparent',
                            height: '60px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Contenido del Sitio
                    </button>
                    <button
                        onClick={() => setActiveTab('inbox')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === 'inbox' ? 'white' : '#666',
                            borderBottom: activeTab === 'inbox' ? '2px solid #00FFFF' : '2px solid transparent',
                            height: '60px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Inbox
                        {/* PUNTO DE NOTIFICACIÓN ROJO */}
                        {unreadCount > 0 && (
                            <span style={{
                                background: '#ff4444',
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                minWidth: '18px',
                                textAlign: 'center',
                                lineHeight: '1'
                            }}>
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                <button onClick={handleLogout} style={{ color: '#ff4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Cerrar Sesión
                </button>
            </nav>

            <main style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
                {activeTab === 'projects' && <TabProjects />}
                {activeTab === 'content' && <TabContent />}
                {activeTab === 'inbox' && <TabInbox />}
            </main>
        </div>
    );
}