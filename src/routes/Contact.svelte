<script>
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
		email: '',
		message: '',
		website: ''
	});

	/**
	 * @param {SubmitEvent} e
	 */
	async function submit(e) {
		e.preventDefault();
		submitting = true;
		errors = undefined;

		try {
			await api.action('?/sendEmail', payload);

			payload.firstname = '';
			payload.lastname = '';
			payload.email = '';
			payload.message = '';
			payload.website = '';

			snacks.success('Votre message a bien été envoyé !', 'Merci');
		} catch (error) {
			errors = error;
		} finally {
			submitting = false;
		}
	}
</script>

<h2 class="section-title">
	<iconify-icon icon="fa6-solid:paper-plane"></iconify-icon>
	Contact
</h2>

<p class="intro">Une question&nbsp;? Remplissez le formulaire, on vous répond au plus vite.</p>

<div class="card">
	<form onsubmit={submit}>
		{#if errors}
			<p transition:slide={{ easing: expoOut }} class="details danger">Oops : {errors.message}</p>
		{/if}

		<label class="website" aria-hidden="true">
			Ne pas remplir ce champ
			<input name="website" bind:value={payload.website} tabindex="-1" autocomplete="off" />
		</label>

		<input
			type="text"
			placeholder="Nom"
			name="lastname"
			bind:value={payload.lastname}
			minlength="2"
			maxlength="80"
			autocomplete="family-name"
			required
			disabled={submitting}
		/>

		<input
			type="text"
			placeholder="Prénom"
			name="firstname"
			bind:value={payload.firstname}
			minlength="2"
			maxlength="80"
			autocomplete="given-name"
			required
			disabled={submitting}
		/>

		<input
			type="email"
			placeholder="Votre email"
			name="email"
			bind:value={payload.email}
			maxlength="254"
			autocomplete="email"
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
			minlength="10"
			maxlength="5000"
		></textarea>

		<button class="btn-blue" type="submit" disabled={submitting}>
			<iconify-icon icon="fa6-solid:paper-plane"></iconify-icon>
			Envoyer
		</button>
	</form>
</div>

<style>
	.section-title {
		justify-content: center;
	}

	.intro {
		text-align: center;
		margin-bottom: 2rem;
		opacity: 0.95;
	}

	.card {
		max-width: 42rem;
		margin-inline: auto;

		background: #fff;
		color: var(--color-900);
		border-radius: 1rem;
		padding: 2rem;

		box-shadow: 0 0.6rem 1.8rem rgba(0, 0, 0, 0.2);
	}

	form {
		display: grid;
		gap: 1rem;
		grid-template-areas:
			'details details'
			'lastname firstname'
			'email email'
			'message message'
			'submit submit';
	}

	.details {
		grid-area: details;
	}

	.website {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	[name='firstname'] {
		grid-area: firstname;
	}

	[name='lastname'] {
		grid-area: lastname;
	}

	[name='email'] {
		grid-area: email;
	}

	[name='message'] {
		grid-area: message;
	}

	button[type='submit'] {
		grid-area: submit;
	}

	@media screen and (max-width: 560px) {
		form {
			grid-template-areas:
				'details details'
				'lastname lastname'
				'firstname firstname'
				'email email'
				'message message'
				'submit submit';
		}
	}
</style>
