import fs from 'fs/promises';
import path from 'path';
import { categories } from '../data/schema.js';

async function generateReadmeTables() {
	try {
		const projectsPath = path.join(process.cwd(), 'data', 'projects.json');
		const readmePath = path.join(process.cwd(), 'README.md');

		// Read projects data
		const projectsData = JSON.parse(await fs.readFile(projectsPath, 'utf8'));

		// Read current README content
		let readmeContent = await fs.readFile(readmePath, 'utf8');

		// Create a new README content with header and introduction
		let newReadmeContent = `# AEC Open Source Directory

A curated list of open source projects for the Architecture, Engineering, and Construction (AEC) industry.

## How to Add a Project

To add a project to this directory:

1. Fork this repository
2. Create a Pull Request using the "Add Project" template
3. Fill in the project details
4. Submit the PR for review

Approved projects will automatically be added to the directory with updated metadata.

## Categories

`;

		// Generate tables for each category
		for (const category of categories) {
			const categoryProjects = projectsData.filter((project) =>
				project.category.includes(category.id)
			);

			if (categoryProjects.length > 0) {
				newReadmeContent += `### ${category.name}\n\n${category.description}\n\n`;
				newReadmeContent += `| Project | Description | Language | Stars | Last Updated | License |\n`;
				newReadmeContent += `|---------|-------------|----------|-------|--------------|--------|\n`;

				for (const project of categoryProjects) {
					const lastUpdated = project.lastUpdated
						? new Date(project.lastUpdated).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric'
							})
						: 'N/A';

					newReadmeContent += `| [${project.name}](${project.url}) | ${project.description} | ${project.mainLanguage || 'N/A'} | ${project.stars || 0} | ${lastUpdated} | ${project.license || 'N/A'} |\n`;
				}

				newReadmeContent += '\n';
			}
		}

		// Add footer
		newReadmeContent += `
## Contributing

Contributions are welcome! Please see our [contribution guidelines](CONTRIBUTING.md) for more information.

## License

This directory is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
`;

		// Write the new README
		await fs.writeFile(readmePath, newReadmeContent);
		console.log('README tables generated successfully!');
	} catch (error) {
		console.error('Error generating README tables:', error);
		process.exit(1);
	}
}

// Run the function
generateReadmeTables();
