<script lang="ts">
	import PageHeader from '$lib/components/directory/DirectoryHeader.svelte';
	import MetadataFilter from '$lib/components/directory/MetadataFilter.svelte';
	import ProjectList from '$lib/components/directory/ProjectList.svelte';
	import ProjectSorting from '$lib/components/directory/ProjectSorting.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import { filterConfig, fuseOptions } from '$lib/search.js';
	import type { Project } from '$shared/types/index.js';
	import Fuse from 'fuse.js';

	let { data } = $props();
	let projects: Project[] = $state(data.projects);
	let selectedMetadataFilters = $state<Record<string, string[]>>({});
	let isLoading = $state(false);
	let sortedProjects = $state<Project[]>([]);
	let searchQuery = $state('');

	let fuse = $derived(new Fuse(projects, fuseOptions));

	function performSearch(projects: Project[], query: string): Project[] {
		if (!query.trim()) return projects;

		const searchResults = fuse.search(query);
		return searchResults.map((result) => result.item);
	}

	let searchFilteredProjects = $derived.by(() => {
		let filtered = projects;

		if (searchQuery.trim()) {
			filtered = performSearch(filtered, searchQuery);
		}

		return filtered;
	});

	let tagOptions = $derived.by(() => {
		const options: Record<string, Set<string>> = {};

		filterConfig.forEach(({ key, getValue }) => {
			options[key] = new Set();

			searchFilteredProjects.forEach((project) => {
				const values = getValue(project);
				if (values) {
					values.forEach((value) => {
						if (value && typeof value === 'string') {
							options[key].add(value);
						}
					});
				}
			});
		});

		return Object.fromEntries(
			Object.entries(options)
				.filter(([_, valueSet]) => valueSet.size > 0)
				.map(([key, valueSet]) => [key, Array.from(valueSet).sort()])
		);
	});

	let filteredProjects = $derived.by(() => {
		let filtered = searchFilteredProjects; // Start with search results

		Object.entries(selectedMetadataFilters).forEach(([metadataKey, selectedValues]) => {
			if (selectedValues.length > 0) {
				filtered = filtered.filter((project) => {
					const filterDef = filterConfig.find((f) => f.key === metadataKey);
					if (filterDef) {
						const projectValues = filterDef.getValue(project);
						return (
							projectValues &&
							Array.isArray(projectValues) &&
							projectValues.some((value) => selectedValues.includes(String(value)))
						);
					}
					return false;
				});
			}
		});

		return filtered;
	});

	let enrichedMetadataOptions = $derived(
		Object.fromEntries(
			Object.entries(tagOptions).map(([key, values]) => {
				const config = filterConfig.find((f) => f.key === key);
				return [
					key,
					{
						values,
						label: config?.label || key,
						icon: config?.icon || '📋'
					}
				];
			})
		)
	);

	function updateMetadataFilter(key: string, values: string[]) {
		selectedMetadataFilters = { ...selectedMetadataFilters, [key]: values };
	}

	function clearAllFilters() {
		selectedMetadataFilters = {};
		searchQuery = '';
	}

	function handleSortChange(newSortedProjects: Project[]) {
		sortedProjects = newSortedProjects;
	}

	function handleSearchChange(query: string) {
		searchQuery = query;
		selectedMetadataFilters = {}; // Reset metadata filters on new search
	}
</script>

<svelte:head>
	<title>AEC Open Source Directory</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<PageHeader />

	{#if isLoading}
		<p>...Loading</p>
	{:else}
		<div class="mb-6 space-y-4">
			<SearchBar
				bind:searchQuery
				onSearchChange={handleSearchChange}
				onClearSearch={() => (searchQuery = '')}
				resultCount={filteredProjects.length}
				totalCount={projects.length}
				showTips={true}
			/>

			<MetadataFilter
				metadataOptions={enrichedMetadataOptions}
				{selectedMetadataFilters}
				{updateMetadataFilter}
			/>
			
			<ProjectSorting projects={filteredProjects} onSortChange={handleSortChange} />

			{#if Object.values(selectedMetadataFilters).some((v) => v.length > 0) || searchQuery.trim()}
				<div class="flex items-center gap-2">
					<span class="text-sm text-gray-600">
						Showing {filteredProjects.length} of {projects.length} projects
						{#if searchQuery.trim()}
							(filtered from {searchFilteredProjects.length} search results)
						{/if}
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

		<ProjectList projects={sortedProjects} />
	{/if}
</div>
