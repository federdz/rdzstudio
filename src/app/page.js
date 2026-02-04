"use client";
import React, { useState } from 'react';
import LiquidBackground from '@/components/LiquidBackground';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import AboutSection from '@/components/AboutSection';
import ContactFooter from '@/components/ContactFooter';

export default function Home() {
    const [activeCategory, setActiveCategory] = useState('Todos');

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    return (
        <main>
            <LiquidBackground />
            <Header />
            <HeroSection />
            <ProjectsSection activeFilter={activeCategory} onFilterChange={handleCategoryChange} />
            <AboutSection onCategoryClick={handleCategoryChange} />
            <ContactFooter />
        </main>
    );
}
