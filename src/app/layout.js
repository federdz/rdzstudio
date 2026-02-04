import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
    title: "#RDZ Studio",
    description: "Audiovisual Design Portfolio",
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
