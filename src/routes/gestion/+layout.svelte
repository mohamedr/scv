<script>
	import { page } from '$app/stores';

	/**
	 * @type {{ data: import("./$types").LayoutData, children: import('svelte').Snippet }}
	 */
	let { data, children } = $props();

	const nav = $derived([
		{ href: '/gestion', icon: 'fa6-solid:gauge-high', label: 'Tableau de bord' },
		{
			href: '/gestion/messages',
			icon: 'fa6-solid:envelope',
			label: 'Messages',
			badge: data.counts?.messagesUnread || 0
		},
		{ href: '/gestion/actus', icon: 'fa6-solid:newspaper', label: 'Actualités' }
	]);

	const titles = {
		'/gestion': 'Tableau de bord',
		'/gestion/messages': 'Messages',
		'/gestion/actus': 'Actualités'
	};

	const path = $derived($page.url.pathname);
	const title = $derived(/** @type {Record<string,string>} */ (titles)[path] ?? 'Gestion');

	// login (déconnecté) et éditeur d'article = plein écran, sans le cadre admin
	const bare = $derived(!data.user || path.startsWith('/gestion/actus/editor'));

	/**
	 * @param {string} href
	 */
	function isActive(href) {
		return href === '/gestion' ? path === '/gestion' : path.startsWith(href);
	}
</script>

{#if bare}
	{@render children()}
{:else}
	<div class="admin">
		<aside class="sidebar">
			<a class="brand" href="/gestion">
				<img src="/scv_logo.jpg" alt="" />
				<span>Administration</span>
			</a>

			<nav>
				{#each nav as item (item.href)}
					<a href={item.href} class:active={isActive(item.href)}>
						<iconify-icon icon={item.icon}></iconify-icon>
						<span>{item.label}</span>
						{#if item.badge}
							<span class="badge">{item.badge}</span>
						{/if}
					</a>
				{/each}
			</nav>
		</aside>

		<div class="main">
			<header class="topbar">
				<h1>{title}</h1>

				<div class="right">
					<a class="ghost" href="/" target="_blank" rel="noopener">
						<iconify-icon icon="fa6-solid:arrow-up-right-from-square"></iconify-icon>
						<span>Voir le site</span>
					</a>
					<form method="POST" action="/gestion/logout">
						<button class="ghost" type="submit" title="Déconnexion">
							<iconify-icon icon="fa6-solid:right-from-bracket"></iconify-icon>
							<span>Déconnexion</span>
						</button>
					</form>
				</div>
			</header>

			<div class="content">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.admin {
		min-height: 100dvh;
		display: grid;
		grid-template-columns: 15.5rem 1fr;
		background: var(--color-50);
	}

	.sidebar {
		position: sticky;
		top: 0;
		align-self: start;
		height: 100dvh;

		display: flex;
		flex-direction: column;
		gap: 1.5rem;

		background: #fff;
		border-right: 1px solid var(--color-100);
		padding: 1.25rem 1rem;

		.brand {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			text-decoration: none;
			color: var(--color-900);
			padding: 0.25rem 0.5rem;

			img {
				width: 2.5rem;
				height: 2.5rem;
				border-radius: 0.5rem;
			}

			span {
				font-weight: 700;
			}
		}

		nav {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;

			a {
				display: flex;
				align-items: center;
				gap: 0.75rem;

				text-decoration: none;
				color: var(--color-600);
				font-weight: 500;

				padding: 0.65rem 0.75rem;
				border-radius: 0.6rem;

				transition:
					background-color 120ms,
					color 120ms;

				iconify-icon {
					font-size: 1.15rem;
				}

				.badge {
					margin-left: auto;
					background: var(--scv-red);
					color: #fff;
					font-size: 0.72rem;
					font-weight: 700;
					min-width: 1.35rem;
					height: 1.35rem;
					padding: 0 0.4rem;
					border-radius: 999px;
					display: inline-flex;
					align-items: center;
					justify-content: center;
				}

				&:hover {
					background: var(--color-50);
					color: var(--color-900);
				}

				&.active {
					background: color-mix(in srgb, var(--scv-blue) 12%, white);
					color: var(--scv-blue);
				}
			}
		}
	}

	.main {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.topbar {
		position: sticky;
		top: 0;
		z-index: 5;

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--color-100);
		padding: 0.85rem 1.75rem;

		h1 {
			font-size: 1.3rem;
		}

		.right {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			form {
				display: contents;
			}
		}

		.ghost {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;

			background: transparent;
			color: var(--color-600);
			text-decoration: none;
			font-weight: 500;
			font-size: 0.9rem;
			padding: 0.5rem 0.75rem;
			border-radius: 0.5rem;

			&:hover {
				background: var(--color-100);
				color: var(--color-900);
			}
		}
	}

	.content {
		padding: 1.75rem;
	}

	@media (max-width: 800px) {
		.admin {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
			height: auto;
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;
			overflow-x: auto;

			.brand span {
				display: none;
			}

			nav {
				flex-direction: row;
				margin-left: auto;

				a span {
					display: none;
				}
			}
		}

		.topbar .ghost span {
			display: none;
		}

		.content {
			padding: 1rem;
		}
	}
</style>
