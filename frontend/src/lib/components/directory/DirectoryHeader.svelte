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

<header class="bg-white border-b border-gray-100 py-4 md:py-6 mb-4">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
		<h1 class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 leading-tight">
			AEC Open Source Directory
		</h1>

		<div class="text-xs sm:text-sm md:text-base text-gray-600 max-w-xl mx-auto mb-4">
			{#if isLoading}
				<span class="animate-pulse text-gray-400">Loading description...</span>
			{:else}
				{repoDescription}
			{/if}
		</div>

		<div
			class="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 text-left text-xs sm:text-sm text-gray-700"
		>
			<h2 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
				Rules for Publishing Projects
			</h2>
			<ul class="space-y-2">
				<li class="flex items-start gap-2">
					<Icon
						icon="mdi:check-circle"
						class="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
					/>
					<span class="flex-1">Code published with an open source license</span>
				</li>
				<li class="flex items-start gap-2">
					<Icon
						icon="mdi:check-circle"
						class="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
					/>
					<span class="flex-1"
						>Project is relevant to Architecture, Engineering, Construction or Operation</span
					>
				</li>
				<li class="flex items-start gap-2">
					<Icon
						icon="mdi:check-circle"
						class="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
					/>
					<span class="flex-1">Project has a public GitHub repository</span>
				</li>
				<li class="flex items-start gap-2">
					<Icon
						icon="mdi:check-circle"
						class="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-green-500"
					/>
					<span class="flex-1">Repo includes a meaningful description</span>
				</li>
			</ul>
		</div>
	</div>
</header>
