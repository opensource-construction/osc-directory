import fs from 'fs/promises';
import path from 'path';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN
});

async function getGitHubRepoData(url) {
	try {
		// Extract owner and repo from GitHub URL
		const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
		if (!match) return null;

		const [, owner, repo] = match;
		const repoName = repo.replace(/\.git$/, ''); // Remove .git extension if present

		// Get repository information
		const { data: repoData } = await octokit.repos.get({
			owner,
			repo: repoName
		});

		return {
			name: repoData.name,
			description: repoData.description || 'No description provided',
			stars: repoData.stargazers_count,
			forks: repoData.forks_count,
			lastUpdated: repoData.updated_at,
			mainLanguage: repoData.language,
			license: repoData.license?.spdx_id || 'Unknown'
		};
	} catch (error) {
		console.error(`Error fetching GitHub data for ${url}:`, error.message);
		return {
			stars: 0,
			forks: 0,
			lastUpdated: new Date().toISOString(),
			mainLanguage: 'Unknown',
			license: 'Unknown'
		};
	}
}

async function updateProjectMetadata() {
	const filePath = path.join(process.cwd(), 'data', 'projects.json');

	try {
		const rawData = await fs.readFile(filePath, 'utf8');
		const projects = JSON.parse(rawData);

		console.log(`Updating metadata for ${projects.length} projects...`);

		const updatedProjects = await Promise.all(
			projects.map(async (project) => {
				// Convert any array categories to string (single category)
				if (project.category && Array.isArray(project.category)) {
					// Take the first category if it's an array
					project.category = project.category[0];
				}

				// Initialize metadata array if it doesn't exist
				if (!project.metadata) {
					project.metadata = [];
				}

				if (project.url && project.url.includes('github.com')) {
					const githubData = await getGitHubRepoData(project.url);
					if (githubData) {
						// Only overwrite name and description if not provided manually
						const updatedProject = { ...project, ...githubData };

						// Preserve manually entered values if they exist
						if (project.name && project.name !== project.url.split('/').pop()) {
							updatedProject.name = project.name;
						}

						if (
							project.description &&
							project.description !== 'No description provided' &&
							project.description.length > githubData.description?.length
						) {
							updatedProject.description = project.description;
						}

						return updatedProject;
					}
				} else if (project.repository && project.repository.includes('github.com')) {
					// Try to use repository field if URL is not provided or not GitHub
					const githubData = await getGitHubRepoData(project.repository);
					if (githubData) {
						const updatedProject = {
							...project,
							...githubData,
							url: project.url || project.repository
						};

						// Preserve manually entered values if they exist
						if (project.name && project.name !== project.repository.split('/').pop()) {
							updatedProject.name = project.name;
						}

						if (
							project.description &&
							project.description !== 'No description provided' &&
							project.description.length > githubData.description?.length
						) {
							updatedProject.description = project.description;
						}

						return updatedProject;
					}
				}
				return project;
			})
		);

		await fs.writeFile(filePath, JSON.stringify(updatedProjects, null, 2));
		console.log('Project metadata updated successfully!');
	} catch (error) {
		console.error('Error updating project metadata:', error);
		process.exit(1);
	}
}

// Run the update function
updateProjectMetadata();
