<script lang="ts">
	import type { Project } from '$lib/types/types.js';

	let { project }: { project: Project } = $props();
</script>

<div class="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
	<div class="p-4">
		<h2 class="text-xl font-semibold mb-2">
			<a
				href={project.url}
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-600 hover:underline"
			>
				{project.name}
			</a>
		</h2>

		<p class="text-gray-700 mb-4">{project.description}</p>

		<div class="flex flex-wrap gap-2 mb-4">
			<span
				class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
			>
				{project.category}
			</span>
		</div>

		<div class="flex items-center text-sm text-gray-500 space-x-4">
			{#if project.mainLanguage}
				<div class="flex items-center">
					<span class="mr-1">Language:</span>
					<span class="font-medium">{project.mainLanguage}</span>
				</div>
			{/if}

			{#if project.stars !== undefined}
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 mr-1"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
						/>
					</svg>
					<span>{project.stars}</span>
				</div>
			{/if}

			{#if project.lastUpdated}
				<div>
					Updated: {new Date(project.lastUpdated).toLocaleDateString()}
				</div>
			{/if}
		</div>
	</div>
</div>
