import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Project } from '../src/lib/types/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'projects.json');
const readmePath = path.join(__dirname, '..', 'README.md');


async function generateReadmeTables(): Promise<void> {
	try {
		// Read projects data
		const projectsData: Project[] = JSON.parse(await fs.readFile(projectsPath, 'utf8'));

		// Read current README content
		let readmeContent = await fs.readFile(readmePath, 'utf8');

		// Find where to insert table
		const startMarker = '## Projects';
		const endMarker = '## Contributing';

		const startIndex = readmeContent.indexOf(startMarker);
		const endIndex = readmeContent.indexOf(endMarker);

		if (startIndex === -1 || endIndex === -1) {
			console.error('Could not find markers in README');
			return;
		}

		// Start building one big table for all projects
		let tableContent = '## Projects\n\n';
		tableContent += `| Project | Description | Language | Stars | Last Updated | License |\n`;
		tableContent += `|---------|-------------|----------|-------|--------------|--------|\n`;

		for (const project of projectsData) {
			const lastUpdatedDate = project.lastUpdated ? new Date(project.lastUpdated) : undefined;

			const lastUpdated = lastUpdatedDate
				? lastUpdatedDate.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})
				: 'N/A';

			tableContent += `| [${project.name}](${project.url}) | ${project.description} | ${project.mainLanguage || 'N/A'} | ${project.stars || 0} | ${lastUpdated} | ${project.license || 'N/A'} |\n`;
		}

		tableContent += '\n';

		// Replace the section in the README
		const newReadmeContent =
			readmeContent.substring(0, startIndex) + tableContent + readmeContent.substring(endIndex);

		// Write the new README
		await fs.writeFile(readmePath, newReadmeContent);
		console.log('README tables generated successfully!');
	} catch (error) {
		console.error('Error generating README tables:', error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

// Run the function
generateReadmeTables().catch(error => {
	console.error('Unhandled error in generateReadmeTables:', error instanceof Error ? error.message : String(error));
	process.exit(1);
});