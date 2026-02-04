"use client";
import React, { useState } from 'react';
import styles from './Admin.module.css';
import { Upload, Type, Image as ImageIcon, Film, Grid as GridIcon, X, Move, Trash2 } from 'lucide-react';
import { convertFileToBase64 } from '@/utils/helpers';

export default function ProjectEditor({ project, onCancel, onSave }) {
    // Initial state
    const [formData, setFormData] = useState({
        id: project?.id || Date.now().toString(),
        title: project?.title || '',
        category: project?.category || 'Audiovisual',
        client: project?.client || '',
        year: project?.year || new Date().getFullYear().toString(),
        credits: project?.credits || '', // Collaborators
        cover: project?.cover || '',
        description: project?.description || '', // Intro text (Challenge)
        tools: project?.tools ? project.tools.join(', ') : '',
        blockSpacing: project?.blockSpacing || 20, // Global spacing for blocks
        contentBlocks: project?.contentBlocks || []
    });

    const [coverPreview, setCoverPreview] = useState(formData.cover);

    // Handlers
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await convertFileToBase64(file);
                setCoverPreview(base64);
                setFormData(prev => ({ ...prev, cover: base64 }));
            } catch (error) {
                console.error("Error converting file:", error);
            }
        }
    };

    // Content Builder Logic
    const addBlock = (type) => {
        const newBlock = {
            id: Date.now(),
            type,
            // Grid uses array of URLs, others use string
            content: type === 'grid' ? [] : '',
            spacing: type === 'grid' ? 10 : undefined
        };
        setFormData(prev => ({
            ...prev,
            contentBlocks: [...prev.contentBlocks, newBlock]
        }));
    };

    const updateBlock = (id, newContent) => {
        setFormData(prev => ({
            ...prev,
            contentBlocks: prev.contentBlocks.map(b => b.id === id ? { ...b, content: newContent } : b)
        }));
    };

    const updateBlockField = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            contentBlocks: prev.contentBlocks.map(b => b.id === id ? { ...b, [field]: value } : b)
        }));
    };

    const removeBlock = (id) => {
        setFormData(prev => ({
            ...prev,
            contentBlocks: prev.contentBlocks.filter(b => b.id !== id)
        }));
    };

    // Single File Upload for Image/Video Blocks
    // Single File Upload for Image/Video Blocks
    const handleBlockFileChange = async (e, blockId) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await convertFileToBase64(file);
                updateBlock(blockId, base64);
            } catch (error) {
                console.error("Error converting file:", error);
            }
        }
    };

    // Multi-File Upload for Grid Block
    // Multi-File Upload for Grid Block
    const handleGridUpload = async (e, blockId, currentContent) => {
        const files = Array.from(e.target.files);
        try {
            const base64Promises = files.map(file => convertFileToBase64(file));
            const newBase64s = await Promise.all(base64Promises);

            // Append new images to existing grid content
            const uniqueContent = [...(Array.isArray(currentContent) ? currentContent : []), ...newBase64s];
            updateBlock(blockId, uniqueContent);
        } catch (error) {
            console.error("Error converting grid files:", error);
        }
    };

    const removeGridItem = (blockId, itemUrl, currentContent) => {
        const newContent = currentContent.filter(url => url !== itemUrl);
        updateBlock(blockId, newContent);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            tools: formData.tools.split(',').map(t => t.trim()).filter(Boolean)
        };
        onSave(submissionData);
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.header}>
                <h2>{project ? 'Edit Project' : 'New Project'}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Spacing Control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                        <label>Spacing:</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.blockSpacing}
                            onChange={(e) => setFormData({ ...formData, blockSpacing: Number(e.target.value) })}
                            style={{ width: '80px' }}
                        />
                        <span>{formData.blockSpacing}px</span>
                    </div>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>
            </div>

            <form onSubmit={handleFormSubmit}>
                {/* Basic Info */}
                <div className={styles.field}>
                    <label className={styles.label}>Project Title</label>
                    <input className={styles.input} name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                    <div className={styles.field}>
                        <label className={styles.label}>Category</label>
                        <select className={styles.input} name="category" value={formData.category} onChange={handleChange}>
                            <option value="Audiovisual">Audiovisual</option>
                            <option value="Identidad Visual">Identidad Visual</option>
                            <option value="Social Media">Social Media</option>
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Client</label>
                        <input className={styles.input} name="client" value={formData.client} onChange={handleChange} />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Year</label>
                        <input className={styles.input} name="year" value={formData.year} onChange={handleChange} placeholder="2024" />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Tools</label>
                        <input className={styles.input} name="tools" value={formData.tools} onChange={handleChange} placeholder="Photoshop, Illustrator..." />
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Collaborators / Credits</label>
                    <textarea
                        className={styles.textarea}
                        name="credits"
                        value={formData.credits}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Art Direction: ..., 3D: ..."
                    />
                </div>

                {/* Cover Image Uploader */}
                <div className={styles.field}>
                    <label className={styles.label}>Cover Image</label>
                    <div className={styles.dropzone} onClick={() => document.getElementById('coverUpload').click()}>
                        <Upload size={24} />
                        <span>Click to Upload Cover</span>
                        <input
                            id="coverUpload"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                    </div>
                    {coverPreview && <img src={coverPreview} alt="Preview" className={styles.previewImg} />}
                </div>

                {/* Intro Text */}
                <div className={styles.field}>
                    <label className={styles.label}>The Challenge (Intro)</label>
                    <textarea
                        className={styles.textarea}
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                {/* DYNAMIC CONTENT BUILDER */}
                <div className={styles.sectionTitle}>Content Builder</div>

                <div className={styles.blockArea} style={{ display: 'flex', flexDirection: 'column', gap: `${formData.blockSpacing}px` }}>
                    {formData.contentBlocks.length === 0 && <p style={{ color: '#666', textAlign: 'center' }}>No blocks added yet.</p>}

                    {formData.contentBlocks.map((block, index) => (
                        <div key={block.id} className={styles.block}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#00FFFF' }}>
                                    <Move size={14} />
                                    <span style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>{block.type} Block</span>
                                </div>

                                {/* TEXT BLOCK */}
                                {block.type === 'text' && (
                                    <textarea
                                        className={styles.textarea}
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                        placeholder="Enter paragraph text..."
                                    />
                                )}

                                {/* IMAGE BLOCK */}
                                {block.type === 'image' && (
                                    <div className={styles.dropzone} onClick={() => !block.content && document.getElementById(`upload-${block.id}`).click()}>
                                        <input
                                            id={`upload-${block.id}`}
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => handleBlockFileChange(e, block.id)}
                                        />
                                        {block.content ? (
                                            <div style={{ position: 'relative' }}>
                                                <img src={block.content} alt="Block Content" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); updateBlock(block.id, ''); }} // Clear content to allow re-upload
                                                    style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}
                                                >✕</button>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon size={24} />
                                                <span>Click to Upload Image</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* VIDEO BLOCK */}
                                {block.type === 'video' && (
                                    <div className={styles.dropzone} onClick={() => !block.content && document.getElementById(`upload-${block.id}`).click()}>
                                        <input
                                            id={`upload-${block.id}`}
                                            type="file"
                                            accept="video/*"
                                            hidden
                                            onChange={(e) => handleBlockFileChange(e, block.id)}
                                        />
                                        {block.content ? (
                                            <div style={{ position: 'relative' }}>
                                                <video src={block.content} controls style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); updateBlock(block.id, ''); }}
                                                    style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}
                                                >✕</button>
                                            </div>
                                        ) : (
                                            <>
                                                <Film size={24} />
                                                <span>Click to Upload Video</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* GRID BLOCK */}
                                {block.type === 'grid' && (
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <div className={styles.dropzone} onClick={() => document.getElementById(`upload-grid-${block.id}`).click()} style={{ flex: 1 }}>
                                                <input
                                                    id={`upload-grid-${block.id}`}
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    hidden
                                                    onChange={(e) => handleGridUpload(e, block.id, block.content)}
                                                />
                                                <GridIcon size={24} />
                                                <span>Click to Add Images</span>
                                            </div>
                                            <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                                                <label>Gap:</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="50"
                                                    value={block.spacing || 10}
                                                    onChange={(e) => updateBlockField(block.id, 'spacing', Number(e.target.value))}
                                                    style={{ width: '60px' }}
                                                />
                                                <span>{block.spacing || 10}px</span>
                                            </div>
                                        </div>

                                        {/* Grid Render */}
                                        {block.content && block.content.length > 0 && (
                                            <div style={{ display: 'flex', width: '100%', gap: `${parseInt(block.spacing) || 0}px`, marginTop: '10px', flexWrap: 'wrap' }}>
                                                {block.content.map((url, idx) => (
                                                    <div key={idx} style={{ position: 'relative', flex: 1 }}>
                                                        <img src={url} alt={`Grid ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeGridItem(block.id, url, block.content)}
                                                            style={{
                                                                position: 'absolute', top: 5, right: 5,
                                                                background: 'red', color: 'white',
                                                                border: 'none', borderRadius: '50%',
                                                                width: 20, height: 20,
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                cursor: 'pointer'
                                                            }}
                                                        >✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button type="button" onClick={() => removeBlock(block.id)} style={{ color: '#ff4d4d', background: 'none', border: 'none', marginLeft: '1rem', cursor: 'pointer' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles.blockControls}>
                    <button type="button" className={styles.blockBtn} onClick={() => addBlock('text')}><Type size={14} /> Add Text</button>
                    <button type="button" className={styles.blockBtn} onClick={() => addBlock('image')}><ImageIcon size={14} /> Add Image</button>
                    <button type="button" className={styles.blockBtn} onClick={() => addBlock('video')}><Film size={14} /> Add Video</button>
                    <button type="button" className={styles.blockBtn} onClick={() => addBlock('grid')}><GridIcon size={14} /> Add Grid</button>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.btnPrimary}>Save Project</button>
                    <button type="button" className={styles.btnSecondary} onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
