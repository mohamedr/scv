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

	async function save() {
		if (saving) return;

		if (title.trim().length < 3) {
			snacks.error('Le titre doit faire au moins 3 caractères.');
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
		<input class="title" placeholder="Titre de l'article" bind:value={title} />
		<RichEditor bind:value={content} />
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

		.title {
			border: none;
			background: transparent;
			padding: 0.5rem 0;

			font-size: clamp(1.6rem, 4vw, 2.2rem);
			font-weight: 700;
			color: var(--color-900);

			&:focus {
				outline: none;
			}

			&::placeholder {
				color: var(--color-300);
			}
		}
	}
</style>
