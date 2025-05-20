<script lang="ts">
	import { onMount } from 'svelte';

	// Define types for our data
	interface Project {
		name: string;
		description: string;
		url: string;
		repository: string;
		category: string;
		stars?: number;
		forks?: number;
		mainLanguage?: string;
		license?: string;
		lastUpdated?: string;
		metadata?: Array<{
			key: string;
			value: string;
			url?: string;
		}>;
	}

	let projects: Project[] = [];
	let categories: string[] = [];
	let selectedCategory = 'all';
	let isLoading = true;

	onMount(async () => {
		try {
			// Fetch projects from the raw GitHub content (adjust URL to your repository)
			const projectsResponse = await fetch('/data/projects.json');
			projects = await projectsResponse.json();

			// Fetch categories from schema.js
			const { categories: loadedCategories } = await import('../../data/schema.js');
			categories = loadedCategories;

			isLoading = false;
		} catch (error) {
			console.error('Error loading data:', error);
			isLoading = false;
		}
	});

	$: filteredProjects =
		selectedCategory === 'all'
			? projects
			: projects.filter(
					(project) => project.category.toLowerCase() === selectedCategory.toLowerCase()
				);
</script>

<svelte:head>
	<title>AEC Open Source Directory</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">AEC Open Source Directory</h1>

	<p class="mb-6">
		A curated collection of open source projects for the Architecture, Engineering, and Construction
		(AEC) industry.
	</p>

	{#if isLoading}
		<div class="flex justify-center my-12">
			<p>Loading projects...</p>
		</div>
	{:else}
		<div class="mb-6">
			<label for="category-filter" class="block text-sm font-medium mb-2">
				Filter by Category:
			</label>
			<select
				id="category-filter"
				bind:value={selectedCategory}
				class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			>
				<option value="all">All Categories</option>
				{#each categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredProjects as project}
				<div class="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
					<div class="p-4">
						<h2 class="text-xl font-semibold mb-2">
							<a
								href={project.url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-600 hover:underline"
							>
								{project.name}
							</a>
						</h2>

						<p class="text-gray-700 mb-4">{project.description}</p>

						<div class="flex flex-wrap gap-2 mb-4">
							<span
								class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
							>
								{project.category}
							</span>
						</div>

						<div class="flex items-center text-sm text-gray-500 space-x-4">
							{#if project.mainLanguage}
								<div class="flex items-center">
									<span class="mr-1">Language:</span>
									<span class="font-medium">{project.mainLanguage}</span>
								</div>
							{/if}

							{#if project.stars !== undefined}
								<div class="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 mr-1"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
										/>
									</svg>
									<span>{project.stars}</span>
								</div>
							{/if}

							{#if project.lastUpdated}
								<div>
									Updated: {new Date(project.lastUpdated).toLocaleDateString()}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if filteredProjects.length === 0}
			<div class="text-center py-12">
				<p class="text-lg text-gray-600">No projects found in this category.</p>
			</div>
		{/if}
	{/if}
</div>
