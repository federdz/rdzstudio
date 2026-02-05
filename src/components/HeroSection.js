"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function HeroSection() {
    // REFERENCIA AL VIDEO (Para forzarlo vía código)
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            // TRUCO PARA SAFARI IPHONE:
            // Forzamos el silencio de 3 maneras distintas para asegurarnos.
            videoElement.muted = true;
            videoElement.defaultMuted = true;
            videoElement.setAttribute('muted', ''); // Forzamos el atributo HTML
            videoElement.playsInline = true;

            // Intentamos reproducir
            const playPromise = videoElement.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Reproducción automática comenzó correctamente
                })
                    .catch(error => {
                        console.log("Autoplay prevenido por el navegador. Intentando forzar mute nuevamente.", error);
                        // Último intento: asegurar mute y volver a dar play
                        videoElement.muted = true;
                        videoElement.play();
                    });
            }
        }
    }, []);

    // --- LÓGICA DE TEXTO TYPEWRITER (Sin cambios) ---
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

            {/* VIDEO LOCAL BLINDADO PARA IPHONE */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                webkit-playsinline="true"
                preload="auto"
                className={styles.videoBackground}
            >
                {/* Asegurate que este archivo exista en la carpeta 'public' */}
                <source src="/video-hero.mp4" type="video/mp4" />
            </video>

            {/* SE ELIMINÓ EL DIV OVERLAY AQUÍ */}

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