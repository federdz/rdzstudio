"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveData, loadData } from '@/utils/db';

// Default Data (Fallback)
const defaultProjects = [
    {
        "id": "1",
        "title": "Neon Dreams",
        "category": "Audiovisual",
        "cover": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
        "description": "A cyberpunk inspired visual journey...",
        "tools": ["After Effects", "Cinema 4D"],
        "credits": "Music by Synthwave Boy",
        "client": "Future Records",
        "year": "2024",
        "media": [
            { "type": "image", "url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b", "format": "horizontal" },
            { "type": "image", "url": "https://images.unsplash.com/photo-1515630278258-407f66498911", "format": "vertical" },
            { "type": "image", "url": "https://images.unsplash.com/photo-1563089145-599997674d42", "format": "vertical" },
            { "type": "image", "url": "https://images.unsplash.com/photo-1504639725590-34d0984388bd", "format": "horizontal" },
            { "type": "image", "url": "https://images.unsplash.com/photo-1496449903678-6806db98712d", "format": "horizontal" }
        ]
    },
    {
        "id": "2",
        "title": "Eco Brand",
        "category": "Identidad Visual",
        "cover": "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop",
        "description": "Rebranding for a sustainable tech company...",
        "tools": ["Illustrator", "Photoshop"],
        "credits": "Art Direction: Federico R.",
        "client": "GreenTech Inc.",
        "year": "2023",
        "media": [
            { "type": "image", "url": "https://images.unsplash.com/photo-1600607686527-6fb886090705", "format": "horizontal" },
            { "type": "image", "url": "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b73", "format": "vertical" },
            { "type": "image", "url": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc", "format": "vertical" },
            { "type": "image", "url": "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d", "format": "horizontal" },
            { "type": "image", "url": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e", "format": "horizontal" }
        ]
    },
    {
        "id": "3",
        "title": "Social Campaign",
        "category": "Social Media",
        "cover": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
        "description": "Instagram and TikTok campaign...",
        "tools": ["Figma", "Premiere Pro"],
        "credits": "Agency: TopTier",
        "client": "Viral Co.",
        "year": "2024",
        "media": [
            { "type": "image", "url": "https://images.unsplash.com/photo-1611162617474-5b21e879e113", "format": "horizontal" }
        ]
    }
];

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [siteContent, setSiteContent] = useState({
        hero: { title: '#RDZ Studio', subtitle: 'Audiovisual Design' },
        about: { bio: 'Federico Rodriguez Larocca...', photo: '' },
        contact: { email: 'hello@rdzstudio.com' },
        identity: { logo: '' }
    });
    const [loaded, setLoaded] = useState(false);
    const [messages, setMessages] = useState([]);

    // Load from IndexedDB on Mount
    useEffect(() => {
        const init = async () => {
            try {
                const data = await loadData('rdz_data');
                if (data) {
                    setProjects(data.projects || defaultProjects);
                    setSiteContent(data.siteContent || siteContent);
                    setMessages(data.messages || []);
                } else {
                    setProjects(defaultProjects);
                }
            } catch (e) {
                console.error("Failed to load from DB", e);
                setProjects(defaultProjects);
            } finally {
                setLoaded(true);
            }
        };
        init();
    }, []);

    const saveToStorage = async () => {
        const data = { projects, siteContent, messages };
        try {
            await saveData('rdz_data', data);
            alert("Cambios guardados y publicados (IndexedDB)");
        } catch (e) {
            console.error("Save failed", e);
            alert("Error al guardar cambios.");
        }
    };

    // Auto-save messages to DB whenever they change
    useEffect(() => {
        if (loaded) {
            const data = { projects, siteContent, messages };
            saveData('rdz_data', data).catch(e => console.error("Auto-save failed", e));
        }
    }, [messages, loaded]);

    const updateProjects = (newProjects) => {
        setProjects(newProjects);
    };

    const updateSiteContent = (newContent) => {
        setSiteContent(newContent);
    };

    const reloadFromStorage = async () => {
        try {
            const data = await loadData('rdz_data');
            if (data) {
                if (data.projects) setProjects(data.projects);
                if (data.siteContent) setSiteContent(data.siteContent);
                if (data.messages) setMessages(data.messages);
            }
        } catch (e) { console.error("Reload failed", e); }
    };

    const sendMessage = (msg) => {
        setMessages(prev => [msg, ...prev]);
    };

    const markAsRead = (id) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    };

    const deleteMessage = (id) => {
        setMessages(prev => prev.filter(m => m.id !== id));
    };

    const toggleStarMessage = (id) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
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
            loaded
        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export const useProjectContext = () => useContext(ProjectContext);
