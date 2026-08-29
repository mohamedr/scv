<script>
	import { goto } from '$app/navigation';
	import { api } from '$lib/functions/api';
	import { snacks } from '$lib/components/Snacks.svelte';
	import RichEditor from '$lib/components/RichEditor.svelte';

	/**
	 * @type {{ data: import("./$types").PageData }}
	 */
	let { data } = $props();

	const isEdit = !!data.article;

	let title = $state(data.article?.title ?? '');
	let content = $state(data.article?.content ?? '');
	let visible = $state(data.article?.visible ?? true);
	let saving = $state(false);
	let titleInvalid = $state(false);
	let contentInvalid = $state(false);

	/** @type {HTMLInputElement} */
	let titleInput;

	/** @param {string} html */
	function hasArticleContent(html) {
		const parsed = new DOMParser().parseFromString(html, 'text/html');
		return (
			(parsed.body.textContent?.trim().length ?? 0) >= 3 || parsed.querySelector('img') !== null
		);
	}

	async function save() {
		if (saving) return;

		const cleanTitle = title.trim();
		if (cleanTitle.length < 3 || cleanTitle.length > 160) {
			titleInvalid = true;
			titleInput.focus();
			snacks.error(
				cleanTitle.length < 3
					? 'Le titre doit faire au moins 3 caractères.'
					: 'Le titre ne peut pas dépasser 160 caractères.'
			);
			return;
		}

		if (!hasArticleContent(content)) {
			contentInvalid = true;
			document
				.querySelector('.rich .area')
				?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			snacks.error('Ajoutez du texte ou une image dans le contenu de l’article.');
			return;
		}

		saving = true;
		try {
			await api.action('?/save', {
				id: data.article?._id ?? '',
				title,
				content,
				visible: String(visible)
			});
			await goto('/gestion/actus');
		} catch (error) {
			snacks.error(error);
		} finally {
			saving = false;
		}
	}
</script>

<div class="editor">
	<header class="bar">
		<a class="cancel" href="/gestion/actus">
			<iconify-icon icon="fa6-solid:arrow-left"></iconify-icon>
			Annuler
		</a>

		<div class="right">
			<label class="vis">
				<input type="checkbox" bind:checked={visible} />
				<iconify-icon icon="fa6-solid:{visible ? 'eye' : 'eye-slash'}"></iconify-icon>
				{visible ? 'Visible' : 'Masqué'}
			</label>

			<button class="btn-primary" disabled={saving} onclick={save}>
				{#if saving}
					<iconify-icon icon="fa6-solid:spinner" class="fa-load"></iconify-icon>
				{:else}
					<iconify-icon icon="fa6-solid:check"></iconify-icon>
				{/if}
				{isEdit ? 'Enregistrer' : 'Publier'}
			</button>
		</div>
	</header>

	<div class="canvas">
		<div class="title-field">
			<label for="article-title">Titre de l’article</label>
			<input
				id="article-title"
				class="title"
				class:invalid={titleInvalid}
				placeholder="Ex. Le SCV au Forum des associations !"
				maxlength="160"
				bind:this={titleInput}
				bind:value={title}
				aria-invalid={titleInvalid}
				aria-describedby={titleInvalid ? 'title-error' : undefined}
				oninput={() => {
					if (title.trim().length >= 3 && title.trim().length <= 160) titleInvalid = false;
				}}
			/>
			{#if titleInvalid}
				<p id="title-error" class="title-error">
					Le titre doit contenir entre 3 et 160 caractères.
				</p>
			{/if}
		</div>
		<RichEditor bind:value={content} bind:invalid={contentInvalid} />
	</div>
</div>

<style lang="scss">
	.editor {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		background: var(--color-50);
	}

	.bar {
		position: sticky;
		top: 0;
		z-index: 10;

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;

		padding: 0.75rem 1.25rem;
		background: #fff;
		border-bottom: 1px solid var(--color-100);

		.cancel {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
			text-decoration: none;
			color: var(--color-600);
			font-weight: 500;

			&:hover {
				color: var(--color-900);
			}
		}

		.right {
			display: flex;
			align-items: center;
			gap: 1rem;
		}

		.vis {
			display: inline-flex;
			align-items: center;
			gap: 0.4rem;
			cursor: pointer;
			font-size: 0.9rem;
			color: var(--color-700);
			user-select: none;
		}
	}

	.canvas {
		flex: 1;
		width: min(100% - 2rem, 52rem);
		margin-inline: auto;

		padding-block: clamp(1.5rem, 4vw, 2.5rem);

		display: flex;
		flex-direction: column;
		gap: 1rem;

		.title-field {
			display: grid;
			gap: 0.25rem;

			label {
				font-size: 0.8rem;
				font-weight: 700;
				color: var(--color-500);
			}

			.title {
				border: none;
				border-bottom: 2px solid transparent;
				border-radius: 0;
				background: transparent;
				padding: 0.5rem 0;

				font-size: clamp(1.6rem, 4vw, 2.2rem);
				font-weight: 700;
				color: var(--color-900);

				&:focus {
					outline: none;
				}

				&.invalid {
					border-bottom-color: var(--scv-red);
				}

				&::placeholder {
					color: var(--color-300);
				}
			}

			.title-error {
				color: var(--scv-red);
				font-size: 0.82rem;
				font-weight: 600;
			}
		}
	}
</style>
