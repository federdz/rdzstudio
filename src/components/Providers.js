"use client";

import { ProjectProvider } from "@/context/ProjectContext";

export default function Providers({ children }) {
    return (
        <ProjectProvider>
            {children}
        </ProjectProvider>
    );
}
