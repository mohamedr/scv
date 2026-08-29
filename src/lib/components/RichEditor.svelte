<script>
	import { onMount } from 'svelte';

	let { value = $bindable(''), invalid = $bindable(false) } = $props();

	/** @type {HTMLDivElement} */
	let editor;
	/** @type {HTMLInputElement} */
	let fileInput;

	let dragging = $state(false);

	onMount(() => {
		if (editor && value) editor.innerHTML = value;
	});

	function sync() {
		value = editor.innerHTML;
		if (editor.textContent?.trim() || editor.querySelector('img')) invalid = false;
	}

	/**
	 * @param {string} command
	 * @param {string} [arg]
	 */
	function cmd(command, arg) {
		editor.focus();
		document.execCommand(command, false, arg);
		sync();
	}

	/**
	 * Redimensionne une image côté client puis renvoie un data-URI base64.
	 * @param {File} file
	 */
	async function resizeToDataURL(file, maxW = 1400, quality = 0.82) {
		const url = URL.createObjectURL(file);
		try {
			/** @type {HTMLImageElement} */
			const img = await new Promise((resolve, reject) => {
				const i = new Image();
				i.onload = () => resolve(i);
				i.onerror = reject;
				i.src = url;
			});

			const scale = Math.min(1, maxW / img.width);
			const w = Math.round(img.width * scale);
			const h = Math.round(img.height * scale);

			const canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;
			canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);

			return canvas.toDataURL('image/jpeg', quality);
		} finally {
			URL.revokeObjectURL(url);
		}
	}

	/**
	 * @param {File | undefined | null} file
	 */
	async function insertImage(file) {
		if (!file || !file.type.startsWith('image/')) return;
		const dataUrl = await resizeToDataURL(file);
		editor.focus();
		document.execCommand('insertImage', false, dataUrl);
		sync();
	}

	/**
	 * @param {Event} e
	 */
	async function onFileChange(e) {
		const input = /** @type {HTMLInputElement} */ (e.currentTarget);
		await insertImage(input.files?.[0]);
		input.value = '';
	}

	/**
	 * @param {ClipboardEvent} e
	 */
	async function onPaste(e) {
		const items = e.clipboardData?.items;
		if (!items) return;
		for (const item of items) {
			if (item.type.startsWith('image/')) {
				e.preventDefault();
				await insertImage(item.getAsFile());
				return;
			}
		}
	}

	/**
	 * @param {DragEvent} e
	 */
	async function onDrop(e) {
		e.preventDefault();
		dragging = false;
		await insertImage(e.dataTransfer?.files?.[0]);
	}

	/** @param {MouseEvent} e */
	function keepFocus(e) {
		// évite que le bouton vole la sélection dans l'éditeur
		e.preventDefault();
	}
</script>

<div class="rich" class:invalid>
	<div class="toolbar">
		<button
			type="button"
			title="Titre"
			aria-label="Titre"
			onmousedown={keepFocus}
			onclick={() => cmd('formatBlock', 'H2')}
		>
			<iconify-icon icon="fa6-solid:heading"></iconify-icon>
		</button>
		<button
			type="button"
			title="Paragraphe"
			aria-label="Paragraphe"
			onmousedown={keepFocus}
			onclick={() => cmd('formatBlock', 'P')}
		>
			<iconify-icon icon="fa6-solid:paragraph"></iconify-icon>
		</button>
		<span class="sep"></span>
		<button
			type="button"
			title="Gras"
			aria-label="Gras"
			onmousedown={keepFocus}
			onclick={() => cmd('bold')}
		>
			<iconify-icon icon="fa6-solid:bold"></iconify-icon>
		</button>
		<button
			type="button"
			title="Italique"
			aria-label="Italique"
			onmousedown={keepFocus}
			onclick={() => cmd('italic')}
		>
			<iconify-icon icon="fa6-solid:italic"></iconify-icon>
		</button>
		<button
			type="button"
			title="Liste à puces"
			aria-label="Liste à puces"
			onmousedown={keepFocus}
			onclick={() => cmd('insertUnorderedList')}
		>
			<iconify-icon icon="fa6-solid:list-ul"></iconify-icon>
		</button>
		<span class="sep"></span>
		<button
			type="button"
			class="img-btn"
			title="Insérer une image"
			onmousedown={keepFocus}
			onclick={() => fileInput.click()}
		>
			<iconify-icon icon="fa6-solid:image"></iconify-icon>
			Image
		</button>
	</div>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="area"
		class:dragging
		bind:this={editor}
		contenteditable="true"
		data-placeholder="Rédigez votre article ici… (vous pouvez coller ou glisser des images)"
		aria-invalid={invalid}
		aria-describedby={invalid ? 'content-error' : undefined}
		oninput={sync}
		onpaste={onPaste}
		ondragover={(e) => {
			e.preventDefault();
			dragging = true;
		}}
		ondragleave={() => (dragging = false)}
		ondrop={onDrop}
	></div>

	{#if invalid}
		<p id="content-error" class="content-error">Ajoutez du texte ou une image à l’article.</p>
	{/if}

	<input bind:this={fileInput} type="file" accept="image/*" onchange={onFileChange} hidden />
</div>

<style lang="scss">
	.rich {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--color-200);
		border-radius: 0.75rem;
		overflow: hidden;
		background: #fff;

		&.invalid {
			border-color: var(--scv-red);
			box-shadow: 0 0 0 1px var(--scv-red);
		}
	}

	.content-error {
		padding: 0.75rem 1.25rem;
		color: var(--scv-red);
		font-size: 0.82rem;
		font-weight: 600;
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex-wrap: wrap;

		padding: 0.5rem;
		border-bottom: 1px solid var(--color-100);
		background: var(--color-50);

		button {
			background: transparent;
			color: var(--color-700);
			padding: 0.4rem 0.55rem;
			border-radius: 0.4rem;

			&:hover {
				background: var(--color-100);
			}

			&.img-btn {
				font-weight: 600;
				color: var(--scv-blue);
			}
		}

		.sep {
			width: 1px;
			align-self: stretch;
			background: var(--color-200);
			margin: 0.15rem 0.35rem;
		}
	}

	.area {
		min-height: 24rem;
		padding: 1.25rem 1.5rem;
		outline: none;

		font-size: 1.02rem;
		line-height: 1.65;
		color: var(--color-900);

		overflow-y: auto;

		&.dragging {
			background: color-mix(in srgb, var(--scv-blue) 8%, white);
			box-shadow: inset 0 0 0 2px var(--scv-blue);
		}

		&:empty::before {
			content: attr(data-placeholder);
			color: var(--color-300);
		}

		:global(h2) {
			font-size: 1.5rem;
			margin: 1rem 0 0.5rem;
		}
		:global(p) {
			margin: 0 0 0.75rem;
		}
		:global(ul) {
			list-style: disc;
			margin: 0 0 0.75rem 1.25rem;
		}
		:global(img) {
			max-width: 100%;
			height: auto;
			border-radius: 0.5rem;
			margin: 0.75rem 0;
		}
	}
</style>
