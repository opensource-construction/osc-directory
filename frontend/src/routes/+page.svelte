<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import LoadingIndicator from '$lib/components/LoadingIndicator.svelte';
	import CategoryFilter from '$lib/components/CategoryFilter.svelte';
	import MetadataFilter from '$lib/components/MetadataFilter.svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';
	import { type Project } from '$shared/types';

	let { data } = $props();

	// Define types for our data
	let projects: Project[] = $state(data.projects);
	let categories: readonly string[] = $state(data.categories);
	let selectedCategory = $state('all');
	let selectedMetadataFilters = $state<Record<string, string[]>>({});
	let isLoading = $state(false);

	// Extract all unique metadata keys and values
	let metadataOptions = $derived.by(() => {
		const options: Record<string, Set<string>> = {};

		projects.forEach((project) => {
			if (project.metadata) {
				// Handle the case where metadata might be an object with key-value pairs
				// or a simple array of strings
				if (Array.isArray(project.metadata)) {
					// If metadata is a simple array of strings, treat it as a 'tags' field
					if (!options['tags']) options['tags'] = new Set();
					project.metadata.forEach((value) => {
						if (typeof value === 'string') {
							options['tags'].add(value);
						}
					});
				} else if (typeof project.metadata === 'object') {
					// If metadata is an object with key-value pairs
					Object.entries(project.metadata).forEach(([key, values]) => {
						if (!options[key]) options[key] = new Set();
						if (Array.isArray(values)) {
							values.forEach((value) => options[key].add(String(value)));
						} else {
							options[key].add(String(values));
						}
					});
				}
			}
		});

		// Convert Sets to Arrays
		return Object.fromEntries(
			Object.entries(options).map(([key, valueSet]) => [key, Array.from(valueSet)])
		);
	});

	let filteredProjects = $derived.by(() => {
		let filtered = projects;

		// Filter by category
		if (selectedCategory !== 'all') {
			filtered = filtered.filter(
				(project) => project.category.toLowerCase() === selectedCategory.toLowerCase()
			);
		}

		// Filter by metadata
		Object.entries(selectedMetadataFilters).forEach(([metadataKey, selectedValues]) => {
			if (selectedValues.length > 0) {
				filtered = filtered.filter((project) => {
					if (!project.metadata) return false;

					if (Array.isArray(project.metadata)) {
						// Handle simple array metadata (treat as 'tags')
						if (metadataKey === 'tags') {
							return project.metadata.some((value) => selectedValues.includes(String(value)));
						}
						return false;
					} else if (typeof project.metadata === 'object') {
						// Handle object metadata
						const projectValues = project.metadata[metadataKey];
						if (!projectValues) return false;

						if (Array.isArray(projectValues)) {
							return projectValues.some((value) => selectedValues.includes(String(value)));
						} else {
							return selectedValues.includes(String(projectValues));
						}
					}

					return false;
				});
			}
		});

		return filtered;
	});

	function updateMetadataFilter(key: string, values: string[]) {
		selectedMetadataFilters = { ...selectedMetadataFilters, [key]: values };
	}

	function clearAllFilters() {
		selectedCategory = 'all';
		selectedMetadataFilters = {};
	}
</script>

<svelte:head>
	<title>AEC Open Source Directory</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<PageHeader />

	{#if isLoading}
		<LoadingIndicator />
	{:else}
		<div class="mb-6 space-y-4">
			<CategoryFilter {categories} bind:selectedCategory />
			<MetadataFilter {metadataOptions} {selectedMetadataFilters} {updateMetadataFilter} />

			{#if selectedCategory !== 'all' || Object.values(selectedMetadataFilters).some((v) => v.length > 0)}
				<div class="flex items-center gap-2">
					<span class="text-sm text-gray-600">
						Showing {filteredProjects.length} of {projects.length} projects
					</span>
					<button
						onclick={clearAllFilters}
						class="text-sm text-blue-600 hover:text-blue-800 underline"
					>
						Clear all filters
					</button>
				</div>
			{/if}
		</div>

		<ProjectList projects={filteredProjects} />
	{/if}
</div>
