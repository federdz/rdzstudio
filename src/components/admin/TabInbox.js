"use client";
import React from 'react';
import styles from './Admin.module.css';
import { useProjectContext } from '@/context/ProjectContext';
import { RefreshCw, CheckCircle } from 'lucide-react';

export default function TabInbox() {
    const { messages, markAsRead, deleteMessage, toggleStarMessage, reloadFromStorage } = useProjectContext();
    const [selectedMsg, setSelectedMsg] = React.useState(null);

    const handleOpen = (msg) => {
        setSelectedMsg(msg);
        if (!msg.read) markAsRead(msg.id);
    };

    const handleClose = () => {
        setSelectedMsg(null);
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* TOOLBAR */}
            <div className={styles.header} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: '1.5rem' }}>Inbox <span style={{ fontSize: '1rem', color: '#666', fontWeight: 'normal' }}>({messages ? messages.length : 0})</span></h1>
                <button
                    onClick={reloadFromStorage}
                    style={{ background: 'none', border: '1px solid #333', padding: '0.5rem 1rem', borderRadius: '6px', color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'cyan'}
                    onMouseOut={e => e.currentTarget.style.borderColor = '#333'}
                >
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {/* MESSAGES LIST */}
            <div style={{ background: '#111', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222' }}>
                {messages && messages.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #333', color: '#888' }}>
                                <th style={{ padding: '1rem', width: '50px' }}>Stats</th>
                                <th style={{ padding: '1rem', width: '200px' }}>From</th>
                                <th style={{ padding: '1rem' }}>Subject</th>
                                <th style={{ padding: '1rem', width: '120px' }}>Date</th>
                                <th style={{ padding: '1rem', width: '80px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(msg => (
                                <tr
                                    key={msg.id}
                                    style={{
                                        borderBottom: '1px solid #222',
                                        cursor: 'pointer',
                                        backgroundColor: !msg.read ? '#1a1f1f' : 'transparent',
                                        fontWeight: !msg.read ? 'bold' : 'normal',
                                        color: !msg.read ? '#fff' : '#aaa'
                                    }}
                                    onClick={() => handleOpen(msg)}
                                >
                                    <td style={{ padding: '1rem' }} onClick={e => e.stopPropagation()}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {!msg.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'cyan', marginTop: 6 }}></div>}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {msg.name}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {msg.subject || '(No Subject)'}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.8rem' }}>
                                        {msg.date}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => toggleStarMessage(msg.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: msg.starred ? 'gold' : '#444' }}
                                                title="Star"
                                            >
                                                ★
                                            </button>
                                            <button
                                                onClick={() => { if (confirm('Delete message?')) deleteMessage(msg.id) }}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444', transition: 'color 0.2s' }}
                                                onMouseOver={e => e.currentTarget.style.color = 'red'}
                                                onMouseOut={e => e.currentTarget.style.color = '#444'}
                                                title="Delete"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#666' }}>
                        Inbox is empty
                    </div>
                )}
            </div>

            {/* MESSAGE DETAIL MODAL */}
            {selectedMsg && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '700px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                            <div>
                                <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>{selectedMsg.subject || '(No Subject)'}</h2>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <span style={{ color: 'cyan', fontWeight: 'bold' }}>{selectedMsg.name}</span>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>&lt;{selectedMsg.email}&gt;</span>
                                </div>
                            </div>
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>{selectedMsg.date}</span>
                        </div>

                        <div style={{ color: '#ddd', lineHeight: '1.6', fontSize: '1rem', minHeight: '150px', whiteSpace: 'pre-wrap' }}>
                            {selectedMsg.body}
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={() => { if (confirm('Delete message?')) { deleteMessage(selectedMsg.id); handleClose(); } }}
                                style={{ padding: '0.6rem 1.5rem', background: '#330000', color: 'red', border: '1px solid red', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                Delete
                            </button>
                            <button
                                onClick={handleClose}
                                style={{ padding: '0.6rem 1.5rem', background: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
