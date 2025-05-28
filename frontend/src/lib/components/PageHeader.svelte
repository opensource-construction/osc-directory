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

<header
	class="bg-gradient-to-r from-primary-200 to-primary-400 text-black py-12 mb-8 rounded-lg shadow-lg"
>
	<div class="max-w-4xl mx-auto px-6 text-center">
		<h1 class="text-4xl md:text-5xl font-bold mb-4">AEC Open Source Directory</h1>

		<div class="text-lg md:text-xl font-light opacity-90">
			{#if isLoading}
				<span class="animate-pulse">Loading description...</span>
			{:else}
				{repoDescription}
			{/if}
		</div>

		<div class="mt-6 flex justify-center items-center gap-4 text-sm opacity-80">
			<span class="flex items-center gap-1">
				<Icon icon="lets-icons:check-fill"></Icon>
				Curated Projects
			</span>
			<span class="text-black">•</span>
			<span class="flex items-center gap-1">
				<Icon icon="raphael:opensource"></Icon>
				Open Source
			</span>
			<span class="text-black">•</span>
			<span class="flex items-center gap-1">
				<Icon icon="ri:building-fill"></Icon>
				AEC Industry
			</span>
		</div>
	</div>
</header>
