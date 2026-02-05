"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './ProjectsSection.module.css';
import { useProjectContext } from '@/context/ProjectContext';

export default function ProjectsSection() {
    const { projects, loading, visibleCategories } = useProjectContext();
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [visibleCount, setVisibleCount] = useState(6);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>⏳ Cargando proyectos...</div>;

    // CONSTRUCCIÓN SEGURA DE CATEGORÍAS
    // 'visibleCategories' ahora siempre tendrá al menos las 3 por defecto gracias al Contexto.
    // Solo agregamos 'Todos' al principio.
    const categories = ['Todos', ...(visibleCategories || [])];

    // Ordenar por fecha
    const sortedProjects = [...projects].sort((a, b) => {
        const dateA = new Date(a.updatedAt || 0);
        const dateB = new Date(b.updatedAt || 0);
        return dateB - dateA;
    });

    const filteredProjects = activeFilter === 'Todos'
        ? sortedProjects
        : sortedProjects.filter(p => String(p.category || '').trim() === String(activeFilter).trim());

    const visibleProjects = filteredProjects.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProjects.length;

    const handleFilterClick = (cat) => {
        setActiveFilter(cat);
        setVisibleCount(6);
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    return (
        <section className={styles.projects} id="works">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Proyectos</h3>

                    <div className={styles.filters}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
                                onClick={() => handleFilterClick(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.grid}>
                    {visibleProjects.length > 0 ? (
                        visibleProjects.map(project => (
                            <Link key={project.id} href={`/project/${project.id}`} className={styles.cardLink}>
                                <div className={styles.card}>
                                    <div
                                        className={styles.cardImage}
                                        style={{ backgroundImage: `url(${project.cover || project.image})` }}
                                    />
                                    <div className={styles.cardOverlay}>
                                        <h4>{project.title}</h4>
                                        <span>{project.category}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p style={{ color: '#888', gridColumn: '1/-1', textAlign: 'center' }}>
                            No hay proyectos en esta categoría aún.
                        </p>
                    )}
                </div>

                {hasMore && (
                    <div className={styles.footer}>
                        <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                            Ver más proyectos
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}