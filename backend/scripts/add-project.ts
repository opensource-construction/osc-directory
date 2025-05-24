import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline/promises';
import type { Project } from '@shared/types/index.ts';
import { DATA_PATH } from "../utils/shared-vars.ts"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsFilePath = path.join(__dirname, DATA_PATH, 'projects.json');

// Create readline interface for user input
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

async function loadCategories(): Promise<readonly string[]> {
	try {
		// Using dynamic import to load the categories from schema.js
		const schemaModule = await import('../data/schema.ts');
		return schemaModule.categories;
	} catch (error) {
		console.error('Error loading categories:', error instanceof Error ? error.message : String(error));
		return [];
	}
}

async function loadProjects(): Promise<Project[]> {
	try {
		const data = await fs.readFile(projectsFilePath, 'utf8');
		return JSON.parse(data) as Project[];
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			console.log('Projects file not found. Creating a new one.');
			return [];
		}
		console.error('Error loading projects:', error instanceof Error ? error.message : String(error));
		return [];
	}
}

async function saveProjects(projects: Project[]): Promise<void> {
	try {
		// Ensure the directory exists
		const dirPath = path.dirname(projectsFilePath);
		await fs.mkdir(dirPath, { recursive: true });

		await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2));
		console.log('\nProject saved successfully!');
	} catch (error) {
		console.error('Error saving projects:', error instanceof Error ? error.message : String(error));
		throw error; // Re-throw to be caught by the caller
	}
}

// Interface for our new project data
interface NewProjectData {
	name?: string;
	repository: string;
	url: string;
	description?: string;
	category: string;
	submittedBy?: string;
	submissionDate: string;
}

async function addProject(): Promise<void> {
	console.log('=== Add New Project to AEC Open Source Directory ===\n');

	const projects = await loadProjects();
	const categories = await loadCategories();

	if (categories.length === 0) {
		console.error('No categories available. Please check your schema.ts file.');
		rl.close();
		return;
	}

	// Get required project information
	const repository = await rl.question('Repository URL (GitHub): ');

	if (!repository) {
		console.error('Repository URL is required.');
		rl.close();
		return;
	}

	const description = await rl.question(
		'Custom Description (optional, leave blank to use GitHub description): '
	);

	// Optional: Get custom name if different from repository name
	const provideCustomName = await rl.question('Do you want to provide a custom name? (y/n): ');
	let name = '';
	if (provideCustomName.toLowerCase() === 'y') {
		name = await rl.question('Custom Project Name: ');
	}

	// Show categories
	console.log('\nAvailable Categories:');
	categories.forEach((category, index) => {
		console.log(`${index + 1}. ${category}`);
	});

	// Get category (single selection only)
	const categoryInput = await rl.question(
		'\nEnter category number (1-' + categories.length + '): '
	);
	const categoryIndex = parseInt(categoryInput.trim()) - 1;

	// Validate category selection
	if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex >= categories.length) {
		console.error('Invalid category selection. Please select a number between 1 and ' + categories.length);
		rl.close();
		return;
	}

	const selectedCategory = categories[categoryIndex];

	// Get submitter info
	const submittedBy = await rl.question('\nYour GitHub username (optional): ');

	// Create new project object
	const newProject: NewProjectData = {
		repository,
		url: repository,
		...(name && { name }),
		...(description && { description }),
		category: selectedCategory,
		...(submittedBy && { submittedBy }),
		submissionDate: new Date().toISOString().split('T')[0]
	};

	// Add project to projects array
	projects.push(newProject as unknown as Project);

	try {
		// Save projects to file
		await saveProjects(projects);

		// Show project information
		console.log('\nProject added:');
		console.log(JSON.stringify(newProject, null, 2));
		console.log('\nMetadata will be automatically fetched from GitHub when update-metadata.ts runs.');
	} catch (error) {
		console.error('Failed to save project:', error instanceof Error ? error.message : String(error));
	} finally {
		rl.close();
	}
}

// Run the function with proper error handling
addProject().catch((error) => {
	console.error('Unhandled error:', error instanceof Error ? error.message : String(error));
	rl.close();
	process.exit(1);
});