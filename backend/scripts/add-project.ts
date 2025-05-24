// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import readline from 'readline/promises';
// import type { Project } from '@shared/types/index.ts';
// import { DATA_PATH } from "../utils/shared-vars.ts"
// import { categories } from '../data/schema.ts';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const projectsFilePath = path.join(__dirname, DATA_PATH, 'projects.json');
// const rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout
// });


// async function loadProjects(): Promise<Project[]> {
// 	try {
// 		const data = await fs.readFile(projectsFilePath, 'utf8');
// 		return JSON.parse(data) as Project[];
// 	} catch (error) {
// 		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
// 			console.log('Projects file not found. Creating a new one.');
// 			return [];
// 		}
// 		console.error('Error loading projects:', error);
// 		return [];
// 	}
// }

// async function saveProjects(projects: Project[]): Promise<void> {
// 	try {
// 		await fs.mkdir(path.dirname(projectsFilePath), { recursive: true });
// 		await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2));
// 		console.log('\nProject saved successfully!');
// 	} catch (error) {
// 		console.error('Error saving projects:', error);
// 		throw error;
// 	}
// }

// /**
//  * Validates that categories are available
//  */
// function validateCategories(): boolean {
// 	if (categories.length === 0) {
// 		console.error('No categories available. Please check your schema.ts file.');
// 		rl.close();
// 		return false;
// 	}
// 	return true;
// }

// /**
//  * Collects project details interactively
//  */
// async function collectProjectDetails(): Promise<{
// 	repository: string;
// 	description: string;
// 	name: string;
// 	categoryIndex: number;
// 	submittedBy: string;
// } | null> {
// 	// Get repository URL
// 	const repository = await rl.question('Repository URL (GitHub): ');
// 	if (!repository) {
// 		console.error('Repository URL is required.');
// 		rl.close();
// 		return null;
// 	}

// 	// Get optional description
// 	const description = await rl.question(
// 		'Custom Description (optional, leave blank to use GitHub description): '
// 	);

// 	// Get optional name
// 	let name = '';
// 	const provideCustomName = await rl.question('Do you want to provide a custom name? (y/n): ');
// 	if (provideCustomName.toLowerCase() === 'y') {
// 		name = await rl.question('Custom Project Name: ');
// 	}

// 	// Display and select category
// 	const categoryIndex = await selectCategory();
// 	if (categoryIndex === -1) {
// 		return null;
// 	}

// 	// Get submitter information
// 	const submittedBy = await rl.question('\nYour GitHub username (optional): ');

// 	return { repository, description, name, categoryIndex, submittedBy };
// }

// /**
//  * Displays categories and lets user select one
//  */
// async function selectCategory(): Promise<number> {
// 	console.log('\nAvailable Categories:');
// 	categories.forEach((category, index) => {
// 		console.log(`${index + 1}. ${category}`);
// 	});

// 	const categoryInput = await rl.question(
// 		'\nEnter category number (1-' + categories.length + '): '
// 	);
// 	const categoryIndex = parseInt(categoryInput.trim()) - 1;

// 	if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex >= categories.length) {
// 		console.error('Invalid category selection.');
// 		rl.close();
// 		return -1;
// 	}

// 	return categoryIndex;
// }

// /**
//  * Creates a new project object from collected details
//  */
// function createNewProject(details: {
// 	repository: string;
// 	description: string;
// 	name: string;
// 	categoryIndex: number;
// 	submittedBy: string;
// }): Project {
// 	return {
// 		repository: details.repository,
// 		url: details.repository,
// 		...(details.name && { name: details.name }),
// 		...(details.description && { description: details.description }),
// 		category: categories[details.categoryIndex],
// 		...(details.submittedBy && { submittedBy: details.submittedBy }),
// 		submissionDate: new Date().toISOString().split('T')[0]
// 	} as unknown as Project;
// }

// /**
//  * Main function to add a new project
//  */
// async function addProject(): Promise<void> {
// 	console.log('=== Add New Project to AEC Open Source Directory ===\n');

// 	// Load existing projects
// 	const projects = await loadProjects();

// 	// Validate categories
// 	if (!validateCategories()) return;

// 	// Collect project details
// 	const details = await collectProjectDetails();
// 	if (!details) return;

// 	// Create project object
// 	const newProject = createNewProject(details);

// 	// Save project
// 	projects.push(newProject);
// 	try {
// 		await saveProjects(projects);
// 		console.log('\nProject added successfully.');
// 	} catch (error) {
// 		console.error('Failed to save project:', error);
// 	} finally {
// 		rl.close();
// 	}
// }


// addProject().catch((error) => {
// 	console.error('Unhandled error:', error);
// 	rl.close();
// 	process.exit(1);
// });