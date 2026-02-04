"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './ProjectsSection.module.css';
import { useProjectContext } from '@/context/ProjectContext';

export default function ProjectsSection({ activeFilter = 'Todos', onFilterChange }) {
    const { projects, loaded } = useProjectContext();
    const [visibleCount, setVisibleCount] = useState(6);

    if (!loaded) return null;

    const categories = ['Todos', 'Social Media', 'Identidad Visual', 'Audiovisual'];

    // Sort projects by ID descending (Newest First) assuming ID is timestamp or incremental
    const sortedProjects = [...projects].sort((a, b) => Number(b.id) - Number(a.id));

    const filteredProjects = activeFilter === 'Todos'
        ? sortedProjects
        : sortedProjects.filter(p => p.category === activeFilter);

    const visibleProjects = filteredProjects.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProjects.length;

    const handleFilterClick = (cat) => {
        if (onFilterChange) {
            onFilterChange(cat);
            setVisibleCount(6); // Reset pagination on filter change
        }
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    return (
        <section className={styles.projects} id="works">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Works</h3>

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
                    {visibleProjects.map(project => (
                        <Link key={project.id} href={`/project/${project.id}`} className={styles.cardLink}>
                            <div className={styles.card}>
                                <div
                                    className={styles.cardImage}
                                    style={{ backgroundImage: `url(${project.cover})` }}
                                />
                                <div className={styles.cardOverlay}>
                                    <h4>{project.title}</h4>
                                    <span>{project.category}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
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
