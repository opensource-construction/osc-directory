<script lang="ts">
	import type { FilterOption } from '$lib/types/types';
	import Icon from '@iconify/svelte';

	interface Props {
		metadataOptions: Record<string, FilterOption>;
		selectedMetadataFilters: Record<string, string[]>;
		updateMetadataFilter: (key: string, values: string[]) => void;
	}

	let { metadataOptions, selectedMetadataFilters, updateMetadataFilter }: Props = $props();

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

	function getSelectedCount(key: string): number {
		return selectedMetadataFilters[key]?.length || 0;
	}

	function getFilterIcon(key: string): string {
		const option = metadataOptions[key];
		return option?.icon || '📋';
	}
</script>

<div class="bg-white border border-gray-200 rounded-lg shadow-sm">
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
				<div class="space-y-3">
					<div class="flex items-center justify-between min-h-[2rem]">
						<div class="flex items-center min-w-0 flex-1">
							<span class="mr-3 text-lg flex-shrink-0">
								<Icon icon={getFilterIcon(key)} class="w-4 h-4" />
							</span>
							<h4 class="font-medium text-gray-900 text-sm truncate">
								{formatKey(key)}
							</h4>
							{#if getSelectedCount(key) > 0}
								<span
									class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 flex-shrink-0"
								>
									{getSelectedCount(key)}
								</span>
							{/if}
						</div>
						{#if getSelectedCount(key) > 0}
							<button
								onclick={() => clearFilterGroup(key)}
								class="text-xs text-gray-500 hover:text-gray-700 transition-colors ml-2 flex-shrink-0"
							>
								Clear
							</button>
						{/if}
					</div>

					<div
						class="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
					>
						{#each option.values as value}
							{@const isSelected = selectedMetadataFilters[key]?.includes(value) || false}
							<label
								class="flex items-start space-x-3 text-sm cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors"
							>
								<input
									type="checkbox"
									checked={isSelected}
									onchange={() => toggleMetadataValue(key, value)}
									class="mt-0.5 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 transition-colors flex-shrink-0"
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
			<div class="text-center py-8 text-gray-500">
				<svg
					class="mx-auto h-12 w-12 text-gray-400 mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v12a2 2 0 002 2h8a2 2 0 002-2V7m-5 5v6m-2-6v6"
					/>
				</svg>
				<p class="text-sm">No filter options available</p>
			</div>
		{/if}
	</div>
</div>

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
