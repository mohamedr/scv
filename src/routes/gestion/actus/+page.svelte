<script>
	import { invalidateAll } from '$app/navigation';
	import { snacks } from '$lib/components/Snacks.svelte';
	import { api } from '$lib/functions/api';
	import { flip } from 'svelte/animate';
	import { expoOut } from 'svelte/easing';
	import { scale, slide } from 'svelte/transition';

	/**
	 * @type {{ data: import("./$types").PageData }}
	 */
	let { data } = $props();

	/** @type {string | null} */
	let confirmingId = $state(null);
	let busyId = $state('');

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

	/** @param {typeof data.news[number]} item */
	async function toggleVisible(item) {
		busyId = item._id;
		try {
			await api.action('?/toggleVisible', { _id: item._id, visible: String(!item.visible) });
			await invalidateAll();
		} catch (error) {
			snacks.error(error);
		} finally {
			busyId = '';
		}
	}

	/** @param {typeof data.news[number]} item */
	async function toggleFeatured(item) {
		busyId = item._id;
		try {
			await api.action('?/toggleFeatured', { _id: item._id, featured: String(!item.featured) });
			await invalidateAll();
		} catch (error) {
			snacks.error(error);
		} finally {
			busyId = '';
		}
	}

	/** @param {typeof data.news[number]} item */
	async function remove(item) {
		busyId = item._id;
		try {
			await api.action('?/delete', { _id: item._id });
			confirmingId = null;
			await invalidateAll();
		} catch (error) {
			snacks.error(error);
		} finally {
			busyId = '';
		}
	}
</script>

<main>
	<div class="head">
		<p class="caption">{data.news.length} article{data.news.length > 1 ? 's' : ''}</p>
		<a class="btn-primary new" href="/gestion/actus/editor">
			<iconify-icon icon="fa6-solid:plus"></iconify-icon>
			Nouvel article
		</a>
	</div>

	<div class="list">
		{#each data.news as item (item._id)}
			<div
				class="actu"
				class:hidden={!item.visible}
				animate:flip={{ easing: expoOut }}
				transition:scale={{ easing: expoOut }}
			>
				{#if item.cover}
					<div class="thumb" style="background-image: url('{item.cover}')"></div>
				{:else}
					<div class="thumb empty">
						<iconify-icon icon="fa6-solid:newspaper"></iconify-icon>
					</div>
				{/if}

				<div class="info">
					<div class="top">
						<h3>{item.title}</h3>
						{#if item.featured}
							<span class="badge featured">
								<iconify-icon icon="fa6-solid:star"></iconify-icon>
								À la une
							</span>
						{/if}
						<span class="badge" class:on={item.visible}>
							{item.visible ? 'Visible' : 'Masqué'}
						</span>
					</div>
					<time>{formatDate(item.date)}</time>
					<p>{item.excerpt}</p>
				</div>

				<div class="actions">
					<button
						class="feature"
						class:on={item.featured}
						disabled={busyId === item._id || (!item.visible && !item.featured)}
						title={item.visible ? '' : 'Un article masqué ne peut pas être à la une'}
						onclick={() => toggleFeatured(item)}
					>
						<iconify-icon icon="fa6-{item.featured ? 'solid' : 'regular'}:star"></iconify-icon>
						{item.featured ? 'À la une' : 'Mettre à la une'}
					</button>
					<a class="edit" href="/gestion/actus/editor?id={item._id}">
						<iconify-icon icon="fa6-solid:pen"></iconify-icon>
						Modifier
					</a>
					<button disabled={busyId === item._id} onclick={() => toggleVisible(item)}>
						<iconify-icon icon="fa6-solid:{item.visible ? 'eye-slash' : 'eye'}"></iconify-icon>
						{item.visible ? 'Masquer' : 'Afficher'}
					</button>

					{#if confirmingId === item._id}
						<button class="danger" disabled={busyId === item._id} onclick={() => remove(item)}>
							<iconify-icon icon="fa6-solid:trash"></iconify-icon>
							Confirmer ?
						</button>
						<button onclick={() => (confirmingId = null)}>Annuler</button>
					{:else}
						<button class="danger" onclick={() => (confirmingId = item._id)}>
							<iconify-icon icon="fa6-solid:trash"></iconify-icon>
							Supprimer
						</button>
					{/if}
				</div>
			</div>
		{:else}
			<div class="placeholder" transition:slide={{ easing: expoOut }}>
				Aucun article pour l'instant. Cliquez sur « Nouvel article » pour commencer.
			</div>
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		display: grid;
		gap: 1.5rem;

		.head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;

			.caption {
				color: var(--color-500);
				font-size: 0.9rem;
			}

			.new {
				display: inline-flex;
				align-items: center;
				gap: 0.5rem;
				text-decoration: none;
				padding: 0.6rem 1rem;
				border-radius: 0.5rem;
			}
		}

		.list {
			display: grid;
			gap: 1rem;

			.actu {
				display: grid;
				grid-template-columns: 6rem 1fr auto;
				gap: 1rem;
				align-items: center;

				background: #fff;
				border: 1px solid var(--color-100);
				border-radius: 0.75rem;
				padding: 0.9rem;

				&.hidden {
					opacity: 0.6;
					background: var(--color-50);
				}

				.thumb {
					width: 6rem;
					height: 4.5rem;
					border-radius: 0.5rem;
					background-size: cover;
					background-position: center;
					background-color: var(--color-100);

					&.empty {
						display: flex;
						align-items: center;
						justify-content: center;
						color: var(--color-300);
						font-size: 1.5rem;
					}
				}

				.info {
					min-width: 0;

					.top {
						display: flex;
						align-items: center;
						gap: 0.75rem;

						h3 {
							font-size: 1.15rem;
						}
					}

					time {
						font-size: 0.8rem;
						color: var(--color-400);
					}

					p {
						margin-top: 0.35rem;
						font-size: 0.85rem;
						color: var(--color-600);
						overflow: hidden;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;
					}

					.badge {
						flex-shrink: 0;
						font-size: 0.72rem;
						padding: 0.15rem 0.6rem;
						border-radius: 999px;
						background: var(--color-100);
						color: var(--color-500);

						&.on {
							background: var(--success-100);
							color: var(--on-success-100);
						}

						&.featured {
							display: inline-flex;
							align-items: center;
							gap: 0.3rem;
							background: #fef3c7;
							color: #92660c;
							font-weight: 600;
						}
					}
				}

				.actions {
					display: flex;
					flex-wrap: wrap;
					gap: 0.5rem;
					justify-content: flex-end;

					.feature {
						background: #fff;
						border: 1px solid var(--color-200);
						color: var(--color-600);

						iconify-icon {
							color: #eab308;
						}

						&.on {
							background: #fef3c7;
							border-color: #fcd34d;
							color: #92660c;
						}
					}

					.edit {
						display: inline-flex;
						align-items: center;
						gap: 0.5rem;
						text-decoration: none;

						background: var(--scv-blue);
						color: #fff;
						font-weight: 500;
						padding: 0.5rem 0.75rem;
						border-radius: 0.5rem;
					}
				}
			}

			.placeholder {
				background: var(--color-50);
				padding: 1.5rem;
				text-align: center;
				border-radius: 0.5rem;
				font-style: italic;
				color: var(--color-400);
			}
		}
	}

	@media (max-width: 720px) {
		main {
			.list .actu {
				grid-template-columns: 1fr;

				.thumb {
					width: 100%;
					height: 9rem;
				}

				.actions {
					justify-content: flex-start;
				}
			}
		}
	}
</style>
