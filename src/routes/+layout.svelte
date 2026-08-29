<script>
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import '../app.scss';
	import 'iconify-icon/dist/iconify-icon.js';

	import Snacks from '$lib/components/Snacks.svelte';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();
</script>

<svelte:head>
	<title>SCV</title>
</svelte:head>

<Snacks />

{@render children()}
