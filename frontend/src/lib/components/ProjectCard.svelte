<script lang="ts">
	import type { Project } from '$shared/types/index';

	let { project }: { project: Project } = $props();

	// Limit metadata to max 4 items
	const displayMetadata = project.metadata?.slice(0, 4) || [];
</script>

<div
	class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
>
	<div class="p-5">
		<!-- Header with name and stars -->
		<div class="flex justify-between items-start mb-3">
			<h2 class="text-xl font-bold text-gray-800">
				<a
					href={project.url}
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-blue-600 transition-colors"
				>
					{project.name}
				</a>
			</h2>

			{#if project.stars !== undefined}
				<div class="flex items-center bg-amber-50 px-2 py-1 rounded-full">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 mr-1 text-amber-500"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
						/>
					</svg>
					<span class="font-medium text-amber-700">{project.stars.toLocaleString()}</span>
				</div>
			{/if}
		</div>

		<!-- Description -->
		<p class="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

		<!-- Category -->
		<div class="mb-4">
			<span
				class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
			>
				{project.category}
			</span>
		</div>

		<!-- Metadata tags -->
		{#if displayMetadata.length > 0}
			<div class="flex flex-wrap gap-2 mb-4">
				{#each displayMetadata as meta}
					<span
						class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
					>
						{meta}
					</span>
				{/each}
			</div>
		{/if}

		<!-- Footer with additional info -->
		<div
			class="flex flex-wrap items-center text-sm text-gray-500 gap-3 pt-2 border-t border-gray-100"
		>
			{#if project.mainLanguage}
				<div class="flex items-center">
					<div class="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
					<span>{project.mainLanguage}</span>
				</div>
			{/if}

			{#if project.license}
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<span>{project.license}</span>
				</div>
			{/if}

			{#if project.openIssues !== undefined}
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<a
						href={`${project.repository || project.url}/issues`}
						target="_blank"
						rel="noopener noreferrer"
						class="hover:text-blue-600 transition-colors"
					>
						{project.openIssues}
						{project.openIssues === 1 ? 'issue' : 'issues'}
					</a>
				</div>
			{/if}

			{#if project.lastUpdated}
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<span
						>{new Date(project.lastUpdated).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric'
						})}</span
					>
				</div>
			{/if}
		</div>
	</div>
</div>
