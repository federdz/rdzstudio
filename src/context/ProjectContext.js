'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, addDoc, deleteDoc, arrayUnion, arrayRemove, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { upload } from '@vercel/blob/client';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [siteContent, setSiteContent] = useState({}); // Aquí se guarda Hero, About, etc.

    // MANEJO DE CATEGORÍAS
    const [allCategories, setAllCategories] = useState([]);
    const [hiddenCategories, setHiddenCategories] = useState([]);
    const [visibleCategories, setVisibleCategories] = useState([]);

    // 1. CARGA DE PROYECTOS
    useEffect(() => {
        if (!db) return;
        const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsData);
            setLoading(false);
        }, (error) => console.error("Error cargando proyectos:", error));
        return () => unsubscribe();
    }, []);

    // 2. CARGA DE CATEGORÍAS
    useEffect(() => {
        if (!db) return;
        const unsubscribe = onSnapshot(doc(db, 'site_content', 'settings'), async (docSnap) => {
            const defaults = ['Social Media', 'Identidad Visual', 'Audiovisual'];

            if (docSnap.exists()) {
                const data = docSnap.data();
                const currentCats = data.categories || [];
                const currentHidden = data.hidden_categories || [];

                setAllCategories(currentCats);
                setHiddenCategories(currentHidden);
                const visible = currentCats.filter(cat => !currentHidden.includes(cat));
                setVisibleCategories(visible);

                const missingDefaults = defaults.filter(def => !currentCats.includes(def));
                if (missingDefaults.length > 0) {
                    try {
                        await setDoc(doc(db, 'site_content', 'settings'), {
                            categories: arrayUnion(...missingDefaults)
                        }, { merge: true });
                    } catch (err) { console.error(err); }
                }
            } else {
                setAllCategories(defaults);
                setVisibleCategories(defaults);
                setDoc(doc(db, 'site_content', 'settings'), { categories: defaults, hidden_categories: [] }, { merge: true });
            }
        });
        return () => unsubscribe();
    }, []);

    // 3. CARGA DE MENSAJES
    useEffect(() => {
        if (!db) return;
        const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.date) - new Date(a.date));
            setMessages(msgs);
        });
        return () => unsubscribe();
    }, []);

    // 4. CARGA DE CONTENIDO DEL SITIO (HERO, ABOUT, CONTACT, IDENTITY) - ¡ESTO FALTABA!
    useEffect(() => {
        if (!db) return;
        const unsubscribe = onSnapshot(collection(db, 'site_content'), (snapshot) => {
            const contentData = {};
            snapshot.docs.forEach(doc => {
                contentData[doc.id] = doc.data();
            });
            setSiteContent(contentData); // Esto actualiza la página de Admin
        });
        return () => unsubscribe();
    }, []);

    // --- UPLOAD ---
    const uploadBase64ToVercel = async (base64String, isVideo = false) => {
        try {
            const res = await fetch(base64String);
            const blob = await res.blob();
            const ext = isVideo ? 'mp4' : 'jpg';
            const filename = `file-${Date.now()}.${ext}`;
            const newBlob = await upload(filename, blob, { access: 'public', handleUploadUrl: '/api/upload' });
            return newBlob.url;
        } catch (e) { return null; }
    };

    // --- MENSAJERÍA ---
    const sendMessage = async (msgData) => {
        try { await addDoc(collection(db, 'messages'), { ...msgData, date: new Date().toISOString(), read: false }); return true; } catch (error) { throw error; }
    };
    const deleteMessage = async (id) => { if (id && confirm("¿Borrar?")) await deleteDoc(doc(db, 'messages', id)); };
    const markAsRead = async (id) => { try { await setDoc(doc(db, 'messages', id), { read: true }, { merge: true }); } catch (error) { } };

    // --- GUARDAR PROYECTOS ---
    const saveAllChanges = async (newData) => {
        console.log("🚀 Guardando...");
        try {
            let finalCover = newData.cover || newData.image || "";
            if (newData.cover instanceof File) {
                const newBlob = await upload(newData.cover.name, newData.cover, { access: 'public', handleUploadUrl: '/api/upload' });
                finalCover = newBlob.url;
            } else if (typeof finalCover === 'string' && finalCover.startsWith('data:')) {
                finalCover = await uploadBase64ToVercel(finalCover, false);
            }

            let finalBlocks = [];
            if (newData.contentBlocks && newData.contentBlocks.length > 0) {
                for (const block of newData.contentBlocks) {
                    let processedBlock = { ...block };
                    if (block.type === 'image' || block.type === 'video') {
                        if (block.content instanceof File) {
                            const newBlob = await upload(block.content.name, block.content, { access: 'public', handleUploadUrl: '/api/upload' });
                            processedBlock.content = newBlob.url;
                        } else if (typeof block.content === 'string' && block.content.startsWith('data:')) {
                            const isVideoFile = block.type === 'video';
                            const url = await uploadBase64ToVercel(block.content, isVideoFile);
                            processedBlock.content = url || "";
                        }
                    }
                    if (block.type === 'grid' && Array.isArray(block.content)) {
                        const newGridContent = [];
                        for (const item of block.content) {
                            if (item instanceof File) {
                                const newBlob = await upload(item.name, item, { access: 'public', handleUploadUrl: '/api/upload' });
                                newGridContent.push(newBlob.url);
                            } else if (typeof item === 'string' && item.startsWith('data:')) {
                                const isVid = item.startsWith('data:video');
                                const url = await uploadBase64ToVercel(item, isVid);
                                if (url) newGridContent.push(url);
                            } else {
                                newGridContent.push(item);
                            }
                        }
                        processedBlock.content = newGridContent;
                    }
                    finalBlocks.push(processedBlock);
                }
            }

            const projectDoc = {
                title: newData.title, category: newData.category, client: newData.client, year: newData.year,
                description: newData.description, tools: newData.tools, credits: newData.credits,
                gridSpacing: newData.gridSpacing || 0, cover: finalCover, image: finalCover,
                contentBlocks: finalBlocks, updatedAt: new Date().toISOString()
            };

            if (newData.id) await setDoc(doc(db, 'projects', newData.id), projectDoc, { merge: true });
            else await addDoc(collection(db, 'projects'), projectDoc);
            alert("✅ ¡Guardado!");
            return true;
        } catch (error) { alert("Error: " + error.message); return false; }
    };

    const deleteProject = async (id) => { if (id && confirm("¿Borrar?")) await deleteDoc(doc(db, 'projects', id)); };

    // --- GESTIÓN DE CATEGORÍAS ---
    const addNewCategory = async (catName) => {
        try { await setDoc(doc(db, 'site_content', 'settings'), { categories: arrayUnion(catName) }, { merge: true }); } catch (error) { console.error(error); }
    };

    const toggleCategoryVisibility = async (catName) => {
        try {
            const isHidden = hiddenCategories.includes(catName);
            if (isHidden) {
                await setDoc(doc(db, 'site_content', 'settings'), { hidden_categories: arrayRemove(catName) }, { merge: true });
            } else {
                await setDoc(doc(db, 'site_content', 'settings'), { hidden_categories: arrayUnion(catName) }, { merge: true });
            }
        } catch (error) { console.error(error); }
    };

    const renameCategory = async (oldName, newName) => {
        try {
            await setDoc(doc(db, 'site_content', 'settings'), { categories: arrayRemove(oldName) }, { merge: true });
            await setDoc(doc(db, 'site_content', 'settings'), { categories: arrayUnion(newName) }, { merge: true });

            if (hiddenCategories.includes(oldName)) {
                await setDoc(doc(db, 'site_content', 'settings'), { hidden_categories: arrayRemove(oldName) }, { merge: true });
                await setDoc(doc(db, 'site_content', 'settings'), { hidden_categories: arrayUnion(newName) }, { merge: true });
            }

            const q = query(collection(db, 'projects'), where('category', '==', oldName));
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((docSnap) => {
                batch.update(doc(db, 'projects', docSnap.id), { category: newName });
            });
            await batch.commit();

            alert("✅ Categoría renombrada y proyectos actualizados.");
        } catch (error) {
            console.error(error);
            alert("Error al renombrar: " + error.message);
        }
    };

    const deleteCategory = async (catName) => {
        if (!confirm(`¿Eliminar "${catName}"? Los proyectos pasarán a la categoría 'Otros'.`)) return;
        try {
            await setDoc(doc(db, 'site_content', 'settings'), { categories: arrayRemove(catName) }, { merge: true });
            await setDoc(doc(db, 'site_content', 'settings'), { hidden_categories: arrayRemove(catName) }, { merge: true });

            const q = query(collection(db, 'projects'), where('category', '==', catName));
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((docSnap) => {
                batch.update(doc(db, 'projects', docSnap.id), { category: 'Otros' });
            });
            await batch.commit();

            alert("🗑️ Categoría eliminada. Proyectos movidos a 'Otros'.");
        } catch (error) { console.error(error); alert("Error al eliminar: " + error.message); }
    };

    // --- ACTUALIZAR SITE CONTENT (ESTO ES LO QUE USA TABSITECONTENT) ---
    const updateSiteContent = async (docId, data) => {
        try {
            await setDoc(doc(db, 'site_content', docId), data, { merge: true });
            // No necesitamos alert aquí, lo maneja el componente o el feedback visual
        } catch (error) { console.error(error); }
    };

    const addProject = (p) => saveAllChanges(p);

    return (
        <ProjectContext.Provider value={{
            projects, loading,
            visibleCategories, allCategories, hiddenCategories,
            saveAllChanges, deleteProject,
            addNewCategory, toggleCategoryVisibility, deleteCategory, renameCategory,
            sendMessage, deleteMessage, markAsRead, messages,
            siteContent, // AHORA SÍ CONTIENE DATOS
            updateSiteContent, addProject
        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjectContext() { return useContext(ProjectContext); }