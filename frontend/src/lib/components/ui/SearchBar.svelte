<script lang="ts">
	interface Props {
		searchQuery: string;
		onSearchChange: (query: string) => void;
		onClearSearch?: () => void;
		placeholder?: string;
		showTips?: boolean;
		resultCount?: number;
		totalCount?: number;
	}

	let {
		searchQuery = $bindable(),
		onSearchChange,
		onClearSearch,
		placeholder = 'Search by name, description, language, tags, platforms, or frameworks...',
		showTips = true,
		resultCount,
		totalCount
	}: Props = $props();

	let searchInput: HTMLInputElement;

	function handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		searchQuery = target.value;
		onSearchChange(target.value);
	}

	function handleClearSearch() {
		searchQuery = '';
		onSearchChange('');
		onClearSearch?.();
		searchInput?.focus();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClearSearch();
		}
	}
</script>

<div class="bg-white rounded-lg shadow-sm border p-4">
	<div class="flex items-center justify-between mb-2">
		<label for="search" class="block text-sm font-medium text-gray-700"> Search Projects </label>
		{#if resultCount !== undefined && totalCount !== undefined}
			<span class="text-sm text-gray-600">
				{resultCount} of {totalCount} projects
			</span>
		{/if}
	</div>

	<div class="relative">
		<input
			bind:this={searchInput}
			id="search"
			type="text"
			value={searchQuery}
			oninput={handleInputChange}
			onkeydown={handleKeydown}
			{placeholder}
			class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			autocomplete="off"
		/>

		{#if searchQuery.trim()}
			<button
				aria-label="Clear search"
				onclick={handleClearSearch}
				class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
				title="Clear search"
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
		{:else}
			<div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					></path>
				</svg>
			</div>
		{/if}
	</div>

	{#if showTips}
		<div class="mt-2">
			<p class="text-sm text-gray-600">
				💡 Tip: Search across project names, descriptions, categories, languages, and tags
			</p>
		</div>
	{/if}
</div>
