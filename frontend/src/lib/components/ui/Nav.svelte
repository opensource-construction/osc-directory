<script lang="ts">
	import Icon from '@iconify/svelte';

	const repoLink = 'https://github.com/opensource-construction/osc-directory';
</script>

<header class="bg-neutral-100 border-b border-gray-200 shadow-sm">
	<div class="container mx-auto px-4 py-4 flex justify-between items-center">
		<nav>
			<ul class="flex space-x-4">
				<li>
					<a
						href={repoLink}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
					>
						<Icon icon="mdi:github" class="w-5 h-5" />
						View on GitHub
					</a>
				</li>
			</ul>
		</nav>
	</div>
</header>
