<script>
	import Nav from '../../Nav.svelte';
	import Footer from '../../Footer.svelte';

	/**
	 * @type {{ data: import("./$types").PageData }}
	 */
	let { data } = $props();

	/**
	 * @param {string | Date} date
	 */
	function formatDate(date) {
		return new Date(date).toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{data.article.title} — SCV</title>
</svelte:head>

<Nav />

<article>
	<header class="band-blue">
		<div class="shell">
			<a class="back" href="/#actus">
				<iconify-icon icon="fa6-solid:arrow-left"></iconify-icon>
				Retour aux actualités
			</a>
			<time>{formatDate(data.article.date)}</time>
			<h1>{data.article.title}</h1>
		</div>
	</header>

	<div class="band-white">
		<div class="shell">
			<!-- contenu HTML rédigé dans l'éditeur admin -->
			<div class="content">
				{@html data.article.content}
			</div>

			<a class="more" href="/#actus">
				<iconify-icon icon="fa6-solid:arrow-left"></iconify-icon>
				Toutes les actualités
			</a>
		</div>
	</div>
</article>

<Footer />

<style lang="scss">
	header {
		padding-top: 6rem;
		padding-bottom: clamp(2rem, 6vw, 3.5rem);

		.shell {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		.back {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;

			color: #fff;
			opacity: 0.9;
			text-decoration: none;
			font-weight: 500;
			font-size: 0.9rem;
			width: max-content;

			&:hover {
				opacity: 1;
			}
		}

		time {
			font-size: 0.85rem;
			opacity: 0.85;
		}

		h1 {
			font-size: clamp(1.8rem, 5vw, 3rem);
			line-height: 1.1;
		}
	}

	.band-white {
		padding-block: clamp(2.5rem, 6vw, 4rem);
	}

	.content {
		max-width: 44rem;
		margin-inline: auto;

		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--color-800);

		/* le contenu vient de {@html} : styles globaux ciblés */
		:global(h2) {
			font-size: 1.6rem;
			margin: 2rem 0 0.75rem;
			color: var(--color-900);
		}
		:global(h3) {
			font-size: 1.3rem;
			margin: 1.5rem 0 0.5rem;
			color: var(--color-900);
		}
		:global(p) {
			margin: 0 0 1rem;
		}
		:global(ul),
		:global(ol) {
			margin: 0 0 1rem 1.25rem;
		}
		:global(ul) {
			list-style: disc;
		}
		:global(ol) {
			list-style: decimal;
		}
		:global(li) {
			margin-bottom: 0.35rem;
		}
		:global(a) {
			color: var(--scv-blue);
			text-decoration: underline;
		}
		:global(img) {
			max-width: 100%;
			height: auto;
			border-radius: 0.75rem;
			margin: 1.5rem 0;
			display: block;
		}
		:global(strong),
		:global(b) {
			font-weight: 700;
		}
	}

	.more {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;

		max-width: 44rem;
		margin: 2.5rem auto 0;

		color: var(--scv-red);
		font-weight: 600;
		text-decoration: none;
	}
</style>
