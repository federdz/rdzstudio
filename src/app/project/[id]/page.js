"use client";
import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { ChevronDown, ArrowLeft, X } from 'lucide-react';
import { useProjectContext } from '@/context/ProjectContext';

export default function ProjectPage({ params }) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    const { projects, loaded } = useProjectContext();
    const [project, setProject] = useState(null);
    const [nextProject, setNextProject] = useState(null);

    useEffect(() => {
        if (loaded && projects.length > 0) {
            const found = projects.find(p => p.id === id);
            setProject(found);

            const currentIndex = projects.findIndex(p => p.id === id);
            if (currentIndex !== -1) {
                const nextIndex = (currentIndex + 1) % projects.length;
                setNextProject(projects[nextIndex]);
            }
        }
    }, [id, projects, loaded]);

    if (!loaded) return <div style={{ height: '100vh', background: '#0b0f19' }}></div>;
    if (!project) return <div style={{ height: '100vh', background: '#0b0f19', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Project not found</div>;

    return (
        <main className={styles.pageWrapper}>
            {/* 1. STICKY NAV */}
            <nav className={styles.stickyNav}>
                <div className={styles.navContainer}>
                    <Link href="/" className={styles.navLogo}>
                        #RDZ <span style={{ color: 'white' }}>Studio</span>
                    </Link>
                    <Link href="/#works" className={styles.closeBtn}>
                        <X size={20} /> <span className={styles.closeText}>VOLVER</span>
                    </Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className={styles.hero}>
                <div
                    className={styles.heroBackground}
                    style={{ backgroundImage: `url(${project.cover})` }}
                />
                <div className={styles.overlay} />

                <div className={styles.heroContent}>
                    <span className={styles.categoryPill}>{project.category}</span>
                    <h1 className={styles.title}>{project.title}</h1>
                </div>

                <div className={styles.scrollIndicator}>
                    <ChevronDown color="white" size={32} />
                </div>
            </section>

            {/* INFO BAR */}
            <section className={styles.infoBar}>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Client / Year</span>
                        <span className={styles.infoValue}>{project.client || 'Confidential'} — {project.year || '2024'}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Service</span>
                        <span className={styles.infoValue}>{project.category}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Tools</span>
                        <span className={styles.infoValue}>{project.tools?.join(', ')}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Credits</span>
                        <span className={styles.infoValue}>{project.credits || 'RDZ Studio'}</span>
                    </div>
                </div>
            </section>

            {/* DESCRIPTION */}
            <section className={styles.descriptionSection}>
                <div className={styles.sideTitle}>
                    <h3>The Challenge</h3>
                </div>
                <div className={styles.mainText}>
                    <p>{project.description}</p>

                    {/* Dynamic Blocks Rendering (Mixed with description or separate) */}
                    {/* If using contentBlocks, we rendered them here. For now we use the description field + static text below it as per previous design, 
              but ideally we loop contentBlocks here if user added them. Let's support Blocks if present. */}

                    {project.contentBlocks && project.contentBlocks.length > 0 && (
                        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: `${project.blockSpacing || 20}px` }}>
                            {project.contentBlocks.map(block => (
                                <div key={block.id}>
                                    {block.type === 'text' && <p style={{ whiteSpace: 'pre-wrap' }}>{block.content}</p>}

                                    {block.type === 'image' && (
                                        <img src={block.content} alt="Project Media" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} />
                                    )}

                                    {block.type === 'video' && (
                                        <video src={block.content} controls style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} />
                                    )}

                                    {block.type === 'grid' && Array.isArray(block.content) && (
                                        <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                                            {block.content.map((url, i) => (
                                                <div key={i} style={{ flex: 1 }}>
                                                    <img src={url} alt={`Grid ${i}`} style={{ width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover' }} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* GALLERY GRID */}
            {/* If using blocks, we might verify if legacy media array is still the way. 
          Assuming legacy gallery is still desired below description unless blocks replaced it.
          Let's keep legacy gallery support for compatibility. */}
            {project.media && project.media.length > 0 && (
                <section className={styles.gallery}>
                    <div className={styles.galleryGrid}>
                        {project.media.map((item, index) => (
                            <div
                                key={index}
                                className={`${styles.galleryItem} ${item.format === 'vertical' ? styles.vertical : styles.horizontal}`}
                            >
                                <img src={item.url} alt={`Gallery ${index}`} className={styles.galleryImg} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* SECONDARY BACK BUTTON */}
            <div className={styles.backButtonContainer}>
                <Link href="/#works" className={styles.backButtonSecondary}>
                    ← Volver a Proyectos
                </Link>
            </div>

            {/* NEXT PROJECT FOOTER */}
            {nextProject && (
                <Link href={`/project/${nextProject.id}`} className={styles.nextProject}>
                    <span className={styles.nextLabel}>Next Project</span>
                    <h2 className={styles.nextTitle}>{nextProject.title}</h2>
                </Link>
            )}
        </main>
    );
}
