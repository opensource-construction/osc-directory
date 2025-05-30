<script lang="ts">
	import Nav from '$lib/components/ui/Nav.svelte';
	import Footer from '$lib/components/ui/Footer.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
	<Nav />

	<main class="flex-grow">
		{@render children()}
	</main>

	<Footer />
</div>
