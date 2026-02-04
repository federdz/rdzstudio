"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, setDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [siteContent, setSiteContent] = useState({
        hero: { title: '#RDZ Studio', subtitle: 'Audiovisual Design' },
        about: { bio: '', photo: '' },
        contact: { email: 'hello@rdzstudio.com' },
        identity: { logo: '' }
    });
    const [loaded, setLoaded] = useState(false);
    const [messages, setMessages] = useState([]);
    const [saving, setSaving] = useState(false);

    // 1. Sync Data from Firestore
    useEffect(() => {
        // Projects Listener
        const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
            const pList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by ID descending (assuming ID is timestamp or numeric string)
            pList.sort((a, b) => Number(b.id) - Number(a.id));
            if (pList.length > 0) setProjects(pList);
        });

        // Content Listener
        const unsubContent = onSnapshot(doc(db, 'content', 'main'), (doc) => {
            if (doc.exists()) {
                setSiteContent(prev => ({ ...prev, ...doc.data() }));
            }
        });

        // Messages Listener
        const unsubMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
            const mList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            mList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setMessages(mList);
        });

        setLoaded(true);

        return () => {
            unsubProjects();
            unsubContent();
            unsubMessages();
        };
    }, []);

    // Helper: Upload Base64 to Vercel Blob (via our API)
    const uploadFile = async (data) => {
        // If it's not a string, or doesn't start with data:, assume it's already a URL
        if (typeof data !== 'string' || !data.startsWith('data:')) return data;

        try {
            // Fetch the base64 data to get a Blob
            const res = await fetch(data);
            const blob = await res.blob();
            // Generate a filename (server will handle unique suffix if needed, or we rely on timestamp)
            const filename = `img-${Date.now()}.${blob.type.split('/')[1] || 'png'}`;

            // Upload via our API Route
            const response = await fetch(`/api/upload?filename=${filename}`, {
                method: 'POST',
                body: blob
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Upload failed');
            }

            const json = await response.json();
            return json.url; // The permanent Vercel Blob URL
        } catch (error) {
            console.error("Upload error:", error);
            // Fallback: return the base64 so user doesn't lose data immediately, though it won't persist well
            return data;
        }
    };

    // 2. Save Logic
    const saveToStorage = async () => {
        if (saving) return;
        setSaving(true);
        // We use window.alert for notifications as per existing pattern

        try {
            console.log("Starting Save process...");

            // A. PROCESS PROJECTS
            const updatedProjects = await Promise.all(projects.map(async (p) => {
                // 1. Cover
                let newCover = await uploadFile(p.cover);

                // 2. Content Blocks
                let newBlocks = [];
                if (p.contentBlocks) {
                    newBlocks = await Promise.all(p.contentBlocks.map(async (b) => {
                        if (b.type === 'image' && b.content) {
                            return { ...b, content: await uploadFile(b.content) };
                        }
                        if (b.type === 'video' && b.content && b.content.startsWith('data:')) {
                            // Handle video upload similarly if it's base64 (small videos)
                            return { ...b, content: await uploadFile(b.content) };
                        }
                        if (b.type === 'grid' && Array.isArray(b.content)) {
                            const newGridContent = await Promise.all(b.content.map(url => uploadFile(url)));
                            return { ...b, content: newGridContent };
                        }
                        return b;
                    }));
                }

                // 3. Media (Legacy Gallery)
                let newMedia = [];
                if (p.media) {
                    newMedia = await Promise.all(p.media.map(async (m) => {
                        return { ...m, url: await uploadFile(m.url) };
                    }));
                }

                return {
                    ...p,
                    cover: newCover,
                    contentBlocks: newBlocks,
                    media: newMedia
                };
            }));

            // Write each project to Firestore
            await Promise.all(updatedProjects.map(p =>
                setDoc(doc(db, 'projects', p.id), p)
            ));

            // B. PROCESS SITE CONTENT
            const updatedContent = { ...siteContent };
            if (updatedContent.about?.photo) {
                updatedContent.about.photo = await uploadFile(updatedContent.about.photo);
            }
            if (updatedContent.identity?.logo) {
                updatedContent.identity.logo = await uploadFile(updatedContent.identity.logo);
            }

            // Write Site Content
            await setDoc(doc(db, 'content', 'main'), updatedContent);

            alert("SUCCESS: Proyectos e imágenes guardados en la nube (DB + Blob).");

            // NOTE: We rely on onSnapshot to update the 'projects' state with the new URLs
            // But to prevent UI flicker or confusion, we could strictly set local state here too.
            // OnSnapshot is safer for consistency.

        } catch (e) {
            console.error("Save failed", e);
            alert("ERROR: No se pudo guardar. " + e.message);
        } finally {
            setSaving(false);
        }
    };

    // 3. Messages Actions
    const sendMessage = async (msg) => {
        try {
            await addDoc(collection(db, 'messages'), {
                ...msg,
                createdAt: Date.now(),
                read: false,
                starred: false
            });
        } catch (e) {
            console.error("Error sending message", e);
        }
    };

    const markAsRead = async (id) => {
        try {
            await updateDoc(doc(db, 'messages', id), { read: true });
        } catch (e) { console.error(e); }
    };

    const deleteMessage = async (id) => {
        try {
            await deleteDoc(doc(db, 'messages', id));
        } catch (e) { console.error(e); }
    };

    const toggleStarMessage = async (id) => {
        try {
            // We need to know current state. Efficient way: read from local 'messages' state
            const msg = messages.find(m => m.id === id);
            if (msg) {
                await updateDoc(doc(db, 'messages', id), { starred: !msg.starred });
            }
        } catch (e) { console.error(e); }
    };

    // Legacy / Convenience methods
    const updateProjects = (newProjects) => {
        // Updates local state tentatively. 
        // Real persistence happens on saveToStorage.
        setProjects(newProjects);
    };

    const updateSiteContent = (newContent) => {
        setSiteContent(newContent);
    };

    const reloadFromStorage = async () => {
        // No-op or Manual Re-fetch if needed. Snapshot usually suffices.
        console.log("Reloading via Snapshot...");
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            siteContent,
            messages,
            updateProjects,
            updateSiteContent,
            sendMessage,
            markAsRead,
            deleteMessage,
            toggleStarMessage,
            reloadFromStorage,
            saveToStorage,
            loaded,
            saving // Export saving state if needed for UI spinners
        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export const useProjectContext = () => useContext(ProjectContext);
