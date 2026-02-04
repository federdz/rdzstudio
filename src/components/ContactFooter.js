"use client";
import React from 'react';
import styles from './ContactFooter.module.css';
import { Mail, Instagram, Linkedin } from 'lucide-react';

const BehanceIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        className="lucide lucide-behance"
    >
        <path d="M22 7h-7v-2h7v2zm1.726 10c0 5.08-4.242 5.08-4.242 5.08s-4.242 0-4.242-5.08 1.899-5.08 4.242-5.08 4.242 0 4.242 5.08zm-6.768 0c0 3.709 3.859 3.709 3.859 3.709s3.859 0 3.859-3.709c0-3.709-3.859-3.709-3.859-3.709s-3.859 0-3.859 3.709zm-10.232 5h-4.726v-16h4.639c2.532 0 3.968 1.157 3.968 3.518 0 2.21-1.353 3.013-2.673 3.328 1.761.325 3.167 1.458 3.167 4.047 0 2.909-1.928 5.107-4.375 5.107zm-1.55-12.793h-1.376v3.668h1.566c1.232 0 1.954-.606 1.954-1.848 0-1.285-.92-1.82-2.144-1.82zm0 8.876c1.487 0 2.376-.667 2.376-2.193 0-1.465-.889-2.121-2.223-2.121h-1.529v4.314h1.376z" />
    </svg>
);

import { useProjectContext } from '@/context/ProjectContext';

export default function ContactFooter() {
    const { sendMessage } = useProjectContext();
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    // Form States
    const [formData, setFormData] = React.useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();

        sendMessage({
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            body: formData.message,
            date: new Date().toLocaleDateString(),
            read: false
        });

        setIsSubmitted(true);
    };

    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.headerGroup}>
                        <h2 className={styles.headerLine1}>¿Tenés un proyecto?</h2>
                        <h2 className={styles.headerLine2}>trabajemos juntos</h2>
                    </div>

                    <a href="mailto:federicorodriguezlarocca@gmail.com" className={styles.email}>
                        federicorodriguezlarocca@gmail.com
                    </a>

                    <div className={styles.socials}>
                        <a href="https://www.instagram.com/rdzstudio_/" className={styles.icon} aria-label="Instagram"><Instagram strokeWidth={1.5} /></a>
                        <a href="https://www.linkedin.com/in/federicorodr%C3%ADguezlarocca/" className={styles.icon} aria-label="LinkedIn"><Linkedin strokeWidth={1.5} /></a>
                        <a href="https://www.behance.net/federicorodriguez" className={styles.icon} aria-label="Behance"><BehanceIcon /></a>
                    </div>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input type="text" name="name" placeholder="/ Nombre" required disabled={isSubmitted} value={formData.name} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="email" name="email" placeholder="/ Email" required disabled={isSubmitted} value={formData.email} onChange={handleChange} />
                    </div>
                    {/* NEW SUBJECT FIELD */}
                    <div className={styles.inputGroup}>
                        <input type="text" name="subject" placeholder="/ Asunto" required disabled={isSubmitted} value={formData.subject} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                        <textarea name="message" placeholder="/ Mensaje" rows="4" required disabled={isSubmitted} value={formData.message} onChange={handleChange}></textarea>
                    </div>

                    <button
                        type="submit"
                        className={isSubmitted ? styles.submitBtnDisabled : styles.submitBtn}
                        disabled={isSubmitted}
                    >
                        {isSubmitted ? 'MENSAJE ENVIADO' : 'SEND'}
                    </button>

                    {isSubmitted && (
                        <p style={{ color: 'green', marginTop: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
                            Gracias por tu mensaje. Te responderé a la brevedad.
                        </p>
                    )}
                </form>
            </div>

            <div className={styles.copy}>
                © {new Date().getFullYear()} #RDZ Studio. All rights reserved.
            </div>
        </footer>
    );
}
