'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase'; // Asegurate que la ruta sea correcta
import { collection, onSnapshot, doc, setDoc, addDoc } from 'firebase/firestore';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [siteContent, setSiteContent] = useState({});

    // 1. Cargar datos en tiempo real desde Firebase
    useEffect(() => {
        console.log("🔌 Conectando a Firebase...");

        const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("✅ Proyectos recibidos:", projectsData.length);
            setProjects(projectsData);
            setLoading(false);
        }, (error) => {
            console.error("❌ Error cargando proyectos:", error);
            alert("Error conectando con la base de datos: " + error.message);
        });

        return () => unsubscribe();
    }, []);

    // 2. Función de Guardado (Blindada)
    const saveAllChanges = async (newData, newImageFile) => {
        alert("⏳ Iniciando proceso de guardado..."); // Alerta visual inmediata
        console.log("🚀 Iniciando saveAllChanges...");

        try {
            let imageUrl = newData.image; // Por defecto usamos la URL que ya tenía

            // A) Si hay una foto NUEVA (archivo), la subimos a Vercel
            if (newImageFile instanceof File) {
                console.log("📸 Detectada imagen nueva, subiendo a Vercel...");

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: newImageFile,
                });

                if (!response.ok) {
                    throw new Error('Fallo la subida de imagen a Vercel: ' + response.statusText);
                }

                const blob = await response.json();
                imageUrl = blob.url; // Usamos la nueva URL permanente
                console.log("✅ Imagen subida:", imageUrl);
            }

            // B) Guardamos los datos en Firebase
            console.log("💾 Guardando datos en Firestore...");

            const projectData = {
                ...newData,
                image: imageUrl || "", // Aseguramos que no vaya undefined
                updatedAt: new Date().toISOString()
            };

            // Si tiene ID actualizamos, si no creamos uno nuevo
            if (newData.id) {
                await setDoc(doc(db, 'projects', newData.id), projectData);
            } else {
                await addDoc(collection(db, 'projects'), projectData);
            }

            console.log("✨ ¡Guardado exitoso!");
            alert("✅ ¡Cambios guardados correctamente en la nube!");
            return true;

        } catch (error) {
            console.error("⛔ CRITICAL ERROR:", error);
            alert("❌ Error al guardar: " + error.message);
            return false;
        }
    };

    // Funciones auxiliares para mantener compatibilidad
    const addProject = (project) => saveAllChanges(project, project.imageFile);
    const updateProject = (project) => saveAllChanges(project, project.imageFile);
    const deleteProject = async (id) => { alert("Función borrar pendiente de implementar"); };

    return (
        <ProjectContext.Provider value={{
            projects,
            loading,
            addProject,
            updateProject,
            deleteProject,
            saveAllChanges, // Exportamos la función maestra
            siteContent
        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjects() {
    return useContext(ProjectContext);
}