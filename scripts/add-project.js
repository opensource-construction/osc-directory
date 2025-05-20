import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsFilePath = path.join(__dirname, '..', 'data', 'projects.json');

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

async function loadCategories() {
	try {
		// Using dynamic import to load the categories from schema.ts
		const schemaModule = await import('../data/schema.js');
		return schemaModule.categories;
	} catch (error) {
		console.error('Error loading categories:', error);
		return [];
	}
}

async function loadProjects() {
	try {
		const data = await fs.readFile(projectsFilePath, 'utf8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Error loading projects:', error);
		return [];
	}
}

async function saveProjects(projects) {
	try {
		await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2));
		console.log('\nProject saved successfully!');
	} catch (error) {
		console.error('Error saving projects:', error);
	}
}

async function addProject() {
	console.log('=== Add New Project to AEC Open Source Directory ===\n');

	const projects = await loadProjects();
	const categories = await loadCategories();

	// Get project information
	const name = await rl.question('Project Name: ');
	const url = await rl.question('Project URL: ');
	const description = await rl.question('Description: ');

	// Show categories
	console.log('\nAvailable Categories:');
	categories.forEach((cat, index) => {
		console.log(`${index + 1}. ${cat.name} - ${cat.description}`);
	});

	// Get categories
	const categoryInput = await rl.question(
		'\nEnter category numbers (comma-separated, e.g., "1,3,4"): '
	);
	const selectedCategories = categoryInput
		.split(',')
		.map((num) => parseInt(num.trim()) - 1)
		.filter((num) => num >= 0 && num < categories.length)
		.map((index) => categories[index].id);

	// Get submitter info
	const submittedBy = await rl.question('\nYour GitHub username: ');

	// Create new project object
	const newProject = {
		name,
		url,
		description,
		category: selectedCategories,
		submittedBy,
		submissionDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
	};

	// Add project to projects array
	projects.push(newProject);

	// Save projects to file
	await saveProjects(projects);

	// Show project information
	console.log('\nProject added:');
	console.log(JSON.stringify(newProject, null, 2));

	rl.close();
}

// Run the function
addProject().catch((error) => {
	console.error('Error:', error);
	rl.close();
});
