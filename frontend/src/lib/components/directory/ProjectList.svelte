<script lang="ts">
	import type { Project } from '$shared/types/index';
	import ProjectCard from './ProjectCard.svelte';

	let { projects }: { projects: Project[] } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	{#each projects as project (project.url)}
		<ProjectCard {project} />
	{/each}
</div>

{#if projects.length === 0}
	<div class="text-center py-12">
		<p class="text-lg text-gray-600">No projects found in this category.</p>
	</div>
{/if}
