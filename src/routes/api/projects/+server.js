import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsPath = path.join(__dirname, '../../../../data/projects.json');

export async function GET() {
	try {
		const projectsData = await fs.readFile(projectsPath, 'utf8');
		const projects = JSON.parse(projectsData);

		return json(projects);
	} catch (error) {
		console.error('Error reading projects data:', error);
		return json({ error: 'Failed to load projects data' }, { status: 500 });
	}
}
