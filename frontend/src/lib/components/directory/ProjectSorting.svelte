<script lang="ts">
	import type { Project } from '$shared/types';
	import Icon from '@iconify/svelte';

	type SortableField = 'name' | 'stars' | 'updated';

	let {
		projects,
		onSortChange
	}: {
		projects: Project[];
		onSortChange: (sortedProjects: Project[]) => void;
	} = $props();

	let sortBy: SortableField = $state('name');
	let sortOrder: 'asc' | 'desc' = $state('asc');

	function sortProjects(a: Project, b: Project): number {
		let result = 0;

		switch (sortBy) {
			case 'name':
				result = a.name.localeCompare(b.name);
				break;
			case 'stars':
				result = (a.stars || 0) - (b.stars || 0);
				break;
			case 'updated':
				if (!a.lastUpdated && !b.lastUpdated) result = 0;
				else if (!a.lastUpdated) result = 1;
				else if (!b.lastUpdated) result = -1;
				else result = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
				break;
			default:
				result = 0;
		}

		return sortOrder === 'desc' ? -result : result;
	}

	function applySorting() {
		const sorted = [...projects].sort(sortProjects);
		onSortChange(sorted);
	}

	function handleSortChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		sortBy = target.value as typeof sortBy;
		applySorting();
	}

	function toggleSortOrder() {
		sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		applySorting();
	}

	$effect(() => {
		applySorting();
	});

	$effect(() => {
		projects;
		applySorting();
	});
</script>

<div class="flex items-center gap-4 mb-4">
	<label for="sort-select" class="text-sm font-medium text-gray-700">Sort by:</label>
	<select
		id="sort-select"
		onchange={handleSortChange}
		class="border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
		value={sortBy}
	>
		<option value="name">Name</option>
		<option value="stars">Stars</option>
		<option value="updated">Last Updated</option>
	</select>

	<button
		onclick={toggleSortOrder}
		class="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
		title={sortOrder === 'asc' ? 'Switch to descending' : 'Switch to ascending'}
	>
		<Icon
			icon={sortOrder === 'asc' ? 'mdi:sort-ascending' : 'mdi:sort-descending'}
			class="w-4 h-4"
		/>
		<span class="text-sm">{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
	</button>
</div>
