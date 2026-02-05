"use client";
import React, { useState } from 'react';
import styles from './Admin.module.css';
import { Plus, Trash2 } from 'lucide-react';
import ProjectEditor from './ProjectEditor';
import { useProjectContext } from '@/context/ProjectContext';

export default function TabProjects() {
    // 1. Importamos la función MAESTRA saveAllChanges
    const { projects, saveAllChanges, deleteProject } = useProjectContext();
    const [editingProject, setEditingProject] = useState(null);

    // 2. Esta función recibe los datos DEL EDITOR y los manda a la NUBE
    const handleSaveProject = async (projectData, imageFile) => {
        // Llamamos a la función que guarda en Firebase + Vercel
        const success = await saveAllChanges(projectData, imageFile);

        // Solo cerramos el editor si el guardado fue exitoso
        if (success) {
            setEditingProject(null);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm('¿Estás seguro de que querés borrar este proyecto?')) return;

        // Si tenés implementada la función borrar en el contexto, la usamos
        if (deleteProject) {
            await deleteProject(id);
        } else {
            alert("La función de borrar aún no está conectada a Firebase.");
        }
    };

    // Si estamos editando, mostramos el Editor
    if (editingProject) {
        return (
            <ProjectEditor
                project={editingProject === 'new' ? null : editingProject}
                onCancel={() => setEditingProject(null)}
                onSave={handleSaveProject} // Pasamos la función nueva
            />
        );
    }

    // Si no, mostramos la lista (Grilla)
    return (
        <div>
            <div className={styles.header}>
                <h1>Proyectos</h1>
                <button className={styles.addBtn} onClick={() => setEditingProject('new')}>
                    <Plus size={18} /> Nuevo Proyecto
                </button>
            </div>

            <div className={styles.grid}>
                {projects.map(p => (
                    <div key={p.id} className={styles.projectCard} onClick={() => setEditingProject(p)}>
                        {/* Mostramos la imagen si existe, sino un cuadro gris */}
                        {p.image ? (
                            <img src={p.image} alt={p.title} />
                        ) : (
                            <div style={{ width: '100%', height: '150px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                                Sin Imagen
                            </div>
                        )}

                        <button className={styles.deleteBtn} onClick={(e) => handleDelete(e, p.id)}>
                            <Trash2 size={16} />
                        </button>

                        <div className={styles.pInfo}>
                            <h4>{p.title || "Sin Título"}</h4>
                            <p>{p.category || "Sin Categoría"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}