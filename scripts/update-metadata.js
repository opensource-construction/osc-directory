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
        if (project.url.includes('github.com')) {
          const githubData = await getGitHubRepoData(project.url);
          if (githubData) {
            return { ...project, ...githubData };
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
