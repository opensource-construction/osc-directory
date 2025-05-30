<script lang="ts">
	import PageHeader from '$lib/components/directory/DirectoryHeader.svelte';
	import MetadataFilter from '$lib/components/directory/MetadataFilter.svelte';
	import ProjectList from '$lib/components/directory/ProjectList.svelte';
	import ProjectSorting from '$lib/components/directory/ProjectSorting.svelte';
	import { type Project } from '$shared/types';

	let { data } = $props();

	let projects: Project[] = $state(data.projects);
	let selectedMetadataFilters = $state<Record<string, string[]>>({});
	let isLoading = $state(false);

	// Configure metadata filters
	// Each filter has a key, label, icon, and a function to extract values from the project
	// Icons are used from https://icon-sets.iconify.design/?query=building
	const filterConfig = [
		{
			key: 'tags',
			label: 'Tags',
			icon: 'mdi:tag',
			getValue: (project: Project) =>
				project.metadata && Array.isArray(project.metadata) ? project.metadata : null
		},
		{
			key: 'mainLanguage',
			label: 'Programming Language',
			icon: 'material-symbols-light:laptop-chromebook-rounded',
			getValue: (project: Project) => (project.mainLanguage ? [project.mainLanguage] : null)
		},
		{
			key: 'license',
			label: 'License',
			icon: 'material-symbols:license',
			getValue: (project: Project) => (project.license ? [project.license] : null)
		}
	];

	let tagOptions = $derived.by(() => {
		const options: Record<string, Set<string>> = {};

		// Process configured filters
		filterConfig.forEach(({ key, getValue }) => {
			options[key] = new Set();

			projects.forEach((project) => {
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
		let filtered = projects;

		// Filter by metadata
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
			<ProjectSorting bind:projects />
			<MetadataFilter
				metadataOptions={enrichedMetadataOptions}
				{selectedMetadataFilters}
				{updateMetadataFilter}
			/>

			{#if Object.values(selectedMetadataFilters).some((v) => v.length > 0)}
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
