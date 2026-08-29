<script>
	import { onMount } from 'svelte';

	let scrolled = $state(false);
	let menuOpen = $state(false);

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

	function closeMenu() {
		menuOpen = false;
	}

	/** @param {KeyboardEvent} event */
	function onKeydown(event) {
		if (event.key === 'Escape') closeMenu();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<header class:scrolled class:menu-open={menuOpen}>
	<a href="/#accueil" class="brand" aria-label="Accueil">
		<img src="/scv_logo.jpg" alt="Sambo Club Védasien" />
	</a>

	<nav id="site-menu" class:open={menuOpen} aria-label="Navigation principale">
		{#each links as link (link.href)}
			<a href={link.href} onclick={closeMenu}>{link.label}</a>
		{/each}
	</nav>

	<button
		class="menu-toggle"
		type="button"
		aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
		aria-controls="site-menu"
		aria-expanded={menuOpen}
		onclick={() => (menuOpen = !menuOpen)}
	>
		<iconify-icon icon="fa6-solid:{menuOpen ? 'xmark' : 'bars'}"></iconify-icon>
	</button>

	<a href="/#inscription" class="cta" onclick={closeMenu}>
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
			position: absolute;
			top: calc(100% + 0.5rem);
			left: 1rem;
			right: 1rem;

			display: none;
			flex-direction: column;
			gap: 0.25rem;

			padding: 0.6rem;
			background: rgba(255, 255, 255, 0.98);
			border: 1px solid rgba(0, 0, 0, 0.08);
			border-radius: 0.75rem;
			box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.16);

			&.open {
				display: flex;
			}

			a {
				text-decoration: none;
				color: var(--color-800);
				font-weight: 500;
				padding: 0.75rem;
				border-radius: 0.5rem;
				transition: background-color 150ms;

				&:hover {
					background: var(--color-50);
				}
			}
		}

		.menu-toggle {
			margin-left: auto;
			padding: 0.6rem;
			background: rgba(0, 0, 0, 0.22);
			color: #fff;
			font-size: 1.2rem;
			line-height: 1;
		}

		.cta {
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
		&.scrolled,
		&.menu-open {
			background: rgba(255, 255, 255, 0.9);
			backdrop-filter: blur(10px);
			box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);

			.menu-toggle {
				background: var(--color-100);
				color: var(--color-800);
			}
		}
	}

	@media (min-width: 820px) {
		header {
			padding-inline: 2rem;

			nav {
				position: static;
				display: flex;
				flex-direction: row;
				margin-left: auto;
				padding: 0;
				gap: 1.75rem;
				background: transparent;
				border: 0;
				border-radius: 0;
				box-shadow: none;

				a {
					color: #fff;
					padding: 0;
					opacity: 0.92;

					&:hover {
						background: transparent;
						opacity: 1;
					}
				}
			}

			&.scrolled nav a,
			&.menu-open nav a {
				color: var(--color-800);
			}

			.menu-toggle {
				display: none;
			}

			.cta {
				margin-left: 0;
			}
		}
	}
</style>
