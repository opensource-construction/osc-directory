<script lang="ts">
	let {
		categories = [],
		selectedCategory = $bindable('all')
	}: { categories: string[]; selectedCategory: string } = $props();
</script>

<div class="mb-6">
	<label for="category-filter" class="block text-sm font-medium mb-2"> Filter by Category: </label>
	<select
		id="category-filter"
		bind:value={selectedCategory}
		class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
	>
		<option value="all">All Categories</option>
		{#each categories as category}
			<option value={category}>{category}</option>
		{/each}
	</select>
</div>
