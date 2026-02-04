"use client";
import React from 'react';
import styles from './AboutSection.module.css';
import { useProjectContext } from '@/context/ProjectContext';
import { motion } from 'framer-motion';

export default function AboutSection({ onCategoryClick }) {
    const { siteContent } = useProjectContext();
    const bioText = siteContent?.about?.bio || "Soy Federico Rodriguez Larocca, diseñador multidisciplinario obsesionado con el flujo de la estética digital. #RDZ Studio es mi espacio para experimentar con narrativas visuales y sistemas de identidad de alto impacto.";
    const photoUrl = siteContent?.about?.photo;

    const handleLinkClick = (e, category) => {
        // Prevent default jump to just scroll manually and set filter?
        // Actually the href="#works" handles scroll. We just need to set filter too.
        // Let event propagate to anchor default behavior?
        // If we want SMOOTH scroll we might trust CSS scroll-behavior: smooth.
        // We just execute the state change.

        if (onCategoryClick) {
            onCategoryClick(category);
        }
    };

    return (
        <section className={styles.about} id="about">
            <div className={styles.container}>
                <motion.div
                    className={styles.photoContainer}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.glassFrame}>
                        {photoUrl ? (
                            <img src={photoUrl} alt="About Me" className={styles.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div className={styles.photo}>
                                {/* Placeholder for actual photo, now transparent */}
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    className={styles.bio}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2>Sobre mi</h2>
                    <p style={{ whiteSpace: 'pre-wrap' }}>
                        {bioText}
                    </p>

                    <div className={styles.links}>
                        <a href="#works" className={styles.link} onClick={(e) => handleLinkClick(e, 'Identidad Visual')}>Identidad Visual</a>
                        <span className={styles.separator}>|</span>
                        <a href="#works" className={styles.link} onClick={(e) => handleLinkClick(e, 'Social Media')}>Social Media</a>
                        <span className={styles.separator}>|</span>
                        <a href="#works" className={styles.link} onClick={(e) => handleLinkClick(e, 'Audiovisual')}>Audiovisual</a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
