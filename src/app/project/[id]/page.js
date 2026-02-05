"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { ChevronDown, X } from 'lucide-react';
import { useProjectContext } from '@/context/ProjectContext';
import { useParams } from 'next/navigation';

export default function ProjectPage() {
    const params = useParams();
    const id = params?.id;
    const { projects, loading } = useProjectContext();
    const [project, setProject] = useState(null);
    const [nextProject, setNextProject] = useState(null);

    useEffect(() => {
        if (!loading && projects.length > 0 && id) {
            const found = projects.find(p => p.id === id);
            if (found) {
                setProject(found);
                const currentIndex = projects.findIndex(p => p.id === id);
                if (currentIndex !== -1) {
                    const nextIndex = (currentIndex + 1) % projects.length;
                    setNextProject(projects[nextIndex]);
                }
            }
        }
    }, [id, projects, loading]);

    if (loading) return <div style={{ height: '100vh', background: '#0b0f19', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>⏳ Cargando...</div>;
    if (!project) return <div style={{ height: '100vh', background: '#0b0f19', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Project not found</div>;

    const containerStyle = {
        maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', width: '100%'
    };
    const gapSize = project.gridSpacing !== undefined ? project.gridSpacing : 20;

    // --- FUNCIÓN MAESTRA PARA MOSTRAR VIDEOS O FOTOS ---
    const renderMedia = (content) => {
        if (!content) return null;

        // 1. YouTube
        if (content.includes('youtube.com') || content.includes('youtu.be')) {
            // Extraer ID (simple)
            let videoId = content.split('v=')[1];
            if (!videoId) videoId = content.split('/').pop();
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            return (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '4px' }}>
                    <iframe
                        src={embedUrl}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }

        // 2. Vimeo
        if (content.includes('vimeo.com')) {
            const videoId = content.split('/').pop();
            const embedUrl = `https://player.vimeo.com/video/${videoId}`;
            return (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '4px' }}>
                    <iframe
                        src={embedUrl}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        allowFullScreen
                    />
                </div>
            );
        }

        // 3. Video MP4 directo
        if (content.match(/\.(mp4|webm|ogg)$/i)) {
            return <video src={content} controls style={{ width: '100%', borderRadius: '4px', display: 'block' }} />;
        }

        // 4. Imagen por defecto
        return <img src={content} alt="Content" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} />;
    };


    return (
        <main className={styles.pageWrapper}>
            <nav className={styles.stickyNav}>
                <div className={styles.navContainer}>
                    <Link href="/" className={styles.navLogo}>#RDZ <span style={{ color: 'white' }}>Studio</span></Link>
                    <Link href="/#works" className={styles.closeBtn}><X size={20} /> <span className={styles.closeText}>VOLVER</span></Link>
                </div>
            </nav>

            <section className={styles.hero}>
                <div className={styles.heroBackground} style={{ backgroundImage: `url(${project.cover || project.image})` }} />
                <div className={styles.overlay} />
                <div className={styles.heroContent}>
                    <span className={styles.categoryPill}>{project.category}</span>
                    <h1 className={styles.title}>{project.title}</h1>
                </div>
                <div className={styles.scrollIndicator}><ChevronDown color="white" size={32} /></div>
            </section>

            <section className={styles.infoBar}>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Cliente / Año</span>
                        <span className={styles.infoValue}>{project.client || 'Confidential'} — {project.year || '2026'}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Servicio</span>
                        <span className={styles.infoValue}>{project.category}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Herramientas</span>
                        <span className={styles.infoValue}>{project.tools ? (Array.isArray(project.tools) ? project.tools.join(', ') : project.tools) : '-'}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Créditos</span>
                        <span className={styles.infoValue}>{project.credits || 'RDZ Studio'}</span>
                    </div>
                </div>
            </section>

            <div style={containerStyle}>

                {/* 1. CONTENIDO VISUAL */}
                {project.contentBlocks && project.contentBlocks.length > 0 && (
                    <section className={styles.contentBlocksSection} style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: `${gapSize}px` }}>
                            {project.contentBlocks.map((block, index) => (
                                <div key={block.id || index}>

                                    {block.type === 'text' && (
                                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1.1rem', color: '#ccc' }}>{block.content}</p>
                                        </div>
                                    )}

                                    {/* BLOQUE IMAGEN o VIDEO (Usamos la función inteligente) */}
                                    {(block.type === 'image' || block.type === 'video') && (
                                        renderMedia(block.content)
                                    )}

                                    {/* GRILLA MIXTA */}
                                    {block.type === 'grid' && Array.isArray(block.content) && (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            flexWrap: 'nowrap',
                                            width: '100%',
                                            gap: `${gapSize}px`,
                                            overflow: 'hidden'
                                        }}>
                                            {block.content.map((item, i) => (
                                                <div key={i} style={{ flex: 1, minWidth: 0 }}>
                                                    {renderMedia(item)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 2. DESCRIPTION (AL FINAL) */}
                <section style={{ maxWidth: '900px', margin: '4rem auto 6rem auto' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Descripción
                    </h3>
                    <div style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#ccc', whiteSpace: 'pre-wrap' }}>
                        {project.description}
                    </div>
                </section>

                <div className={styles.backButtonContainer}>
                    <Link href="/#works" className={styles.backButtonSecondary}>← Volver a Proyectos</Link>
                </div>
            </div>

            {nextProject && (
                <Link href={`/project/${nextProject.id}`} className={styles.nextProject}>
                    <span className={styles.nextLabel}>Siguiente Proyecto</span>
                    <h2 className={styles.nextTitle}>{nextProject.title}</h2>
                </Link>
            )}
        </main>
    );
}