<script lang="ts">
	import type { Project } from '$shared/types';
	import Icon from '@iconify/svelte';

	type SortableField = 'name' | 'stars' | 'updated';
	type GroupByField = 'none' | 'username' | 'language';
	type GroupedProjects = {
		groupName: string;
		projects: Project[];
	}[];

	let {
		projects,
		onSortChange
	}: {
		projects: Project[];
		onSortChange: (sortedProjects: Project[], groupedProjects: GroupedProjects) => void;
	} = $props();

	let sortBy: SortableField = $state('name');
	let sortOrder: 'asc' | 'desc' = $state('asc');
	let groupBy: GroupByField = $state('none');

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

	function groupProjects(projects: Project[]): {
		flatProjects: Project[];
		groupedProjects: GroupedProjects;
	} {
		if (groupBy === 'none') {
			return { flatProjects: projects, groupedProjects: [] };
		}

		const groups = new Map<string, Project[]>();

		projects.forEach((project) => {
			let groupKey: string;

			switch (groupBy) {
				case 'username':
					// Extract username from GitHub URL
					if (project.url) {
						const match = project.url.match(/github\.com\/([^\/]+)/);
						groupKey = match ? match[1] : 'Unknown User';
					} else {
						groupKey = 'Unknown User';
					}
					break;
				case 'language':
					groupKey = project.mainLanguage || 'Unknown Language';
					break;
				default:
					groupKey = 'Ungrouped';
			}

			if (!groups.has(groupKey)) {
				groups.set(groupKey, []);
			}
			groups.get(groupKey)!.push(project);
		});

		// Sort groups by key
		const sortedGroups = Array.from(groups.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([groupName, groupProjects]) => ({
				groupName,
				projects: groupProjects.sort(sortProjects)
			}));

		const flatProjects = sortedGroups.flatMap((group) => group.projects);

		return { flatProjects, groupedProjects: sortedGroups };
	}

	function applySorting() {
		const sorted = [...projects].sort(sortProjects);
		const { flatProjects, groupedProjects } = groupProjects(sorted);
		onSortChange(flatProjects, groupedProjects);
	}

	function handleSortChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		sortBy = target.value as typeof sortBy;
		applySorting();
	}

	function handleGroupChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		groupBy = target.value as typeof groupBy;
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

<div class="flex items-center gap-4 mb-4 flex-wrap">
	<div class="flex items-center gap-2">
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

	<div class="flex items-center gap-2">
		<label for="group-select" class="text-sm font-medium text-gray-700">Group by:</label>
		<select
			id="group-select"
			onchange={handleGroupChange}
			class="border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
			value={groupBy}
		>
			<option value="none">None</option>
			<option value="username">GitHub Username</option>
			<option value="language">Programming Language</option>
		</select>
	</div>
</div>
