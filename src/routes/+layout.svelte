<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
	<header class="bg-slate-800 text-white shadow-md">
		<div class="container mx-auto px-4 py-4 flex justify-between items-center">
			<a href="/" class="text-xl font-bold">AEC Open Source Directory</a>
			<nav>
				<ul class="flex space-x-6">
					<li><a href="/" class="hover:text-blue-300 transition-colors">Home</a></li>
					<li>
						<a
							href="https://github.com/yourusername/osc-directory"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-blue-300 transition-colors">GitHub</a
						>
					</li>
				</ul>
			</nav>
		</div>
	</header>

	<main class="flex-grow">
		{@render children()}
	</main>

	<footer class="bg-slate-800 text-white mt-12">
		<div class="container mx-auto px-4 py-6">
			<div class="flex justify-between items-center">
				<div>
					<p>© 2025 opensource.construction</p>
				</div>
				<div>
					<a
						href="https://github.com/yourusername/osc-directory"
						target="_blank"
						rel="noopener noreferrer"
						class="text-white hover:text-blue-300 transition-colors"
					>
						Contribute on GitHub
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>
