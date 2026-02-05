"use client";
import React, { useState } from 'react';
import styles from './Admin.module.css'; // Asegurate de que la ruta sea correcta
import { Layout, FileText, Mail, LogOut } from 'lucide-react';
import TabProjects from './TabProjects';
import TabContent from './TabContent';
import TabInbox from './TabInbox';
import { useProjectContext } from '@/context/ProjectContext'; // Ojo: Si falla, probá '../context/ProjectContext'

export default function Dashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState('projects');
    const { messages } = useProjectContext(); // Ya no necesitamos saveAllChanges acá

    // Calculamos mensajes sin leer de forma segura
    const unreadCount = Array.isArray(messages) ? messages.filter(m => !m.read).length : 0;

    return (
        <div className={styles.dashboard}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>#RDZ CMS</div>

                <nav className={styles.nav}>
                    <button
                        className={`${styles.navBtn} ${activeTab === 'projects' ? styles.active : ''}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        <Layout size={20} /> Projects
                    </button>
                    <button
                        className={`${styles.navBtn} ${activeTab === 'content' ? styles.active : ''}`}
                        onClick={() => setActiveTab('content')}
                    >
                        <FileText size={20} /> Site Content
                    </button>
                    <button
                        className={`${styles.navBtn} ${activeTab === 'inbox' ? styles.active : ''}`}
                        onClick={() => setActiveTab('inbox')}
                        style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '1rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Mail size={20} /> Inbox
                        </div>
                        {unreadCount > 0 && (
                            <span style={{ background: '#FF3333', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </nav>

                {/* EL BOTÓN DE GUARDAR SE ELIMINÓ DE ACÁ PORQUE NO TIENE ACCESO A LOS DATOS */}

                <button className={styles.logoutBtn} onClick={onLogout}>
                    <LogOut size={16} /> Logout
                </button>
            </aside>

            <main className={styles.main}>
                {activeTab === 'projects' && <TabProjects />}
                {activeTab === 'content' && <TabContent />}
                {activeTab === 'inbox' && <TabInbox />}
            </main>
        </div>
    );
}