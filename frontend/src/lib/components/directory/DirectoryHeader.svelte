<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	let repoDescription = $state(
		'A curated collection of open source projects for the Architecture, Engineering, and Construction (AEC) industry.'
	);
	let isLoading = $state(false);

	async function fetchRepoDescription() {
		try {
			isLoading = true;
			const response = await fetch(
				'https://api.github.com/repos/opensource-construction/osc-directory'
			);

			if (response.ok) {
				const repo = await response.json();
				if (repo.description) {
					repoDescription = repo.description;
				}
			}
		} catch (error) {
			console.warn('Failed to fetch repository description:', error);
			// Keep fallback description
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchRepoDescription();
	});
</script>

<header class="bg-white border-b border-gray-100 py-6 md:py-8 mb-6">
	<div class="max-w-4xl mx-auto px-4 md:px-6 text-center">
		<h1 class="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 leading-tight">
			AEC Open Source Directory
		</h1>

		<div class="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4">
			{#if isLoading}
				<span class="animate-pulse text-gray-400">Loading description...</span>
			{:else}
				{repoDescription}
			{/if}
		</div>

		<div
			class="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500"
		>
			<span class="flex items-center gap-1.5">
				<Icon icon="lets-icons:check-fill" class="w-4 h-4 text-green-500"></Icon>
				Curated Projects
			</span>
			<span class="flex items-center gap-1.5">
				<Icon icon="raphael:opensource" class="w-4 h-4 text-blue-500"></Icon>
				Open Source
			</span>
			<span class="flex items-center gap-1.5">
				<Icon icon="ri:building-fill" class="w-4 h-4 text-orange-500"></Icon>
				AEC Industry
			</span>
		</div>
	</div>
</header>
