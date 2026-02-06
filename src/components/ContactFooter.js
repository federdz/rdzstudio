"use client";
import React, { useState } from 'react';
import styles from './ContactFooter.module.css';
import { useProjectContext } from '@/context/ProjectContext';
import { Instagram, Linkedin } from 'lucide-react';

export default function ContactFooter() {
    // Traemos las funciones del contexto
    const { sendMessage } = useProjectContext();

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificación silenciosa: Si por alguna razón la función no cargó,
        // no mostramos alerta al usuario, intentamos fallar controladamente o loguear.
        if (typeof sendMessage !== 'function') {
            console.error("Error: La función sendMessage no fue encontrada en el contexto.");
            setStatus('error');
            return;
        }

        setStatus('sending');
        try {
            await sendMessage(formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Limpiamos
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error("Error enviando:", error);
            setStatus('error');
        }
    };

    // Definimos el mail aquí para usarlo en el enlace
    const contactEmail = "fede@rdzstudio.art";

    return (
        <section className={styles.section} id="contact">
            <div className={styles.container}>

                {/* --- IZQUIERDA --- */}
                <div className={styles.leftColumn}>
                    <div className={styles.titleContainer}>
                        <span className={styles.titleMain}>¿Tenés un proyecto?</span>
                        <span className={styles.titleScript}>trabajemos juntos</span>
                    </div>

                    {/* CORRECCIÓN 2: Mailto Link */}
                    {/* Usamos la misma clase 'email' para mantener la fuente y tamaño, 
                        y forzamos textDecoration: none para que no se vea como hipervínculo azul */}
                    <a
                        href={`mailto:${contactEmail}`}
                        className={styles.email}
                        style={{ textDecoration: 'none', display: 'block', width: 'fit-content' }}
                    >
                        {contactEmail}
                    </a>

                    <div className={styles.socialIcons}>
                        <a href="https://instagram.com/rdzstudio_/" target="_blank" rel="noopener noreferrer">
                            <Instagram size={28} className={styles.icon} />
                        </a>
                        <a href="https://www.linkedin.com/in/federicorodr%C3%ADguezlarocca/" target="_blank" rel="noopener noreferrer">
                            <Linkedin size={28} className={styles.icon} />
                        </a>
                        <a href="https://behance.net/federicorodriguez/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <span className={styles.icon} style={{ fontSize: '24px', fontWeight: 'bold' }}>Bē</span>
                        </a>
                    </div>
                </div>

                {/* --- DERECHA (FORMULARIO) --- */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="/ Nombre"
                            className={styles.input}
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            placeholder="/ Email"
                            className={styles.input}
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="/ Asunto"
                            className={styles.input}
                            required
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <textarea
                            placeholder="/ Mensaje"
                            rows={1}
                            className={styles.textarea}
                            required
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                        {status === 'sending' ? 'ENVIANDO...' : status === 'success' ? '¡ENVIADO!' : 'ENVIAR'}
                    </button>

                    {status === 'error' && <p className={styles.errorMsg}>Hubo un error al enviar.</p>}
                </form>

            </div>
        </section>
    );
}