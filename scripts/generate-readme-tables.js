import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsPath = path.join(__dirname, '..', 'data', 'projects.json');
const readmePath = path.join(__dirname, '..', 'README.md');
const schemaPath = path.join(__dirname, '..', 'data', 'schema.js');

async function generateReadmeTables() {
	try {
		// Import categories
		const { categories } = await import('../data/schema.js');

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
			const categoryProjects = projectsData.filter((project) =>
				project.category.includes(category.id)
			);

			if (categoryProjects.length > 0) {
				tablesContent += `### ${category.name}\n\n${category.description}\n\n`;
				tablesContent += `| Project | Description | Language | Stars | Last Updated | License |\n`;
				tablesContent += `|---------|-------------|----------|-------|--------------|--------|\n`;

				for (const project of categoryProjects) {
					const lastUpdated = project.lastUpdated
						? new Date(project.lastUpdated).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric'
							})
						: 'N/A';

					tablesContent += `| [${project.name}](${project.url}) | ${project.description} | ${project.mainLanguage || 'N/A'} | ${project.stars || 0} | ${lastUpdated} | ${project.license || 'N/A'} |\n`;
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
	}
}

// Run the function
generateReadmeTables();
