"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { Menu, X } from 'lucide-react'; // Asegurate de tener lucide-react instalado

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className={styles.header}>
            {/* LOGO */}
            <Link href="/" className={styles.logo}>
                #RDZ
            </Link>

            {/* NAVEGACIÓN DE ESCRITORIO (Se oculta en móvil) */}
            <nav className={styles.nav}>
                <Link href="#home" className={styles.navLink}>Inicio</Link>
                <Link href="#works" className={styles.navLink}>Proyectos</Link>
                <Link href="#about" className={styles.navLink}>Sobre Mí</Link>
                <Link href="#contact" className={styles.navLink}>Contacto</Link>
            </nav>

            {/* BOTÓN DE MENÚ MÓVIL (SOLO VISIBLE EN CELULAR) */}
            <button
                className={styles.mobileMenuBtn}
                onClick={toggleMenu}
                aria-label="Abrir menú"
            >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* MENÚ DESPLEGABLE (SOLO MÓVIL) */}
            {menuOpen && (
                <div className={styles.mobileDropdown}>
                    <Link href="#home" onClick={toggleMenu} className={styles.mobileLink}>Inicio</Link>
                    <Link href="#works" onClick={toggleMenu} className={styles.mobileLink}>Proyectos</Link>
                    <Link href="#about" onClick={toggleMenu} className={styles.mobileLink}>Sobre Mí</Link>
                    <Link href="#contact" onClick={toggleMenu} className={styles.mobileLink}>Contacto</Link>
                </div>
            )}
        </header>
    );
}