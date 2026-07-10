<script>
	import Nav from './Nav.svelte';
	import Hero from './Hero.svelte';
	import Actus from './Actus.svelte';
	import Carousel from './Carousel.svelte';
	import Presentation from './Presentation.svelte';
	import Calendar from './Calendar.svelte';
	import Contact from './Contact.svelte';
	import Footer from './Footer.svelte';

	let { data } = $props();

	/**
	 * @type {HTMLElement}
	 */
	let schedulesSection;
</script>

<Nav />

<main>
	<section id="accueil" class="hero">
		<Hero onsee={() => schedulesSection.scrollIntoView({ behavior: 'smooth' })} />
	</section>

	{#if data.news.length}
		<section id="actus" class="section band-light">
			<div class="shell">
				<Actus news={data.news} />
			</div>
		</section>
	{/if}

	<section id="equipe" class="section band-blue">
		<div class="shell">
			<Presentation />
		</div>
	</section>

	<section id="galerie" class="band-dark">
		<Carousel />
	</section>

	<section id="horaires" class="section band-light" bind:this={schedulesSection}>
		<div class="shell">
			<Calendar />
		</div>
	</section>

	<section id="contact" class="section band-red">
		<div class="shell">
			<Contact />
		</div>
	</section>
</main>

<Footer />

<style lang="scss">
	.hero {
		position: relative;
		height: 100dvh;
		overflow: hidden;
	}
</style>
