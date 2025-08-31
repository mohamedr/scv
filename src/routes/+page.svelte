<script>
	import Carousel from './Carousel.svelte';
	import Presentation from './Presentation.svelte';
	import Calendar from './Calendar.svelte';
	import Contact from './Contact.svelte';
	import Footer from './Footer.svelte';
	import Hero from './Hero.svelte';

	/**
	 * @type {HTMLElement}
	 */
	let schedulesSection;
</script>

<main>
	<section id="accueil" class="landing">
		<Hero onsee={() => schedulesSection.scrollIntoView({ behavior: 'smooth' })} />
	</section>

	<section id="equipe" class="second">
		<Carousel />
		<Presentation />
	</section>

	<section id="horaires" class="pad-top" bind:this={schedulesSection}>
		<Calendar />
	</section>

	<section id="contact" class="pad-top contact">
		<Contact />
		<Footer />
	</section>
</main>

<style lang="scss">
	:root {
		background-color: var(--scv-blue);
	}

	main {
		background-color: var(--scv-red);
		color: white;

		section {
			height: 100vh;

			&.pad-top {
				padding-top: 7rem;
			}

			&.contact,
			&.second {
				display: grid;
				grid-template-rows: auto 1fr;
			}

			&.second {
				height: auto;
			}

			&.contact {
				grid-template-rows: 1fr auto;
			}
		}

		.landing {
			position: relative;
		}
	}
</style>
