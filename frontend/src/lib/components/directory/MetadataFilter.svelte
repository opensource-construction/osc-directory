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
	}
</script>

<!-- Desktop Layout -->
<div class="hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm">
	<div class="px-6 py-4 border-b border-gray-200">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-gray-900">Filters</h3>
			{#if hasActiveFilters}
				<button
					onclick={() =>
						Object.keys(selectedMetadataFilters).forEach((key) => clearFilterGroup(key))}
					class="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
				>
					Clear all
				</button>
			{/if}
		</div>
	</div>

	<div class="p-6">
		<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
			{#each Object.entries(metadataOptions) as [key, option]}
				<div class="bg-neutral-100 border border-gray-200 rounded-lg p-4">
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center space-x-2 min-w-0 flex-1">
							<Icon icon={getFilterIcon(key)} class="w-5 h-5 text-gray-600 flex-shrink-0" />
							<h4 class="font-semibold text-gray-900 text-sm truncate">
								{formatKey(key)}
							</h4>
							{#if getSelectedCount(key) > 0}
								<span
									class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-blue-800 flex-shrink-0"
								>
									{getSelectedCount(key)}
								</span>
							{/if}
						</div>
						{#if getSelectedCount(key) > 0}
							<button
								onclick={() => clearFilterGroup(key)}
								class="text-xs text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100 flex-shrink-0"
							>
								Clear
							</button>
						{/if}
					</div>

					<div
						class="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
					>
						{#each option.values as value}
							{@const isSelected = selectedMetadataFilters[key]?.includes(value) || false}
							<label
								class="flex items-center space-x-2 text-sm cursor-pointer group hover:bg-white p-2 rounded-md transition-all duration-200"
							>
								<input
									type="checkbox"
									checked={isSelected}
									onchange={() => toggleMetadataValue(key, value)}
									class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors flex-shrink-0"
								/>
								<span
									class="text-gray-700 group-hover:text-gray-900 transition-colors leading-5 min-w-0"
								>
									{value}
								</span>
							</label>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		{#if Object.keys(metadataOptions).length === 0}
			<div class="text-center py-12 text-gray-500">
				<Icon icon="mdi:filter-off" class="mx-auto h-16 w-16 text-gray-400 mb-4" />
				<p class="text-lg font-medium text-gray-900 mb-2">No filters available</p>
				<p class="text-sm text-gray-500">Filter options will appear here when available</p>
			</div>
		{/if}
	</div>
</div>

<!-- Mobile Dock -->
<div class="md:hidden fixed inset-x-0 bottom-0 z-50">
	<!-- Backdrop when expanded -->
	{#if isExpanded}
		<button
			aria-label="toggle-expand"
			class="fixed inset-0 backdrop-blur-sm bg-black/30 transition-all duration-200"
			onclick={toggleExpanded}
		></button>
	{/if}

	<!-- Filter Dock -->
	<div class="relative bg-white border-t border-gray-200 shadow-2xl">
		<!-- Dock Header (Always Visible) -->
		<div class="px-4 py-3">
			<div class="w-full flex items-center justify-between">
				<button onclick={toggleExpanded} class="flex items-center space-x-3 flex-1">
					<Icon icon="mdi:filter-variant" class="w-5 h-5 text-gray-600" />
					<span class="font-medium text-gray-900">Filters</span>
					{#if totalActiveFilters > 0}
						<span
							class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
						>
							{totalActiveFilters}
						</span>
					{/if}
				</button>
				<div class="flex items-center space-x-2">
					{#if hasActiveFilters}
						<button
							onclick={() => {
								Object.keys(selectedMetadataFilters).forEach((key) => clearFilterGroup(key));
							}}
							class="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded"
						>
							Clear
						</button>
					{/if}
					<button onclick={toggleExpanded} class="flex items-center">
						<Icon
							icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-up'}
							class="w-5 h-5 text-gray-400 transition-transform duration-200"
						/>
					</button>
				</div>
			</div>
		</div>

		<!-- Expandable Content -->
		{#if isExpanded}
			<div class="border-t border-gray-200">
				<div class="max-h-[70vh] overflow-y-auto bg-white">
					<div class="p-4 space-y-6">
						{#each Object.entries(metadataOptions) as [key, option]}
							<div class=" rounded-lg p-4 bg-neutral-200">
								<div class="flex items-center justify-between mb-3 bg-neutral-200">
									<div class="flex items-center space-x-2">
										<Icon icon={getFilterIcon(key)} class="w-4 h-4 text-gray-600" />
										<h4 class="font-medium text-gray-900 text-sm">
											{formatKey(key)}
										</h4>
										{#if getSelectedCount(key) > 0}
											<span
												class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
											>
												{getSelectedCount(key)}
											</span>
										{/if}
									</div>
									{#if getSelectedCount(key) > 0}
										<button
											onclick={() => clearFilterGroup(key)}
											class="text-xs text-gray-500 hover:text-red-600 transition-colors"
										>
											Clear
										</button>
									{/if}
								</div>

								<div class="space-y-2 max-h-32 overflow-y-auto">
									{#each option.values as value}
										{@const isSelected = selectedMetadataFilters[key]?.includes(value) || false}
										<label
											class="flex items-center space-x-3 text-sm cursor-pointer group hover:bg-white p-2 rounded transition-colors"
										>
											<input
												type="checkbox"
												checked={isSelected}
												onchange={() => toggleMetadataValue(key, value)}
												class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
											/>
											<span
												class="text-gray-700 group-hover:text-gray-900 transition-colors leading-5 min-w-0"
											>
												{value}
											</span>
										</label>
									{/each}
								</div>
							</div>
							<hr class="my-4 border-gray-200" />
						{/each}

						{#if Object.keys(metadataOptions).length === 0}
							<div class="text-center py-8 text-gray-500">
								<Icon icon="mdi:filter-off" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
								<p class="text-sm">No filter options available</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Mobile spacing to prevent content overlap -->
<div class="md:hidden h-16"></div>

<style>
	.scrollbar-thin::-webkit-scrollbar {
		width: 6px;
	}

	.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
		background-color: #d1d5db;
		border-radius: 3px;
	}

	.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
		background-color: #9ca3af;
	}

	.scrollbar-track-gray-100::-webkit-scrollbar-track {
		background-color: #f3f4f6;
		border-radius: 3px;
	}
</style>
