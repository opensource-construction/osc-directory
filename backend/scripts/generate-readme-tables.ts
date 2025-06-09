import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Project } from '@shared/types/index.ts';
import { DATA_PATH } from '../utils/shared-vars.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsPath = path.join(__dirname, DATA_PATH, 'projects.json');
const readmePath = path.join(__dirname, '..', '..', 'README.md');

/**
 * Loads projects data from JSON file
 */
async function loadProjects(): Promise<Project[]> {
	try {
		const data = await fs.readFile(projectsPath, 'utf8');
		return JSON.parse(data) as Project[];
	} catch (error) {
		console.error('Error loading projects:', error);
		return [];
	}
}

/**
 * Loads current README content
 */
async function loadReadme(): Promise<string> {
	try {
		return await fs.readFile(readmePath, 'utf8');
	} catch (error) {
		console.error('Error reading README file:', error);
		return '';
	}
}

/**
 * Format a date string into a readable format
 */
function formatDate(dateString: string | undefined): string {
	if (!dateString) return 'N/A';

	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	} catch {
		return 'N/A';
	}
}

/**
 * Generates table content for all the project
 */
function generateProjectTable(projects: Project[]): string {
	if (projects.length === 0) return '';

	let tableContent = `| Project | Description | Language | Stars | Last Updated | License |\n`;
	tableContent += `|---------|-------------|----------|-------|--------------|--------|\n`;

	for (const project of projects) {
		const lastUpdated = formatDate(project.lastUpdated);

		tableContent += `| [${project.name}](${project.url}) | ${
			project.description || 'N/A'
		} | ${project.mainLanguage || 'N/A'} | ${
			project.stars || 0
		} | ${lastUpdated} | ${project.license || 'N/A'} |\n`;
	}

	return tableContent + '\n';
}

/**
 * Updates the README file with new content
 */
async function updateReadme(readmeContent: string, tablesContent: string): Promise<void> {
	const startMarker = '## Projects';

	const startIndex = readmeContent.indexOf(startMarker);

	if (startIndex === -1) {
		throw new Error('Could not find start marker "## Projects" in README');
	}

	// Keep everything before the Projects section and add the new tables content
	const newReadmeContent = readmeContent.substring(0, startIndex) + tablesContent;

	await fs.writeFile(readmePath, newReadmeContent);
}

/**
 * Main function to generate README tables
 */
async function generateReadmeTables(): Promise<void> {
	try {
		// Load data
		const projects = await loadProjects();
		const readmeContent = await loadReadme();

		// Generate single unified table
		let tablesContent = '## Projects\n\n';
		tablesContent += generateProjectTable(projects);

		// Update README
		await updateReadme(readmeContent, tablesContent);
		console.log('README tables generated successfully!');
	} catch (error) {
		console.error(
			'Error generating README tables:',
			error instanceof Error ? error.message : String(error)
		);
		process.exit(1);
	}
}

// Run the function
generateReadmeTables().catch((error) => {
	console.error(
		'Unhandled error in generateReadmeTables:',
		error instanceof Error ? error.message : String(error)
	);
	process.exit(1);
});
