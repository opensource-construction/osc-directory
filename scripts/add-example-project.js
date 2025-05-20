import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path of the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsPath = path.join(__dirname, '..', 'data', 'projects.json');

// Sample project to add
const newProject = {
	name: 'Example Project',
	url: 'https://github.com/isl-org/Open3D',
	description: 'This is an example AEC project',
	category: ['visualization', 'bim']
};

async function addProject() {
	try {
		// Read the existing projects
		const projectsData = await fs.readFile(projectsPath, 'utf8');
		const projects = JSON.parse(projectsData);

		// Add the new project
		projects.push(newProject);

		// Write back to file
		await fs.writeFile(projectsPath, JSON.stringify(projects, null, 2));
		console.log('Project added successfully!');
		console.log('To add your own project, edit this file with your project details');
	} catch (error) {
		console.error('Error adding project:', error);
	}
}

// Run the function
addProject();
