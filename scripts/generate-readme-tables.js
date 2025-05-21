import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'projects.json');
const readmePath = path.join(__dirname, '..', 'README.md');

async function generateReadmeTables() {
	try {
		// Import categories (assuming they're simple strings now)
		const { categories } = await import('../src/lib/data/schema.js');

		// Read projects data
		const projectsData = JSON.parse(await fs.readFile(projectsPath, 'utf8'));

		// Read current README content
		let readmeContent = await fs.readFile(readmePath, 'utf8');

		// Find where to insert tables
		const startMarker = '## Projects';
		const endMarker = '## Contributing';

		const startIndex = readmeContent.indexOf(startMarker);
		const endIndex = readmeContent.indexOf(endMarker);

		if (startIndex === -1 || endIndex === -1) {
			console.error('Could not find markers in README');
			return;
		}

		// Create tables content
		let tablesContent = '## Projects\n\n';

		// Generate tables for each category
		for (const category of categories) {
			// Filter projects by category (now it's an array)
			const categoryProjects = projectsData.filter(
				(project) =>
					project.category &&
					(Array.isArray(project.category)
						? project.category.map((c) => c.toLowerCase()).includes(category.toLowerCase())
						: project.category.toLowerCase() === category.toLowerCase())
			);

			if (categoryProjects.length > 0) {
				tablesContent += `### ${category}\n\n`;
				tablesContent += `| Project | Description | Language | Stars | Last Updated | License |\n`;
				tablesContent += `|---------|-------------|----------|-------|--------------|--------|\n`;

				for (const project of categoryProjects) {
					const lastUpdated =
						project.lastUpdated || project.lastCommit
							? new Date(project.lastUpdated || project.lastCommit).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric'
								})
							: 'N/A';

					tablesContent += `| [${project.name}](${project.url}) | ${project.description} | ${project.mainLanguage || project.language || 'N/A'} | ${project.stars || 0} | ${lastUpdated} | ${project.license || 'N/A'} |\n`;
				}

				tablesContent += '\n';
			}
		}

		// Replace the section in the README
		const newReadmeContent =
			readmeContent.substring(0, startIndex) + tablesContent + readmeContent.substring(endIndex);

		// Write the new README
		await fs.writeFile(readmePath, newReadmeContent);
		console.log('README tables generated successfully!');
	} catch (error) {
		console.error('Error generating README tables:', error);
		throw error; // Re-throw to see the error in the workflow
	}
}

// Run the function
generateReadmeTables();
