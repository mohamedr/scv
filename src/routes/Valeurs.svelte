<script>
	const POSTER = '/valeurs/valeurs-sambo.jpg';
	const POSTER_DETAIL = '/valeurs/valeurs-sambo-detail.jpg';

	const colors = ['var(--scv-red)', 'var(--scv-blue)', 'var(--scv-cyan)', 'var(--scv-red)', 'var(--scv-blue)'];

	const values = [
		{
			name: 'Sincérité',
			tag: 'Comme la sincérité dans le combat !',
			quote: 'Se battre avec le cœur, sans tricher ni envers soi-même ni envers son adversaire.'
		},
		{
			name: 'Amitié',
			tag: 'Avec tes partenaires comme tes adversaires !',
			quote: "Un échange entre deux partenaires qui cherchent une progression mutuelle afin de s'élever vers l'excellence."
		},
		{
			name: 'Modestie',
			tag: 'Il y a toujours plus fort que toi !',
			quote: 'Gagner sans se vanter, et perdre sans se décourager.'
		},
		{
			name: 'Bravoure',
			tag: "N'aie pas peur, pars au combat avec confiance en toi !",
			quote: "Oser affronter ses peurs et se battre avec courage, quoi qu'il arrive."
		},
		{
			name: 'Ouverture',
			tag: "Ouvre-toi sur le monde, tu n'es pas seul(e) !",
			quote:
				"Se donner la possibilité de rester ouvert à chacun, de saisir l'opportunité, d'apprendre, d'évoluer et de s'éveiller."
		}
	];

	/** @type {string | null} */
	let lightbox = $state(null);

	/** @param {string} src */
	function open(src) {
		lightbox = src;
	}
	function close() {
		lightbox = null;
	}

	/** Ferme uniquement si on clique le fond (pas l'image). @param {MouseEvent} e */
	function onBackdrop(e) {
		if (e.target === e.currentTarget) close();
	}

	/** @param {KeyboardEvent} e */
	function onKeydown(e) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<h2 class="section-title">
	<iconify-icon icon="fa6-solid:heart"></iconify-icon>
	Nos valeurs
</h2>
<p class="lead">Les valeurs du sambo, au cœur de notre club.</p>

<div class="layout">
	<div class="affiche">
		<button class="poster" onclick={() => open(POSTER)} title="Agrandir l'affiche">
			<img
				src={POSTER}
				alt="Affiche « Valeurs du sambo » du Comité Français de Sambo"
				loading="lazy"
			/>
			<span class="zoom">
				<iconify-icon icon="fa6-solid:magnifying-glass-plus"></iconify-icon>
				Agrandir
			</span>
		</button>

		<button class="detail-btn" onclick={() => open(POSTER_DETAIL)}>
			<iconify-icon icon="fa6-solid:file-lines"></iconify-icon>
			Voir l'affiche détaillée
		</button>
	</div>

	<div class="values">
		{#each values as v, i}
			<article class="value" style="--c: {colors[i]}">
				<h3 class="name"><span class="initial">{v.name[0]}</span>{v.name.slice(1)}</h3>
				<p class="tag">{v.tag}</p>
				<p class="quote">«&nbsp;{v.quote}&nbsp;»</p>
			</article>
		{/each}
	</div>
</div>

<p class="credit">Affiche officielle du Comité Français de Sambo</p>

{#if lightbox}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="lightbox" onclick={onBackdrop}>
		<button class="close" onclick={close} aria-label="Fermer">
			<iconify-icon icon="fa6-solid:xmark"></iconify-icon>
		</button>
		<img src={lightbox} alt="Affiche des valeurs du sambo" />
	</div>
{/if}

<style lang="scss">
	.section-title {
		color: var(--scv-red);
	}

	.lead {
		margin-top: -1.5rem;
		margin-bottom: 2.5rem;
		color: var(--color-500);
		font-size: 1.05rem;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 21rem) 1fr;
		gap: 2rem;
		align-items: start;
	}

	.affiche {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.poster {
		position: relative;
		display: block;
		padding: 0;
		border: none;
		border-radius: 1rem;
		overflow: hidden;
		cursor: pointer;
		background: none;

		box-shadow: 0 0.6rem 1.6rem rgba(0, 0, 0, 0.15);
		transition:
			transform 200ms,
			box-shadow 200ms;

		img {
			width: 100%;
			display: block;
		}

		.zoom {
			position: absolute;
			inset: auto 0 0 0;

			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;

			padding: 0.9rem;
			color: #fff;
			font-weight: 600;
			font-size: 0.9rem;

			background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
			opacity: 0;
			transition: opacity 200ms;
		}

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 1rem 2.2rem rgba(0, 0, 0, 0.22);

			.zoom {
				opacity: 1;
			}
		}
	}

	.detail-btn {
		justify-content: center;
		background: var(--scv-blue);
		color: #fff;
		font-weight: 600;
		padding: 0.7rem 1rem;
	}

	.values {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: 1.25rem;
	}

	.value {
		background: #fff;
		border: 1px solid var(--color-100);
		border-left: 4px solid var(--c);
		border-radius: 0.9rem;
		padding: 1.5rem;

		box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.05);

		.name {
			font-size: 1.5rem;
			margin-bottom: 0.5rem;
			color: var(--color-900);

			.initial {
				color: var(--c);
				font-weight: 800;
				font-size: 1.35em;
				margin-right: 0.02em;
			}
		}

		.tag {
			font-weight: 600;
			color: var(--color-800);
			margin-bottom: 0.5rem;
		}

		.quote {
			font-style: italic;
			font-size: 0.92rem;
			line-height: 1.5;
			color: var(--color-500);
		}
	}

	.credit {
		margin-top: 1.75rem;
		text-align: right;
		font-size: 0.8rem;
		font-style: italic;
		color: var(--color-400);
	}

	/* visionneuse plein écran */
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 100;

		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;

		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(4px);
		cursor: zoom-out;

		img {
			max-width: min(100%, 50rem);
			max-height: 90vh;
			object-fit: contain;
			border-radius: 0.5rem;
			box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.5);
			cursor: default;
		}

		.close {
			position: absolute;
			top: 1rem;
			right: 1rem;

			width: 2.75rem;
			height: 2.75rem;
			border-radius: 999px;

			background: rgba(255, 255, 255, 0.15);
			color: #fff;
			font-size: 1.25rem;

			&:hover {
				background: rgba(255, 255, 255, 0.28);
			}
		}
	}

	@media (max-width: 820px) {
		.layout {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.affiche {
			max-width: 22rem;
			margin-inline: auto;
			width: 100%;

			.poster .zoom {
				opacity: 1;
			}
		}
	}
</style>
