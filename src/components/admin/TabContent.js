"use client";
import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { useProjectContext } from '@/context/ProjectContext';
import { Upload, Info } from 'lucide-react';
import { convertFileToBase64 } from '@/utils/helpers';

export default function TabContent() {
    const { siteContent, updateSiteContent } = useProjectContext();

    const [hero, setHero] = useState(siteContent?.hero || { title: '#RDZ Studio', subtitle: 'Audiovisual Design' });
    const [about, setAbout] = useState(siteContent?.about || { bio: '', photo: '' });
    const [contact, setContact] = useState(siteContent?.contact || { email: 'hello@rdzstudio.com' });
    const [identity, setIdentity] = useState(siteContent?.identity || { logo: '' });

    // Sincronizar estado cuando cargan los datos de Firebase
    useEffect(() => {
        if (siteContent) {
            setHero(siteContent.hero || {});
            setAbout(siteContent.about || {});
            setContact(siteContent.contact || {});
            setIdentity(siteContent.identity || {});
        }
    }, [siteContent]);

    const handleSave = async () => {
        try {
            await Promise.all([
                updateSiteContent('hero', hero),
                updateSiteContent('about', about),
                updateSiteContent('contact', contact),
                updateSiteContent('identity', identity)
            ]);
            console.log("Todo guardado correctamente");
        } catch (error) {
            console.error("Error guardando:", error);
            alert("Hubo un error al guardar.");
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await convertFileToBase64(file);
                setIdentity(prev => ({ ...prev, logo: base64 }));
            } catch (error) {
                console.error("Error converting logo:", error);
            }
        }
    };

    // Crop Logic
    const [cropImage, setCropImage] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imgRef = React.useRef(null);

    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCropImage(URL.createObjectURL(file));
            setZoom(1);
            setCropPos({ x: 0, y: 0 });
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - cropPos.x, y: e.clientY - cropPos.y });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setCropPos({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const performCrop = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetWidth = 600;
        const targetHeight = 750;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const img = imgRef.current;
        if (!img) return;

        const scaleFactor = targetWidth / 300;
        const finalZoom = zoom * scaleFactor;
        const scaledW = img.naturalWidth * finalZoom;
        const scaledH = img.naturalHeight * finalZoom;

        const centerX = (canvas.width / 2) + (cropPos.x * scaleFactor);
        const centerY = (canvas.height / 2) + (cropPos.y * scaleFactor);

        const x = centerX - (scaledW / 2);
        const y = centerY - (scaledH / 2);

        ctx.drawImage(img, x, y, scaledW, scaledH);

        const croppedUrl = canvas.toDataURL('image/png');
        setAbout(prev => ({ ...prev, photo: croppedUrl }));
        setCropImage(null);
    };

    return (
        <div>
            <div className={styles.header}>
                <h1>Site Content</h1>
            </div>

            {/* IDENTITY & HERO */}
            <div className={styles.sectionBlock}>
                <div className={styles.sectionTitle}>Identity & Home</div>

                {/* LOGO (SE MANTIENE) */}
                <div className={styles.field}>
                    <label className={styles.label}>Logo</label>
                    <div className={styles.dropzone} onClick={() => document.getElementById('logoUpload').click()}>
                        <Upload size={20} />
                        <span>Upload Logo</span>
                        <input id="logoUpload" type="file" accept="image/*" hidden onChange={handleLogoUpload} />
                    </div>
                    {identity.logo && <img src={identity.logo} alt="Logo Preview" style={{ marginTop: '1rem', maxHeight: '50px', objectFit: 'contain' }} />}
                </div>

                {/* CAMBIO: ELIMINADO EL TEXTAREA DE HOME VALUE PROP */}
                {/* Agregamos una nota informativa en su lugar */}
                <div className={styles.field} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '0.9rem' }}>
                        <Info size={16} />
                        <span>El texto de portada se gestiona desde el código (Animación Typewriter).</span>
                    </div>
                </div>
            </div>

            {/* ABOUT SECTION (SE MANTIENE INTACTO) */}
            <div className={styles.sectionBlock}>
                <div className={styles.sectionTitle}>About Section</div>
                <div className={styles.field}>
                    <label className={styles.label}>Bio Text</label>
                    <textarea
                        className={styles.textarea}
                        rows={6}
                        value={about.bio || ''}
                        onChange={e => setAbout({ ...about, bio: e.target.value })}
                        placeholder="Soy Federico Rodriguez Larocca..."
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>About Photo</label>
                    <div className={styles.dropzone} onClick={() => document.getElementById('aboutPhoto').click()}>
                        <Upload size={20} />
                        <span>Upload Profile Photo</span>
                        <input id="aboutPhoto" type="file" accept="image/*" hidden onChange={handlePhotoSelect} />
                    </div>
                    {about.photo && <img src={about.photo} alt="Bio Preview" style={{ marginTop: '1rem', width: '150px', borderRadius: '8px' }} />}
                </div>
            </div>

            {/* CROPPER MODAL (SE MANTIENE INTACTO) */}
            {cropImage && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ background: '#111', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Adjust Photo</h3>

                        <div
                            style={{
                                width: '300px', height: '375px',
                                border: '2px solid cyan', overflow: 'hidden', position: 'relative',
                                cursor: 'grab',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundImage: `linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)`,
                                backgroundSize: '20px 20px',
                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                                backgroundColor: '#111'
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <img
                                ref={imgRef}
                                src={cropImage}
                                alt="Crop"
                                style={{
                                    transform: `translate(${cropPos.x}px, ${cropPos.y}px) scale(${zoom})`,
                                    userSelect: 'none',
                                    pointerEvents: 'none',
                                    maxWidth: 'none',
                                    maxHeight: 'none'
                                }}
                            />
                        </div>

                        <div style={{ marginTop: '1rem', width: '100%', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ color: 'white' }}>Zoom:</span>
                            <input
                                type="range" min="0.1" max="3" step="0.1"
                                value={zoom}
                                onChange={e => setZoom(parseFloat(e.target.value))}
                                style={{ flex: 1 }}
                            />
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setCropImage(null)} style={{ padding: '0.5rem 1rem', background: '#444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={performCrop} style={{ padding: '0.5rem 1rem', background: '#00FFFF', color: 'black', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>CROP & SAVE</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTACT INFO (SE MANTIENE INTACTO) */}
            <div className={styles.sectionBlock}>
                <div className={styles.sectionTitle}>Contact Info</div>
                <div className={styles.field}>
                    <label className={styles.label}>Email Address</label>
                    <input className={styles.input} value={contact.email || ''} onChange={e => setContact({ ...contact, email: e.target.value })} />
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.btnPrimary} onClick={handleSave}>Save Changes</button>
            </div>
        </div>
    );
}