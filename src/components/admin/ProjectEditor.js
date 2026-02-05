import React, { useState, useEffect } from 'react';
// Agregamos Pencil a los imports
import { Trash2, Image as ImageIcon, Video, Plus, Check, Monitor, Eye, EyeOff, Pencil } from 'lucide-react';
import { useProjectContext } from '@/context/ProjectContext';

export default function ProjectEditor({ project, onClose, onSave }) {
    // Traemos las nuevas listas y funciones
    const {
        visibleCategories = [],
        allCategories = [],      // IMPORTANTE: Para listar incluso las ocultas
        hiddenCategories = [],   // Para saber el estado del ojo
        addNewCategory,
        toggleCategoryVisibility,
        deleteCategory,
        renameCategory           // Para editar
    } = useProjectContext();

    // --- ESTADOS DEL PROYECTO ---
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [category, setCategory] = useState('Social Media');
    const [year, setYear] = useState(new Date().getFullYear());
    const [cover, setCover] = useState('');
    const [description, setDescription] = useState('');
    const [tools, setTools] = useState('');
    const [credits, setCredits] = useState('');
    const [gridSpacing, setGridSpacing] = useState(20);
    const [blocks, setBlocks] = useState([]);

    // --- MODAL CREAR ---
    const [showCatModal, setShowCatModal] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatVisible, setNewCatVisible] = useState(true);

    // --- MODAL EDITAR (NUEVO) ---
    const [showEditModal, setShowEditModal] = useState(false);
    const [catToEdit, setCatToEdit] = useState(null);
    const [editedName, setEditedName] = useState('');

    // --- CARGAR DATOS ---
    useEffect(() => {
        if (project) {
            setTitle(project.title || '');
            setCategory(project.category || 'Social Media');
            setClient(project.client || '');
            setYear(project.year || new Date().getFullYear());
            setCover(project.cover || '');
            setDescription(project.description || '');
            setTools(Array.isArray(project.tools) ? project.tools.join(', ') : (project.tools || ''));
            setCredits(project.credits || '');
            setGridSpacing(project.gridSpacing !== undefined ? project.gridSpacing : 20);
            setBlocks(project.contentBlocks || []);
        }
    }, [project]);

    // --- GUARDADO GENERAL ---
    const handleSubmit = () => {
        const finalCredits = credits.trim() === '' ? '#RDZ Studio' : credits;
        const projectData = {
            id: project?.id,
            title, category, client, year, cover, description,
            tools: tools.split(',').map(t => t.trim()),
            credits: finalCredits,
            gridSpacing: parseInt(gridSpacing) || 0,
            contentBlocks: blocks
        };
        onSave(projectData);
    };

    // --- GUARDADO NUEVA CATEGORÍA ---
    const handleSaveNewCategory = async () => {
        if (!newCatName.trim()) return alert("Escribí un nombre para la categoría");
        if (addNewCategory) await addNewCategory(newCatName.trim());

        // Si se eligió oculta, la ocultamos inmediatamente
        if (!newCatVisible && toggleCategoryVisibility) await toggleCategoryVisibility(newCatName.trim());

        setCategory(newCatName.trim());
        setShowCatModal(false); setNewCatName(''); setNewCatVisible(true);
    };

    // --- RENOMBRAR CATEGORÍA ---
    const openEditModal = (catName) => {
        setCatToEdit(catName);
        setEditedName(catName);
        setShowEditModal(true);
    };

    const handleRename = async () => {
        if (!editedName.trim() || editedName === catToEdit) {
            setShowEditModal(false);
            return;
        }
        await renameCategory(catToEdit, editedName.trim());
        if (category === catToEdit) setCategory(editedName.trim());
        setShowEditModal(false);
    };

    // --- BLOQUES ---
    const addBlock = (type) => {
        const newBlock = { type, content: type === 'grid' ? [] : '', id: Date.now() };
        if (type === 'video') {
            const url = prompt("Pegá el link del video (YouTube, Vimeo, MP4):");
            if (url) { newBlock.content = url; setBlocks([...blocks, newBlock]); }
        } else { setBlocks([...blocks, newBlock]); }
    };
    const removeBlock = (i) => { const n = [...blocks]; n.splice(i, 1); setBlocks(n); };
    const handleFileUpload = (e, i) => { const f = e.target.files[0]; if (f) { const n = [...blocks]; n[i].content = f; setBlocks(n); } };
    const handleGridUpload = (e, i) => { const f = Array.from(e.target.files); const n = [...blocks]; n[i].content = [...(n[i].content || []), ...f]; setBlocks(n); };
    const getPreviewUrl = (f) => f instanceof File ? URL.createObjectURL(f) : f;

    // Usamos allCategories para el dropdown también, + Otros
    const dropdownOptions = Array.from(new Set([...allCategories, 'Otros']));
    const defaultCats = ['Identidad Visual', 'Social Media', 'Audiovisual'];

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

            <div style={{ width: '98%', maxWidth: '1800px', height: '95vh', background: '#0a0a0a', border: '1px solid #333', borderRadius: '12px', display: 'flex', overflow: 'hidden' }}>

                {/* --- IZQUIERDA: CONFIGURACIÓN --- */}
                <div style={{ width: '400px', background: '#0f0f0f', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #222' }}>
                        <h2 style={{ color: 'white', margin: 0 }}>Configuración</h2>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>TÍTULO DEL PROYECTO</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '6px' }} />
                        </div>

                        {/* --- SECCIÓN DE CATEGORÍA --- */}
                        <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                            <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>CATEGORÍA DEL PROYECTO</label>
                            <select
                                value={category}
                                onChange={(e) => {
                                    if (e.target.value === 'CREATE_NEW') setShowCatModal(true);
                                    else setCategory(e.target.value);
                                }}
                                style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '6px', cursor: 'pointer', marginBottom: '15px' }}
                            >
                                {dropdownOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                <option disabled>──────────</option>
                                <option value="CREATE_NEW">{'>'} Crear nueva...</option>
                            </select>

                            {/* --- LISTA ADMINISTRAR --- */}
                            <div>
                                <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Administrar Categorías</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {/* USAMOS allCategories PARA VER INCLUSO LAS OCULTAS */}
                                    {allCategories.map(cat => {
                                        const isHidden = hiddenCategories.includes(cat);
                                        const isDefault = defaultCats.includes(cat);
                                        return (
                                            <div key={cat} style={{
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                background: isHidden ? '#222' : '#003333', // Feedback visual
                                                padding: '6px 10px', borderRadius: '20px', fontSize: '0.85rem',
                                                border: isHidden ? '1px solid #333' : '1px solid #005555',
                                                opacity: isHidden ? 0.6 : 1
                                            }}>
                                                <span style={{ color: isHidden ? '#888' : '#00FFFF' }}>{cat}</span>

                                                {/* Botón Ojo */}
                                                <button onClick={() => toggleCategoryVisibility(cat)} title={isHidden ? "Mostrar" : "Ocultar"} style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                                    {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>

                                                {/* Solo categorías custom se pueden editar/borrar */}
                                                {!isDefault && (
                                                    <>
                                                        <button onClick={() => openEditModal(cat)} title="Editar" style={{ background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', padding: 0, display: 'flex', marginLeft: '2px' }}>
                                                            <Pencil size={13} />
                                                        </button>
                                                        <button onClick={() => deleteCategory(cat)} title="Eliminar (Mover a Otros)" style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', padding: 0, display: 'flex', marginLeft: '2px' }}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {allCategories.length === 0 && <span style={{ color: '#555', fontSize: '0.85rem', fontStyle: 'italic' }}>No hay categorías.</span>}
                                </div>
                            </div>
                        </div>

                        {/* RESTO DE INPUTS (IGUAL AL ORIGINAL) */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>CLIENTE</label>
                                <input value={client} onChange={e => setClient(e.target.value)} style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '6px' }} />
                            </div>
                            <div style={{ width: '100px' }}>
                                <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>AÑO</label>
                                <input type="number" value={year} onChange={e => setYear(e.target.value)} style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '6px' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>ESPACIADO ENTRE FOTOS (PX)</label>
                            <input type="number" value={gridSpacing} onChange={e => setGridSpacing(e.target.value)} style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '6px' }} />
                        </div>

                        <div>
                            <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>PORTADA</label>
                            <div onClick={() => document.getElementById('coverInput').click()} style={{ width: '100%', height: '150px', background: '#1a1a1a', border: '1px dashed #444', borderRadius: '6px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {cover ? <img src={getPreviewUrl(cover)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#666' }}>Subir Portada</span>}
                            </div>
                            <input id="coverInput" type="file" hidden onChange={e => setCover(e.target.files[0])} />
                        </div>

                        <div>
                            <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>DESCRIPCIÓN DEL PROYECTO</label>
                            <textarea rows={6} value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '6px', resize: 'vertical' }} />
                        </div>

                        <div>
                            <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>HERRAMIENTAS (Separar con comas)</label>
                            <input value={tools} onChange={e => setTools(e.target.value)} placeholder="Photoshop, Illustrator..." style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '6px' }} />
                        </div>

                        <div>
                            <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>CRÉDITOS</label>
                            <input value={credits} onChange={e => setCredits(e.target.value)} placeholder="Dejar vacío para usar #RDZ Studio" style={{ width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '6px' }} />
                        </div>

                        <div style={{ borderTop: '1px solid #222', paddingTop: '20px' }}>
                            <label style={{ color: '#fff', fontSize: '1rem', display: 'block', marginBottom: '15px', fontWeight: 'bold' }}>Agregar Contenido</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <button onClick={() => addBlock('image')} style={{ padding: '15px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><ImageIcon size={18} /> Imagen</button>
                                <button onClick={() => addBlock('video')} style={{ padding: '15px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Video size={18} /> Video</button>
                                <button onClick={() => addBlock('grid')} style={{ padding: '15px', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', gridColumn: '1/-1' }}><Plus size={18} /> Grilla Horizontal</button>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', padding: '20px', borderTop: '1px solid #222' }}>
                        <button onClick={handleSubmit} style={{ width: '100%', padding: '15px', background: '#00FFFF', color: '#000', border: 'none', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', marginBottom: '10px' }}>GUARDAR PROYECTO</button>
                        <button onClick={onClose} style={{ width: '100%', padding: '15px', background: 'transparent', color: '#888', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                    </div>
                </div>

                {/* --- DERECHA: VISTA PREVIA (REAL) --- */}
                <div style={{ flex: 1, background: '#000', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ padding: '15px', borderBottom: '1px solid #222', background: '#0f0f0f', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#666', fontSize: '0.9rem' }}>
                        <span>VISTA PREVIA REAL</span>
                        <Monitor size={18} />
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: `${gridSpacing}px`, paddingBottom: '100px', paddingTop: '20px' }}>
                            {blocks.map((block, index) => (
                                <div key={block.id} style={{ position: 'relative', width: '100%' }} className="preview-block">
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 50 }}>
                                        <button onClick={() => removeBlock(index)} style={{ background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                    </div>
                                    {block.type === 'image' && (
                                        <div onClick={() => document.getElementById(`file-${index}`).click()} style={{ width: '100%', minHeight: '100px', background: '#111', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {block.content ? <img src={getPreviewUrl(block.content)} style={{ width: '100%', display: 'block' }} /> : <div style={{ padding: '40px', color: '#444' }}>Click para subir imagen</div>}
                                            <input id={`file-${index}`} type="file" hidden onChange={(e) => handleFileUpload(e, index)} />
                                        </div>
                                    )}
                                    {block.type === 'video' && (
                                        <div style={{ width: '100%', background: '#000' }}>
                                            {block.content ? <div style={{ padding: '40px', background: '#111', color: '#00FFFF', border: '1px solid #222', textAlign: 'center' }}>[VIDEO]: {block.content}</div> : <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Video sin URL</div>}
                                        </div>
                                    )}
                                    {block.type === 'grid' && (
                                        <div style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', width: '100%', gap: `${gridSpacing}px` }}>
                                                {block.content && block.content.map((item, i) => (
                                                    <div key={i} style={{ flex: 1, position: 'relative' }}>
                                                        <img src={getPreviewUrl(item)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                                    </div>
                                                ))}
                                                <div onClick={() => document.getElementById(`grid-${index}`).click()} style={{ width: '80px', minWidth: '80px', background: '#1a1a1a', border: '1px dashed #444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', alignSelf: 'stretch' }}><Plus size={24} /></div>
                                            </div>
                                            <input id={`grid-${index}`} type="file" multiple hidden onChange={(e) => handleGridUpload(e, index)} />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {blocks.length === 0 && <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', border: '2px dashed #222', margin: '20px', borderRadius: '12px' }}>Vista Previa (Agregá contenido desde la izquierda)</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL CREAR CATEGORÍA */}
            {showCatModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '30px', width: '400px' }}>
                        <h3 style={{ color: 'white', marginTop: 0 }}>Nueva Categoría</h3>
                        <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', color: '#888', marginBottom: '10px' }}>Nombre</label><input value={newCatName} onChange={e => setNewCatName(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '6px' }} /></div>
                        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setNewCatVisible(!newCatVisible)}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '1px solid #555', background: newCatVisible ? '#00FFFF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{newCatVisible && <Check size={14} color="black" />}</div><span style={{ color: '#ccc' }}>Visible en menú</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setShowCatModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={handleSaveNewCategory} style={{ flex: 1, padding: '12px', background: '#00FFFF', border: 'none', color: 'black', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Crear</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EDITAR CATEGORÍA (NUEVO) */}
            {showEditModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '30px', width: '400px' }}>
                        <h3 style={{ color: 'white', marginTop: 0 }}>Editar Categoría</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: '#888', marginBottom: '10px' }}>Nombre nuevo</label>
                            <input value={editedName} onChange={e => setEditedName(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '6px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #333', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
                            <button onClick={handleRename} style={{ flex: 1, padding: '12px', background: '#00FFFF', border: 'none', color: 'black', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Renombrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}