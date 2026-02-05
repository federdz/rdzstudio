import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import AboutSection from '@/components/AboutSection';
import ContactFooter from '@/components/ContactFooter';
import LiquidBackground from '@/components/LiquidBackground';

export default function Home() {
    return (
        <main>
            {/* Fondo Animado (Va primero para quedar atrás) */}
            <LiquidBackground />

            {/* Menú de Navegación */}
            <Header />

            {/* Sección 1: Portada / Hola soy Federico... */}
            <HeroSection />

            {/* Sección 2: Galería de Proyectos (Conectada a Firebase) */}
            <ProjectsSection />

            {/* Sección 3: Quién soy */}
            <AboutSection />

            {/* Sección 4: Pie de página / Contacto */}
            <ContactFooter />
        </main>
    );
}