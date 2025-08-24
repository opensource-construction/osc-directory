<script lang="ts">
	import Nav from '$lib/components/ui/Nav.svelte';
	import Footer from '$lib/components/ui/Footer.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<script>
		var _paq = (window._paq = window._paq || []);
		_paq.push(['setExcludedQueryParams', ['_gl', 'gad_source', 'wbraid', 'gad_campaignid']]);
		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);
		(function () {
			var u = 'https://app.friendlyanalytics.ch/';
			_paq.push(['setTrackerUrl', u + 'js/tracker.php']);
			_paq.push(['setSiteId', '294']);
			var d = document,
				g = d.createElement('script'),
				s = d.getElementsByTagName('script')[0];
			g.async = true;
			g.src = u + 'js/tracker.php';
			s.parentNode.insertBefore(g, s);
		})();
	</script>
</svelte:head>

<div class="flex flex-col min-h-screen">
	<Nav />

	<main class="flex-grow">
		{@render children()}
	</main>

	<Footer />
</div>
