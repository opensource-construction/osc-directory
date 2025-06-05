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

	function clearAllFilters() {
		Object.keys(selectedMetadataFilters).forEach((key) => clearFilterGroup(key));
	}
</script>

<!-- Show mobile version for portrait OR small screens -->
<div class="block portrait:block landscape:hidden md:landscape:block">
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

		function clearAllFilters() {
			Object.keys(selectedMetadataFilters).forEach((key) => clearFilterGroup(key));
		}
	</script>

	<div class="fixed bottom-4 left-4 z-50">
		{#if !isExpanded}
			<!-- Collapsed: Floating Circle Button -->
			<button
				onclick={toggleExpanded}
				class="w-14 h-14 bg-primary-500 m:cursor-pointer hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative"
			>
				<Icon icon="mdi:filter-variant" class="w-6 h-6" />
				{#if totalActiveFilters > 0}
					<span
						class="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-red-500 text-white border-2 border-white"
					>
						{totalActiveFilters}
					</span>
				{/if}
			</button>
		{:else}
			<!-- Expanded: Full Screen Overlay -->
			<div class="fixed inset-0 z-50">
				<!-- Backdrop -->
				<button
					aria-label="Close filters"
					class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
					onclick={toggleExpanded}
				></button>

				<!-- Filter Drawer -->
				<div
					class="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 shadow-2xl max-h-[80vh] xl:rounded-t-2xl xl:w-[60vw] xl:m-auto flex flex-col transform transition-all duration-300"
				>
					<!-- Handle bar -->
					<div class="flex justify-center py-2">
						<div class="w-12 h-1 bg-gray-300 rounded-full"></div>
					</div>

					<!-- Header -->
					<div class="px-4 py-3 border-b border-gray-200 flex-shrink-0">
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<Icon icon="mdi:filter-variant" class="w-5 h-5 text-gray-600" />
								<span class="font-semibold text-gray-900">Filters</span>
								{#if totalActiveFilters > 0}
									<span
										class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
									>
										{totalActiveFilters}
									</span>
								{/if}
							</div>
							<div class="flex items-center space-x-2">
								{#if hasActiveFilters}
									<button
										onclick={clearAllFilters}
										class="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50"
									>
										Clear All
									</button>
								{/if}
								<button
									onclick={toggleExpanded}
									class="p-1 hover:bg-gray-200 rounded-full transition-colors"
								>
									<Icon icon="mdi:close" class="w-5 h-5 text-gray-400" />
								</button>
							</div>
						</div>
					</div>

					<!-- Scrollable Content -->
					<div class="flex-1 overflow-y-auto">
						<div class="p-4 space-y-4">
							{#each Object.entries(metadataOptions) as [key, option]}
								<div class="bg-gray-50 rounded-lg">
									<div class="flex items-center justify-between p-4 bg-neutral-200 rounded-t-lg">
										<div class="flex items-center space-x-2">
											<Icon icon={getFilterIcon(key)} class="w-4 h-4" />
											<h4 class="font-medium text-sm">
												{formatKey(key)}
											</h4>
											{#if getSelectedCount(key) > 0}
												<span
													class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500 text-white"
												>
													{getSelectedCount(key)}
												</span>
											{/if}
										</div>
										{#if getSelectedCount(key) > 0}
											<button
												onclick={() => clearFilterGroup(key)}
												class="text-xs text-gray-600 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-white/50"
											>
												Clear
											</button>
										{/if}
									</div>

									<div class="space-y-2 max-h-32 overflow-y-auto mx-2">
										{#each option.values as value}
											{@const isSelected = selectedMetadataFilters[key]?.includes(value) || false}
											<label
												class="flex items-center space-x-3 text-sm cursor-pointer group hover:bg-white p-2 rounded transition-colors"
											>
												<input
													type="checkbox"
													checked={isSelected}
													onchange={() => toggleMetadataValue(key, value)}
													class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 flex-shrink-0"
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

							{#if Object.keys(metadataOptions).length === 0}
								<div class="text-center py-8 text-gray-500">
									<Icon icon="mdi:filter-off" class="mx-auto h-12 w-12 text-gray-400 mb-4" />
									<p class="text-sm">No filter options available</p>
								</div>
							{/if}

							<!-- Bottom safe area padding -->
							<div class="h-8"></div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
