<script>
	import { applyAction, deserialize, enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { snacks } from '$lib/components/Snacks.svelte';

	let { data } = $props();

	/**
	 * @param {SubmitEvent & { currentTarget: EventTarget & HTMLFormElement; }} e
	 */
	async function createAccount(e) {
		e.preventDefault();
		const response = await fetch(e.currentTarget.action, {
			method: 'POST',
			body: new FormData(e.currentTarget)
		});

		const result = deserialize(await response.text());

		switch (result.type) {
			case 'success':
				await invalidateAll();
				break;

			case 'error':
				snacks.error(result.error);
				break;

			default:
				console.log(result.type);
				break;
		}
	}

	/**
	 * @param {SubmitEvent & { currentTarget: EventTarget & HTMLFormElement; }} e
	 */
	async function login(e) {
		e.preventDefault();
		const response = await fetch(e.currentTarget.action, {
			method: 'POST',
			body: new FormData(e.currentTarget)
		});

		const result = deserialize(await response.text());

		switch (result.type) {
			case 'success':
				goto('/gestion/messages');
				break;

			case 'error':
				snacks.error(result.error);
				break;

			default:
				console.log(result.type);
				break;
		}
	}
</script>

<main>
	{#if data.first}
		<form method="POST" action="?/create" onsubmit={createAccount}>
			<input type="text" placeholder="Nom d'utilisateur" name="username" />
			<input type="password" placeholder="Mot de passe" name="password" />

			<button type="submit">
				<iconify-icon icon="fa6-solid:paper-plane"></iconify-icon>
				Créer le compte
			</button>
		</form>
	{:else}
		<form method="POST" action="?/login" onsubmit={login}>
			<input type="text" placeholder="Nom d'utilisateur" name="username" />
			<input type="password" placeholder="Mot de passe" name="password" />

			<button type="submit">
				<iconify-icon icon="fa6-solid:paper-plane"></iconify-icon>
				Se connecter
			</button>
		</form>
	{/if}
</main>

<style lang="scss">
	main {
		padding: 4rem;

		display: flex;
		justify-content: center;
		align-items: center;

		height: 100dvh;

		form {
			display: grid;
			gap: 1rem;
		}
	}
</style>
