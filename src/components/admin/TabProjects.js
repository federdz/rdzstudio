"use client";
import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { Plus, Trash2 } from 'lucide-react';
import ProjectEditor from './ProjectEditor';
import { useProjectContext } from '@/context/ProjectContext';

export default function TabProjects() {
    const { projects, updateProjects } = useProjectContext();
    const [editingProject, setEditingProject] = useState(null);

    // No loadProject() needed, context handles it.

    const handleSaveProject = (savedProject) => {
        // Check if update or new
        const exists = projects.find(p => p.id === savedProject.id);
        let newProjects;
        if (exists) {
            newProjects = projects.map(p => p.id === savedProject.id ? savedProject : p);
        } else {
            newProjects = [...projects, savedProject];
        }
        updateProjects(newProjects);
        setEditingProject(null);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this project?')) return;

        const newProjects = projects.filter(p => p.id !== id);
        updateProjects(newProjects);
    };

    if (editingProject) {
        return (
            <ProjectEditor
                project={editingProject === 'new' ? null : editingProject}
                onCancel={() => setEditingProject(null)}
                onSave={handleSaveProject}
            />
        );
    }

    return (
        <div>
            <div className={styles.header}>
                <h1>Projects</h1>
                <button className={styles.addBtn} onClick={() => setEditingProject('new')}>
                    <Plus size={18} /> Add New Project
                </button>
            </div>

            <div className={styles.grid}>
                {projects.map(p => (
                    <div key={p.id} className={styles.projectCard} onClick={() => setEditingProject(p)}>
                        <img src={p.cover} alt={p.title} />
                        <button className={styles.deleteBtn} onClick={(e) => handleDelete(e, p.id)}>
                            <Trash2 size={16} />
                        </button>
                        <div className={styles.pInfo}>
                            <h4>{p.title}</h4>
                            <p>{p.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
