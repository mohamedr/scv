<script>
	import { invalidateAll } from '$app/navigation';
	import { snacks } from '$lib/components/Snacks.svelte';
	import { api } from '$lib/functions/api';
	import { flip } from 'svelte/animate';
	import { expoOut } from 'svelte/easing';
	import { scale, slide } from 'svelte/transition';

	/**
	 * @type {{
	 *  data: import("./$types").PageData
	 * }}
	 */
	let { data } = $props();

	function mapMessages() {
		return data.messages.map((m) => ({ ...m, isArchiving: false }));
	}

	let hideArchived = $state(true);
	let messages = $state(mapMessages());

	$effect(() => {
		messages = mapMessages();
	});

	const filteredMessages = $derived.by(() => {
		let out = messages.toSorted();

		if (hideArchived) {
			out = out.filter((m) => !m.archived);
		}

		return out;
	});

	/**
	 * @param {typeof messages[number]} message
	 */
	async function archive(message) {
		message.isArchiving = true;

		try {
			await api.action('?/archive', {
				_id: message._id
			});

			await invalidateAll();
		} catch (error) {
			snacks.error(error);
		} finally {
			message.isArchiving = false;
		}
	}
</script>

<main>
	<button onclick={() => (hideArchived = !hideArchived)}>
		<iconify-icon icon="fa6-solid:{hideArchived ? 'eye-slash' : 'eye'}" />
		{hideArchived ? 'Montrer les messages archivés' : 'Cacher les messages archivés'}
	</button>

	<div class="messages">
		{#each filteredMessages as message (message._id)}
			<div
				class="message"
				class:archived={message.archived}
				animate:flip={{ easing: expoOut }}
				transition:scale={{ easing: expoOut }}
			>
				<div class="email">
					<iconify-icon icon="fa6-solid:envelope"></iconify-icon>
					{message.email}
				</div>
				<div class="fullname">{message.firstname} {message.lastname}</div>
				<div class="content">{message.message}</div>

				{#if !message.archived}
					<button class="danger" disabled={message.isArchiving} onclick={() => archive(message)}>
						{#if message.isArchiving}
							<iconify-icon icon="fa6-solid:spinner" class="fa-load"></iconify-icon>
						{:else}
							<iconify-icon icon="fa6-solid:box-archive"></iconify-icon>
							Archiver
						{/if}
					</button>
				{/if}
			</div>
		{:else}
			<div class="placeholder" transition:slide={{ easing: expoOut }}>aucun nouveau message</div>
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		padding: 4rem;

		display: grid;
		gap: 1rem;

		.messages {
			.message {
				position: relative;

				margin-bottom: 1rem;

				background-color: white;
				border-radius: 0.5rem;
				padding: 1rem;

				border: 1px solid var(--color-100);

				button {
					position: absolute;
					top: 0;
					right: 0;

					translate: 0.75rem -35%;
				}

				&.archived {
					background-color: var(--color-50);
					opacity: 0.75;
				}

				.fullname {
					font-size: 1.2rem;
					opacity: 0.7;
				}
				.email {
					opacity: 0.7;

					display: flex;
					align-items: center;
					gap: 0.25rem;

					font-size: 0.85rem;
					font-style: italic;
				}

				.content {
					margin-top: 1rem;
					font-size: 0.9rem;
				}
			}

			.placeholder {
				background-color: var(--color-50);
				padding: 1rem;
				text-align: center;
				border-radius: 0.5rem;
				font-style: italic;
				color: var(--color-400);
			}
		}
	}
</style>
