import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
    title: "RDZ Studio | Diseño Audiovisual",
    description: "Portfolio de Federico Rodríguez Larocca. Diseño gráfico, web y producción audiovisual.",
    icons: {
        icon: "/favicon.ico", // Esto buscará tu ícono en la carpeta public
    },
    openGraph: {
        title: "RDZ Studio | Portfolio Oficial",
        description: "Diseño gráfico y producción audiovisual. Mirá mis últimos proyectos.",
        url: "https://rdzstudio.vercel.app", // (Poné aquí el link real que te dio Vercel)
        siteName: "RDZ Studio",
        images: [
            {
                url: "/og-image.jpg", // (Más adelante subiremos una foto con este nombre a la carpeta public)
                width: 1200,
                height: 630,
            },
        ],
        locale: "es_AR",
        type: "website",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
