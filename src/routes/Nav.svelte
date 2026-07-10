<script>
	import { onMount } from 'svelte';

	let scrolled = $state(false);

	onMount(() => {
		const onScroll = () => (scrolled = window.scrollY > 60);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	const links = [
		{ href: '/#actus', label: 'Actus' },
		{ href: '/#equipe', label: "L'équipe" },
		{ href: '/#horaires', label: 'Horaires' },
		{ href: '/#contact', label: 'Contact' }
	];
</script>

<header class:scrolled>
	<a href="/#accueil" class="brand" aria-label="Accueil">
		<img src="/scv_logo.jpg" alt="Sambo Club Védasien" />
	</a>

	<nav>
		{#each links as link (link.href)}
			<a href={link.href}>{link.label}</a>
		{/each}
	</nav>

	<a href="/#inscription" class="cta">
		<iconify-icon icon="fa6-solid:user-plus"></iconify-icon>
		S'inscrire
	</a>
</header>

<style lang="scss">
	header {
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 50;

		display: flex;
		align-items: center;
		gap: 1rem;

		padding: 0.6rem 1.25rem;

		transition:
			background-color 300ms,
			box-shadow 300ms;

		.brand img {
			width: 3rem;
			height: 3rem;
			border-radius: 0.5rem;
			object-fit: cover;
			display: block;
		}

		nav {
			display: none;
			margin-left: auto;
			gap: 1.75rem;

			a {
				text-decoration: none;
				color: #fff;
				font-weight: 500;
				opacity: 0.92;
				transition: opacity 150ms;

				&:hover {
					opacity: 1;
				}
			}
		}

		.cta {
			margin-left: auto;
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;

			text-decoration: none;
			font-weight: 600;
			color: #fff;
			background: var(--scv-red);
			padding: 0.55rem 1rem;
			border-radius: 0.5rem;
			white-space: nowrap;

			transition: filter 150ms;

			&:hover {
				filter: brightness(1.05);
			}
		}

		/* fond translucide dès qu'on scrolle */
		&.scrolled {
			background: rgba(255, 255, 255, 0.9);
			backdrop-filter: blur(10px);
			box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);

			nav a {
				color: var(--color-800);
			}
		}
	}

	@media (min-width: 820px) {
		header {
			padding-inline: 2rem;

			nav {
				display: flex;
			}

			.cta {
				margin-left: 0;
			}
		}
	}
</style>
