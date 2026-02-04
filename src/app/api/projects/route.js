import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/projects.json');

export async function GET() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const projects = JSON.parse(fileContents);
        return Response.json(projects);
    } catch (error) {
        return Response.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const newProject = await request.json();
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const projects = JSON.parse(fileContents);

        // Simple ID generation
        newProject.id = Date.now().toString();

        const updatedProjects = [newProject, ...projects];

        await fs.writeFile(dataFilePath, JSON.stringify(updatedProjects, null, 2));

        return Response.json(newProject);
    } catch (error) {
        return Response.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
