import React, { useState } from 'react';
import { Mail, Trash2, Clock, User } from 'lucide-react';
import { useProjectContext } from '@/context/ProjectContext';

export default function TabInbox() {
    // Traemos markAsRead del contexto
    const { messages, deleteMessage, markAsRead } = useProjectContext();
    const [selectedMessage, setSelectedMessage] = useState(null);

    const handleSelectMessage = (msg) => {
        setSelectedMessage(msg);
        // Si no estaba leído, lo marcamos ahora
        if (!msg.read) {
            markAsRead(msg.id);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        await deleteMessage(id);
        if (selectedMessage?.id === id) {
            setSelectedMessage(null);
        }
    };

    const styles = {
        container: { display: 'flex', height: '100%', gap: '20px', color: '#ccc' },
        list: { width: '350px', borderRight: '1px solid #333', overflowY: 'auto', display: 'flex', flexDirection: 'column' },

        // ESTILO DINÁMICO SEGÚN SI ESTÁ LEÍDO O NO
        item: (msg, isSelected) => ({
            padding: '20px',
            borderBottom: '1px solid #222',
            cursor: 'pointer',
            background: isSelected ? '#1a1a1a' : 'transparent',
            // Si NO está leído, borde cyan a la izquierda
            borderLeft: !msg.read ? '4px solid #00FFFF' : '4px solid transparent',
            transition: 'background 0.2s'
        }),

        // TEXTO DINÁMICO
        senderName: (isRead) => ({
            fontWeight: isRead ? 'normal' : 'bold',
            color: isRead ? '#bbb' : '#fff', // Blanco brillante si es nuevo
            fontSize: '1rem'
        }),

        subjectText: (isRead) => ({
            color: isRead ? '#666' : '#00FFFF', // Cyan si es nuevo, gris si es viejo
            fontSize: '0.9rem',
            marginBottom: '5px',
            fontWeight: isRead ? 'normal' : '500'
        }),

        detail: { flex: 1, padding: '40px', overflowY: 'auto', position: 'relative' },
        empty: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', flexDirection: 'column', gap: '10px' },
        subjectTitle: { fontSize: '1.5rem', color: 'white', marginBottom: '10px', fontWeight: 'bold' },
        meta: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', fontSize: '0.9rem', color: '#888', borderBottom: '1px solid #333', paddingBottom: '20px' },
        body: { fontSize: '1.1rem', lineHeight: '1.6', color: '#ddd', whiteSpace: 'pre-wrap' },
        deleteBtn: {
            background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '5px', marginLeft: 'auto'
        }
    };

    return (
        <div style={styles.container}>
            {/* LISTA DE MENSAJES */}
            <div style={styles.list}>
                {messages.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No hay mensajes nuevos.</div>
                )}

                {messages.map(msg => (
                    <div
                        key={msg.id}
                        style={styles.item(msg, selectedMessage?.id === msg.id)}
                        onClick={() => handleSelectMessage(msg)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span style={styles.senderName(msg.read)}>{msg.name}</span>
                            <span style={{ fontSize: '0.75rem', color: msg.read ? '#444' : '#888' }}>
                                {new Date(msg.date).toLocaleDateString()}
                            </span>
                        </div>
                        <div style={styles.subjectText(msg.read)}>{msg.subject || '(Sin Asunto)'}</div>

                        <div style={{ fontSize: '0.85rem', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>

            {/* DETALLE */}
            {selectedMessage ? (
                <div style={styles.detail}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button
                            onClick={(e) => handleDelete(e, selectedMessage.id)}
                            style={{ ...styles.deleteBtn, padding: '10px', background: 'rgba(255, 68, 68, 0.1)', borderRadius: '6px' }}
                        >
                            <Trash2 size={18} /> Borrar Mensaje
                        </button>
                    </div>

                    <h2 style={styles.subjectTitle}>{selectedMessage.subject}</h2>

                    <div style={styles.meta}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <User size={16} />
                            <span style={{ color: '#00FFFF' }}>{selectedMessage.name}</span>
                            &lt;{selectedMessage.email}&gt;
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Clock size={16} />
                            {new Date(selectedMessage.date).toLocaleString()}
                        </div>
                    </div>

                    <div style={styles.body}>
                        {selectedMessage.message}
                    </div>
                </div>
            ) : (
                <div style={styles.empty}>
                    <Mail size={48} />
                    <p>Seleccioná un mensaje para leerlo</p>
                </div>
            )}
        </div>
    );
}