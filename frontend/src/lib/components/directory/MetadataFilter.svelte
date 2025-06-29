<script lang="ts">
	import type { FilterOption } from '$lib/types/types';
	import Icon from '@iconify/svelte';

	interface Props {
		metadataOptions: Record<string, FilterOption>;
		selectedMetadataFilters: Record<string, string[]>;
		updateMetadataFilter: (key: string, values: string[]) => void;
	}

	let { metadataOptions, selectedMetadataFilters, updateMetadataFilter }: Props = $props();

	let isExpanded = $state(false);
	let expandedSection = $state<string | null>(null);

	function toggleMetadataValue(key: string, value: string) {
		const currentValues = selectedMetadataFilters[key] || [];
		const newValues = currentValues.includes(value)
			? currentValues.filter((v) => v !== value)
			: [...currentValues, value];

		updateMetadataFilter(key, newValues);
	}

	function formatKey(key: string): string {
		return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
	}

	function clearFilterGroup(key: string) {
		updateMetadataFilter(key, []);
	}

	const hasActiveFilters = $derived(
		Object.values(selectedMetadataFilters).some((values) => values.length > 0)
	);

	const totalActiveFilters = $derived(
		Object.values(selectedMetadataFilters).reduce((sum, values) => sum + values.length, 0)
	);

	function getSelectedCount(key: string): number {
		return selectedMetadataFilters[key]?.length || 0;
	}

	function getFilterIcon(key: string): string {
		const option = metadataOptions[key];
		return option?.icon || '📋';
	}

	function toggleExpanded() {
		isExpanded = !isExpanded;
		if (!isExpanded) {
			expandedSection = null;
		}
	}

	function clearAllFilters() {
		Object.keys(selectedMetadataFilters).forEach((key) => clearFilterGroup(key));
	}

	function toggleSection(key: string) {
		expandedSection = expandedSection === key ? null : key;
	}
</script>

<div class="bg-white rounded-lg shadow-sm border p-4">
	<div class="flex items-center justify-between mb-2">
		<label class="block text-sm font-medium text-gray-700">
			<Icon icon="mdi:filter-variant" class="inline w-4 h-4 mr-1" />
			Filters
		</label>
		{#if totalActiveFilters > 0}
			<div class="flex items-center gap-2">
				<span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
					{totalActiveFilters} active
				</span>
				<button onclick={clearAllFilters} class="text-xs text-red-600 hover:text-red-800 underline">
					Clear all
				</button>
			</div>
		{/if}
	</div>

	{#if !isExpanded}
		<div class="space-y-3">
			{#if hasActiveFilters}
				<div class="flex flex-wrap gap-2">
					{#each Object.entries(selectedMetadataFilters) as [key, values]}
						{#if values.length > 0}
							{#each values as value}
								<span
									class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
								>
									<Icon icon={getFilterIcon(key)} class="w-3 h-3" />
									{value}
									<button
										aria-label="Remove filter"
										onclick={() => toggleMetadataValue(key, value)}
										class="hover:bg-blue-200 rounded-full p-0.5 ml-1"
										title="Remove filter"
									>
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											></path>
										</svg>
									</button>
								</span>
							{/each}
						{/if}
					{/each}
				</div>
			{/if}

			<!-- Quick filter categories -->
			<div class="flex flex-wrap gap-2">
				{#each Object.entries(metadataOptions) as [key, option]}
					<button
						onclick={() => toggleSection(key)}
						class="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors {getSelectedCount(
							key
						) > 0
							? 'bg-blue-50 border-blue-300 text-blue-700'
							: 'text-gray-700'}"
					>
						<Icon icon={getFilterIcon(key)} class="w-4 h-4" />
						{option.label}
						{#if getSelectedCount(key) > 0}
							<span class="ml-1 px-1.5 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full">
								{getSelectedCount(key)}
							</span>
						{/if}
						<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</button>
				{/each}

				{#if Object.keys(metadataOptions).length > 0}
					<button
						onclick={toggleExpanded}
						class="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:text-primary-400 underline cursor-pointer"
					>
						Show all filters
					</button>
				{/if}
			</div>

			<!-- Individual section dropdown -->
			{#if expandedSection && metadataOptions[expandedSection]}
				<div class="mt-2 p-3 bg-gray-50 rounded-md border">
					<div class="flex items-center justify-between mb-2">
						<span class="text-sm font-medium text-gray-700">
							<Icon icon={getFilterIcon(expandedSection)} class="inline w-4 h-4 mr-1" />
							{metadataOptions[expandedSection].label}
						</span>
						<button
							aria-label="Close section"
							onclick={() => (expandedSection = null)}
							class="text-gray-400 hover:text-gray-600"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</button>
					</div>
					<div
						class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto"
					>
						{#each metadataOptions[expandedSection].values as value}
							{@const isSelected =
								selectedMetadataFilters[expandedSection]?.includes(value) || false}
							<label
								class="flex items-center space-x-2 text-sm cursor-pointer hover:bg-white p-2 rounded transition-colors"
							>
								<input
									type="checkbox"
									checked={isSelected}
									onchange={() => toggleMetadataValue(expandedSection!, value)}
									class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<span class="text-gray-700 truncate" title={value}>
									{value}
								</span>
							</label>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Expanded State: Show all filters -->
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-600">All Filter Options</span>
				<button
					onclick={toggleExpanded}
					class="text-sm text-blue-600 hover:text-blue-800 underline"
				>
					Show less
				</button>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{#each Object.entries(metadataOptions) as [key, option]}
					<div class="border border-gray-200 rounded-lg">
						<div class="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
							<div class="flex items-center space-x-2">
								<Icon icon={getFilterIcon(key)} class="w-4 h-4 text-gray-600" />
								<span class="font-medium text-sm text-gray-900">
									{option.label}
								</span>
								{#if getSelectedCount(key) > 0}
									<span
										class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
									>
										{getSelectedCount(key)}
									</span>
								{/if}
							</div>
							{#if getSelectedCount(key) > 0}
								<button
									onclick={() => clearFilterGroup(key)}
									class="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
								>
									Clear
								</button>
							{/if}
						</div>
						<div class="p-3 max-h-40 overflow-y-auto">
							<div class="space-y-2">
								{#each option.values as value}
									{@const isSelected = selectedMetadataFilters[key]?.includes(value) || false}
									<label
										class="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
									>
										<input
											type="checkbox"
											checked={isSelected}
											onchange={() => toggleMetadataValue(key, value)}
											class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
										/>
										<span class="text-gray-700 truncate" title={value}>
											{value}
										</span>
									</label>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if Object.keys(metadataOptions).length === 0}
		<div class="text-center py-8 text-gray-500">
			<Icon icon="mdi:filter-off" class="mx-auto h-8 w-8 text-gray-400 mb-2" />
			<p class="text-sm">No filter options available</p>
		</div>
	{/if}
</div>
