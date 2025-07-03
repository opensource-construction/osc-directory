import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		// Load from local backend data directory
		const projectsPath = path.join(process.cwd(), '..', 'backend', 'data', 'projects.json');
		const data = fs.readFileSync(projectsPath, 'utf-8');
		const projects = JSON.parse(data);
		
		return json(projects);
	} catch (error) {
		console.error('Error loading local projects:', error);
		// Return empty array if local file not found
		return json([]);
	}
};
