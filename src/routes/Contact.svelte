<script>
	import { dev } from '$app/environment';
	import { snacks } from '$lib/components/Snacks.svelte';
	import { api } from '$lib/functions/api';
	import { expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	/**
	 * @type {any}
	 */
	let errors = $state(undefined);

	let submitting = $state(false);
	let payload = $state({
		firstname: '',
		lastname: '',
		subject: '',
		message: ''
	});

	/**
	 * @param {SubmitEvent} e
	 */
	async function submit(e) {
		e.preventDefault();
		submitting = true;

		try {
			const response = await api.action('?/sendEmail', payload);

			// success
			console.log(response);
			snacks.success('Ayoooo');
		} catch (error) {
			errors = error;
		} finally {
			submitting = false;
		}
	}
</script>

<div class="container">
	<h1>Contact</h1>

	<p>Bla bla bla lorem lorem et tout</p>

	<form onsubmit={submit}>
		{#if errors}
			<p transition:slide={{ easing: expoOut }} class="details danger">Oops : {errors.message}</p>
		{/if}

		<input
			type="text"
			placeholder="Nom"
			name="lastname"
			bind:value={payload.lastname}
			required
			disabled={submitting}
		/>

		<input
			type="text"
			placeholder="Prénom"
			name="firstname"
			bind:value={payload.firstname}
			required
			disabled={submitting}
		/>

		<input
			type="text"
			placeholder="Sujet"
			name="subject"
			bind:value={payload.subject}
			required
			disabled={submitting}
		/>

		<textarea
			rows="8"
			placeholder="Écrivez votre message ici"
			name="message"
			required
			disabled={submitting}
			bind:value={payload.message}
		></textarea>

		<button type="submit" disabled={submitting}>
			<iconify-icon icon="fa6-solid:paper-plane"></iconify-icon>
			Envoyer
		</button>
	</form>
</div>

<style>
	h1 {
		margin-bottom: 0.5rem;
	}

	.container {
		padding: 2rem;

		> p {
			margin-bottom: 1rem;
		}
	}

	form {
		display: grid;
		gap: 1rem;
		grid-template-areas:
			'details details'
			'lastname firstname'
			'subject subject'
			'message message'
			'submit submit';
	}

	.details {
		grid-area: details;
	}

	[name='firstname'] {
		grid-area: firstname;
	}

	[name='lastname'] {
		grid-area: lastname;
	}

	[name='subject'] {
		grid-area: subject;
	}

	[name='message'] {
		grid-area: message;
	}

	button[type='submit'] {
		grid-area: submit;
	}

	@media screen and (min-width: 768px) {
		.container {
			padding-inline: 20vw;
		}
	}
</style>
