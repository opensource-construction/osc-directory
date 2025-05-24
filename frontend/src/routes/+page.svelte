<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import CategoryFilter from '$lib/components/CategoryFilter.svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';
	import { type Project } from '$shared/types';

	let { data } = $props();

	// Define types for our data
	let projects: Project[] = $state(data.projects);
	let categories: readonly string[] = $state(data.categories);
	let selectedCategory = $state('all');
	let isLoading = $state(false);

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
