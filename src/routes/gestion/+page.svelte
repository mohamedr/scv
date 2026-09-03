<script>
	import { invalidateAll } from '$app/navigation';
	import { snacks } from '$lib/components/Snacks.svelte';
	import { api } from '$lib/functions/api';

	/**
	 * @type {{ data: import("./$types").PageData }}
	 */
	let { data } = $props();

	/**
	 * @param {SubmitEvent & { currentTarget: EventTarget & HTMLFormElement; }} e
	 */
	async function submitForm(e) {
		e.preventDefault();
		const form = e.currentTarget;
		const button = form.querySelector('button[type="submit"]');
		button?.setAttribute('disabled', '');

		try {
			const payload = Object.fromEntries(new FormData(form));
			await api.action(form.action, payload);
			await invalidateAll();
		} catch (error) {
			snacks.error(error);
		} finally {
			button?.removeAttribute('disabled');
		}
	}

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

{#if !data.user}
	<!-- ============ Connexion ============ -->
	<div class="auth">
		<div class="card">
			<img class="logo" src="/scv_logo.jpg" alt="Sambo Club Védasien" />
			<h1>{data.first ? 'Créer le compte admin' : 'Espace gestion'}</h1>
			<p class="sub">
				{data.first
					? 'Premier accès : créez le compte administrateur du club.'
					: 'Connectez-vous pour gérer le site.'}
			</p>

			<form method="POST" action={data.first ? '?/create' : '?/login'} onsubmit={submitForm}>
				<label>
					<span>Nom d'utilisateur</span>
					<input
						type="text"
						name="username"
						placeholder="admin"
						autocomplete="username"
						minlength={data.first ? 4 : undefined}
						maxlength="80"
						required
					/>
				</label>
				<label>
					<span>Mot de passe</span>
					<input
						type="password"
						name="password"
						placeholder="••••••••"
						autocomplete={data.first ? 'new-password' : 'current-password'}
						minlength={data.first ? 10 : undefined}
						maxlength="200"
						required
					/>
				</label>

				<button class="btn-primary" type="submit">
					<iconify-icon icon="fa6-solid:{data.first ? 'user-plus' : 'right-to-bracket'}"
					></iconify-icon>
					{data.first ? 'Créer le compte' : 'Se connecter'}
				</button>
			</form>

			<a class="back" href="/">← Retour au site</a>
		</div>
	</div>
{:else}
	<!-- ============ Tableau de bord ============ -->
	<div class="dash">
		<div class="stats">
			<div class="stat">
				<div class="ico blue"><iconify-icon icon="fa6-solid:envelope"></iconify-icon></div>
				<div class="num">{data.counts?.messagesUnread ?? 0}</div>
				<div class="lbl">Messages non lus</div>
			</div>
			<div class="stat">
				<div class="ico red"><iconify-icon icon="fa6-solid:newspaper"></iconify-icon></div>
				<div class="num">{data.counts?.articlesVisible ?? 0}</div>
				<div class="lbl">Articles publiés</div>
			</div>
			<div class="stat">
				<div class="ico cyan"><iconify-icon icon="fa6-solid:layer-group"></iconify-icon></div>
				<div class="num">{data.counts?.articles ?? 0}</div>
				<div class="lbl">Articles au total</div>
			</div>
		</div>

		<div class="actions">
			<a class="btn-primary" href="/gestion/actus/editor">
				<iconify-icon icon="fa6-solid:plus"></iconify-icon>
				Nouvel article
			</a>
			<a class="btn-ghost" href="/gestion/messages">
				<iconify-icon icon="fa6-solid:envelope-open-text"></iconify-icon>
				Voir les messages
			</a>
		</div>

		<div class="grid">
			<section class="panel">
				<header>
					<h2><iconify-icon icon="fa6-solid:envelope"></iconify-icon> Messages récents</h2>
					<a href="/gestion/messages">Tout voir</a>
				</header>
				{#each data.recentMessages ?? [] as m (m._id)}
					<div class="row">
						<div class="row-head">
							<div class="who">{m.firstname} {m.lastname}</div>
							<time datetime={new Date(m.date).toISOString()}>{formatDate(m.date)}</time>
						</div>
						<div class="excerpt">{m.message}</div>
					</div>
				{:else}
					<p class="empty">Aucun message non lu.</p>
				{/each}
			</section>

			<section class="panel">
				<header>
					<h2><iconify-icon icon="fa6-solid:newspaper"></iconify-icon> Derniers articles</h2>
					<a href="/gestion/actus">Tout voir</a>
				</header>
				{#each data.recentArticles ?? [] as a (a._id)}
					<a class="row link" href="/gestion/actus/editor?id={a._id}">
						<div class="who">
							{a.title}
							{#if !a.visible}<span class="tag">masqué</span>{/if}
						</div>
						<div class="excerpt">{formatDate(a.date)}</div>
					</a>
				{:else}
					<p class="empty">Aucun article pour l'instant.</p>
				{/each}
			</section>
		</div>
	</div>
{/if}

<style lang="scss">
	/* ---------- Connexion ---------- */
	.auth {
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;

		background: linear-gradient(135deg, var(--scv-red), var(--scv-blue));
	}

	.card {
		width: min(100%, 24rem);
		background: #fff;
		border-radius: 1.25rem;
		padding: 2.25rem;
		box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.25);

		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		.logo {
			width: 4rem;
			height: 4rem;
			border-radius: 0.75rem;
			margin-bottom: 0.5rem;
		}

		h1 {
			font-size: 1.4rem;
		}

		.sub {
			color: var(--color-500);
			font-size: 0.9rem;
			margin-bottom: 1rem;
		}

		form {
			display: grid;
			gap: 0.9rem;

			label {
				display: grid;
				gap: 0.35rem;

				span {
					font-size: 0.82rem;
					font-weight: 600;
					color: var(--color-700);
				}
			}

			button {
				margin-top: 0.5rem;
				padding: 0.7rem;
			}
		}

		.back {
			margin-top: 1rem;
			text-align: center;
			color: var(--color-500);
			text-decoration: none;
			font-size: 0.85rem;

			&:hover {
				color: var(--color-800);
			}
		}
	}

	/* ---------- Tableau de bord ---------- */
	.dash {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		gap: 1rem;

		.stat {
			background: #fff;
			border: 1px solid var(--color-100);
			border-radius: 1rem;
			padding: 1.25rem;

			.ico {
				width: 2.75rem;
				height: 2.75rem;
				border-radius: 0.75rem;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 1.25rem;
				color: #fff;
				margin-bottom: 0.75rem;

				&.blue {
					background: var(--scv-blue);
				}
				&.red {
					background: var(--scv-red);
				}
				&.cyan {
					background: var(--scv-cyan);
				}
			}

			.num {
				font-size: 2rem;
				font-weight: 700;
				line-height: 1;
			}

			.lbl {
				color: var(--color-500);
				font-size: 0.9rem;
				margin-top: 0.35rem;
			}
		}
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;

		a {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
			text-decoration: none;
			padding: 0.7rem 1.1rem;
			border-radius: 0.6rem;
			font-weight: 600;
		}

		.btn-ghost {
			background: #fff;
			border: 1px solid var(--color-200);
			color: var(--color-700);

			&:hover {
				background: var(--color-50);
			}
		}
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
		gap: 1rem;
	}

	.panel {
		background: #fff;
		border: 1px solid var(--color-100);
		border-radius: 1rem;
		padding: 1.25rem;

		header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 0.75rem;

			h2 {
				font-size: 1.05rem;
				display: flex;
				align-items: center;
				gap: 0.5rem;

				iconify-icon {
					color: var(--color-400);
				}
			}

			a {
				font-size: 0.85rem;
				color: var(--scv-blue);
				text-decoration: none;
			}
		}

		.row {
			display: block;
			padding: 0.65rem 0;
			border-top: 1px solid var(--color-100);
			text-decoration: none;
			color: inherit;

			.row-head {
				display: flex;
				align-items: baseline;
				justify-content: space-between;
				gap: 0.75rem;

				time {
					flex-shrink: 0;
					color: var(--color-400);
					font-size: 0.75rem;
				}
			}

			.who {
				font-weight: 600;
				font-size: 0.95rem;
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}

			.excerpt {
				color: var(--color-500);
				font-size: 0.85rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.tag {
				font-size: 0.68rem;
				text-transform: uppercase;
				letter-spacing: 0.03em;
				background: var(--color-100);
				color: var(--color-500);
				padding: 0.1rem 0.45rem;
				border-radius: 999px;
			}

			&.link:hover .who {
				color: var(--scv-blue);
			}
		}

		.empty {
			color: var(--color-400);
			font-style: italic;
			font-size: 0.9rem;
			padding: 0.5rem 0;
		}
	}
</style>
