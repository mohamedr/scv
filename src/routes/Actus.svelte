<script>
	/**
	 * @type {{
	 *  news: Array<{ _id: string; title: string; date: string | Date; excerpt: string; cover: string | null }>
	 * }}
	 */
	let { news = [] } = $props();

	const highlight = $derived(news[0]);
	const rest = $derived(news.slice(1));

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

<h2 class="section-title">
	<iconify-icon icon="fa6-solid:newspaper"></iconify-icon>
	Actualités
</h2>

{#if !news.length}
	<div class="empty">
		<iconify-icon icon="fa6-regular:newspaper"></iconify-icon>
		<p class="title">Pas encore d'actualité</p>
		<p class="sub">Le club publiera bientôt ses news, résultats et événements ici. Revenez vite&nbsp;!</p>
	</div>
{/if}

{#if highlight}
	<a
		class="highlight"
		class:has-cover={highlight.cover}
		href="/actus/{highlight._id}"
		style={highlight.cover ? `--cover: url('${highlight.cover}')` : ''}
	>
		<div class="text">
			<span class="badge">À la une</span>
			<time>{formatDate(highlight.date)}</time>
			<h3>{highlight.title}</h3>
			<p>{highlight.excerpt}</p>
			<span class="cta">
				Lire l'article
				<iconify-icon icon="fa6-solid:arrow-right"></iconify-icon>
			</span>
		</div>
	</a>
{/if}

{#if rest.length}
	<div class="grid">
		{#each rest as item (item._id)}
			<a class="card" href="/actus/{item._id}">
				{#if item.cover}
					<div class="thumb" style="background-image: url('{item.cover}')"></div>
				{/if}
				<div class="body">
					<time>{formatDate(item.date)}</time>
					<h4>{item.title}</h4>
					<p>{item.excerpt}</p>
					<span class="cta">Lire <iconify-icon icon="fa6-solid:arrow-right"></iconify-icon></span>
				</div>
			</a>
		{/each}
	</div>
{/if}

<style lang="scss">
	.section-title {
		color: var(--scv-red);
	}

	.empty {
		background: #fff;
		border: 1px dashed var(--color-200);
		border-radius: 1rem;
		padding: clamp(2.5rem, 6vw, 4rem) 1.5rem;
		text-align: center;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;

		iconify-icon {
			font-size: 2.75rem;
			color: var(--scv-red);
			opacity: 0.55;
			margin-bottom: 0.25rem;
		}

		.title {
			font-size: 1.25rem;
			font-weight: 700;
			color: var(--color-800);
		}

		.sub {
			max-width: 30rem;
			color: var(--color-500);
			line-height: 1.5;
		}
	}

	/* ---- Article à la une (pleine largeur) ---- */
	.highlight {
		display: block;
		text-decoration: none;
		color: inherit;

		position: relative;
		overflow: hidden;
		border-radius: 1.25rem;
		min-height: 22rem;

		background: linear-gradient(135deg, var(--scv-red), var(--scv-blue));
		box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.12);

		transition:
			transform 200ms,
			box-shadow 200ms;

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 1.2rem 2.6rem rgba(0, 0, 0, 0.18);

			.cta iconify-icon {
				transform: translateX(4px);
			}
		}

		&.has-cover::before {
			content: '';
			position: absolute;
			inset: 0;
			background-image: var(--cover);
			background-size: cover;
			background-position: center;
		}

		/* voile pour lisibilité du texte */
		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(
				90deg,
				rgba(0, 0, 0, 0.78) 0%,
				rgba(0, 0, 0, 0.55) 45%,
				rgba(0, 0, 0, 0.15) 100%
			);
		}

		.text {
			position: relative;
			z-index: 1;

			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.6rem;

			max-width: 40rem;
			padding: clamp(1.5rem, 4vw, 3rem);
			min-height: 22rem;
			justify-content: center;

			color: #fff;
		}

		.badge {
			background: var(--scv-red);
			color: #fff;
			font-size: 0.7rem;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			padding: 0.3rem 0.7rem;
			border-radius: 999px;
		}

		time {
			font-size: 0.8rem;
			opacity: 0.85;
		}

		h3 {
			font-size: clamp(1.6rem, 4vw, 2.5rem);
			line-height: 1.1;
		}

		p {
			font-size: 1.05rem;
			line-height: 1.5;
			opacity: 0.95;
		}
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		color: var(--scv-red);
		margin-top: 0.25rem;

		iconify-icon {
			transition: transform 200ms;
		}
	}

	.highlight .cta {
		color: #fff;
	}

	/* ---- Autres articles (cards) ---- */
	.grid {
		margin-top: 1.75rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
		gap: 1.5rem;
	}

	.card {
		text-decoration: none;
		color: inherit;

		display: flex;
		flex-direction: column;

		background: #fff;
		border: 1px solid var(--color-100);
		border-radius: 1rem;
		overflow: hidden;

		box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.06);
		transition:
			transform 200ms,
			box-shadow 200ms;

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 0.8rem 1.8rem rgba(0, 0, 0, 0.1);

			.cta iconify-icon {
				transform: translateX(4px);
			}
		}

		.thumb {
			height: 10rem;
			background-size: cover;
			background-position: center;
			background-color: var(--color-100);
		}

		.body {
			padding: 1.25rem;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}

		time {
			font-size: 0.75rem;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.02em;
			color: var(--scv-red);
		}

		h4 {
			font-size: 1.2rem;
			line-height: 1.2;
			color: var(--color-900);
		}

		p {
			font-size: 0.9rem;
			line-height: 1.5;
			color: var(--color-700);
		}
	}
</style>
