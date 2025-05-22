<script lang="ts">
	import { Octokit } from '@octokit/rest';

	const octokit = new Octokit({});

	async function getGitHubRepoData(url: string): Promise<GitHubRepoData | null> {
		try {
			// Extract owner and repo from GitHub URL
			const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
			if (!match) return null;

			const [, owner, repo] = match;
			const repoName = repo.replace(/\.git$/, '');

			const { data: repoData } = await Octokit.repos.get({
				owner,
				repo: repoName
			});

			console.log(repoData);

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
				license: 'Unknown'
			};
		}
	}
</script>
