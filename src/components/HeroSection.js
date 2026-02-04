"use client";
import React, { useState, useEffect } from 'react';
import styles from './HeroSection.module.css';
import { motion } from 'framer-motion';

import { useProjectContext } from '@/context/ProjectContext';

export default function HeroSection() {
    const { siteContent } = useProjectContext();
    const fullText = siteContent?.hero?.subtitle || "Especialista en identidad visual y contenido audiovisual de alto impacto.";
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        // Reset state when text changes
        setDisplayedText("");
        setIsTyping(true);

        // Delay start slightly to separate from initial fade-ins
        const startTimeout = setTimeout(() => {
            let index = 0;
            const typeInterval = setInterval(() => {
                if (index < fullText.length) {
                    setDisplayedText((prev) => prev + fullText.charAt(index));
                    index++;
                } else {
                    setIsTyping(false);
                    clearInterval(typeInterval);
                }
            }, 50); // Speed: 50ms per char ~ 3-4 seconds total

            return () => clearInterval(typeInterval);
        }, 1000);

        return () => clearTimeout(startTimeout);
    }, [fullText]);

    return (
        <section className={styles.hero} id="home">
            <div className={styles.content}>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className={styles.name}
                >
                    Federico Rodriguez Larocca
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className={styles.title}
                >
                    <span className={styles.brandName}>#RDZ</span>
                    <span className={styles.studioName}>Studio</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className={styles.subtitle}
                >
                    Audiovisual Design
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    className={styles.valuePropBox}
                >
                    <p>
                        {displayedText}
                        {isTyping && <span className={styles.cursor}></span>}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className={styles.ctaGroup}
                >
                    <a href="#works" className={styles.primaryBtn}>Proyectos</a>
                    <a href="#contact" className={styles.secondaryBtn}>Contacto</a>
                </motion.div>
            </div>
        </section>
    );
}
