<script module>
	import { expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	/**
	 * @typedef {{
	 *  type: string;
	 *  title: string;
	 *  message: string;
	 * }} Snack
	 */

	const state = $state({
		snacks: /** @type {Snack[]} */ ([])
	});

	/**
	 * @type {undefined | ReturnType<typeof setInterval>}
	 */
	let interval;

	/**
	 * @param {Snack} snack
	 */
	function push(snack) {
		state.snacks.push(snack);

		if (interval !== undefined) return;

		interval = setInterval(() => {
			remove(state.snacks[0]);
		}, 4000);
	}

	/**
	 * @param {Snack} snack
	 */
	function remove(snack) {
		const index = state.snacks.indexOf(snack);
		state.snacks.splice(index, 1);

		if (!state.snacks.length) {
			clearInterval(interval);
			interval = undefined;
		}
	}

	export const snacks = {
		/** @param {string} message */
		success(message, title = 'Success!') {
			push({ type: 'success', title, message });
		},
		/** @param {string} message */
		danger(message, title = 'Oops') {
			push({ type: 'danger', title, message });
		}
	};
</script>

{#if state.snacks.length}
	<ul>
		{#each state.snacks as snack (snack)}
			<li transition:slide|global={{ easing: expoOut }} class={snack.type}>
				<div class="title">
					<p>{snack.title}</p>

					<iconify-icon
						role="button"
						tabindex="0"
						onkeydown={(/** @type {KeyboardEvent} */ e) => e.key === 'Enter' && remove(snack)}
						onclick={() => remove(snack)}
						icon="fa6-solid:xmark"
					></iconify-icon>
				</div>
				<p class="message">{snack.message}</p>
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	ul {
		position: fixed;
		bottom: 0;
		right: 0;

		list-style: none;
		padding: 1rem;

		width: 18rem;

		li {
			background-color: white;
			padding: 1rem;
			box-shadow: 0 1rem 3rem -1.5rem var(--color-800);
			border-radius: 0.5rem;

			&:not(:last-child) {
				margin-bottom: 1rem;
			}

			.title {
				margin-bottom: 1rem;
				font-size: 1.25rem;
				font-weight: 800;

				display: flex;
				align-items: flex-start;
				justify-content: space-between;

				iconify-icon {
					cursor: pointer;

					background-color: var(--color-100);
					color: var(--on-color-100);

					width: 1.5rem;
					height: 1.5rem;

					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;

					font-size: 1rem;

					opacity: 0.7;

					transition-property: opacity;

					&:hover {
						opacity: 1;
					}

					&:active {
						opacity: 0.5;
					}
				}
			}
		}
	}
</style>
