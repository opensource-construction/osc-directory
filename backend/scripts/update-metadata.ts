import fs from 'fs/promises';
import path from 'path';
import { Octokit } from '@octokit/rest';
import { Project } from '@shared/types/index.ts';

// GitHub data interface
interface GitHubRepoData {
	name: string;
	description: string;
	stars: number;
	forks: number;
	lastUpdated: string;
	mainLanguage: string | null;
	license: string;
	tags: string[];
	openIssues?: number;
}

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN
});

async function getGitHubRepoData(url: string): Promise<GitHubRepoData | null> {
	try {
		// Extract owner and repo from GitHub URL
		const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
		if (!match) return null;

		const [, owner, repo] = match;
		const repoName = repo.replace(/\.git$/, '');

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
			license: repoData.license?.spdx_id || 'Unknown',
			tags: repoData.topics || [],
			openIssues: repoData.open_issues_count
		};
	} catch (error) {
		console.error(
			`Error fetching GitHub data for ${url}:`,
			error instanceof Error ? error.message : String(error)
		);
		return {
			name: url.split('/').pop() || 'Unknown',
			description: 'No description provided',
			stars: 0,
			forks: 0,
			lastUpdated: new Date().toISOString(),
			mainLanguage: null,
			license: 'Unknown',
			tags: [],
			openIssues: 0
		};
	}
}

async function updateProjectMetadata(): Promise<void> {
	const filePath = path.join(process.cwd(), 'data', 'projects.json');

	try {
		const rawData = await fs.readFile(filePath, 'utf8');
		const projects: Project[] = JSON.parse(rawData);

		console.log(`Updating metadata for ${projects.length} projects...`);

		const updatedProjects = await Promise.all(
			projects.map(async (project) => {
				// Initialize tags array if it doesn't exist
				if (!project.tags) {
					project.tags = [];
				}

				if (project.url && project.url.includes('github.com')) {
					const githubData = await getGitHubRepoData(project.url);
					if (githubData) {
						// PRESERVE existing tags BEFORE merging
						const originalTags = project.tags || [];

						const updatedProject = { ...project, ...githubData };

						// Restore and combine tags properly
						const githubTags = githubData.tags || [];
						const allTags = [...originalTags, ...githubTags];
						updatedProject.tags = [...new Set(allTags)];

						// Preserve custom name
						if (project.name && project.name !== project.url.split('/').pop()) {
							updatedProject.name = project.name;
						}

						// Preserve custom description
						if (
							project.description &&
							project.description !== 'No description provided' &&
							project.description.length > (githubData.description?.length || 0)
						) {
							updatedProject.description = project.description;
						}

						return updatedProject;
					}
				} else if (project.repository && project.repository.includes('github.com')) {
					const githubData = await getGitHubRepoData(project.repository);

					if (githubData) {
						// PRESERVE existing tags BEFORE merging
						const originalTags = project.tags || [];

						const updatedProject = {
							...project,
							...githubData,
							url: project.url || project.repository
						};

						// Restore and combine tags properly
						const githubTags = githubData.tags || [];
						const allTags = [...originalTags, ...githubTags];
						updatedProject.tags = [...new Set(allTags)];

						// Preserve manually entered values if they exist
						if (project.name && project.name !== project.repository.split('/').pop()) {
							updatedProject.name = project.name;
						}

						if (
							project.description &&
							project.description !== 'No description provided' &&
							project.description.length > (githubData.description?.length || 0)
						) {
							updatedProject.description = project.description;
						}

						return updatedProject;
					}
				}

				// For projects without GitHub URLs, still deduplicate existing tags
				if (project.tags) {
					project.tags = [...new Set(project.tags)];
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
