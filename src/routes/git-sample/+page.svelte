<script lang="ts">
	import { Octokit } from '@octokit/rest';
	import { onMount } from 'svelte';

	const octokit = new Octokit({});
	let repoData: any = null;
	let error: string | null = null;

	async function getGitHubRepoData(url: string) {
		try {
			// Extract owner and repo from GitHub URL
			const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
			if (!match) {
				error = 'Invalid GitHub URL format';
				return null;
			}

			const [, owner, repo] = match;
			const repoName = repo.replace(/\.git$/, '');

			// Use the octokit instance, not the class
			const response = await octokit.repos.get({
				owner,
				repo: repoName
			});

			repoData = response.data;
			console.log('Repository data:', repoData);
			return response.data;
		} catch (err) {
			error = `Error fetching repository data: ${err instanceof Error ? err.message : String(err)}`;
			console.error(error);
			return null;
		}
	}

	onMount(async () => {
		await getGitHubRepoData('https://github.com/Open-Cascade-SAS/OCCT');
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">GitHub Repository Sample</h1>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}

	{#if repoData}
		<div class="bg-white shadow rounded p-4">
			<h2 class="text-xl font-semibold">{repoData.name}</h2>
			<p class="text-gray-700 mt-2">{repoData.description}</p>

			<div class="mt-4 flex space-x-4">
				<div>⭐ Stars: {repoData.stargazers_count}</div>
				<div>🍴 Forks: {repoData.forks_count}</div>
				<div>👁️ Watchers: {repoData.watchers_count}</div>
			</div>

			<div class="mt-2">
				Language: {repoData.language || 'Not specified'}
			</div>

			<div class="mt-2">
				License: {repoData.license ? repoData.license.name : 'Not specified'}
			</div>

			<div class="mt-4">
				<a
					href={repoData.html_url}
					class="text-blue-500 hover:underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					View on GitHub
				</a>
			</div>
		</div>
	{:else if !error}
		<div class="text-center py-8">
			<p>Loading repository data...</p>
		</div>
	{/if}
</div>
