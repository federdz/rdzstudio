"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { Menu, X } from 'lucide-react';

import { useProjectContext } from '@/context/ProjectContext';

export default function Header() {
    const { siteContent } = useProjectContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // LÓGICA HÍBRIDA (VELOCIDAD + FLEXIBILIDAD)
    // 1. Intentamos leer el logo de la base de datos (Firebase)
    const firebaseLogo = siteContent?.identity?.logo;

    // 2. Si Firebase aún no cargó (o no hay logo), usamos el archivo local '/logo.png'
    // IMPORTANTE: Tenés que tener un archivo llamado 'logo.png' en tu carpeta 'public'
    const logoSrc = firebaseLogo || '/logo.png';

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link href="/">
                    {/* Renderizamos la imagen directamente. 
                        Al iniciar, mostrará '/logo.png' instantáneamente (0 espera).
                        Si luego Firebase carga una imagen distinta, se actualizará sola. */}
                    <img
                        src={logoSrc}
                        alt="RDZ Studio"
                        style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
                    />
                </Link>
            </div>

            <button className={styles.menuBtn} onClick={toggleMenu}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
                <Link href="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                <Link href="#works" onClick={() => setIsMenuOpen(false)}>Proyectos</Link>
                <Link href="#about" onClick={() => setIsMenuOpen(false)}>Sobre mí</Link>
                <Link href="#contact" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
            </nav>
        </header>
    );
}