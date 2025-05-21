<script lang="ts">
	import type { Project } from '$lib/types/types.js';
	import { onMount } from 'svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import CategoryFilter from '$lib/components/CategoryFilter.svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';

	// Define types for our data
	let projects: Project[] = $state([]);
	let categories: string[] = $state([]);
	let selectedCategory = $state('all');
	let isLoading = $state(true);

	onMount(async () => {
		try {
			// Fetch projects from the raw GitHub content (adjust URL to your repository)
			const projectsResponse = await fetch(
				'https://raw.githubusercontent.com/TheVessen/osc-directory/main/src/lib/data/projects.json'
			);

			projects = await projectsResponse.json();

			// Fetch categories from schema.js
			const { categories: loadedCategories } = await import('$lib/data/schema.js');
			categories = loadedCategories;

			isLoading = false;
		} catch (error) {
			console.error('Error loading data:', error);
			isLoading = false;
		}
	});

	let filteredProjects = $derived.by(() =>
		selectedCategory === 'all'
			? projects
			: projects.filter(
					(project) => project.category.toLowerCase() === selectedCategory.toLowerCase()
				)
	);
</script>

<svelte:head>
	<title>AEC Open Source Directory</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<PageHeader />

	{#if isLoading}
		<LoadingIndicator />
	{:else}
		<CategoryFilter {categories} bind:selectedCategory />
		<ProjectList projects={filteredProjects} />
	{/if}
</div>
