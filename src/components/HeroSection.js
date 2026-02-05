"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function HeroSection() {
    // --- LÓGICA DE TEXTO TYPEWRITER (Tu código original) ---
    const phrases = [
        "Especialista en Identidad Visual, Social Media y Video.",
        "Potenciate a través del arte digital."
    ];

    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(100);

    useEffect(() => {
        const i = loopNum % phrases.length;
        const fullText = phrases[i];

        const handleType = () => {
            setText(isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            let speed = isDeleting ? 40 : 80;

            if (!isDeleting && text === fullText) {
                speed = 2000;
                setIsDeleting(true);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
                speed = 500;
            }
            setTypingSpeed(speed);
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed, phrases]);

    // ----------------------------------

    return (
        <section className={styles.hero} id="home">

            {/* VIDEO LOCAL Y AUTOMÁTICO */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className={styles.videoBackground}
            >
                {/* Busca el archivo directamente en la carpeta public */}
                <source src="/video-hero.mp4" type="video/mp4" />
            </video>

            <div className={styles.overlay}></div>

            <div className={styles.content}>
                <h2 className={styles.name}>Federico Rodríguez Larocca</h2>
                <h1 className={styles.title}>
                    <span className={styles.brandName}>#RDZ</span>
                    <span className={styles.studioName}>Studio</span>
                </h1>
                <h3 className={styles.subtitle}>DISEÑO AUDIOVISUAL</h3>

                <div className={styles.valuePropBox}>
                    <p>
                        {text}
                        <span className={styles.cursor}></span>
                    </p>
                </div>

                <div className={styles.ctaGroup}>
                    <Link href="#works" className={styles.primaryBtn}>Proyectos</Link>
                    <Link href="#contact" className={styles.secondaryBtn}>Contacto</Link>
                </div>
            </div>
        </section>
    );
}