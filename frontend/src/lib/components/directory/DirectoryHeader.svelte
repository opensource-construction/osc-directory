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

		<div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left text-sm text-gray-700">
			<h2 class="text-lg font-semibold text-gray-900 mb-3">Rules for Publishing Projects</h2>
			<ul class="space-y-2">
				<li class="flex items-start gap-2">
					<Icon icon="mdi:check-circle" class="w-5 h-5 text-green-500" />
					Code published with an open source license
				</li>
				<li class="flex items-start gap-2">
					<Icon icon="mdi:check-circle" class="w-5 h-5 text-green-500" />
					Project is relevant to Architecture, Engineering, Construction or Operation
				</li>
				<li class="flex items-start gap-2">
					<Icon icon="mdi:check-circle" class="w-5 h-5 text-green-500" />
					Project has a public GitHub repository
				</li>
				<li class="flex items-start gap-2">
					<Icon icon="mdi:check-circle" class="w-5 h-5 text-green-500" />
					Repo includes a meaningful description
				</li>
			</ul>
		</div>
	</div>
</header>
