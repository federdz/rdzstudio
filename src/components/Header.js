"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { Menu, X } from 'lucide-react';

import { useProjectContext } from '@/context/ProjectContext';

export default function Header() {
    const { siteContent } = useProjectContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Safety check for siteContent
    const logoUrl = siteContent?.identity?.logo;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link href="/">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} key={logoUrl} />
                    ) : (
                        <div className={styles.logoPlaceholder}></div>
                    )}
                </Link>
            </div>

            <button className={styles.menuBtn} onClick={toggleMenu}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
                <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link href="#works" onClick={() => setIsMenuOpen(false)}>Works</Link>
                <Link href="#about" onClick={() => setIsMenuOpen(false)}>About</Link>
                <Link href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </nav>
        </header>
    );
}
