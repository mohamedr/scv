<script>
	import '../app.scss';
	import 'iconify-icon/dist/iconify-icon.js';

	import Snacks from '$lib/components/Snacks.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>SCV</title>
</svelte:head>

<Snacks />

{@render children()}
