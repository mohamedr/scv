<script>
	/**
	 * @type {{ onsee(): void }}
	 */
	let { onsee } = $props();
</script>

<img
	class="bg"
	src="https://upload.wikimedia.org/wikipedia/commons/1/13/Sambo_at_the_2015_European_Games.jpg"
	alt=""
/>

<div class="heading">
	<h1>
		Sambo
		<br />
		Club Vedasien
	</h1>
	<div class="location">
		<iconify-icon icon="fa6-solid:location-dot"></iconify-icon>
		<p>
			Gymnase de la Combe<br />1-19 Av. de la Libération <br />
			<span>Saint-Jean-de-Védas</span>
		</p>
	</div>
	<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. molestiae architecto optio.</p>
	<div class="buttons">
		<button onclick={onsee}>
			<iconify-icon icon="fa6-solid:calendar"></iconify-icon>
			Voir les horaires
		</button>
	</div>
</div>

<nav>
	<img class="logo" src="/scv_logo.jpg" alt="" />
</nav>

<style lang="scss">
	nav {
		position: fixed;

		z-index: 10;

		top: 1rem;
		left: 1rem;

		.logo {
			width: 5rem;
			height: auto;

			z-index: 2;
			border-radius: 0.5rem;
		}
	}

	.heading {
		position: absolute;

		inset: 0;

		color: white;
		backdrop-filter: blur(8px);

		display: flex;
		flex-direction: column;
		padding: 2rem;
		justify-content: center;

		> p {
			margin: 2rem 0;
			line-height: 1.25rem;
		}

		.location {
			display: inline-flex;
			align-items: flex-start;
			gap: 1rem;
			font-size: 1.15rem;
			font-weight: 400;

			iconify-icon {
				margin-top: 0.25rem;
				font-size: 2rem;
			}

			span {
				font-size: 1rem;
				font-weight: 300;
				font-style: italic;
			}
		}

		h1 {
			font-size: 3rem;
			border-bottom: 1px solid currentColor;
			padding-bottom: 3rem;
			margin-bottom: 1.5rem;
		}
	}

	.bg {
		width: 100%;
		height: 100%;
		object-fit: cover;

		filter: brightness(0.5);
	}

	@media screen and (min-width: 768px) {
		.heading {
			padding-inline: 20vw;
		}
	}
</style>
