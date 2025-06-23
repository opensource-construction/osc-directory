<script lang="ts">
	import Icon from '@iconify/svelte';

	const repoLink = 'https://github.com/opensource-construction/osc-directory';
</script>

<footer class="bg-neutral-100 border-t border-gray-200 mt-12">
	<div class="container mx-auto px-4 py-8">
		<div class="flex flex-col md:flex-row justify-between items-center gap-4">
			<div class="text-center md:text-left">
				<p class="text-gray-600">© 2025 opensource.construction</p>
			</div>
			<div class="flex items-center gap-4">
				<a
					href={repoLink}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-600 transition-colors font-medium"
				>
					<Icon icon="mdi:github" class="w-4 h-4" />
					Contribute on GitHub
				</a>
				<a
					href={'https://github.com/opensource-construction/osc-directory/issues/new?assignees=&labels=submission&template=new_project.yml&title=%5BNEW%20PROJECT%5D%20'}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
				>
					<Icon icon="mdi:plus" class="w-4 h-4" />
					Add Project
				</a>
			</div>
		</div>
	</div>
</footer>
